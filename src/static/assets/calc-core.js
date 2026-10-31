/**
 * Núcleo de cálculo das calculadoras.
 * Importado tanto pelo build (Node) quanto pelo navegador (módulo ES),
 * para que o resultado pré-calculado e o resultado dinâmico usem a mesma
 * fórmula.
 */
import { evalExpr } from './expr.js';

/** Tabela progressiva do INSS (salário de referência em outubro de 2026). */
export function inss(base) {
  const b = Math.max(0, Number(base) || 0);
  const faixa = (teto, piso, aliq) => Math.max(0, Math.min(b, teto) - piso) * aliq;
  return (
    faixa(1621.0, 0, 0) +
    faixa(2507.0, 1621.0, 0.075) +
    faixa(3643.5, 2507.0, 0.09) +
    faixa(7786.02, 3643.5, 0.12) +
    Math.max(0, b - 7786.02) * 0.14
  );
}

/** IRRF mensal pela tabela progressiva com dedução simplificada (referência: outubro de 2026). */
export function irrf(base, deducao = 528) {
  const b = Math.max(0, (Number(base) || 0) - deducao);
  const faixa = (teto, piso, aliq) => Math.max(0, Math.min(b, teto) - piso) * aliq;
  return (
    faixa(2428.0, 0, 0) +
    faixa(2826.65, 2428.0, 0.075) +
    faixa(3751.05, 2826.65, 0.15) +
    faixa(4664.68, 3751.05, 0.22) +
    Math.max(0, b - 4664.68) * 0.275
  );
}

/**
 * Faixas do DAS do MEI (referência: outubro de 2026).
 * O DAS oficial é um VALOR FIXO por faixa de receita bruta anual — não é
 * uma alíquota sobre o faturamento. Errar isso muda o número por um fator
 * de 20, então a tabela é usada na íntegra.
 */
export const DAS_FAIXAS = [
  { min: 0, max: 18000, mensal: 71.6, label: 'Até R$ 18.000/ano' },
  { min: 18000, max: 29850, mensal: 106.2, label: 'De R$ 18.001 a R$ 29.850/ano' },
  { min: 29850, max: 41850, mensal: 141.6, label: 'De R$ 29.851 a R$ 41.850/ano' },
  { min: 41850, max: 53850, mensal: 177.0, label: 'De R$ 41.851 a R$ 53.850/ano' },
  { min: 53850, max: 66000, mensal: 212.4, label: 'De R$ 53.851 a R$ 66.000/ano' },
  { min: 66000, max: 78000, mensal: 247.8, label: 'De R$ 66.001 a R$ 78.000/ano' },
  { min: 78000, max: 81000, mensal: 253.2, label: 'De R$ 78.001 a R$ 81.000/ano' },
];

/**
 * Calcula o DAS a partir do faturamento e dos meses de atividade.
 * A faixa é definida pela receita anual projetada; o valor do mês é o fixo
 * da faixa, proporcional aos meses declarados.
 */
export function dasInfo(faturamento, meses = 12) {
  const m = Math.max(1, Math.min(12, Number(meses) || 12));
  const receita = Math.max(0, Number(faturamento) || 0);
  const projetado = receita * (12 / m);
  const faixa = DAS_FAIXAS.find((x) => projetado <= x.max) || DAS_FAIXAS[DAS_FAIXAS.length - 1];
  return {
    faixa,
    projetado,
    cheio: faixa.mensal,
    proporcional: faixa.mensal * (m / 12),
    anual: faixa.mensal * 12,
  };
}

export function dasMensalProporcional(faturamento, meses) {
  return dasInfo(faturamento, meses).proporcional;
}

export function percentualDas(faturamento, meses) {
  const info = dasInfo(faturamento, meses);
  const base = Math.max(1, info.projetado);
  // (DAS do ano ÷ receita anual projetada) × 100
  return ((info.cheio * 12) / base) * 100;
}

/** Calcula todos os outputs de uma calculadora para um conjunto de valores. */
export function computeOutputs(calc, values) {
  const v = { ...values };
  const out = {};

  for (const o of calc.outputs) {
    if (o.hidden) continue;
    let value = 0;

    switch (o.kind) {
      case 'inss':
        value = inss(evalExpr(o.base, v));
        break;
      case 'irrf':
        value = irrf(evalExpr(o.base, v), Number(v.deducaoIrpf) || 528);
        break;
      case 'das':
        value = dasInfo(v[o.field], v.meses).cheio;
        break;
      case 'dasAnual':
        value = dasInfo(v[o.field], v.meses).anual;
        break;
      case 'dasProporcional':
        value = dasInfo(v[o.field], v.meses).proporcional;
        break;
      case 'percentualDas':
        value = percentualDas(v[o.field], v.meses);
        break;
      case 'faixa': {
        const info = dasInfo(v[o.field], v.meses);
        value = info.cheio;
        out[`${o.id}__label`] = `${info.faixa.label} — projetado R$ ${Math.round(info.projetado).toLocaleString('pt-BR')}/ano`;
        break;
      }
      case 'final': {
        const base = evalExpr(o.base, v);
        let total = base;
        if (o.inss) total -= inss(base);
        if (o.irrf) total -= irrf(base, Number(v.deducaoIrpf) || 528);
        if (o.outros) total -= Number(v.outros) || 0;
        value = total;
        break;
      }
      case 'descontoSalarial': {
        const base = evalExpr(o.base, v);
        value = ((inss(base) + irrf(base, Number(v.deducaoIrpf) || 528)) / Math.max(1, base)) * 100;
        break;
      }
      default:
        value = evalExpr(o.expr, v);
    }

    out[o.id] = value;
  }

  return out;
}

export default computeOutputs;
