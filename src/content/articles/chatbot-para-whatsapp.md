---
title: "Chatbot para WhatsApp: como montar um que resolve a maior parte do atendimento"
description: "Guia de chatbot para WhatsApp com a API oficial da Meta: janela de 24 horas, templates, opt-in, custo por atendimento e métricas de contenção."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao-e-ia"
tags: ["chatbot", "whatsapp", "atendimento", "meta", "automacao"]
keywords: ["chatbot para whatsapp", "chatbot whatsapp business", "automacao de atendimento whatsapp", "api whatsapp business"]
featured: true
draft: false
faq:
  - q: "Qual a diferença entre um chatbot e um agente de IA no WhatsApp?"
    a: "O chatbot percorre um fluxo fixo, com menus e palavras-chave. O agente de IA interpreta a mensagem em linguagem natural, consulta sistemas internos por ferramentas e responde com texto próprio. Para atendimento brasileiro, a combinação costuma funcionar melhor: fluxo para o que é regulado e agente para o que é variável."
  - q: "Preciso da API oficial da Meta para ter um chatbot no WhatsApp?"
    a: "Sim, para uso comercial e automação em escala. Usar WhatsApp por aplicativo comum ou automação de navegador viola os termos da Meta e pode banir o número. A via suportada é a WhatsApp Business API, acessada por um provedor oficial (BSP) ou por integração direta."
  - q: "Quanto custa um chatbot para WhatsApp por mês?"
    a: "Em uma operação pequena, de 2 a 5 mil conversas por mês, a estimativa de campo fica entre R$ 900 e R$ 3.500 somando as mensagens cobradas pela Meta, provedor, modelo de linguagem, banco e hospedagem. O item mais variável é a cobrança da Meta, que muda por categoria de template e por país."
  - q: "O bot precisa pedir consentimento para falar com o cliente?"
    a: "Sim, e o consentimento precisa ser registrado. A prática recomendada no mercado brasileiro é guardar data, hora, origem e texto do consentimento, além do opt-out, para demonstrar conformidade em caso de fiscalização ou reclamação."
---

Um chatbot para WhatsApp é um agente automatizado que conversa com o cliente pelo WhatsApp Business API, sem um atendente em cada mensagem. Na prática, ele consulta pedidos, confirma agendamentos, responde dúvidas e coleta dados antes de transferir o caso para uma pessoa. O ganho está no volume: um atendente humano responde cerca de 60 a 120 mensagens curtas por hora, e o bot mantém o ritmo sem cansar.

## O que um chatbot para WhatsApp realmente faz

Chatbot de WhatsApp não é "robô que conversa". A diferença entre uma automação de menu e um agente de IA está no que acontece entre a mensagem e a resposta: o agente classifica a intenção, consulta sistemas internos por meio de ferramentas, decide se tem dados suficientes para responder e, quando não tem, escala para um humano.

Na prática, o fluxo tem quatro etapas: entender a mensagem, buscar o contexto (pedido, cadastro, contrato, agenda), responder com base nos dados retornados e registrar tudo em log. Cada etapa pode falhar de um jeito diferente, e é aí que mora o trabalho de implantação. Quem ainda não estruturou o que é um agente e como limitar essa decisão deve começar por [o que é um agente de IA](/guias/agente-de-ia-o-que-e/).

Um erro comum de projeto é tratar o atendimento como um único fluxo gigante. Separar em intenções funciona muito melhor. Um catálogo típico de empresa brasileira de serviços ou varejo costuma ter entre 8 e 25 intenções reais: status de pedido, retorno e troca, boleto e segunda via, agendamento, cancelamento, endereço, prazo de entrega, garantia, segunda via de nota, dados cadastrais, reclamação, reclamação sobre reclamação e assim por diante.

Cada intenção tem um nível diferente de automação. Consultar status de pedido é leitura de API: 100% automatizável. Reclamação é transferência com contexto. Venda complexa é conversa humana com apoio. Definir essa fronteira antes de escrever qualquer prompt é o que separa um projeto que roda em três semanas de um que vira um eterno beta.

## WhatsApp Business API: janela de 24 horas, templates e opt-in

A Meta mudou a forma de cobrança e, com ela, a forma de pensar a operação. O ponto central continua sendo a janela de 24 horas: quando o usuário envia uma mensagem para a empresa, abre-se uma janela durante a qual a empresa pode responder livremente. Encerrada a janela, a empresa só consegue iniciar uma nova conversa por meio de um template previamente aprovado.

Desde a virada de precificação da Meta para cobrança por mensagem, templates de utilidade e autenticação passaram a ser cobrados individualmente, e templates de marketing são cobrados por mensagem, sem depender de janela. Conversas iniciadas pelo usuário dentro da janela de 24 horas continuam sem cobrança de template. Os valores mudam com frequência e por país, então a única fonte confiável é a tabela oficial da Meta, consultada no painel do provedor que você usa.

