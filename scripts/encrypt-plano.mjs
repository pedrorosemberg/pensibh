// Criptografa os arquivos do planejamento (área restrita /u/planejamento) com AES-256-GCM.
// Uso: PLANO_KEY=<base64 de 32 bytes> node scripts/encrypt-plano.mjs <pasta-com-index.html-css-js>
// Gera u/planejamento.enc.json, que é o único arquivo do planejamento que vai para o repositório.
import { createCipheriv, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = process.argv[2];
const chave = Buffer.from(process.env.PLANO_KEY || '', 'base64');
if (!pasta || chave.length !== 32) {
  console.error('Informe a pasta de origem e PLANO_KEY (32 bytes em base64).');
  process.exit(1);
}
const arquivos = {};
for (const nome of ['index.html', 'planejamento.css', 'planejamento.js']) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', chave, iv);
  const dados = Buffer.concat([c.update(readFileSync(join(pasta, nome))), c.final(), c.getAuthTag()]);
  arquivos[nome] = { iv: iv.toString('base64'), dados: dados.toString('base64') };
}
mkdirSync(join(root, 'u'), { recursive: true });
writeFileSync(join(root, 'u', 'planejamento.enc.json'), JSON.stringify({ v: 1, gerado: new Date().toISOString(), arquivos }));
console.log('u/planejamento.enc.json gerado');
