/**
 * IndexNow — avisa Bing/Yandex que as páginas foram atualizadas.
 * Uso: node scripts/indexnow.js [arquivo-de-sitemap]
 *
 * Requer a chave em INDEXNOW_KEY (gere uma com: openssl rand -hex 16).
 * A chave é publicada em public/<chave>.txt, que o IndexNow usa para
 * verificar que a requisição é legítima.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'public');
const sitemapPath = process.argv[2] || path.join(OUT, 'sitemap.xml');

const KEY = process.env.INDEXNOW_KEY || fs.existsSync(path.join(ROOT, '.indexnow-key'))
  ? process.env.INDEXNOW_KEY || fs.readFileSync(path.join(ROOT, '.indexnow-key'), 'utf8').trim()
  : null;

if (!KEY) {
  console.log('  IndexNow: nenhuma chave configurada (INDEXNOW_KEY ou .indexnow-key). Pulando.');
  process.exit(0);
}

if (!fs.existsSync(sitemapPath)) {
  console.error(`Sitemap não encontrado: ${sitemapPath}. Rode o build antes.`);
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());

// Publica a chave de verificação na raiz do site.
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, `${KEY}.txt`), KEY);

const host = new URL(urls[0]).host;
const endpoint = `https://api.indexnow.org/indexnow`;

async function submit(batch) {
  const body = {
    host,
    key: KEY,
    keyLocation: `${new URL(urls[0]).origin}/${KEY}.txt`,
    urlList: batch,
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return res;
}

let sent = 0;
let failed = 0;
for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  try {
    const res = await submit(batch);
    if (res.ok) {
      sent += batch.length;
      console.log(`  IndexNow: ${batch.length} URLs aceitos (${res.status})`);
    } else {
      failed += batch.length;
      console.error(`  IndexNow: erro ${res.status} — ${await res.text()}`);
    }
  } catch (e) {
    failed += batch.length;
    console.error(`  IndexNow: falha de rede — ${e.message}`);
  }
}

console.log(`\n  IndexNow concluído: ${sent} enviados, ${failed} falhas.`);
console.log(`  Chave publicada em ${host}/${KEY}.txt\n`);
