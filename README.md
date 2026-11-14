# PENSI+

Site da PENSI+ em [www.pensibh.com.br](https://www.pensibh.com.br). A versão atual (Astro + React) fica em `site-v2/` e é publicada na raiz pela Vercel. A versão anterior permanece no histórico do Git e seu HTML, CSS e JavaScript não entram no build.

```sh
npm ci --prefix site-v2
node scripts/build.mjs
npm run dev --prefix site-v2
```

O conteúdo de cursos, horários, preços e perguntas frequentes fica em `site-v2/src/data/site.ts`. As páginas públicas são a inicial, `/privacidade/` e `/termos/`. Mantenha sitemap e llms.txt alinhados às URLs canônicas e aos fatos publicados. Os endereços antigos em `/v2/` redirecionam para os novos.

Os scripts de medição só carregam após o aceite no banner. Configure `PUBLIC_GA4_ID`, `PUBLIC_GADS_ID`, `PUBLIC_GADS_CONTACT_LABEL`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_CLARITY_ID` e `PUBLIC_HOTJAR_ID` no ambiente de deploy conforme necessário.

## Planejamento

A Vercel só serve `/u/planejamento/` em `pensi.metadax.dev`, com login existente; outros domínios retornam 404. A rota tem `noindex` e fica fora do sitemap e do conteúdo estático. O projeto que atende a rota precisa das variáveis secretas `USERS`, `PASSWORD` e `PLANO_KEY`. Para atualizar o pacote criptografado, use `node scripts/encrypt-plano.mjs <pasta>` com a chave configurada no ambiente.
