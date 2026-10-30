---
title: "Como criar um agente de IA em 2026: passo a passo em 8 etapas"
description: "Aprenda como criar um agente de IA do zero: escopo, prompt de sistema, ferramentas, memória, testes e custo em Real. Passo a passo para empresas brasileiras."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao-e-ia"
tags: ["agente de ia", "automacao", "implementacao", "custo"]
keywords: ["como criar um agente de ia", "criar agente de ia", "agente de ia na pratica", "passo a passo agente de ia", "implantar agente de ia"]
featured: true
draft: false
faq:
  - q: "Qual a diferença entre um agente de IA e um chatbot comum?"
    a: "Um chatbot responde mensagens com texto. Um agente executa tarefas: decide o que fazer, consulta sistemas conectados e devolve o resultado pronto. O chatbot é a interface; o agente é o processo que roda por trás dela."
  - q: "Preciso saber programar para criar um agente de IA?"
    a: "Não necessariamente. Ferramentas como n8n e Make montam o fluxo por arrastar e soltar. Mas saber o básico de API e JSON evita que você fique refém da plataforma na hora de integrar o ERP ou o CRM."
  - q: "Quanto custa um agente de IA rodando todo mês?"
    a: "Em uma PME com 3.000 conversas por mês, o consumo de tokens costuma ficar entre R$ 15 e R$ 300. O que pesa mais é a infraestrutura de automação e a manutenção, não o modelo em si."
  - q: "Em quanto tempo um agente de IA entra em produção?"
    a: "De 2 a 4 semanas para um caso de uso único, como confirmação de agendamento ou triagem de e-mail. Casos com integração em ERP, aprovação humana e revisão de jurídico exigem de 2 a 3 meses."
---

Criar um agente de IA começa pela definição do problema, não pelo prompt: você escolhe uma tarefa repetitiva e mensurável, define o que o agente pode consultar e executar, conecta as ferramentas, escreve as instruções de sistema e só então coloca em produção. Este guia mostra o passo a passo em oito etapas, com custos em Real, prazos de implantação e os erros que mais travam projetos.

## O que é um agente de IA na prática

Um agente de IA é um programa que recebe uma tarefa, decide sozinho qual ferramenta usar, executa a ação nos sistemas da empresa e devolve o resultado. A diferença para um chatbot é o que acontece depois da pergunta: o chatbot devolve texto, o agente devolve o trabalho feito.

Na prática, o agente é a combinação de quatro coisas:

- Um modelo de linguagem, que entende o pedido e decide a próxima ação.
- Um conjunto de ferramentas, que são as ações que ele pode executar de verdade: consultar o ERP, enviar uma mensagem no WhatsApp, criar um registro no CRM.
- Um prompt de sistema, o conjunto de regras permanentes que define o comportamento.
- Um loop de execução, que repete o ciclo "pensar, agir, observar" até a tarefa terminar.

Se você ainda não tem clareza sobre a diferença entre chatbot, automação e agente, o guia [agente de IA: o que é](/guias/agente-de-ia-o-que-e/) resolve essa confusão antes de você escolher a ferramenta errada.

## As seis peças que todo agente precisa

Antes de escrever qualquer prompt, defina estas seis peças. É a diferença entre um projeto que entra em produção em três semanas e um que vira uma prova de conceito que nunca sai do departamento de TI.

| Peça | O que é | Quem decide na empresa |
|---|---|---|
| Escopo | A tarefa única que o agente executa | Dono do processo (gestor) |
| Prompt de sistema | Regras fixas de comportamento e limites | Dono do processo + TI |
| Ferramentas | Sistemas que o agente pode ler e alterar | TI |
| Memória | O que o agente guarda entre conversas | TI |
| Guardrails | Travas que impedem ações indevidas | Compliance e jurídico |
| Avaliação | Como se mede se o agente acertou | Dono do processo |

