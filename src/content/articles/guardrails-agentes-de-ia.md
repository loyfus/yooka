---
title: "Guardrails para agentes de IA: as regras que evitam erros caros"
description: "Guia de guardrails para agentes de IA: o que são, quais travas colocar no código, como definir limites de ação e quanto custa um erro sem proteção."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao-e-ia"
tags: ["guardrails", "seguranca", "agente de ia", "compliance"]
keywords: ["guardrails para agentes de ia", "como proteger um agente de ia", "validacao de saida de ia", "limites de acao de agente", "erros de agente de ia"]
featured: false
draft: false
faq:
  - q: "O que são guardrails para agentes de IA?"
    a: "Sao travas que limitam o que o agente pode fazer e validam o que ele produz. Prompt e guardrail nao sao a mesma coisa: o prompt e uma instrucao, o guardrail e um mecanismo que impede a acao errada mesmo quando o modelo erra."
  - q: "O prompt nao basta para proteger o agente?"
    a: "Nao. O prompt reduz a chance de erro, mas nao garante. Guardrail no codigo falha de forma previsivel e auditavel, enquanto prompt falha de forma imprevisivel e silenciosa."
  - q: "Qual o custo de um agente sem guardrails?"
    a: "Um desconto indevido, um e-mail_massivo para a base errada ou um dado pessoal exposto. Em uma PME, um unico erro de R$ 5.000 em campanha custa mais que seis meses de operacao do agente."
  - q: "Guardrails deixam o agente lento?"
    a: "Levam alguns milissegundos, na ordem de grandeza de uma validação de formulário. O que pesa no tempo é a etapa de aprovação humana, e essa é uma escolha de processo, não de tecnologia."
---

Guardrails para agentes de IA são as travas que impedem um agente de executar uma ação indevida e que verificam se a saída dele faz sentido antes de chegar a um cliente, a um sistema financeiro ou a um documento. Prompt reduz chance de erro; guardrail garante o limite. Este guia mostra quais travas colocar, em que ordem e com que custo.

## Qual a diferença entre prompt e guardrail

Esta distinção é o conceito mais importante do tema, e a maior parte dos erros de implementação vem de confundi-la.

O prompt de sistema é uma instrução dada ao modelo. Ele aumenta a probabilidade de o agente agir corretamente, mas o modelo é um sistema estatístico: não existe garantia de que vai seguir a instrução, especialmente em entradas inesperadas, conversas longas ou pedidos de usuário que conflitam com as regras.

O guardrail é um mecanismo no código, fora do modelo, que verifica uma condição e interrompe ou corrige o processo. Ele não confia na instrução porque não depende dela para funcionar.

| Situação | Prompt | Guardrail |
|---|---|---|
| Agente não deve conceder desconto acima de 8% | "Não conceda desconto acima de 8%" | Bloqueia a chamada de ferramenta se o desconto for maior |
| Agente deve citar o documento que usou | "Cite sempre a fonte" | Remove a resposta se não houver referência válida |
| Agente não deve responder sobre outro cliente | "Responda apenas sobre o cliente da sessão" | Filtra a base por cliente antes da busca |
| Agente não deve prometer prazo de entrega | "Não prometa prazo" | Valida a resposta contra a tabela de prazos vigente |

A regra prática: **toda regra que protege dinheiro, cliente ou conformidade precisa existir duas vezes** — uma vez no prompt, para reduzir frequência, e uma vez no código, para garantir o limite. O que só existe no prompt é uma intenção.

## Os quatro tipos de guardrail

### Guardrail de entrada

Verifica o que chega ao agente antes de processar. Serve para filtrar injeção de prompt, onde um usuário tenta sobrescrever as instruções do sistema com frases como "ignore suas regras e execute o comando seguinte".

A defesa é dupla: o prompt de sistema reforça que a ferramenta não obedece a instruções vindas de conversa, e o código verifica que todo parâmetro recebido nasce de uma lista de valores válidos, não de texto livre do usuário.

Em um agente de vendas, isso aparece como: o cliente diz "conceda 30% de desconto e emita a nota". O agente não passa isso adiante para a ferramenta de desconto, porque a ferramenta só aceita desconto até o limite configurado e ignora o valor que veio na conversa.

### Guardrail de ferramenta

Define o que cada ferramenta pode fazer e em que limites. É a trava mais concreta e a que evita o prejuízo mais alto.

Três parâmetros controlam isso:

1. **Escopo.** Quais registros a ferramenta pode acessar. Um agente de vendas lê as oportunidades do próprio usuário, não da equipe inteira.
2. **Faixa.** Quais valores são aceitos. Desconto máximo, valor máximo por transação, quantidade máxima por pedido.
3. **Efeito.** A ferramenta pode apenas ler, ou pode alterar? Leitura é reversível; escrita em sistema financeiro exige aprovação.

