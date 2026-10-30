/**
 * Segunda leva de calculadoras —work, MEI, renda e custos.
 * Mesmo modelo de dados de `calculators.js`.
 */

export const calculatorsExtra = [
  {
    slug: 'salario-liquido',
    title: 'Calculadora de salário líquido: quanto sobra depois do INSS e do IRRF',
    description:
      'Calcule quanto do seu salário bruto vira salário líquido, com INSS progressivo e IRRF pela dedução simplificada. Resultado na hora, sem cadastro.',
    category: 'trabalho-e-carreira',
    badge: 'INSS + IRRF',
    intro:
      'O salário líquido é o bruto menos o INSS (tabela progressiva) e o IRRF (tabela progressiva com dedução simplificada). A ordem importa: primeiro se aplica o INSS sobre o bruto, depois o IRRF sobre o que sobrou.',
    fields: [
      { id: 'bruto', label: 'Salário bruto mensal', type: 'money', default: 3000 },
      { id: 'deducaoIrpf', label: 'Dedução simplificada do IRRF (R$)', type: 'money', default: 528, hint: 'Referência de outubro de 2026. A tabela muda todo ano.' },
      { id: 'outros', label: 'Outros descontos (vale, plano de saúde, pensão)', type: 'money', default: 0 },
    ],
    outputs: [
      { id: 'inss', label: 'INSS', kind: 'inss', base: 'bruto', money: true },
      { id: 'baseIrpf', label: 'Base de cálculo do IRRF', expr: 'bruto - (bruto * 0 + 0)', money: true, hidden: true },
      { id: 'irrf', label: 'IRRF estimado', kind: 'irrf', base: 'bruto', money: true },
      { id: 'liquido', label: 'Salário líquido', kind: 'final', base: 'bruto', inss: true, outros: true, money: true, highlight: true },
      { id: 'aliquotaEfetiva', label: 'Percentual total de desconto (INSS + IRRF)', expr: '(bruto - (bruto - (bruto * 0 + 0)) + (bruto - (bruto * 0 + 0))) * 0', money: false, hidden: true },
      { id: 'percDesconto', label: 'Percentual descontado do bruto', expr: '0', money: false, hidden: true },
    ],
    notes: [
      'A tabela do INSS muda quando o salário mínimo é reajustado (em janeiro, normalmente). Os valores aqui são de referência de outubro de 2026.',
      'O IRRF real depende também de outros rendimentos, deduções (dependentes, pensão alimentícia, etc.) e da faixa que você caiu no ano. Este cálculo é a aproximação do recibo mensal.',
      'Se a sua empresa tem mais de um vínculo, o IRRF é recalculado no fechamento do mês — o valor da segunda via pode ser maior que a da primeira.',
    ],
    relatedGuides: ['clt-ou-pj', '13-salario-como-calcular', 'como-calcular-ferias'],
  },

  {
    slug: 'hora-extra',
    title: 'Calculadora de hora extra: quanto vale a sua hora extra',
    description:
      'Calcule quanto uma hora extra vale no seu salário, com o adicional de 60%, o INSS sobre o extra e o que ela custa para a empresa.',
    category: 'trabalho-e-carreira',
    badge: 'Adicional de 60%',
    intro:
      'A hora extra vale o valor da sua hora normal mais 60% de adicional (no mínimo). Sobre esse valor incide INSS, então o ganho real é menor do que o multiplicador sugere — e para a empresa, o custo é quase o dobro do valor da hora.',
    fields: [
      { id: 'salario', label: 'Salário mensal bruto', type: 'money', default: 3000 },
      { id: 'jornada', label: 'Horas mensais trabalhadas', type: 'number', default: 220 },
      { id: 'horas', label: 'Horas extras no mês', type: 'number', default: 20 },
      { id: 'adicional', label: 'Adicional da hora extra (%)', type: 'percent', default: 60, hint: 'Mínimo legal: 50%. Acima de 2 horas/dia, o mínimo sobe para 100%.' },
    ],
    outputs: [
      { id: 'horaNormal', label: 'Valor da hora normal', expr: 'salario / jornada', money: true },
      { id: 'horaExtraBruta', label: 'Hora extra bruta (com adicional)', expr: 'salario / jornada * (1 + adicional / 100)', money: true },
      { id: 'totalExtra', label: 'Total bruto das horas extras no mês', expr: 'horas * salario / jornada * (1 + adicional / 100)', money: true },
      { id: 'inssExtra', label: 'INSS sobre as horas extras', kind: 'inss', base: 'horas * salario / jornada * (1 + adicional / 100)', money: true },
      { id: 'liquidoExtra', label: 'Quanto entra no seu bolso', expr: 'horas * salario / jornada * (1 + adicional / 100) - (horas * salario / jornada * (1 + adicional / 100)) * 0 + 0', money: true, hidden: true },
      { id: 'ganhoReal', label: 'Ganho real das horas extras no mês', kind: 'final', base: 'horas * salario / jornada * (1 + adicional / 100)', inss: true, money: true, highlight: true },
      { id: 'custoEmpresa', label: 'Custo para a empresa (com FGTS)', expr: 'horas * salario / jornada * (1 + adicional / 100) * 1.08', money: true },
    ],
    notes: [
      'O adicional mínimo é de 50% e sobe para 100% na segunda hora extra diária e na work de sábado.',
      'As horas extras não entram na base do 13º e das férias, mas o valor do salário base é que conta para o cálculo do adicional (hora normal x 1,6).',
      'Horas extras acima do limite legal podem gerar ação trabalhista. A empresa que faz isso costuma pagar mais, com juros e correção monetária.',
    ],
    relatedGuides: ['hora-extra-e-jornada', 'clt-ou-pj', 'verbas-rescisorias'],
  },

  {
    slug: 'fgts-multa',
    title: 'Calculadora de FGTS: quanto sai da multa de 40%',
    description:
      'Calcule quanto você recebe de FGTS com a multa de 40% na rescisão, ou quanto dá para sacar em cada caso com 8 anos de carteira.',
    category: 'trabalho-e-carreira',
    badge: '8% + multa de 40%',
    intro:
      'Na rescisão sem justa causa, o FGTS fica disponível com a multa de 40%. Depois de 8 anos de carteira (contando o tempo anterior), o saque integral é liberado a qualquer momento. A conta é simples: 8% do salário depositados mês a mês, mais 40% na rescisão.',
    fields: [
      { id: 'salario', label: 'Salário mensal bruto', type: 'money', default: 3000 },
      { id: 'meses', label: 'Meses de carteira (no total)', type: 'number', default: 60, min: 0, max: 1200 },
      { id: 'depositos', label: 'Meses com depósito neste emprego', type: 'number', default: 60, min: 0, max: 1200 },
      { id: 'saldo', label: 'Saldo já existente na conta (R$)', type: 'money', default: 0 },
      { id: 'comMulta', label: 'É rescisão sem justa causa?', type: 'select', options: [{ value: 1, label: 'Sim, tem multa de 40%' }, { value: 0, label: 'Não' }], default: 1 },
    ],
    outputs: [
      { id: 'depositado', label: 'FGTS depositado neste emprego (8%)', expr: 'salario * 0.08 * depositos', money: true },
      { id: 'multa', label: 'Multa rescisória (40% sobre o depositado)', expr: 'salario * 0.08 * depositos * 0.4 * comMulta', money: true },
      { id: 'total', label: 'Total disponível (com multa, se houver)', kind: 'final', base: 'saldo + salario * 0.08 * depositos * (1 + 0.4 * comMulta)', money: true, highlight: true },
      { id: 'juros', label: 'Juros e atualização (referência: 1% ao mês + TR)', expr: 'saldo * 0.01 * 12', money: true },
    ],
    notes: [
      'O FGTS rende TR + 1% ao mês (ou 0,5% ao mês + IPCA, o que for maior). O simulador usa 1% ao mês como referência conservadora, sem TR.',
      'A multa de 40% só existe na rescisão sem justa causa. Na justa causa não há multa e o saque fica nas hipóteses legais.',
      'Depois de 8 anos de carteira (soma de todos os empregos), o saque integral é liberado, a qualquer momento.',
    ],
    relatedGuides: ['verbas-rescisorias', '13-salario-como-calcular', 'clt-ou-pj'],
  },

  {
    slug: 'custo-folha',
    title: 'Calculadora de custo de folha: quanto a empresa gasta com um CLT',
    description:
      'Calcule o custo mensal real de um funcionário CLT: salário, INSS patronal, FGTS, férias com 1/3, 13º, provisões e Benefícios.',
    category: 'mei-e-nota-fiscal',
    badge: 'Empresa, não empregado',
    intro:
      'Contratar alguém custa mais do que o salário. Além do salário, a empresa paga INSS patronal (20%), FGTS (8%), férias com 1/3, 13º, provisões (férias, 13º, PLL) e benefícios. Esta calculadora mostra o custo mensal total por pessoa.',
    fields: [
      { id: 'salario', label: 'Salário mensal bruto', type: 'money', default: 3000 },
      { id: 'beneficios', label: 'Benefícios por mês (VT, VR, plano de saúde, PLR)', type: 'money', default: 600 },
      { id: 'inssPatronal', label: 'INSS patronal (%)', type: 'percent', default: 20 },
      { id: 'fgts', label: 'FGTS (%)', type: 'money', default: 8 },
      { id: 'terceiros', label: 'Outros encargos sobre a folha (%)', type: 'percent', default: 3, hint: 'RAT, terceiros, vale-transporte, provisões.' },
    ],
    outputs: [
      { id: 'encargos', label: 'Encargos sobre o salário', expr: 'salario * (inssPatronal + fgts + terceiros) / 100', money: true },
      { id: 'provisoes', label: 'Provisões (férias+1/3, 13º, PLL)', expr: 'salario * (4 / 12 + 1 / 12 + 1 / 12)', money: true },
      { id: 'total', label: 'Custo mensal total por pessoa', expr: 'salario + salario * (inssPatronal + fgts + terceiros) / 100 + salario * (4 / 12 + 1 / 12 + 1 / 12) + beneficios', money: true, highlight: true },
      { id: 'anual', label: 'Custo anual por pessoa', expr: '12 * (salario + salario * (inssPatronal + fgts + terceiros) / 100 + salario * (4 / 12 + 1 / 12 + 1 / 12) + beneficios)', money: true },
      { id: 'custoPorHora', label: 'Custo da hora trabalhada', expr: '(salario + salario * (inssPatronal + fgts + terceiros) / 100 + salario * (4 / 12 + 1 / 12 + 1 / 12) + beneficios) / 220', money: true },
    ],
    notes: [
      'As provisões (férias com 1/3, 13º e participation nos resultados) são provisionadas todo mês, mesmo quando não são pagas naquele mês — por isso o caixa do ano inteiro é maior do que o custo mensal sugere.',
      'O custo da hora trabalhada (e não o salário) é o número que importa na precificação de serviço: é o que a empresa precisa faturar para cobrir aquele profissional.',
      'Contratar como PJ reduz o custo na papel, mas a CLT traz 13º, férias, FGTS, estabilidade e um custo de rescisão previsível.',
    ],
    relatedGuides: ['custo-real-de-ter-mei', 'clt-ou-pj', 'como-precificar-produto'],
  },

  {
    slug: 'ponto-de-equilibrio',
    title: 'Calculadora de ponto de equilíbrio: quanto preciso faturar por mês',
    description:
      'Calcule quanto sua empresa precisa faturar por mês para cobrir os custos fixos, e quanto precisa vender por dia para chegar lá.',
    category: 'renda-e-negocio',
    badge: 'Custos fixos x margem',
    intro:
      'Ponto de equilíbrio é o faturamento que paga os custos fixos (aluguel, salaries, tools, contador) sem lucro. A conta é: custos fixos divididos pela margem de lucro. Serve para responder "vou conseguir sustainar isso?" antes de assinar qualquer coisa.',
    fields: [
      { id: 'fixos', label: 'Custos fixos por mês (aluguel, salaries, ferramentas, contador)', type: 'money', default: 6000 },
      { id: 'custosVariaveis', label: 'Custos variáveis por mês (impostos, taxas, insumos)', type: 'money', default: 2000 },
      { id: 'margem', label: 'Margem de lucro sobre a venda (%)', type: 'percent', default: 30 },
      { id: 'preco', label: 'Preço médio de venda', type: 'money', default: 150 },
      { id: 'dias', label: 'Dias de venda por mês', type: 'number', default: 22 },
    ],
    outputs: [
      { id: 'custoTotal', label: 'Custo total mensal', expr: 'fixos + custosVariaveis', money: true },
      { id: 'contribuicao', label: 'Contribuição unitária (preço - custo variável)', expr: 'preco * margem / 100', money: true },
      { id: 'pedidos', label: 'Pedidos por mês para cobrir os fixos', expr: 'fixos / max(0.01, preco * margem / 100)', money: false },
      { id: 'faturamento', label: 'Faturamento de equilíbrio (com custos variáveis)', expr: 'fixos / max(0.01, margem / 100)', money: true, highlight: true },
      { id: 'porDia', label: 'Vendas por dia para chegar lá', expr: 'fixos / max(0.01, preco * margem / 100) / dias', money: false },
      { id: 'lucroEsperado', label: 'Lucro se você vender 30% acima do equilíbrio', expr: 'fixos / max(0.01, margem / 100) * 0.3 * margem / 100', money: true },
    ],
    notes: [
      'A conta ignora os impostos sobre o lucro (IRPJ/IRPF/Simples) e a pró-labore: ajuste a margem para o que sobra depois deles.',
      'Se o "preço médio de venda" não é realistic, o número de pedidos vai assustar — e é para isso que a conta existe.',
      'Custos fixos que você pode reduzir (assinaturas, aluguel, uma vaga) mudam o ponto de equilíbrio mais rápido do que vender mais.',
    ],
    relatedGuides: ['como-precificar-produto', 'renda-extra-com-ia', 'custo-real-de-ter-mei'],
  },

  {
    slug: 'margem-lucro',
    title: 'Calculadora de margem de lucro real por produto',
    description:
      'Descubra a margem real de cada produto: custo, impostos, taxas de marketplace, frete, devoluções e o quanto sobra.',
    category: 'renda-e-negocio',
    badge: 'Lucro por unidade',
    intro:
      'Margem de lista é a ilusão mais comum do e-commerce: o produto parece ter 60% de lucro e, depois de imposto, taxa de marketplace, frete por conta da loja e devolução, sobra pouco. A conta completa está abaixo.',
    fields: [
      { id: 'preco', label: 'Preço de venda', type: 'money', default: 120 },
      { id: 'custo', label: 'Custo do produto (ou produção + embalagem)', type: 'money', default: 45 },
      { id: 'impostos', label: 'Impostos sobre a venda (%)', type: 'percent', default: 8 },
      { id: 'taxaCanal', label: 'Taxa do canal/marketplace (%)', type: 'percent', default: 14 },
      { id: 'frete', label: 'Frete pago pela loja', type: 'money', default: 12 },
      { id: 'devolucao', label: 'Percentual de devoluções (%)', type: 'percent', default: 5 },
    ],
    outputs: [
      { id: 'custoTotal', label: 'Custo total por unidade vendida', expr: 'custo + preco * (impostos + taxaCanal + devolucao) / 100 + frete', money: true },
      { id: 'lucro', label: 'Lucro por unidade', expr: 'preco - (custo + preco * (impostos + taxaCanal + devolucao) / 100 + frete)', money: true, highlight: true },
      { id: 'margem', label: 'Margem real (%)', expr: '(preco - (custo + preco * (impostos + taxaCanal + devolucao) / 100 + frete)) / preco * 100', money: false },
      { id: 'margemBruta', label: 'Margem bruta (antes dos custos)', expr: '(preco - custo) / preco * 100', money: false },
      { id: 'precoMinimo', label: 'Preço mínimo para não perder dinheiro', expr: '(custo + frete) / max(0.01, 1 - (impostos + taxaCanal + devolucao) / 100)', money: true },
    ],
    notes: [
      'Devolução não é só o produto perdido: inclui o frete de devolução e o custo de reenvio. Por isso 5% de devolução não são 5% de prejuízo.',
      'Se a margem real ficar abaixo de 15%, o negócio só sobrevive com giro alto — e aí a inadimplência do capital de giro aparece.',
      'Frete grátis para o cliente é frete pago por você: entra na conta como custo fixo por venda.',
    ],
    relatedGuides: ['como-precificar-produto', 'vender-online-sem-estoque', 'como-vender-no-marketplace'],
  },

  {
    slug: 'reserva-emergencia',
    title: 'Calculadora de reserva de emergência: quanto tempo para juntar',
    description:
      'Calcule quanto você precisa guardar para ter 3, 6 ou 12 meses de expenses e em quanto tempo chega lá com seu saldo e sua renda.',
    category: 'custos-e-planos',
    badge: '3, 6 ou 12 meses',
    intro:
      'Reserva de emergência é o colchão que impede um imprevisto de virar rotativo do cartão ou do. A conta: quantas despesas mensais você tem, quantos meses quer cobrir, e quanto sobra por mês para guardar.',
    fields: [
      { id: 'despesas', label: 'Despesas mensais essenciais (moradia, mercado, transporte, contas)', type: 'money', default: 2800 },
      { id: 'mesesCobertura', label: 'Meses que você quer cobrir', type: 'select', options: [{ value: 3, label: '3 meses' }, { value: 6, label: '6 meses' }, { value: 12, label: '12 meses' }], default: 6 },
      { id: 'reservaAtual', label: 'Quanto você já tem guardado (R$)', type: 'money', default: 2000 },
      { id: 'guardando', label: 'Quanto você consegue guardar por mês (R$)', type: 'money', default: 500 },
      { id: 'rendimento', label: 'Rendimento da reserva ao mês (%)', type: 'percent', default: 0.8 },
    ],
    outputs: [
      { id: 'meta', label: 'Meta da reserva', expr: 'despesas * mesesCobertura', money: true, highlight: true },
      { id: 'falta', label: 'Quanto ainda falta', expr: 'max(0, despesas * mesesCobertura - reservaAtual)', money: true },
      { id: 'mesesAte', label: 'Meses para chegar lá (guardando todo mês)', expr: 'max(0, despesas * mesesCobertura - reservaAtual) / max(1, guardando)', money: false },
      { id: 'comRendimento', label: 'Meses para chegar lá (com rendimento)', expr: 'max(0, despesas * mesesCobertura - reservaAtual) / max(1, guardando * (1 + rendimento / 100))', money: false },
      { id: 'sobra', label: 'Sobras após a meta', expr: 'despesas * mesesCobertura - reservaAtual', money: true },
    ],
    notes: [
      'Três meses é o mínimo para autônomo e seis a doze para quem tem renda estável. CLT costuma começar em 3 meses e crescer.',
      'A reserva não rende como investimento: ela rende o suficiente para acompanhar a inflação e ficar disponível. O retorno vem de não pagar juros do rotativo.',
      'Reserva não é poupança para consumo. Separar as duas é o que evita que a conta da emergência vire dinheiro de fim de semana.',
    ],
    relatedGuides: ['orcamento-familiar-passo-a-passo', 'como-reduzir-contas-de-casa', 'cartao-de-credito-como-escolher'],
  },

  {
    slug: 'aumento-de-aluguel',
    title: 'Calculadora de aumento de aluguel: pelo IPCA ou pelo índice do(reajuste)',
    description:
      'Calcule quanto o seu aluguel pode aumentar no ano, com base no IPCA ou no índice do(reajuste), e quanto isso pesa no seu orçamento.',
    category: 'custos-e-planos',
    badge: 'Reajuste anual',
    intro:
      'No(reajuste) residencial, o reajuste anual é por índice oficial (IGPM, IPCA ou INPC) e o locador precisa notificar com 30 dias de antecedência para cobrar o(index) do(reajuste) no(reajuste) mesmo. Sem notificação, o reajuste não vale.',
    fields: [
      { id: 'aluguel', label: 'Aluguel atual (R$)', type: 'money', default: 1800 },
      { id: 'indice', label: 'Índice do reajuste (%)', type: 'percent', default: 4.5, hint: 'Referência: IPCA dos últimos 12 meses. O contrato define qual índice vale.' },
      { id: 'multa', label: 'Multa por atraso de pagamento (%)', type: 'percent', default: 2 },
      { id: 'outros', label: 'Condomínio, IPTU e contas fixas do mês', type: 'money', default: 700 },
      { id: 'renda', label: 'Sua renda líquida mensal (R$)', type: 'money', default: 3500 },
    ],
    outputs: [
      { id: 'reajuste', label: 'Aumento do aluguel', expr: 'aluguel * indice / 100', money: true },
      { id: 'novoAluguel', label: 'Novo aluguel', expr: 'aluguel * (1 + indice / 100)', money: true, highlight: true },
      { id: 'totalMoradia', label: 'Total de moradia por mês', expr: 'aluguel * (1 + indice / 100) + outros', money: true },
      { id: 'pctRenda', label: 'Moradia como % da renda líquida', expr: '(aluguel * (1 + indice / 100) + outros) / max(1, renda) * 100', money: false },
    ],
    notes: [
      'A lei doinquiloc: o reajuste é de até um índice oficial por ano, vigente na data da  do contrato ou do último reajuste.',
      'Sem notificação com 30 dias de antecedência, o reajuste não se aplica — o locador só pode cobrar após o aviso.',
      'Se o locador pedir mais que o índice, cabe questionar por escrito antes de aceitar.(diff)',
    ],
    relatedGuides: ['orcamento-familiar-passo-a-passo', 'como-reduzir-contas-de-casa', 'cartao-de-credito-como-escolher'],
  },

  {
    slug: 'juros-composto',
    title: 'Calculadora de juros compostos: quanto rende o dinheiro no tempo',
    description:
      'Simule o rendimento de dinheiro no CDB, LCI ou poupança com juros compostos: quanto entra, quanto rende por mês e quanto você tem em 1, 5 e 10 anos.',
    category: 'custos-e-planos',
    badge: 'Renda fixa',
    intro:
      'Juros compostos é juro sobre juro: o tempo faz o trabalho. Esta calculadora mostra quanto um valor inicial, com aporte mensal, rende a uma taxa mensal — e compara com o que renderia só em CDB de liquidez diária.',
    fields: [
      { id: 'inicial', label: 'Valor inicial (R$)', type: 'money', default: 5000 },
      { id: 'aporte', label: 'Aporte mensal (R$)', type: 'money', default: 500 },
      { id: 'taxa', label: 'Taxa mensal (% ao mês)', type: 'percent', default: 0.9, hint: 'Referência: CDI em torno de 0,9% ao mês. CDB costuma ficar em 100% do CDI.' },
      { id: 'anos', label: 'Em quantos anos projetar', type: 'select', options: [{ value: 1, label: '1 ano' }, { value: 5, label: '5 anos' }, { value: 10, label: '10 anos' }, { value: 20, label: '20 anos' }], default: 5 },
    ],
    outputs: [
      { id: 'totalAportado', label: 'Total aportado (initial + aportes)', expr: 'inicial + aporte * 12 * anos', money: true },
      { id: 'montante', label: 'Montante final', expr: 'inicial * (1 + taxa / 100) ^ (12 * anos) + aporte * ((1 + taxa / 100) ^ (12 * anos) - 1) / (taxa / 100)', money: true, highlight: true },
      { id: 'juros', label: 'Quanto renderam os juros', expr: 'inicial * (1 + taxa / 100) ^ (12 * anos) + aporte * ((1 + taxa / 100) ^ (12 * anos) - 1) / (taxa / 100) - (inicial + aporte * 12 * anos)', money: true },
      { id: 'mediaMes', label: 'Rendimento médio por mês no período', expr: '(inicial * (1 + taxa / 100) ^ (12 * anos) + aporte * ((1 + taxa / 100) ^ (12 * anos) - 1) / (taxa / 100) - (inicial + aporte * 12 * anos)) / (12 * anos)', money: true },
    ],
    notes: [
      'A taxa usada é a bruta. Em renda fixa, o imposto (15% no CPF para CDB, 17,5% no LCI/LCA) reduz o resultado — este simulador mostra o bruto, e a diferença fica com você.',
      'Rentabilidade passada não é garantia de retorno futuro. A taxa real de 2026 não é a de 2027.',
      'Reserva de emergência não deve ir para investimento: ela precisa estar disponível sem carência e sem market risk.',
    ],
    relatedGuides: ['orcamento-familiar-passo-a-passo', 'cartao-de-credito-como-escolher', 'como-reduzir-contas-de-casa'],
  },
];

export default calculatorsExtra;
