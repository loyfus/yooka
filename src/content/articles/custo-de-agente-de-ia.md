---
title: "Custo de um agente de IA em 2026: quanto custa por tarefa, em reais"
description: "Quanto custa um agente de IA em 2026: custo por token, por execução e por tarefa em reais, tabela de planos, ponto de equilíbrio e ROI com exemplos reais."
date: "2026-10-30"
updated: "2026-10-30"
category: "custos"
tags: ["custos", "agente-de-ia", "tokens", "roi", "precos"]
keywords: ["custo de agente de IA", "quanto custa um agente de IA", "custo por token IA", "preço API IA em reais", "ROI automação IA"]
featured: true
draft: false
faq:
  - q: "Quanto custa um agente de IA por mês?"
    a: "Depende do volume e do modelo. Um agente que processa 1.000 tarefas curtas por mês com um modelo barato gasta cerca de R$ 4 a R$ 30 em tokens, somados à assinatura da ferramenta de orquestração, entre R$ 50 e R$ 150."
  - q: "Como calcular o custo de um agente de IA?"
    a: "Some quatro camadas: tokens de entrada, tokens de saída, chamadas por tarefa e assinaturas de ferramentas. Divida o total pelo número de tarefas concluídas para obter o custo por tarefa, que é a única métrica que importa para ROI."
  - q: "Assinatura ou API: qual sai mais barato?"
    a: "A assinatura é previsível e vale para uso interno e ad-hoc. A API paga por uso e ganha quando o volume é alto e variável, ou quando o agente roda em produção com integração ao seu sistema."
  - q: "Vale a pena criar um agente de IA?"
    a: "Vale quando a tarefa é repetitiva, o volume é alto e o erro humano custa caro. Com menos de 15 horas por mês economizadas, o projeto raramente se paga — nesse caso, uma regra fixa em ferramenta de automação resolve mais barato."
---

Custo de um agente de IA em 2026 é composto de quatro camadas: tokens de entrada, tokens de saída, chamadas extras por tarefa e assinaturas de ferramentas. Na prática, um agente que resolve 1.000 tarefas por mês custa entre R$ 15 e R$ 250, dependendo do modelo usado. O que define o projeto não é o preço do token, é a quantidade de chamadas que cada tarefa dispara.

## As quatro camadas de custo de um agente de IA

Um agente de IA não cobra por "agente". Ele cobra por requisição de API. Somando o que paga de fato:

1. **Tokens de entrada.** Tudo que entra no prompt: instrução do sistema, histórico da conversa, documento consultado, dados do cliente. É a camada que mais cresce sem ninguém perceber, porque o histórico cresce a cada turno.
2. **Tokens de saída.** O que o modelo escreve. Em geral é 10 a 20% do volume de entrada, mas com raciocínio estendido pode passar disso.
3. **Chamadas extras.** Cada uso de ferramenta (buscar no banco, chamar API, abrir navegador) pode disparar nova requisição ao modelo. Um agente que planeja, executa e revisa faz de 3 a 12 chamadas por tarefa.
4. **Assinaturas e infraestrutura.** Plataforma de orquestração, banco de dados, hospedagem, observabilidade, e a assinatura do modelo quando o time usa chat em vez de API.

| Camada | Como é cobrada | Peso típico no total | Como reduzir |
|---|---|---|---|
| Entrada | Por 1 milhão de tokens | 30% a 60% | Cache de prompt, histórico resumido |
| Saída | Por 1 milhão de tokens | 10% a 25% | Limite de verbosidade no prompt |
| Chamadas extras | Por requisição adicional | 20% a 50% | Cache de resultado, limite de turnos |
| Assinaturas | Mensalidade fixa | 5% a 25% | Right-sizing do plano |

A tabela completa de token por token está na seção de [preços](/precos/), e os conceitos por trás de cada camada estão em [agente de IA: o que é](/guias/agente-de-ia-o-que-e/).

## Custo por token em reais (outubro de 2026)

Valores verificados em outubro de 2026, convertidos para real com taxa de referência de US$ 1 = R$ 5,80. Preços mudam: confirme sempre na página oficial do provedor antes de orçar.

