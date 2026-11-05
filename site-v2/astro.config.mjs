// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

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
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-src https://www.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
      // A biblioteca de animação escreve em atributos style; nada além disso é liberado.
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