| Tipo de mensagem | Precisa template aprovado | Dentro da janela de 24h | Custo (estimativa de campo, BR) |
|---|---|---|---|
| Resposta do usuário (pergunta de um cliente) | Não | Sim, é a mensagem que abre a janela | Sem custo de template |
| Confirmação de pedido, boleto, agendamento | Sim, categoria utilidade | Pode ser enviada a qualquer momento | R$ 0,03 a R$ 0,15 por mensagem |
| Aviso de envio, rastreio | Sim, categoria utilidade | Pode ser enviada a qualquer momento | R$ 0,03 a R$ 0,15 por mensagem |
| Código de acesso, senha temporária | Sim, categoria autenticação | Pode ser enviado a qualquer momento | R$ 0,04 a R$ 0,18 por mensagem |
| Promoção, lançamento, campanha | Sim, categoria marketing | Não abre janela | R$ 0,25 a R$ 0,90 por mensagem |
| Mídia (imagem, áudio, documento) | Sim, só via template | Restrito dentro da janela | Tarifa da mídia somada ao template |

Os números da tabela são estimativas de campo observadas em operações brasileiras entre 2025 e 2026, com provedor nacional e mix de mensagens de utilidade e marketing. Não é tabela oficial de preço e muda por conta, país e volume contratado.

O segundo ponto crítico é o opt-in. A Meta exige permissão do usuário para iniciar conversas. No Brasil, a base legal do contato comercial também importa: sem consentimento registrado, a empresa acumula risco regulatório e de bloqueio de número. Uma prática que funciona bem é gravar, para cada contato, o texto do consentimento, a origem (loja, formulário, atendimento presencial), a data e o canal, mantendo o mesmo registro para o opt-out. Isso responde a duas auditorias: a da Meta e a da ANPD.

O terceiro ponto é a integração. Três caminhos, por nível de controle:

- WhatsApp Web automatizado por navegador: barato e frágil, viola os termos da Meta, risco alto de bloqueio. Não use.
- Provedor oficial (BSP) no Brasil: resolve homologação, cobrança, painel e suporte, com taxa adicional sobre a mensagem da Meta. É o caminho padrão para PME.
- Integração direta com a Cloud API: mais controle de templates, métricas e custos, mas exige aprovado de empresa, servidor, webhooks e manutenção de números.

## Quanto custa um chatbot para WhatsApp na prática

O erro de orçamento mais comum é olhar apenas o preço da mensagem. O custo real tem cinco camadas, e as três últimas costumam ser as que estouram a conta.

| Camada | O que entra | Estimativa de campo (PME, 3 a 10 mil conversas/mês) |
|---|---|---|
| Meta | Templates de utilidade, marketing e autenticação | R$ 180 a R$ 1.600 por mês, conforme o mix |
| Provedor (BSP) | Taxa de mensagens, painel, suporte, roteamento | R$ 200 a R$ 900 por mês ou R$ 0,02 a R$ 0,10 por mensagem |
| Modelo de linguagem | Tokens de classificação e de resposta | R$ 120 a R$ 700 por mês |
| Infraestrutura | Hospedagem, banco, filas, observabilidade | R$ 150 a R$ 800 por mês |
| Manutenção | Ajustes de prompt, novos templates, monitoramento | R$ 800 a R$ 3.000 por mês (equipe interna ou consultoria) |

Somado, o intervalo típico fica entre R$ 1.450 e R$ 7.000 por mês. Em uma operação acima de 30 mil conversas por mês, a infraestrutura se paga e o item dominante vira a mão de obra humana evitada.

Custo por atendimento é a métrica que o gestor realmente usa. Em campo, um atendimento automatizado de qualidade media entre R$ 0,35 e R$ 2,20, contando infra, provedor e modelo de linguagem, mais a parcela de conversas transferidas para humano. Um atendimento humano, com salário carregado, supervisão e ocupação de 70% a 85%, custa entre R$ 18 e R$ 48. Essa diferença é o argumento que sustenta o projeto internamente.

## Quantas mensagens um atendente humano responde por hora

Esse número permite dimensionar a equipe, e quase toda estimativa de projeto errada nasce de aqui. A resposta depende do tipo de mensagem e do número de sistemas abertos ao mesmo tempo.

| Tipo de demanda | Mensagens por atendente/hora | Tempo médio por mensagem |
|---|---|---|
| Confirmação de dados, consulta de status | 90 a 140 | 25 a 40 segundos |
| Dúvida de catálogo, política de troca e devolução | 45 a 80 | 45 a 80 segundos |
| Agendamento com verificação de agenda | 30 a 60 | 60 a 120 segundos |
| Suporte técnico com diagnóstico | 15 a 35 | 2 a 4 minutos |
| Negociação e reclamação aberta | 8 a 20 | 5 a 10 minutos |

