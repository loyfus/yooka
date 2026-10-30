/** Utilidades gerais do gerador. */

export const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const stripHtml = (s) =>
  String(s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const truncate = (s, n) => {
  const t = stripHtml(s);
  return t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
};

export const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isoDate = (d) => new Date(d).toISOString().slice(0, 10);

export const ptBrDate = (d) => {
  const dt = new Date(d);
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return `${dt.getUTCDate()} de ${months[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`;
};

export const readingTime = (text) => {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** Slugs únicos de URL com barra final. */
export const urlPath = (p) => {
  if (!p || p === '/') return '/';
  let s = p.startsWith('/') ? p : '/' + p;
  if (!s.endsWith('/')) s += '/';
  return s;
};

export const uniq = (arr) => [...new Set(arr)];
