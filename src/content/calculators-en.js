/**
 * Global calculators (English edition).
 *
 * Same data model as `calculators.js`: every calculator is a standalone page
 * with input fields, outputs computed in the browser and pre-computed at build
 * time with the default values, so search engines index a real answer.
 *
 * Tax tables used here are reference values (October 2026). Every page that
 * depends on a tax table says so and points to the official source.
 */

/**
 * Builds a progressive tax expression.
 *
 * @param {string} taxableExpr expression that resolves to the taxable base
 * @param {Array<[number, number]>} brackets [upper limit, rate] in ascending order
 * @param {string} weightExpr multiplier applied to every bracket
 */
function progressiveTax(taxableExpr, brackets, weightExpr = '1') {
  return brackets
    .map(([upper, rate], i) => {
      const lower = i === 0 ? 0 : brackets[i - 1][0];
      return `${weightExpr} * ${rate} * max(0, min(${taxableExpr}, ${upper}) - ${lower})`;
    })
    .join(' + ');
}

/**
 * Selector: 1 when the chosen option equals the given code, 0 otherwise.
 * Used to pick one filing status without conditionals in the expression
 * evaluator.
 */
function optionWeight(fieldId, code) {
  return `max(0, 1 - abs(${fieldId} - ${code}))`;
}

/* ---------------------------------------------------------------------------
 * US federal income tax, tax year 2026 (single, married filing jointly,
 * head of household). Reference values: October 2026.
 * ------------------------------------------------------------------------- */
const US_2026 = {
  1: {
    deduction: 16100,
    brackets: [
      [12400, 0.10],
      [50400, 0.12],
      [105700, 0.22],
      [201775, 0.24],
      [256225, 0.32],
      [640600, 0.35],
      [1e12, 0.37],
    ],
  },
  2: {
    deduction: 32200,
    brackets: [
      [24800, 0.10],
      [100800, 0.12],
      [211400, 0.22],
      [403550, 0.24],
      [512450, 0.32],
      [1281200, 0.35],
      [1e12, 0.37],
    ],
  },
  3: {
    deduction: 24150,
    brackets: [
      [17700, 0.10],
      [70900, 0.12],
      [110100, 0.22],
      [201750, 0.24],
      [256200, 0.32],
      [640600, 0.35],
      [1e12, 0.37],
    ],
  },
};

const US_TAXABLE = {
  1: 'max(0, annualGross - pretaxDeductions - 16100)',
  2: 'max(0, annualGross - pretaxDeductions - 32200)',
  3: 'max(0, annualGross - pretaxDeductions - 24150)',
};

const US_DEDUCTION_EXPR =
  'max(0, 1 - abs(filingStatus - 1)) * 16100 + max(0, 1 - abs(filingStatus - 2)) * 32200 + max(0, 1 - abs(filingStatus - 3)) * 24150';

const US_FEDERAL_EXPR = [1, 2, 3]
  .map(
    (code) =>
      progressiveTax(US_TAXABLE[code], US_2026[code].brackets, optionWeight('filingStatus', code))
  )
  .join(' + ');

/* ---------------------------------------------------------------------------
 * UK income tax and National Insurance, 2026/27. Reference values: October 2026.
 * ------------------------------------------------------------------------- */
const UK_TAXABLE_EXPR = 'max(0, monthlyGross * 12 - monthlyGross * 12 * pensionPercent / 100 - personalAllowance)';

const UK_INCOME_TAX_EXPR = progressiveTax(UK_TAXABLE_EXPR, [
  [50270, 0.20],
  [125140, 0.40],
  [1e12, 0.45],
]);

const UK_NI_EXPR =
  '0.08 * max(0, min(monthlyGross * 12, 50270) - 12570) + 0.02 * max(0, monthlyGross * 12 - 50270)';