| Modelo | Entrada (US$/1M) | Saída (US$/1M) | Entrada (R$/1M) | Saída (R$/1M) | Indicação |
|---|---|---|---|---|---|
| Claude Haiku 5.5 | US$ 0,10 | US$ 0,50 | R$ 0,58 | R$ 2,90 | Classificação, extração, triagem |
| Gemini Flash | US$ 0,30 | US$ 2,50 | R$ 1,74 | R$ 14,50 | Volume alto, tarefas curtas |
| GPT-5 mini (OpenAI) | US$ 0,25 | US$ 2,00 | R$ 1,45 | R$ 11,60 | Resumo, extração, redação |
| Claude Sonnet 5.5 | US$ 2,00 | US$ 10,00 | R$ 11,60 | R$ 58,00 | Raciocínio, redação, código |
| Gemini Pro | US$ 1,25 | US$ 10,00 | R$ 7,25 | R$ 58,00 | Análise multimodal, documentos longos |
| Claude Opus 5.5 | US$ 4,00 | US$ 20,00 | R$ 23,20 | R$ 116,00 | Decisão complexa, baixo volume |

Três leituras: um modelo barato é 20 a 40 vezes mais barato que um caro por token, mas essa economia só se traduz em benefício se a qualidade se mantiver. Segunda: saída é proporcionalmente mais cara, então "responda em uma frase" economiza mais do que parece. Terceira: o modelo mais caro raramente é a melhor escolha em produção — ele é útil no desenvolvimento, para calibrar o prompt, e nos casos de exceção. O [comparativo ChatGPT x Claude x Gemini](/guias/chatgpt-vs-claude-vs-gemini/) detalha quando usar cada um.

## Custo por execução: quanto custa uma tarefa completa

O número que importa é o custo de uma tarefa concluída, e não o de uma chamada. Um mesmo agente faz de 1 a 4 chamadas por tarefa, dependendo de quantas ferramentas precisa acionar (planejar, consultar, agir, verificar). Por isso o custo varia por tipo de tarefa:

| Tipo de tarefa | Tokens por chamada | Chamadas por tarefa | Custo com Haiku 5.5 | Custo com Sonnet 5.5 |
|---|---|---|---|---|
| Classificar lead (entrada 1.200 / saída 300) | 1.500 | 1 | R$ 0,002 | R$ 0,031 |
| Responder no WhatsApp (1.800 / 250) | 2.050 | 2 | R$ 0,004 | R$ 0,071 |
| Extrair dados de nota fiscal (2.500 / 600) | 3.100 | 2 | R$ 0,006 | R$ 0,128 |
| Resumir reunião (4.000 / 500) | 4.500 | 1 | R$ 0,004 | R$ 0,075 |
| Qualificar com consulta ao CRM (2.000 / 400) | 2.400 | 4 | R$ 0,009 | R$ 0,186 |

Multiplicando pelo volume mensal, um agente que classifica 600 leads por mês com Haiku 5.5 custa cerca de R$ 0,94 de tokens. O mesmo volume com Sonnet 5.5 custa R$ 18,80. A diferença de R$ 17,80 por mês justifica um teste de qualidade: se o modelo barato acerta 92% e o caro 96%, os 4 pontos de diferença costumam valer mais que R$ 17,80 — mas se os números se aproximam, o barato vence.

## Quanto custa automatizar X: cinco casos com números em reais

### Emitir e conferir nota fiscal

Cenário: distribuidora com 400 notas fiscais por mês, extração de XML, conferência de valores e envio ao cliente por e-mail. Tarefa de extração com 2.500 tokens de entrada e 600 de saída, uma chamada de modelo por nota, mais a consulta ao ERP.

| Item | Cálculo | Custo mensal |
|---|---|---|
| Tokens (Gemini Flash) | 400 × R$ 0,013 | R$ 5,20 |
| Orquestração (n8n Starter) | 2.500 execuções inclusas | R$ 132 |
| Validação e revisão humana | 20% das notas, 3 min cada | R$ 240 (hora de análise) |
| **Total do piloto** | | **R$ 377** |

O que costuma ser esquecido: a conferência humana não some, ela muda de lugar. Em vez de 48 horas por mês de digitação e conferência, sobram cerca de 4 horas de revisão de exceção. O [guia de renderização de faturas com IA](/guias/renderizacao-de-faturas-ia/) mostra o padrão de extração por campo.

### Cobrar boleto vencido

Cenário: 300 cobranças por mês, régua de WhatsApp e e-mail, baixa automática no pagamento. A mensagem é padronizada, então a camada de IA entra apenas para personalizar o tom quando o cliente está atrasado há mais de 15 dias — ou nem entra.

| Item | Cálculo | Custo mensal |
|---|---|---|
| Tokens (personalização, 30% das cobranças) | 90 × R$ 0,004 | R$ 0,36 |
| Emissão do boleto (provedor) | 300 × R$ 0,15 | R$ 45 |
| Orquestração (n8n Starter) | 300 execuções | R$ 132 |
| Envio de mensagem (WhatsApp Business API) | 300 conversas | R$ 105 |
| **Total mensal** | | **R$ 282** |