O erro mais comum é começar pela peça dois. Prompt de sistema sem escopo definido vira um texto de 40 linhas que ninguém consegue manter. O [guia de prompts para agentes](/guias/prompts-para-agentes-de-ia/) mostra como estruturar essa parte depois que o escopo está claro.

## Passo a passo: como criar um agente de IA do zero

1. **Escolha uma tarefa com critério de sucesso numérico.** Comece pelo que dá para medir: quantas horas por mês consome, quanto custa, com que taxa de erro. "Responder clientes no WhatsApp" é vago; "confirmar 80% dos agendamentos sem intervenção humana, com no máximo 2% de agendamento errado" é um projeto. Uma clínica com 900 consultas por mês sabe exatamente quantas chamadas a recepção faz hoje.

2. **Descreva o caminho feliz e os três erros mais comuns.** Escreva em linguagem comum os passos que o atendente humano dá e o que ele faria de errado sob pressão. Essa lista vira o prompt de sistema e, depois, os testes. É também aqui que entram as regras de [guardrails para agentes de IA](/guias/guardrails-agentes-de-ia/).

3. **Modele as ferramentas antes de integrar.** Para cada ação, anote o que entra e o que sai. Por exemplo: `consultar_agenda(clinica, data)` retorna a lista de horários vagos com o nome do médico. Escrever essa tabela antes evita que a integração vire um emaranhado de tentativas.

4. **Escolha a base de orquestração.** Se a sua empresa não tem time de desenvolvimento, comece por uma ferramenta visual como n8n ou Make. O guia [automação com n8n](/guias/automacao-com-n8n/) mostra como montar o fluxo sem escrever código, e o comparativo [n8n vs Make](/comparativos/n8n-vs-make/) ajuda a decidir. Se houver programador, frameworks como LangChain ou CrewAI dão mais controle, com mais complexidade — a comparação está em [LangChain vs CrewAI](/comparativos/langchain-vs-crewai/).

5. **Escreva o prompt de sistema em cinco blocos.** Papel, contexto da empresa, tarefa, formato de saída e limites do que não fazer. Prompts vagos produzem respostas longas e inúteis, que custam caro e não são lidas por ninguém.

6. **Conecte os dados que o agente precisa consultar.** Se as respostas dependem de tabela de preço, contrato ou manual interno, use [RAG](/guias/rag-explicado/) para recuperar os trechos certos em vez de inventar de memória. É a diferença entre um agente confiável e um que "sabe" o preço errado.

7. **Monte o painel de custo e o registro de execuções.** Antes de colocar no ar, defina um teto diário de tokens e salve cada execução num log. Sem isso, o primeiro erro de configuração vira uma fatura inesperada.

8. **Rode em modo assistido e depois libere.** Nas primeiras duas semanas, o agente sugere a ação e uma pessoa confirma. Depois, você libera as ações de baixo risco e mantém a aprovação humana nas de alto risco. Colocar em produção no primeiro dia, sem log e sem teto de custo, é o caminho mais curto para o projeto ser cancelado.

## Exemplo real: agente de orçamento para uma transportadora

Uma transportadora de cargas de Joinville, com 18 funcionários, recebia cerca de 40 pedidos de orçamento por dia pelo WhatsApp. A atendente copiava os dados para uma planilha e só depois passava para o responsável pelo logística, que levava de duas a quatro horas para responder.

O agente montado sobre o modelo de dados da empresa fez o seguinte:

1. Recebe a mensagem no WhatsApp com origem, destino, peso e volume.
2. Consulta a tabela de frete por faixa de peso e distância no ERP, via API.
3. Calcula o frete estimado e monta a proposta padrão.
4. Envia a proposta formatada em PDF e registra no CRM.
5. Encaminha para um humano apenas quando o cliente pede desconto acima de 8% ou quando o destino está fora da rota regular.

O resultado medido em 60 dias: tempo de resposta caiu de 3h12 para 4 minutos, e a atendente deixou de copiar dados. O agente consumiu cerca de 180 mil tokens por mês, o que custou menos de R$ 40 em consumo de modelo. O custo real do projeto foi a integração com o ERP e a reescrita da tabela de frete, não a IA.

