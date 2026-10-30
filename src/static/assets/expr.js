/**
 * Avaliador de expressões aritméticas seguro.
 * Usado no build (Node) e no navegador (módulo ES).
 * Aceita: números, + - * / % ^, parênteses, variáveis e funções
 * min, max, floor, ceil, abs, round.
 */
const FUNCTIONS = {
  min: Math.min,
  max: Math.max,
  floor: Math.floor,
  ceil: Math.ceil,
  abs: Math.abs,
  round: Math.round,
};

export function evalExpr(expr, vars = {}) {
  const src = String(expr);
  let i = 0;

  const ws = () => {
    while (i < src.length && /\s/.test(src[i])) i++;
  };

  const parseExpr = () => {
    let left = parseTerm();
    for (;;) {
      ws();
      const c = src[i];
      if (c === '+' || c === '-') {
        i++;
        const right = parseTerm();
        left = c === '+' ? left + right : left - right;
      } else {
        return left;
      }
    }
  };

  const parseTerm = () => {
    let left = parseFactor();
    for (;;) {
      ws();
      if (src[i] === '*' || src[i] === '/' || src[i] === '%') {
        const op = src[i++];
        const right = parseFactor();
        left = op === '*' ? left * right : op === '/' ? left / right : left % right;
      } else {
        return left;
      }
    }
  };

  const parseFactor = () => {
    ws();
    let base;

    if (src[i] === '(') {
      i++;
      base = parseExpr();
      ws();
      if (src[i] === ')') i++;
    } else if (src[i] === '-') {
      i++;
      base = -parseFactor();
    } else if (src[i] === '+') {
      i++;
      base = parseFactor();
    } else {
      const numMatch = /^\d+(\.\d+)?/.exec(src.slice(i));
      if (numMatch) {
        i += numMatch[0].length;
        base = parseFloat(numMatch[0]);
      } else {
        const idMatch = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(src.slice(i));
        if (!idMatch) throw new Error(`Expressão inválida em "${expr}" (posição ${i})`);
        i += idMatch[0].length;
        const name = idMatch[0];
        ws();
        if (src[i] === '(') {
          i++;
          const args = [];
          ws();
          if (src[i] !== ')') {
            for (;;) {
              args.push(parseExpr());
              ws();
              if (src[i] === ',') {
                i++;
                continue;
              }
              break;
            }
          }
          ws();
          if (src[i] === ')') i++;
          const fn = FUNCTIONS[name];
          if (!fn) throw new Error(`Função desconhecida: ${name}`);
          base = fn(...args);
        } else {
          const v = vars[name];
          if (v === undefined) throw new Error(`Variável desconhecida: ${name}`);
          base = Number(v) || 0;
        }
      }
    }

    // Expoente: liga mais forte que multiplicação e é associativo à direita.
    ws();
    if (src[i] === '^') {
      i++;
      return Math.pow(base, parseFactor());
    }
    return base;
  };

  const result = parseExpr();
  if (Number.isNaN(result) || !Number.isFinite(result)) return 0;
  return result;
}

export default evalExpr;
