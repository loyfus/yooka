import { escapeHtml, truncate, urlPath } from './utils.js';
import { site } from '../site.config.js';

/**
 * Monta o bloco <head> completo de uma página.
 * `page` = { title, description, url, type, image, publishedAt, modifiedAt, noindex, breadcrumbs, schemas }
 */
export function head(page) {
  const url = site.url.replace(/\/$/, '') + urlPath(page.url);
  const title = page.title.includes(site.name) ? page.title : `${page.title} | ${site.name}`;
  const description = truncate(page.description, 158);
  const image = page.image
    ? site.url.replace(/\/$/, '') + urlPath(page.image)
    : site.url.replace(/\/$/, '') + '/assets/og-default.png';

  const parts = [];

  parts.push('<meta charset="utf-8">');
  parts.push('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');
  parts.push(`<title>${escapeHtml(title)}</title>`);
  parts.push(`<meta name="description" content="${escapeHtml(description)}">`);
  parts.push(`<link rel="canonical" href="${url}">`);
  if (page.noindex) parts.push('<meta name="robots" content="noindex,follow">');
  else parts.push('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">');

  parts.push(`<meta name="author" content="${escapeHtml(site.publisher.name)}">`);
  parts.push(`<meta property="og:site_name" content="${escapeHtml(site.publisher.name)}">`);
  parts.push(`<meta property="og:type" content="${page.type || 'website'}">`);
  parts.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
  parts.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
  parts.push(`<meta property="og:url" content="${url}">`);
  parts.push(`<meta property="og:image" content="${image}">`);
  parts.push(`<meta property="og:image:width" content="1200">`);
  parts.push(`<meta property="og:image:height" content="630">`);
  parts.push(`<meta property="og:locale" content="${site.locale}">`);
  parts.push(`<meta name="twitter:card" content="summary_large_image">`);
  parts.push(`<meta name="twitter:site" content="${site.publisher.twitter}">`);
  parts.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
  parts.push(`<meta name="twitter:description" content="${escapeHtml(description)}">`);
  parts.push(`<meta name="twitter:image" content="${image}">`);
  parts.push(`<meta name="theme-color" content="${site.themeColor}">`);

  if (page.publishedAt) {
    parts.push(`<meta property="article:published_time" content="${page.publishedAt}">`);
    parts.push(`<meta property="article:modified_time" content="${page.modifiedAt || page.publishedAt}">`);
    parts.push(`<meta property="article:section" content="${escapeHtml(page.section || '')}">`);
  }

  parts.push('<link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  parts.push('<link rel="apple-touch-icon" href="/assets/logo.svg">');
  parts.push('<link rel="manifest" href="/manifest.webmanifest">');
  parts.push('<link rel="alternate" type="application/rss+xml" title="Yooka" href="/rss.xml">');

  const schemas = [...(page.schemas || [])];
  if (page.breadcrumbs?.length) schemas.push(breadcrumbSchema(page.breadcrumbs, url));
  parts.push(`<script type="application/ld+json">${JSON.stringify(schemas)}</script>`);

  return parts.join('\n  ');
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': site.url + '/#organization',
    name: site.publisher.name,
    url: site.url,
    logo: site.url + site.publisher.logo,
    description: site.description,
    sameAs: site.social.map((s) => s.href),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      areaServed: 'BR',
      availableLanguage: ['pt-BR'],
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': site.url + '/#website',
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: 'pt-BR',
    publisher: { '@id': site.url + '/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: site.url + '/busca/?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(crumbs, url) {
  return {
    '@type': 'BreadcrumbList',
    '@id': url + '#breadcrumb',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: site.url.replace(/\/$/, '') + urlPath(c.href),
    })),
  };
}

export function articleSchema({ title, description, url, publishedAt, modifiedAt, image, keywords, wordCount }) {
  return {
    '@type': 'Article',
    '@id': site.url.replace(/\/$/, '') + urlPath(url) + '#article',
    headline: title,
    description,
    inLanguage: 'pt-BR',
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    wordCount,
    keywords: (keywords || []).join(', '),
    image: [image ? site.url.replace(/\/$/, '') + urlPath(image) : site.url + '/assets/og-default.png'],
    author: { '@type': 'Organization', name: site.publisher.name, url: site.url },
    publisher: { '@id': site.url + '/#organization' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': site.url.replace(/\/$/, '') + urlPath(url) },
  };
}

export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function itemListSchema(items, name, url) {
  return {
    '@type': 'ItemList',
    name,
    url: site.url.replace(/\/$/, '') + urlPath(url),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.title,
      url: site.url.replace(/\/$/, '') + urlPath(it.url),
    })),
  };
}

export function softwareAppSchema(tool) {
  return {
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: tool.description,
    url: tool.url,
    ...(tool.price ? { offers: { '@type': 'Offer', price: tool.price, priceCurrency: tool.currency || 'BRL' } } : {}),
    ...(tool.aggregateRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: tool.aggregateRating.value,
            reviewCount: tool.aggregateRating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(tool.logo ? { logo: site.url.replace(/\/$/, '') + urlPath(tool.logo) } : {}),
  };
}

export function howToSchema(steps, name, description) {
  return {
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
