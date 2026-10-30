---
title: "RAG explicado: como a IA usa os documentos da sua empresa"
description: "Entenda o que é RAG, como os documentos da sua empresa viram respostas da IA, o que decide a qualidade do resultado e quanto custa manter isso rodando."
date: "2026-10-30"
updated: "2026-10-30"
category: "automacao-e-ia"
tags: ["rag", "base de conhecimento", "agente de ia", "dados"]
keywords: ["rag explicado", "como funciona rag", "rag para empresas", "base de conhecimento com ia", "retrieval augmented generation"]
featured: false
draft: false
faq:
  - q: "O que significa RAG?"
    a: "RAG é a técnica de recuperar documentos relevantes antes de responder. O modelo não decora o conhecimento da sua empresa: ele consulta a base, recebe os trechos certos e formula a resposta em cima deles."
  - q: "RAG é melhor do que treinar o modelo com os meus dados?"
    a: "Para a maioria das PMEs, sim. O RAG é mais barato, atualiza a base em minutos quando um documento muda e permite mostrar a fonte de cada resposta. O ajuste fino só se justifica em tarefas muito específicas."
  - q: "Qual a diferença entre RAG e cache de prompt?"
    a: "O cache de prompt evita reprocessar o mesmo texto fixo, economizando tokens. O RAG escolhe o que enviar ao modelo com base na pergunta. As duas coisas podem ser usadas juntas."
  - q: "Meus documentos contêm dados de clientes. Isso cria risco?"
    a: "Sim, exige cuidado com a LGPD. O RAG precisa respeitar a permissão de cada usuário: a resposta de um agente de vendas não pode incluir o histórico de outro cliente."
---

RAG é a técnica que permite a uma IA responder usando os documentos da sua empresa em vez do conhecimento genérico que ela aprendeu na internet. Antes de responder, o sistema busca os trechos relevantes da sua base documental e os entrega ao modelo como contexto. Este guia mostra como isso funciona por dentro, o que decide a qualidade do resultado e onde a abordagem falha.

## O que é RAG em uma frase

RAG significa Geração Aumentada por Recuperação, do inglês Retrieval-Augmented Generation. A ordem das palavras importa: primeiro o sistema recupera informação, depois o modelo gera a resposta.

Sem RAG, um modelo de linguagem responde a "qual o prazo de garantia do contrato de 2026?" usando o que generalizou durante o treinamento. Esse conhecimento tem duas limitações: ele não conhece os seus documentos, e ele não consegue dizer de onde tirou a resposta. A resposta sai fluida e plausível, o que é exatamente o pior cenário para quem vai usar o dado para decidir.

Com RAG, a pergunta dispara uma busca na base documental da empresa, os trechos mais relevantes são inseridos na requisição ao modelo, e a resposta é construída sobre eles. O resultado é auditável, atualiza-se quando o documento muda e cita a fonte.

## Por que o modelo não deveria "saber" o preço da sua tabela

Considere uma transportadora que cobra por faixa de peso e distância. Um modelo sem RAG, perguntado sobre o custo de 800 kg de Joinville para São Paulo, vai produzir um número plausível e errado. O problema não é imprecisão estatística: é que o modelo não tem como saber que existe uma tabela, e mesmo que tivesse, não saberia qual versão está vigente.

Isso vale para qualquer dado específico da empresa:

- Tabela de preço e tabela de frete, que mudam sem aviso.
- Contratos e cláusulas padrão de um escritório de advocacia.
- Protocolos clínicos e tabela de convênios de uma clínica.
- Manual de operações de uma indústria.
- Condições comerciais de um ecommerce, com 12.000 variações de produto.

Em todos esses casos, a alternativa ao RAG seria colocar o dado no prompt a cada requisição. Isso funciona, mas cobra o preço do token repetidamente e, no volume, fica caro. É aí que entra a combinação com o cache de prompt, detalhada mais adiante.

## Como o RAG funciona por dentro, em cinco etapas

A parte de indexação acontece uma vez, quando o documento entra na base. A parte de consulta acontece toda vez que alguém pergunta algo.

1. **Divisão em trechos.** O documento é quebrado em pedaços menores, chamados chunks. Uma tabela de frete vira uma linha por chunk; um contrato vira uma cláusula por chunk. O passo é feito respeitando a estrutura do documento, não cortando em pedaços de tamanho fixo.
2. **Transformação em vetor.** Cada trecho passa por um modelo de embedding, que converte o texto em uma lista de números que representa o significado. Dois trechos sobre "prazo de entrega" ficam próximos nessa lista, mesmo sem palavras em comum.
3. **Indexação.** O vetor e o trecho original vão para um banco vetorial, junto com metadados como data, cliente, tipo de documento e nível de permissão.
4. **Busca.** Na consulta, a pergunta também é transformada em vetor e comparada com todos os vetores da base. Os mais próximos são recuperados, e esse processo se repete em até três ou quatro rodadas, porque a boa resposta costuma estar no segundo ou terceiro documento.
5. **Geração com contexto.** Os trechos recuperados entram na requisição ao modelo, com instrução de responder apenas com base neles e citar a origem. O modelo gera a resposta ancorada no material recebido.

