import { site } from '../site.config.js';
import { escapeHtml, ptBrDate, readingTime, urlPath, stripHtml } from './utils.js';
import { head, organizationSchema, websiteSchema } from './seo.js';
import { calculators } from '../content/calculators.js';

const A = site.url.replace(/\/$/, '');

/* ------------------------------------------------------------------ *
 * Layout base
 * ------------------------------------------------------------------ */
export function layout(page, body, opts = {}) {
  return `<!doctype html>
<html lang="${site.lang}" dir="ltr">
<head>
  ${head(page)}
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
  <link rel="stylesheet" href="/assets/styles.css">
  ${opts.noindex ? '' : `<link rel="alternate" type="application/rss+xml" href="/rss.xml">`}
</head>
<body>
${announcementBar()}
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${header(page)}
<main id="conteudo">
${body}
</main>
${footer()}
${site.adsense.client ? adsenseScript() : ''}
<script src="/assets/app.js" defer></script>
</body>
</html>`;
}

function announcementBar() {
  return `<div class="announce">
  <div class="wrap">
    <span>🧮 <strong>Novo:</strong> ${calculators.length} calculadoras grátis — 13º, férias, rescisão, DAS do MEI e markup</span>
    <a class="announce__cta" href="/calculadoras/">Abrir <span aria-hidden="true">→</span></a>
  </div>
</div>`;
}

function header(page) {
  const nav = site.nav
    .map(
      (n) =>
        `<li><a href="${n.href}"${isActive(page.url, n.href) ? ' aria-current="page"' : ''}>${escapeHtml(n.label)}</a></li>`
    )
    .join('\n        ');

  return `<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="/" aria-label="${escapeHtml(site.name)} — página inicial">
      <img src="/assets/logo.svg" alt="" width="34" height="34" aria-hidden="true">
      <span class="brand__name">${escapeHtml(site.name)}</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mainnav" aria-label="Abrir menu">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="mainnav" aria-label="Navegação principal">
      <ul>
        ${nav}
      </ul>
      <a class="btn btn--primary btn--sm" href="${site.offer.url}" rel="nofollow noopener">${escapeHtml(site.offer.cta)}</a>
    </nav>
  </div>
</header>`;
}

function isActive(url, href) {
  if (href === '/') return url === '/';
  return urlPath(url).startsWith(urlPath(href));
}

function footer() {
  const cols = site.footer
    .map(
      (c) => `<div class="footer__col">
        <h3>${escapeHtml(c.title)}</h3>
        <ul>
          ${c.links.map((l) => `<li><a href="${l.href}">${escapeHtml(l.label)}</a></li>`).join('\n          ')}
        </ul>
      </div>`
    )
    .join('\n');

  const social = site.social
    .map((s) => `<a href="${s.href}" rel="noopener nofollow" aria-label="${escapeHtml(s.label)}">${escapeHtml(s.label)}</a>`)
    .join('\n          ');

  return `<footer class="site-footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <a class="brand" href="/">
        <img src="/assets/logo.svg" alt="" width="34" height="34" aria-hidden="true">
        <span class="brand__name">${escapeHtml(site.name)}</span>
      </a>
      <p>${escapeHtml(site.description)}</p>
      <div class="footer__social">
          ${social}
      </div>
    </div>
    ${cols}
  </div>
  <div class="wrap footer__bottom">
    <p>© ${new Date().getUTCFullYear()} ${escapeHtml(site.name)}. Conteúdo revisado por especialistas. Alguns links são de afiliados — isso não muda o que escrevemos.</p>
    <p>Feito no Brasil 🇧🇷</p>
  </div>
</footer>`;
}

function adsenseScript() {
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsense.client}" crossorigin="anonymous"></script>`;
}

/* ------------------------------------------------------------------ *
 * Blocos reutilizáveis
 * ------------------------------------------------------------------ */

/** Slot de anúncio. Renderiza placeholder quando o AdSense não está configurado. */
export function adSlot(name, variant = 'inline') {
  const slot = site.adsense.slots[name] || site.adsense.slots.inArticle;
  if (!site.adsense.client) {
    return `<aside class="ad ad--${variant} ad--placeholder" aria-label="Espaço publicitário">
  <span class="ad__label">Publicidade</span>
  <div class="ad__box"><p>Slot AdSense <code>${escapeHtml(name)}</code></p><p class="muted">Ative o <code>ADSENSE_CLIENT</code> no build para exibir aqui.</p></div>
</aside>`;
  }
  return `<aside class="ad ad--${variant}" aria-label="Publicidade">
  <span class="ad__label">Publicidade</span>
  <ins class="adsbygoogle" style="display:block" data-ad-client="${site.adsense.client}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
</aside>`;
}

/** Breadcrumbs visuais. */
export function breadcrumbs(crumbs) {
  const items = crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1;
      return last
        ? `<li aria-current="page">${escapeHtml(c.label)}</li>`
        : `<li><a href="${c.href}">${escapeHtml(c.label)}</a></li>`;
    })
    .join('\n        ');
  return `<nav class="crumbs" aria-label="Você está aqui"><ol>
        ${items}
      </ol></nav>`;
}

/** Cartão de artigo para listagens. */
export function articleCard(a, { featured = false } = {}) {
  const tag = a.categoryLabel ? `<span class="card__tag">${escapeHtml(a.categoryLabel)}</span>` : '';
  return `<article class="card${featured ? ' card--featured' : ''}">
  <div class="card__body">
    ${tag}
    <h3 class="card__title"><a href="${a.url}">${escapeHtml(a.title)}</a></h3>
    <p class="card__desc">${escapeHtml(a.description)}</p>
    <div class="card__meta">
      <span>${ptBrDate(a.date)}</span>
      <span>·</span>
      <span>${a.readingTime} min de leitura</span>
    </div>
  </div>
</article>`;
}

