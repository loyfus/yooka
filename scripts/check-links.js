/**
 * Verificador de links internos: confere se todo href relativo aponta para
 * uma página que realmente existe no build.
 * Uso: node scripts/check-links.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'public');

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
})(OUT);

const exists = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(OUT, 'index.html'));
  const target = path.join(OUT, clean.replace(/^\//, ''));
  if (fs.existsSync(target)) return true;
  if (fs.existsSync(path.join(target, 'index.html'))) return true;
  if (fs.existsSync(target + '.html')) return true;
  return false;
};

const broken = [];
const seen = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = '/' + path.relative(OUT, file).replace(/index\.html$/, '');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (!href.startsWith('/')) continue;
    if (href.startsWith('/assets/')) {
      const asset = path.join(OUT, href.replace(/^\//, ''));
      if (!fs.existsSync(asset)) {
        const key = `${href}`;
        if (!seen.has(key)) {
          seen.add(key);
          broken.push({ from: page, href, reason: 'asset inexistente' });
        }
      }
      continue;
    }
    if (exists(href)) continue;
    const key = href;
    if (seen.has(key)) continue;
    seen.add(key);
    broken.push({ from: page, href, reason: 'página inexistente' });
  }
}

console.log(`\n  ${htmlFiles.length} páginas verificadas.`);
if (!broken.length) {
  console.log('  Nenhum link interno quebrado.\n');
} else {
  console.log(`  ${broken.length} links quebrados:\n`);
  for (const b of broken) console.log(`   ${b.from}  →  ${b.href}  (${b.reason})`);
  console.log('');
  process.exitCode = 1;
}
