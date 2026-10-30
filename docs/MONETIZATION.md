# Monetização

Três fontes, em ordem de potencial por visita:

| Fonte | RPM estimado (PT-BR) | Quando começa | Escala |
|---|---|---|---|
| **Produto próprio (Loyfus)** | R$ 40–400 por lead qualificado | já | cresce com o tráfego |
| **Afiliado de software** | R$ 8–60 por clique qualificado | já | cresce com o tráfego |
| **AdSense (display)** | R$ 3–18 por mil views | após aprovação | depende de volume de pagesviews |

O AdSense paga pouco por visita. O que paga é o **lead**. Por isso cada página
tem uma caixa de oferta para a Loyfus no fim do artigo e no meio da página —
sem isso, o tráfego vira pageviews e não vira receita.

## 1. Oferta por vertical

A caixa de oferta muda conforme o tema, porque um leitor de INSS não quer
agente de IA. A função `offerForCategory()` em `build.js` define:

| Categoria | Oferta | Destino |
|---|---|---|
| `servicos-publicos` | as calculadoras | `/calculadoras/` |
| `mei-e-nota-fiscal` | contabilidade online | `/ferramentas/contabilizei/` |
| `trabalho-e-carreira` | a equipe da Yooka | `/contato/` |
| `renda-e-negocio` | plataformas de venda | `/ferramentas/` |
| `automacao-e-ia` | a Loyfus (agentes de IA) | `loyfus.com.br` |
| `custos-e-planos` | custos e planos | `/precos/` |

Cada clique de afiliado vai com `rel="nofollow noopener"`. O `?via=yooka` de
rastreio fica em `site.affiliate.tag`.

**Para medir:** crie um destino por canal (ex.: `https://loyfus.com.br/yooka`),
ou use UTM em cada link da distribuição (`docs/DISTRIBUICAO.md`).

**Para melhorar a conversão:** troque o texto padrão por um que cite o caso da
página. Exemplo no artigo de chatbot para WhatsApp:

```js
offerBox({
  title: 'Quer um bot de WhatsApp rodando em 2 semanas?',
  text: 'Diagnóstico, implantação e suporte. Você acompanha o primeiro atendimento no mesmo dia.',
  button: 'Falar com um especialista',
})
```

## 2. Afiliados

Os links de afiliado estão em `src/content/tools/*.json` no campo
`affiliateUrl` e aparecem nos botões "Ver preço" das páginas de ferramenta, de
comparativo e de preço.

**Programas com afinidade real para este público:**

| Programa | Comissão | Onde entra |
|---|---|---|
| Contabilidade online (Contabilizei, Agilize, ContabilizeJá) | R$ 20–60/mês | Categoria MEI — a maior intenção de compra do site |
| Hotmart / Kiwify / Monetizze | 8–12% + taxa | Renda extra e curso online |
| Shopify / RD Station | R$ 30–150/mês | Vender online e marketing |
| Mercado Pago / iugu / Asa | R$ 0,5–1,5 por transação | Receber por Pix e boleto |
| Nubank / Inter / C6 | R$ 10–40 por conta aberta | Custos e planos |
| Workana / 99jobs / GetNinjas | R$ 30–80 por contratação | Freelancer e trabalho remoto |
| Tiny ERP / Omie | R$ 40–120/mês | Gestão do MEI |
| Hostinger / Cloudways | R$ 60+/mês | Quem quer site próprio para vender |
| Domínio (.com.br / .online) | comissão | Quem quer o próprio endereço |
| n8n / Make / Zapier | 20% recorrente | Cluster de automação e IA |

**Para adicionar:** edite o `affiliateUrl` no JSON da ferramenta e rode o
build. O parâmetro de tracking fica em `site.affiliate.tag` (`?via=yooka`).

**Regra:** comissao é declarada no rodapé e na página editorial. Review
negativo de ferramenta que você recebe comissão continua publicando — é o que
sustenta a credibilidade (e o que o Google exige para evitar CLASSY spam).

## 3. AdSense

Configure em `src/site.config.js`:

```js
adsense: {
  client: 'ca-pub-1234567890123456',
  slots: {
    leaderboard: '1111111111',
    inArticle: '2222222222',
    sidebar: '3333333333',
  },
}
```

Os slots já estão posicionados: topo da home, meio dos artigos, lateral.
Enquanto `client` estiver vazio, aparece um placeholder — o layout não quebra.

### Regras do AdSense que este site já cumpre

- Conteúdo original, escrito para o leitor, sem copiar texto de terceiros.
- Sem conteúdo "adulto, violento, de invocação ritual ou de phishing" (nada disso existe aqui).
- Política de privacidade e página de contato publicadas (obrigatórias).
- `ads.txt` na raiz, gerado no build.
- Sem clique forçado, sem "clique aqui" enganoso, sem pop-up que impede a leitura.

### Expectativa de receita (cenário conservador)

| Pageviews/mês | AdSense (R$ 10 RPM) | Afiliado (R$ 1,5 por visita) | Leads (2% → R$ 120) |
|---|---|---|---|
| 10.000 | R$ 100 | R$ 1.500 | 200 leads → R$ 24.000 |
| 50.000 | R$ 500 | R$ 7.500 | 1.000 leads → R$ 120.000 |
| 200.000 | R$ 2.000 | R$ 30.000 | 4.000 leads → R$ 480.000 |

Serviços públicos, MEI, crédito e planos de saúde pagam mais por view que
"IA para empresas": o anunciante é banco, seguradora, contabilidade e
telecom — e o valor por clique é maior. O número que importa, porém,
continua sendo o de leads: contabilidade online e plataformas de venda
convertem visitor em assinatura mensal.

**A calculadora é a peça de maior EPC do site:** quem chega numa calculadora
de DAS ou de CLT x PJ já está decidindo sobre dinheiro. Traga essas visitas
para as páginas de ferramenta com um bloco de recomendação (sem empurrar).

## 4. Lista de e-mail (opcional mas multiplica)

Quem se cadastra vale 5–10x mais que uma visita avulsa. Quando a lista
exister, coloque o formulário:

1. Beehiiv (grátis até 2.500 assinantes) ou Buttondown.
2. Cole a URL de ação em `src/site.config.js` → `newsletter.action`.
3. O gerador renderiza o formulário; sem `action`, nada aparece.

Enviar uma newsletter semanal com um resumo dos guias novos é o que faz o
público voltar — e voltar é o que faz o ranking subir.

## 5. O que NÃO fazer

- Não compre tráfego pago para as páginas de conteúdo antes da aprovação do
  AdSense (o RPM pago é menor que o ganho de audiência).
- Não coloque o link de afiliado em toda menção a ferramenta — só onde há
  intenção de compra (botão de preço).
- Não escreva review positivo de ferramenta que paga comissão sem usar.
