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
