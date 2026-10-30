---
title: "Automação com n8n: custo real, quando usar e o que dá errado"
description: "Automação com n8n em 2026: preço dos planos em reais, custo por execução, self-hosted ou nuvem, primeira automação passo a passo e erros comuns."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao"
tags: ["automacao", "n8n", "ferramentas", "self-hosted", "precos"]
keywords: ["automação com n8n", "n8n preço", "n8n self-hosted", "n8n vs make", "custo n8n"]
featured: false
draft: false
faq:
  - q: "Quanto custa usar o n8n no Brasil?"
    a: "O plano Starter sai € 20 por mês (cerca de R$ 132), o Pro custa € 50 por mês (cerca de R$ 330) e a versão self-hosted não cobra licença, apenas a infraestrutura, a partir de R$ 70 por mês em um VPS."
  - q: "n8n ou Make é mais barato?"
    a: "Para automações com muita lógica ou código, o n8n costuma sair mais barato porque cobra por execução de fluxo e não por operação. Para integrações simples com dezenas de apps prontos, a Make é mais barata no começo. O [comparativo n8n x Make](/guias/n8n-vs-make/) detalha os dois modelos."
  - q: "Vale a pena rodar o n8n self-hosted?"
    a: "Vale quando o volume passa de 10.000 execuções por mês, quando há dado sensível que não pode sair da sua infraestrutura, ou quando o time tem capacidade de manter servidor. Abaixo disso, a nuvem quase sempre sai mais barato."
  - q: "É difícil aprender n8n sem saber programar?"
    a: "A interface é visual e por arrastar e soltar, com mais de 400 integra prontas. A curva de aprendizado é de um fim de semana para fluxos simples. Código aparece quando você precisa de transformação complexa ou integração sem conector pronto."
---

Automação com n8n é construir fluxos que conectam WhatsApp, ERP, e-mail e IA em um processo executado automaticamente. A ferramenta é open source, tem versão self-hosted e aceita JavaScript dentro do fluxo quando o visual não basta. O plano pago sai de € 20 por mês (cerca de R$ 132) e a licença self-hosted é gratuita.

## O que é o n8n e por que virou a escolha padrão de PME brasileira

O n8n é um orquestrador de automações. Você desenha o fluxo como uma sequência de blocos — gatilho, condição, transformação, ação — e ele executa sozinho, com histórico, retentativa e agendamento. A grande vantagem para quem não é programador é que dá para usar a interface visual e, ao mesmo tempo, abrir o editor de código (JavaScript ou Python) em qualquer nó. Isso resolve o problema clássico das ferramentas visuais: quando a tarefa é 80% padrão, o visual resolve; quando os 20% finais são específicos, o código entra sem trocar de ferramenta.

Diferenças em relação às alternativas:

- **Código embutido.** Qualquer nó aceita JavaScript, o que evita a gambiarra de encadear dez webhooks para fazer uma transformação.
- **Open source com versão self-hosted.** A licença Community é gratuita e o código é auditable, o que agrada quem tem trava em dado ficar em nuvem americana.
- **Nós de IA.** Tem nós nativos para os principais provedores, com saída estruturada e integração direta com PostgreSQL e outras bases para [RAG](/guias/rag-explicado/).
- **Auto-hospedagem barata.** Um VPS de R$ 70 a R$ 120 por mês roda com folga o volume de uma pequena empresa.

Se você ainda não tem clareza sobre o que automação resolve, o [guia de automação de processos](/guias/o-que-e-automacao-de-processos/) é a leitura prévia. Se a dúvida for mais ampla — se vale a pena automatizar com IA em vez de regra fixa — veja [automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/).

## Quanto custa o n8n em 2026

Valores verificados em outubro de 2026, convertidos com taxa de referência de US$ 1 = R$ 5,80 e € 1 = R$ 6,60. Preços mudam com frequência: confirme na página oficial antes de contratar e consulte a nossa [página de preços](/precos/).

| Plano | Preço original | Em reais (aprox.) | Execuções/mês | Recursos que importam |
|---|---|---|---|---|
| Community (self-hosted) | US$ 0 de licença | R$ 0 + infraestrutura | Ilimitadas | Código-fonte aberto, sem cobrança de execução |
| Starter | € 20/mês | R$ 132 | 2.500 | Editor visual, 400+ integrações, webhooks |
| Pro | € 50/mês | R$ 330 | 10.000 | Filas, execuções em grupo, ambientes separados |
| Business | € 667/mês (faturado anual) | R$ 4.402 | 100.000+ | SSO, log de auditoria, SLA, suporte dedicado |
| Starter anual | € 16/mês | R$ 106 | 2.500 | Mesmo do mensal, cobrado no ano |

O plano Starter anual é o ponto ideal para a maioria das pequenas empresas: R$ 106 por mês no cartão de crédito anual, com desconto de cerca de 20%. Para quem está começando e ainda não sabe quantas execuções vai gastar, o self-hosted evita qualquer susto no fim do mês.

