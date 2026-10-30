---
title: "n8n x Make: qual automação é mais barata em 2026?"
description: "Compare n8n e Make em 2026: preço por execução, curva de aprendizado, integrações, suporte em português e limites. Qual é mais barato para a sua empresa."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao-e-ia"
slug: "n8n-vs-make"
winner: "n8n"
featured: true
tools:
  - name: "n8n"
    url: "https://n8n.io"
    affiliateUrl: "https://n8n.io/?via=yooka"
    price: "A partir de €20/mês"
    bestFor: "Automação com código, IA e controle de dados"
    rating: 4.6
    verdict: "O n8n é melhor quando a lógica do processo é complexa o suficiente para pedir código, quando o volume de execuções exige previsibilidade de custo e quando o dado precisa ficar sob controle da empresa. Ele cobra por execução de workflow, aceita JavaScript e Python dentro do fluxo e tem versão auto-hospedada sem custo de licença. Em troca, exige alguém que administre a plataforma e tem curva de aprendizado mais íngreme que a do Make."
    pros:
      - "Cobra por execução de workflow, não por operação de app: um fluxo de dez nós continua contando como uma execução"
      - "Nó de código com JavaScript e Python, expressões, sub-workflows e branching no mesmo editor"
      - "Community Edition auto-hospedada sem custo de licença, útil para dado sensível e volume alto"
      - "Nós de IA prontos: agente com LangChain por baixo, memória de chat, vector store e credenciais de OpenAI, Anthropic e Gemini"
    cons:
      - "Curva de aprendizado maior: expressões e editor de código exigem perfil técnico para manutenção"
      - "Auto-hospedagem cobra a infraestrutura e a manutenção (VPS, Docker, backup) de alguém da empresa"
      - "Planos pagos escalam em degraus: o intervalo entre o Pro e o Business é largo para empresas em crescimento"
  - name: "Make"
    url: "https://www.make.com"
    affiliateUrl: "https://www.make.com/?via=yooka"
    price: "A partir de US$9/mês"
    bestFor: "Automação visual, sem código, com muitas etapas"
    rating: 4.4
    verdict: "O Make é melhor quando o time que vai operar as automações não é técnico e o processo é linear: a interface de arrastar e soltar, os templates prontos e o plano de entrada mais barato entregam resultado rápido. A experiência de uso é mais simples e o erro de configuração é mais fácil de identificar visualmente. Em troca, a cobrança por créditos é confusa, cresce com polling e iteração, e não existe auto-hospedagem nem código dentro do fluxo."
    pros:
      - "Plano de entrada mais barato, com Core a partir de US$9 por mês, e plano Free com 1.000 créditos por mês para testar"
      - "Interface puramente visual, com templates e blueprints prontos que encurtam o tempo até o primeiro fluxo funcionando"
      - "Routers com branches e sub-cenários organizam processos longos com várias etapas sem exigir código nem expressão"
    cons:
      - "Cobrança por créditos é confusa e dispara quando o fluxo é longo, faz polling ou itera item a item"
      - "Não existe auto-hospedagem da plataforma: a execução fica na nuvem, o que tira a opção de manter o dado sob controle"
      - "Erro de configuração tem impacto alto: módulo errado ou mapping errado quebra o fluxo inteiro e a depuração é visual"
---

## Comece pelo fim — a resposta curta

Para PME brasileira com 5 a 20 automações ativas, o n8n costuma sair mais barato porque cobra por execução de fluxo, não por operação de app, e aceita código quando a lógica aperta. O Make vence quando o time é não técnico, o processo é linear e você quer começar por US$9 por mês. Se alguém na empresa sabe editar um JSON, a escolha cai para o n8n.

## Os dois candidatos

n8n e Make resolvem o mesmo problema: conectar aplicativos para que um processo rode sem gente no meio. Mas foram desenhados com filosofias opostas, e essa diferença explica quase todo o resto.

