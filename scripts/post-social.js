/**
 * Autopostador — publica os posts de `src/content/social-posts.json` em
 * LinkedIn e X usando a sessão do Chrome via CDP (DevTools Protocol).
 *
 * Como usar:
 *   1) abra o Chrome com o perfil onde você está logado:
 *        google-chrome --user-data-dir=/tmp/yooka-chrome --remote-debugging-port=9222
 *      (a janela já pode estar aberta — este script apenas conecta nela)
 *   2) entre no LinkedIn e no X nessa janela
 *   3) node scripts/post-social.js linkedin
 *      node scripts/post-social.js x
 *
 * Sem sessão logada, o script avisa e sai — não publica nada pela metade.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CDP_PORT = process.env.CDP_PORT || 9222;
const PLATFORM = process.argv[2] || 'linkedin';
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/social-posts.json'), 'utf8'));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------- CDP base */
async function httpJson(pathname) {
  const res = await fetch(`http://127.0.0.1:${CDP_PORT}${pathname}`);
  return res.json();
}

class Session {
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

  async goto(url) {
    await this.send('Page.navigate', { url });
    await sleep(3500);
  }
}

async function openSession() {
  const version = await httpJson('/json/version').catch(() => null);
  if (!version) {
    throw new Error(
      `Navegador não encontrado na porta ${CDP_PORT}.\n` +
        `Abra com: google-chrome --user-data-dir=/tmp/yooka-chrome --remote-debugging-port=${CDP_PORT}`
    );
  }
  const targets = await httpJson('/json/list');
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error('Nenhuma aba aberta no navegador.');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', () => reject(new Error('Falha ao conectar no navegador.')));
  });
  const session = new Session(ws);
  await session.send('Page.enable');
  await session.send('Runtime.enable');
  return session;
}

/* ------------------------------------------------- LinkedIn: publicar post */
const LINKEDIN_COMPOSER = `(() => {
  const btn = [...document.querySelectorAll('button')]
    .find(b => /start a post|iniciar publicação|começar publicação/i.test(b.innerText || b.getAttribute('aria-label') || ''));
  return !!btn;
})()`;

async function publishLinkedIn(session, text) {
  await session.goto('https://www.linkedin.com/feed/');
  await sleep(2500);

  const logged = await session.evaluate(
    `(() => {
      const t = document.body.innerText || '';
      return t.includes('Entrar') && !t.includes('Publicar') ? 'off' : (t.includes('Publicar') ? 'on' : 'off');
    })()`
  );
  if (logged !== 'on') {
    throw new Error('Sessão do LinkedIn não está ativa nessa janela.');
  }

  // Abre o compositor.
  await session.evaluate(`(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => /start a post|iniciar publicação|começar publicação/i.test(b.innerText || b.getAttribute('aria-label') || ''));
    if (btn) btn.click();
    return true;
  })()`);
  await sleep(2500);

  // Preenche o campo (React exige setter nativo + evento input).
  const escaped = JSON.stringify(text);
  const ok = await session.evaluate(`(() => {
    const el = document.querySelector('div[contenteditable="true"][role="textbox"]') ||
               document.querySelector('div[contenteditable="true"]');
    if (!el) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLDivElement.prototype, 'innerText')?.set ||
                   Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerText')?.set;
    if (setter) setter.call(el, ${escaped});
    else el.innerText = ${escaped};
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.focus();
    return true;
  })()`);
  if (!ok) throw new Error('Campo de texto do LinkedIn não encontrado.');
  await sleep(1500);

  // Clica em publicar.
  const published = await session.evaluate(`(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => /^publicar$|^post$/i.test((b.innerText || '').trim()));
    if (!btn || btn.disabled) return false;
    btn.click();
    return true;
  })()`);
  if (!published) throw new Error('Botão "Publicar" não disponível (texto vazio ou limite do LinkedIn).');
}

/* ------------------------------------------------------- X: publicar post */
async function publishX(session, text) {
  await session.goto('https://x.com/compose/post');
  await sleep(3500);

  const logged = await session.evaluate(
    `(() => { const t = document.body.innerText || ''; return t.includes('Entrar') || t.includes('Log in') ? 'off' : 'on'; })()`
  );
  if (logged !== 'on') throw new Error('Sessão do X não está ativa nessa janela.');

  const escaped = JSON.stringify(text);
  const ok = await session.evaluate(`(() => {
    const el = document.querySelector('div[contenteditable="true"][data-contents="true"]') ||
               document.querySelector('div[contenteditable="true"]');
    if (!el) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerText')?.set;
    if (setter) setter.call(el, ${escaped});
    else el.innerText = ${escaped};
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
    return true;
  })()`);
  if (!ok) throw new Error('Campo de texto do X não encontrado.');
  await sleep(1200);

  const published = await session.evaluate(`(() => {
    const btn = [...document.querySelectorAll('[data-testid="tweetButton"]')].find(b => !b.disabled);
    if (!btn) return false;
    btn.click();
    return true;
  })()`);
  if (!published) throw new Error('Botão de publicar do X não disponível.');
}

/* ----------------------------------------------------------------- main */
(async () => {
  const list = posts[PLATFORM];
  if (!list) {
    console.error(`Plataforma "${PLATFORM}" não existe. Use: linkedin | x`);
    process.exit(1);
  }

  let session;
  try {
    session = await openSession();
  } catch (e) {
    console.error(`\n  ${e.message}\n`);
    process.exit(2);
  }

  console.log(`\n  Publicando ${list.length} posts no ${PLATFORM}…\n`);

  for (const post of list) {
    try {
      if (PLATFORM === 'linkedin') await publishLinkedIn(session, post.text);
      else await publishX(session, post.text);
      console.log(`  ✓ ${post.id}`);
      await sleep(post.waitAfter || 10000);
    } catch (e) {
      console.error(`  ✗ ${post.id}: ${e.message}`);
      break;
    }
  }

  console.log(`\n  Pronto. Confira a página no navegador.\n`);
  process.exit(0);
})();
