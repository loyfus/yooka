/** Cliente mínimo do Chrome DevTools Protocol, sem dependências. */
import fs from 'node:fs';
import path from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class Session {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`timeout em ${method}`));
        }
      }, 45000);
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text || 'erro no JS da página');
    return res.result?.value;
  }

  async goto(url, wait = 3500) {
    await this.send('Page.navigate', { url });
    await sleep(wait);
  }
}

export async function newSession(port, url = 'about:blank') {
  const res = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  const target = await res.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', () => reject(new Error('Falha ao conectar no navegador.')));
  });
  const session = new Session(ws);
  await session.send('Page.enable');
  await session.send('Runtime.enable');
  return session;
}

export async function attachSession(port, match = '') {
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
  const pages = targets.filter((t) => t.type === 'page');
  const target = pages.find((t) => (t.url || '').includes(match)) || pages[0];
  if (!target) throw new Error('Nenhuma aba encontrada no navegador.');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', () => reject(new Error('Falha ao conectar no navegador.')));
  });
  const session = new Session(ws);
  await session.send('Page.enable');
  await session.send('Runtime.enable');
  return session;
}

export function portFromProfile(profileDir) {
  const f = path.join(profileDir, 'DevToolsActivePort');
  if (!fs.existsSync(f)) return null;
  const port = parseInt(fs.readFileSync(f, 'utf8').split('\n')[0], 10);
  return Number.isFinite(port) ? port : null;
}

/** Clique real (evento de mouse) no centro do elemento — funciona em React. */
Session.prototype.clickSelector = async function (selector) {
  const box = await this.evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);
  if (!box) return false;
  await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y });
  await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  return true;
};

/** Clique real no elemento cujo texto casa com o padrão. */
Session.prototype.clickText = async function (re, opts = {}) {
  const box = await this.evaluate(`(() => {
    const re = ${re.toString()};
    const els = [...document.querySelectorAll(${JSON.stringify(opts.selector || 'button,a,[role="menuitem"],[role="option"],div')})];
    const el = els.find(e => e.offsetParent !== null && re.test((e.innerText || '').trim()) && (e.innerText || '').trim().length < 60);
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);
  if (!box) return false;
  await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y });
  await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  return true;
};

/** Escreve em um input e dispara os eventos que o React espera. */
Session.prototype.type = async function (selector, value) {
  const ok = await this.evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    el.focus();
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  return ok;
};

/** Envia um arquivo para um input[type=file]. */
Session.prototype.setFile = async function (selector, files) {
  await this.send('DOM.enable').catch(() => {});
  const doc = await this.send('DOM.getDocument', { depth: -1 });
  const { nodeId } = await this.send('DOM.querySelector', { nodeId: doc.root.nodeId, selector });
  if (!nodeId) return false;
  await this.send('DOM.setFileInputFiles', { files, nodeId });
  return true;
};

/** Digitação real: foca o campo (clique) e insere texto pelo teclado. */
Session.prototype.fillReal = async function (selector, value) {
  const box = await this.evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);
  if (!box) return false;
  await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await sleep(250);
  await this.send('Input.insertText', { text: String(value) });
  await sleep(250);
  // Tab dispara a validação do campo
  await this.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab' });
  await this.send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 9, key: 'Tab', code: 'Tab' });
  await sleep(350);
  return true;
};

/** Seleciona a primeira opção que casa com o texto. */
Session.prototype.pickOption = async function (re) {
  const box = await this.evaluate(`(() => {
    const re = ${re.toString()};
    const els = [...document.querySelectorAll('[role="option"],[role="radio"],li,button,div')];
    const el = els.find(e => e.offsetParent !== null && re.test((e.innerText || '').trim()) && (e.innerText || '').trim().length < 50);
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);
  if (!box) return false;
  await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  return true;
};
