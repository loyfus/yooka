/**
 * Configuração central do site.
 * Tudo que muda de uma linha de código para outro site está aqui.
 */
export const site = {
  name: 'Yooka',
  tagline: 'AI and automation that small teams actually ship',
  description:
    'Practical guides, honest tool reviews and free calculators for AI and automation — built for small teams that need results, not hype.',
  // Canonical URL. Keep it identical to the SITE_URL env var on Vercel.
  url: process.env.SITE_URL || 'https://www.yooka.online',
  locale: 'en_US',
  lang: 'en',
  themeColor: '#0b1020',
  accent: '#6ee7b7',
  publisher: {
    name: 'Yooka',
    logo: '/assets/logo.svg',
    twitter: '@yooka',
  },
  // Conta do Google AdSense (preencher para ativar os slots)
  adsense: {
    client: process.env.ADSENSE_CLIENT || '',
    slots: {
      leaderboard: '1234567890',
      inArticle: '2345678901',
      sidebar: '3456789012',
    },
  },
  // Monetisation: ads (AdSense) and affiliate links. Yooka is an independent
  // editorial project — it does not sell a service of its own.
  offer: {
    name: 'Yooka',
    url: '/calculators/',
    cta: 'Open the calculators',
    pitch:
      'Free calculators for net salary, VAT, markup, break-even and freelance rates. No signup, no paywall.',
  },
  // Domínios de affiliate (programas externos para links de saída)
  affiliate: {
    tag: 'yooka', // sufixo de tracking, ex.: ?ref=yooka
  },
  nav: [
    { label: 'AI tools', href: '/categorias/ai-tools/' },
    { label: 'Automation', href: '/categorias/automation/' },
    { label: 'Marketing', href: '/categorias/marketing/' },
    { label: 'Productivity', href: '/categorias/productivity/' },
    { label: 'Finance', href: '/categorias/finance/' },
    { label: 'Calculators', href: '/calculators/' },
    { label: 'Comparisons', href: '/comparisons/' },
  ],
  social: [],
  footer: [
    {
      title: 'Content',
      links: [
        { label: 'All guides', href: '/guides/' },
        { label: 'Tool reviews', href: '/tools/' },
        { label: 'Comparisons', href: '/comparisons/' },
        { label: 'Free calculators', href: '/calculators/' },
        { label: 'Glossary', href: '/glossary/' },
      ],
    },
    {
      title: 'Topics',
      links: [
        { label: 'AI tools', href: '/categorias/ai-tools/' },
        { label: 'Automation', href: '/categorias/automation/' },
        { label: 'Marketing & sales', href: '/categorias/marketing/' },
        { label: 'Productivity', href: '/categorias/productivity/' },
        { label: 'Finance & pricing', href: '/categorias/finance/' },
        { label: 'People & hiring', href: '/categorias/hr/' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Yooka', href: '/about/' },
        { label: 'Contact', href: '/contact/' },
        { label: 'Editorial policy', href: '/editorial/' },
        { label: 'Privacy policy', href: '/privacy/' },
        { label: 'Terms of use', href: '/terms/' },
      ],
    },
  ],
};

export const build = {
  outDir: 'public',
  contentDir: 'src/content',
  staticDir: 'src/static',
};

export default site;