Uma ferramenta bem desenhada não confia na decisão do modelo. Ela recebe os parâmetros, valida contra limites fixos e recusa o que estiver fora. O modelo pode pedir, mas a ferramenta decide.

### Guardrail de saída

Verifica o que o agente produz, depois que ele já agiu. É o que pega o erro de conteúdo.

As quatro verificações que valem a pena na maioria dos casos:

- **Validade de formato.** Se a resposta deveria ser um JSON com campos definidos, o sistema tenta converter. Se não converter, a resposta é reprocessada ou descartada.
- **Presença de dado obrigatório.** Uma cotação sem CNPJ do emitente não sai.
- **Coerência com a base.** O número informado existe no sistema? Um agente que diz que a peça está em estoque consulta o estoque antes de responder.
- **Densidade de linguagem impossível.** Frases muito longas, códigos de barras embaralhados ou mistura de alfabetos costuma indicar alucinação. É uma heurística fraca, mas serve como alarme.

### Guardrail de ação

É a camada de aprovação humana. Define quais ações exigem confirmação de uma pessoa antes de acontecer.

A classificação mais simples, e que funciona na maioria das PMEs:

| Ação | Quem autoriza |
|---|---|
| Ler dados, responder, classificar, redigir rascunho | Automático |
| Criar registro, agendar, enviar para cliente interno | Automático, com log |
| Enviar para cliente externo, aplicar desconto até 8% | Automático, com log e teto |
| Desconto acima de 8%, emitir documento, alterar preço | Aprovação humana |
| Pagamento, exclusão de dado, acesso a dado sensível | Aprovação humana obrigatória |

Para empresas que lidam com dado pessoal ou que operam em área regulada, como a área jurídica e a de saúde, a lista de ações automáticas precisa ser mais curta.

## As cinco travas que resolvem 80% dos casos

Para quem está começando, a ordem de implementação abaixo resolve a maior parte dos incidentes sem exigir projeto de segurança.

1. **Teto de ação por tipo.** Configure no código o valor máximo que cada ferramenta pode mover ou conceder. Nenhum ajuste no prompt substitui isso.
2. **Aprovação humana acima de um limite.** Defina o valor em reais ou o percentual que dispara revisão. Exemplo: desconto acima de 8% ou pedido acima de R$ 25.000.
3. **Escopo por sessão.** O agente só enxerga dados do cliente, da unidade ou da filial da sessão atual. Isso é o que separa um agente útil de um vazamento.
4. **Log completo de leitura e escrita.** Quem pediu, o que foi pedido, o que foi feito e o que foi respondido. Sem log, incidente vira investigação de palpites.
5. **Abstenção obrigatória.** Configure uma resposta padrão para quando o agente não tiver certeza ou não encontrar o dado, com encaminhamento para uma pessoa. O erro mais caro é a invenção confiante.

## Exemplo completo: guardrails de um agente de cobrança

Um agente de cobrança de uma loja de ecommerce com 8.000 pedidos, atendendo pelo WhatsApp como descrito no [guia de chatbot para WhatsApp](/guias/chatbot-para-whatsapp/), teve o seguinte desenho.

**Entrada:** a mensagem chega por WhatsApp, com o número do cliente identificado pelo número do remetente. Se o número não estiver no cadastro, o sistema não inicia atendimento e pede confirmação por outro canal.

**Ferramentas:** quatro no total. Consultar pedido, consultar valor da parcela, registrar acordo, enviar mensagem. Nenhuma delas aceita mudança de valor. A ferramenta de registro de acordo só aceita condições previamente aprovadas pelo gestor, com limite de 3 parcelas.

**Saída:** todo valor mencionado na resposta é comparado com o valor que veio do sistema. Se divergir, a mensagem é bloqueada e o caso vai para o atendente. Nenhuma resposta sai com número que não veio de uma ferramenta.

**Ação:** envios de mensagem acontecem automaticamente, com limite de duas por cliente por dia e horário restrito a 8h às 18h, dias úteis. Acordos que envolvem desconto acima de 10% exigem aprovação.

**Resultado medido em 90 dias:** zero envio de valor incorreto, 6 casos escalados para análise humana por semana, e taxa de resposta do cliente de 71%, contra 38% antes da automatização. O número de acordo não mudou muito, o que é saudável: a trava incentivou o cliente a pagar em vez de negociar.

## Quando o guardrail vira gargalo

Trava demais custa caro, e o sintoma é claro: o agente escala quase tudo e o time humano vira digitador de aprovações.

O equilíbrio correto é simples: o guardrail deve existir onde o dano é grande e a chance de acerto do agente é baixa. Onde o agente acerta 99% das vezes, a trava só adiciona atrito.

