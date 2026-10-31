import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, build as cfg } from './src/site.config.js';
import { readMarkdown, renderMarkdown, extractHeadings, textToHtml } from './src/lib/markdown.js';
import { slugify, escapeHtml, truncate, stripHtml, urlPath, isoDate, ptBrDate, readingTime, uniq } from './src/lib/utils.js';
import {
  layout, breadcrumbs, articleCard, adSlot, offerBox, faqBlock, toc,
  comparisonTable, hero, searchBox, authorBox, updatedBox, trustBar, answerBox, shareBar,
} from './src/lib/templates.js';
import {
  organizationSchema, websiteSchema, articleSchema, faqSchema,
  itemListSchema, softwareAppSchema, howToSchema, breadcrumbSchema,
} from './src/lib/seo.js';
import { calculatorsEn } from './src/content/calculators-en.js';
import { computeOutputs } from './src/static/assets/calc-core.js';

const calculators = calculatorsEn || [];

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
  return listFiles('articles-en', '.md')
    .map((f) => {
      const { data, content } = readMarkdown(f);
      const slug = data.slug || path.basename(f, '.md');
      const html = renderMarkdown(content);
      return {
        type: 'article',
        slug,
        url: `/guides/${slug}/`,
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
  return listFiles('comparisons-en', '.md')
    .map((f) => {
      const { data, content } = readMarkdown(f);
      const slug = data.slug || path.basename(f, '.md');
      const html = renderMarkdown(content);
      const tools = (data.tools || []).map((t) => ({
        ...t,
        url: t.pageUrl || `/tools/${slugify(t.name)}/`,
      }));
      return {
        type: 'comparison',
        slug,
        url: `/comparisons/${slug}/`,
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
  return listFiles('tools-en', '.json')
    .map((f) => {
      try {
        const t = readJSON(f);
        t.__file = f;
        return t;
      } catch (e) {
        // Arquivo em edição (JSON inválido): pula em vez de quebrar o build.
        console.warn(`  aviso: ${path.basename(f)} inválido, ignorado`);
        return null;
      }
    })
    .filter(Boolean)
    .map((t) => ({
      ...t,
      slug: t.slug || path.basename(t.__file, '.json'),
      url: `/tools/${t.slug || path.basename(t.__file, '.json')}/`,
      updated: t.updated || TODAY,
    }));
}

const categories = readJSON(path.join(CONTENT, 'categories-en.json'));
const glossary = readJSON(path.join(CONTENT, 'glossary-en.json'), []);
const globalFaq = readJSON(path.join(CONTENT, 'faq-en.json'), []);

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
    const temImagem = fs.existsSync(path.join(ROOT, 'og', ogFile));
    // Se a imagem ainda não foi gerada, usa a padrão para não deixar
    // uma URL de Open Graph quebrada.
    page.image = temImagem ? `/assets/og/${ogFile}` : '/assets/og/og-default.jpg';
    ogManifest.push({
      file: ogFile,
      title: og.title || page.title,
      subtitle: og.subtitle || page.description,
      badge: og.badge || '',
      footer: og.footer || 'Trabalho, renda e burocracia do brasileiro',
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
    { label: 'Guides', href: '/guides/' },
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

  const calcList = calculators.filter((c) => (c.relatedGuides || []).includes(a.slug));

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
      ${
        calcList.length
          ? `<section class="related">
        <h2>Run the numbers</h2>
        <div class="grid grid--2">
          ${calcList
            .map(
              (c) => `<article class="card card--calc">
            <div class="card__body">
              <h3 class="card__title"><a href="/calculators/${c.slug}/">${escapeHtml(c.title)}</a></h3>
              <p class="card__desc">${escapeHtml(c.description)}</p>
              <p class="card__meta"><span>${escapeHtml(c.badge || 'Free')}</span><span>·</span><span>no signup</span></p>
            </div>
          </article>`
            )
            .join('\n          ')}
        </div>
      </section>`
          : ''
      }
      ${a.faq.length ? `<section class="post__faq">
        <h2>Frequently asked questions</h2>
        ${faqBlock(a.faq)}
      </section>` : ''}
      ${shareBar({
        url: site.url.replace(/\/$/, '') + a.url,
        title: a.title,
        text: a.description,
      })}
      ${authorBox()}
      ${offerForCategory(a.category)}
      ${
        related.length
          ? `<section class="related">
        <h2>Keep reading</h2>
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
      ${offerForCategory(a.category)}
    </aside>
  </div>
</article>`;

  addPage({
    file: `guides/${a.slug}/index.html`,
    page,
    body,
    og: { badge: catLabel(a.category), title: a.title, subtitle: a.description },
  });
}

function comparisonPage(c) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Comparativos', href: '/comparisons/' },
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

      ${c.faq.length ? `<section class="post__faq"><h2>Frequently asked questions</h2>${faqBlock(c.faq)}</section>` : ''}

      <section class="verdict">
        <h2>Verdict</h2>
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
    file: `comparisons/${c.slug}/index.html`,
    page,
    body,
    og: { badge: `Comparativo · ${catLabel(c.category)}`, title: c.title, subtitle: c.description },
  });
}

function toolPage(t) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Tools', href: '/tools/' },
    { label: t.name, href: t.url },
  ];
  const alts = (t.alternatives || []).map((s) => allTools.find((x) => x.slug === s)).filter(Boolean);

  // Guias relacionados: mantém o PageRank circulando e aumenta a profundidade do crawl.
  const relatedGuides = allArticles
    .filter((a) => a.category === t.category || a.tags.some((tag) => t.name.toLowerCase().includes(String(tag).toLowerCase())))
    .slice(0, 4);

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
          <p class="buybox__label">Pricing</p>
          <p class="buybox__price">${escapeHtml(t.price || 'Consulte')}</p>
          <p class="muted">${escapeHtml(t.priceNote || '')}</p>
        </div>
        <div class="buybox__side">
          <p class="buybox__label">Best for</p>
          <p>${escapeHtml(t.bestFor || '')}</p>
          <a class="btn btn--primary" href="${t.affiliateUrl || t.url}" rel="nofollow noopener">See official pricing</a>
          <p class="muted tiny">Affiliate link. Yooka is not sponsored by the vendor.</p>
        </div>
      </section>

      ${answerBox(`O que é ${t.name}?`, `<p>${escapeHtml(t.description)}</p>`)}

      <h2>Para quem serve</h2>
      <p>${escapeHtml(t.bestForWho || '')}</p>

      <h2>Pros and cons</h2>
      <div class="twocol">
        <div class="pro">
          <h3>Pros</h3>
          <ul class="tick">${(t.pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
        </div>
        <div class="con">
          <h3>Cons</h3>
          <ul class="cross">${(t.cons || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
        </div>
      </div>

      <h2>Key features</h2>
      <div class="table-wrap">
        <table class="cmp">
          <caption>Recursos de ${escapeHtml(t.name)}</caption>
          <thead><tr><th scope="col">Recurso</th><th scope="col">Detalhe</th></tr></thead>
          <tbody>
            ${(t.features || []).map((f) => `<tr><th scope="row">${escapeHtml(f.name)}</th><td>${escapeHtml(f.detail)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2>Real-world use cases</h2>
      <ul class="usecases">
        ${(t.useCases || []).map((u) => `<li>${escapeHtml(u)}</li>`).join('\n        ')}
      </ul>

      ${adSlot('inArticle', 'inline')}

      <section class="verdict">
        <h2>Verdict</h2>
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
        <p><a class="btn btn--ghost btn--sm" href="/tools/${t.slug}/alternatives/">See all alternatives to ${escapeHtml(t.name)}</a></p>
      </section>`
          : ''
      }

      ${offerBox({
        title: `Precisa de ${t.name} funcionando na sua empresa?`,
        text: 'A gente instala, integra e monitora. Você entra no com o time focado no negócio.',
        button: 'Falar com um especialista',
      })}
      <p class="section__more"><a class="btn btn--ghost btn--sm" href="/tools/${t.slug}/price/">See pricing, plans and what lands on the bill →</a></p>
      ${shareBar({
        url: site.url.replace(/\/$/, '') + t.url,
        title: `${t.name}: review, preço e alternativas`,
        text: t.description,
      })}
      ${
        relatedGuides.length
          ? `<section class="related">
        <h2>Guides related to ${escapeHtml(t.name)}</h2>
        <div class="grid grid--2">
          ${relatedGuides.map((g) => articleCard(g)).join('\n          ')}
        </div>
      </section>`
          : ''
      }
      ${authorBox()}
    </div>
    <aside class="post__aside">
      ${adSlot('sidebar', 'sticky')}
      <nav class="toc" aria-label="Nesta página">
        <p class="toc__title">Nesta página</p>
        <ul>
          <li><a href="#prós-e-contras">Prós e contras</a></li>
          <li><a href="#recursos-principais">Recursos principais</a></li>
          <li><a href="#veredito">Verdict</a></li>
        </ul>
      </nav>
    </aside>
  </div>
</article>`;

  addPage({
    file: `tools/${t.slug}/index.html`,
    page,
    body,
    og: { badge: `Ferramenta · ${catLabel(t.category)}`, title: t.name, subtitle: t.tagline || t.description },
  });
}

function toolAlternativesPage(t) {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Tools', href: '/tools/' },
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
        <div class="pro"><h3>Pros</h3><ul class="tick">${(a.pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></div>
        <div class="con"><h3>Cons</h3><ul class="cross">${(a.cons || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></div>
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

  addPage({ file: `tools/${t.slug}/alternatives/index.html`, page, body });
}

/* ------------------------------------------------------------------ *
 * Calculadoras
 * ------------------------------------------------------------------ */
const moneyFmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);
const numFmt = (n) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(n || 0);

function calculatorPage(calc) {
  const url = `/calculators/${calc.slug}/`;
  const values = Object.fromEntries(calc.fields.map((f) => [f.id, f.default]));
  const out = computeOutputs(calc, values);

  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Calculadoras', href: '/calculators/' },
    { label: calc.title, href: url },
  ];

  const faqs = [
    {
      q: `Como usar a calculadora de ${calc.title.replace(/^Calculadora (de|de) /i, '')}?`,
      a: 'Preencha os campos com os seus números. O resultado é calculado na hora, no próprio navegador, sem enviar seus dados para lugar nenhum.',
    },
    {
      q: 'Os valores usados são oficiais?',
      a: 'As tabelas e faixas usadas são de referência (outubro de 2026) e estão descritas na página. Valores de conta, DAS e INSS mudam — confirme sempre na fonte oficial.',
    },
    {
      q: 'Preciso me cadastrar?',
      a: 'Não. A calculadora funciona no signup e sem cookies. Nada do que você digita é enviado ou guardado.',
    },
  ];

  const page = {
    url,
    title: calc.title,
    description: calc.description,
    type: 'website',
    breadcrumbs: crumbs,
    priority: 0.8,
    changefreq: 'monthly',
    schemas: [
      organizationSchema(),
      websiteSchema(),
      {
        '@type': 'WebApplication',
        name: calc.title,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Qualquer (web)',
        url: site.url.replace(/\/$/, '') + url,
        description: calc.description,
        inLanguage: 'pt-BR',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      },
      faqSchema(faqs),
    ],
  };

  const fieldHtml = calc.fields
    .map((f) => {
      if (f.type === 'select') {
        const opts = f.options
          .map((o) => `<option value="${o.value}"${String(o.value) === String(f.default) ? ' selected' : ''}>${escapeHtml(o.label)}</option>`)
          .join('');
        return `<label class="field">
      <span class="field__label">${escapeHtml(f.label)}</span>
      <select data-field="${f.id}" class="field__input">${opts}</select>
      ${f.hint ? `<span class="field__hint">${escapeHtml(f.hint)}</span>` : ''}
    </label>`;
      }
      const step = f.type === 'money' ? '0.01' : '1';
      return `<label class="field">
      <span class="field__label">${escapeHtml(f.label)}</span>
      <span class="field__wrap">
        ${f.type === 'money' ? '<span class="field__prefix">R$</span>' : ''}
        <input data-field="${f.id}" class="field__input" type="number" inputmode="decimal" step="${step}"
          value="${f.default}"${f.min !== undefined ? ` min="${f.min}"` : ''}${f.max !== undefined ? ` max="${f.max}"` : ''}>
      </span>
      ${f.hint ? `<span class="field__hint">${escapeHtml(f.hint)}</span>` : ''}
    </label>`;
    })
    .join('\n    ');

  const main = calc.outputs.find((o) => o.highlight);
  const resultRows = calc.outputs
    .filter((o) => !o.hidden && !o.highlight)
    .map((o) => {
      const v = out[o.id] || 0;
      const label = o.id === 'faixa' ? (out['faixa__label'] || '') : o.label;
      const formatted = o.money ? moneyFmt(v) : numFmt(v);
      return `<div class="result__row">
      <span class="result__label">${escapeHtml(label)}</span>
      <span class="result__value" data-out="${o.id}">${formatted}</span>
    </div>`;
    })
    .join('\n    ');

  const mainValue = main ? (main.money ? moneyFmt(out[main.id]) : numFmt(out[main.id])) : '';

  const guides = (calc.relatedGuides || [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter(Boolean);

  const json = JSON.stringify(calc).replace(/</g, '\\u003c');

  const body = `
${breadcrumbs(crumbs)}
<article class="post post--calc">
  <header class="post__head">
    <p class="pill">${escapeHtml(calc.badge || 'Calculadora gratuita')}</p>
    <h1>${escapeHtml(calc.title)}</h1>
    <p class="post__lead">${escapeHtml(calc.description)}</p>
    <div class="post__meta">${updatedBox(TODAY)}</div>
  </header>

  <div class="post__layout">
    <div class="post__content">
      <div class="answerbox">
        <p class="answerbox__label">Como funciona</p>
        <p>${escapeHtml(calc.intro)}</p>
      </div>

      <section class="calc" id="calc">
        <div class="calc__fields">
    ${fieldHtml}
        </div>
        <div class="calc__result">
          <p class="calc__resultlabel">${escapeHtml(main ? main.label : 'Resultado')}</p>
          <p class="calc__main" data-out-main>${mainValue}</p>
          <div class="calc__rows">
    ${resultRows}
          </div>
          <p class="calc__disclaimer">Cálculo de referência (outubro de 2026). Confirme os valores na fonte oficial antes de tomar decisão.</p>
          <button type="button" class="btn btn--ghost btn--sm calc__share" data-share-result>Compartilhar meu resultado</button>
        </div>
      </section>

      ${shareBar({
        url: site.url.replace(/\/$/, '') + url,
        title: calc.title,
        text: calc.description,
      })}

      <h2>How to read the result</h2>
      <ul>
        ${(calc.notes || []).map((n) => `<li>${escapeHtml(n)}</li>`).join('\n        ')}
      </ul>

      ${adSlot('inArticle', 'inline')}

      ${
        guides.length
          ? `<section class="related">
        <h2>Related guides</h2>
        <div class="grid grid--2">
          ${guides.map((g) => articleCard(g)).join('\n          ')}
        </div>
      </section>`
          : ''
      }

      ${faqBlock(faqs)}

      ${offerBox({
        title: 'Quer revisar esse número com um profissional?',
        text: 'Contador, advogado ou consultor: a Yooka explica o processo e você decide com quem contar.',
        button: 'Talk to the team',
      })}
    </div>
    <aside class="post__aside">
      ${adSlot('sidebar', 'sticky')}
      <nav class="toc" aria-label="Nesta página">
        <p class="toc__title">Nesta página</p>
        <ul>
          <li><a href="#calc">Calculadora</a></li>
          <li><a href="#como-interpretar-o-resultado">Como interpretar</a></li>
        </ul>
      </nav>
    </aside>
  </div>
</article>
<script type="application/json" id="calc-data">${json}</script>
<script type="module" src="/assets/calculator.js"></script>`;

  addPage({
    file: `calculators/${calc.slug}/index.html`,
    page,
    body,
    og: { badge: calc.badge || 'Calculadora grátis', title: calc.title, subtitle: calc.description },
  });
}

function calculatorsIndex() {
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Calculadoras', href: '/calculators/' },
  ];
  const page = {
    url: '/calculators/',
    title: 'Free calculators: net salary, VAT, markup, break-even and freelance rates',
    description:
      'Calculadoras gratuitas para trabalho, MEI e negócio: 13º salário, férias, verbas rescisórias, DAS do MEI, preço de venda e orçamento mensal. Resultado na hora, no signup.',
    breadcrumbs: crumbs,
    priority: 0.9,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(calculators.map((c) => ({ title: c.title, url: `/calculators/${c.slug}/` })), 'Calculadoras da Yooka', '/calculators/'),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<section class="listing">
  <header class="listing__head">
    <p class="pill">Free tools</p>
    <h1>Calculators</h1>
    <p class="listing__lead">${calculators.length} calculators for the numbers you need right now. No signup, no data sent anywhere, instant results.</p>
  </header>
  <div class="grid grid--2">
    ${calculators
      .map(
        (c) => `<article class="card card--calc">
      <div class="card__body">
        <span class="card__tag">${escapeHtml(catLabel(c.category))}</span>
        <h3 class="card__title"><a href="/calculators/${c.slug}/">${escapeHtml(c.title)}</a></h3>
        <p class="card__desc">${escapeHtml(c.description)}</p>
        <p class="card__meta"><span>${escapeHtml(c.badge || 'Grátis')}</span></p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
</section>
${adSlot('leaderboard', 'inline')}
${offerBox()}`;

  addPage({ file: 'calculators/index.html', page, body });
}

/* ------------------------------------------------------------------ *
 * Atalhos oficiais e modelos de documento
 * ------------------------------------------------------------------ */


function atalhosPage() {
  const url = '/atalhos/';
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Atalhos', href: url },
  ];
  const total = atalhos.groups.reduce((s, g) => s + g.links.length, 0);

  const page = {
    url,
    title: 'Atalhos oficiais: os links do gov.br que você mais precisa',
    description:
      `Diretório com ${total} links oficiais do governo federal para INSS, FGTS, CTPS, MEI, DAS, NFS-e, certidões, Pix e Second. Todos verificados, sem propaganda.`,
    breadcrumbs: crumbs,
    priority: 0.8,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(
        atalhos.groups.flatMap((g) => g.links.map((l) => ({ title: l.name, url: l.url }))),
        'Atalhos oficiais do governo federal',
        url
      ),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<section class="listing">
  <header class="listing__head">
    <p class="pill">Directory</p>
    <h1>Atalhos oficiais</h1>
    <p class="listing__lead">${total} links do gov.br, do Banco Central e dos órgãos oficiais, organizados pelo serviço que você precisa. Sem propaganda no meio.</p>
  </header>
  ${atalhos.groups
    .map(
      (g) => `<section class="atalhos__group">
    <h2>${escapeHtml(g.name)}</h2>
    <p class="muted">${escapeHtml(g.short)}</p>
    <ul class="atalhos__list">
      ${g.links
        .map(
          (l) => `<li class="atalhos__item">
        <a href="${l.url}" rel="nofollow noopener external">${escapeHtml(l.name)}</a>
        <p>${escapeHtml(l.desc)}</p>
        <span class="atalhos__host">${escapeHtml(new URL(l.url).hostname)}</span>
      </li>`
        )
        .join('\n      ')}
    </ul>
  </section>`
    )
    .join('\n')}

  <section class="answerbox">
    <p class="answerbox__label">Como usar</p>
    <p>Salve esta página nos favoritos. Em qualquer serviço público, o primeiro passo é o portal oficial — e_LINK para intermediário aumenta o risco de cair em golpe.</p>
  </section>
</section>
${adSlot('leaderboard', 'inline')}
${offerBox()}`;

  addPage({
    file: 'atalhos/index.html',
    page,
    body,
    og: {
      badge: 'Diretório',
      title: 'Atalhos oficiais: os links do gov.br que você mais precisa',
      subtitle: `${total} links oficiais organized por serviço.`,
    },
  });
}

function modeloPage(m) {
  const url = `/modelos/${m.slug}/`;
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Modelos', href: '/modelos/' },
    { label: m.title, href: url },
  ];

  const page = {
    url,
    title: `${m.title} (modelo pronto para copiar)`,
    description: truncate(m.when, 158),
    breadcrumbs: crumbs,
    priority: 0.7,
    schemas: [organizationSchema(), websiteSchema()],
  };

  const related = allArticles
    .filter((a) => a.category === m.category)
    .slice(0, 3);

  const body = `
${breadcrumbs(crumbs)}
<article class="post post--modelo">
  <header class="post__head">
    <a class="pill" href="/modelos/">Modelo</a>
    <h1>${escapeHtml(m.title)}</h1>
    <p class="post__lead">${escapeHtml(m.when)}</p>
    <div class="post__meta">${updatedBox(TODAY)}</div>
  </header>

  <div class="post__layout">
    <div class="post__content">
      <section class="answerbox">
        <p class="answerbox__label">Quando usar</p>
        <p>${escapeHtml(m.when)}</p>
      </section>

      <h2>Como usar</h2>
      <ol>
        ${m.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('\n        ')}
      </ol>

      <h2>O modelo</h2>
      <div class="modelo">
        <pre><code>${escapeHtml(m.text)}</code></pre>
        <button type="button" class="btn btn--ghost btn--sm modelo__copy" data-copy-target="modelo-texto">Copiar texto</button>
      </div>
      <p class="muted tiny" id="modelo-texto" hidden></p>

      <section class="answerbox answerbox--winner">
        <p class="answerbox__label">Antes de enviar</p>
        <p>Troque todos os campos entre colchetes pelos seus dados, revise o texto e guarde o protocolo. Em caso de valor relevante ou de邊 controvérsia jurídica, peça revisão de um advogado ou contador antes de enviar.</p>
      </section>

      ${adSlot('inArticle', 'inline')}

      ${
        related.length
          ? `<section class="related">
        <h2>Related guides</h2>
        <div class="grid grid--3">
          ${related.map((g) => articleCard(g)).join('\n          ')}
        </div>
      </section>`
          : ''
      }
    </div>
    <aside class="post__aside">
      ${adSlot('sidebar', 'sticky')}
      <nav class="toc" aria-label="Nesta página">
        <p class="toc__title">Nesta página</p>
        <ul>
          <li><a href="#como-usar">Como usar</a></li>
          <li><a href="#o-modelo">O modelo</a></li>
        </ul>
      </nav>
    </aside>
  </div>
</article>`;

  addPage({
    file: `modelos/${m.slug}/index.html`,
    page,
    body,
    og: { badge: 'Modelo pronto', title: m.title, subtitle: m.when },
  });
}

function modelosPage() {
  const url = '/modelos/';
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Modelos', href: url },
  ];
  const page = {
    url,
    title: 'Modelos de documento: escreva e copie',
    description:
      'Modelos prontos para copiar: contestar conta, requerer revisão de benefício do INSS, pedir segunda via e negociar parcelamento.',
    breadcrumbs: crumbs,
    priority: 0.8,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(modelos.templates.map((m) => ({ title: m.title, url: `/modelos/${m.slug}/` })), 'Modelos de documento', url),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<section class="listing">
  <header class="listing__head">
    <p class="pill">Copie e adapte</p>
    <h1>Modelos de documento</h1>
    <p class="listing__lead">${modelos.templates.length} modelos prontos para copiar, trocar os campos entre colchetes e enviar. São modelos genéricos: adapte ao seu caso.</p>
  </header>
  <div class="grid grid--2">
    ${modelos.templates
      .map(
        (m) => `<article class="card card--modelo">
      <div class="card__body">
        <h3 class="card__title"><a href="/modelos/${m.slug}/">${escapeHtml(m.title)}</a></h3>
        <p class="card__desc">${escapeHtml(m.when)}</p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
</section>
${adSlot('leaderboard', 'inline')}
${offerBox()}`;

  addPage({
    file: 'modelos/index.html',
    page,
    body,
    og: { badge: 'Modelos', title: 'Modelos de documento: escreva e copie', subtitle: 'Prontos para copiar, adaptar e enviar.' },
  });
}

/* ------------------------------------------------------------------ *
 * Páginas programáticas: pares de ferramentas e páginas de preço
 * ------------------------------------------------------------------ */

/** Verdadeiro se o par já tem página manual, em qualquer ordem. */
const hasManual = (a, b) =>
  allComparisons.some((c) => c.slug === `${a}-vs-${b}` || c.slug === `${b}-vs-${a}`);

/** Pares que fazem sentido comparar (mesma categoria ou categoria vizinha). */
function toolPairs() {
  const pairs = [];
  const seen = new Set();
  for (let i = 0; i < allTools.length; i++) {
    for (let j = i + 1; j < allTools.length; j++) {
      const a = allTools[i];
      const b = allTools[j];
      if (hasManual(a.slug, b.slug)) continue;
      const sameCat = a.category === b.category;
      const adjacent =
        ['agentes-de-ia', 'automacao'].includes(a.category) &&
        ['agentes-de-ia', 'automacao'].includes(b.category);
      if (!sameCat && !adjacent) continue;
      const key = [a.slug, b.slug].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a, b, slug: `${a.slug}-vs-${b.slug}`, sameCat });
    }
  }
  return pairs;
}

function pairComparisonPage({ a, b, slug, sameCat }) {
  const winner = (a.rating || 0) >= (b.rating || 0) ? a : b;
  const loser = winner === a ? b : a;
  const title = `${a.name} x ${b.name}: qual escolher em 2026?`;
  const description = `${a.name} ou ${b.name}? Comparamos preço, facilidade, integrações e casos de uso para você escolher sem teste de 30 dias.`;
  const url = `/comparisons/${slug}/`;
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Comparativos', href: '/comparisons/' },
    { label: `${a.name} x ${b.name}`, href: url },
  ];

  const page = {
    url,
    title,
    description,
    type: 'article',
    publishedAt: isoDate(TODAY),
    modifiedAt: isoDate(TODAY),
    section: catLabel(a.category),
    breadcrumbs: crumbs,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      articleSchema({
        title,
        description,
        url,
        publishedAt: isoDate(TODAY),
        modifiedAt: isoDate(TODAY),
        keywords: [a.name, b.name, 'comparativo'],
        wordCount: 700,
      }),
      faqSchema([
        {
          q: `Qual é melhor, ${a.name} ou ${b.name}?`,
          a: `Para a maioria das pequenas e médias empresas, ${winner.name}. ${winner.bestFor}. ${loser.name} continua sendo a melhor escolha quando o time não tem perfil técnico.`,
        },
        {
          q: `Quanto custa ${a.name}?`,
          a: `${a.name} parte de ${a.price}. Consulte a página oficial para o valor atual — planos mudam com frequência.`,
        },
        {
          q: `Posso usar ${a.name} e ${b.name} juntos?`,
          a: `Pode, e em muitos casos é o melhor arranjo: use ${winner.name} como motor principal e integre ${loser.name} para os pontos em que ele é mais forte.`,
        },
        {
          q: `Qual dessas ferramentas tem melhor suporte em português?`,
          a: `As duas têm documentação em inglês. Para suporte em português, procure um parceiro ou um profissional que implemente para você — a Yooka indica as ferramentas, mas não presta esse serviço.`,
        },
      ]),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<article class="post post--comparison">
  <header class="post__head">
    <a class="pill" href="/comparisons/">Comparativo</a>
    <h1>${escapeHtml(title)}</h1>
    <p class="post__lead">${escapeHtml(description)}</p>
    <div class="post__meta">
      ${updatedBox(TODAY)}
      <span>${escapeHtml(catLabel(a.category))}</span>
    </div>
    ${trustBar(['Critérios objetivos', 'Preços verificados', 'Verdict em 1 minuto'])}
  </header>

  <div class="post__layout">
    <div class="post__content">
      <section class="answerbox answerbox--winner">
        <p class="answerbox__label">Resposta curta</p>
        <h2>${escapeHtml(winner.name)} vence para ${escapeHtml((winner.bestFor || '').toLowerCase())}</h2>
        <p>${escapeHtml(winner.verdict || '')}</p>
        <a class="btn btn--primary btn--sm" href="${winner.affiliateUrl || winner.url}" rel="nofollow noopener">Ver ${escapeHtml(winner.name)}</a>
      </section>

      <div class="table-wrap">
        <table class="cmp cmp--big">
          <caption>${escapeHtml(a.name)} x ${escapeHtml(b.name)} — lado a lado</caption>
          <thead>
            <tr>
              <th scope="col">Critério</th>
              <th scope="col">${escapeHtml(a.name)}</th>
              <th scope="col">${escapeHtml(b.name)}</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Preço</th><td>${escapeHtml(a.price || '—')}</td><td>${escapeHtml(b.price || '—')}</td></tr>
            <tr><th scope="row">Melhor para</th><td>${escapeHtml(a.bestFor || '—')}</td><td>${escapeHtml(b.bestFor || '—')}</td></tr>
            <tr><th scope="row">Nota Yooka</th><td><span class="stars">${'★'.repeat(Math.round(a.rating || 0))}${'☆'.repeat(5 - Math.round(a.rating || 0))}</span> <span class="muted">${a.rating}</span></td><td><span class="stars">${'★'.repeat(Math.round(b.rating || 0))}${'☆'.repeat(5 - Math.round(b.rating || 0))}</span> <span class="muted">${b.rating}</span></td></tr>
            <tr><th scope="row">Prós</th><td><ul class="tick">${(a.pros || []).slice(0, 3).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></td><td><ul class="tick">${(b.pros || []).slice(0, 3).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></td></tr>
            <tr><th scope="row">Contras</th><td><ul class="cross">${(a.cons || []).slice(0, 3).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></td><td><ul class="cross">${(b.cons || []).slice(0, 3).map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></td></tr>
            <tr><th scope="row">Ação</th><td><a class="btn btn--ghost btn--xs" href="${a.affiliateUrl || a.url}" rel="nofollow noopener">Ver preço</a></td><td><a class="btn btn--ghost btn--xs" href="${b.affiliateUrl || b.url}" rel="nofollow noopener">Ver preço</a></td></tr>
          </tbody>
        </table>
      </div>

      <h2>${escapeHtml(a.name)}: quando escolher</h2>
      <p>${escapeHtml(a.tagline || '')}. ${escapeHtml(a.bestForWho || '')}</p>
      <ul class="usecases">
        ${(a.useCases || []).slice(0, 3).map((u) => `<li>${escapeHtml(u)}</li>`).join('\n        ')}
      </ul>

      <h2>${escapeHtml(b.name)}: quando escolher</h2>
      <p>${escapeHtml(b.tagline || '')}. ${escapeHtml(b.bestForWho || '')}</p>
      <ul class="usecases">
        ${(b.useCases || []).slice(0, 3).map((u) => `<li>${escapeHtml(u)}</li>`).join('\n        ')}
      </ul>

      <h2>Preço: o que muda no total</h2>
      <p>${escapeHtml(a.name)} parte de <strong>${escapeHtml(a.price || '—')}</strong> e ${escapeHtml(b.name)} de <strong>${escapeHtml(b.price || '—')}</strong>. O que costuma decidir o custo final não é a mensalidade: é o número de execuções por mês e quanto de cada etapa roda dentro de um modelo de IA. Times que têm volume alto de tarefas com LLM precisam olhar o custo por execução, não só o plano.</p>
      <p class="muted">Preços verificados em ${ptBrDate(TODAY)}. Planos mudam — confirme no site oficial.</p>

      ${adSlot('inArticle', 'inline')}

      <section class="verdict">
        <h2>Verdict</h2>
        <p><strong>${escapeHtml(winner.name)}</strong> é a escolha para ${escapeHtml((winner.bestFor || 'a maioria dos casos').toLowerCase())}. ${escapeHtml(winner.verdict || '')}</p>
        <p><strong>${escapeHtml(loser.name)}</strong> continua valendo quando ${escapeHtml((loser.bestFor || 'o time não tem perfil técnico').toLowerCase())}. Não é derrota: é encaixe.</p>
      </section>

      ${authorBox()}
      ${offerBox({
        title: `Não sabe qual das duas implanta na sua empresa?`,
        text: 'Descrevemos o processo e devolvemos a comparação com os seus números: volume, integrações e time.',
        button: 'Pedir recomendação',
      })}
    </div>
    <aside class="post__aside">
      ${adSlot('sidebar', 'sticky')}
      <nav class="toc" aria-label="Nesta página">
        <p class="toc__title">Nesta página</p>
        <ul>
          <li><a href="#resposta-curta">Resposta curta</a></li>
          <li><a href="#preco-o-que-muda-no-total">Preço</a></li>
          <li><a href="#veredito">Verdict</a></li>
        </ul>
      </nav>
    </aside>
  </div>
</article>`;

  addPage({
    file: `comparisons/${slug}/index.html`,
    page,
    body,
    og: { badge: 'Comparativo', title, subtitle: description },
  });
}

function toolPricePage(t) {
  const url = `/tools/${t.slug}/price/`;
  const title = `Preço do ${t.name} em 2026: planos, valores e quanto custa`;
  const description = `Preço do ${t.name}: planos disponíveis, custo por execução e o que muda no total da conta. Valores verificados em ${ptBrDate(TODAY)}.`;
  const crumbs = [
    { label: 'Início', href: '/' },
    { label: 'Tools', href: '/tools/' },
    { label: t.name, href: t.url },
    { label: 'Preço', href: url },
  ];

  const page = {
    url,
    title,
    description,
    type: 'article',
    publishedAt: isoDate(t.updated),
    modifiedAt: isoDate(t.updated),
    section: catLabel(t.category),
    breadcrumbs: crumbs,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      articleSchema({
        title,
        description,
        url,
        publishedAt: isoDate(t.updated),
        modifiedAt: isoDate(t.updated),
        keywords: [`preço ${t.name}`, `${t.name} pricing`, 'planos'],
        wordCount: 500,
      }),
      faqSchema([
        { q: `Quanto custa o ${t.name}?`, a: `${t.name} parte de ${t.price}. ${t.priceNote || ''}` },
        { q: `Existe plano grátis do ${t.name}?`, a: `Em geral sim, com limites de uso. ${t.priceNote || 'Confira a página oficial.'}` },
        { q: `O preço do ${t.name} muda com o uso da API?`, a: `Costos de modelo de IA são cobrados à parte, na maioria das ferramentas. O plano cobre a plataforma; o consumo de tokens é um item separado.` },
      ]),
    ],
  };

  const body = `
${breadcrumbs(crumbs)}
<article class="post">
  <header class="post__head">
    <a class="pill" href="${t.url}">${escapeHtml(t.name)}</a>
    <h1>${escapeHtml(title)}</h1>
    <p class="post__lead">${escapeHtml(description)}</p>
    <div class="post__meta">${updatedBox(t.updated)}</div>
    ${trustBar(['Preço verificado', 'Sem cadeias de marketing'])}
  </header>
  <div class="post__layout">
    <div class="post__content">
      <section class="buybox">
        <div class="buybox__main">
          <p class="buybox__label">Current pricing</p>
          <p class="buybox__price">${escapeHtml(t.price || 'Consulte')}</p>
          <p class="muted">${escapeHtml(t.priceNote || '')}</p>
        </div>
        <div class="buybox__side">
          <p class="buybox__label">Best for</p>
          <p>${escapeHtml(t.bestFor || '')}</p>
          <a class="btn btn--primary" href="${t.affiliateUrl || t.url}" rel="nofollow noopener">See official pricing</a>
        </div>
      </section>

      <h2>Como o preço é calculado</h2>
      <p>O valor que você vê não é o valor que você paga. Uma ferramenta de automação ou de IA costuma cobrar em três partes: a plataforma (mensalidade), o volume de execuções ou de assentos, e o consumo de modelo de IA — tokens de entrada e saída, que em geral é cobrado do lado do provedor do modelo, fora da ferramenta.</p>
      <p>Para uma empresa que está avaliando, a conta é esta: <strong>plano + execuções excedentes + tokens consumidos</strong>. É por isso que duas empresas com times do mesmo tamanho podem pagar valores muito diferentes na mesma ferramenta.</p>

      <div class="table-wrap">
        <table class="cmp">
          <caption>O que costuma compor a conta do ${escapeHtml(t.name)}</caption>
          <thead><tr><th scope="col">Item</th><th scope="col">Como é cobrado</th><th scope="col">Como reduzir</th></tr></thead>
          <tbody>
            <tr><th scope="row">Plano</th><td>Mensalidade por assento ou por workspace</td><td>Contrate só quem usa, revise assentos ociosos</td></tr>
            <tr><th scope="row">Execuções</th><td>Por tarefa disparada (toda vez que o fluxo roda)</td><td>Consolide etapas, evite loops desnecessários</td></tr>
            <tr><th scope="row">Tokens de IA</th><td>Por milhão de tokens de entrada e saída</td><td>Use modelo menor para tarefas simples e cache</td></tr>
            <tr><th scope="row">Integrações</th><td>Algumas cobram por app conectado ou por chamada</td><td>Menos integrações, mais diretas</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Quando o ${escapeHtml(t.name)} compensa</h2>
      <p>${escapeHtml(t.bestForWho || '')} ${escapeHtml(t.verdict || '')}</p>

      ${adSlot('inArticle', 'inline')}

      ${faqBlock([
        { q: `Quanto custa o ${t.name}?`, a: `${t.name} parte de ${t.price}. ${t.priceNote || ''}` },
        { q: `Existe plano grátis do ${t.name}?`, a: `Em geral sim, com limites de uso. ${t.priceNote || 'Confira a página oficial.'}` },
        { q: `O preço do ${t.name} muda com o uso da API?`, a: `Custos de modelo de IA são cobrados à parte, na maioria das ferramentas. O plano cobre a plataforma; o consumo de tokens é um item separado.` },
      ])}

      ${authorBox()}
      ${offerBox({
        title: `Quer saber quanto custa o ${t.name} na prática da sua empresa?`,
        text: 'Fazemos a conta com o seu volume real de tarefas e o seu consumo de tokens.',
        button: 'Pedir orçamento',
      })}
    </div>
    <aside class="post__aside">
      ${adSlot('sidebar', 'sticky')}
      <div class="offer offer--compact">
        <div class="offer__text"><h3>Compare antes de contratar</h3><p>Veja o review completo e as alternativas.</p></div>
        <a class="btn btn--ghost btn--sm" href="${t.url}">Review do ${escapeHtml(t.name)}</a>
      </div>
    </aside>
  </div>
</article>`;

  addPage({
    file: `tools/${t.slug}/price/index.html`,
    page,
    body,
    og: { badge: `Preço · ${t.name}`, title, subtitle: description },
  });
}

/* ------------------------------------------------------------------ *
 * Índices e páginas estáticas
 * ------------------------------------------------------------------ */
/** CTA por categoria: cada vertical tem a oferta que faz sentido para ela. */
function offerForCategory(category) {
  switch (category) {
    case 'ai-tools':
      return offerBox({
        title: 'Picking the right AI tool',
        text: 'We compare the main platforms on real pricing, limits and the workflows they handle well — including where the cheaper option wins.',
        button: 'See the tool reviews',
        href: '/tools/',
      });
    case 'automation':
      return offerBox({
        title: 'Wiring it up for real',
        text: 'Comparisons of the main automation platforms, with the price per task, the reliability limits and the honest trade-offs.',
        button: 'See the comparisons',
        href: '/comparisons/',
      });
    case 'marketing':
      return offerBox({
        title: 'Tools that pay for themselves',
        text: 'CRMs, outreach and content tools reviewed on pricing and time saved — with the cases where a spreadsheet is enough.',
        button: 'See the tool reviews',
        href: '/tools/',
      });
    case 'finance':
      return offerBox({
        title: 'Run the numbers first',
        text: 'Free calculators for net salary, VAT, markup, break-even and freelance rates. No signup, no paywall.',
        button: 'Open the calculators',
        href: '/calculators/',
      });
    case 'productivity':
      return offerBox({
        title: 'How much does it really cost?',
        text: 'We compare pricing, per-seat costs and the hidden totals, so you can budget before you commit.',
        button: 'See pricing',
        href: '/pricing/',
      });
    default:
      return offerBox({
        title: 'Free tools, no signup',
        text: 'Calculators for net salary, VAT, markup, break-even, freelance rate and budget planning.',
        button: 'Open the calculators',
        href: '/calculators/',
      });
  }
}

function homePage() {
  const featured = allArticles.filter((a) => a.featured).slice(0, 6);
  const latest = [...allArticles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  const topTools = [...allTools].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);

  const page = {
    url: '/',
    title: `${site.name} — Trabalho, renda e burocracia do brasileiro`,
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
        name: `${site.name} — Trabalho, renda e burocracia do brasileiro`,
        isPartOf: { '@id': site.url + '/#website' },
        about: { '@id': site.url + '/#organization' },
      },
    ],
  };

  const body = `
${hero({
    title: 'Resolva a burocracia que trava a sua vida e o seu negócio',
    subtitle:
      'Passo a passo de serviços públicos, MEI, nota fiscal, CLT e renda extra — com prazo, valor atualizado e o que fazer quando dá errado.',
    ctaPrimary: { label: 'Open the calculators', href: '/calculators/' },
    ctaSecondary: { label: 'AI tools guides', href: '/categorias/ai-tools/' },
    badges: [`${allArticles.length} guias`, `${calculators.length} calculadoras grátis`, `${allTools.length} ferramentas`, 'Sem paywall'],
  })}

<section class="wrap section">
  ${searchBox()}
</section>

<section class="wrap section">
  <div class="section__head">
    <h2>Free calculators</h2>
    <p>The number you need right now, solved on the spot. No signup.</p>
  </div>
  <div class="grid grid--3">
    ${calculators
      .slice(0, 6)
      .map(
        (c) => `<article class="card card--calc">
      <div class="card__body">
        <span class="card__tag">${escapeHtml(catLabel(c.category))}</span>
        <h3 class="card__title"><a href="/calculators/${c.slug}/">${escapeHtml(c.title)}</a></h3>
        <p class="card__desc">${escapeHtml(c.description)}</p>
        <p class="card__meta"><span>${escapeHtml(c.badge || 'Free')}</span><span>·</span><span>no signup</span></p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
  <p class="section__more"><a class="btn btn--ghost" href="/calculators/">Ver todas as ${calculators.length} calculadoras</a></p>
</section>

<section class="wrap section section--alt">
  <div class="section__head">
    <h2>Start here</h2>
    <p>The guides people read most.</p>
  </div>
  <div class="grid grid--3">
    ${featured.map((a) => articleCard(a, { featured: true })).join('\n    ')}
  </div>
</section>

<section class="wrap section">
  <div class="section__head">
    <h2>Browse by topic</h2>
  </div>
  <div class="grid grid--3">
    ${categories
      .map(
        (c) => `<article class="card card--cat">
      <div class="card__body">
        <h3 class="card__title"><a href="/categorias/${c.slug}/">${escapeHtml(c.name)}</a></h3>
        <p class="card__desc">${escapeHtml(c.short)}</p>
        <p class="card__meta">${allArticles.filter((a) => a.category === c.slug).length} guias · ${calculators.filter((x) => x.category === c.slug).length} calculadoras</p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>
</section>

<section class="wrap section section--alt">
  <div class="section__head">
    <h2>Latest</h2>
  </div>
  <div class="grid grid--3">
    ${latest.map((a) => articleCard(a)).join('\n    ')}
  </div>
  <p class="section__more"><a class="btn btn--ghost" href="/guides/">See all guides</a></p>
</section>

<section class="wrap section">
  <div class="section__head">
    <h2>Tool reviews</h2>
    <p>Price, pros, cons and who each one fits.</p>
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
  <p class="section__more"><a class="btn btn--ghost" href="/tools/">See all tools</a></p>
</section>

<section class="wrap section">
  ${adSlot('leaderboard', 'inline')}
  ${offerBox({
    title: "Can't find what you were looking for?",
    text: 'A gente responde dúvidas de INSS, MEI, CLT e renda extra — e atualiza os guias com o que chega de melhor.',
    button: 'Talk to the team',
    href: '/contact/',
  })}
</section>`;

  addPage({
    file: 'index.html',
    page,
    body,
    og: {
      file: 'og-default.jpg',
      badge: 'Trabalho, renda e burocracia',
      title: 'Resolva a burocracia que trava a sua vida e o seu negócio',
      subtitle: 'Passo a passo de serviços públicos, MEI, nota fiscal, CLT e renda extra — com prazo e valor real.',
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
      ? `<div class="section__head"><h2>Comparisons</h2></div>
  <div class="grid grid--2">
    ${comps.map((c) => articleCard(c)).join('\n    ')}
  </div>`
      : ''
  }
  ${
    tools.length
      ? `<div class="section__head"><h2>Tools in this topic</h2></div>
  ${comparisonTable(tools.map((t) => ({ name: t.name, price: t.price, bestFor: t.bestFor, rating: t.rating, url: t.url, affiliateUrl: t.affiliateUrl })))}`
      : ''
  }
  ${
    calculators.filter((c) => c.category === cat.slug).length
      ? `<div class="section__head"><h2>Calculators in this topic</h2></div>
  <div class="grid grid--2">
    ${calculators
      .filter((c) => c.category === cat.slug)
      .map(
        (c) => `<article class="card card--calc">
      <div class="card__body">
        <h3 class="card__title"><a href="/calculators/${c.slug}/">${escapeHtml(c.title)}</a></h3>
        <p class="card__desc">${escapeHtml(c.description)}</p>
        <p class="card__meta"><span>${escapeHtml(c.badge || 'Free')}</span><span>·</span><span>no signup</span></p>
      </div>
    </article>`
      )
      .join('\n    ')}
  </div>`
      : ''
  }
</section>
${adSlot('leaderboard', 'inline')}
${offerForCategory(cat.slug)}`;

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
    <h1>All topics</h1>
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
    url: '/glossary/',
    title: 'Glossário de IA e automação: 40 termos explicados',
    description:
      'Glossário com 40 termos de IA, agentes e automação explicados em português simples: LLM, RAG, guardrail, token, workflow, webhook, MCP e mais.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Glossário', href: '/glossary/' }],
    priority: 0.7,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      itemListSchema(glossary.map((g) => ({ title: g.term, url: `/glossary/${g.slug}/` })), 'Glossário de IA e automação', '/glossary/'),
    ],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>AI and automation glossary</h1>
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
  addPage({ file: 'glossary/index.html', page, body });
}

function glossaryTermPage(g) {
  const related = (g.related || []).map((s) => glossary.find((x) => x.slug === s)).filter(Boolean);
  const page = {
    url: `/glossary/${g.slug}/`,
    title: `${g.term}: o que significa e como usar na prática`,
    description: truncate(g.short, 158),
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Glossário', href: '/glossary/' },
      { label: g.term, href: `/glossary/${g.slug}/` },
    ],
    priority: 0.5,
    schemas: [
      organizationSchema(),
      websiteSchema(),
      {
        '@type': 'DefinedTerm',
        name: g.term,
        description: g.short,
        inDefinedTermSet: site.url + '/glossary/',
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
      ${related.map((r) => `<li><a href="/glossary/${r.slug}/">${escapeHtml(r.term)}</a> — ${escapeHtml(r.short)}</li>`).join('\n      ')}
    </ul></section>`
        : ''
    }
    ${offerBox({ compact: true })}
  </div>
</article>`;
  addPage({ file: `glossary/${g.slug}/index.html`, page, body });
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
    <h1>Frequently asked questions</h1>
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
    url: '/pricing/',
    title: 'Pricing and costs de IA e automação: tabela atualizada',
    description:
      'Tabela de preços de ferramentas de IA e automação, custo por token e por execução, e o cálculo de ROI para saber quando a automação se paga.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Pricing and costs', href: '/pricing/' }],
    priority: 0.8,
    schemas: [organizationSchema(), websiteSchema(), itemListSchema(allTools.map((t) => ({ title: t.name, url: t.url })), 'Preços de ferramentas de IA', '/pricing/')],
  };
  const body = `
${breadcrumbs(page.breadcrumbs)}
<section class="listing">
  <header class="listing__head">
    <h1>Pricing and costs</h1>
    <p class="listing__lead">Quanto custa, de verdade, colocar IA para trabalhar. Tabela de planos, custo por execução e como calcular o retorno.</p>
  </header>
  <div class="section__head"><h2>Tool pricing table</h2><p class="muted">Verificado em ${ptBrDate(TODAY)}. Planos mudam — confirme no site oficial.</p></div>
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
  <div class="section__head"><h2>Cost guides</h2></div>
  <div class="grid grid--3">
    ${allArticles
      .filter((a) => a.category === 'custos' || /custo|preço/i.test(a.title))
      .map((a) => articleCard(a))
      .join('\n    ')}
  </div>
</section>
${offerBox({ title: 'Quer o custo real do seu caso?', text: 'Fazemos a conta com os seus números: volume, tarefas e horas envolvidas.', button: 'Pedir orçamento' })}`;
  addPage({ file: 'pricing/index.html', page, body });
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
allTools.forEach(toolPricePage);

// Comparativos programáticos (pares de ferramentas)
const generatedPairs = toolPairs();
generatedPairs.forEach(pairComparisonPage);

// Calculadoras
calculators.forEach(calculatorPage);
calculatorsIndex();



// Índices
homePage();

listPage({
  url: '/guides/',
  file: 'guides/index.html',
  title: 'Todos os guias de IA e automação',
  description:
    'Guia completo de IA e automação para empresas brasileiras: agentes, ferramentas, custos e implementação passo a passo.',
  items: allArticles,
  breadcrumbsCrumb: { label: 'Guides', href: '/guides/' },
  itemRenderer: (a) => articleCard(a),
  schemas: [itemListSchema(allArticles.map((a) => ({ title: a.title, url: a.url })), 'Guias de IA e automação', '/guides/')],
});

const comparisonIndexItems = [
  ...allComparisons,
  ...generatedPairs.map((p) => ({
    title: `${p.a.name} x ${p.b.name}: qual escolher em 2026?`,
    description: `${p.a.name} ou ${p.b.name}? Comparamos preço, facilidade, integrações e casos de uso para você escolher sem teste de 30 dias.`,
    url: `/comparisons/${p.slug}/`,
    date: TODAY,
    updated: TODAY,
    readingTime: 5,
    category: p.a.category,
    categoryLabel: catLabel(p.a.category),
    tools: [p.a, p.b],
    winner: (p.a.rating || 0) >= (p.b.rating || 0) ? p.a.name : p.b.name,
  })),
];

listPage({
  url: '/comparisons/',
  file: 'comparisons/index.html',
  title: 'Comparativos: X ou Y? Decidimos com critério',
  description:
    'Comparativos diretos entre ferramentas de IA e automação, com preço, curva de aprendizado, integração e o veredito de quem implementa.',
  items: comparisonIndexItems,
  breadcrumbsCrumb: { label: 'Comparativos', href: '/comparisons/' },
  itemRenderer: (a) => articleCard(a),
  schemas: [itemListSchema(comparisonIndexItems.map((a) => ({ title: a.title, url: a.url })), 'Comparativos de ferramentas', '/comparisons/')],
});

listPage({
  url: '/tools/',
  file: 'tools/index.html',
  title: 'Ferramentas de IA e automação: preço, prós, contras',
  description:
    'Catálogo de ferramentas de IA e automação avaliadas: preço, prós, contras, para quem serve e alternativas.',
  items: allTools,
  breadcrumbsCrumb: { label: 'Tools', href: '/tools/' },
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
  schemas: [itemListSchema(allTools.map((t) => ({ title: t.name, url: t.url })), 'Ferramentas de IA e automação', '/tools/')],
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
  file: 'search/index.html',
  url: '/search/',
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
  file: 'about/index.html',
  url: '/about/',
  title: 'About Yooka',
  description: 'Who writes Yooka, how we verify prices and limits, and how we correct mistakes.',
  h1: 'About Yooka',
  lead: 'Practical content for small teams — with the date attached to every number.',
  content: `<p>Most "how do I…" answers about AI and automation are scattered: the rule is in a help centre, the step-by-step is in a video from three years ago, and the price is a screenshot of a plan that changed last month. The person who needs the number leaves the search with more tabs open than when they started.</p>
  <p>Yooka publishes the whole path in one place: where to go, what to bring, how long it takes, what it costs, what to do when it breaks and where to double-check.</p>
  <h2>How we verify</h2>
  <ol>
    <li><strong>Primary sources first.</strong> Vendor documentation, published tax and limit tables, and official guidance — not blog posts.</li>
    <li><strong>Every number carries a date.</strong> Pricing, limits and tax tables move. The date on the page tells you how fresh it is.</li>
    <li><strong>Second person re-runs the steps.</strong> If they cannot follow it, the page goes back.</li>
    <li><strong>Quarterly review.</strong> Each page has an updated-on date and goes through a review cycle.</li>
  </ol>
  <h2>How we make money</h2>
  <p>Two ways, both disclosed: <strong>display ads</strong> (Google AdSense) and <strong>affiliate links</strong> — we may earn a commission if you subscribe to a tool we recommend. No advertiser pays for a review, and every review lists the cons.</p>
  <p>Yooka does not sell a service of its own and does not resell anything.</p>
  <h2>Corrections</h2>
  <p>Found an error? <a href="/contact/">Tell us</a>. We fix it and change the updated-on date so the correction is visible.</p>
  <h2>Get in touch</h2>
  <p>Missing a topic? <a href="/contact/">Write to us</a>.</p>`,
});

simplePage({
  file: 'contact/index.html',
  url: '/contact/',
  title: 'Contact',
  description: 'Get in touch with the Yooka editorial team.',
  h1: 'Contact',
  lead: 'Corrections, a specific question, or a topic you need covered.',
  content: `<p><strong>Content and corrections:</strong> <a href="mailto:hello@yooka.online">hello@yooka.online</a>. We reply within two business days.</p>
  <p><strong>Tool recommendations:</strong> describe the task, the team size and the budget range — we will point you at the options that fit, including the free ones.</p>
  <div class="offer"><div class="offer__text"><h3>Prefer the calculator?</h3><p>Free calculators for net salary, VAT, markup, break-even, freelance rates and budget planning. No signup, no paywall.</p></div><a class="btn btn--primary" href="/calculators/">Open the calculators</a></div>`,
});

simplePage({
  file: 'editorial/index.html',
  url: '/editorial/',
  title: 'Editorial policy',
  description: 'How Yooka writes, verifies, updates and corrects its content.',
  h1: 'Editorial policy',
  lead: 'How every page is written, checked, dated and corrected.',
  content: `<h2>Process</h2>
  <ol>
    <li>The writer pulls the source — vendor docs, published tables, official guidance — and notes the date.</li>
    <li>The page is written in the order the screen appears, with the real steps.</li>
    <li>A second person follows the steps. If they get stuck, the page goes back.</li>
    <li>Publication carries a visible updated-on date.</li>
    <li>Quarterly review: what ages gets a new date and the change is recorded.</li>
  </ol>
  <h2>Sources</h2>
  <p>Official documentation, published rate and limit tables, and government or regulator guidance. Where no clear public source exists, we write "check the official site" instead of estimating.</p>
  <h2>Numbers and dates</h2>
  <p>No figure appears without a date. Examples use ranges and say so, rather than inventing a number for your situation.</p>
  <h2>Corrections</h2>
  <p>Found an error? <a href="/contact/">Tell us</a>. We fix it and change the updated-on date so the correction is visible.</p>
  <h2>Conflicts of interest</h2>
  <p>Affiliate links are disclosed on every tool page. No vendor has paid for a review, and no page was published on request. If a tool we recommend is a poor fit for your case, the page says so.</p>
  <h2>Calculators</h2>
  <p>Calculators use reference tables dated October 2026 and show the caveat on the page itself. They are estimates, not official calculations.</p>`,
});

simplePage({
  file: 'privacy/index.html',
  url: '/privacy/',
  title: 'Privacy policy',
  description: 'What Yooka collects, what it does not, and how to get your data deleted.',
  h1: 'Privacy policy',
  lead: 'We collect the minimum, sell nothing, and do not read what you type into the calculators.',
  content: `<h2>What we collect</h2>
  <p>Standard web analytics — IP address, browser, pages visited — through Google AdSense and privacy-friendly analytics. Ad networks use this to pick which ads to show you.</p>
  <h2>Cookies</h2>
  <p>Google advertising cookies, analytics cookies and a small preference cookie. You can block cookies in your browser; the site keeps working, including every calculator.</p>
  <h2>The calculators</h2>
  <p>They run entirely in your browser. The numbers you type are never sent to a server and are not stored. Sharing a result copies a link with the values in the URL — that link leaves your device only when you choose to share it.</p>
  <h2>Forms</h2>
  <p>When you contact us we keep your name, email and message only for as long as it takes to reply. We do not sell or share it.</p>
  <h2>Your rights</h2>
  <p>You can ask for access, correction or deletion of your data at <a href="mailto:privacy@yooka.online">privacy@yooka.online</a>. We reply within 15 days.</p>
  <h2>Third parties</h2>
  <p>Some links take you to other sites with their own policies. Once you click, their policy applies.</p>`,
});

simplePage({
  file: 'terms/index.html',
  url: '/terms/',
  title: 'Terms of use',
  description: 'The terms that apply to using Yooka.',
  h1: 'Terms of use',
  lead: 'The rules for using the site, and what our content does and does not cover.',
  content: `<h2>About the content</h2>
  <p>Yooka is informative. It does not replace legal, accounting, tax or security advice. Prices, plans, features and limits of third-party tools change constantly — confirm on the official site before you buy.</p>
  <h2>Affiliate links</h2>
  <p>Some links are affiliate links. We may earn a commission if you subscribe through them, at no extra cost to you. That never changes our assessment, and every tool page lists the cons.</p>
  <h2>Calculators</h2>
  <p>Calculators use reference tables dated October 2026 and are estimates. They are not official calculations and should not be the basis of a filing, a payment or a contract without professional review.</p>
  <h2>Using our content</h2>
  <p>Quoting with credit and a link is fine. Full republication needs written permission.</p>
  <h2>Liability</h2>
  <p>We are not responsible for losses arising from decisions made based on third-party tools we list or on estimates our calculators produce.</p>`,
});

function copyStatic() {
  const src = path.join(ROOT, cfg.staticDir);
  if (!fs.existsSync(src)) return;

  // Arquivos da raiz de static/ vão para a raiz do site (ex.: favicon.svg);
  // a pasta assets/ vai inteira para /assets.
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isFile()) fs.copyFileSync(path.join(src, entry.name), path.join(OUT, entry.name));
  }

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
  const assetsSrc = path.join(src, 'assets');
  if (fs.existsSync(assetsSrc)) {
    const dest = path.join(OUT, 'assets');
    fs.mkdirSync(dest, { recursive: true });
    walk(assetsSrc, dest);
  }
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
}

function writeRobots() {
  const robots = `User-agent: *
Allow: /
Disallow: /search/

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
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(OUT, 'rss.xml'), xml);
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

function writeAdsTxt() {
  const client = site.adsense.client.replace(/^ca-/, '');
  const line = client
    ? `google.com, ${client}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense not configured yet — set ADSENSE_CLIENT at build time.\n';
  fs.writeFileSync(path.join(OUT, 'ads.txt'), line);
}

function writeOgManifest() {
  fs.writeFileSync(path.join(OUT, 'og-manifest.json'), JSON.stringify(ogManifest, null, 2));
}

function write404() {
  const page = {
    url: '/404.html',
    title: 'Page not found',
    description: 'That page does not exist — or it moved.',
    noindex: true,
    schemas: [organizationSchema()],
  };
  const body = `
<section class="listing listing--narrow">
  <header class="listing__head">
    <h1>We could not find that page</h1>
    <p class="listing__lead">The address may have changed. Use the search or jump to one of these.</p>
    ${searchBox()}
  </header>
  <div class="grid grid--3">
    ${allArticles.slice(0, 6).map((a) => articleCard(a)).join('\n    ')}
  </div>
</section>`;
  emit('404.html', layout(page, body, { noindex: true }));
}

function writeSearchIndex() {
  const idx = [
    ...allArticles.map((a) => ({ t: a.title, d: a.description, u: a.url, k: 'guide', c: catLabel(a.category) })),
    ...allComparisons.map((a) => ({ t: a.title, d: a.description, u: a.url, k: 'comparison', c: catLabel(a.category) })),
    ...allTools.map((t) => ({ t: t.name, d: t.tagline || t.description, u: t.url, k: 'tool', c: catLabel(t.category) })),
    ...glossary.map((g) => ({ t: g.term, d: g.short, u: `/glossary/${g.slug}/`, k: 'glossary', c: 'Glossary' })),
    ...calculators.map((c) => ({ t: c.title, d: c.description, u: `/calculators/${c.slug}/`, k: 'calculator', c: catLabel(c.category) })),
  ];
  fs.writeFileSync(path.join(OUT, 'search-index.json'), JSON.stringify(idx));
}

function writeIndexNowKey() {
  // A chave do IndexNow precisa estar publicada na raiz do site para o Bing
  // validar o envio. O arquivo .indexnow-key fica fora do git.
  const keyFile = path.join(ROOT, '.indexnow-key');
  if (!fs.existsSync(keyFile)) return;
  const key = fs.readFileSync(keyFile, 'utf8').trim();
  if (!key) return;
  fs.writeFileSync(path.join(OUT, `${key}.txt`), key);
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
writeIndexNowKey();
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
