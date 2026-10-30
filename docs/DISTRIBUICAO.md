# Plano de distribuição — as primeiras 72 horas

O site está no ar em **https://yooka.loyfus.com.br** (vira `https://yooka.online`
assim que o DNS propagar). SEO é lento: os primeiros dias de tráfego orgânico
real vêm de **distribuição manual**, não de ranking.

Este documento tem o texto pronto para copiar e colar. A regra de ouro em
todos os canais: **entregue conteúdo útil no post e o link vai junto**. Post
que é só link éignorado pelo Reddit, pelo LinkedIn e pelos grupos.

---

## 1. Ordem de ataque (faça nesta ordem)

| # | Canal | Esforço | Views previstas (24h) |
|---|---|---|---|
| 1 | LinkedIn (pessoal + empresa Loyfus) | 20 min | 300–2.000 |
| 2 | WhatsApp (contatos, grupos de clientes) | 20 min | 200–800 |
| 3 | Reddit (3 subreddits) | 30 min | 500–5.000 |
| 4 | X/Twitter (thread + replies em contas do nicho) | 30 min | 200–1.500 |
| 5 | Telegram (grupos de IA/negócio) | 20 min | 100–600 |
| 6 | Facebook (grupos) | 20 min | 100–500 |
| 7 | Pinterest (10 pins) | 40 min | 50–300/dia, crescente |
| 8 | YouTube Shorts / Reels (3 vídeos de 45s) | 90 min | 500–5.000 |
| 9 | Medium / dev.to / Quora | 45 min | 100–400 |
| 10 | Newsletter (Beehiiv/Substack) | 30 min | 50–200 |

**Meta das primeiras 72h: 5.000–15.000 visits.** Meta de 30 dias: 50.000+.

---

## 2. LinkedIn — post principal

> **Post 1 (pessoal, storytelling)**
>
> Em 2024, uma empresa de logística de Joinville gastava R$ 14 mil por mês com
> 3 pessoas só para responder e-mail de cliente. Hoje o mesmo volume é
> processado por um agente que responde em 40 segundos e sobe para uma pessoa
> quando o caso éamalha judicial.
>
> Não foi "IA mágica". Foi processo, integração e critério.
>
> Escrevemos um guia de 2.300 palavras sobre como fazer isso sem virar
> gambiarra: o que automatizar primeiro, o que não automatizar, quanto custa por
> tarefa e o que dá errado em 90% das implementações.
>
> Link nos comentários. Se for útil, compartilhe com quem ainda responde e-mail na mão.

Troque por "Link nos comentários" e **coloque o link nos
comentários** (o LinkedIn penaliza post com link no corpo).

> **Post 2 (técnico, com tabela)**
>
> Custo de um agente de IA em 2026, em reais:
>
> | Item | Custo típico/mês |
> |---|---|
> | Plataforma (plano) | R$ 50–350 |
> | Execuções excedentes | R$ 0–400 |
> | Tokens de modelo | R$ 80–1.200 |
> | Time (2h/semana de manutenção) | R$ 400–800 |
>
> O erro que todo mundo comete: olhar só a mensalidade da ferramenta.
> O custo real é **plano + execuções + tokens + manutenção**.
>
> Detailhei a conta completa (com o ponto de equilíbrio de cada caso) aqui:
> `https://yooka.online/guias/custo-de-agente-de-ia/`

> **Post 3 (prova, não promessa)**
>
> "A IA vai substituir meu time?" — a pergunta que todo gestor faz.
>
> A resposta honesta: não no lugar do time. No lugar de **tarefa**.
>
> Mapearam 40 tarefas do departamento comercial de uma clínica. 27 eram
> repetitivas. Automatizamos 27, deixamos 13 com gente. O time não diminuiu:
> parou de fazer coisa que máquina faz.
>
> Escrevemos como fazer esse mapa em 4 passos:
> `https://yooka.online/guias/como-criar-agente-de-ia/`

**No grupo da empresa (Loyfus):** publique os mesmos textos, com o tom da
Loyfus e um CTA para diagnóstico.

---

## 3. Reddit — postagens que não são spam

Regras do Reddit: link no post = remoção. Faça o **post com a resposta
completa** e o link no fim, ou use o formato "pergunta + minha análise".

**Subreddits:** r/brasil, r/empreendedorismo, r/empregos (r/InteligenciaArtificial),
r/ChatGPT, r/smallbusiness (em inglês), r/SaaS.

> **r/empreendedorismo**
>
> **Pergunta respondida (post, não link):**
>
> "Quanto custa colocar um agente de IA para responder WhatsApp de uma
> distribuidora com 400 clientes?"
>
> Resposta curta: R$ 250–900/mês de plataforma + tokens, e 2h/semana de
> manutenção. O que mais pesa é a integração com o ERP, não o modelo.
>
> O calculo, passo a passo:
>
> 1. Volume: 400 clientes × 6 mensagens/mês = 2.400 conversas/mês
> 2. Custo por conversa (modelo + infra): ~R$ 0,05–0,12
> 3. Custo mensal de tokens: R$ 120–290
> 4. Plataforma (ManyChat/Typebot/Bot): R$ 0–350
> 5. Manutenção: 2h/semana × ~R$ 200/h
>
> Total: **R$ 600–1.500/mês** na operação real, contra um atendente de
> R$ 2.800 que não atende no domingo.
>
> Detalhei o cálculo completo (com as contas e o que muda em cada faixa de
> volume): `https://yooka.online/guias/chatbot-para-whatsapp/`

**Sempre:** responda os comentários nas primeiras 2 horas. Resposta rápida
a comentário = mais views na thread.

---

