/**
 * Configuração central do site.
 * Tudo que muda de uma linha de código para outro site está aqui.
 */
export const site = {
  name: 'Yooka',
  tagline: 'IA e automação para empresas, sem hype',
  description:
    'Guia prático de agentes de IA, automação e ferramentas para empresas brasileiras. Reviews honestos, comparativos com preço e passo a passo de implementação.',
  url: process.env.SITE_URL || 'https://yooka.com.br',
  locale: 'pt_BR',
  lang: 'pt-BR',
  themeColor: '#0b1020',
  accent: '#6ee7b7',
  publisher: {
    name: 'Yooka',
    logo: '/assets/logo.svg',
    twitter: '@yooka_br',
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
  // Oferta principal (monetização de maior EPC): a Loyfus.
  offer: {
    name: 'Loyfus',
    url: 'https://loyfus.com.br',
    cta: 'Falar com um especialista',
    pitch:
      'Agentes de IA sob medida para a sua empresa — com diagnóstico, implantação e suporte. Sem mensalidade surpresa.',
  },
  // Domínios de affiliate (programas externos para links de saída)
  affiliate: {
    tag: 'yooka', // sufixo de tracking, ex.: ?ref=yooka
  },
  nav: [
    { label: 'Guides', href: '/guias/' },
    { label: 'Comparativos', href: '/comparativos/' },
    { label: 'Ferramentas', href: '/ferramentas/' },
    { label: 'Preços e custos', href: '/precos/' },
    { label: 'Glossário', href: '/glossario/' },
  ],
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/loyfus' },
    { label: 'YouTube', href: 'https://www.youtube.com/@loyfus' },
    { label: 'Instagram', href: 'https://www.instagram.com/loyfus' },
  ],
  footer: [
    {
      title: 'Conteúdo',
      links: [
        { label: 'Guides', href: '/guias/' },
        { label: 'Comparativos', href: '/comparativos/' },
        { label: 'Ferramentas', href: '/ferramentas/' },
        { label: 'Glossário', href: '/glossario/' },
        { label: 'Perguntas frequentes', href: '/faq/' },
      ],
    },
    {
      title: 'Categoria',
      links: [
        { label: 'Agentes de IA', href: '/categorias/agentes-de-ia/' },
        { label: 'Automação de processos', href: '/categorias/automacao/' },
        { label: 'Atendimento e chatbots', href: '/categorias/atendimento/' },
        { label: 'IA por departamento', href: '/categorias/ia-por-departamento/' },
        { label: 'Marketing e vendas', href: '/categorias/marketing-e-vendas/' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre a Yooka', href: '/sobre/' },
        { label: 'Contato', href: '/contato/' },
        { label: 'Política de privacidade', href: '/privacidade/' },
        { label: 'Termos de uso', href: '/termos/' },
        { label: 'Política editorial', href: '/editorial/' },
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