## Custo por execução: o número que decide o projeto

Toda cobrança do n8n acontece por execução de fluxo. Isso significa que uma execução com 12 nós conta como uma, desde que rode inteira em uma transação. É a característica que faz o n8n ganhar de plataformas que cobram por ação individual.

| Plano | Custo mensal | Execuções incluídas | Custo por execução |
|---|---|---|---|
| Starter | R$ 132 | 2.500 | R$ 0,053 |
| Pro | R$ 330 | 10.000 | R$ 0,033 |
| Business | R$ 4.402 | 100.000 | R$ 0,044 |
| Self-hosted (VPS R$ 90/mês) | R$ 90 | Ilimitadas | R$ 0,000 marginal |

Some-se a isso o custo de IA por execução, quando houver nó de modelo de linguagem. Um resumo de atendimento com 1.800 tokens de entrada e 250 de saída custa cerca de R$ 0,007 no Gemini Flash e R$ 0,035 no Claude Sonnet 5.5. Em um fluxo de 10.000 execuções mensais, a diferença entre usar um modelo barato e um caro na camada de IA é de R$ 286 por mês — mais que a própria assinatura do Pro. O [guia de custo de agente de IA](/guias/custo-de-agente-de-ia/) detalha essa conta.

Comparação direta de custo por volume mensal, considerando apenas a orquestração:

| Volume mensal | n8n | Make | Zapier |
|---|---|---|---|
| 500 execuções | R$ 132 (Starter) | R$ 52 (Core) | R$ 116 (Professional) |
| 5.000 execuções | R$ 330 (Pro) | R$ 52 (Core) | R$ 116 (Professional) |
| 20.000 execuções | R$ 330 (Pro) | Sob consulta (Enterprise) | R$ 116 (Professional) |
| 50.000 execuções | R$ 4.402 (Business) | Sob consulta (Enterprise) | R$ 400 (Team) |

A leitura honesta dessa tabela: o Zapier ganha em volume alto de tarefas simples porque o task é mais barato que a execução; o n8n ganha quando o fluxo é complexo, porque uma execução faz o trabalho de dez tasks. Compare a fundo no [comparativo n8n x Make](/guias/n8n-vs-make/) e no [catálogo de ferramentas](/ferramentas/).

## Self-hosted: quando compensa e quanto custa a infraestrutura

Rodar o n8n no seu próprio servidor elimina a mensalidade de licença e a cobrança por execução, mas não elimina custo: você paga o servidor, o tempo de manutenção e o risco de ficar sem backup.

| Opção de infraestrutura | Custo mensal | Capacidade | Serve para |
|---|---|---|---|
| Oracle Cloud Free Tier | R$ 0 | 1 VM ARM, 4 GB RAM | Volume baixo, projetos teste, uso pessoal |
| VPS 2 vCPU / 4 GB (Hetzner, Contabo, Lightsail) | R$ 70 a R$ 120 | 2 a 5 mil execuções/mês | Pequena empresa, 1 a 3 automações |
| VPS 4 vCPU / 8 GB | R$ 180 a R$ 280 | 10 a 30 mil execuções/mês | Empresa média, produção crítica |
| Servidor dedicado | R$ 500+ | Alto volume, alta disponibilidade | Operação com SLA e auditoria |

O roteiro de implantação self-hosted leva cerca de 2 horas se você já tem familiaridade com Linux e Docker, e um fim de semana se não tem. O que mais gera dor de cabeça: backup automático do banco do n8n, atualização de versão do container e gestão de certificado HTTPS. Reserve uma hora por mês para manutenção, ou este custo aparece na fatura mais tarde.

## Passo a passo: primeira automação no n8n em uma tarde

1. **Instale ou crie a conta.** Em nuvem, basta criar a conta no n8n.io. Self-hosted, rode o contêiner Docker com Postgres, que é o modo suportado para produção.
2. **Defina o gatilho.** Pode ser webhook, e-mail recebido, cron, evento do ERP ou mensagem recebida no WhatsApp via provedor. Comece por webhook: é o mais fácil de testar.
3. **Monte a lógica de decisão.** Use um nó IF para separar os casos. Deixe explícito o caminho de exceção — é onde a automação costuma quebrar.
4. **Conecte as ações.** Grave no banco, envie mensagem, crie linha no CRM, chame a API do ERP. Cada nó de integração já vem com autenticação pronta.
5. **Insira a camada de IA onde houver texto.** Só use IA no ponto em que é preciso interpretar, classificar ou redigir. Regras fixas são mais baratas e mais confiáveis — veja [prompts para agentes de IA](/guias/prompts-para-agentes-de-ia/) para escrever a instrução.
6. **Teste com dados reais, não de exemplo.** Rode 20 vezes com casos reais, incluindo os que você acha que não vão acontecer. Monitore em "Executions".
7. **Ative alerta e retentativa.** Configure retry em nós externos, alerta para o responsável e uma fila para o caso de a API do WhatsApp cair.
8. **Documente e versione.** Exporte o fluxo em JSON para o repositório. Um fluxo sem versionamento é um fluxo que ninguém sabe alterar com segurança.

