---
title: "Prompts para agentes de IA: 12 modelos prontos para a sua empresa"
description: "Banco com 12 prompts prontos para agentes de IA, a estrutura em 7 blocos que funciona em qualquer caso de uso e os erros que quebram um agente."
date: "2026-10-30"
updated: "2026-10-30"
category: "agentes-de-ia"
tags: ["prompts", "agente de ia", "prompt de sistema", "atendimento"]
keywords: ["prompts para agentes de ia", "prompt de sistema", "modelos de prompt para agentes", "como escrever prompt de agente", "prompt para chatbot"]
featured: false
draft: false
faq:
  - q: "Qual a diferença entre o prompt de um chat e o prompt de um agente?"
    a: "O prompt de chat descreve um papel e um formato de resposta. O prompt de agente também define ferramentas, limites de ação, critérios de escalonamento e o que fazer quando a informação não existe."
  - q: "Quantas instruções devo colocar no prompt de sistema?"
    a: "O suficiente para o agente não errar sozinho. Na prática, entre 40 e 80 linhas: papel, contexto, tarefa, ferramentas, formato de saída e limites do que não fazer."
  - q: "Prompts longos melhoram a qualidade?"
    a: "Nem sempre. Prompts com instruções redundantes ou contraditórias pioram o resultado, porque o modelo passa a seguir a instrução mais recente. Prefira blocos curtos e um teste para cada regra."
  - q: "Como eu sei se o prompt está bom?"
    a: "Monte um conjunto de 20 a 30 casos reais com a resposta esperada e meça a taxa de acerto. Um prompt só é considerado pronto quando passa de 90% nesse conjunto."
---

Prompts para agentes de IA seguem uma estrutura diferente dos prompts de chat: além de dizer o que fazer, precisam definir quais ferramentas o agente pode usar, o que ele nunca deve fazer sozinho e quando escalar para uma pessoa. Este guia traz a estrutura em sete blocos, doze modelos prontos por área de negócio e o método para adaptá-los ao vocabulário da sua empresa.

## Por que o prompt de um agente é diferente do prompt de um chat

No chat, um prompt ruim produz uma resposta ruim e a conversa termina ali. No agente, um prompt ruim produz uma ação errada em um sistema de produção: um desconto aplicado, uma nota reenvada, um e-mail enviado para o cliente errado.

A diferença é de responsabilidade. O chat responde sobre o que foi perguntado. O agente age sobre o que entendeu. E o que ele entendeu depende do prompt, porque é o prompt que define:

- Quais ferramentas existem e quando usar cada uma.
- O formato exato do que ele deve devolver.
- O que fazer quando a informação não está disponível.
- Em que situações ele para e chama um humano.

Sem essas quatro definições, o agente improvisa. E improvisação, em processo que toca sistema de produção, vira custo.

## A estrutura em sete blocos que funciona em qualquer agente

Independentemente do caso de uso, todo prompt de agente é montado com os mesmos sete blocos, nesta ordem.

| Bloco | O que define | Erro comum quando falta |
|---|---|---|
| Papel | Quem o agente é e de quem ele fala | Agente genérico, sem personalidade |
| Contexto | Empresa, regras de negócio, dados de referência | Resposta correta no papel, errada na realidade |
| Objetivo | O resultado que o agente precisa entregar | Agente que pergunta tudo e não concludes nada |
| Ferramentas | Quais ações existem e como cada uma se chama | Modelo inventa uma ferramenta que não existe |
| Formato de saída | Exatamente o que deve ser devolvido | Resposta que precisa de limpeza manual |
| Limites | O que não fazer sem aprovação humana | Agente concede desconto de R$ 3.000 sozinho |
| Escalonamento | Quando parar e passar para uma pessoa | Erro escondido em um relatório que ninguém lê |

A ordem importa menos do que a ausência. O erro mais comum em prompt de agente é a ausência do bloco de limites: o modelo, na dúvida, tenta resolver o problema do usuário. E "resolver" inclui concede desconto que a empresa não pretendia.

