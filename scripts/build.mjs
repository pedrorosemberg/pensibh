// Build de produção para a Vercel: monta dist/ com a v1 (raiz) e a v2 (/v2).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const v2 = join(root, 'site-v2');
const bin = (name) => join(v2, 'node_modules', '.bin', name);
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });

// v1: só os arquivos públicos, nunca o repositório inteiro.
for (const file of ['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  if (existsSync(join(root, file))) cpSync(join(root, file), join(dist, file));
}
cpSync(join(root, 'images'), join(dist, 'images'), { recursive: true });
// Depoimentos em vídeo: servidos tanto pela v1 (/videos) quanto pela v2.
cpSync(join(root, 'videos'), join(dist, 'videos'), { recursive: true });
cpSync(
  join(v2, 'node_modules/@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2'),
  join(dist, 'assets/roboto-latin-wght-normal.woff2'),
);
run(bin('tailwindcss'), ['-i', 'site-v2/v1-tailwind.css', '-o', 'dist/assets/tailwind.css', '--minify']);

// IDs de medição da v1: vêm das mesmas variáveis PUBLIC_* da v2 (painel da Vercel).
// Só letras, números e hífens passam; qualquer outra coisa vira vazio (ferramenta desligada).
const SAFE_ID = /^[A-Za-z0-9-]+$/;
const DEFAULTS = { PUBLIC_HOTJAR_ID: '5093971' };
const scriptPath = join(dist, 'script.js');
const script = readFileSync(scriptPath, 'utf8').replace(/__(PUBLIC_[A-Z0-9_]+)__/g, (_, name) => {
  const value = (process.env[name] ?? DEFAULTS[name] ?? '').trim();
  return SAFE_ID.test(value) ? value : '';
});
writeFileSync(scriptPath, script);

// v2: Astro gera dist/v2.
run(bin('astro'), ['build'], v2);

console.log('Build concluído em dist/');
