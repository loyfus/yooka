/**
 * Gera as imagens Open Graph (1200x630) de cada página, usando o Chrome headless.
 * O build grava public/og-manifest.json; este script lê o manifesto e renderiza.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'public');
const manifestPath = path.join(OUT, 'og-manifest.json');
// As imagens ficam versionadas em /og e são copiadas para /public/assets/og no build.
// Assim o build na Vercel (sem Chrome) é rápido e as OG continuam existindo.
const ogDir = path.join(ROOT, 'og');
const tmpDir = path.join(ROOT, '.og-tmp');

if (!fs.existsSync(manifestPath)) {
  console.error('og-manifest.json não encontrado — rode o build antes.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
fs.mkdirSync(ogDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const html = (item) => `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'Inter'; src: local('DejaVu Sans'); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 1200px; height: 630px; overflow: hidden;
         font-family: 'DejaVu Sans', 'Liberation Sans', Arial, sans-serif;
         background: radial-gradient(1200px 700px at 85% -10%, #1b2742 0%, #0b1020 55%, #070a14 100%);
         color: #fff; display: flex; flex-direction: column; padding: 70px 76px; }
  .brand { display: flex; align-items: center; gap: 16px; margin-bottom: 44px; }
  .brand svg { width: 58px; height: 58px; }
  .brand span { font-size: 34px; font-weight: 800; letter-spacing: -1px; }
  .brand .dot { width: 12px; height: 12px; border-radius: 50%; background: #6ee7b7; }
  .badge { display: inline-block; align-self: flex-start; background: rgba(110,231,183,.14);
           color: #6ee7b7; border: 1px solid rgba(110,231,183,.35); border-radius: 999px;
           padding: 9px 20px; font-size: 21px; font-weight: 700; letter-spacing: .3px; margin-bottom: 26px; }
  h1 { font-size: 62px; line-height: 1.09; font-weight: 800; letter-spacing: -2px; max-width: 1010px; }
  .sub { margin-top: 22px; font-size: 27px; line-height: 1.4; color: #a9b6cc; max-width: 900px; }
  .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; }
  .rule { flex: 1; height: 1px; background: rgba(255,255,255,.14); margin: 0 26px 9px; }
  .tag { font-size: 22px; color: #8494ad; font-weight: 600; }
  .brand2 { font-size: 22px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 12px; }
</style></head>
<body>
  <div class="brand">
    <svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="rgba(255,255,255,.08)"/>
      <path d="M17 17 L32 34 L47 17" fill="none" stroke="#6ee7b7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 34 L32 49" fill="none" stroke="#6ee7b7" stroke-width="6" stroke-linecap="round"/></svg>
    <span>Yooka</span><span class="dot"></span>
    <span style="font-size:24px;color:#8494ad;font-weight:600;">yooka.com.br</span>
  </div>
  ${item.badge ? `<div class="badge">${esc(item.badge)}</div>` : ''}
  <h1>${esc(item.title)}</h1>
  ${item.subtitle ? `<p class="sub">${esc(item.subtitle)}</p>` : ''}
  <div class="foot">
    <span class="tag">${esc(item.footer || 'IA e automação para empresas')}</span>
    <span class="rule"></span>
    <span class="brand2">yooka.com.br</span>
  </div>
</body></html>`;

const chrome =
  ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].find((p) => fs.existsSync(p));

if (!chrome) {
  console.log('  OG: Chrome não encontrado — imagens mantidas da versão anterior (pule com: npm run og)');
  process.exit(0);
}

const JPEG_CONVERT = `
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
im.save(dst, 'JPEG', quality=86, optimize=True, progressive=True)
`;

let ok = 0;
let fail = 0;

for (const item of manifest) {
  const htmlPath = path.join(tmpDir, 'card.html');
  const pngPath = path.join(tmpDir, 'card.png');
  const finalPath = path.join(ogDir, item.file.replace(/\.png$/, '.jpg'));
  fs.writeFileSync(htmlPath, html(item));
  try {
    execFileSync(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--window-size=1200,630',
        `--screenshot=${pngPath}`,
        `file://${htmlPath}`,
      ],
      { stdio: 'pipe', timeout: 45000 }
    );
    // Converte para JPEG com qualidade alta (imagens OG não precisam de transparência).
    execFileSync('python3', ['-c', JPEG_CONVERT, pngPath, finalPath], { stdio: 'pipe' });
    ok++;
  } catch (e) {
    fail++;
    console.error(`  falhou: ${item.file}`);
  }
}

fs.rmSync(tmpDir, { recursive: true, force: true });
if (fail) {
  // Preserva o manifesto sincronizado com o que existe em disco
  const keep = manifest.filter((m) => fs.existsSync(path.join(ogDir, m.file)));
  fs.writeFileSync(manifestPath, JSON.stringify(keep, null, 2));
}
console.log(`  OG: ${ok} imagens geradas${fail ? `, ${fail} falhas` : ''}`);