## Doze prompts prontos, por área de negócio

Os modelos abaixo usam exemplos de empresas brasileiras e estão escritos para funcionar com a estrutura de sete blocos. Adapte os nomes, valores e regras antes de usar.

### Prompt 1: triagem de lead no WhatsApp

Para padarias, clínicas e lojas de ecommerce que recebem volume alto de mensagem sem qualificação. Compare com [chatbot para WhatsApp](/guias/chatbot-para-whatsapp/).

```
Você é o assistente virtual da Padaria Pão de Trigo, em Campinas/SP.
Atendimento das 6h às 20h, de segunda a sábado.
Objetivo: entender o que o cliente quer e agendar a retirada.
Regras:
- Faça no máximo 2 perguntas antes de oferecer horários.
- Pedidos acima de 30 itens vão para orçamento e são escalados ao responsável.
- Confirme sempre data e horário antes de registrar.
- Se não souber o preço, diga que vai confirmar. Nunca invente valor.
Formato: texto curto, em português, sem markdown.
```

### Prompt 2: confirmação de agendamento em clínica

```
Você é o assistente da Clínica Vida Plena, em Belo Horizonte.
Objetivo: confirmar, remarcar ou cancelar consultas.
Dados obrigatórios antes de confirmar: nome do paciente, data, hora e profissional.
Se o paciente não constar na agenda do dia, ofereça as 3 horários vagos mais próximos.
Nunca confirme horário sem consultar a agenda. Se a agenda não responder, pergunte se pode tentar de novo em 1 minuto.
Não dê diagnóstico, não indique medicamento, não interprete exame.
Valores: particular R$ 280; convênio Gold R$ 190.
```

### Prompt 3: qualificação de orçamento de frete

```
Você monta propostas de frete para a Transportadora Rota Sul.
Colete: origem, destino, peso total, volume, tipo de carga e data prevista.
Consulte a tabela de frete pela ferramenta de cálculo de frete.
Desconto máximo sem aprovação: 8%. Acima disso, escale ao gestor comercial.
Apresente valor, prazo em dias úteis e condição de pagamento (28 dias para pessoa jurídica).
Se a carga não estiver clara, peça foto da nota fiscal.
```

### Prompt 4: resumo de conversa para o CRM

O formato de saída e a integração com o pipeline de vendas estão detalhados em [CRM com IA para vendas](/guias/crm-ia-para-vendas/).

```
Você é o assistente comercial do Estúdio Traço, de Curitiba.
Receba a transcrição da conversa e produza o resumo para o CRM.
Formato de saída: JSON com os campos cliente, segmento, orcamento_mensal, prazo_projeto, proximo_passo e responsavel.
Regra: campo ausente na conversa sai como null. Nunca invente.
proximo_passo sempre describes uma ação com data.
```

### Prompt 5: conciliação de faturas de cliente

```
Você compara cada nota fiscal recebida com o pedido de compra e o contrato do cliente.
Divergências a sinalizar: valor acima de 2% do pedido, vencimento diferente do contrato, CNPJ do emitente diferente do cadastro, item sem preço no pedido.
Para cada divergência, informe o valor em reais, o documento envolvido e a regra violada.
Não aprove nem reprove a nota. Marque sempre como "aguarda análise humana".
```

### Prompt 6: classificação de despesas de cartão

```
Você classifica despesas de cartão empresarial em 12 categorias.
Retorne: categoria, subcategoria, centro de custo, valor e fornecedor.
Se a descrição do extrato for ambígua, use "revisar" como categoria e não force uma.
Valores acima de R$ 5.000 recebem a tag "aprovação pendente".
```

### Prompt 7: cobrança de recebíveis

Detalhes da conciliação e da rotina de cobrança estão em [IA para financeiro](/guias/ia-para-financeiro/).

```
Você redige e envia mensagens de cobrança de parcelas em atraso.
Tom: cordial e direto, sem ameaça judicial e sem citar juros que não estejam no contrato.
Inclua sempre valor, data de vencimento original e o caminho para a segunda via.
Não ofereça desconto sem aprovação humana.
Pedidos com mais de 60 dias de atraso vão para a área de cobrança judicial.
```