export const calculatorsEn = [
  {
    slug: 'net-salary-usa',
    title: 'Net Salary Calculator USA: Take-Home Pay After Tax and FICA',
    description:
      'Calculate your US take-home pay: 2026 federal income tax brackets, FICA (Social Security and Medicare) and an estimate for state income tax. Free, no signup.',
    category: 'finance',
    badge: '2026 tax brackets',
    intro:
      'Your paycheck is gross salary minus federal income tax, FICA (Social Security and Medicare) and state income tax. The federal part is progressive: each bracket only taxes the slice of income that falls inside it. This calculator applies the 2026 brackets to your filing status and shows every deduction on its own line.',
    fields: [
      { id: 'annualGross', label: 'Annual gross salary (USD)', type: 'money', default: 85000 },
      {
        id: 'filingStatus',
        label: 'Filing status',
        type: 'select',
        options: [
          { value: 1, label: 'Single' },
          { value: 2, label: 'Married filing jointly' },
          { value: 3, label: 'Head of household' },
        ],
        default: 1,
      },
      {
        id: 'pretaxDeductions',
        label: 'Pre-tax deductions per year: 401(k), HSA, health insurance (USD)',
        type: 'money',
        default: 0,
        hint: 'Amounts taken out before tax is calculated.',
      },
      {
        id: 'stateTaxRate',
        label: 'State income tax rate (% of gross, flat estimate)',
        type: 'percent',
        default: 3,
        hint: 'The US average is close to 3%. Some states have no income tax at all.',
      },
      {
        id: 'socialSecurityRate',
        label: 'Social Security rate (%)',
        type: 'percent',
        default: 6.2,
        hint: 'Employee share of the 6.2% Social Security tax.',
      },
      { id: 'medicareRate', label: 'Medicare rate (%)', type: 'percent', default: 1.45 },
      {
        id: 'ficaWageBase',
        label: 'Social Security wage base limit (USD per year)',
        type: 'money',
        default: 176100,
        hint: '2026 limit. Earnings above it are not subject to Social Security, only to Medicare.',
      },
    ],
    outputs: [
      { id: 'gross', label: 'Annual gross salary', expr: 'annualGross', money: true },
      {
        id: 'taxable',
        label: 'Annual taxable income (after the standard deduction)',
        expr: `max(0, annualGross - pretaxDeductions - (${US_DEDUCTION_EXPR}))`,
        money: true,
      },
      { id: 'federal', label: 'Federal income tax (2026 brackets)', expr: US_FEDERAL_EXPR, money: true },
      { id: 'state', label: 'State income tax (flat estimate)', expr: 'annualGross * stateTaxRate / 100', money: true },
      {
        id: 'fica',
        label: 'FICA: Social Security and Medicare',
        expr: 'min(annualGross, ficaWageBase) * socialSecurityRate / 100 + annualGross * medicareRate / 100',
        money: true,
      },
      {
        id: 'totalTax',
        label: 'Total taxes and deductions',
        expr: `(${US_FEDERAL_EXPR}) + annualGross * stateTaxRate / 100 + min(annualGross, ficaWageBase) * socialSecurityRate / 100 + annualGross * medicareRate / 100`,
        money: true,
      },
      {
        id: 'netAnnual',
        label: 'Annual take-home pay',
        expr: `annualGross - pretaxDeductions - (${US_FEDERAL_EXPR}) - annualGross * stateTaxRate / 100 - min(annualGross, ficaWageBase) * socialSecurityRate / 100 - annualGross * medicareRate / 100`,
        money: true,
      },
      {
        id: 'netMonthly',
        label: 'Monthly take-home pay',
        expr: `(annualGross - pretaxDeductions - (${US_FEDERAL_EXPR}) - annualGross * stateTaxRate / 100 - min(annualGross, ficaWageBase) * socialSecurityRate / 100 - annualGross * medicareRate / 100) / 12`,
        money: true,
        highlight: true,
      },
      {
        id: 'effectiveRate',
        label: 'Total deductions as a share of gross pay',
        expr: `(${US_FEDERAL_EXPR} + annualGross * stateTaxRate / 100 + min(annualGross, ficaWageBase) * socialSecurityRate / 100 + annualGross * medicareRate / 100) / annualGross * 100`,
        money: false,
      },
      {
        id: 'standardDeduction',
        label: 'Standard deduction applied',
        expr: US_DEDUCTION_EXPR,
        money: true,
        hidden: true,
      },
    ],
    notes: [
      'The 2026 federal brackets, standard deduction and Social Security wage base used here are reference values (October 2026). Check the official IRS tables before you make a decision or a payment.',
      'State income tax is a flat percentage here because real state rules vary a lot: some states have no income tax, some start taxing at a low threshold, and some allow deductions that change the result. Look up your own state to refine the number.',
      'Social Security only applies up to the annual wage base (about $176,100 in 2026). Above that, only Medicare is withheld, plus the 0.9% surtax on high earners.',
      'This simplified model does not subtract Social Security from taxable income, does not apply the 0% rate on qualified overtime pay for lower earners, and ignores credits and additional withholding. Your actual pay stub is the source of truth.',
      'Independent contractors do not pay Social Security or Medicare through withholding; they pay both as self-employment tax. If that is your case, use the freelance rate calculator instead.',
    ],
    relatedGuides: ['us-tax-brackets-explained', 'state-income-tax-basics', 'freelance-contractor-taxes'],
  },

  {
    slug: 'net-salary-uk',
    title: 'Net Salary Calculator UK: Take-Home Pay After Tax and NI',
    description:
      'Work out your UK take-home pay: income tax on the 2026/27 bands, National Insurance, pension and student loan deductions. Free, instant result.',
    category: 'finance',
    badge: '2026/27 bands',
    intro:
      'In the United Kingdom, pay is reduced by income tax, National Insurance, pension contributions and student loan repayment. Tax is charged on your income above the personal allowance, at 20% up to the basic rate limit, then 40% and 45%. This calculator shows each deduction separately so you can see where the money goes.',
    fields: [
      { id: 'monthlyGross', label: 'Gross monthly salary (GBP)', type: 'money', default: 3500 },
      {
        id: 'pensionPercent',
        label: 'Pension contribution (% of gross, taken before tax)',
        type: 'percent',
        default: 5,
        hint: 'Workplace pensions usually give extra tax relief. Check your scheme.',
      },
      {
        id: 'studentLoanPercent',
        label: 'Student loan repayment (% of gross)',
        type: 'percent',
        default: 0,
        hint: 'Most plans use 9%, but only above an income threshold. Leave it at zero if you do not have one.',
      },
      {
        id: 'personalAllowance',
        label: 'Personal allowance (GBP per year)',
        type: 'money',
        default: 12570,
        hint: 'Frozen at this level until 2029. It is reduced for higher earners above 100,000 GBP.',
      },
      {
        id: 'includeNI',
        label: 'Pay National Insurance as an employee?',
        type: 'select',
        options: [
          { value: 1, label: 'Yes, I am on an employee contract' },
          { value: 0, label: 'No, I am self-employed or contracted out' },
        ],
        default: 1,
      },
    ],
    outputs: [
      { id: 'gross', label: 'Annual gross salary', expr: 'monthlyGross * 12', money: true },
      { id: 'taxable', label: 'Annual taxable income after the personal allowance', expr: UK_TAXABLE_EXPR, money: true },
      { id: 'incomeTax', label: 'Income tax (annual)', expr: UK_INCOME_TAX_EXPR, money: true },
      {
        id: 'ni',
        label: 'National Insurance, Class 1 employee (annual)',
        expr: `${UK_NI_EXPR} * ${optionWeight('includeNI', 1)}`,
        money: true,
      },
      {
        id: 'studentLoan',
        label: 'Student loan repayment (annual)',
        expr: 'monthlyGross * 12 * studentLoanPercent / 100',
        money: true,
      },
      {
        id: 'pension',
        label: 'Pension contribution (annual)',
        expr: 'monthlyGross * 12 * pensionPercent / 100',
        money: true,
      },
      {
        id: 'netMonthly',
        label: 'Monthly take-home pay',
        expr:
          'monthlyGross - (' +
          UK_INCOME_TAX_EXPR +
          ') / 12 - (' +
          UK_NI_EXPR +
          `) * ${optionWeight('includeNI', 1)} / 12 - monthlyGross * studentLoanPercent / 100 - monthlyGross * pensionPercent / 100`,
        money: true,
        highlight: true,
      },
      {
        id: 'netAnnual',
        label: 'Annual take-home pay',
        expr:
          'monthlyGross * 12 - (' +
          UK_INCOME_TAX_EXPR +
          ') - (' +
          UK_NI_EXPR +
          `) * ${optionWeight('includeNI', 1)} - monthlyGross * 12 * studentLoanPercent / 100 - monthlyGross * 12 * pensionPercent / 100`,
        money: true,
      },
      {
        id: 'effectiveRate',
        label: 'Total deductions as a share of gross pay',
        expr:
          '((' +
          UK_INCOME_TAX_EXPR +
          ') + (' +
          UK_NI_EXPR +
          `) * ${optionWeight('includeNI', 1)} + monthlyGross * 12 * studentLoanPercent / 100 + monthlyGross * 12 * pensionPercent / 100) / (monthlyGross * 12) * 100`,
        money: false,
      },
      {
        id: 'monthlyTax',
        label: 'Monthly income tax',
        expr: `(${UK_INCOME_TAX_EXPR}) / 12`,
        money: true,
        hidden: true,
      },
    ],
    notes: [
      'The income tax bands, personal allowance and National Insurance thresholds used here are reference values for 2026/27 (October 2026). Check the official HMRC rates before you rely on the number.',
      'These are the rates for England, Wales and Northern Ireland. Scotland uses different bands and a different starter rate, so a Scottish employee will get a slightly different result.',
      'National Insurance for employees is 8% between the 12,570 GBP threshold and the 50,270 GBP upper earnings limit, and 2% above it. Self-employed people pay Class 4 National Insurance on profits instead, at a different rate.',
      'Your personal allowance is reduced by 1 GBP for every 2 GBP you earn above 100,000 GBP. This calculator does not model that taper.',
      'Employer pension contributions use relief at source, so the tax you pay on them is returned to you. This is a simplified model that does not calculate that refund.',
    ],
    relatedGuides: ['uk-income-tax-explained', 'national-insurance-guide', 'freelancer-taxes-uk'],
  },

  {
    slug: 'vat-gst-calculator',
    title: 'VAT and GST Calculator: How Much Tax Is Inside a Price?',
    description:
      'Calculate VAT or GST on a price for the European Union, the United States and Brazil, including the reverse case where the price you were given already includes tax.',
    category: 'finance',
    badge: 'EU, US and Brazil',
    intro:
      'VAT in the European Union and GST in the United States are consumption taxes added on top of a price, at rates that run from 17% to 23% in Europe and from 5% to 10% in the United States. Brazil has no single national VAT: state ICMS and municipal ISS vary, and the reference bands used here are 5% and 10%.',
    fields: [
      { id: 'amount', label: 'Amount (USD, EUR or BRL)', type: 'money', default: 100 },
      {
        id: 'taxRate',
        label: 'VAT or GST rate for your country',
        type: 'select',
        options: [
          { value: 23, label: 'VAT 23% (Poland)' },
          { value: 22, label: 'VAT 22% (Italy)' },
          { value: 20, label: 'VAT 20% (Germany, France, Spain, Austria)' },
          { value: 19, label: 'VAT 19% (Czechia, Slovakia, Romania, Malta)' },
          { value: 17, label: 'VAT 17% (Greece, Luxembourg)' },
          { value: 10, label: 'GST 10% (United States) or Brazil 10%' },
          { value: 5, label: 'GST 5% (United States) or Brazil 5%' },
        ],
        default: 20,
        hint: 'Rates are reference values (October 2026). Standard rates change: check the official table for your country.',
      },
      {
        id: 'taxInclusive',
        label: 'Does the amount already include the tax?',
        type: 'select',
        options: [
          { value: 1, label: 'Yes, tax is already included in the amount' },
          { value: 0, label: 'No, tax is added on top of the amount' },
        ],
        default: 0,
      },
    ],
    outputs: [
      {
        id: 'tax',
        label: 'Tax amount',
        expr:
          `${optionWeight('taxInclusive', 1)} * amount * taxRate / 100 / (1 + taxRate / 100) + (1 - ${optionWeight('taxInclusive', 1)}) * amount * taxRate / 100`,
        money: true,
        highlight: true,
      },
      {
        id: 'gross',
        label: 'Gross amount (with tax)',
        expr: `amount + (1 - ${optionWeight('taxInclusive', 1)}) * amount * taxRate / 100`,
        money: true,
      },
      {
        id: 'net',
        label: 'Amount you keep after tax',
        expr: `amount - ${optionWeight('taxInclusive', 1)} * amount * taxRate / 100 / (1 + taxRate / 100)`,
        money: true,
      },
      {
        id: 'rateOnGross',
        label: 'Tax as a share of the gross amount',
        expr: `(${optionWeight('taxInclusive', 1)} * amount * taxRate / 100 / (1 + taxRate / 100) + (1 - ${optionWeight('taxInclusive', 1)}) * amount * taxRate / 100) / (amount + (1 - ${optionWeight('taxInclusive', 1)}) * amount * taxRate / 100) * 100`,
        money: false,
      },
      {
        id: 'priceWithoutTax',
        label: 'Net value of the amount entered',
        expr: `amount - ${optionWeight('taxInclusive', 1)} * amount * taxRate / 100 / (1 + taxRate / 100)`,
        money: true,
        hidden: true,
      },
    ],
    notes: [
      'The rates listed here are reference values (October 2026). VAT rates, reduced rates and exemptions change, and several countries apply a different rate to food, books, transport or medicine. Check the official table for your country.',
      'European VAT is charged on the customer and collected by the business. In the United States, sales tax is charged to the buyer and collected by the seller on behalf of the state. Brazil has no national GST: ICMS is set by each state and ISS by each municipality.',
      'A price that already includes tax is worth less than it looks. At a 20% VAT, 120 GBP contains only 100 GBP of value: that is the number that matters for margin calculations.',
      'This calculator does not handle reverse charge, exempt supplies, import VAT, or registration thresholds. If you sell across borders, check the rules for your own country.',
    ],
    relatedGuides: ['vat-vs-gst-explained', 'how-to-set-prices-across-borders', 'gst-registration-basics'],
  },

  {
    slug: 'markup-margin-calculator',
    title: 'Markup vs Margin Calculator: Price a Product or Service',
    description:
      'Turn cost into selling price with markup or margin, after taxes, marketplace fees and shipping. See the profit you actually keep on every sale.',
    category: 'productivity',
    badge: 'Markup and margin',
    intro:
      'Markup is the multiplier you apply to cost (cost times 3 gives a 30 GBP price for a 10 GBP product). Margin is the percentage of the final price that you keep (selling at 30 GBP with 10 GBP of cost is a 66% margin). Mixing the two is the most common pricing mistake small businesses make, and it shows up as a business that is busy and still short of money.',
    fields: [
      { id: 'cost', label: 'Cost of the product or service', type: 'money', default: 40 },
      { id: 'taxes', label: 'Taxes on the sale (%)', type: 'percent', default: 8 },
      { id: 'fees', label: 'Marketplace or payment fees (%)', type: 'percent', default: 12 },
      { id: 'fixedPerSale', label: 'Fixed cost per sale (shipping, packaging)', type: 'money', default: 10 },
      { id: 'targetMargin', label: 'Target profit margin on the selling price (%)', type: 'percent', default: 30 },
    ],
    outputs: [
      { id: 'priceAtMarkup', label: 'Price at a 3x markup on cost', expr: 'cost * 3', money: true },
      {
        id: 'priceAtMargin',
        label: 'Price for the target margin (after taxes and fees)',
        expr: 'cost / (1 - (taxes + fees + targetMargin) / 100)',
        money: true,
        highlight: true,
      },
      {
        id: 'profitPerUnit',
        label: 'Profit per unit sold',
        expr: 'cost / (1 - (taxes + fees + targetMargin) / 100) * targetMargin / 100',
        money: true,
      },
      {
        id: 'markupMultiple',
        label: 'Markup multiple that matches that margin',
        expr: '1 / (1 - (taxes + fees + targetMargin) / 100)',
        money: false,
      },
      {
        id: 'netPerUnit',
        label: 'What you keep per sale, before fixed costs',
        expr: 'cost / (1 - (taxes + fees + targetMargin) / 100) * targetMargin / 100 - fixedPerSale',
        money: true,
      },
      {
        id: 'breakEvenVolume',
        label: 'Units needed to cover 1,000 in fixed costs',
        expr: '1000 / max(1, cost / (1 - (taxes + fees + targetMargin) / 100) * targetMargin / 100 - fixedPerSale)',
        money: false,
        hidden: true,
      },
    ],
    notes: [
      'The margin formula already removes taxes and fees: to keep 30% of net revenue you have to charge more than cost divided by 70%. The price is what the customer sees, and the margin is what you keep.',
      'Shipping, packaging and other fixed costs per sale are subtracted from the profit, not from the price. That is why they have their own line.',
      'The rates used here are reference values (October 2026). Taxes and platform fees differ by country, by state and by channel, so update the two percentages to match your own case before you publish the price.',
      'A 3x markup and a 3x margin are very different things: 3x markup on a 10 GBP cost is a 66% margin. Compare the two lines above before you set your price list.',
    ],
    relatedGuides: ['pricing-strategies-for-small-business', 'how-to-price-a-service', 'profit-margin-explained'],
  },

  {
    slug: 'freelance-rate-calculator',
    title: 'Freelance Rate Calculator: How Much to Charge per Hour',
    description:
      'Calculate the hourly rate you need to charge as a freelancer, covering business costs, unpaid hours, taxes and the profit margin you want to keep.',
    category: 'finance',
    badge: 'Covers unpaid time',
    intro:
      'Most freelancers set their hourly rate by what a colleague charges, then wonder why the money never arrives. The real rate has to pay your business costs, your unpaid hours, your taxes and a profit margin. This calculator builds the rate from the bottom up, which is the only way to know if your price is sustainable.',
    fields: [
      {
        id: 'annualExpenses',
        label: 'Annual business expenses (software, insurance, equipment, coworking)',
        type: 'money',
        default: 12000,
      },
      {
        id: 'targetIncome',
        label: 'Target annual income for yourself, after tax (USD)',
        type: 'money',
        default: 45000,
      },
      { id: 'billableHours', label: 'Billable hours per week', type: 'number', default: 25, min: 1, max: 80 },
      {
        id: 'unpaidHours',
        label: 'Non-billable hours per week (admin, sales, learning)',
        type: 'number',
        default: 10,
        min: 0, max: 60,
      },
      { id: 'weeksPerYear', label: 'Working weeks per year', type: 'number', default: 46, min: 1, max: 52 },
      {
        id: 'taxRate',
        label: 'Taxes and social contributions (% of revenue)',
        type: 'percent',
        default: 25,
        hint: 'Reference value (October 2026). Income tax plus social charges vary widely by country.',
      },
      {
        id: 'profitMargin',
        label: 'Profit margin on top of your salary (%)',
        type: 'percent',
        default: 10,
        hint: 'What is left after costs, taxes and your salary: the buffer that pays for a bad month.',
      },
    ],
    outputs: [
      {
        id: 'billableHoursYear',
        label: 'Billable hours per year',
        expr: 'billableHours * weeksPerYear',
        money: false,
      },
      {
        id: 'workingHours',
        label: 'Total working hours per year, paid and unpaid',
        expr: '(billableHours + unpaidHours) * weeksPerYear',
        money: false,
      },
      {
        id: 'revenueNeeded',
        label: 'Revenue you need per year',
        expr: '(annualExpenses + targetIncome) / (1 - (taxRate + profitMargin) / 100)',
        money: true,
      },
      {
        id: 'hourlyRate',
        label: 'Minimum hourly rate to charge',
        expr: '(annualExpenses + targetIncome) / (1 - (taxRate + profitMargin) / 100) / (billableHours * weeksPerYear)',
        money: true,
        highlight: true,
      },
      {
        id: 'dayRate',
        label: 'Day rate (8-hour day)',
        expr: '(annualExpenses + targetIncome) / (1 - (taxRate + profitMargin) / 100) / (billableHours * weeksPerYear) * 8',
        money: true,
      },
      {
        id: 'effectiveRate',
        label: 'Real hourly rate if you count every working hour',
        expr: '(annualExpenses + targetIncome) / (1 - (taxRate + profitMargin) / 100) / ((billableHours + unpaidHours) * weeksPerYear)',
        money: true,
      },
      {
        id: 'costPerHour',
        label: 'Business cost per working hour',
        expr: 'annualExpenses / ((billableHours + unpaidHours) * weeksPerYear)',
        money: true,
      },
    ],
    notes: [
      'The tax rate used here is a reference value (October 2026). Income tax, social contributions and the way you are registered change the real number: check the official rules for your country and your tax status.',
      'Unpaid hours are the biggest hidden cost in freelancing. Ten hours a week on sales, admin and invoicing is a full month of work a year that never shows up in an invoice.',
      'Raise your rate when you raise your value, and raise it faster than your costs. A rate that only covers the previous year of expenses is a rate that makes you poorer every year.',
      'Projects with a fixed price and a deadline are usually better for cash flow than hourly work. Once you know your real hourly rate, use it as the floor when you quote a fixed price.',
    ],
    relatedGuides: ['how-to-set-your-freelance-rate', 'freelance-invoice-and-payment-basics', 'billable-hours-tracking'],
  },

  {
    slug: 'overtime-calculator',
    title: 'Overtime Calculator: The Real Cost of Extra Hours',
    description:
      'Calculate the cost of overtime at time-and-a-half, including the employer payroll taxes on the extra premium, and the effective hourly rate a week with overtime produces.',
    category: 'finance',
    badge: 'Time and a half',
    intro:
      'Overtime is not free for the business either. On top of the extra hours at the higher multiplier, the employer usually pays payroll taxes on the premium, and the effective hourly rate of the week goes up in a way that rarely matches what people expect. This calculator puts the full weekly and annual cost on the table.',
    fields: [
      { id: 'hourlyRate', label: 'Hourly rate (USD)', type: 'money', default: 25 },
      { id: 'regularHours', label: 'Regular hours per week', type: 'number', default: 40, min: 0, max: 80 },
      { id: 'overtimeHours', label: 'Overtime hours per week', type: 'number', default: 8, min: 0, max: 60 },
      {
        id: 'multiplier',
        label: 'Overtime multiplier (1.5 means time and a half)',
        type: 'number',
        default: 1.5,
        min: 1,
        max: 3,
        hint: 'Time and a half is the usual starting point for an hourly employee.',
      },
      { id: 'weeksPerYear', label: 'Weeks per year', type: 'number', default: 52, min: 1, max: 52 },
      {
        id: 'payrollTaxRate',
        label: 'Employer payroll taxes on overtime (%)',
        type: 'percent',
        default: 10,
        hint: 'Social Security, Medicare and unemployment taxes on the extra premium, roughly 10%.',
      },
    ],
    outputs: [
      { id: 'regularPay', label: 'Regular weekly pay', expr: 'hourlyRate * regularHours', money: true },
      {
        id: 'overtimePay',
        label: 'Weekly overtime pay',
        expr: 'hourlyRate * multiplier * overtimeHours',
        money: true,
      },
      {
        id: 'premium',
        label: 'Weekly overtime premium (the extra above straight time)',
        expr: 'hourlyRate * (multiplier - 1) * overtimeHours',
        money: true,
      },
      {
        id: 'weeklyTotal',
        label: 'Total weekly pay including overtime',
        expr: 'hourlyRate * regularHours + hourlyRate * multiplier * overtimeHours',
        money: true,
        highlight: true,
      },
      {
        id: 'annualPremium',
        label: 'Annual cost of the overtime premium',
        expr: 'hourlyRate * (multiplier - 1) * overtimeHours * weeksPerYear',
        money: true,
      },
      {
        id: 'employerCost',
        label: 'Annual employer cost, including payroll taxes',
        expr: '(hourlyRate * regularHours + hourlyRate * multiplier * overtimeHours) * weeksPerYear * (1 + payrollTaxRate / 100)',
        money: true,
      },
      {
        id: 'effectiveRate',
        label: 'Effective hourly rate in a week with overtime',
        expr: '(hourlyRate * regularHours + hourlyRate * multiplier * overtimeHours) / max(1, regularHours + overtimeHours)',
        money: true,
      },
      {
        id: 'costOfOneExtraHour',
        label: 'Employer cost of one extra hour, including payroll taxes',
        expr: 'hourlyRate * multiplier * (1 + payrollTaxRate / 100)',
        money: true,
      },
    ],
    notes: [
      'The payroll tax rate used here is a reference value (October 2026). Employer taxes differ by country, by state and by the size of the payroll. Check the official rate before you price an hour of overtime.',
      'The effective hourly rate only goes up by the multiplier when the overtime is paid at the premium. Someone on salary who works unpaid overtime gets a lower effective rate, which is the point where burnout starts.',
      'Overtime is often cheaper than hiring. One full-time extra worker carries payroll taxes, benefits and management time; the overtime premium usually does not.',
      'If overtime keeps appearing every month, the problem is capacity, not schedule. Adding a second part-time or contractor is usually cheaper than the premium pile-up.',
    ],
    relatedGuides: ['overtime-cost-for-small-business', 'labour-cost-planning', 'hourly-rate-and-margin'],
  },

  {
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator: How Many Units Cover Your Costs',
    description:
      'Find the break-even point for fixed costs, unit price and variable cost: the units and revenue needed to break even, plus the units needed for a target profit.',
    category: 'productivity',
    badge: 'Units and revenue',
    intro:
      'Break-even answers one question: how many sales do you need to stop losing money? Fixed costs stay the same no matter how much you sell, and each sale contributes the price minus the variable cost. The point where those two lines cross is the break-even point, and everything above it is your profit.',
    fields: [
      {
        id: 'fixedCosts',
        label: 'Fixed costs per month (rent, salaries, software, accounting)',
        type: 'money',
        default: 6000,
      },
      { id: 'price', label: 'Selling price per unit', type: 'money', default: 100 },
      {
        id: 'variableCost',
        label: 'Variable cost per unit (materials, payment fees, shipping)',
        type: 'money',
        default: 25,
      },
      { id: 'unitsSold', label: 'Units sold per month', type: 'number', default: 50, min: 0 },
      { id: 'targetProfit', label: 'Target monthly profit (USD)', type: 'money', default: 3000 },
    ],
    outputs: [
      {
        id: 'contribution',
        label: 'Contribution per unit (price minus variable cost)',
        expr: 'price - variableCost',
        money: true,
      },
      {
        id: 'breakEvenUnits',
        label: 'Break-even units per month',
        expr: 'ceil(fixedCosts / max(0.01, price - variableCost))',
        money: false,
        highlight: true,
      },
      {
        id: 'breakEvenRevenue',
        label: 'Break-even revenue per month',
        expr: 'ceil(fixedCosts / max(0.01, price - variableCost)) * price',
        money: true,
      },
      { id: 'currentRevenue', label: 'Current monthly revenue', expr: 'unitsSold * price', money: true },
      {
        id: 'currentProfit',
        label: 'Current monthly profit',
        expr: 'unitsSold * (price - variableCost) - fixedCosts',
        money: true,
      },
      {
        id: 'unitsForTarget',
        label: 'Units needed to reach the target profit',
        expr: 'ceil((fixedCosts + targetProfit) / max(0.01, price - variableCost))',
        money: false,
      },
      {
        id: 'marginOfSafety',
        label: 'Margin of safety',
        expr: '(unitsSold - ceil(fixedCosts / max(0.01, price - variableCost))) / max(1, unitsSold) * 100',
        money: false,
      },
    ],
    notes: [
      'Fixed costs are the ones you pay even in a month with no sales: rent, salaries, software, subscriptions. Variable costs grow with every unit sold.',
      'The break-even point assumes your price and your variable cost stay constant. The moment you discount to move faster stock, the break-even point moves up with it.',
      'A margin of safety below 20% means a small drop in sales puts you back under water. Below zero means you are already losing money before the month ends.',
      'The cost and price inputs are reference values (October 2026). Replace them with your own numbers: this model is only as good as the costs you feed it.',
    ],
    relatedGuides: ['break-even-analysis-guide', 'pricing-and-margin-basics', 'cost-structure-for-small-business'],
  },

  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator: Growth With Monthly Contributions',
    description:
      'Project how an initial amount plus monthly contributions grows with compound interest, adjusted for compounding frequency and inflation. Free and instant.',
    category: 'finance',
    badge: 'With monthly deposits',
    intro:
      'Compound interest is what makes time work for you: every period, the return is applied to the balance you already grew. This calculator projects an initial amount plus monthly contributions over the selected period, and then shows what that balance is worth after inflation, because a nominal return is not the same as money you can actually spend.',
    fields: [
      { id: 'initialAmount', label: 'Initial amount (USD)', type: 'money', default: 10000 },
      { id: 'monthlyContribution', label: 'Monthly contribution (USD)', type: 'money', default: 500 },
      {
        id: 'annualRate',
        label: 'Annual return rate (%)',
        type: 'percent',
        default: 7,
        hint: 'Nominal annual rate, before fees and taxes. Historical averages are not a promise.',
      },
      { id: 'years', label: 'Number of years', type: 'number', default: 20, min: 1, max: 60 },
      {
        id: 'compoundFrequency',
        label: 'Compounding frequency (times per year)',
        type: 'select',
        options: [
          { value: 1, label: 'Annually' },
          { value: 4, label: 'Quarterly' },
          { value: 12, label: 'Monthly' },
          { value: 365, label: 'Daily' },
        ],
        default: 12,
      },
      {
        id: 'inflationRate',
        label: 'Inflation rate per year (%)',
        type: 'percent',
        default: 2.5,
        hint: 'Used only to convert the final balance into today money.',
      },
    ],
    outputs: [
      {
        id: 'finalBalance',
        label: 'Final balance',
        expr:
          'initialAmount * (1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) + monthlyContribution * ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) - 1) / ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency / 12) - 1)',
        money: true,
        highlight: true,
      },
      {
        id: 'totalContributions',
        label: 'Total money you put in',
        expr: 'initialAmount + monthlyContribution * 12 * years',
        money: true,
      },
      {
        id: 'totalInterest',
        label: 'Interest earned',
        expr:
          'initialAmount * (1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) + monthlyContribution * ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) - 1) / ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency / 12) - 1) - initialAmount - monthlyContribution * 12 * years',
        money: true,
      },
      {
        id: 'principalOnly',
        label: 'What the initial amount alone would become',
        expr: 'initialAmount * (1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years)',
        money: true,
      },
      {
        id: 'realValue',
        label: 'Final balance in today money, after inflation',
        expr:
          '(initialAmount * (1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) + monthlyContribution * ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) - 1) / ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency / 12) - 1)) / (1 + inflationRate / 100) ^ years',
        money: true,
      },
      {
        id: 'shareFromInterest',
        label: 'Share of the final balance that comes from interest',
        expr:
          '(initialAmount * (1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) + monthlyContribution * ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) - 1) / ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency / 12) - 1) - initialAmount - monthlyContribution * 12 * years) / max(1, initialAmount * (1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) + monthlyContribution * ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency * years) - 1) / ((1 + max(annualRate, 0.01) / 100 / compoundFrequency) ^ (compoundFrequency / 12) - 1)) * 100',
        money: false,
      },
    ],
    notes: [
      'The return rate used here is a reference value (October 2026). Real returns change every year and no rate is guaranteed: check the official rate sheet and the fees of the product you are using.',
      'The projections ignore taxes, fund fees and inflation on the way, so treat the final balance as an upper bound and the inflation-adjusted line as the realistic one.',
      'More frequent compounding adds a little, but the amount you set aside every month and the number of years you stay invested matter far more than the difference between monthly and daily compounding.',
      'A rate of exactly 0% is treated as a minimal rate so the formula stays stable; the result is then the sum of your contributions.',
    ],
    relatedGuides: ['compound-interest-explained', 'emergency-fund-basics', 'index-investing-basics'],
  },

  {
    slug: 'budget-planner',
    title: 'Monthly Budget Planner: How Much Is Left and How Big an Emergency Fund Should Be',
    description:
      'Build a simple monthly budget, see how much is really left, and calculate the emergency fund target for six months of expenses plus the time it takes to save it.',
    category: 'productivity',
    badge: 'Six-month reserve',
    intro:
      'The budget almost nobody finishes is the one that starts with the net salary, not the gross one, and ends with what is actually left. This planner adds up the monthly commitments, shows the surplus, and turns it into an emergency fund target: six months of expenses is the usual rule for a salaried person with a stable income.',
    fields: [
      { id: 'netIncome', label: 'Net monthly income, after tax (USD)', type: 'money', default: 4000 },
      { id: 'housing', label: 'Housing: rent or mortgage (USD)', type: 'money', default: 1400 },
      { id: 'utilities', label: 'Utilities and internet (USD)', type: 'money', default: 300 },
      { id: 'food', label: 'Groceries and eating out (USD)', type: 'money', default: 600 },
      { id: 'transport', label: 'Transport and fuel (USD)', type: 'money', default: 250 },
      {
        id: 'subscriptions',
        label: 'Subscriptions, leisure and delivery (USD)',
        type: 'money',
        default: 300,
      },
      { id: 'debt', label: 'Loan and credit card payments (USD)', type: 'money', default: 400 },
    ],
    outputs: [
      {
        id: 'totalExpenses',
        label: 'Total monthly expenses',
        expr: 'housing + utilities + food + transport + subscriptions + debt',
        money: true,
      },
      {
        id: 'leftover',
        label: 'What is left each month',
        expr: 'netIncome - (housing + utilities + food + transport + subscriptions + debt)',
        money: true,
        highlight: true,
      },
      {
        id: 'committed',
        label: 'Share of the income already committed',
        expr: '(housing + utilities + food + transport + subscriptions + debt) / netIncome * 100',
        money: false,
      },
      {
        id: 'emergencyTarget',
        label: 'Emergency fund target (6 months of expenses)',
        expr: '(housing + utilities + food + transport + subscriptions + debt) * 6',
        money: true,
      },
      {
        id: 'monthsToEmergency',
        label: 'Months to reach the emergency fund at the current pace',
        expr: '(housing + utilities + food + transport + subscriptions + debt) * 6 / max(1, netIncome - (housing + utilities + food + transport + subscriptions + debt))',
        money: false,
      },
      {
        id: 'savingsRate',
        label: 'Savings rate',
        expr: '(netIncome - (housing + utilities + food + transport + subscriptions + debt)) / netIncome * 100',
        money: false,
      },
    ],
    notes: [
      'Use the net salary here, not the gross one. A 30% gap between the two is what turns a comfortable plan into a tight month.',
      'When the leftover is zero or negative, the emergency fund cannot be built from this budget. The number of months shown assumes at least a small surplus, so read it as "not funded yet" until the budget balances.',
      'An emergency fund of three to six months of expenses is what keeps an unexpected bill out of the credit card. Six months is the right target for a salaried person with a stable income, three for a household with two incomes.',
      'If the leftover is negative, the cheapest cut is not the grocery run: it is the subscriptions and the card instalments, which keep the same amount leaving the account for years.',
      'The categories and the six-month rule are reference guidelines (October 2026). Adjust the targets to your own situation: the rule only works if you can actually reach it.',
    ],
    relatedGuides: ['monthly-budget-template', 'how-to-build-an-emergency-fund', 'cutting-household-costs'],
  },

  {
    slug: 'saas-unit-economics',
    title: 'SaaS Unit Economics Calculator: CAC, LTV and Payback',
    description:
      'Calculate CAC, LTV, the LTV to CAC ratio and the CAC payback period for your SaaS, plus the revenue impact of monthly churn.',
    category: 'productivity',
    badge: 'CAC, LTV, payback',
    intro:
      'Unit economics tell you whether a SaaS business works before the board asks. CAC is what you pay to win a customer, LTV is what that customer leaves behind, and payback is how long you wait for the money to come back. When LTV divided by CAC drops below three, or payback passes a year, growth starts consuming cash instead of creating it.',
    fields: [
      { id: 'price', label: 'Monthly subscription price (USD)', type: 'money', default: 49 },
      { id: 'grossMargin', label: 'Gross margin (%)', type: 'percent', default: 80 },
      {
        id: 'marketingSpend',
        label: 'Monthly sales and marketing spend (USD)',
        type: 'money',
        default: 12000,
        hint: 'Include salaries, ads and tools, not just media spend.',
      },
      {
        id: 'newCustomers',
        label: 'New customers acquired per month',
        type: 'number',
        default: 60,
        min: 1,
      },
      { id: 'churnRate', label: 'Monthly churn rate (%)', type: 'percent', default: 4 },
      { id: 'customers', label: 'Current customers', type: 'number', default: 500, min: 0 },
    ],
    outputs: [
      {
        id: 'cac',
        label: 'Customer acquisition cost (CAC)',
        expr: 'marketingSpend / max(1, newCustomers)',
        money: true,
      },
      { id: 'arpu', label: 'Average revenue per account (ARPU)', expr: 'price', money: true },
      {
        id: 'grossProfit',
        label: 'Gross profit per customer per month',
        expr: 'price * grossMargin / 100',
        money: true,
      },
      {
        id: 'ltv',
        label: 'Lifetime value (LTV)',
        expr: 'price * grossMargin / 100 / max(0.005, churnRate / 100)',
        money: true,
      },
      {
        id: 'ltvCac',
        label: 'LTV to CAC ratio',
        expr:
          '(price * grossMargin / 100 / max(0.005, churnRate / 100)) / max(1, marketingSpend / max(1, newCustomers))',
        money: false,
        highlight: true,
      },
      {
        id: 'payback',
        label: 'CAC payback period (months)',
        expr: 'marketingSpend / max(1, newCustomers) / max(1, price * grossMargin / 100)',
        money: false,
      },
      { id: 'mrr', label: 'Monthly recurring revenue (MRR)', expr: 'customers * price', money: true },
      {
        id: 'churnedCustomers',
        label: 'Customers lost per month',
        expr: 'customers * churnRate / 100',
        money: false,
      },
      {
        id: 'netNewCustomers',
        label: 'Net new customers per month',
        expr: 'newCustomers - customers * churnRate / 100',
        money: false,
      },
      {
        id: 'churnCost',
        label: 'Revenue lost to churn per month',
        expr: 'customers * churnRate / 100 * price',
        money: true,
        hidden: true,
      },
    ],
    notes: [
      'The benchmarks used here (LTV to CAC above 3, payback under 12 months) are reference guidelines (October 2026). What counts as healthy depends on your contract length, your churn rate and how much cash you have.',
      'LTV assumes the churn rate stays constant for the whole customer lifetime and that the price does not change. Both assumptions break in a growing company, which is why it is an estimate and not a promise.',
      'CAC that only counts media spend is not CAC. Include the people who sell, the tools they use and the time onboarding takes, otherwise the ratio looks better than the business is.',
      'Churn is usually the cheapest lever: a five point drop in monthly churn is often worth more than a five point drop in CAC, and it does not cost a cent of extra acquisition spend.',
    ],
    relatedGuides: ['saas-unit-economics-guide', 'cac-and-ltv-explained', 'saas-retention-and-churn'],
  },
];

export default calculatorsEn;
