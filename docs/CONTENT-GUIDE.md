# Guia de conteúdo — Yooka

Este guia define o formato de todo conteúdo do site. Qualquer conteúdo novo
precisa seguir estas regras para ser aceito pelo gerador (`npm run build`).

## Princípio editorial

Escreva para **quem vai implementar**, não para quem só quer ler sobre IA.
Cada artigo responde a uma pergunta que um gestor de PME brasileira está
disposto a pagar para resolver. Zero hype, zero "revolução", zero promessa de
renda. Números concretos, custo em Real, prazo de implantação, e o que dá errado.

---

## 1. Artigos (`src/content/articles/*.md`)

### Frontmatter

```yaml
---
title: "Título com palavra-chave e um diferencial (número, ano ou benefício)"
description: "Meta description entre 140 e 160 caracteres, com a promessa e a palavra-chave."
date: "2026-10-30"
updated: "2026-10-30"
category: "agentes-de-ia"      # uma das categorias do catálogo
tags: ["agente", "n8n", "automacao"]
keywords: ["termo secundário", "long tail de busca"]
featured: false                 # true leva para a home
draft: false                    # true não entra no build
faq:
  - q: "Pergunta frequente 1?"
    a: "Resposta direta de 1 a 3 frases (até ~50 palavras)."
  - q: "Pergunta frequente 2?"
    a: "Resposta de 1 a 3 frases."
---
```

Categorias válidas: `agentes-de-ia`, `automacao`, `atendimento`,
`ia-por-departamento`, `marketing-e-vendas`, `custos`.

### Corpo

Regras obrigatórias:

1. **Abre com a resposta.** O primeiro parágrafo responde à pergunta do título em
   40–70 palavras, usando as palavras da busca. Esse parágrafo é o alvo de
   *featured snippet* e o de quem responde no Google.
2. **Títulos de nível 2 (`##`)** para as seções, sempre em forma de frase que
   faça sentido fora do contexto ("Quanto custa um agente de IA em 2026?").
3. **Tabelas markdown** sempre que houver comparação, prazo, custo ou critério.
4. **Listas numeradas** para passo a passo (mínimo 4 passos) e listas com `-`
   para critérios, prós e contras.
5. **Mínimo 1.500 palavras**, máximo 2.800.
6. **Links internos**: só aponte para URLs da lista garantida abaixo. Nunca invente
   URL que não exista — link quebrado custa tráfego.
7. **Links externos**: no máximo 2, sempre em `https://` e com
   `rel="nofollow noopener"`. Prefira documentação oficial.
8. **Nada de emoji no corpo.** Nada de "🚀", "💡". Use texto direto.
9. **Nada de blockquote de citação** — o layout não destaca.
10. **Sem imagens no corpo.** O layout injeta diagramas e blocos visuais.

### Formato de link interno

```markdown
[texto âncora](/guias/como-criar-agente-de-ia/)
```

### URLs garantidas (existem no build)

```
/guias/como-criar-agente-de-ia/
/guias/agente-de-ia-o-que-e/
/guias/n8n-vs-make-comparativo/
/guias/custo-de-agente-de-ia/
/guias/chatbot-para-whatsapp/
/guias/ia-para-financeiro/
/guias/prompts-para-agentes-de-ia/
/guias/automacao-para-pequenas-empresas/
/guias/ia-para-vendas/
/guias/como-escolher-ferramenta-de-ia/
/guias/rag-explicado/
/guias/guardrails-agentes-de-ia/
/guias/automacao-com-n8n/
/guias/ia-para-recrutamento/
/guias/ia-para-juridico/
/guias/renderizacao-de-faturas-ia/
/guias/crm-ia-para-vendas/
/comparativos/
/ferramentas/
/guias/
/precos/
/glossario/
/faq/
/categorias/agentes-de-ia/
/categorias/automacao/
/categorias/atendimento/
/categorias/ia-por-departamento/
/categorias/marketing-e-vendas/
/categorias/custos/
```

---

## 2. Comparativos (`src/content/comparisons/*.md`)

Frontmatter:

```yaml
---
title: "n8n x Make: qual automação é mais barata em 2026?"
description: "..."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao"
slug: "n8n-vs-make"          # gera /comparativos/n8n-vs-make/
winner: "n8n"
tools:
  - name: "n8n"
    url: "https://n8n.io"
    affiliateUrl: "https://n8n.io/?via=yooka"
    price: "A partir de €20/mês"
    bestFor: "Automação com código"
    rating: 4.6
    verdict: "Texto de 2 a 4 frases sobre o que torna a ferramenta melhor e pior."
    pros:
      - "Prós real"
      - "Outro pró real"
    cons:
      - "Contras real"
      - "Outro contra real"
---
```

O corpo deve ser a análise: contexto, método de comparação, tabela comparativa
em markdown, veredito por critério (preço, curva de aprendizado, integração,
suporte no Brasil), e a conclusão com o vencedor **e** para quem o perdedor
ainda é a melhor escolha.

---

## 3. Ferramentas (`src/content/tools/*.json`)

```json
{
  "name": "n8n",
  "slug": "n8n",
  "category": "automacao",
  "tagline": "Automação open source com código quando você precisa",
  "description": "Descrição de 140 a 160 caracteres para a meta e o resumo do card.",
  "url": "https://n8n.io",
  "affiliateUrl": "https://n8n.io/?via=yooka",
  "price": "€20/mês",
  "priceNote": "Planos de €20/mês (2.500 execuções). Versão self-hosted gratuita.",
  "bestFor": "Times técnicos e automações que exigem código",
  "rating": 4.6,
  "ratingCount": 128,
  "pros": ["Prós", "Prós", "Prós"],
  "cons": ["Contras", "Contras"],
  "features": [
    { "name": "Recurso", "detail": "Detalhe curto" }
  ],
  "useCases": ["Caso de uso 1", "Caso de uso 2", "Caso de use 3"],
  "bestForWho": "Público ideal",
  "verdict": "Veredito de 3 a 5 frases.",
  "alternatives": ["make", "zapier"],
  "updated": "2026-10-30"
}
```

Preços mudam: sempre inclua `priceNote` com a data de verificação e use
"a partir de" quando houver faixa. Nunca invente desconto.

---

## 4. Glossário (`src/content/glossary.json`)

```json
[
  {
    "term": "Agente de IA",
    "slug": "agente-de-ia",
    "short": "Definição de até 20 palavras.",
    "body": "Parágrafo(s) de 80 a 150 palavras com contexto e exemplo.",
    "related": ["llm", "rag"]
  }
]
```

---

## 5. FAQ global (`src/content/faq.json`)

```json
[
  { "q": "Pergunta?", "a": "Resposta objetiva de 1 a 3 frases." }
]
```

---

## Checklist antes de commitar

- [ ] O título contém a palavra-chave e um motivo para clicar.
- [ ] A descrição tem 140–160 caracteres e promete algo concreto.
- [ ] O primeiro parágrafo responde à pergunta em até 70 palavras.
- [ ] Existe pelo menos uma tabela ou lista numerada.
- [ ] Todos os links internos apontam para URLs garantidas.
- [ ] Nenhum emoji, nenhuma promessa de resultado, nenhum "revolução".
- [ ] Os números citados têm contexto (tamanho da empresa, plano, momento).
- [ ] As perguntas do `faq` do frontmatter estão respondidas no corpo.
