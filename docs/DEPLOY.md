# Deploy — Yooka

Site estático: HTML gerado no build, servido pela Vercel (grátis) ou qualquer
CDN. Não há runtime, não há banco, não há custo de servidor.

## 1. Build local

```bash
npm ci
npm run build        # build + gera as imagens OG (precisa do Chrome)
npm run build:fast   # só o HTML (usado na Vercel)
```

Saída em `public/`. Sirva localmente para conferir:

```bash
npm run dev          # http://localhost:4321
```

## 2. Publicar na Vercel

O projeto já tem `vercel.json` com `outputDirectory: public` e
`buildCommand: npm run build:fast`.

```bash
vercel link --yes --project yooka --scope loyfus
vercel deploy --prod
```

Depois do primeiro deploy, conecte o GitHub para deploy automático a cada push:

```bash
vercel git connect https://github.com/loyfus/yooka
```

## 3. Domínio

O domínio ideal é `yooka.com.br`. O registro é da `.com.br` (registro.br, ~R$ 40/ano)
e a zone está no Cloudflare (mesma zone da `/ferramentas/`).

Opções, da mais rápida para a mais correta:

| Opção | URL | Tempo |
|---|---|---|
| Subdomínio Vercel | `yooka.vercel.app` (ou `yooka-*.vercel.app`) | imediato |
| Subdomínio próprio | `yooka.yooka.online` | ~10 min |
| Domínio próprio | `yooka.com.br` | ~1 dia (registro + DNS) |

**Subdomínio próprio (recomendado enquanto o domínio não sai):**

1. Na Vercel: `vercel domains add yooka.yooka.online loyfus` (ou pelo dashboard).
2. No Cloudflare (zone `/ferramentas/`), adicione o registro que a Vercel mostrar
   (normalmente `CNAME yooka → cname.vercel-dns.com`).
3. O certificado HTTPS é emitido automaticamente pela Vercel.

**Quando `yooka.com.br` for registrado:** adicione o domínio na Vercel, aponte o
CNAME no Cloudflare e preserve a origem com `SITE_URL=https://yooka.com.br` no
build. Faça o corte com 301, nunca com redirecionamento 302, e mantenha o
antigo subdomínio apontando para o novo.

## 4. Variáveis de ambiente

| Variável | Onde | Para quê |
|---|---|---|
| `SITE_URL` | build (Vercel: Settings → Env) | URL canônica e no sitemap. **Troque para o domínio final antes de indexar.** |
| `ADSENSE_CLIENT` | build | ID do AdSense (`ca-pub-...`). Sem isso, os slots mostram um placeholder. |
| `INDEXNOW_KEY` | GitHub Actions (secret) | Chave do IndexNow para o Bing indexar rápido. |

## 5. Indexação

1. **Google Search Console** — adicione a propriedade, valide com a tag HTML
   ou o arquivo de verificação, e envie `sitemap.xml`.
2. **Bing Webmaster Tools** — importe do GSC (um clique) e use o IndexNow.
3. **IndexNow** — a chave já foi gerada e publicada na raiz do site
   (`/.indexnow-key` no repositório + `public/<chave>.txt` no build). Falta
   **uma ação sua, no Bing**:

   1. Entre em `bing.com/webmasters` e adicione o site
      (`yooka.online`, ou `yooka.yooka.online` enquanto o DNS não propaga).
   2. Em **IndexNow → Gerenciar chaves**, cole a chave abaixo e salve:
      ```
      6a5236b8e3e73ccdc92d7a32b86b3ab7
      ```
   3. Pronto. A Action `.github/workflows/indexnow.yml` envia todas as URLs do
      sitemap todo dia às 03:20 UTC.

   Sem essa verificação o Bing responde `403 SiteVerificationNotCompleted` —
   é o único passo que depende de conta externa. Para conferir o resultado:
   `npm run indexnow` (a chave vem do arquivo `.indexnow-key`, que não vai para
   o git).

## 6. Checklist antes de anunciar o site

- [ ] `SITE_URL` aponta para o domínio final
- [ ] `ADSENSE_CLIENT` configurado (ou os placeholders removidos)
- [ ] `ads.txt` publicado na raiz e validado no AdSense
- [ ] `robots.txt` permite bots de IA e bloqueia `/busca/`
- [ ] `sitemap.xml` listado no GSC
- [ ] Imagens OG geradas para todas as páginas
- [ ] Um artigo e um comparativo abertos no celular e no 4G (velocidade)
