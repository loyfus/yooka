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
  url: process.env.SITE_URL || 'https://yooka.loyfus.com.br',
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
    { label: 'Serviços públicos', href: '/categorias/servicos-publicos/' },
    { label: 'MEI e NF', href: '/categorias/mei-e-nota-fiscal/' },
    { label: 'Trabalho', href: '/categorias/trabalho-e-carreira/' },
    { label: 'Renda extra', href: '/categorias/renda-e-negocio/' },
    { label: 'Calculadoras', href: '/calculadoras/' },
    { label: 'Guias', href: '/guias/' },
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