Esses valores são estimativas de campo para atendimento por WhatsApp em empresas brasileiras, considerando apenas o tempo de digitação e troca de contexto entre sistemas. Não contam espera por aprovação nem interrupções.

Multiplicando: uma operação com 4.000 mensagens por dia e mistura de dúvidas e suporte fica entre 4 e 6 atendentes apenas para o volume bruto. Com o bot resolvendo de 40% a 65% do que chega, o mesmo volume passa a exigir 2 ou 3 pessoas, e a equipe humana fica só com o que exige raciocínio. A equipe não some: ela sai da fila repetitiva e passa a tratar exceção, que é o trabalho que costuma gerar reclamação e perda de cliente.

## Quais casos o bot resolve sozinho e quais precisam de humano

Taxa de contenção é a proporção de conversas que o bot fecha sem intervenção humana. Ela varia muito conforme o mix de produto e o nível de maturação da operação. As faixas abaixo são estimativas de campo para operações com base de conhecimento em dia e consulta real a sistemas.

| Caso de uso | Taxa de contenção típica | Observação |
|---|---|---|
| Status de pedido e rastreio | 65% a 85% | Consulta direta a API ou ERP |
| Confirmação de agendamento | 55% a 75% | Exige agenda integrada |
| Dúvidas repetitivas (horário, endereço, política) | 40% a 65% | Depende de base de conhecimento |
| Boleto, segunda via, cobrança | 35% a 60% | Cuidado com dados de pagamento |
| Suporte técnico com diagnóstico | 10% a 25% | Escala rápido para humano |
| Negociação comercial | 5% a 15% | Use o bot para triagem, não para fechar |
| Reclamação formal e NPS | 5% a 10% | Transfira com histórico completo |

Reclamação é o caso que mais destrói automação mal feita. O erro clássico é o bot tentar argumentar. O certo é reconhecer o problema, coletar o identificador do pedido e transferir com o histórico anexado, para a pessoa não pedir tudo de novo.

## Como montar um chatbot para WhatsApp em seis passos

1. **Mapeie as intenções com dados reais.** Exporte três a quatro semanas do histórico de atendimento e agrupe as mensagens de entrada por assunto. Você vai descobrir que a lista que você imaginava e a lista que o cliente manda são diferentes. Trabalhe com a segunda.
2. **Defina a fronteira de automatização.** Para cada intenção, marque "total", "parcial" ou "humano". Esse documento vira o escopo do projeto e o critério de aceite.
3. **Regularize a base legal e o opt-in.** Escolha a base legal por tipo de mensagem, revise o texto de consentimento, defina a forma de coleta do opt-out e registre tudo em um banco com trilha de auditoria. Se a empresa usa IA para tratar dados de saúde, biometria ou outros dados sensíveis, o cranial de análise de risco muda de figura.
4. **Conecte a API da Meta.** Crie o aplicativo, configure o número, registre o webhook e mantenha o fluxo de templates em homologação até a aprovação. Delegue a homologação a um provedor oficial se a equipe não tiver experiência com webhooks.
5. **Implemente o agente com ferramentas.** Base de conhecimento para o que é estático, API interna para o que é dinâmico, e prompts versionados para as respostas. O [RAG explicado](/guias/rag-explicado/) mostra como organizar a base para o bot não inventar resposta.
6. **Meça em sombra por duas semanas.** Rode o bot em paralelo com o atendimento humano, sem escalar para o cliente. Compare a resposta do bot com a do atendente e ajuste o que divergir. Só depois ative o escalonamento automático e acompanhe as métricas do [guardrails para agentes de IA](/guias/guardrails-agentes-de-ia/).

## LGPD em chatbot de WhatsApp: controlador, operador e base legal

A LGPD (Lei 13.709/2018) se aplica integralmente ao chatbot, porque ele trata dados pessoais de forma automatizada e massiva. O ponto que gera mais confusão é quem é controlador e quem é operador.

| Papel | Quem costuma ser | O que a lei exige |
|---|---|---|
| Controlador | A sua empresa, porque define finalidade e meios do atendimento | Base legal válida, transparência, direitos do titular, registro das operações |
| Operador | O provedor de WhatsApp, a ferramenta de IA e a consultoria que operam o bot | Contrato de operadores, seguindo o art. 39, com instruções documentadas |
| Encarregado (DPO) | Um responsável interno ou um advisor | Canal de contato publicado para o titular exercer direitos |