## Como o agente conversa com os seus sistemas

Para quem não é de desenvolvimento, a ideia é simples: o agente não "acessa" o seu ERP como um humano faria. Ele pede que o ERP responda perguntas, por um caminho padronizado que se chama API.

Em analogia direta: a API é um garçom. O agente faz o pedido, o garçom leva até a cozinha e traz a resposta padronizada. O agente nunca entra na cozinha, não mexe no banco de dados e não altera uma planilha por conta própria. Cada ferramenta é um garçom com um cardápio fixo.

Quando o seu sistema não tem API, há três caminhos possíveis:

- Exportação periódica para uma planilha ou pasta que o agente lê. Simples, mas tem atraso.
- Webhook, que é o sistema avisando "aconteceu algo" para o agente reagir. Ideal para pedidos, notas fiscais e agendamentos.
- Camada intermediária, como n8n, traduzindo o sistema legado para o formato que o agente entende. É a solução mais comum em empresas que têm ERP dos anos 2000.

Para expor uma ferramenta nova de forma padronizada a qualquer agente, existe o protocolo MCP, que funciona como uma interface comum entre agentes e aplicativos. A documentação oficial está em <a href="https://modelcontextprotocol.io/" rel="nofollow noopener">modelcontextprotocol.io</a>.

## Escolhendo o modelo: onde o custo realmente aparece

O modelo é a peça mais barata do projeto. A tabela abaixo mostra o custo por milhão de tokens, convertido a R$ 5,40 por dólar, cotação usada como referência em outubro de 2026.

| Modelo | Entrada (R$/1M tokens) | Saída (R$/1M tokens) | Onde faz sentido |
|---|---|---|---|
| Claude Haiku 5.5 | R$ 0,54 | R$ 2,70 | Triagem, classificação, extração de campos |
| Claude Sonnet 5.5 | R$ 10,80 | R$ 54,00 | Padrão da maioria dos agentes de empresa |
| Claude Opus 5.5 | R$ 21,60 | R$ 108,00 | Análise complexa, planejamento, revisão crítica |
| Claude Fable 5.1 | R$ 54,00 | R$ 270,00 | Tarecas longas de complexidade rara |

Duas alavancas reduzem a conta sem trocar de modelo. A primeira é o cache de prompt: quando o agente usa as mesmas instruções e documentos em todas as requisições, o conteúdo é reaproveitado a um custo de cerca de R$ 1,08 por milhão de tokens lidos do cache, contra os R$ 10,80 do Sonnet 5.5. A segunda é o nível de raciocínio: tarefas simples rodando com esforço baixo consumem bem menos tokens do que a mesma tarefa com esforço alto.

Para um panorama de opções e o critério de decisão, veja [como escolher ferramenta de IA](/guias/como-escolher-ferramenta-de-ia/).

## Quanto custa manter um agente de IA rodando

Considere um agente de atendimento com 3.000 conversas por mês, média de 4.500 tokens de entrada e 800 de saída por conversa:

| Item | Custo mensal estimado | Observação |
|---|---|---|
| Tokens com Sonnet 5.5 | R$ 275 | 13,5M de entrada e 2,4M de saída |
| Tokens com Haiku 5.5 | R$ 14 | Mesmo volume, triagem simples |
| Tokens com Opus 5.5 | R$ 550 | Uso intenso de raciocínio |
| Infraestrutura de automação | R$ 90 a R$ 400 | n8n self-hosted em VPS ou plano pago |
| Message API do WhatsApp | Variável | Conversas iniciadas pela empresa são cobradas por conversa |
| Manutenção e melhoria | R$ 1.500 a R$ 5.000 | Mão de obra, é a maior fatia |

