import { marked } from 'marked';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';
import { slugify, stripHtml } from './utils.js';

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: false,
  mangle: false,
});

/** Lê um arquivo .md com frontmatter. */
export function readMarkdown(file) {
  const raw = readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { data, content };
}

/**
 * Converte markdown em HTML.
 * Adiciona ids nos headings para âncoras e tabela semântica.
 */
export function renderMarkdown(md) {
  const used = new Set();
  const html = marked.parse(md);

  // Adiciona ids e links de âncora nos headings (h2-h4).
  return html.replace(/<(h[234])(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (match, tag, attrs, inner) => {
    const text = stripHtml(inner);
    let id = slugify(text);
    if (!id) return match;
    while (used.has(id)) id = `${id}-${used.size}`;
    used.add(id);
    const cleanAttrs = (attrs || '').replace(/\s*id="[^"]*"/, '');
    return `<${tag}${cleanAttrs} id="${id}"><a class="anchor" href="#${id}" aria-label="Link para esta seção">#</a>${inner}</${tag}>`;
  });
}

/** Extrai a estrutura de títulos (para sumário lateral). */
export function extractHeadings(md) {
  const out = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m;
  while ((m = re.exec(md))) {
    const text = stripHtml(m[2]);
    out.push({ level: Number(m[1].length), text, id: slugify(text) });
  }
  return out;
}

/** Converte um bloco de texto simples (parágrafos) em <p>. */
export function textToHtml(t) {
  if (!t) return '';
  return String(t)
    .split(/\n{2,}/)
    .map((p) => `<p>${p.trim()}</p>`)
    .join('\n');
}