### Prompt 8: análise de contrato padrão

A revisão humana como etapa obrigatória é o padrão em escritórios de advocacia. O contexto está em [IA para jurídico](/guias/ia-para-juridico/).

```
Você revisa contratos padrão do escritório e aponta o que diverge do modelo aprovado.
Compare o documento recebido com a cláusula padrão na ferramenta de consulta de modelos.
Classifique cada divergência: crítica (prazo, multa, foro, penalidade), atenção (limitação de responsabilidade) ou padrão.
Não sugira redação final. Aponte a cláusula, o texto padrão e o trecho recebido.
Gere também um resumo de 5 linhas para o advogado responsável.
```

### Prompt 9: extração de dados de PDFs

```
Você extrai dados de notas fiscais e faturas em PDF.
Campos: número do documento, série, CNPJ do emitente, data de emissão, valor total, data de vencimento, ICMS e PIS.
Leia o documento uma única vez. Se um campo não estiver legível, marque como null e aponte a página.
Retorne apenas os campos e a página de origem, sem explicação adicional.
```

### Prompt 10: classificação e encaminhamento de e-mails

```
Você classifica os e-mails recebidos e os encaminha para a fila correta.
Categorias: cobranca, reclamacao, documentacao, oportunidade, spam, other.
Para cada e-mail, informe categoria, assunto resumido em até 10 palavras, urgência (alta, media, baixa) e ação sugerida.
Encaminhe automaticamente apenas a categoria "documentacao". As demais exigem análise humana.
```

### Prompt 11: controle de estoque e produção diária

```
Você recebe os pedidos do dia e o estoque atual de uma padaria com duas unidades.
Para cada produto, calcule a quantidade a produzir considerando estoque atual, pedidos confirmados e perda média histórica de 4%.
Respeite a capacidade diária de cada unidade e o tempo de fermentação de 4 horas.
Apresente a tabela com produto, quantidade por unidade e o que não cabe na capacidade do dia.
```

### Prompt 12: briefing criativo de campanha

O volume de peças que um estúdio de design precisa produzir é o ponto de partida. Veja [IA para marketing e vendas](/categorias/marketing-e-vendas/).

```
Você transforma as informações de uma campanha em briefing para a equipe de design.
Receba público-alvo, oferta, prazo, canais e tom de voz.
Entregue: mensagem central em uma frase, 3 variações de título, pontos de apoio com argumento de venda e o que não fazer.
Se o público-alvo não estiver informado, pergunte antes de seguir.
```

## Como adaptar os prompts ao vocabulário da sua empresa

Um prompt genérico funciona em demonstração e falha em produção, porque a empresa real tem vocabulário próprio, exceções que ninguém documentou e regras que estão na cabeça de uma pessoa.

1. **Colete as expressões reais do time.** Peça para a pessoa que faz a tarefa hoje listar as 20 mensagens que mais recebe e as 10 respostas que mais dá. O vocabulário dela é o vocabulário correto.
2. **Nomeie as ferramentas como elas existem.** Se o sistema se chama "Portal doCliente" e não "CRM", escreva "Portal doCliente" no prompt. A descrição da ferramenta precisa bater com o que o sistema realmente faz.
3. **Transforme exceções conhecidas em regras explícitas.** "Quando o cliente pedir rastreio" só funciona se estiver escrito. Se não estiver, o agente trata igual a todo mundo.
4. **Declare os limites em número.** "Desconto máximo de 8% sem aprovação" funciona. "Desconto somente quando for cliente antigo" não, porque "cliente antigo" não tem definição.
5. **Inclua o formato de saída literal.** Cole no prompt um exemplo real da saída esperada, com os campos preenchidos. Modelos de saída bem construídos costumam reduzir pela metade as respostas que voltam para correção manual.

## Quatro erros que quebram um prompt de agente

