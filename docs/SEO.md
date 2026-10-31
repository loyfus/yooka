# SEO — o que já está no site e o que fazer agora

## O que o gerador já entrega

| Sinal | Implementação |
|---|---|
| URL canônica | `<link rel="canonical">` em todas as páginas, apontando para o domínio final |
| Title e description | Gerados por template; description sempre entre 140–160 caracteres |
| Open Graph / Twitter Card | Imagem 1200×630 por página, gerada com Chrome headless e versionada em `/og` |
| Schema.org | `Organization`, `WebSite`, `Article`, `FAQPage`, `BreadcrumbList`, `ItemList`, `SoftwareApplication`, `DefinedTerm` |
| Sitemap | `sitemap.xml` gerado no build, com `lastmod`, `changefreq` e `priority` |
| Robots | `robots.txt` liberando bots de IA generativos (GPTBot, ClaudeBot, PerplexityBot) |
| RSS | `rss.xml` com os 30 artigos mais recentes |
| Hreflang | `pt-BR` no `<html lang>` e `og:locale` |
| Velocidade | HTML estático, zero JS obrigatório, CSS em arquivo único, imagens WebP/JPEG |

## As três alavancas de CTR (implementadas)

1. **Bloco de resposta direta** (`answerbox`) — a primeira coisa que responde à
   pergunta, em 40–70 palavras. É o alvo do *featured snippet* do Google.
2. **Tabelas comparativas** — o formato com maior taxa de clique em busca
   informacional ("n8n x make", "preço de X").
3. **Título com promessa verificável** — número, prazo ou benefício. Zero
   clickbait: se o título promete, a página entrega (o Google penaliza o
   mismatch e o leitor volta raramente).

## O que fazer agora (primeiras 48h)

### 1. Google Search Console

1. `search.google.com/search-console` → **Adicionar propriedade** →
   `Domínio` → `yooka.online` (ou `yooka.yooka.online` enquanto o DNS não
   propaga).
2. Verificação por **DNS**: o GSC gera um registro `TXT` para a zona. No
   Cloudflare: DNS → Records → Add → Type `TXT`, Name `@`, valor `_google-site-verification=...`.
3. Propriedades → **Sitemaps** → `sitemap.xml`.
4. Ferramentas → **URL Inspection** → cole a URL da home e de 3 artigos →
   **Request Indexing**. Repita para as páginas principais.

### 2. Bing Webmaster Tools

1. `bing.com/webmasters` → **Import from GSC** (um clique, herda tudo).
2. Copie a chave do IndexNow em `bing.com/webmasters/home/indexnow` (ou gere
   uma: `openssl rand -hex 16`) e salve em `.indexnow-key`.
3. `npm run indexnow` avisa o Bing sobre todas as URLs do sitemap.
4. A Action `.github/workflows/indexnow.yml` repete isso todo dia — ative o
   workflow em **Actions → indexnow → Enable workflow**.

### 3. Google AdSense

1. `adsense.google.com` → AdSense → Sites → Adicionar site.
2. Cole no `src/site.config.js` → `adsense.client = 'ca-pub-XXXXXXXXXXXXXXXX'`.
   (O prefixo `ca-` é opcional — o gerador remove.)
3. Preencha os slots: `leaderboard`, `inArticle`, `sidebar`.
4. O `ads.txt` é gerado automaticamente na raiz do site.
5. Ative **Auto ads** e **Anúncios em exibição**. Antes da aprovação, os slots
   aparecem como placeholder — não quebre a página.

## Mapa de palavras-chave

O site é construído em clusters. Cada cluster tem um pilar (guia longo) e
páginas de apoio (comparativos, ferramentas, preço). O link interno aponta
para o pilar, o pilar linka para as páginas de apoio.

| Cluster | Pilar | Páginas de apoio |
|---|---|---|
| Serviços públicos | `/guias/beneficios-do-inss/` | FGTS, pensão, auxílio, certidões, 2ª via de contas |
| MEI e nota fiscal | `/guias/como-abrir-mei-passo-a-passo/` | DAS, NFS-e, Pix, contabilidade, obrigações |
| Trabalho e carreira | `/guias/clt-ou-pj/` | férias, 13º, rescisão, jornada, freelancer, remoto |
| Renda e negócio | `/guias/renda-extra-com-ia/` | vender online, precificar, marketing, produto digital |
| Automação e IA | `/guias/como-criar-agente-de-ia/` | prompts, RAG, guardrails, escolher ferramenta |
| Custos e planos | `/guias/custo-real-de-ter-mei/` | cartão, crédito, orçamento, seguro, streaming |

**As calculadoras são o segundo pilar do site.** Busca de "calculadora de 13º
salário" ou "calculadora DAS MEI" tem volume alto, intenção altíssima e
concorrência baixa — e o resultado aparece dentro da página, o que aumenta
tempo na página e taxa de retorno. Cada calculadora é uma página com
`WebApplication` + `FAQPage`, resultado pré-calculado no HTML e link de volta
para o guia que explica o assunto.

**Padrão de URL:** `/guias/` = conteúdo editorial. `/calculadoras/` = ferramentas
de cálculo (resultado no HTML). `/comparativos/` = páginas de decisão (X x Y).
`/ferramentas/` = páginas de ferramenta, com `/preco/` e `/alternativas/`
geradas por programa.

## Checklist de qualidade por página (Antes de publicar)

- [ ] Primeiro parágrafo responde à busca em 40–70 palavras
- [ ] Pelo menos uma tabela e uma lista numerada
- [ ] Nenhum emoji, nenhum blockquote, nenhuma imagem no corpo
- [ ] Links internos apontam para URLs que existem (`npm run check:links`)
- [ ] `description` entre 140 e 160 caracteres
- [ ] 3–4 perguntas no `faq` do frontmatter, respondidas no corpo
- [ ] `updated` visível no artigo (sinal de frescor)
