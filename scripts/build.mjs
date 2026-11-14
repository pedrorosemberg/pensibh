// Publica o Astro na raiz. A v1 e os arquivos do planejamento ficam fora de dist/.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const site = join(root, 'site-v2');
rmSync(dist, { recursive: true, force: true });
execFileSync(join(site, 'node_modules', '.bin', 'astro'), ['build'], { cwd: site, stdio: 'inherit' });

for (const name of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  cpSync(join(root, name), join(dist, name));
}
mkdirSync(join(dist, 'images'), { recursive: true });
for (const name of ['pensi-flaticon.png', 'pensi-sem-fundo-2.png', 'logo-pensi.png']) {
  cpSync(join(root, 'images', name), join(dist, 'images', name));
}
cpSync(join(root, 'videos'), join(dist, 'videos'), { recursive: true });
console.log('Build concluído em dist/');
