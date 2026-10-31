/**
 * Calculadora: recalcula os resultados enquanto o reader mexe nos campos.
 * O resultado inicial já vem pronto no HTML (build), então a página funciona
 * mesmo com JavaScript desativado.
 */
import { computeOutputs } from '/assets/calc-core.js';

const dataEl = document.getElementById('calc-data');
const root = document.getElementById('calc');
if (dataEl && root) {
  let calc;
  try {
    calc = JSON.parse(dataEl.textContent);
  } catch (e) {
    calc = null;
  }

  if (calc) {
    const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

    const inputs = [...root.querySelectorAll('[data-field]')];

    // Link compartilhado com os valores já preenchidos (?salario=3000&meses=12).
    const params = new URLSearchParams(window.location.search);
    for (const input of inputs) {
      const key = input.dataset.field;
      if (params.has(key)) {
        const v = Number(params.get(key));
        if (!Number.isNaN(v)) input.value = String(v);
      }
    }

    const currentUrl = () => {
      const p = new URLSearchParams();
      for (const input of inputs) {
        const v = Number(input.value);
        if (!Number.isNaN(v) && String(v) !== '') p.set(input.dataset.field, String(v));
      }
      const q = p.toString();
      return window.location.origin + window.location.pathname + (q ? '?' + q : '');
    };

    const render = () => {
      const values = {};
      for (const input of inputs) {
        const raw = input.value;
        values[input.dataset.field] = input.type === 'number' || input.type === 'text' ? Number(raw) : Number(raw);
      }
      const out = computeOutputs(calc, values);

      for (const o of calc.outputs) {
        if (o.hidden) continue;
        const el = root.querySelector(`[data-out="${o.id}"]`);
        if (!el) continue;
        const value = out[o.id] || 0;
        el.textContent = o.money ? money.format(value) : number.format(value);
        if (o.id.endsWith('__label')) continue;
      }

      const labelEl = root.querySelector('[data-out="faixa__label"]');
      if (labelEl && out.faixa__label) labelEl.textContent = out.faixa__label;

      // resultado principal em destaque
      const main = calc.outputs.find((o) => o.highlight);
      if (main) {
        const mainEl = root.querySelector('[data-out-main]');
        if (mainEl) {
          const value = out[main.id] || 0;
          mainEl.textContent = main.money ? money.format(value) : number.format(value);
        }
      }
    };

    for (const input of inputs) {
      input.addEventListener('input', render);
      input.addEventListener('change', render);
    }
    render();

    // Botão "compartilhar resultado": monta o link com os valores atuais.
    const shareBtn = root.querySelector('[data-share-result]');
    if (shareBtn) {
      shareBtn.addEventListener('click', async function () {
        const url = currentUrl();
        const text = calc.title;
        const wa = `https://wa.me/?text=${encodeURIComponent(text + ' — ' + url)}`;
        const target = window.open(wa, '_blank', 'noopener');
        if (!target) window.location.href = wa;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).catch(() => {});
        }
      });
    }
  }
}