O ganho aqui não é o custo: é a redução da inadimplência. Uma queda de 1 ponto percentual em uma carteira de R$ 200.000 representa R$ 2.000 por mês recuperados. Contra R$ 282 de ferramenta, o retorno é imediato. Detalhes de régua em [IA para financeiro](/guias/ia-para-financeiro/).

### Primeira resposta no WhatsApp

Cenário: clínica com 1.500 mensagens por mês, recebimento automático, coleta de dados e agendamento, com escalonamento para humano em horário comercial.

| Item | Cálculo | Custo mensal |
|---|---|---|
| Tokens (Gemini Flash, 1.800/250 por mensagem) | 1.500 × R$ 0,0068 | R$ 10,15 |
| Orquestração (n8n Pro) | 10.000 execuções | R$ 330 |
| WhatsApp Business API (janela de 24 h) | 1.500 × R$ 0,35 | R$ 525 |
| **Total mensal** | | **R$ 865** |

Aqui o maior custo é a Meta, não a IA. A conclusão prática: o chatbot é barato, o canal não. O [guia de chatbot para WhatsApp](/guias/chatbot-para-whatsapp/) detalha como dimensionar a conversa cobrada e quando usar a API do WhatsApp em vez de uma solução de terceiro.

### Qualificar lead e preencher o CRM

Cenário: e-commerce com 600 leads por mês, classificação por interesse e faixa de preço, criação da oportunidade no CRM e distribuição para o vendedor.

| Item | Cálculo | Custo mensal |
|---|---|---|
| Tokens (Gemini Flash, 1.200/300) | 600 × R$ 0,0064 | R$ 3,85 |
| Chamadas de verificação (dedupe no CRM, 1 extra por lead) | 600 × R$ 0,0043 | R$ 2,60 |
| Orquestração (n8n Starter) | 1.200 execuções | R$ 132 |
| **Total mensal** | | **R$ 138** |

Somando a taxa de conversão: se 8% dos 600 leads se tornarem venda de R$ 320 em ticket médio, o volume é R$ 15.360. A automação custa R$ 138 e libera o vendedor para trabalhar em contas grandes. O [guia de CRM com IA para vendas](/guias/crm-ia-para-vendas/) mostra a integração completa.

### Resumir reunião e gerar ata

Cenário: escritório com 200 reuniões por mês, transcrição, resumo com decisões e responsáveis, e distribuído no Drive.

| Item | Cálculo | Custo mensal |
|---|---|---|
| Tokens (Gemini Flash, 4.000/500) | 200 × R$ 0,014 | R$ 2,80 |
| Orquestração (n8n Starter) | 200 execuções | R$ 132 |
| Armazenamento e e-mail | — | R$ 0 |
| **Total mensal** | | **R$ 135** |

Transcrição de áudio, quando existe, é item separado: provedores cobram por minuto, na faixa de R$ 0,10 a R$ 0,40, o que para 200 reuniões de 40 minutos significa R$ 800 a R$ 3.200. Resumo é barato; escutar é caro.

## Comparativo de planos por assinatura

Para uso interno sem API, a assinatura é o caminho. Valores verificados em outubro de 2026, com taxa de referência de US$ 1 = R$ 5,80. Preços mudam: confira as páginas oficiais.

| Ferramenta | Plano | Preço original | Em reais (aprox.) | Uso típico | Observação |
|---|---|---|---|---|---|
| n8n | Starter | € 20/mês | R$ 132 | Orquestração de fluxos | 2.500 execuções/mês |
| n8n | Pro | € 50/mês | R$ 330 | Fluxos com volume alto | 10.000 execuções/mês |
| Make | Core | US$ 9/mês | R$ 52 | Orquestração simples | 10.000 créditos/mês |
| Zapier | Professional | US$ 19,99/mês | R$ 116 | Integrações sem código | 20.000 tasks/mês |
| ChatGPT Business | Business | US$ 25/usuário/mês | R$ 145 | Chat interno e redação | Sem limite de mensagens pesadas |
| Claude | Pro | US$ 20/mês | R$ 116 | Trabalho pesado de texto e código | Uso limitado por período |
| Claude | Team | US$ 30/usuário/mês | R$ 174 | Time com contexto compartilhado | Mínimo de 5 usuários |
| Gemini | Google AI Pro | US$ 19,99/mês | R$ 116 | Pesquisa e Google Workspace | 2 TB de armazenamento |
| Gemini | Google AI Ultra | US$ 249,99/mês | R$ 1.450 | Uso avançado e raciocínio profundo | 30 TB de armazenamento |

Regra prática: assinatura para o time usar, API para o sistema executar. Misturar os dois é erro comum — pagar R$ 145 por usuário para automatizar uma tarefa de backend que a API faria por R$ 0,01.