O detalhe que mais surpreende gestores: a mão de obra de manutenção costuma custar de cinco a dez vezes mais que o consumo de tokens. Um agente sem dono, sem log e sem revisão mensal envelhece em seis meses. O guia [custo de agente de IA](/guias/custo-de-agente-de-ia/) detalha como montar essa conta direito e quando o projeto se paga.

## Erros que travam a implantação em PMEs

- **Começar pelo atendimento genérico.** "Quero um assistente virtual que atenda tudo" não tem critério de sucesso e nunca termina. Comece por um processo com dono, volume e erro mensurável.
- **Conectar o agente direto no banco de dados.** Ele pode alterar o que não deveria. Conecte por uma camada com permissão restrita e registros de auditoria.
- **Não ter teto de custo.** Uma regra mal escrita que entra em loop pode gerar milhares de chamadas em uma noite. Configure limite diário e alerta.
- **Ignorar o caso raro.** O agente funciona em 95% dos casos e falha nos outros 5% — normalmente os de borda, como pedido fora do horário comercial ou cliente com nome muito incomum. Defina o que fazer nesses casos: escalar.
- **Implantar sem log.** Sem histórico de execuções você não descobre por que o agente errou, e a melhoria vira adivinhação.

## Como medir se o agente está funcionando

| Métrica | Como medir | Meta realista |
|---|---|---|
| Taxa de automação | Tarefas concluídas sem intervenção humana | 60% a 80% |
| Taxa de erro | Ações que precisaram ser desfeitas | Abaixo de 2% |
| Tempo de ciclo | Da entrada até a resposta | Menos de 5 minutos |
| Custo por tarefa | Gasto do mês dividido pelas tarefas | Abaixo de R$ 0,50 |
| Satisfação | Nota da pessoa que recebe o atendimento | Acima de 4 de 5 |

Revise esses números toda semana no primeiro mês. O ajuste fino vem do log de execuções: quando o agente erra, quase sempre há um caso de teste faltando no conjunto de avaliação.

## Perguntas frequentes

**Qual a diferença entre um agente de IA e um chatbot comum?** Um chatbot devolve texto. Um agente recebe uma tarefa, decide o que fazer, consulta as ferramentas que você conectou e executa a ação. Se a sua empresa já tem um bot de FAQ no WhatsApp e quer que ele agende consultas, você precisa de um agente — o passo a passo está em [chatbot para WhatsApp](/guias/chatbot-para-whatsapp/).

**Preciso saber programar para criar um agente de IA?** Não necessariamente. Ferramentas visuais como n8n e Make montam o fluxo por arrastar e soltar. Mas entender o básico de API e JSON evita que você fique preso na plataforma na hora de integrar o ERP.

**Em quanto tempo um agente de IA entra em produção?** De 2 a 4 semanas para um caso único, como confirmação de agendamento ou triagem de e-mail. Se o agente precisa ler documentos da empresa, tem aprovação humana e toca em sistema legado, o prazo vai a 2 ou 3 meses. O [guia de automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/) mostra como priorizar o que vale a pena automatizar primeiro.

**Quanto custa um agente de IA rodando todo mês?** Em uma PME com 3.000 conversas por mês, o consumo de tokens fica entre R$ 15 e R$ 300. A manutenção e a infraestrutura é que pesam mais. Monte a conta com pelo menos seis meses de histórico antes de aprovar o investimento.

**Por que meu agente inventa resposta que não está no material?** Isso acontece quando a informação não está no contexto da requisição. A solução é [RAG](/guias/rag-explicado/), que recupera os trechos relevantes dos documentos da empresa antes da resposta. E sempre deixe uma regra explícita de "não sei" no prompt de sistema.

## Próximos passos

Se você ainda está decidindo se a tarefa vale um agente, comece por [agente de IA: o que é](/guias/agente-de-ia-o-que-e/) e depois volte para o passo 1 deste guia. Para consultar a terminologia usada aqui, o [glossário](/glossario/) resolve dúvidas rápidas, e a [categoria agentes de IA](/categorias/automacao-e-ia/) reúne os guias relacionados.