## 4. X/Twitter — thread

> **Post 1**
>
> "n8n x Make" é a comparação que todo mundo faz errado.
>
> Erram em 3 coisas:
>
> 1) comparam a mensalidade e ignoram o custo por execução
> 2) comparam a lista de integrações e ignoram a manutenção
> 3) comparam com o caso de uso errado (time técnico vs time operacional)
>
> A tabela que eu uso para decidir (valores verificados out/2026):
>
> n8n: €20/mês · self-hosted grátis · mais difícil · melhor com código
> Make: US$9/mês · mais fácil · cobrando por operação · melhor sem código
>
> A escolha certa depende de 1 pergunta: **alguém da sua empresa sabe
> programar?**
>
> Thread com a decisão completa ⤵️

> **Post 2 (o final da thread)**
>
> Se eu tivesse que recomeçar hoje, escolheria:
>
> **Sem time técnico** → Make. Você entrega automação em 2 dias.
> **Com time técnico** → n8n self-hosted. Você entrega automação em 2 semanas
> e economiza 70% no ano.
>
> Comparativo com preço, prós, contras e o veredito:
> `https://yooka.online/comparativos/n8n-vs-make/`

**Replies:** responda 10 contas de nicho que postam sobre automação com
argumento útil (não com link). 3 em 10 recebem reply.

---

## 5. WhatsApp / Telegram

Mensagem curta para lista de contatos e grupos:

> Oi! Acabei de publicar o guia que sempre me pedem: **como colocar um agente de
> IA na empresa sem virar gambiarra**. Tem o cálculo de custo por caso, o mapa
> de tarefas e o que não vale a pena automatizar.
>
> `https://yooka.online/guias/como-criar-agente-de-ia/`
>
> Se for útil, me conta o que faltou — eu atualizo.

Não spam: pergunte se faz sentido para o grupo antes de mandar.

---

## 6. Pinterest (o canal subestimado)

Pinterest é buscador + rede social, e a busca por "automação n8n", "agente de
IA", "chatbot whatsapp" é real e recorrente.

Para cada uma das 10 páginas-chave:
1. Crie o pin (1000×1500) com o **título da página** e um emoji/ícone.
2. Link de destino: a URL da página.
3. Título do pin: o título do artigo.
4. Descrição: as 2 primeiras linhas do artigo.
5. Board: "Automação IA", "IA para empresas", "Ferramentas de IA".

Ferramenta gratuita: `https://canva.com` (template de pin) + imagem gerada
pelo site. As imagens OG já serve m de pin (1200×630 — corte para 1000×1500).

---

## 7. YouTube Shorts / Reels / TikTok (45 segundos)

Roteiro único, 3 versões:

> **Roteiro (45s)**
>
> 0–3s: "Se você ainda responde e-mail de cliente na mão, para tudo."
> 3–10s: "27 tarefas do comercial de uma clínica eram repetitivas. 13 não eram."
> 10–20s: "A gente mapeou, automatizou as 27 e o time continuou nas 13."
> 20–30s: "Custo? R$ 600 a 1.500 por mês. Antes era um atendente de R$ 2.800."
> 30–40s: "O mapa de 4 passos tá no link da bio."
> 40–45s: "Link na bio. Se você automatizar isso sozinho, comenta aqui."

Vertical, legenda grande, sem música com direitos autorais.

---

## 8. Medium / dev.to / Quora

- **Medium:** republicar o artigo com `canonical` apontando para o site. O
  Medium aceita canonical via `<link rel="canonical">` no editor? Não — publique
  no Medium **sem canonical** e inclua no final: "Versão original e atualizada:
  [link]". Tráfego menor, mas backlink real.
- **dev.to:** poste com o título e adicione no topo:
  > Posted on [Yooka](https://yooka.online) — the original with updates.
- **Quora:** responda 5 perguntas sobre "quanto custa IA para empresa" com
  resposta substantive e link no fim. Quora indexa rápido e dá tráfego de busca.

---

## 9. Newsletter

Beehiiv (grátis até 2.500 assinantes) ou Substack. Subject que funciona:

> "Custo real de um agente de IA (a conta que ninguém mostra)"

Corpo: 200 palavras + link. Envie nas quintas às 8h.

---

## 10. O que fazer nos próximos 30 dias

| Semana | Ação |
|---|---|
| 1 | Publicar 2 guias novos/semana. Enviar 1 newsletter. Responder 20 comentários no Reddit. |
| 2 | Repetir no LinkedIn. Entrar em 3 grupos novos. Começar Pinterest (10 pins/semana). |
| 3 | Pedir 5 backlinks para sites da comunidade (dev.to, Medium, guest posts). |
| 4 | Revisar os artigos que bateram page 1 no Search Console e expandir. |

---

## 11. O que NÃO fazer

- Não compre tráfego pago para o site de conteúdo (o AdSense só paga depois de
  aprovar, e traffic pago nesse modelo queima dinheiro).
- Não poste o mesmo texto em 30 grupos no mesmo dia (spam).
- Não use título clickbait: o conteúdo sustenta a promessa, e a taxa de
  rejeição do Google vem do mismatch entre o título e a página.
- Não publique review positivo de ferramenta que você não usou.

---

## 12. Como medir

Cadastre no **Search Console** e no **Plausible/Umami** (analytics que não
cendem cookie). Acompanhe todo dia:

- **Impressões no GSC** (o sinal mais honesto de demanda)
- **Cliques no GSC** (CTR por query)
- **Visitas por canal** (UTM em cada link da distribuição)

Utm padrão para o kit: `?utm_source=linkedin&utm_medium=social&utm_campaign= lancamento`
