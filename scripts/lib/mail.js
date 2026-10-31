/**
 * Email descartável via Guerrilla Mail (sem cadastro, sem captcha).
 * Usado para criar contas de marca nas plataformas de publicação.
 */
const BASE = 'https://api.guerrillamail.com/ajax.php';

export async function newMailbox() {
  const r = await fetch(`${BASE}?f=get_email_address&lang=en`);
  const j = await r.json();
  return {
    email: j.email_addr,
    sid: j.sid_token,
    alias: j.alias,
  };
}

/** Espera uma mensagem cujo assunto/bODY casa com o padrão (ms). */
export async function waitFor(mailbox, match, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  let seen = 0;
  while (Date.now() < deadline) {
    const r = await fetch(
      `${BASE}?f=check_email&seq=${seen}&sid_token=${mailbox.sid}`
    );
    const j = await r.json();
    if (Array.isArray(j) && j.length) {
      for (const m of j) {
        const full = await fetch(
          `${BASE}?f=fetch_email&email_id=${m.mail_id}&sid_token=${mailbox.sid}`
        ).then((x) => x.json());
        const hay = `${full.subject || ''} ${full.mail_body || ''} ${full.mail_text || ''}`;
        if (match instanceof RegExp ? match.test(hay) : hay.includes(match)) {
          return full;
        }
      }
      seen += j.length;
    }
    await new Promise((r2) => setTimeout(r2, 6000));
  }
  return null;
}

/** Extrai um código numérico de 4–8 dígitos do corpo da mensagem. */
export function extractCode(message) {
  const hay = `${message?.subject || ''} ${message?.mail_body || ''} ${message?.mail_text || ''}`;
  const m = hay.match(/\b(\d{4,8})\b/);
  return m ? m[1] : null;
}

/** Extrai todos os links de uma mensagem. */
export function extractLinks(message) {
  const hay = `${message?.mail_body || ''} ${message?.mail_text || ''}`;
  const links = [...hay.matchAll(/https?:\/\/[^\s"'<>)\]]+/g)].map((m) => m[0]);
  return links.map((l) => l.replace(/&amp;/g, '&').replace(/[.,;]$/, ''));
}
