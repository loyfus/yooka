# Yooka

Serviços públicos, MEI, nota fiscal, direitos trabalhistas, renda extra e
custos — explicados em português, com passo a passo, prazo e valor.

**No ar:** https://yooka.online (enquanto o DNS propaga, https://yooka.loyfus.com.br)

## O que tem lá dentro

| Bloco | Quantidade | Tipo de URL |
|---|---|---|
| Guias | 50+ | `/guias/<slug>/` |
| Calculadoras interativas | 10 | `/calculadoras/<slug>/` |
| Comparativos escritos à mão | 7 | `/comparativos/<slug>/` |
| Comparativos programáticos (pares) | 40+ | `/comparativos/<a>-vs-<b>/` |
| Fichas de ferramenta | 32 | `/ferramentas/<slug>/` |
| Páginas de preço | 32 | `/ferramentas/<slug>/preco/` |
| Páginas de alternativas | 32 | `/ferramentas/<slug>/alternativas/` |
| Glossário | 40 | `/glossario/<slug>/` |
| Categorias, índices, FAQ, institucionais | ~25 | `/categorias/…`, `/precos/`, `/faq/` |
| **Total** | **~350 páginas · 100 mil+ palavras** | |

### Os seis temas

| Tema | Para quem |
|---|---|
| `servicos-publicos` | INSS, FGTS, benefícios, certidões, contas, documentos |
| `mei-e-nota-fiscal` | MEI, CNPJ, NFS-e, DAS, Pix, contabilidade online |
| `trabalho-e-carreira` | CLT x PJ, férias, 13º, demissão, freelancer, remoto |
| `renda-e-negocio` | renda extra, vender online, precificação, marketing |
| `automacao-e-ia` | IA e automação para resolver o que se resolvia na mão |
| `custos-e-planos` | cartão, crédito, assinatura, custo de vida, orçamento |

### As calculadoras

`/calculadoras/` — 13º salário, férias, verbas rescisórias, CLT x PJ, DAS do
MEI, markup e margem, renda extra, multa de conta atrasada, plano de saúde
para MEI, orçamento mensal.

São estáticas: o cálculo roda no navegador, sem back-end, sem cadastro e sem
enviar o que o leitor digita. O resultado inicial já vem no HTML, então o
Google indexa o número.

## Stack

- **Node 24** com `marked` (markdown) e `gray-matter` (frontmatter). Nada mais.
- **HTML estático** gerado em `public/` — servido pela Vercel ou qualquer CDN.
- **Chrome headless** gera a imagem Open Graph de cada página.
- **Zero JavaScript obrigatório**: o site funciona inteiro sem JS.

## Comandos

```bash
npm run build          # build + imagens OG (precisa do Chrome)
npm run build:fast     # só o HTML — é o que a Vercel usa
npm run dev            # build + servidor local em :4321
npm run check:links    # acha link interno quebrado
npm run og             # regera só as imagens OG
npm run indexnow       # avisa o Bing sobre todas as URLs
npm run activate:domain # espera o DNS de yooka.online e vira o domínio sozinho
npm run deploy         # publica na Vercel
```

## Estrutura

```
src/
  site.config.js         # identidade, navegação, AdSense, rodapé
  lib/
    templates.js         # HTML: layout, cards, tabela comparativa, FAQ, offer
    seo.js               # <head>, canonical, OG e todos os schema.org
    markdown.js          # markdown → HTML com ids nos headings
    utils.js             # slug, data, tempo de leitura, escape
  content/
    articles/*.md        # guias (frontmatter + markdown)
    comparisons/*.md     # comparativos escritos à mão
    tools/*.json         # fichas de ferramenta
    calculators.js       # calculadoras interativas
    glossary.json        # termos do glossário
    faq.json             # FAQ global
    categories.json      # categorias e hubs
  static/
    assets/styles.css    # folha única, mobile-first
    assets/app.js        # menu, busca, toast
    assets/expr.js       # avaliador de expressões (Node + navegador)
    assets/calc-core.js  # núcleo de cálculo das calculadoras
    assets/calculator.js # interação no navegador
og/                     # imagens OG versionadas (1200×630, JPEG)
build.js                # o gerador
scripts/                # OG, IndexNow, checagem de links, virada de domínio
docs/                   # deploy, SEO, monetização, distribuição, calendário
```

## Como publicar um artigo novo

1. Crie `src/content/articles/meu-artigo.md` seguindo `docs/CONTENT-GUIDE.md`.
2. `npm run build` — o gerador cria a página, o sitemap e a imagem OG.
3. `npm run check:links` — confirma que nenhum link interno quebrou.
4. `git push` — a Action publica na Vercel.

O frontmatter controla tudo:

```yaml
---
title: "Título com a palavra-chave"
description: "140 a 160 caracteres, com a promessa."
date: "2026-10-30"
updated: "2026-10-30"
category: "servicos-publicos"
tags: ["inss", "beneficio"]
faq:
  - q: "Pergunta?"
    a: "Resposta de 1 a 3 frases."
---
```

## Documentação

| Documento | Assunto |
|---|---|
| [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) | Como escrever conteúdo (o contrato editorial) |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Build, Vercel, domínio, DNS, indexação |
| [`docs/SEO.md`](docs/SEO.md) | O que já está implementado e o checklist do GSC |
| [`docs/MONETIZATION.md`](docs/MONETIZATION.md) | AdSense, afiliados, produto próprio, números |
| [`docs/DISTRIBUICAO.md`](docs/DISTRIBUICAO.md) | Kit de tráfego para as primeiras 72 horas |
| [`docs/CALENDARIO.md`](docs/CALENDARIO.md) | Os próximos 60 artigos, com keyword e tipo |

## Princípio editorial

Informação pública espalhada vira um caminho único: onde entrar, o que levar,
quanto tempo demora, quanto custa e o que fazer quando dá errado. Todo número
com data. Nenhuma promessa de resultado. Nenhum valor inventado — quando não
há fonte pública clara, o texto diz "consulte o site oficial".
