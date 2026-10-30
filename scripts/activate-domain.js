/**
 * Espera o DNS de yooka.online propagar e, assim que o site responder, faz a
 * virada de domínio: atualiza a URL canônica (env SITE_URL na Vercel),
 * rebuilda, redeploya e transforma yooka.loyfus.com.br em redirecionamento.
 *
 * Uso: node scripts/activate-domain.js [minutos-de-espera]
 */
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DOMAIN = process.env.TARGET_DOMAIN || 'yooka.online';
const WAIT_MIN = Number(process.argv[2] || 180);
const POLL_S = 20;

const projectJson = path.join(ROOT, '.vercel', 'project.json');
if (!fs.existsSync(projectJson)) {
  console.error('Projeto Vercel não vinculado. Rode: vercel link');
  process.exit(1);
}
const { projectId, orgId } = JSON.parse(fs.readFileSync(projectJson, 'utf8'));

const authPath = path.join(process.env.HOME, '.local/share/com.vercel.cli/auth.json');
const token = JSON.parse(fs.readFileSync(authPath, 'utf8')).token;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolveA(host) {
  try {
    const r = await dns.resolve4(host);
    return r;
  } catch {
    return [];
  }
}

async function siteReady() {
  const ips = await resolveA(DOMAIN);
  if (!ips.length) return { ok: false, why: 'sem registro A' };
  try {
    const res = await fetch(`https://${DOMAIN}/`, { redirect: 'follow' });
    const html = await res.text();
    if (res.status !== 200) return { ok: false, why: `HTTP ${res.status}` };
    if (!html.includes('Yooka — IA e automação')) return { ok: false, why: 'HTML não é o da Yooka' };
    return { ok: true, ips };
  } catch (e) {
    return { ok: false, why: e.message };
  }
}

async function setEnv(value) {
  const list = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env?teamId=${orgId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  const existing = (list.envs || []).find((e) => e.key === 'SITE_URL');
  if (existing) {
    await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}?teamId=${orgId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  } else {
    await fetch(`https://api.vercel.com/v9/projects/${projectId}/env?teamId=${orgId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'SITE_URL', value, type: 'plain', target: ['production'] }),
    });
  }
}

/** Redireciona o domínio antigo para o novo com 308 (preserva o SEO). */
async function redirectOldDomain() {
  const domains = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains?teamId=${orgId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  const old = (domains.domains || []).find((d) => d.name === 'yooka.loyfus.com.br');
  if (!old) return 'domínio antigo não está no projeto';
  if (old.redirect) return 'já redirecionado';

  const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains/${old.name}?teamId=${orgId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ redirect: { domain: DOMAIN, statusCode: 308 } }),
  });
  return res.ok ? 'redirecionamento 308 configurado' : `falhou: ${res.status}`;
}

console.log(`\n  Aguardando ${DOMAIN} resolver (até ${WAIT_MIN} min)...`);
console.log(`  Dica: no Cloudflare, adicione A @ → 76.76.21.21 (ou CNAME @ → cname.vercel-dns.com)\n`);

const deadline = Date.now() + WAIT_MIN * 60 * 1000;
let ready = false;

while (Date.now() < deadline) {
  const status = await siteReady();
  if (status.ok) {
    ready = true;
    console.log(`  DNS resolvido: ${status.ips.join(', ')} — site respondendo em 200.`);
    break;
  }
  console.log(`  … ${DOMAIN}: ${status.why}. tentando de novo em ${POLL_S}s.`);
  await sleep(POLL_S * 1000);
}

if (!ready) {
  console.log(`\n  ${DOMAIN} ainda não resolveu dentro do prazo. O site continua em https://yooka.loyfus.com.br.`);
  console.log('  Rode novamente: node scripts/activate-domain.js 240\n');
  process.exit(2);
}

console.log('\n  Ativando o domínio…');
await setEnv(`https://${DOMAIN}`);
console.log('  env SITE_URL atualizado na Vercel.');

const msg = await redirectOldDomain();
console.log(`  ${msg}.`);

console.log('\n  Rebuild local e deploy…');
execFileSync('node', ['build.js'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, SITE_URL: `https://${DOMAIN}` } });
execFileSync('npx', ['vercel', 'deploy', '--prod', '--yes'], { cwd: ROOT, stdio: 'inherit' });

console.log(`\n  Pronto. O site agora responde em https://${DOMAIN}\n`);
