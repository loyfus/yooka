/**
 * Configuração central do site.
 * Tudo que muda de uma linha de código para outro site está aqui.
 */
export const site = {
  name: 'Yooka',
  tagline: 'Trabalho, renda e burocracia do brasileiro',
  description:
    'Passo a passo para resolver serviços públicos, MEI, nota fiscal, CLT e renda extra no Brasil. Prazos reais, valores atualizados e nenhum enrolação.',
  // URL canônica. Troque pelo domínio final (yooka.com.br) quando ele estiver
  // apontando para a Vercel — e mantenha o valor idêntico na Vercel (env SITE_URL).
  url: process.env.SITE_URL || 'https://www.yooka.online',
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
  // Monetização principal: anúncios (AdSense) e links de afiliado.
  // A Yooka é um projeto editorial independente — não vende serviço próprio.
  offer: {
    name: 'Yooka',
    url: '/calculadoras/',
    cta: 'Ver as calculadoras',
    pitch:
      'Mais de 20 calculadoras grátis de INSS, MEI, CLT e custos — sem cadastro e sem paywall.',
  },
  // Domínios de affiliate (programas externos para links de saída)
  affiliate: {
    tag: 'yooka', // sufixo de tracking, ex.: ?ref=yooka
  },
  nav: [
    { label: 'Serviços públicos', href: '/categorias/servicos-publicos/' },
    { label: 'MEI e NF', href: '/categorias/mei-e-nota-fiscal/' },
    { label: 'Trabalho', href: '/categorias/trabalho-e-carreira/' },
    { label: 'Renda extra', href: '/categorias/renda-e-negocio/' },
    { label: 'Calculadoras', href: '/calculadoras/' },
    { label: 'Atalhos', href: '/atalhos/' },
    { label: 'Guias', href: '/guias/' },
  ],
  social: [],
  footer: [
    {
      title: 'Conteúdo',
      links: [
        { label: 'Todos os guias', href: '/guias/' },
        { label: 'Serviços públicos', href: '/categorias/servicos-publicos/' },
        { label: 'MEI e nota fiscal', href: '/categorias/mei-e-nota-fiscal/' },
        { label: 'Trabalho e carreira', href: '/categorias/trabalho-e-carreira/' },
        { label: 'Renda e negócio', href: '/categorias/renda-e-negocio/' },
      ],
    },
    {
      title: 'Mais acessados',
      links: [
        { label: 'Como emitir NFS-e', href: '/guias/como-emitir-nfse/' },
        { label: 'Segunda via de certidão', href: '/guias/segunda-via-de-certidao/' },
        { label: 'Benefícios do INSS', href: '/guias/beneficios-do-inss/' },
        { label: 'CLT ou PJ', href: '/guias/clt-ou-pj/' },
        { label: 'Renda extra com IA', href: '/guias/renda-extra-com-ia/' },
        { label: 'Custo de um agente de IA', href: '/guias/custo-de-agente-de-ia/' },
        { label: 'Atalhos oficiais', href: '/atalhos/' },
        { label: 'Modelos de documento', href: '/modelos/' },
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
