/**
 * Calculadoras interativas.
 *
 * Cada calculadora é uma página própria (/calculadoras/<slug>/) com campos de
 * entrada e resultados calculados no navegador — e pré-calculados no build com
 * os valores padrão, para o Google indexar o resultado (boa parte das buscas
 * de "calculadora de X" só entrega o resultado).
 *
 * Valores de referência: outubro de 2026. A tabela do DAS muda todo ano em
 * janeiro; a de INSS muda com o salário mínimo. Isso aparece nas notas.
 */

export const calculators = [
  {
    slug: 'decimo-terceiro',
    title: 'Calculadora de 13º salário: quanto vou receber?',
    description:
      'Calcule quanto de 13º salário bruto, INSS e líquido você recebe, com base no salário e nos meses trabalhados no ano. Resultado na hora.',
    category: 'trabalho-e-carreira',
    badge: 'Grátis, sem cadastro',
    intro:
      'O 13º salário bruto é o salário mensal dividido por 12 e multiplicado pelos meses trabalhados no ano (máximo de 12). Do bruto saem o INSS e, se houver, o IRRF e outros descontos. É isso que a calculadora abaixo faz.',
    fields: [
      { id: 'salario', label: 'Salário mensal bruto', type: 'money', default: 3000, hint: 'Quanto você recebe por mês antes dos descontos.' },
      { id: 'meses', label: 'Meses trabalhados no ano', type: 'number', default: 12, min: 0, max: 12, hint: 'Para quem saiu do emprego em setembro, por exemplo, são 9.' },
      { id: 'outros', label: 'Outros descontos (IRRF, vale, etc.)', type: 'money', default: 0, hint: 'Opcional. Deixe zero se não souber.' },
    ],
    outputs: [
      { id: 'bruto', label: '13º salário bruto', expr: 'salario * meses / 12', money: true },
      { id: 'inss', label: 'INSS estimado', kind: 'inss', base: 'salario * meses / 12', money: true },
      { id: 'liquido', label: '13º salário líquido estimado', expr: 'salario * meses / 12 - (salario * meses / 12) * 0 + 0', money: true, hidden: true },
      { id: 'outrosOut', label: 'Outros descontos informados', expr: 'outros', money: true },
      { id: 'final', label: 'Valor líquido a receber', kind: 'final', base: 'salario * meses / 12', inss: true, outros: true, money: true, highlight: true },
    ],
    notes: [
      'A tabela de INSS usada aqui é a vigente até a última atualização do salário mínimo. Com salário mínimo novo em janeiro, os valores mudam — confirme no recibo de pagamento.',
      'IRRF depende da tabela vigente, das deduções e de outros incomes. Por isso ele fica como campo manual, em "outros descontos".',
      'Quem foi demitido ou se aposentou tem regras próprias de pagamento na empresa, que podem incluir o 13º proporcional ou não. Confirme com o RH.',
    ],
    relatedGuides: ['13-salario-como-calcular', 'clt-ou-pj', 'verbas-rescisorias'],
  },

  {
    slug: 'ferias',
    title: 'Calculadora de férias: quanto você ganha com férias + 1/3?',
    description:
      'Calcule o valor bruto e líquido das férias, com ou sem o adicional de 1/3, e descubra quanto vale vender suas férias.',
    category: 'trabalho-e-carreira',
    badge: 'Inclui o 1/3',
    intro:
      'As férias valem um terço da sua remuneração mensal, mais um terço desse valor como adicional de constitucional (o chamado "férias mais 1/3"). Se você vender as férias em vez de gozar, recebe o valor cheio mais o adicional.',
    fields: [
      { id: 'salario', label: 'Salário mensal bruto', type: 'money', default: 3000 },
      { id: 'terco', label: 'Incluir o adicional de 1/3', type: 'select', options: [{ value: 1, label: 'Sim, com 1/3' }, { value: 0, label: 'Não' }], default: 1 },
      { id: 'outros', label: 'Outros descontos', type: 'money', default: 0 },
    ],
    outputs: [
      { id: 'base', label: 'Férias (1/3 da remuneração)', expr: 'salario / 3', money: true },
      { id: 'adicional', label: 'Adicional de 1/3', expr: 'salario / 9 * terco', money: true },
      { id: 'bruto', label: 'Total bruto', expr: 'salario / 3 + salario / 9 * terco', money: true },
      { id: 'inss', label: 'INSS estimado', kind: 'inss', base: 'salario / 3 + salario / 9 * terco', money: true },
      { id: 'final', label: 'Valor líquido a receber', kind: 'final', base: 'salario / 3 + salario / 9 * terco', inss: true, outros: true, money: true, highlight: true },
    ],
    notes: [
      'O adicional de 1/3 incide sobre as férias e só pode ser usado uma vez por ano de férias.',
      'Quem tem menos de um ano de empresa e mais de seis meses de contrato já tem direito ao terço de férias — a regra dos 18 meses foi alterada.',
      'Férias vendidas não enjoymentam o período: a empresa paga em dinheiro e você continua com o saldo de férias.',
    ],
    relatedGuides: ['como-calcular-ferias', '13-salario-como-calcular', 'verbas-rescisorias'],
  },

  {
    slug: 'rescisao',
    title: 'Calculadora de rescisão: quanto recebo ao ser demitido?',
    description:
      'Calcule as verbas rescisórias: saldo de salário, férias proporcionais, 13º proporcional, aviso-prévio, FGTS e multa.Passo a passo com o cálculo de cada verba.',
    category: 'trabalho-e-carreira',
    badge: 'Todas as verbas',
    intro:
      'Na rescisão, o acerto é a soma das verbas que você tem direito: saldo de salário, férias proporcionais (mais 1/3), 13º proporcional, aviso-prévio, FGTS com multa de 40% e, se for justa causa, o aviso não é pago. A calculadora mostra cada linha e o total.',
    fields: [
      { id: 'salario', label: 'Salário mensal bruto', type: 'money', default: 3000 },
      { id: 'mesesAno', label: 'Meses trabalhados no ano da demissão', type: 'number', default: 6, min: 0, max: 12 },
      { id: 'tempo', label: 'Tempo de empresa em meses', type: 'number', default: 18, min: 0, max: 480 },
      { id: 'saldo', label: 'Saldo de salário (dias trabalhados no mês)', type: 'money', default: 0, hint: 'Deixe zero se não souber.' },
      { id: 'justaCausa', label: 'Foi justa causa?', type: 'select', options: [{ value: 1, label: 'Sim, houve justa causa' }, { value: 0, label: 'Não' }], default: 0 },
    ],
    outputs: [
      { id: 'saldo', label: 'Saldo de salário', expr: 'saldo', money: true },
      { id: 'ferias', label: 'Férias proporcionais (+1/3)', expr: 'salario / 12 * mesesAno * 4 / 3', money: true },
      { id: 'decimo', label: '13º proporcional', expr: 'salario / 12 * mesesAno', money: true },
      { id: 'aviso', label: 'Aviso prévio', expr: 'min(60, ceil(tempo / 12) * 30) / 30 * salario * (1 - justaCausa)', money: true },
      { id: 'fgts', label: 'FGTS (8%) + multa (40%)', expr: 'salario * tempo / 12 * 0.08 * 1.4', money: true },
      { id: 'total', label: 'Total do acerto (sem FGTS)', expr: 'saldo + salario / 12 * mesesAno * 4 / 3 + salario / 12 * mesesAno + min(60, ceil(tempo / 12) * 30) / 30 * salario * (1 - justaCausa)', money: true, highlight: true },
    ],
    notes: [
      'O aviso-prévio tem regra dos 45 dias: quem tem mais de 45 dias de casa recebe 60 dias. A calculadora usa 30 dias por ano de serviço, limitado a 60.',
      'Em justa causa, o aviso-prévio e as férias proporcionais podem ser negados. A multa do FGTS é de 40% e fica disponível após 8 anos de carteira ou no caso de demissão sem justa causa.',
      'Valores de referência: outubro de 2026. Confirme o acerto no recibo e com um advogado trabalhista se houver divergência.',
    ],
    relatedGuides: ['verbas-rescisorias', '13-salario-como-calcular', 'como-calcular-ferias'],
  },

  {
    slug: 'clt-vs-pj',
    title: 'Calculadora CLT ou PJ: quanto custa cada um por ano?',
    description:
      'Compare o custo anual de ser CLT e de ser PJ (pessoa jurídica), com INSS, FGTS, férias, 13º e IRRF, e descubra quanto precisa faturar como PJ para empatar.',
    category: 'trabalho-e-carreira',
    badge: 'Comparativo de custo',
    intro:
      'Ser PJ costuma parecer mais barato no holerite e sai mais caro no ano. A diferença vem dos encargos que a empresa paga no CLT (INSS patronal, FGTS, férias e 13º) e dos impostos que você mesmo assume como PJ. Esta calculadora coloca os dois lado a lado.',
    fields: [
      { id: 'salario', label: 'Salário bruto mensal (o que a empresa paga no CLT)', type: 'money', default: 5000 },
      { id: 'encargos', label: 'Encargos adicionais da empresa sobre o salário (%)', type: 'percent', default: 28, hint: 'INSS patronal 20% + FGTS 8% + RAT e terceiros. Confirme com o RH.' },
      { id: 'plr', label: 'PLR ou bônus anual no CLT (R$)', type: 'money', default: 0 },
      { id: 'inadimplencia', label: '% de dias que o PJ não paga (inadimplência)', type: 'percent', default: 5 },
    ],
    outputs: [
      { id: 'custoClt', label: 'Custo anual da empresa no CLT', expr: 'salario * (1 + encargos / 100) * 13 + salario / 3 * 4 / 3 + plr', money: true },
      { id: 'custoCltReal', label: 'Custo anual efetivo do CLT (com 13º, férias e 1/3)', expr: 'salario * (1 + encargos / 100) * 13 + salario / 3 * 4 / 3 + plr', money: true },
      { id: 'receitaPJ', label: 'Faturamento anual necessário como PJ para empatar', expr: 'salario * (1 + encargos / 100) * 13 * (1 + inadimplencia / 100) / 0.8', money: true, highlight: true },
      { id: 'mensalPJ', label: 'Faturamento mensal equivalente para PJ', expr: 'salario * (1 + encargos / 100) * 13 * (1 + inadimplencia / 100) / 0.8 / 12', money: true },
      { id: 'custoLiquido', label: 'Sobra mensal estimada se você for PJ (antes de IRPF/IRPJ)', expr: 'salario * (1 + encargos / 100) * 13 * (1 + inadimplencia / 100) / 0.8 / 12 - salario / 12 * (1 + encargos / 100) * 1.28', money: true },
    ],
    notes: [
      'A conta do PJ depende da razão social (MEI, Simples, Lucro Presumido) e da distribuição de lucros. O cálculo aqui usa uma alíquota efetiva de 20% sobre o faturamento como referência para MEI/Simples — ajuste conforme o seu caso.',
      'Como PJ você não tem férias, 13º, FGTS, seguro-desemprego nem estabilidade. Isso tem valor: é a contrapartida do que você deixa de receber.',
      'Não forget de descontar do PJ: IRPF ou IRPJ, INSS (11% ou 20%), contador, contador e asthan imposto municipal. Um contador resolve isso em uma conversa.',
    ],
    relatedGuides: ['clt-ou-pj', 'freelancer-como-comecar', 'trabalho-remoto-como-conseguir-vaga'],
  },

  {
    slug: 'das-mei',
    title: 'Calculadora do DAS do MEI: quanto vou pagar por mês?',
    description:
      'Calcule quanto paga de DAS por mês a partir do seu faturamento anual, com as faixas de alíquota, os valores fixos e o desconto do ano no limite.',
    category: 'mei-e-nota-fiscal',
    badge: 'Faixas de 2026',
    intro:
      'O DAS do MEI é calculado por faixa de faturamento anual: quanto mais você fatura, menor a alíquota sobre a parte excedente — mas existe um valor fixo mínimo. A calculadora aplica a tabela vigente e mostra em qual faixa você está e quanto paga.',
    fields: [
      { id: 'faturamento', label: 'Faturamento dos últimos 12 meses (R$)', type: 'money', default: 60000, hint: 'Some tudo o que você recebeu nos últimos 12 meses.' },
      { id: 'proporcional', label: 'Meses no ano (para proportionally o DAS)', type: 'number', default: 12, min: 1, max: 12 },
    ],
    outputs: [
      { id: 'faixa', label: 'DAS mensal da sua faixa', kind: 'faixa', field: 'faturamento', money: true },
      { id: 'total', label: 'DAS a pagar no mês (proporcional aos meses declarados)', kind: 'dasProporcional', field: 'faturamento', money: true, highlight: true },
      { id: 'anual', label: 'Total de DAS em 12 meses (ano cheio)', kind: 'dasAnual', field: 'faturamento', money: true },
      { id: 'perc', label: 'Percentual efetivo do DAS sobre a receita anual projetada', kind: 'percentualDas', field: 'faturamento', money: false },
    ],
    notes: [
      'O DAS do MEI é um valor fixo por faixa de receita bruta anual — não é uma porcentagem do que você faturou. Por isso o percentual efetivo no fim da página é bem menor do que a alíquota nominal.',
      'Tabela de referência: outubro de 2026. As faixas são reajustadas todo ano em janeiro — confira o valor atual no Portal do Empreendedor.',
      'A faixa é pela receita anual projetada (faturamento × 12 ÷ meses de atividade). Se você começou o ano depois de janeiro, o DAS do primeiro mês sai proporcional.',
      'O DAS é sempre pago no dia 20 do mês seguinte. A partir de 2026 há reorganização dos vencimentos no início do ano; a fila é definida pelo Portal.',
      'O limite de R$ 81.000 é de faturamento bruto dos 12 meses anteriores. Passou disso, a próxima declaração já é de enquadramento como MEI.',
      'O DAS não é a única despesa: contabilidade, alvará, MEI (equipamento obrigatório), sistema de NFS-e e impostos municipais somam mais.',
    ],
    relatedGuides: ['das-mei-como-pagar', 'custo-real-de-ter-mei', 'como-abrir-mei-passo-a-passo'],
  },

  {
    slug: 'markup-e-margem',
    title: 'Calculadora de preço de venda: markup, margem e lucro',
    description:
      'Calcule o preço de venda a partir do custo, do markup ou da margem desejada — e descubra quanto sobra de lucro depois de impostos, taxas e frete.',
    category: 'renda-e-negocio',
    badge: 'Markup x margem',
    intro:
      'Markup é o multiplicador sobre o custo (custo x 3 = preço de R$ 30 num produto de R$ 10). Margem é a porcentagem sobre o preço (vender a R$ 30 com custo de R$ 10 é margem de 66%). Confundir os dois é o erro que mais quebra preço no e-commerce.',
    fields: [
      { id: 'custo', label: 'Custo do produto ou serviço', type: 'money', default: 40 },
      { id: 'impostos', label: 'Impostos sobre a venda (%)', type: 'percent', default: 8 },
      { id: 'taxas', label: 'Taxas de marketplace/pagamento (%)', type: 'percent', default: 12 },
      { id: 'frete', label: 'Custo fixo por venda (frete, embalagem)', type: 'money', default: 10 },
      { id: 'margem', label: 'Margem de lucro desejada (%)', type: 'percent', default: 30 },
    ],
    outputs: [
      { id: 'precoMarkup', label: 'Preço com markup de 3x o custo', expr: 'custo * 3', money: true },
      { id: 'precoMargem', label: 'Preço pela margem desejada (descontando impostos e taxas)', expr: 'custo / (1 - (impostos + taxas + margem) / 100)', money: true, highlight: true },
      { id: 'lucro', label: 'Lucro por unidade vendida', expr: 'custo / (1 - (impostos + taxas + margem) / 100) * margem / 100', money: true },
      { id: 'markup', label: 'Markup correspondente a essa margem', expr: '1 / (1 - (impostos + taxas + margem) / 100)', money: false },
      { id: 'total', label: 'Total que entra no seu bolso por unidade (antes de fixos)', expr: 'custo / (1 - (impostos + taxas + margem) / 100) * margem / 100 - frete', money: true },
    ],
    notes: [
      'A fórmula da margem já desconta impostos e taxas: se você quer 30% de lucro líquido sobre o preço de venda, o preço tem de ser maior do que custo/(1 - 30%).',
      'Frete, embalagem e custo fixo de venda são descontados do lucro, não do preço — daí a linha separada.',
      'Atualize impostos e taxas conforme o seu caso: MEI, Simples, marketplace e regime differem.',
    ],
    relatedGuides: ['como-precificar-produto', 'vender-online-sem-estoque', 'como-vender-no-marketplace'],
  },

  {
    slug: 'rendimento-renda-extra',
    title: 'Calculadora de renda extra: quanto rende R$ 1.000 por mês?',
    description:
      'Simule quanto uma renda extra de R$ 1.000 por mês rende em 12, 24 e 36 meses, com o custo do MEI e as taxas descontadas.',
    category: 'renda-e-negocio',
    badge: 'Projeção simples',
    intro:
      'A conta que quase ninguém faz: uma renda extra de R$ 1.000 por mês, descontando o custo de operar (MEI, taxas, impostos) e vendo quanto sobra. É essa sobra que vira o que fica e não o número do começo.',
    fields: [
      { id: 'receita', label: 'Receita bruta por mês (R$)', type: 'money', default: 1500 },
      { id: 'custos', label: 'Custos fixos por mês (plataforma, ferramenta, contador) (R$)', type: 'money', default: 200 },
      { id: 'impostos', label: 'Impostos sobre a receita (%)', type: 'percent', default: 6 },
      { id: 'meses', label: 'Em quantos meses você quer projetar', type: 'select', options: [{ value: 12, label: '12 meses' }, { value: 24, label: '24 meses' }, { value: 36, label: '36 meses' }], default: 12 },
    ],
    outputs: [
      { id: 'liquido', label: 'Quanto sobra líquido por mês', expr: 'receita * (1 - impostos / 100) - custos', money: true, highlight: true },
      { id: 'totalPeriodo', label: 'Total acumulado no período', expr: '(receita * (1 - impostos / 100) - custos) * meses', money: true },
      { id: 'investido', label: 'Total investido (receita bruta)', expr: 'receita * meses', money: true },
      { id: 'custoEfetivo', label: 'Custo efetivo sobre o que você fatura', expr: '(custos + receita * impostos / 100) / receita * 100', money: false },
    ],
    notes: [
      'A projeção não considera IRPF/IRPJ nem aprofundamento de despesas — é um comparativo simples entre cenários.',
      'O erro comum é criar receita sem custo: taxa de plataforma, ferramenta, contador e imposto são o que separa "renda extra" de hobby pago.',
      'Fixe um prazo e uma meta de faturamento por mês. Meta sem prazo vira intenção.',
    ],
    relatedGuides: ['renda-extra-com-ia', 'custo-real-de-ter-mei', 'como-precificar-produto'],
  },

  {
    slug: 'segunda-via-atraso',
    title: 'Calculadora de multa e juro de conta atrasada',
    description:
      'Calcule quanto custa uma conta de luz, água ou cartão em atraso: multa, juros por dia e o total para negociar a quitação.',
    category: 'servicos-publicos',
    badge: 'Multa e juro',
    intro:
      'Conta de luz, água ou cartão em atraso incide multa e juros por dia, e a multa cresce conforme o atraso. Esta calculadora mostra o valor atualizado de forma aproximada, para você saber quanto vai pagar e quanto precisa negociar.',
    fields: [
      { id: 'valor', label: 'Valor original da conta (R$)', type: 'money', default: 180 },
      { id: 'dias', label: 'Dias de atraso', type: 'number', default: 30, min: 1, max: 365 },
      { id: 'multa', label: 'Multa por atraso (%)', type: 'percent', default: 2, hint: 'A Multa é de 2% no primeiro mês e 1% ao mês em cartridge. Cartões de crédito usam encargos diferentes.' },
      { id: 'juros', label: 'Juros por dia (%)', type: 'percent', default: 0.1, hint: 'Referência: 0,1% a 0,15% ao dia. Bandeiras de cartão costumam aplicar encargos maiores.' },
    ],
    outputs: [
      { id: 'multaValor', label: 'Multa aplicada', expr: 'valor * multa / 100', money: true },
      { id: 'jurosValor', label: 'Juros acumulados', expr: 'valor * (juros / 100) * dias', money: true },
      { id: 'total', label: 'Total a pagar com multa e juros', expr: 'valor + valor * multa / 100 + valor * (juros / 100) * dias', money: true, highlight: true },
      { id: 'percentual', label: 'Percentual total acrescido', expr: '((valor + valor * multa / 100 + valor * (juros / 100) * dias) / valor - 1) * 100', money: false },
    ],
    notes: [
      'Energia, água e gás têm regras próprias de faturamento (multa por atraso, encargo debringing, corte por inadimplência). Cartão de crédito rotativo usa encargos próprios, bem maiores.',
      'Os percentuais aqui são de referência (outubro de 2026). Confira os encargos no contrato ou na segunda via oficial.',
      'Conta antiga ainda em produção? Negocie antes:parcelamento regular costuma custar menos do que deixar virar execução.',
    ],
    relatedGuides: ['segunda-via-de-conta-de-luz', 'segunda-via-de-conta-de-agua', 'como-reduzir-contas-de-casa'],
  },

  {
    slug: 'plano-de-saude-mei',
    title: 'Calculadora de plano de saúde para MEI',
    description:
      'Calcule o custo anual de plano de saúde para MEI, dependentes, e compare com o custo se você fosse CLT.',
    category: 'custos-e-planos',
    badge: 'MEI e plano de saúde',
    intro:
      'O titular do MEI pode entrar como beneficiário em plano de saúde e incluir dependentes. O custo depende da faixa etária, da operadora e daESTS se é_segments individual ou familiar. A calculadora estima o custo anual e mostra quanto isso pesa na sua despesa.',
    fields: [
      { id: 'idade', label: 'Sua idade', type: 'number', default: 35, min: 0, max: 90 },
      { id: 'dependentes', label: 'Quantas pessoas no plano além de você', type: 'number', default: 2, min: 0, max: 10 },
      { id: 'idadeDep', label: 'Idade média dos dependentes', type: 'number', default: 12, min: 0, max: 90 },
      { id: 'mensalidade', label: 'Mensalidade média por pessoa (R$)', type: 'money', default: 320, hint: 'Referência de mercado em outubro de 2026 para faixa de 30 a 39 anos. Confira na operadora.' },
    ],
    outputs: [
      { id: 'mensal', label: 'Custo mensal estimado do plano', expr: 'mensalidade + dependentes * mensalidade * (1 + max(0, idadeDep - idade) * 0.012)', money: true },
      { id: 'anual', label: 'Custo anual estimado', expr: '12 * (mensalidade + dependentes * mensalidade * (1 + max(0, idadeDep - idade) * 0.012))', money: true, highlight: true },
      { id: 'comReajuste', label: 'Projeção em 12 meses, se o reajuste for de 8%', expr: '12 * (mensalidade + dependentes * mensalidade * (1 + max(0, idadeDep - idade) * 0.012)) * 1.08', money: true },
    ],
    notes: [
      'A faixa de idade é o maior driver de preço: a mesma plano pode custar o dobro aos 60 anos do que aos 30.',
      'Reajustes anuais de 8% a 15% são comuns em planos HEALTH. Some o custo de um ano com o de dois para não se assustar no primeiro reajuste.',
      'MEI como beneficiário titular: a regra permite, mas as condições de contratação (carência,Rede de atendimento) variam por operadora. Confirme antes de fechar.',
    ],
    relatedGuides: ['plano-de-saude-para-mei', 'custo-real-de-ter-mei', 'como-reduzir-contas-de-casa'],
  },

  {
    slug: 'orcamento-mensal',
    title: 'Calculadora de orçamento mensal: quanto sobra do salário?',
    description:
      'Monte um orçamento mensal por categorias (moradia, alimentação, transporte, lazer) e descubra quanto realmente sobra do seu salário.',
    category: 'custos-e-planos',
    badge: 'Planilha em 2 minutos',
    intro:
      'A conta que quase todo mundo faz de cabeça erra: fixo mais variável mais parcelamento maisguardar. Se o resultado for negativo, o problema não é disciplina — é o tamanho das parcelas e dos benefícios.',
    fields: [
      { id: 'salario', label: 'Salário líquido por mês (R$)', type: 'money', default: 3000 },
      { id: 'fixo', label: 'Contas fixas: moradia, luz, água, internet, transporte (R$)', type: 'money', default: 1800 },
      { id: 'alimentacao', label: 'Alimentação e mercado (R$)', type: 'money', default: 800 },
      { id: 'lazer', label: 'Lazer, delivery e assinaturas (R$)', type: 'money', default: 400 },
      { id: 'parcelas', label: 'Parcelas de cartão e empréstimos (R$)', type: 'money', default: 500 },
      { id: 'emergencia', label: 'Reserva de emergência desejada (R$)', type: 'money', default: 6000 },
    ],
    outputs: [
      { id: 'gastos', label: 'Total de gastos monthly', expr: 'fixo + alimentacao + lazer + parcelas', money: true },
      { id: 'sobra', label: 'Quanto sobra do salário', expr: 'salario - (fixo + alimentacao + lazer + parcelas)', money: true, highlight: true },
      { id: 'percentual', label: 'Percentual do salário comprometido com despesa', expr: '(fixo + alimentacao + lazer + parcelas) / salario * 100', money: false },
      { id: 'mesesReserva', label: 'Meses de reserva que o valor da reserva cobre', expr: 'emergencia / max(1, (fixo + alimentacao + lazer + parcelas))', money: false },
      { id: 'reservaAno', label: 'Tempo para juntar a reserva de emergência, no ritmo atual', expr: 'emergencia / max(1, (salario - (fixo + alimentacao + lazer + parcelas)))', money: false },
    ],
    notes: [
      'Reserva de emergência de 3 a 6 meses das despesas é a regra que sustenta a quitação de imprevistos sem entrar no rotativo do cartão.',
      'Se o "quanto sobra" der negativo, o corte mais barato é o das parcelas, não o do mercado.',
      'Use valores líquidos, não brutos: salário bruto minus INSS e IRRF muda toda a conta.',
    ],
    relatedGuides: ['orcamento-familiar-passo-a-passo', 'como-reduzir-contas-de-casa', 'cartao-de-credito-como-escolher'],
  },
];

export default calculators;
