// @ts-check
import { GOOGLE_CSP, GTM_HASH } from '../scripts/gtm.mjs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Domínios das ferramentas de medição liberados na CSP. Google (GTM, Analytics e Ads) vem de
// scripts/gtm.mjs; Meta, Clarity e Hotjar só carregam com o aceite de cookies de análise.
/** @param {string[][]} lists */
const uniq = (...lists) => [...new Set(lists.flat())];
const TRACKING = {
  script: uniq(GOOGLE_CSP.script, [
    'https://connect.facebook.net',
    'https://www.clarity.ms',
    'https://scripts.clarity.ms',
    'https://static.hotjar.com',
    'https://script.hotjar.com',
  ]),
  connect: uniq(GOOGLE_CSP.connect, [
    'https://www.facebook.com',
    'https://*.clarity.ms',
    'https://c.bing.com',
    'https://*.hotjar.com',
    'https://*.hotjar.io',
    'wss://*.hotjar.com',
  ]),
  img: uniq(GOOGLE_CSP.img, ['https://www.facebook.com', 'https://*.clarity.ms', 'https://c.bing.com', 'https://*.hotjar.com']),
  frame: uniq(GOOGLE_CSP.frame, ['https://vars.hotjar.com']),
};

// Site da PENSI+, publicado na raiz do domínio principal.
export default defineConfig({
  site: 'https://www.pensibh.com.br',
  outDir: '../dist',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  security: {
    // Gera um CSP com hashes para cada script e estilo que o Astro emite.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        `img-src 'self' data: ${TRACKING.img.join(' ')}`,
        "font-src 'self' https://script.hotjar.com",
        `connect-src 'self' ${TRACKING.connect.join(' ')}`,
        `frame-src ${TRACKING.frame.join(' ')}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'", ...TRACKING.script], hashes: [GTM_HASH] },
      // A biblioteca de animação escreve em atributos style; nada além disso é liberado.
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
