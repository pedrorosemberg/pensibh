// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Domínios das ferramentas de medição. Elas só carregam depois do aceite no banner de cookies.
const TRACKING = {
  script: [
    'https://www.googletagmanager.com',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://connect.facebook.net',
    'https://www.clarity.ms',
    'https://scripts.clarity.ms',
    'https://static.hotjar.com',
    'https://script.hotjar.com',
  ],
  connect: [
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://googleads.g.doubleclick.net',
    'https://www.facebook.com',
    'https://*.clarity.ms',
    'https://c.bing.com',
    'https://*.hotjar.com',
    'https://*.hotjar.io',
    'wss://*.hotjar.com',
  ],
  img: [
    'https://www.googletagmanager.com',
    'https://*.google-analytics.com',
    'https://www.google.com',
    'https://www.google.com.br',
    'https://googleads.g.doubleclick.net',
    'https://www.facebook.com',
    'https://*.clarity.ms',
    'https://c.bing.com',
    'https://*.hotjar.com',
  ],
  frame: ['https://td.doubleclick.net', 'https://www.googletagmanager.com', 'https://vars.hotjar.com'],
};

// Site v2 da PENSI+, publicado em https://www.pensibh.com.br/v2
// O build sai em ../dist/v2, ao lado da v1 copiada por scripts/build.mjs.
export default defineConfig({
  site: 'https://www.pensibh.com.br',
  base: '/v2',
  outDir: '../dist/v2',
  trailingSlash: 'ignore',
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
        `frame-src https://www.google.com ${TRACKING.frame.join(' ')}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'", ...TRACKING.script] },
      // A biblioteca de animação escreve em atributos style; nada além disso é liberado.
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