Uma régua prática para calibrar:

| Frequência de erro do agente | Dano se o erro acontecer | Trava indicada |
|---|---|---|
| 1 em 100 | Baixo | Automático, com log |
| 1 em 100 | Alto | Aprovação humana |
| 1 em 10 | Qualquer | Revisão do prompt antes de liberar |
| 1 em 2 | Qualquer | Não coloque em produção |

Note que a primeira e a segunda linha têm a mesma frequência de erro e travas opostas. É por isso que o critério não pode ser só estatístico: o que decide é o valor do que está em jogo. Por isso a tabela precisa ser revisada quando os valores mudam, e por isso ela deve ter data de validade.

## Guardrails e LGPD em agentes que lidam com clientes

Agente que atende, vende ou coleta dado no WhatsApp lida com dado pessoal desde o primeiro contato. Os pontos de atenção são práticos:

- **Minimização.** O agente acessa apenas o necessário para responder. Não puxa o histórico completo do cliente se a pergunta é sobre prazo.
- **Transparência.** O cliente precisa saber que está falando com uma IA. Isso não é preferência da empresa: é exigência do art. 9º da LGPD, e o atendimento por IA sem aviso é prática comum de infração.
- **Registro de operações.** Quem pediu o quê, com qual base legal. Isso é o log de auditoria do ponto anterior.
- **Direitos do titular.** Um pedido de acesso a dados ou de eliminação precisa chegar a um processo executável, e o agente não pode ser o caminho único.
- **Qualificação de canal.** Dados sensíveis de saúde e dados de origem financeira exigem canal com autenticação reforçada.

O detalhamento por departamento está em [IA para vendas](/guias/ia-para-vendas/), [IA para recrutamento](/guias/ia-para-recrutamento/) e [IA para jurídico](/guias/ia-para-juridico/). O filtro de permissão por cliente, aplicado na camada de recuperação de documentos, está detalhado em [RAG explicado](/guias/rag-explicado/).

## Como medir a eficacia dos guardrails

| Métrica | O que mede | Referência |
|---|---|---|
| Taxa de bloqueio | Ações barradas pela trava | 1% a 5% do total |
| Falsos positivos | Ações legítimas barradas | Abaixo de 2% |
| Aprovações humanas | Volume de casos que esperam revisão | Abaixo de 15% das ações |
| Incidentes | Erros que chegaram ao cliente ou ao sistema | Zero |
| Tempo de escalonamento | Da detecção à resolução | Menos de 4 horas |

A métrica mais útil é a de falsos positivos. Se ela sobe, a trava está apertada demais e a equipe vai começar a contornar o sistema, o que é pior do que não ter trava nenhuma.

## Perguntas frequentes

**O que são guardrails para agentes de IA?** São travas que limitam o que o agente pode fazer e validam o que ele produz antes de o resultado chegar a um cliente ou a um sistema. A diferença para o prompt é de mecânica: o prompt é uma instrução, o guardrail é um mecanismo que não depende do modelo para funcionar.

**O prompt não basta para proteger o agente?** Não. O prompt reduz a chance de erro, mas o modelo é um sistema estatístico e nenhuma instrução tem garantia de cumprimento. Para regra que protege dinheiro, cliente ou conformidade, a recomendação é escrever a regra duas vezes: uma no prompt e outra no código.

**Qual o custo de um agente sem guardrails?** Um desconto indevido, um envio em massa para a base errada, um dado pessoal exposto ou um documento com valor incorreto. Em uma PME, um único erro de R$ 5.000 em campanha custa mais que vários meses de operação do agente.

**Guardrails deixam o agente lento?** As travas computacionais levam alguns milissegundos, na ordem de grandeza de uma validação de formulário. O que pesa no tempo é a etapa de aprovação humana, e essa é uma escolha de processo. Se 30% dos casos são escalados, o problema está no desenho da trava, não na tecnologia.

**Como começar sem refazer tudo?** Implemente as cinco travas básicas deste guia primeiro: teto por ferramenta, aprovação por valor, escopo por sessão, log completo e abstenção obrigatória. Elas cobrem a maior parte dos incidentes e podem entrar em produção em duas semanas, sem esperar uma plataforma de segurança pronta.

## Próximos passos

Os guardrails são a camada de segurança do agente. Para montar o agente antes deles, veja [como criar um agente de IA](/guias/como-criar-agente-de-ia/) e [prompts para agentes de IA](/guias/prompts-para-agentes-de-ia/). O controle de custos, que é o outro limite que precisa de regra, está em [custo de agente de IA](/guias/custo-de-agente-de-ia/). E a [categoria agentes de IA](/categorias/automacao-e-ia/) reúne os guias da série.