| Erro | O que acontece na prática | Correção |
|---|---|---|
| Instruções contraditórias | Duas regras colidem e o modelo segue a última | Uma instrução por linha; teste antes de adicionar a próxima |
| Ferramenta sem descrição clara | O agente escolhe a ferramenta errada | Descreva quando usar e quando não usar cada ferramenta |
| Limite vago | O agente age além da autorização | Escreva limite numérico com valor e unidade |
| Falta de "não sei" | O agente inventa resposta quando não tem o dado | Inclua a instrução explícita de declarar a ausência de informação |

O último erro é o mais caro. Sem a instrução de declarar ignorância, o modelo completa a lacuna com o texto mais plausível, e em processo comercial isso significa cotação errada, prazo errado ou informação que o cliente leva a sério.

## Como testar e evoluir um prompt sem quebrar o que já funciona

Prompt de agente é código de negócio que não compila. Você precisa de um conjunto de casos de teste, do mesmo jeito que uma aplicação precisa.

O método, em cinco passos:

1. **Monte o conjunto.** Escolha 20 a 30 casos reais: os 10 mais frequentes, os 5 que mais deram erro e 5 que o agente nunca resolveu.
2. **Defina o esperado.** Para cada caso, escreva o que o agente deveria responder ou fazer. Se você não consegue escrever o esperado, ainda não entendeu a tarefa.
3. **Meça a taxa de acerto.** Um prompt só entra em produção com mais de 90% de acerto no conjunto.
4. **Acompanhe a regressão.** Toda mudança no prompt roda o conjunto inteiro de novo. O prompt que melhorou a triagem quebrou a conciliação, e ninguém percebeu.
5. **Alimente o conjunto com os erros reais.** Toda semana, pegue os casos que o agente errou em produção e adicione ao conjunto.

O [guia de guardrails para agentes de IA](/guias/guardrails-agentes-de-ia/) mostra como transformar as regras do prompt em travas no código, para que um erro do modelo não vire um erro de sistema.

## Perguntas frequentes

**Qual a diferença entre o prompt de um chat e o prompt de um agente?** O prompt de chat define um papel e um formato de resposta. O prompt de agente acrescenta ferramentas, limites de ação, critério de escalonamento e o comportamento esperado quando a informação não existe. É a diferença entre "responda bem" e "responda dentro do que está autorizado".

**Quantas instruções devo colocar no prompt de sistema?** Entre 40 e 80 linhas, no formato dos sete blocos. Acima disso, costuma haver instrução redundante ou conflitante, que piora o resultado em vez de melhorar.

**Prompts longos melhoram a qualidade?** Nem sempre. Um prompt com 200 linhas de regras repetidas dá ao modelo mais material para se contradizer. Prefira blocos curtos, um teste por regra e uma revisão a cada alteração.

**Preciso reescrever o prompt quando troco de modelo?** Em geral, sim, mas não totalmente. Modelos diferentes interpretam ênfase e ordem de instruções de maneiras diferentes. Depois da troca, rode o conjunto de teste e ajuste o que mudou de comportamento. A comparação entre modelos está em [ChatGPT vs Claude vs Gemini](/comparativos/chatgpt-vs-claude-vs-gemini/).

**Como sei se o prompt está bom?** Pela taxa de acerto em um conjunto de casos reais. Sem o conjunto, qualquer alteração parece melhora porque não existe linha de base para comparar.

## Próximos passos

O prompt é uma das sete peças do agente. Depois de escrevê-lo, veja [como criar um agente de IA](/guias/como-criar-agente-de-ia/) para conectar as ferramentas e subir o fluxo. Se o agente precisa consultar tabela de preço, contrato ou manual, o passo seguinte é [RAG explicado](/guias/rag-explicado/). A [automação com n8n](/guias/automacao-com-n8n/) mostra onde essa busca entra no fluxo, e o [glossário](/glossario/) uniformiza os termos. E se você ainda não decidiu a base de orquestração, [como escolher ferramenta de IA](/guias/como-escolher-ferramenta-de-ia/) compara as opções.