Bases legais usuais: execução de contrato para mensagens ligadas a pedido ou serviço já contratado; consentimento para comunicações promocionais; legítimo interesse, com teste de balanceamento documentado, para mensagens de serviço. Consentimento genérico, sem indicar a finalidade, é frágil e foi o que motivou as sanções da ANPD contra grandes empresas de varejo nos últimos anos.

Dados sensíveis exigem cuidado redobrado. Um chatbot que coleta dados de saúde, dados biométricos, religião, orientação sexual ou origem racial entra no art. 11 da LGPD, que tem bases legais próprias e exige consentimento destacado. O caminho mais seguro é não coletar: pedir ao cliente que informe os dados por um canal controlado e usá-los apenas para o necessário.

Registre as operações de tratamento (art. 37), publique o aviso de privacidade com as finalidades reais, implemente o atendimento ao titular em prazo razoável e documente a transferência internacional de dados caso o fornecedor processe dados fora do Brasil.

Este texto não é parecer jurídico. Para fechar o DPO, definir bases legais, avaliar transferência internacional e revisar o contrato com fornecedor de IA, consulte um advogado especializado em proteção de dados. Nenhuma configuração de bot substitui essa revisão.

## Quais métricas acompanhar depois da implantação

- **Taxa de contenção:** percentual de conversas fechadas sem humano. É a métrica de valor, mas precisa andar junto com qualidade.
- **Tempo de primeira resposta:** em atendimento por WhatsApp, cada minuto de espera aumenta o abandono. Meta operacional de 15 a 30 segundos no horário comercial.
- **Tempo médio de resolução:** do início do contato até a resolução, com a espera pelo atendimento humano.
- **Custo por atendimento:** (Meta + provedor + modelo + infraestrutura) dividido pelo total de conversas. Compare com o custo humano, não com o orçamento total.
- **Taxa de transferência indevida:** conversas que o bot resolveria e foram repassadas. Mede a qualidade do escopo e das guardrails.
- **Taxa de erro de extração:** o número de dados lidos errado em pedidos e agendamentos. O custo é operacional e reputacional, porque erro de CPF ou valor divergente aparece depois.
- **Reclamação sobre o bot:** a métrica mais esquecida. Monitore menções a "falar com atendente".

O modelo híbrido, com a pessoa apoiada por IA em vez de substituída, está em [IA para atendimento humano](/guias/ia-para-atendimento-humano/).

## Erros que quebram projetos de chatbot no WhatsApp

- Automatizar antes de mapear as intenções e o custo real de cada atendimento humano.
- Usar WhatsApp Web ou automação de navegador e expor o número a bloqueio.
- Mandar mensagem fora da janela de 24 horas sem template aprovado.
- Não registrar opt-in nem opt-out, e descobrir o problema no meio de uma fiscalização.
- Deixar o bot inventar resposta de política comercial, frete ou prazo de entrega sem base de dados estruturada.
- Não ter caminho de saída: o cliente precisa conseguir chegar a um humano digitando uma palavra.
- Tratar a implantação como projeto de TI sem dono de negócio, e o bot morre sem ninguém responsável por o conteúdo.

## Perguntas frequentes

### Qual a diferença entre um chatbot e um agente de IA no WhatsApp?

O chatbot percorre um fluxo fixo, com menus e palavras-chave. O agente de IA interpreta a mensagem em linguagem natural, consulta sistemas internos por ferramentas e responde com texto próprio. O modelo híbrido é o mais usado: fluxo para o que é regulado, agente para o que é variável.

### Preciso da API oficial da Meta para ter um chatbot no WhatsApp?

Sim, para uso comercial e automação em escala. Aplicativo comum ou automação de navegador viola os termos da Meta e pode banir o número. O caminho suportado é a WhatsApp Business API, por provedor oficial ou integração direta.

### Quanto custa um chatbot para WhatsApp por mês?

Em uma operação pequena, de 2 a 5 mil conversas por mês, a estimativa de campo fica entre R$ 900 e R$ 3.500 somando as mensagens cobradas pela Meta, provedor, modelo de linguagem, banco e hospedagem. O item mais variável é a cobrança da Meta, que muda por categoria de template e por país.

### O bot precisa pedir consentimento para falar com o cliente?

Sim, e o consentimento precisa ser registrado. Guarde data, hora, origem e texto do consentimento, além do opt-out, para demonstrar conformidade em caso de fiscalização ou reclamação.

## Próximos passos

Para dimensionar o projeto antes de falar com fornecedor, compare os modelos e o custo por token em [como escolher ferramenta de IA](/guias/como-escolher-ferramenta-de-ia/) e em [custo de agente de IA](/guias/custo-de-agente-de-ia/). Se a operação ainda tem processos manuais ao redor do atendimento, o [guia de automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/) mostra por onde começar, e a referência completa de categorias está em [atendimento](/categorias/automacao-e-ia/).