A analogia mais fiel para quem não é técnico: o RAG é uma biblioteca com índice que permite a um atendente buscar a norma antes de responder, em vez de responder de memória. A diferença entre o modelo sem RAG e o modelo com RAG é a mesma entre o atendente que responde de memória e o que consulta o manual.

## As quatro peças que você precisa montar

| Peça | O que é | Custo aproximado | Impacto na qualidade |
|---|---|---|---|
| Divisão em trechos (chunking) | Como o documento é quebrado | Nenhum | Alto |
| Embeddings | Conversão de texto em vetor | Centavos por mês | Médio |
| Banco vetorial | Onde os vetores ficam guardados | R$ 0 a R$ 300 por mês | Baixo |
| Modelo de geração | Quem escreve a resposta final | Maior parte do custo | Alto |

O custo de embeddings é praticamente irrelevante na conta: um modelo pequeno custa centavos por milhão de tokens. O custo está na geração e, principalmente, na manutenção da base. Por isso, o item que mais merece atenção do gestor é o chunking.

## Chunking: a decisão que mais impacta o resultado

Chunking é a arte de decidir onde cortar o documento. É o erro mais comum em implantações de RAG e a causa número um de resposta "o agente não achou".

O problema aparece em dois formatos:

- **Corte fixo por tamanho.** Um trecho de 500 caracteres corta uma cláusula no meio. O modelo recebe metade da regra de rescisão e conclui algo errado.
- **Corte por estrutura ignorando o contexto.** Uma tabela de frete vira linhas soltas, e o modelo não sabe mais qual linha é de qual destino.

A recomendação prática, na ordem:

1. **Corte por seção, tabela ou cláusula.** Uma linha de tabela de frete vira um chunk, com o cabeçalho repetido. Uma cláusula contratual vira um chunk, com o nome da cláusula anexado.
2. **Repita o cabeçalho em cada linha de tabela.** Sem isso, "R$ 480,00" não significa nada quando chega ao modelo.
3. **Use sobreposição de 10% a 15%** entre trechos consecutivos, para que uma frase cortada na fronteira apareça inteira em pelo menos um dos dois.
4. **Junte documento, seção e página nos metadados.** É o que permite citar a origem e filtrar a busca.

## Busca híbrida: por palavra e por sentido

Busca puramente vetorial, que compara sentido, falha quando o usuário digita o termo exato do documento: um código de produto, o número de um contrato, o CNPJ. A busca por palavra, que compara texto literal, é ótima nesses casos e péssima em perguntas formuladas de outro jeito.

A solução é a busca híbrida, que combina as duas e depois reordena os resultados por relevância real.

| Tipo de busca | Funciona bem com | Falha com |
|---|---|---|
| Vetorial (por sentido) | "quanto custa enviar 800 kg?" | "Tabela 4.2 do contrato 2026-114" |
| Por palavra (BM25) | Códigos, números, nomes próprios | Perguntas em linguagem natural |
| Híbrida | Os dois casos | Exige ajuste de peso entre os dois |

Para empresas brasileiras, o caso da busca por palavra não é raro: transportadora busca por "NFS-e", clínica busca por "CPT", indústria busca por "NCM" e "CFOP" nas notas fiscais. Se a base usa essas siglas e a busca é só vetorial, o agente simplesmente não encontra.

## Permissões e LGPD: o ponto que decide a implantação

Aqui está o erro mais caro em projeto de RAG, e ele não aparece em demonstração.

Um banco vetorial com um único conjunto de permissões serve a toda empresa. Mas a base de uma empresa costuma ter material com nível de acesso diferente: o catálogo de produtos é público, o contrato de um cliente não, o histórico médico de um paciente é restrito ao profissional que o acompanha.

Se o agente de vendas consulta a base sem filtro e encontra o contrato de outro cliente, a resposta sai com informação que não deveria circular. Isso não é só um problema técnico: é exposição de dado pessoal, com a LGPD em jogo.

A correção é técnica, mas precisa ser exigida no projeto:

1. Cada documento indexado carrega metadado de permissão e de titularidade: cliente, usuário ou papel autorizado.
2. A consulta sempre filtra por esses metadados **antes** da busca por similaridade, nunca depois.
3. O registro da consulta guarda quem perguntou e quais documentos foram recuperados.
4. Documentos com dado pessoal sensível têm prazo de descarte definido.

Em um sistema maduro, essa camada é chamada de segurança em nível de linha, e a resposta do agente só enxerga o que aquele usuário já podia ver.

## RAG ou ajuste fino do modelo

As duas técnicas resolvem problemas diferentes, e a confusão entre elas atrasa projetos.

O ajuste fino treina o modelo com seus próprios exemplos para que ele aprenda o formato e o estilo da resposta. Ele muda como o modelo responde, não o que ele sabe sobre os seus documentos. Treinar exige mais engenharia, mais dados e mais cuidado, e a atualização de um documento passa a exigir novo treinamento.

