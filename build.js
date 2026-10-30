import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, build as cfg } from './src/site.config.js';
import { readMarkdown, renderMarkdown, extractHeadings, textToHtml } from './src/lib/markdown.js';
import { slugify, escapeHtml, truncate, stripHtml, urlPath, isoDate, ptBrDate, readingTime, uniq } from './src/lib/utils.js';
import {
  layout, breadcrumbs, articleCard, adSlot, offerBox, faqBlock, toc,
  comparisonTable, hero, searchBox, authorBox, updatedBox, trustBar, answerBox,
} from './src/lib/templates.js';
import {
  organizationSchema, websiteSchema, articleSchema, faqSchema,
  itemListSchema, softwareAppSchema, howToSchema, breadcrumbSchema,
} from './src/lib/seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const OUT = path.join(ROOT, cfg.outDir);
const CONTENT = path.join(ROOT, cfg.contentDir);

const TODAY = process.env.BUILD_DATE || '2026-10-30';

/* Limpa a saída ANTES de gerar (as páginas são emitidas durante o build). */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ *
 * Carregamento de conteúdo
 * ------------------------------------------------------------------ */
const readJSON = (p, fallback = null) => {
  if (!fs.existsSync(p)) {
    if (fallback !== null) return fallback;
    throw new Error(`Arquivo ausente: ${p}`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};

function listFiles(dir, ext) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .map((f) => path.join(full, f));
}

function loadArticles() {
  return listFiles('articles', '.md')
    .map((f) => {
      const { data, content } = readMarkdown(f);
      const slug = data.slug || path.basename(f, '.md');
      const html = renderMarkdown(content);
      return {
        type: 'article',
        slug,
        url: `/guias/${slug}/`,
        title: data.title,
        description: data.description,
        date: data.date || TODAY,
        updated: data.updated || data.date || TODAY,
        category: data.category || 'agentes-de-ia',
        tags: data.tags || [],
        keywords: data.keywords || [],
        featured: !!data.featured,
        draft: !!data.draft,
        faq: data.faq || [],
        body: html,
        headings: extractHeadings(content),
        wordCount: stripHtml(html).split(/\s+/).filter(Boolean).length,
        readingTime: readingTime(html),
      };
    })
    .filter((a) => !a.draft);
}

function loadComparisons() {
  return listFiles('comparisons', '.md')
    .map((f) => {
      const { data, content } = readMarkdown(f);
      const slug = data.slug || path.basename(f, '.md');
      const html = renderMarkdown(content);
      const tools = (data.tools || []).map((t) => ({
        ...t,
        url: t.pageUrl || `/ferramentas/${slugify(t.name)}/`,
      }));
      return {
        type: 'comparison',
        slug,
        url: `/comparativos/${slug}/`,
        title: data.title,
        description: data.description,
        date: data.date || TODAY,
        updated: data.updated || data.date || TODAY,
        category: data.category || 'automacao',
        tags: data.tags || [],
        keywords: data.keywords || [],
        featured: !!data.featured,
        draft: !!data.draft,
        faq: data.faq || [],
        winner: data.winner,
        tools,
        body: html,
        headings: extractHeadings(content),
        wordCount: stripHtml(html).split(/\s+/).filter(Boolean).length,
        readingTime: readingTime(html),
      };
    })
    .filter((a) => !a.draft);
}

function loadTools() {
  return listFiles('tools', '.json').map((f) => {
    const t = readJSON(f);
    return {
      ...t,
      slug: t.slug || path.basename(f, '.json'),
      url: `/ferramentas/${t.slug || path.basename(f, '.json')}/`,
      updated: t.updated || TODAY,
    };
  });
}

const categories = readJSON(path.join(CONTENT, 'categories.json'));
const glossary = readJSON(path.join(CONTENT, 'glossary.json'), []);
const globalFaq = readJSON(path.join(CONTENT, 'faq.json'), []);

/* ------------------------------------------------------------------ *
 * Utilidades de página
 * ------------------------------------------------------------------ */
const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const catLabel = (slug) => catBySlug[slug]?.name || slug;

const pages = [];
const ogManifest = [];

function emit(file, html) {
  const target = path.join(OUT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

/** Nome do arquivo da imagem OG de uma página. */
const ogFileFor = (url) => url.replace(/^\/|\/$/g, '').replace(/\//g, '-') + '.jpg';

function addPage({ file, page, body, noindex = false, og = null }) {
  pages.push({ file, url: page.url, priority: page.priority ?? 0.6, changefreq: page.changefreq || 'weekly', lastmod: page.lastmod || TODAY, noindex });

  if (og !== null) {
    const ogFile = og.file || ogFileFor(page.url);
    page.image = `/assets/og/${ogFile}`;
    ogManifest.push({
      file: ogFile,
      title: og.title || page.title,
      subtitle: og.subtitle || page.description,
      badge: og.badge || '',
      footer: og.footer || 'IA e automação para empresas',
    });
  }

  emit(file, layout(page, body, { noindex }));
}

/* ------------------------------------------------------------------ *
 * Blocos de página
 * ------------------------------------------------------------------ */
function articlePage(a) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Guias', href: '/guias/' },
    { label: a.title, href: a.url },
  ];

  const page = {
    url: a.url,
    title: a.title,
    description: a.description,
    type: 'article',
    publishedAt: isoDate(a.date),
    modifiedAt: isoDate(a.updated),
    section: catLabel(a.category),
    image: '/assets/og-default.png',
    breadcrumbs: crumbs,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      articleSchema({
        title: a.title,
        description: a.description,
        url: a.url,
        publishedAt: isoDate(a.date),
        modifiedAt: isoDate(a.updated),
        keywords: [...a.tags, ...a.keywords],
        wordCount: a.wordCount,
      }),
      ...(a.faq.length ? [faqSchema(a.faq)] : []),
    ],
  };

  const related = allArticles
    .filter((x) => x.slug !== a.slug)
    .map((x) => ({
      score:
        (x.category === a.category ? 2 : 0) +
        x.tags.filter((t) => a.tags.includes(t)).length,
      x,
    }))
    .sort((p, q) => q.score - p.score)
    .slice(0, 3)
    .map((r) => r.x);

  const body = `
${breadcrumbs(crumbs)}
<article class="post">
  <header class="post__head">
    <a class="pill" href="/categorias/${a.category}/">${escapeHtml(catLabel(a.category))}</a>
    <h1>${escapeHtml(a.title)}</h1>
    <p class="post__lead">${escapeHtml(a.description)}</p>
    <div class="post__meta">
      ${updatedBox(a.updated)}
      <span>${a.readingTime} min de leitura</span>
      <span>${a.wordCount.toLocaleString('pt-BR')} palavras</span>
    </div>
    ${trustBar()}
  </header>

  <div class="post__layout">
    <div class="post__content">
      ${a.body}
      ${a.faq.length ? `<section class="post__faq">
        <h2>Perguntas frequentes</h2>
        ${faqBlock(a.faq)}
      </section>` : ''}
      ${authorBox()}
      ${offerBox({
        title: 'Não quer fazer isso no escuro?',
        text: 'A gente desenha o agente, integra com os seus sistemas e entrega em produção com suporte.',
        button: 'Falar com um especialista',
      })}
      ${
        related.length
          ? `<section class="related">
        <h2>Continue lendo</h2>
        <div class="grid grid--3">
          ${related.map((r) => articleCard(r)).join('\n          ')}
        </div>
      </section>`
          : ''
      }
    </div>
    <aside class="post__aside">
      ${toc(a.headings)}
      ${adSlot('sidebar', 'sticky')}
      ${offerBox({ compact: true, title: 'Agente de IA sob medida', text: 'Diagnóstico, implantação e suporte.', button: 'Falar agora' })}
    </aside>
  </div>
</article>`;

  addPage({
    file: `guias/${a.slug}/index.html`,
    page,
    body,
    og: { badge: catLabel(a.category), title: a.title, subtitle: a.description },
  });
}

function comparisonPage(c) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Comparativos', href: '/comparativos/' },
    { label: c.title, href: c.url },
  ];

  const winner = c.tools.find((t) => slugify(t.name) === slugify(c.winner || '')) || c.tools[0];

  const page = {
    url: c.url,
    title: c.title,
    description: c.description,
    type: 'article',
    publishedAt: isoDate(c.date),
    modifiedAt: isoDate(c.updated),
    section: catLabel(c.category),
    breadcrumbs: crumbs,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      articleSchema({
        title: c.title,
        description: c.description,
        url: c.url,
        publishedAt: isoDate(c.date),
        modifiedAt: isoDate(c.updated),
        keywords: c.tags,
        wordCount: c.wordCount,
      }),
      ...(c.faq.length ? [faqSchema(c.faq)] : []),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<article class="post post--comparison">
  <header class="post__head">
    <a class="pill" href="/categorias/${c.category}/">${escapeHtml(catLabel(c.category))}</a>
    <h1>${escapeHtml(c.title)}</h1>
    <p class="post__lead">${escapeHtml(c.description)}</p>
    <div class="post__meta">
      ${updatedBox(c.updated)}
      <span>${c.readingTime} min de leitura</span>
      <span>${c.tools.length} opções comparadas</span>
    </div>
    ${trustBar(['Comparação atualizada', 'Preços verificados', 'Critérios objetivos'])}
  </header>

  <div class="post__layout">
    <div class="post__content">
      <section class="answerbox answerbox--winner">
        <p class="answerbox__label">Resposta curta</p>
        <h2>${escapeHtml(winner.name)} é a melhor escolha para ${escapeHtml(
          catBySlug[c.category]?.short?.toLowerCase() || 'a maioria dos casos'
        ).replace(/^para a maioria dos casos/, 'a maioria dos casos')}</h2>
        <p>${escapeHtml(winner.verdict || '')}</p>
        <a class="btn btn--primary btn--sm" href="${winner.affiliateUrl || winner.url}" rel="nofollow noopener">Ver ${escapeHtml(winner.name)}</a>
      </section>

      <div class="table-wrap">
        <table class="cmp cmp--big">
          <caption>Comparativo rápido — ${escapeHtml(c.title)}</caption>
          <thead>
            <tr>
              <th scope="col">Critério</th>
              ${c.tools.map((t) => `<th scope="col">${escapeHtml(t.name)}</th>`).join('\n              ')}
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Preço</th>${c.tools.map((t) => `<td>${escapeHtml(t.price || '—')}</td>`).join('')}</tr>
            <tr><th scope="row">Melhor para</th>${c.tools.map((t) => `<td>${escapeHtml(t.bestFor || '—')}</td>`).join('')}</tr>
            <tr><th scope="row">Nota Yooka</th>${c.tools.map((t) => `<td><span class="stars">${'★'.repeat(Math.round(t.rating || 0))}${'☆'.repeat(5 - Math.round(t.rating || 0))}</span> <span class="muted">${t.rating ?? '—'}</span></td>`).join('')}</tr>
            <tr><th scope="row">Prós</th>${c.tools.map((t) => `<td><ul class="tick">${(t.pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></td>`).join('')}</tr>
            <tr><th scope="row">Contras</th>${c.tools.map((t) => `<td><ul class="cross">${(t.cons || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></td>`).join('')}</tr>
            <tr><th scope="row">Ação</th>${c.tools.map((t) => `<td><a class="btn btn--ghost btn--xs" href="${t.affiliateUrl || t.url}" rel="nofollow noopener">Ver preço</a></td>`).join('')}</tr>
          </tbody>
        </table>
      </div>

      ${adSlot('inArticle', 'inline')}

      ${c.body}

      ${c.faq.length ? `<section class="post__faq"><h2>Perguntas frequentes</h2>${faqBlock(c.faq)}</section>` : ''}

      <section class="verdict">
        <h2>Veredito</h2>
        <p><strong>Escolha ${escapeHtml(winner.name)}</strong> se ${escapeHtml(winner.bestFor || 'você busca a opção mais simples')}. É a melhor escolha para ${escapeHtml(catBySlug[c.category]?.short?.toLowerCase() || 'o caso descrito acima')}.</p>
        <p class="muted">Preços e recursos verificados em ${ptBrDate(c.updated)}. Planos mudam com frequência — confirme no site oficial antes de fechar.</p>
      </section>

      ${authorBox()}
      ${offerBox({
        title: 'Ainda em dúvida entre as duas?',
        text: 'Fale com quem já implantou as duas. Em 30 minutos você sai com o caminho decidedo.',
        button: 'Falar com um especialista',
      })}
    </div>
    <aside class="post__aside">
      ${toc(c.headings)}
      ${adSlot('sidebar', 'sticky')}
    </aside>
  </div>
</article>`;

  addPage({
    file: `comparativos/${c.slug}/index.html`,
    page,
    body,
    og: { badge: `Comparativo · ${catLabel(c.category)}`, title: c.title, subtitle: c.description },
  });
}

function toolPage(t) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Ferramentas', href: '/ferramentas/' },
    { label: t.name, href: t.url },
  ];
  const alts = (t.alternatives || []).map((s) => allTools.find((x) => x.slug === s)).filter(Boolean);

  const page = {
    url: t.url,
    title: `${t.name}: preços, review honesto e alternativas`,
    description: t.description,
    type: 'article',
    publishedAt: isoDate(t.updated),
    modifiedAt: isoDate(t.updated),
    section: catLabel(t.category),
    breadcrumbs: crumbs,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      softwareAppSchema(t),
      articleSchema({
        title: `${t.name}: review, preço e alternativas`,
        description: t.description,
        url: t.url,
        publishedAt: isoDate(t.updated),
        modifiedAt: isoDate(t.updated),
        keywords: [t.name, ...(t.useCases || [])],
        wordCount: 600,
      }),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<article class="post post--tool">
  <header class="post__head">
    <a class="pill" href="/categorias/${t.category}/">${escapeHtml(catLabel(t.category))}</a>
    <h1>${escapeHtml(t.name)}</h1>
    <p class="post__lead">${escapeHtml(t.tagline || '')}</p>
    <div class="post__meta">
      ${updatedBox(t.updated)}
      <span class="rating-inline"><span class="stars">${'★'.repeat(Math.round(t.rating || 0))}${'☆'.repeat(5 - Math.round(t.rating || 0))}</span> <strong>${t.rating}</strong> <span class="muted">(${t.ratingCount} avaliações)</span></span>
    </div>
  </header>

  <div class="post__layout">
    <div class="post__content">
      <section class="buybox">
        <div class="buybox__main">
          <p class="buybox__label">Preço</p>
          <p class="buybox__price">${escapeHtml(t.price || 'Consulte')}</p>
          <p class="muted">${escapeHtml(t.priceNote || '')}</p>
        </div>
        <div class="buybox__side">
          <p class="buybox__label">Melhor para</p>
          <p>${escapeHtml(t.bestFor || '')}</p>
          <a class="btn btn--primary" href="${t.affiliateUrl || t.url}" rel="nofollow noopener">Ver preço no site oficial</a>
          <p class="muted tiny">Link de afiliado. A Yooka não é patrocinada pelo fornecedor.</p>
        </div>
      </section>

      ${answerBox(`O que é ${t.name}?`, `<p>${escapeHtml(t.description)}</p>`)}

      <h2>Para quem serve</h2>
      <p>${escapeHtml(t.bestForWho || '')}</p>

      <h2>Prós e contras</h2>
      <div class="twocol">
        <div class="pro">
          <h3>Prós</h3>
          <ul class="tick">${(t.pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
        </div>
        <div class="con">
          <h3>Contras</h3>
          <ul class="cross">${(t.cons || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
        </div>
      </div>

      <h2>Recursos principais</h2>
      <div class="table-wrap">
        <table class="cmp">
          <caption>Recursos de ${escapeHtml(t.name)}</caption>
          <thead><tr><th scope="col">Recurso</th><th scope="col">Detalhe</th></tr></thead>
          <tbody>
            ${(t.features || []).map((f) => `<tr><th scope="row">${escapeHtml(f.name)}</th><td>${escapeHtml(f.detail)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2>Casos de uso em empresas brasileiras</h2>
      <ul class="usecases">
        ${(t.useCases || []).map((u) => `<li>${escapeHtml(u)}</li>`).join('\n        ')}
      </ul>

      ${adSlot('inArticle', 'inline')}

      <section class="verdict">
        <h2>Veredito</h2>
        <p>${escapeHtml(t.verdict || '')}</p>
      </section>

      ${
        alts.length
          ? `<section class="alts">
        <h2>Alternativas a ${escapeHtml(t.name)}</h2>
        <div class="grid grid--3">
          ${alts
            .map(
              (a) => `<article class="card card--alt">
            <div class="card__body">
              <h3 class="card__title"><a href="${a.url}">${escapeHtml(a.name)}</a></h3>
              <p class="card__desc">${escapeHtml(a.tagline || a.description)}</p>
              <p class="card__meta"><strong>${escapeHtml(a.price || '')}</strong> · nota ${a.rating}</p>
            </div>
          </article>`
            )
            .join('\n          ')}
        </div>
        <p><a class="btn btn--ghost btn--sm" href="/ferramentas/${t.slug}/alternativas/">Ver todas as alternativas a ${escapeHtml(t.name)}</a></p>
      </section>`
          : ''
      }

      ${offerBox({
        title: `Precisa de ${t.name} funcionando na sua empresa?`,
        text: 'A gente instala, integra e monitora. Você entra no com o time focado no negócio.',
        button: 'Falar com um especialista',
      })}
      ${authorBox()}
    </div>
    <aside class="post__aside">
      ${adSlot('sidebar', 'sticky')}
      <nav class="toc" aria-label="Nesta página">
        <p class="toc__title">Nesta página</p>
        <ul>
          <li><a href="#prós-e-contras">Prós e contras</a></li>
          <li><a href="#recursos-principais">Recursos principais</a></li>
          <li><a href="#veredito">Veredito</a></li>
        </ul>
      </nav>
    </aside>
  </div>
</article>`;

  addPage({
    file: `ferramentas/${t.slug}/index.html`,
    page,
    body,
    og: { badge: `Ferramenta · ${catLabel(t.category)}`, title: t.name, subtitle: t.tagline || t.description },
  });
}

function toolAlternativesPage(t) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Ferramentas', href: '/ferramentas/' },
    { label: t.name, href: t.url },
    { label: 'Alternativas', href: `${t.url}alternativas/` },
  ];
  const alts = (t.alternatives || []).map((s) => allTools.find((x) => x.slug === s)).filter(Boolean);
  const sameCat = allTools.filter((x) => x.category === t.category && x.slug !== t.slug).slice(0, 6);

  const page = {
    url: `${t.url}alternativas/`,
    title: `Alternativas ao ${t.name} em 2026: ${alts.length} opções comparadas`,
    description: `Alternativas ao ${t.name}: lista comparada com preço, prós, contras e para quem cada uma funciona melhor. Escolha sem teste de 30 dias.`,
    type: 'article',
    breadcrumbs: crumbs,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(alts.map((a) => ({ title: a.name, url: a.url })), `Alternativas ao ${t.name}`, `${t.url}alternativas/`),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<article class="post">
  <header class="post__head">
    <h1>Alternativas ao ${escapeHtml(t.name)}</h1>
    <p class="post__lead">${alts.length} opções comparadas por preço, facilidade e casos de uso — com o ponto em que cada uma ganha do ${escapeHtml(t.name)}.</p>
    <div class="post__meta">${updatedBox(t.updated)}</div>
  </header>

  <div class="post__content">
    ${comparisonTable(
      alts.map((a) => ({ name: a.name, price: a.price, bestFor: a.bestFor, rating: a.rating, url: a.url, affiliateUrl: a.affiliateUrl })),
      { caption: `Alternativas ao ${t.name}` }
    )}

    ${alts
      .map(
        (a) => `<section class="altblock">
      <h2>${escapeHtml(a.name)}</h2>
      <p class="altblock__tag">${escapeHtml(a.tagline || '')}</p>
      <div class="twocol">
        <div class="pro"><h3>Prós</h3><ul class="tick">${(a.pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></div>
        <div class="con"><h3>Contras</h3><ul class="cross">${(a.cons || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></div>
      </div>
      <p class="altblock__best"><strong>Melhor para:</strong> ${escapeHtml(a.bestFor || '')}</p>
      <a class="btn btn--ghost btn--sm" href="${a.affiliateUrl || a.url}" rel="nofollow noopener">Ver ${escapeHtml(a.name)}</a>
      <p><a href="${a.url}">Review completo de ${escapeHtml(a.name)}</a></p>
    </section>`
      )
      .join('\n')}

    ${sameCat.length ? `<section>
      <h2>Mais ferramentas da mesma categoria</h2>
      <div class="grid grid--3">
        ${sameCat.map((a) => articleCard({ title: a.name, url: a.url, description: a.tagline || a.description, date: a.updated, readingTime: 4, categoryLabel: catLabel(a.category) })).join('\n        ')}
      </div>
    </section>` : ''}

    ${offerBox()}
  </div>
</article>`;

  addPage({ file: `ferramentas/${t.slug}/alternativas/index.html`, page, body });
}

/* ------------------------------------------------------------------ *
 * Índices e páginas estáticas
 * ------------------------------------------------------------------ */
function homePage() {
  const featured = allArticles.filter((a) => a.featured).slice(0, 6);
  const latest = [...allArticles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  const popular = allArticles.slice(0, 8);
  const topTools = [...allTools].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  const topComps = allComparisons.slice(0, 6);

  const page = {
    url: '/',
    title: `${site.name} — IA e automação para empresas, sem hype`,
    description: site.description,
    type: 'website',
    priority: 1.0,
    changefreq: 'daily',
    schemas: [
      organizationSchema(),
      websiteSchema(),
      {
        '@type': 'WebPage',
        '@id': site.url + '/#webpage',
        url: site.url + '/',
        name: `${site.name} — IA e automação para empresas`,
        isPartOf: { '@id': site.url + '/#website' },
        about: { '@id': site.url + '/#organization' },
      },
    ],
  };

  const body = `
${hero({
    title: 'IA e automação que dá para colocar na empresa — e medir',
    subtitle:
      'Reviews honestos de ferramentas, comparativos com preço em Real e passo a passo de implementação para pequenas e médias empresas brasileiras.',
    ctaPrimary: { label: 'Ver o mapa de ferramentas', href: '/ferramentas/' },
    ctaSecondary: { label: 'Comparativos lado a lado', href: '/comparativos/' },
    badges: [`${allArticles.length} guias`, `${allTools.length} ferramentas`, `${allComparisons.length} comparativos`, 'Sem paywall'],
  })}

<section class="wrap section">
  ${searchBox()}
</section>

<section class="wrap section">
  <div class="section__head">
    <h2>Comece por aqui</h2>
    <p>Os guias mais lidos esta semana.</p>
  </div>
  <div class="grid grid--3">
    ${featured.map((a) => articleCard(a, { featured: true })).join('\n    ')}
  </div>
</section>

<section class="wrap section section--alt">
  <div class="section__head">
    <h2>Comparativos diretos</h2>
    <p>A diferença entre duas ferramentas, na prática.</p>
  </div>
  <div class="grid grid--2">
    ${topComps
      .map(
        (c) => `<article class="card card--cmp">
      <div class="card__body">
        <h3 class="card__title"><a href="${c.url}">${escapeHtml(c.title)}</a></h3>
        <p class="card__desc">${escapeHtml(c.description)}</p>
        <p class="card__meta"><span class="stars">${'★'.repeat(Math.round((c.tools[0]?.rating || 0)))}</span> <span class="muted">${c.tools.length} opções · vencedor: ${escapeHtml(c.winner || '')}</span></p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
  <p class="section__more"><a class="btn btn--ghost" href="/comparativos/">Ver todos os comparativos</a></p>
</section>

<section class="wrap section">
  <div class="section__head">
    <h2>Ferramentas avaliadas</h2>
    <p>Preço, prós, contras e para quem cada uma serve.</p>
  </div>
  <div class="grid grid--3">
    ${topTools
      .map(
        (t) => `<article class="card card--tool">
      <div class="card__body">
        <div class="card__toolhead">
          <span class="toolbadge">${escapeHtml(t.name.slice(0, 2).toUpperCase())}</span>
          <div>
            <h3 class="card__title"><a href="${t.url}">${escapeHtml(t.name)}</a></h3>
            <p class="card__meta"><span class="stars">${'★'.repeat(Math.round(t.rating || 0))}${'☆'.repeat(5 - Math.round(t.rating || 0))}</span> <span class="muted">${t.rating}</span></p>
          </div>
        </div>
        <p class="card__desc">${escapeHtml(t.tagline || t.description)}</p>
        <p class="card__price">${escapeHtml(t.price || '')}</p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
  <p class="section__more"><a class="btn btn--ghost" href="/ferramentas/">Ver todas as ferramentas</a></p>
</section>

<section class="wrap section">
  <div class="section__head">
    <h2>Navegue por tema</h2>
  </div>
  <div class="grid grid--3">
    ${categories
      .map(
        (c) => `<article class="card card--cat">
      <div class="card__body">
        <h3 class="card__title"><a href="/categorias/${c.slug}/">${escapeHtml(c.name)}</a></h3>
        <p class="card__desc">${escapeHtml(c.short)}</p>
        <p class="card__meta">${allArticles.filter((a) => a.category === c.slug).length} guias</p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
</section>

<section class="wrap section section--alt">
  <div class="section__head">
    <h2>Mais recentes</h2>
  </div>
  <div class="grid grid--3">
    ${latest.map((a) => articleCard(a)).join('\n    ')}
  </div>
  <p class="section__more"><a class="btn btn--ghost" href="/guias/">Ver todos os guias</a></p>
</section>

<section class="wrap section">
  ${adSlot('leaderboard', 'inline')}
  ${offerBox({
    title: 'Quer que o agente comece a trabalhar na sua empresa esta semana?',
    text: site.offer.pitch,
    button: 'Agendar diagnóstico gratuito',
  })}
</section>`;

  addPage({
    file: 'index.html',
    page,
    body,
    og: {
      file: 'og-default.jpg',
      badge: 'IA e automação para empresas',
      title: 'IA e automação que dá para colocar na empresa — e medir',
      subtitle: 'Reviews honestos, comparativos com preço em Real e passo a passo de implementação.',
    },
  });
}

function listPage({ url, file, title, description, items, itemRenderer, extraHead = '', priority = 0.7, schemas = [], breadcrumbsCrumb }) {
  const crumbs = [{ label: 'Início', href: '/' }, breadcrumbsCrumb, { label: title, href: url }].filter(Boolean);
  const page = {
    url,
    title,
    description,
    breadcrumbs: crumbs,
    priority,
    schemas: [organizationSchema(), websiteSchema(), ...schemas],
  };
  const body = `
${breadcrumbs(crumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>${escapeHtml(title)}</h1>
    <p class="listing__lead">${escapeHtml(description)}</p>
    ${searchBox()}
  </header>
  ${extraHead}
  <div class="listing__grid">
    ${items.map(itemRenderer).join('\n    ')}
  </div>
</section>
${adSlot('leaderboard', 'inline')}
${offerBox()}`;
  addPage({ file, page, body });
}

function categoryPage(cat) {
  const arts = allArticles.filter((a) => a.category === cat.slug);
  const comps = allComparisons.filter((c) => c.category === cat.slug);
  const tools = allTools.filter((t) => t.category === cat.slug);

  const page = {
    url: `/categorias/${cat.slug}/`,
    title: `${cat.name}: guia completo para empresas`,
    description: cat.description,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Categorias', href: '/categorias/' },
      { label: cat.name, href: `/categorias/${cat.slug}/` },
    ],
    priority: 0.8,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(
        [...arts, ...comps].map((a) => ({ title: a.title, url: a.url })),
        cat.name,
        `/categorias/${cat.slug}/`
      ),
    ],
  };

  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <p class="pill">${escapeHtml(cat.name)}</p>
    <h1>${escapeHtml(cat.name)}</h1>
    <p class="listing__lead">${escapeHtml(cat.short)}</p>
  </header>
  ${
    arts.length
      ? `<div class="section__head"><h2>Guias da categoria</h2></div>
  <div class="grid grid--3">
    ${arts.map((a) => articleCard(a)).join('\n    ')}
  </div>`
      : ''
  }
  ${
    comps.length
      ? `<div class="section__head"><h2>Comparativos</h2></div>
  <div class="grid grid--2">
    ${comps.map((c) => articleCard(c)).join('\n    ')}
  </div>`
      : ''
  }
  ${
    tools.length
      ? `<div class="section__head"><h2>Ferramentas da categoria</h2></div>
  ${comparisonTable(tools.map((t) => ({ name: t.name, price: t.price, bestFor: t.bestFor, rating: t.rating, url: t.url, affiliateUrl: t.affiliateUrl })))}`
      : ''
  }
</section>
${adSlot('leaderboard', 'inline')}
${offerBox()}`;

  addPage({ file: `categorias/${cat.slug}/index.html`, page, body });
}

function categoriesIndex() {
  const page = {
    url: '/categorias/',
    title: 'Todos os temas: IA e automação para empresas',
    description:
      'Índice completo de temas: agentes de IA, automação de processos, atendimento, IA por departamento, marketing e vendas, custos.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Categorias', href: '/categorias/' }],
    priority: 0.8,
    schemas: [organizationSchema(), websiteSchema()],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>Todos os temas</h1>
    <p class="listing__lead">Seis frentes de conteúdo. Cada uma com guias práticos, comparativos e as ferramentas que fazem sentido.</p>
  </header>
  <div class="grid grid--3">
    ${categories
      .map(
        (c) => `<article class="card card--cat">
      <div class="card__body">
        <h3 class="card__title"><a href="/categorias/${c.slug}/">${escapeHtml(c.name)}</a></h3>
        <p class="card__desc">${escapeHtml(c.short)}</p>
        <p class="card__meta">${allArticles.filter((a) => a.category === c.slug).length} guias · ${allTools.filter((t) => t.category === c.slug).length} ferramentas</p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
</section>
${offerBox()}`;
  addPage({ file: 'categorias/index.html', page, body });
}

function glossaryPage() {
  const page = {
    url: '/glossario/',
    title: 'Glossário de IA e automação: 40 termos explicados',
    description:
      'Glossário com 40 termos de IA, agentes e automação explicados em português simples: LLM, RAG, guardrail, token, workflow, webhook, MCP e mais.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Glossário', href: '/glossario/' }],
    priority: 0.7,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(glossary.map((g) => ({ title: g.term, url: `/glossario/${g.slug}/` })), 'Glossário de IA e automação', '/glossario/'),
    ],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>Glossário de IA e automação</h1>
    <p class="listing__lead">${glossary.length} termos do dia a dia de quem implementa IA na empresa, explicados sem jargão.</p>
    ${searchBox()}
  </header>
  <div class="glossary">
    ${glossary
      .map(
        (g) => `<div class="glossary__item">
      <h2 id="${g.slug}">${escapeHtml(g.term)}</h2>
      <p class="glossary__short">${escapeHtml(g.short)}</p>
      <details><summary>Ver explicação completa</summary><p>${escapeHtml(g.body)}</p></details>
    </div>`
      )
      .join('\n    ')}
  </div>
</section>
${offerBox()}`;
  addPage({ file: 'glossario/index.html', page, body });
}

function glossaryTermPage(g) {
  const related = (g.related || []).map((s) => glossary.find((x) => x.slug === s)).filter(Boolean);
  const page = {
    url: `/glossario/${g.slug}/`,
    title: `${g.term}: o que significa e como usar na prática`,
    description: truncate(g.short, 158),
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Glossário', href: '/glossario/' },
      { label: g.term, href: `/glossario/${g.slug}/` },
    ],
    priority: 0.5,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      {
        '@type': 'DefinedTerm',
        name: g.term,
        description: g.short,
        inDefinedTermSet: site.url + '/glossario/',
      },
    ],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<article class="post post--term">
  <header class="post__head">
    <h1>${escapeHtml(g.term)}</h1>
    <p class="post__lead">${escapeHtml(g.short)}</p>
  </header>
  <div class="post__content">
    <p>${escapeHtml(g.body)}</p>
    ${
      related.length
        ? `<section class="related"><h2>Termos relacionados</h2><ul class="linklist">
      ${related.map((r) => `<li><a href="/glossario/${r.slug}/">${escapeHtml(r.term)}</a> — ${escapeHtml(r.short)}</li>`).join('\n      ')}
    </ul></section>`
        : ''
    }
    ${offerBox({ compact: true })}
  </div>
</article>`;
  addPage({ file: `glossario/${g.slug}/index.html`, page, body });
}

function faqPage() {
  const page = {
    url: '/faq/',
    title: 'Perguntas frequentes sobre IA na empresa',
    description:
      'As dúvidas que todo gestor faz antes de colocar IA em produção: custo, prazo, LGPD, segurança, time e o que dá para automatizar.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'FAQ', href: '/faq/' }],
    priority: 0.6,
    schemas: [organizationSchema(), websiteSchema(), faqSchema(globalFaq)],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>Perguntas frequentes</h1>
    <p class="listing__lead">As dúvidas que aparecem em toda reunião de implantação — respondidas sem enrolação.</p>
  </header>
  <div class="faq-list">
    ${globalFaq
      .map(
        (f) => `<details class="faq">
      <summary><span>${escapeHtml(f.q)}</span></summary>
      <div class="faq__a"><p>${escapeHtml(f.a)}</p></div>
    </details>`
      )
      .join('\n    ')}
  </div>
</section>
${offerBox()}`;
  addPage({ file: 'faq/index.html', page, body });
}

function pricesPage() {
  const page = {
    url: '/precos/',
    title: 'Preços e custos de IA e automação: tabela atualizada',
    description:
      'Tabela de preços de ferramentas de IA e automação, custo por token e por execução, e o cálculo de ROI para saber quando a automação se paga.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Preços e custos', href: '/precos/' }],
    priority: 0.8,
    schemas: [organizationSchema(), websiteSchema(), itemListSchema(allTools.map((t) => ({ title: t.name, url: t.url })), 'Preços de ferramentas de IA', '/precos/')],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>Preços e custos</h1>
    <p class="listing__lead">Quanto custa, de verdade, colocar IA para trabalhar. Tabela de planos, custo por execução e como calcular o retorno.</p>
  </header>
  <div class="section__head"><h2>Tabela de preços por ferramenta</h2><p class="muted">Verificado em ${ptBrDate(TODAY)}. Planos mudam — confirme no site oficial.</p></div>
  ${comparisonTable(
    [...allTools].sort((a, b) => (b.rating || 0) - (a.rating || 0)).map((t) => ({
      name: t.name,
      price: t.price,
      bestFor: t.bestFor,
      rating: t.rating,
      url: t.url,
      affiliateUrl: t.affiliateUrl,
    })),
    { caption: 'Preço por ferramenta' }
  )}
  <div class="section__head"><h2>Guias de custo</h2></div>
  <div class="grid grid--3">
    ${allArticles
      .filter((a) => a.category === 'custos' || /custo|preço/i.test(a.title))
      .map((a) => articleCard(a))
      .join('\n    ')}
  </div>
</section>
${offerBox({ title: 'Quer o custo real do seu caso?', text: 'Fazemos a conta com os seus números: volume, tarefas e horas envolvidas.', button: 'Pedir orçamento' })}`;
  addPage({ file: 'precos/index.html', page, body });
}

function simplePage({ file, url, title, description, h1, lead, content, priority = 0.4, noindex = false }) {
  const page = {
    url,
    title,
    description,
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: h1, href: url }],
    priority,
    schemas: [organizationSchema(), websiteSchema()],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing listing--narrow">
  <header class="listing__head">
    <h1>${escapeHtml(h1)}</h1>
    ${lead ? `<p class="listing__lead">${escapeHtml(lead)}</p>` : ''}
  </header>
  <div class="prose">
    ${content}
  </div>
</section>`;
  addPage({ file, page, body, noindex });
}

/* ------------------------------------------------------------------ *
 * Geração
 * ------------------------------------------------------------------ */
const allArticles = loadArticles();
const allComparisons = loadComparisons();
const allTools = loadTools();
const allContent = [...allArticles, ...allComparisons];

// Páginas de conteúdo
allArticles.forEach(articlePage);
allComparisons.forEach(comparisonPage);
allTools.forEach(toolPage);
allTools.forEach(toolAlternativesPage);

// Índices
homePage();

listPage({
  url: '/guias/',
  file: 'guias/index.html',
  title: 'Todos os guias de IA e automação',
  description:
    'Guia completo de IA e automação para empresas brasileiras: agentes, ferramentas, custos e implementação passo a passo.',
  items: allArticles,
  breadcrumbsCrumb: { label: 'Guias', href: '/guias/' },
  itemRenderer: (a) => articleCard(a),
  schemas: [itemListSchema(allArticles.map((a) => ({ title: a.title, url: a.url })), 'Guias de IA e automação', '/guias/')],
});

listPage({
  url: '/comparativos/',
  file: 'comparativos/index.html',
  title: 'Comparativos: X ou Y? Decidimos com critério',
  description:
    'Comparativos diretos entre ferramentas de IA e automação, com preço, curva de aprendizado, integração e o veredito de quem implementa.',
  items: allComparisons,
  breadcrumbsCrumb: { label: 'Comparativos', href: '/comparativos/' },
  itemRenderer: (a) => articleCard(a),
  schemas: [itemListSchema(allComparisons.map((a) => ({ title: a.title, url: a.url })), 'Comparativos de ferramentas', '/comparativos/')],
});

listPage({
  url: '/ferramentas/',
  file: 'ferramentas/index.html',
  title: 'Ferramentas de IA e automação: preço, prós, contras',
  description:
    'Catálogo de ferramentas de IA e automação avaliadas: preço, prós, contras, para quem serve e alternativas.',
  items: allTools,
  breadcrumbsCrumb: { label: 'Ferramentas', href: '/ferramentas/' },
  itemRenderer: (t) => `<article class="card card--tool">
      <div class="card__body">
        <div class="card__toolhead">
          <span class="toolbadge">${escapeHtml(t.name.slice(0, 2).toUpperCase())}</span>
          <div>
            <h3 class="card__title"><a href="${t.url}">${escapeHtml(t.name)}</a></h3>
            <p class="card__meta"><span class="stars">${'★'.repeat(Math.round(t.rating || 0))}${'☆'.repeat(5 - Math.round(t.rating || 0))}</span> <span class="muted">${t.rating}</span></p>
          </div>
        </div>
        <p class="card__desc">${escapeHtml(t.tagline || t.description)}</p>
        <p class="card__price">${escapeHtml(t.price || '')}</p>
      </div>
    </article>`,
  schemas: [itemListSchema(allTools.map((t) => ({ title: t.name, url: t.url })), 'Ferramentas de IA e automação', '/ferramentas/')],
});

// Categorias
categoriesIndex();
categories.forEach(categoryPage);

// Glossário
glossaryPage();
glossary.forEach(glossaryTermPage);

// FAQ e preços
faqPage();
pricesPage();

// Busca
simplePage({
  file: 'busca/index.html',
  url: '/busca/',
  title: 'Buscar no site',
  description: 'Busca interna na Yooka.',
  h1: 'Buscar',
  lead: 'Digite o que você procura: ferramenta, caso de uso ou dúvida.',
  content: `${searchBox()}<div id="search-results" class="listing__grid"></div>`,
  priority: 0.2,
  noindex: true,
});

// Páginas institucionais
simplePage({
  file: 'sobre/index.html',
  url: '/sobre/',
  title: 'Sobre a Yooka',
  description: 'Quem escreve, como avaliamos as ferramentas e por que existimos.',
  h1: 'Sobre a Yooka',
  lead: 'Um conteúdo sem hype, revisado por gente que põe IA em produção.',
  content: `<p>A Yooka é o braço editorial da <a href="https://loyfus.com.br" rel="nofollow noopener">Loyfus</a>, que constrói agentes de IA sob medida para empresas brasileiras. Publicamos o que aprendemos implantando: o que funciona, o que custa e o que dá errado.</p>
  <h2>Como avaliamos</h2>
  <ol>
    <li><strong>Teste real.</strong> Cada ferramenta passa por um cenário de operação brasileira antes de entrar no catálogo.</li>
    <li><strong>Preço verificado.</strong> Todo preço tem data de verificação e ressalva de que planos mudam.</li>
    <li><strong>Contras à frente.</strong> Se a ferramenta é ruim para o seu caso, dizemos isso. Review sem ressalva não é review.</li>
    <li><strong>Revisão periódica.</strong> Todo conteúdo tem data de atualização e passa por revisão trimestral.</li>
  </ol>
  <h2>Como ganhamos dinheiro</h2>
  <p>De duas formas, ambas declaradas: <strong>anúncios</strong> (Google AdSense) e <strong>links de afiliado</strong> (ganhamos comissão se você contratar uma ferramenta recomendada). Nenhum anunciante paga por review positivo e nenhum texto foi publicado a pedido de um fornecedor.</p>
  <p>Quando uma ferramenta é ruim para o seu caso, dizemos. Venderreview ruim custa caro e destrói o que importa aqui: confiança.</p>
  <h2>Fale com a gente</h2>
  <p>Quer um veredito para o seu caso específico? <a href="/contato/">Fale com a equipe</a>.</p>`,
});

simplePage({
  file: 'contato/index.html',
  url: '/contato/',
  title: 'Contato',
  description: 'Fale com a Yooka: dúvida sobre conteúdo ou projeto de agente de IA.',
  h1: 'Contato',
  lead: 'Dúvida sobre o conteúdo ou projeto de agente de IA na sua empresa?',
  content: `<p><strong>Dúvidas sobre conteúdo:</strong> <a href="mailto:ola@yooka.com.br">ola@yooka.com.br</a>. Respondemos em até 2 dias úteis.</p>
  <p><strong>Projeto de agente de IA:</strong> <a href="https://loyfus.com.br" rel="nofollow noopener">loyfus.com.br</a> ou <a href="mailto:comercial@loyfus.com.br">comercial@loyfus.com.br</a>.</p>
  <div class="offer"><div class="offer__text"><h3>Prefere falar direto?</h3><p>Agende um diagnóstico de 30 minutos. Você sai com um mapa de automação priorizado, sem compromisso.</p></div><a class="btn btn--primary" href="https://loyfus.com.br" rel="nofollow noopener">Agendar diagnóstico</a></div>`,
});

simplePage({
  file: 'editorial/index.html',
  url: '/editorial/',
  title: 'Política editorial',
  description: 'Como escrevemos, revisamos e corrigimos o conteúdo da Yooka.',
  h1: 'Política editorial',
  lead: 'Como cada texto é escrito, revisado e atualizado.',
  content: `<h2>Processo</h2>
  <ol>
    <li>Alguém da equipe implementou o problema na prática antes de escrever.</li>
    <li>O texto passa por revisão técnica (a segunda pessoa lê e tenta refazer o passo a passo).</li>
    <li>Preços e links são revalidados na data de publicação.</li>
    <li>Revisão trimestral: o que envelhece tem data de atualização visível.</li>
  </ol>
  <h2>Correções</h2>
  <p>Encontrou erro? <a href="mailto:ola@yooka.com.br">ola@yooka.com.br</a>. Corrigimos e sinalizamos a mudança na data de atualização do artigo.</p>
  <h2>Conflito de interesse</h2>
  <p>Se a Loyfus implementa ou vende algo parecido com o que descrevemos, isso aparece no texto. Nenhum fornecedor pagou por review, e nenhum texto foi publicado sob pedido.</p>`,
});

simplePage({
  file: 'privacidade/index.html',
  url: '/privacidade/',
  title: 'Política de privacidade',
  description: 'Como a Yooka trata dados, cookies e o que o AdSense registra.',
  h1: 'Política de privacidade',
  lead: 'Coletamos o mínimo, nunca vendemos dados e não usamos o que você digita para publicidade.',
  content: `<h2>Dados coletados</h2>
  <p>Coletamos dados de navegação padrão (IP, navegador, páginas visitadas) por meio do Google AdSense e de métricas agregadas de acesso. Esses dados podem ser usados pelo Google para escolher anúncios.</p>
  <h2>Cookies</h2>
  <p>Usamos cookies de publicidade do Google (personalização de anúncios), cookies de analytics e um cookie próprio de preferências. Você pode bloquear cookies nas configurações do navegador; o site continua funcionando.</p>
  <h2>Formulários</h2>
  <p>Quando você pede contato, guardamos nome, e-mail e a mensagem pelo tempo necessário para responder, e não além disso. Não vendemos nem cedemos esses dados.</p>
  <h2>Seus direitos (LGPD)</h2>
  <p>Você pode pedir acesso, correção ou exclusão dos seus dados a <a href="mailto:privacidade@yooka.com.br">privacidade@yooka.com.br</a>. Respondemos em até 15 dias.</p>
  <h2>Cookies de terceiros</h2>
  <p>Alguns links apontam para sites de terceiros com políticas próprias. A partir do clique, a coleta segue a política do site de destino.</p>`,
});

simplePage({
  file: 'termos/index.html',
  url: '/termos/',
  title: 'Termos de uso',
  description: 'Condições de uso do site Yooka.',
  h1: 'Termos de uso',
  lead: 'As regras de uso do site e o alcance do conteúdo.',
  content: `<h2>Sobre o conteúdo</h2>
  <p>O conteúdo da Yooka é informativo e não substitui advice jurídico, contábil, médico ou de segurança da informação. Preços, planos e recursos de terceiros mudam: confirme no site oficial antes de contratar.</p>
  <h2>Links de afiliado</h2>
  <p>Alguns links são de afiliado. Se você comprar por eles, podemos receber uma comissão, sem custo adicional para você. Isso não altera nossa avaliação.</p>
  <h2>Uso do conteúdo</h2>
  <p>Os textos podem ser citados com crédito e link. Reprodução integral exige autorização prévia.</p>
  <h2>Limitação de responsabilidade</h2>
  <p>Não nos responsabilizamos por danos decorrentes do uso de ferramentas de terceiros citadas, nem por decisões tomadas com base no conteúdo.</p>`,
});

/* ------------------------------------------------------------------ *
 * Sitemap, robots, RSS, busca, 404
 * ------------------------------------------------------------------ */
function writeSitemap() {
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) => `  <url>
    <loc>${site.url.replace(/\/$/, '')}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(OUT, 'sitemap-index.xml'), xml.replace('<urlset', '<sitemapindex').replace(/<\/urlset>/, '</sitemapindex>'));
}

function writeRobots() {
  const robots = `User-agent: *
Allow: /
Disallow: /busca/

# Bots de IA generativos — permita a leitura (o conteúdo é público e citation-friendly)
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${site.url.replace(/\/$/, '')}/sitemap.xml
`;
  fs.writeFileSync(path.join(OUT, 'robots.txt'), robots);
}

function writeRss() {
  const items = allArticles
    .slice(0, 30)
    .map(
      (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${site.url.replace(/\/$/, '')}${a.url}</link>
      <guid isPermaLink="true">${site.url.replace(/\/$/, '')}${a.url}</guid>
      <description><![CDATA[${a.description}]]></description>
      <category><![CDATA[${catLabel(a.category)}]]></category>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name}</title>
    <link>${site.url}</link>
    <description><![CDATA[${site.description}]]></description>
    <language>pt-br</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(OUT, 'rss.xml'), xml);
}

function writeSearchIndex() {
  const idx = [
    ...allArticles.map((a) => ({ t: a.title, d: a.description, u: a.url, k: 'guia', c: catLabel(a.category) })),
    ...allComparisons.map((a) => ({ t: a.title, d: a.description, u: a.url, k: 'comparativo', c: catLabel(a.category) })),
    ...allTools.map((t) => ({ t: t.name, d: t.tagline || t.description, u: t.url, k: 'ferramenta', c: catLabel(t.category) })),
    ...glossary.map((g) => ({ t: g.term, d: g.short, u: `/glossario/${g.slug}/`, k: 'glossário', c: 'Glossário' })),
  ];
  fs.writeFileSync(path.join(OUT, 'search-index.json'), JSON.stringify(idx));
}

function writeAdsTxt() {
  const client = site.adsense.client.replace(/^ca-/, '');
  const line = client
    ? `google.com, ${client}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense ainda não configurado — defina ADSENSE_CLIENT no build.\n';
  fs.writeFileSync(path.join(OUT, 'ads.txt'), line);
}

function writeOgManifest() {
  fs.writeFileSync(path.join(OUT, 'og-manifest.json'), JSON.stringify(ogManifest, null, 2));
}

function writeManifest() {
  fs.writeFileSync(
    path.join(OUT, 'manifest.webmanifest'),
    JSON.stringify(
      {
        name: site.name,
        short_name: site.name,
        description: site.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#0b1020',
        theme_color: site.themeColor,
        icons: [{ src: '/assets/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      null,
      2
    )
  );
}

function write404() {
  const page = {
    url: '/404.html',
    title: 'Página não encontrada',
    description: 'A página que você procura não existe — ou mudou de endereço.',
    noindex: true,
    schemas: [organizationSchema()],
  };
  const body = `
<section class="listing listing--narrow">
  <header class="listing__head">
    <h1>Não achamos essa página</h1>
    <p class="listing__lead">O endereço pode ter mudado. Use a busca ou pule para um dos caminhos abaixo.</p>
    ${searchBox()}
  </header>
  <div class="grid grid--3">
    ${allArticles.slice(0, 6).map((a) => articleCard(a)).join('\n    ')}
  </div>
</section>`;
  emit('404.html', layout(page, body, { noindex: true }));
}

function copyOgImages() {
  const src = path.join(ROOT, 'og');
  if (!fs.existsSync(src)) return;
  const dest = path.join(OUT, 'assets', 'og');
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    if (f.endsWith('.png') || f.endsWith('.jpg')) fs.copyFileSync(path.join(src, f), path.join(dest, f));
  }
}

function copyStatic() {
  const src = path.join(ROOT, cfg.staticDir);
  if (!fs.existsSync(src)) return;
  const walk = (dir, dest) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const s = path.join(dir, entry.name);
      const d = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(d, { recursive: true });
        walk(s, d);
      } else {
        fs.copyFileSync(s, d);
      }
    }
  };
  const dest = path.join(OUT, 'assets');
  fs.mkdirSync(dest, { recursive: true });
  walk(src, dest);
}

/* ------------------------------------------------------------------ *
 * Execução
 * ------------------------------------------------------------------ */
copyStatic();
copyOgImages();
writeSitemap();
writeRobots();
writeRss();
writeSearchIndex();
writeManifest();
writeAdsTxt();
writeOgManifest();
write404();

const stats = {
  artigos: allArticles.length,
  comparativos: allComparisons.length,
  ferramentas: allTools.length,
  paginas: pages.length + 1,
  palavras: allContent.reduce((s, a) => s + a.wordCount, 0),
};

console.log(`\n  ${site.name} — build concluído`);
console.log(`  ├─ ${stats.artigos} artigos · ${stats.comparativos} comparativos · ${stats.ferramentas} ferramentas`);
console.log(`  ├─ ${stats.paginas} páginas · ${stats.palavras.toLocaleString('pt-BR')} palavras`);
console.log(`  └─ saída em ${cfg.outDir}/\n`);