/** Caixa de conversão para a oferta principal (Loyfus). */
export function offerBox({ title, text, button, href, compact = false } = {}) {
  const t = title || 'Quer automatizar isso na sua empresa?';
  const x = text || site.offer.pitch;
  const b = button || site.offer.cta;
  const h = href || site.offer.url;
  return `<aside class="offer${compact ? ' offer--compact' : ''}">
  <div class="offer__text">
    <h3>${escapeHtml(t)}</h3>
    <p>${escapeHtml(x)}</p>
  </div>
  <a class="btn btn--primary" href="${h}" rel="nofollow noopener">${escapeHtml(b)} <span aria-hidden="true">→</span></a>
</aside>`;
}

/** Bloco de resposta direta (alvo de featured snippet). */
export function answerBox(question, answer) {
  return `<section class="answerbox">
  <h2>${escapeHtml(question)}</h2>
  <div class="answerbox__content">${answer}</div>
</section>`;
}

/** Tabela comparativa de ferramentas. */
export function comparisonTable(tools, { caption } = {}) {
  const rows = tools
    .map(
      (t) => `<tr>
      <th scope="row"><a href="${t.url || '/ferramentas/'}">${escapeHtml(t.name)}</a></th>
      <td>${escapeHtml(t.price || '—')}</td>
      <td>${escapeHtml(t.bestFor || '—')}</td>
      <td>${t.rating ? `<span class="stars" aria-label="Nota ${t.rating} de 5">${'★'.repeat(Math.round(t.rating))}${'☆'.repeat(5 - Math.round(t.rating))}</span>` : '—'}</td>
      <td><a class="btn btn--ghost btn--xs" href="${t.affiliateUrl || t.url || '/ferramentas/'}">Ver preço</a></td>
    </tr>`
    )
    .join('\n    ');

  return `<div class="table-wrap">
  <table class="cmp">
    ${caption ? `<caption>${escapeHtml(caption)}</caption>` : ''}
    <thead>
      <tr>
        <th scope="col">Ferramenta</th>
        <th scope="col">Preço</th>
        <th scope="col">Melhor para</th>
        <th scope="col">Nota</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
    ${rows}
    </tbody>
  </table>
</div>`;
}

/** FAQ em accordion (sem JS, usa <details>). */
export function faqBlock(faqs) {
  if (!faqs?.length) return '';
  const items = faqs
    .map(
      (f) => `<details class="faq">
    <summary><span>${escapeHtml(f.q)}</span></summary>
    <div class="faq__a">${f.aHtml || `<p>${escapeHtml(f.a)}</p>`}</div>
  </details>`
    )
    .join('\n  ');
  return `<div class="faq-list">
  ${items}
</div>`;
}

/** Sumário lateral (TOC). */
export function toc(headings) {
  if (!headings?.length) return '';
  const items = headings
    .filter((h) => h.level === 2)
    .map((h) => `<li><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`)
    .join('\n          ');
  return `<nav class="toc" aria-label="Sumário">
  <p class="toc__title">Nesta página</p>
  <ul>
          ${items}
  </ul>
</nav>`;
}

/** Assinatura editorial (E-E-A-T). */
export function authorBox() {
  return `<aside class="authorbox">
  <div class="authorbox__avatar" aria-hidden="true">YK</div>
  <div>
    <p class="authorbox__label">Sobre o autor</p>
    <p><strong>Equipe editorial Yooka</strong></p>
    <p>Analisamos ferramentas de IA e automação todos os dias e documentamos o que funciona em operação real no mercado brasileiro — incluindo o custo, o prazo e o que dá errado.</p>
    <p><a href="/editorial/">Como avaliamos e revisamos →</a></p>
  </div>
</aside>`;
}

/** Bloco "atualizado" — sinaliza frescor para o Google e para o leitor. */
export function updatedBox(date) {
  return `<p class="updated">Atualizado em <time datetime="${new Date(date).toISOString().slice(0, 10)}">${ptBrDate(date)}</time></p>`;
}

/** Badges de confiança no topo do artigo. */
export function trustBar(items = []) {
  const defaults = [
    'Testado em operação real',
    'Preços verificados',
    'Sem paywall',
  ];
  const list = items.length ? items : defaults;
  return `<ul class="trustbar">
  ${list.map((i) => `<li>${escapeHtml(i)}</li>`).join('\n  ')}
</ul>`;
}

/** Hero da home. */
export function hero({ title, subtitle, ctaPrimary, ctaSecondary, badges }) {
  return `<section class="hero">
  <div class="wrap hero__inner">
    <p class="hero__eyebrow">${escapeHtml(site.tagline)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="hero__sub">${escapeHtml(subtitle)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${ctaPrimary.href}">${escapeHtml(ctaPrimary.label)}</a>
      <a class="btn btn--ghost" href="${ctaSecondary.href}">${escapeHtml(ctaSecondary.label)}</a>
    </div>
    ${badges ? `<ul class="hero__badges">${badges.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
  </div>
</section>`;
}

/** Caixa de busca — captura de intenção e links internos. */
export function searchBox() {
  return `<form class="searchbox" action="/busca/" method="get" role="search">
  <label class="sr-only" for="q">Buscar no site</label>
  <input id="q" name="q" type="search" placeholder="Buscar: n8n x make, custo de agente de IA, chatbot WhatsApp…" autocomplete="off">
  <button class="btn btn--primary btn--sm" type="submit">Buscar</button>
</form>`;
}