O RAG muda o que o modelo sabe, sem mudar o modelo. Documento novo entra na base hoje, sem novo treinamento.

Para a maioria das PMEs brasileiras, a ordem de decisão é esta:

- O dado muda com frequência e precisa de fonte citada: use RAG.
- A tarefa é de formatação repetitiva e o formato é estável: ajuste fino pode ajudar, mas geralmente uma saída estruturada resolve.
- Os dois são necessários: RAG para o conteúdo, saída estruturada para o formato.

O ajuste fino de um modelo de grande porte exige infraestrutura de treinamento na casa de dezenas de milhares de dólares e volume de exemplos que a maioria das PMEs não tem. O custo de RAG é o que está na tabela quatro, mais horas de engenharia inicial.

## Onde o RAG falha

- **Base desatualizada.** O agente responde com a versão antiga do documento. Sem um processo de reindexação da base quando um documento muda, o erro é silencioso.
- **Documento sem estrutura clara.** PDF digitalizado de tabela torta quebra a divisão em trechos e a busca não encontra nada.
- **Pergunta sem resposta na base.** Sem instrução explícita de declarar ausência, o modelo completa a lacuna. O agente precisa poder dizer que não encontrou.
- **Base muito grande e muito geral.** Se a empresa indexa 50.000 documentos de baixo valor, a relevância cai e o custo sobe. Base pequena e bem delimitada funciona melhor.
- **Pergunta que exige cálculo.** RAG recupera a tabela, mas quem faz a conta é o modelo. Se o cálculo precisa ser exato, a resposta deve vir de uma ferramenta determinística, não de texto recuperado.

## Como medir se o RAG está funcionando

| Métrica | O que mede | Meta |
|---|---|---|
| Recuperação acertada | O trecho certo está entre os recuperados | Acima de 90% |
| Resposta ancorada | A resposta usa o trecho recuperado | Acima de 95% |
| Taxa de citação | Respostas com fonte identificada | Acima de 80% |
| Abstenção correta | Diz "não encontrei" quando não há base | Acima de 95% |
| Custo por consulta | Gasto divided pelo volume | Abaixo de R$ 0,30 |

A métrica mais informativa é a de recuperação acertada, porque separa dois problemas que costumam ser confundidos: o sistema não achou o trecho, ou achou e o modelo ignorou. Sem essa separação, a equipe mexe no prompt quando o problema era o chunking.

## Perguntas frequentes

**O que significa RAG?** É a técnica de recuperar documentos relevantes antes de responder. O modelo não decora o conhecimento da sua empresa: ele consulta a base, recebe os trechos certos e formula a resposta em cima deles. O [guia de prompts para agentes de IA](/guias/prompts-para-agentes-de-ia/) mostra a parte do prompt que complementa esse mecanismo.

**RAG é melhor do que treinar o modelo com os meus dados?** Para a maioria das PMEs, sim. O RAG é mais barato, atualiza a base em minutos quando um documento muda e permite mostrar a fonte de cada resposta. O ajuste fino se justifica apenas em tarefas muito específicas.

**Qual a diferença entre RAG e cache de prompt?** O cache de prompt evita reprocessar o mesmo texto fixo, economizando tokens. O RAG escolhe o que enviar ao modelo com base na pergunta. As duas coisas funcionam bem juntas: o prompt de sistema e as regras fixas ficam em cache, e só os trechos recuperados mudam a cada consulta.

**Meus documentos contêm dados de clientes. Isso cria risco?** Sim, exige cuidado com a LGPD. O RAG precisa respeitar a permissão de cada usuário: a resposta de um agente de vendas não pode incluir o histórico de outro cliente. Filtros por metadado aplicados antes da busca são obrigatórios, não opcionais.

**Quanto custa manter um RAG rodando?** Em uma PME com base de 2.000 documentos e 3.000 consultas por mês, o custo fica entre R$ 80 e R$ 400 por mês, somando banco vetorial, geração e manutenção. O [guia de custo de agente de IA](/guias/custo-de-agente-de-ia/) detalha a conta completa.

**Por que meu agente não encontra o documento?** Em geral, é chunking: o trecho foi cortado em um ponto que perdeu o sentido, ou o cabeçalho da tabela não foi repetido. Antes de mexer no modelo, verifique como o documento foi dividido.

## Próximos passos

Se a base documental ainda não existe digitalizada, comece por [automação para pequenas empresas](/guias/automacao-para-pequenas-empresas/) e organize o que precisa entrar na base. Para ver o RAG aplicado a um caso concreto de departamento, veja [IA para financeiro](/guias/ia-para-financeiro/), [IA para jurídico](/guias/ia-para-juridico/) e [IA para vendas](/guias/ia-para-vendas/). E, para o passo anterior no fluxo, [como criar um agente de IA](/guias/como-criar-agente-de-ia/) mostra onde o RAG entra na arquitetura.
