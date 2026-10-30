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

/** Faixas do DAS do MEI (referência: outubro de 2026). */
export const DAS_FAIXAS = [
  { min: 0, max: 18000, rate: 0.05, ded: 828.4, label: 'Até R$ 18.000/ano' },
  { min: 18000, max: 29850, rate: 0.04, ded: 1087.8, label: 'De R$ 18.001 a R$ 29.850/ano' },
  { min: 29850, max: 41850, rate: 0.03, ded: 1113.9, label: 'De R$ 29.851 a R$ 41.850/ano' },
  { min: 41850, max: 53850, rate: 0.02, ded: 900.0, label: 'De R$ 41.851 a R$ 53.850/ano' },
  { min: 53850, max: 66000, rate: 0.015, ded: 777.6, label: 'De R$ 53.851 a R$ 66.000/ano' },
  { min: 66000, max: 78000, rate: 0.01, ded: 532.2, label: 'De R$ 66.001 a R$ 78.000/ano' },
  { min: 78000, max: 81000, rate: 0.006, ded: 232.8, label: 'De R$ 78.001 a R$ 81.000/ano' },
];

export function dasAnual(faturamento) {
  const f = Math.max(0, Number(faturamento) || 0);
  const faixa = DAS_FAIXAS.find((x) => f <= x.max) || DAS_FAIXAS[DAS_FAIXAS.length - 1];
  const valor = Math.max(71.6, f * faixa.rate - faixa.ded);
  return { mensal: valor / 12, anual: valor, faixa };
}

export function dasMensalProporcional(faturamento, meses) {
  const { mensal } = dasAnual(faturamento);
  return (mensal * Math.max(1, Math.min(12, Number(meses) || 12))) / 12;
}

export function percentualDas(faturamento, meses) {
  const f = Math.max(1, Number(faturamento) || 1);
  return (dasMensalProporcional(f, meses) * 12 * f) / f / f;
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
        value = dasAnual(v[o.field]).mensal;
        break;
      case 'dasProporcional':
        value = dasMensalProporcional(v[o.field], v.meses);
        break;
      case 'percentualDas':
        value = (dasMensalProporcional(v[o.field], v.meses) / Math.max(1, v[o.field])) * 100;
        break;
      case 'faixa': {
        const f = Number(v[o.field]) || 0;
        const row = (o.rows || []).find((r) => f <= r.max) || o.rows[o.rows.length - 1];
        value = row ? row.value : 0;
        out[`${o.id}__label`] = row ? row.label : '';
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