O n8n é uma plataforma de automação de código aberto com licença fair-code (Sustainable Use License), criada em 2019 por Mateusz Koscinski, com sede em Berlim, Alemanha. A interface é de nós conectados em fluxos. Funciona como SaaS (n8n Cloud) ou auto-hospedado (Community Edition, via Docker ou npm), sem licença.

O Make é uma plataforma de automação visual da Make s.r.o., empresa da República Tcheca. Nasceu como Integromat e foi renomeado para Make em 2022. A interface é de arrastar e soltar, com módulos de apps prontos, sub-cenários, iterators e roteadores.

Antes de escolher, vale entender o que automação resolve: o [guia de automação de processos](/guias/o-que-e-automacao-de-processos/) e o [guia de automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/).

## Comparação por critério

Comparamos as duas no cenário mais comum de empresa brasileira de pequeno e médio porte: 5 a 20 automações ativas, uma pessoa responsável por manter os fluxos, orçamento mensal abaixo de R$ 500 e volume que cabe em plano de entrada. Preço de referência: verificado em outubro de 2026; os planos mudam; confira no site oficial.

| Critério | n8n | Make |
|---|---|---|
| Preço de entrada | €20/mês | US$9/mês |
| Unidade de cobrança | Execução de workflow | Crédito por operação |
| Curva de aprendizado | Média | Baixa |
| Auto-hospedagem | Sim, Community Edition | Não |
| Melhor para | Lógica, IA, dado sob controle | Time não técnico |

## Preço total

Preço verificado em outubro de 2026; os planos mudam; confira no site oficial. No n8n Cloud, o Starter sai a partir de €20 por mês na cobrança anual (€24 no mensal) com 2.500 execuções, o Pro custa €50 no anual (€60 no mensal) com 10.000 execuções e o Business chega a cerca de €667 por mês com 40.000 execuções. O Business é o degrau caro: entrega SSO, ambientes e registro de auditoria, e o preço sobe muito mais rápido que o volume. A Community Edition auto-hospedada não cobra licença nem execução. No Make, o Free entrega 1.000 créditos por mês, o Core começa em US$9, o Pro custa US$16 e o Teams sai US$29 no anual.

| Critério | n8n | Make |
|---|---|---|
| Plano de entrada | €20/mês, 2.500 execuções | US$9/mês, 10.000 créditos |
| Plano intermediário | €50/mês, 10.000 execuções | US$16/mês, 10.000 créditos |
| Plano de time | €667/mês, 40.000 execuções | US$29/mês (anual) |
| Plano empresarial | Varia por plano | Sob consulta |
| Sem licença | Community Edition auto-hospedada | Não existe |

## Curva de aprendizado

No n8n, a parte visual é fácil: você arrasta um gatilho, conecta nós e mapeia campos. A curva sobe quando o fluxo exige uma condição que o IF não resolve ou uma chamada com cabeçalho específico. Aí entra o nó de código, em JavaScript ou Python. No Make, a curva é mais baixa: o mapeamento é clique em campo e templates prontos entregam metade do trabalho. Em compensação, a lógica complexa empurra o Make para routers e iterators, mais difíceis de depurar.

| Critério | n8n | Make |
|---|---|---|
| Interface | Nós em fluxo, com editor de código | Cenários drag-and-drop, sem código |
| Primeiro fluxo simples | Um fim de semana | Horas, com templates prontos |
| Lógica complexa | JavaScript ou Python no fluxo | Routers e iterators, com teto baixo |
| Perfil de quem mantém | Dev, analista ou operações | Time operacional |

Para montar o conjunto certo de ferramentas, veja o [guia de como escolher ferramenta de IA](/guias/como-escolher-ferramenta-de-ia/).

## Integrações