## Quando o n8n não é a melhor escolha

O n8n é a melhor ferramenta para fluxo com lógica. Não é a melhor para todo caso:

- **Volume enorme de integrações simples sem nenhum passo de decisão.** A Zapier entrega em minutos o que levaria dias no n8n, e a task é mais barata.
- **Time sem ninguém para manter.** Self-hosted sem responsável técnico vira falha silenciosa em duas semanas. Na nuvem, o problema é menor.
- **Execuções com mais de 100 mil por mês e lógica trivial.** O plano Business custa R$ 4.402; nesse volume, Make ou Zapier Team saem mais barato.
- **Precisa de governança corporativa avançada.** SSO, auditoria e SLA existem, mas custam. Uma empresa pequena não deveria pagar Business antes de resolver o processo.

A escolha entre as plataformas está detalhada em [n8n vs Make](/guias/n8n-vs-make/). E, se a dúvida for entre modelos de IA dentro do fluxo, o [comparativo ChatGPT x Claude x Gemini](/guias/chatgpt-vs-claude-vs-gemini/) mostra a diferença de custo e de qualidade por tarefa.

## Onde o orçamento estoura: custos ocultos do n8n

- **Execuções em loop.** Um fluxo que reprocessa item por item em vez de processar em lote multiplica a cobrança. Prefira um nó de batch.
- **Retry sem limite.** Chamada externa instável com retry infinito gera centenas de execuções na mesma hora. Limite o retry e use backoff.
- **LLM no loop interno.** Um agente que chama o modelo 12 vezes por execução multiplica o custo de token por 12. Use [guardrails](/guias/guardrails-agentes-de-ia/) para limitar o número de turnos.
- **Execuções manuais de teste.** Cliques em "Execute workflow" contam. Teste com webhook em ambiente separado.
- **Log e histórico crescendo.** A tabela de execuções cresce sem limite em self-hosted. Faça limpeza periódica.

## Casos reais com números em reais

**Distribuidora de autopeças, 25 funcionários.** O comercial recebia pedido por WhatsApp, digitava no ERP e montava romaneio à mão. Com n8n self-hosted (VPS de R$ 90), o pedido entra por webhook, o modelo extrai item, quantidade e prazo, o ERP grava e o romaneio é gerado em PDF. 38 horas por mês devolvidas ao time comercial, com custo de R$ 90 em infraestrutura e R$ 4 por mês em tokens de IA.

**Transportadora, 40 funcionários.** Rastreio de carga por planilha e aviso manual ao cliente. Fluxo no n8n Starter: evento do TMS dispara mensagem de status, e o cliente recebe o código de rastreio. 26 horas por mês economizadas, R$ 132 de mensalidade. Se o volume passar de 2.500 execuções, migra-se para o Pro em R$ 330 sem mudar o fluxo.

**E-commerce de running, 12 funcionários.** Confirmação de pedido, aviso de envio e pesquisa de NPS. Tudo no n8n Pro com Postgres para histórico de pedidos. 42 horas por mês, R$ 330 de ferramenta e R$ 1,30 por mês de tokens.

**Escritório de advocacia, 8 pessoas.** Triagem de e-mails por assunto, classificação de processos por área e prazo, e alerta no Google Calendar para prazos que se aproximam. O fluxo roda em self-hosted por R$ 90 com revisão humana obrigatória antes de qualquer movimentação — o mesmo cuidado descrito em [IA para jurídico](/guias/ia-para-juridico/).

**Clínica odontológica, 18 funcionários.** Confirmação de consulta e régua de cobrança de parcelas. n8n Starter com integração de SMS, R$ 132 por mês (sem a API do WhatsApp), 30 horas por mês devolvidas.

## Perguntas frequentes sobre automação com n8n

**Quanto custa usar o n8n no Brasil?** De R$ 132 por mês no Starter (€ 20) a R$ 330 no Pro (€ 50), com a opção self-hosted sem licença, apenas infra a partir de R$ 70.

**n8n ou Make é mais barato?** Para fluxo com muita lógica e código, o n8n costuma ganhar porque cobra por execução de fluxo, não por ação. Para integração simples com muitos apps prontos, a Make ganha no começo.

**Vale a pena rodar self-hosted?** Vale acima de 10.000 execuções por mês, com dado sensível, ou se o time tem quem cuide do servidor. Abaixo disso, a nuvem quase sempre sai mais barato.

**É difícil aprender sem saber programar?** A interface visual resolve a maioria dos casos e a curva é de um fim de semana. Código entra só no pedaço específico que o visual não cobre.

Para continuar, veja a [categoria de automação](/categorias/automacao/), o [comparativo entre plataformas](/comparativos/) e o [guia de automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/), que traz o cálculo de ROI aplicado aos fluxos.
