/**
 * Confere se os links externos do diretório de atalhos ainda respondem.
 * Uso: node scripts/check-external-links.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/atalhos.json'), 'utf8'));

const urls = [...new Set(data.groups.flatMap((g) => g.links.map((l) => l.url)))];

// Portais oficiais que bloqueiam requisições de datacenter (bloqueiam o CI,
// mas respondem normalmente para o leitor). Não contam como erro.
const BLOQUEADOS = ['mapas.inss.gov.br', 'carteiradigital.trabalho.gov.br', 'cnes.mec.gov.br', 'caixa.gov.br'];

let ok = 0;
const problems = [];

for (const url of urls) {
  let status = 0;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YookaBot/1.0; +https://yooka.online)' },
    });
    clearTimeout(t);
    status = res.status;
  } catch (e) {
    status = 0;
  }
  if (status >= 200 && status < 400) {
    ok++;
    console.log(`  ok   ${status}  ${url}`);
  } else if (status === 0 && BLOQUEADOS.some((h) => url.includes(h))) {
    ok++;
    console.log(`  ok   (bloqueia CI)  ${url}`);
  } else {
    problems.push({ url, status });
    console.log(`  ERRO ${status || 'sem resposta'}  ${url}`);
  }
}

console.log(`\n  ${ok}/${urls.length} links respondem.`);
if (problems.length) {
  console.log('  Revisar:', problems.map((p) => p.url).join(', '));
  process.exitCode = 1;
}
