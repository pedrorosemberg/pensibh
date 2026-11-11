# pensibh

Site da PENSI+ (www.pensibh.com.br), publicado na Vercel.

| Caminho | O que é | Onde fica o código |
| --- | --- | --- |
| `/` | Site atual (v1), HTML estático | `index.html`, `styles.css`, `script.js`, `images/` |
| `/v2/` | Página do professor Bruno e das turmas 2027 | `site-v2/` (Astro + React) |

## Rodar e publicar

```bash
npm ci --prefix site-v2      # instala as dependências
node scripts/build.mjs       # gera dist/ com a v1 na raiz e a v2 em dist/v2
npm run dev --prefix site-v2 # desenvolvimento da v2 em http://localhost:4321/v2
```

A Vercel usa o `vercel.json`: instala com `npm ci --prefix site-v2`, roda `node scripts/build.mjs` e publica a pasta `dist/`.
O CSS do Tailwind da v1 é compilado no build a partir de `site-v2/v1-tailwind.css` (não há mais script de CDN).

## Conteúdo da v2

Todo o texto, preços, horários e perguntas frequentes ficam em `site-v2/src/data/site.ts`.
Os depoimentos (`TESTIMONIALS`) foram selecionados das avaliações do perfil “Bruno Professor BH” no Google, com nomes abreviados.

## Medição e cookies

Meta Pixel, Google Analytics 4, Google Ads, Microsoft Clarity e Hotjar só carregam depois do aceite no banner de cookies (v1 e v2 compartilham a mesma escolha). O clique em qualquer botão de WhatsApp é registrado como contato: `generate_lead` no GA4, conversão no Google Ads, `Contact` no Meta Pixel e evento `whatsapp_contato` no Clarity e no Hotjar.

Os IDs ficam em variáveis de ambiente da Vercel (valem para as duas versões). ID vazio = ferramenta desligada:

| Variável | Exemplo |
| --- | --- |
| `PUBLIC_GA4_ID` | `G-XXXXXXXXXX` |
| `PUBLIC_GADS_ID` | `AW-123456789` |
| `PUBLIC_GADS_CONTACT_LABEL` | rótulo da conversão de contato |
| `PUBLIC_META_PIXEL_ID` | `123456789012345` |
| `PUBLIC_CLARITY_ID` | `abcdefghij` |
| `PUBLIC_HOTJAR_ID` | `5093971` (padrão) |

Documentos: `/v2/privacidade/` e `/v2/termos/`. Os trechos destacados como “a informar” ou “a definir” aguardam o CNPJ e as regras comerciais.

## SEO, AEO e GEO

- Título, descrição, canonical, Open Graph e Twitter Card nas duas versões
- Dados estruturados (JSON-LD): `EducationalOrganization` + `LocalBusiness`, `Person`, `Course` com ofertas, `FAQPage` e `BreadcrumbList`
- `robots.txt` liberando buscadores e assistentes de IA, `sitemap.xml` e `llms.txt` com os fatos principais
- HTML gerado no build (Astro), legível por robôs que não executam JavaScript

## Segurança (OWASP Top 10)

- **A01/A05 – Configuração:** cabeçalhos HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e `Cross-Origin-Opener-Policy` em `vercel.json`; só os arquivos públicos vão para `dist/`
- **A03 – Injeção/XSS:** CSP com hashes gerados pelo Astro na v2 (sem `unsafe-inline` em scripts) e CSP restritiva na v1; nenhum `innerHTML`, `eval` ou formulário; mensagens de WhatsApp passam por `encodeURIComponent`
- **A06 – Componentes vulneráveis:** dependências travadas em `package-lock.json` e `npm audit` sem vulnerabilidades; Tailwind CDN e `unlazy` removidos
- **A08 – Integridade:** scripts de terceiros só das ferramentas de medição, de domínios listados na CSP e após o aceite; IDs validados (letras, números e hífens); fontes servidas pelo próprio domínio
- **Privacidade (LGPD):** nenhuma ferramenta de medição carrega antes do aceite; recusar é tão fácil quanto aceitar; o mapa do Google na v2 só carrega após clique
- A02, A04, A07 e A10 não se aplicam: o site não tem login, banco de dados, servidor próprio nem requisições do servidor para outras URLs


## Área restrita `/u/planejamento`

Planejamento de campanhas (Google Ads) acessível só com login, servido por `middleware.js` (Vercel Routing Middleware).

- Variáveis secretas no projeto da Vercel (Production e Preview): `USERS` (e-mails autorizados, separados por vírgula), `PASSWORD` (senha, mínimo 8 caracteres) e `PLANO_KEY` (chave AES-256 em base64).
- O conteúdo fica **criptografado** em `u/planejamento.enc.json`; o repositório é público, então os arquivos em texto puro nunca são enviados.
- Para atualizar o planejamento: `PLANO_KEY=... node scripts/encrypt-plano.mjs <pasta com index.html, planejamento.css e planejamento.js>` e fazer commit do JSON gerado.
- Sessão de 8 horas em cookie HttpOnly/Secure/SameSite=Strict. Trocar `PASSWORD` ou remover um e-mail de `USERS` encerra as sessões.