As duas cobrem os aplicativos que uma PME usa no dia a dia: CRM, planilha, e-mail, WhatsApp, ERP e loja. A diferença aparece quando um app não tem conector pronto. No n8n, o nó de requisição HTTP resolve quase tudo e o nó de código manipula o payload como quiser. Em IA, o n8n traz o nó de agente com LangChain por baixo, memória de chat, vector store (pgvector, Supabase), credenciais de OpenAI, Anthropic e Gemini e suporte a servidor MCP. O Make tem templates, blueprints e construtor de apps via API, mas o catálogo é fechado.

| Critério | n8n | Make |
|---|---|---|
| App sem conector | Nó HTTP e nó de código | Somente o módulo HTTP |
| Camada de IA | Agente, memória, vector store, MCP | Módulos de IA e templates |
| Reuso de lógica | Sub-workflows | Sub-cenários e blueprints |
| Versionamento | Integração com Git nos planos pagos | Varia por versão |

O passo a passo está em [automação com n8n](/guias/automacao-com-n8n/).

## Suporte em português

As duas interfaces têm tradução para português, o que resolve a barreira de leitura no dia a dia. A documentação oficial das duas é em inglês, e nenhuma oferece suporte nativo por telefone ou chat em português. Na prática, o que sustenta o usuário brasileiro é a comunidade: o fórum do n8n, os grupos de usuários de Make com participantes brasileiros e o conteúdo em português. Para uma empresa que vai depender da ferramenta em produção, a resposta vem de fórum, não de SLA.

| Critério | n8n | Make |
|---|---|---|
| Interface em português | Sim | Sim |
| Documentação oficial | Em inglês | Em inglês |
| Suporte por telefone ou chat em português | Não | Não |
| Canal que funciona no Brasil | Fórum do n8n e grupos de usuários | Grupos de usuários de Make |
| SLA em português | Varia por plano | Varia por plano |

## Limites de execução

Este é o critério que mais derruba a conta final e o mais ignorado na comparação. O n8n cobra por execução de workflow: uma execução que encadeia dez nós conta como uma. O Make cobra créditos, e cada operação de app consome créditos; webhooks e iterações consomem mais. Na prática, um fluxo do Make que faz polling a cada cinco minutos consome muito mais do que a tela sugere. Um fluxo de n8n que processa lote em um único nó costuma sair mais barato.

| Critério | n8n | Make |
|---|---|---|
| Unidade de cobrança | Execução de workflow | Crédito por operação de app |
| Fluxo com dez nós | Conta como uma execução | Consome créditos de cada módulo |
| Polling frequente | Impacto previsível | Consumo sobe a cada rodada |
| Iteração item a item | Processamento em lote | Cada iteração consome créditos |

Com IA no fluxo, a diferença se multiplica pelo custo de token, como mostra o [guia de custo de agente de IA](/guias/custo-de-agente-de-ia/).

## Flexibilidade

O n8n é mais maleável em três frentes: código embutido em qualquer nó, expressões para manipular dados entre etapas, sub-workflows, branching com IF e Switch, fila de execução para processar em paralelo e integração com Git nos planos pagos para versionar os fluxos. O bring your own model também conta: você escolhe credenciais de OpenAI, Anthropic ou Gemini. O Make é mais rígido: sub-cenários, iterators e routers cobrem a maioria dos casos, mas lógica com código customizado fica fora do alcance.

| Critério | n8n | Make |
|---|---|---|
| Código dentro do fluxo | JavaScript e Python | Não disponível |
| Decisões | Branching com IF e Switch | Routers com branches |
| Processamento paralelo | Fila de execução | Varia por versão |
| Versionamento | Git nos planos pagos | Varia por versão |
| Modelo de IA | OpenAI, Anthropic ou Gemini | Módulos da plataforma |

## Quando escolher o n8n

O n8n é a escolha certa quando existe alguém na empresa capaz de manter automação e o processo tem lógica que a visual não resolve com elegância.