## Ponto de equilíbrio e ROI

**Custo total mensal = tokens + assinaturas + infraestrutura + supervisão humana**

**Economia mensal líquido = economia mensal − custo mensal da automação**

**Payback (meses) = custo de implantação ÷ economia mensal líquido**

| Caso | Custo mensal | Economia mensal | Implantação | Payback |
|---|---|---|---|---|
| Padaria: confirmação de pedido | R$ 137 | R$ 1.080 | R$ 1.200 | 1,3 mês |
| Clínica: agendamento e cobrança | R$ 865 | R$ 1.950 | R$ 3.500 | 3,2 meses |
| Distribuidora: extração de nota fiscal | R$ 377 | R$ 1.710 | R$ 4.000 | 3,0 meses |
| Escritório de advocacia: triagem de e-mails | R$ 248 | R$ 810 | R$ 2.500 | 4,4 meses |
| E-commerce: qualificação de lead | R$ 138 | R$ 1.890 | R$  2.000 | 1,1 mês |
| Transportadora: romaneio automático | R$ 420 | R$ 1.170 | R$ 5.000 | 6,7 meses |

Com economia mensal líquido abaixo de R$ 400, o payback ultrapassa seis meses mesmo com implantação de R$ 2.500, e a manutenção começa a comer a margem. O [guia de automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/) traz o cálculo aplicado por setor.

## Como reduzir o custo de um agente em 5 passos

1. **Meça antes de otimizar.** Registre tokens de entrada e saída por tarefa. Sem isso, qualquer ajuste é achismo. O painel de uso do provedor já entrega esse detalhamento.
2. **Cache o prefixo estável.** Instrução de sistema, lista de ferramentas e base de conhecimento raramente mudam. Com cache de prompt, a leitura custa uma fração do preço.
3. **Resuma o histórico.** Enviar 20 turnos de conversa a cada chamada é a forma mais rápida de dobrar a fatura. Resuma o que importa e descarte o resto.
4. **Use o modelo mais barato que passa no seu teste.** Meça a taxa de acerto em 100 casos reais do seu negócio. Se o modelo barato acerta o suficiente, troque.
5. **Limite o número de turnos.** Defina um teto de iterações por tarefa e um orçamento máximo em tokens. [Guardrails](/guias/guardrails-agentes-de-ia/) fazem isso de forma estruturada, e é o que separa um agente de uma fatura inesperada.

## Onde o orçamento estoura

- **Loop infinito de ferramenta.** Sem teto de turnos, o agente chama a API de boleto até o limite de crédito. Sempre defina orçamento por tarefa.
- **Contexto grande demais.** Mandar o PDF inteiro de 200 páginas para extrair três campos dobra o custo sem melhorar a resposta. Recorte antes.
- **Modelo caro em tarefas simples.** Classificar texto não justifica um modelo de raciocínio profundo.
- **Fila sem backpressure.** Volume alto processado em rajada consome tokens e taxa de API sem retorno.
- **Falta de observabilidade.** Sem log por tarefa, você não sabe onde os R$ 800 foram. Ver [preços](/precos/) e a [categoria de custos](/categorias/custos/) para o panorama completo.

## Perguntas frequentes sobre o custo de um agente de IA

**Quanto custa um agente de IA por mês?** Um agente que processa 1.000 tarefas curtas por mês gasta cerca de R$ 4 a R$ 30 em tokens com modelo barato, R$ 60 a R$ 470 com modelo intermediário, e soma-se a assinatura da ferramenta de orquestração, entre R$ 50 e R$ 150.

**Como calcular o custo de um agente de IA?** Some as quatro camadas: tokens de entrada, tokens de saída, chamadas extras por tarefa e assinaturas. Divida o total pelo número de tarefas concluídas para obter o custo por tarefa — é a única métrica que importa para ROI.

**Assinatura ou API: qual sai mais barato?** A assinatura é previsível e serve para uso interno e ad-hoc. A API paga por uso e ganha quando o volume é alto e variável, ou quando o agente roda em produção integrado ao seu sistema.

**Vale a pena criar um agente de IA?** Vale quando a tarefa é repetitiva, o volume é alto e o erro humano custa caro. Com menos de 15 horas por mês economizadas, o projeto raramente se paga — nesse caso, uma regra fixa em ferramenta de automação resolve mais barato.

Para montar o agente em si, o passo a passo está em [como criar um agente de IA](/guias/como-criar-agente-de-ia/); para a base de conhecimento, em [RAG explicado](/guias/rag-explicado/); e para a escrita dos prompts, em [prompts para agentes de IA](/guias/prompts-para-agentes-de-ia/).
