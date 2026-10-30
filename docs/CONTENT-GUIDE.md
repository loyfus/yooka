# Guia de conteúdo — Yooka

Este guia define o formato de todo conteúdo do site. Qualquer conteúdo novo
precisa seguir estas regras para ser aceito pelo gerador (`npm run build`).

## Princípio editorial

A Yooka responde a **perguntas que o brasileiro realmente busca**: serviços
públicos, MEI e nota fiscal, direitos trabalhistas, renda extra, custo de
vida. O leitor chega com uma dúvida concreta ("segunda via da conta de luz",
"13º salário como calcular", "quanto custa abrir MEI") e sai com a resposta
prática: onde entrar, o que levar, quanto tempo demora, quanto custa e o que
fazer quando dá errado.

Regras inegociáveis:

- **Passo a passo com tela por tela** quando for portal oficial. O leitor
  precisa conseguir repetir o processo sozinho.
- **Prazos e valores com data** ("em outubro de 2026", "R$ 2.518,40"). Valor
  sem data é mentira esperando ser cobrada.
- **Aviso de que regra pode mudar** e de que a fonte oficial prevalece.
- **Nada de gosto**: como pedir, onde, quanto custa, quanto demora.
- **LGPD,Lei 14.789/2023 (MEI) e CLT** citados com cuidado — a Yooka explica o
  processo, não substitui advogado, contador ou advogado. Em benefício
 autoritativo, escreva "confirme no seu caso com um profissional".

---

## 1. Artigos (`src/content/articles/*.md`)

### Frontmatter

```yaml
---
title: "Título com a palavra-chave e um diferencial (número, prazo ou benefício)"
description: "Meta description entre 140 e 160 caracteres, com a promessa e a palavra-chave."
date: "2026-10-30"
updated: "2026-10-30"
category: "servicos-publicos"   # uma das categorias do catálogo
tags: ["inss", "beneficio"]
keywords: ["termo secundário", "long tail de busca"]
featured: false                  # true leva para a home
draft: false                     # true não entra no build
faq:
  - q: "Pergunta frequente 1?"
    a: "Resposta direta de 1 a 3 frases (até ~50 palavras)."
  - q: "Pergunta frequente 2?"
    a: "Resposta de 1 a 3 frases."
---
```

Categorias válidas:

- `servicos-publicos` — INSS, FGTS, benefícios, certidões, documentos, contas
- `mei-e-nota-fiscal` — MEI, CNPJ, NFS-e, DAS, Pix, contabilidade
- `trabalho-e-carreira` — CLT, férias, 13º, demissão, PJ, freelancer, remoto
- `renda-e-negocio` — renda extra, vender online, precificação, marketing
- `automacao-e-ia` — IA e automação para resolver o que se resolvia na mão
- `custos-e-planos` — custo real de cartão, crédito, assinatura e ferramenta

### Corpo

Regras obrigatórias:

1. **Abre com a resposta.** O primeiro parágrafo responde à pergunta do título
   em 40–70 palavras, usando as palavras da busca. Esse parágrafo é o alvo de
   *featured snippet* e o de quem responde no Google.
2. **Títulos de nível 2 (`##`)** para as seções, sempre em forma de frase que
   faça sentido fora do contexto ("Quanto custa abrir MEI em 2026?").
3. **Tabelas markdown** sempre que houver prazo, valor, custo ou critério.
4. **Listas numeradas** para passo a passo (mínimo 4 passos) e listas com `-`
   para requisitos, prós e contras.
5. **Mínimo 1.500 palavras**, máximo 2.800.
6. **Links internos**: só aponte para URLs da lista garantida abaixo. Nunca
   invente URL que não exista — link quebrado custa tráfego.
7. **Links externos**: no máximo 3, sempre em `https://`. Prefira portais
   oficiais (gov.br,o portal oficial do município, concessionárias) e a documentação oficial.
8. **Nada de emoji no corpo.** Nada de "🚀", "💡". Use texto direto.
9. **Nada de blockquote de citação** — o layout não destaca.
10. **Sem imagens no corpo.** O layout injeta diagramas e blocos visuais.

### Formato de link interno

```markdown
[texto âncora](/guias/como-emitir-nfse/)
```

### URLs garantidas (existem no build)

Serviços públicos:

```
/guias/beneficios-do-inss/
/guias/como-solicitar-segunda-via-do-cartao-do-beneficiario/
/guias/fgts-saque-aniversario/
/guias/pensao-por-morte-invalor/
/guias/auxilio-doenca-inss-como-solicitar/
/guias/segunda-via-de-certidao/
/guias/como-emitir-carteira-de-trabalho-digital/
/guias/pis-nis-pasep-consulta/
/guias/segunda-via-de-conta-de-luz/
/guias/segunda-via-de-conta-de-agua/
/guias/iptu-segunda-via/
/guias/ipva-2026-pagamento/
/guias/como-solicitar-cartao-cidadao/
/guias/aumento-de-beneficio-invalidez/
/guias/bolsa-familia-ou-bpc-qual-escolher/
/guias/como-solicitar-certidao-negativa-de-debitos/
```

MEI e nota fiscal:

```
/guias/como-abrir-mei-passo-a-passo/
/guias/das-mei-como-pagar/
/guias/como-emitir-nfse/
/guias/pix-mei-receber/
/guias/contabilidade-online-para-mei/
/guias/obrigacoes-do-mei-lista/
/guias/como-emitir-nota-fiscal-de-servico/
/guias/quando-sair-do-mei/
```

Trabalho e carreira:

```
/guias/clt-ou-pj/
/guias/como-calcular-ferias/
/guias/13-salario-como-calcular/
/guias/verbas-rescisorias/
/guias/hora-extra-e-jornada/
/guias/freelancer-como-comecar/
/guias/trabalho-remoto-como-conseguir-vaga/
/guias/vale-transporte-e-vale-refeicao/
```

Renda e negócio:

```
/guias/renda-extra-com-ia/
/guias/vender-online-sem-estoque/
/guias/como-precificar-produto/
/guias/marketing-para-pequeno-negocio/
/guias/criar-site-de-vendas-gratuito/
/guias/como-vender-no-marketplace/
/guias/curso-online-como-vender/
/guias/como-criar-produto-digital/
```

Custos e planos:

```
/guias/cartao-de-credito-como-escolher/
/guias/como-solicitar-emprestimo-pessoal/
/guias/orcamento-familiar-passo-a-passo/
/guias/como-reduzir-contas-de-casa/
/guias/seguro-residencial-contratar/
/guias/assinatura-streaming-cortar/
/guias/plano-de-saude-para-mei/
/guias/custo-real-de-ter-mei/
```

Automação e IA (cluster já existente):

```
/guias/como-criar-agente-de-ia/
/guias/agente-de-ia-o-que-e/
/guias/prompts-para-agentes-de-ia/
/guias/rag-explicado/
/guias/guardrails-agentes-de-ia/
/guias/como-escolher-ferramenta-de-ia/
/guias/automacao-para-pequenas-empresas/
/guias/o-que-e-automacao-de-processos/
/guias/automacao-com-n8n/
/guias/custo-de-agente-de-ia/
/guias/chatbot-para-whatsapp/
/guias/ia-para-atendimento-humano/
/guias/ia-para-financeiro/
/guias/ia-para-vendas/
/guias/ia-para-recrutamento/
/guias/ia-para-juridico/
/guias/renderizacao-de-faturas-ia/
/guias/crm-ia-para-vendas/
/guias/marketing-com-ia/
```

Comparativos:

```
/comparativos/n8n-vs-make/
/comparativos/make-vs-zapier/
/comparativos/langchain-vs-crewai/
/comparativos/chatgpt-vs-claude-vs-gemini/
/comparativos/dify-vs-flowise/
/comparativos/manychat-vs-typebot/
/comparativos/elevenlabs-vs-heygen/
```

Índices:

```
/comparativos/
/ferramentas/
/guias/
/precos/
/glossario/
/faq/
/categorias/servicos-publicos/
/categorias/mei-e-nota-fiscal/
/categorias/trabalho-e-carreira/
/categorias/renda-e-negocio/
/categorias/automacao-e-ia/
/categorias/custos-e-planos/
```

> Um comparativo **nunca** mora em `/guias/`. Se o slug do arquivo de
> comparação for `slug`, a URL é `/comparativos/slug/`.

---

## 2. Comparativos (`src/content/comparisons/*.md`)

Frontmatter:

```yaml
---
title: "n8n x Make: qual automação é mais barata em 2026?"
description: "..."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao-e-ia"
slug: "n8n-vs-make"
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
    cons:
      - "Contras real"
---
```

O corpo deve ser a análise: contexto, método de comparação, tabela
comparativa em markdown, veredito por critério e a conclusão com o vencedor
**e** para quem o perdedor ainda é a melhor escolha.

---

## 3. Ferramentas (`src/content/tools/*.json`)

```json
{
  "name": "n8n",
  "slug": "n8n",
  "category": "automacao-e-ia",
  "tagline": "Automação open source com código quando você precisa",
  "description": "Descrição de 140 a 160 caracteres.",
  "url": "https://n8n.io",
  "affiliateUrl": "https://n8n.io/?via=yooka",
  "price": "€20/mês",
  "priceNote": "Planos de €20/mês (2.500 execuções). Verificado em outubro de 2026.",
  "bestFor": "Times técnicos e automações que exigem código",
  "rating": 4.6,
  "ratingCount": 128,
  "pros": ["Prós", "Prós", "Prós"],
  "cons": ["Contras", "Contras"],
  "features": [{ "name": "Recurso", "detail": "Detalhe curto" }],
  "useCases": ["Caso de uso 1", "Caso de uso 2"],
  "bestForWho": "Público ideal",
  "verdict": "Veredito de 3 a 5 frases.",
  "alternatives": ["make", "zapier"],
  "updated": "2026-10-30"
}
```

Preços mudam: sempre inclua `priceNote` com a data de verificação. Nunca
invente desconto.

---

## 4. Glossário (`src/content/glossary.json`)

```json
[
  {
    "term": "DAS",
    "slug": "das",
    "short": "Definição de até 20 palavras.",
    "body": "Parágrafo(s) de 80 a 150 palavras com contexto e exemplo.",
    "related": ["mei"]
  }
]
```

---

## 5. FAQ global (`src/content/faq.json`)

```json
[{ "q": "Pergunta?", "a": "Resposta objetiva de 1 a 3 frases." }]
```

---

## Checklist antes de commitar

- [ ] O título contém a palavra-chave e um motivo para clicar.
- [ ] A descrição tem 140–160 caracteres e promete algo concreto.
- [ ] O primeiro parágrafo responde à pergunta em até 70 palavras.
- [ ] Existe pelo menos uma tabela ou lista numerada.
- [ ] Todos os links internos apontam para URLs garantidas.
- [ ] Nenhum emoji, nenhuma promessa de resultado.
- [ ] Os números citados têm contexto e data.
- [ ] As perguntas do `faq` do frontmatter estão respondidas no corpo.