- **Tamanho da empresa.** De 10 a 200 funcionários, ou qualquer porte com alguém capaz de assumir a manutenção dos fluxos. Sem responsável técnico, a plataforma vira passivo.
- **Time.** Um dev, analista de dados ou pessoa de operações que já consome API e sabe ler JSON.
- **Orçamento.** O Starter, a partir de €20 por mês (verificado em outubro de 2026; os planos mudam; confira no site oficial), cabe em qualquer orçamento de PME, e a Community Edition zera a licença.
- **Stack.** CRM, ERP, planilha, banco próprio e APIs internas. Quando a fonte dos dados tem API mas não tem conector pronto, o nó HTTP e o nó de código resolvem.
- **LGPD.** Dado sensível que precisa ficar em infraestrutura sob controle da empresa, com backup e registro de acesso sob responsabilidade do time.

## Quando escolher o Make

O Make é a escolha certa quando o processo é linear e quem vai operar as automações não é técnico.

- **Tamanho da empresa.** Qualquer porte, de 2 a 50 funcionários, em que ninguém foi designado como dono técnico da automação.
- **Time.** Comercial, administrativo, financeiro ou atendimento, que monta e ajusta os próprios fluxos no dia a dia.
- **Orçamento.** Entrada mais barata (Core a partir de US$9 por mês, verificado em outubro de 2026; os planos mudam; confira no site oficial) e um plano Free com 1.000 créditos por mês para testar.
- **Stack.** Dez a trinta aplicativos de uso corrente, ligados em sequência, sem processar item a item.
- **LGPD.** Fluxo que trate apenas dado comercial não sensível e em que o processo de aprovação da empresa não exija infraestrutura própria.

## Veredito

O n8n vence porque o custo real de uma automação mal desenhada não é a assinatura: é o retrabalho quando a lógica é complexa. Como o n8n cobra por execução de workflow e aceita código no meio do fluxo, a rotina que consome dez créditos no Make e exige um contorno de router costuma sair em uma execução só, com código legível e versionável. Em troca, você paga com curva de aprendizado e com alguém que administre a plataforma.

- **Escolha n8n se** a empresa tem alguém responsável por manter automação e os fluxos pedem lógica, código, IA ou volume alto de execuções.
- **Escolha Make se** o time é não técnico, os processos são lineares e o objetivo é entrar rápido, com custo baixo e templates prontos.
- **Escolha os dois se** o Make cuida dos fluxos comerciais simples e o n8n hospeda os fluxos com IA e dado sensível, cada uma no que faz melhor.

## Perguntas frequentes

**Qual das duas é mais barata para uma pequena empresa?** Para PME com 5 a 20 automações, o n8n costuma sair mais barato: cobra por execução de workflow, e um fluxo de dez nós conta como uma. O Make é mais barato na entrada (Core a partir de US$9/mês). Preço verificado em outubro de 2026; os planos mudam; confira no site oficial.

**O n8n tem versão gratuita?** Sim. A Community Edition auto-hospedada não cobra licença nem execução; o custo é a infraestrutura, um VPS e a manutenção com Docker e backup. A alternativa paga é o n8n Cloud, a partir de €20 por mês. O Make tem um plano Free com 1.000 créditos por mês. Preço verificado em outubro de 2026; os planos mudam; confira no site oficial.

**Preciso saber programar para usar o n8n?** Não para começar: a interface visual resolve fluxos simples. Precisa para manter: quando o fluxo exige uma condição que o IF não resolve, o nó de código assume o controle. Sem alguém no time que leia JavaScript, o Make dá o mesmo resultado com menos atrito.

**Dá para usar n8n e Make juntos?** Dá, e é a arquitetura mais comum em empresas que já têm as duas. As duas expõem webhook e módulo HTTP, então um fluxo dispara o outro: o Make cuida da parte comercial e o n8n assume IA e dado sensível.

Para continuar: [catálogo de ferramentas](/ferramentas/), [comparativo detalhado n8n x Make](/comparativos/n8n-vs-make/) e [lista completa de comparativos](/comparativos/).
