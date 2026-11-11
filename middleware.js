/**
 * Área restrita /u/planejamento (Vercel Routing Middleware).
 *
 * - Login por e-mail + senha. E-mails permitidos em USERS (separados por vírgula),
 *   senha única em PASSWORD. Os dois ficam como variáveis secretas no projeto da Vercel.
 * - O conteúdo do planejamento NÃO fica no site em texto puro: vai criptografado
 *   (AES-256-GCM) em u/planejamento.enc.json e só é decifrado aqui, com PLANO_KEY,
 *   depois do login. Assim nada vaza pelo repositório público nem por URL direta.
 * - Sessão em cookie HttpOnly + Secure + SameSite=Strict, assinado com HMAC-SHA256,
 *   válido por 8 horas. Trocar PASSWORD ou PLANO_KEY invalida todas as sessões.
 * - Falha fechada: sem as variáveis configuradas, ninguém entra.
 */
import plano from './u/planejamento.enc.json';

export const config = { matcher: ['/u', '/u/:path*'] };

const BASE = '/u/planejamento';
const COOKIE = 'pensi_plano';
const TTL = 8 * 60 * 60; // segundos
const enc = new TextEncoder();
const dec = new TextDecoder();

const ARQUIVOS = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/planejamento.css': ['planejamento.css', 'text/css; charset=utf-8'],
  '/planejamento.js': ['planejamento.js', 'text/javascript; charset=utf-8'],
};

const HEADERS_BASE = {
  'Cache-Control': 'no-store, private',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'",
};

async function naoEncontrado(req) {
  // Mesma página 404 do site (dist/404.html), para nunca cair na página padrão da Vercel.
  try {
    const r = await fetch(new URL('/404.html', req.url), { headers: { accept: 'text/html' } });
    if (r.ok) return resposta(await r.text(), 404, { 'Content-Type': 'text/html; charset=utf-8' });
  } catch { /* usa o texto simples abaixo */ }
  return resposta('Página não encontrada', 404, { 'Content-Type': 'text/plain; charset=utf-8' });
}

function resposta(corpo, status = 200, extra = {}) {
  return new Response(corpo, { status, headers: { ...HEADERS_BASE, ...extra } });
}
function redirecionar(destino, extra = {}) {
  return new Response(null, { status: 303, headers: { ...HEADERS_BASE, Location: destino, ...extra } });
}

/* ---------- utilitários de cripto ---------- */
function deB64(s) {
  const n = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(n + '='.repeat((4 - (n.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function paraB64url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function iguais(a, b) {
  // comparação em tempo constante para strings do mesmo tamanho
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function chaveHmac(env) {
  const material = await crypto.subtle.digest('SHA-256', enc.encode(`${env.PLANO_KEY}:${env.PASSWORD}`));
  return crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function assinar(chave, texto) {
  return paraB64url(await crypto.subtle.sign('HMAC', chave, enc.encode(texto)));
}

function lerEnv() {
  const USERS = (process.env.USERS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const PASSWORD = process.env.PASSWORD || '';
  const PLANO_KEY = process.env.PLANO_KEY || '';
  return { USERS, PASSWORD, PLANO_KEY, ok: USERS.length > 0 && PASSWORD.length >= 8 && PLANO_KEY.length >= 40 };
}

function lerCookie(req) {
  const c = req.headers.get('cookie') || '';
  const m = c.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

async function sessaoValida(req, env) {
  const valor = lerCookie(req);
  if (!valor || !valor.includes('.')) return null;
  const [dados, assinatura] = valor.split('.');
  const chave = await chaveHmac(env);
  if (!iguais(await assinar(chave, dados), assinatura)) return null;
  let email, exp;
  try { [email, exp] = dec.decode(deB64(dados)).split('|'); } catch { return null; }
  if (!email || !(+exp > Date.now() / 1000)) return null;
  if (!env.USERS.includes(email)) return null; // removido de USERS = sessão encerrada
  return email;
}

async function criarCookie(email, env) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const dados = paraB64url(enc.encode(`${email}|${exp}`));
  const assinatura = await assinar(await chaveHmac(env), dados);
  return `${COOKIE}=${dados}.${assinatura}; Path=/u/; Max-Age=${TTL}; HttpOnly; Secure; SameSite=Strict`;
}

async function decifrar(nome, env) {
  const item = plano.arquivos[nome];
  if (!item) return null;
  const chave = await crypto.subtle.importKey('raw', deB64(env.PLANO_KEY), { name: 'AES-GCM' }, false, ['decrypt']);
  const claro = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: deB64(item.iv) }, chave, deB64(item.dados));
  return new Uint8Array(claro);
}

/* ---------- páginas ---------- */
function paginaLogin({ erro = false, mensagem = '' } = {}) {
  const aviso = erro
    ? '<p class="erro" role="alert">E-mail ou senha incorretos.</p>'
    : mensagem ? `<p class="erro" role="alert">${mensagem}</p>` : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Entrar — Planejamento PENSI+</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#c41e3a;font:16px/1.5 "Segoe UI",Roboto,system-ui,sans-serif;color:#1d1416;padding:16px}
main{width:100%;max-width:400px;background:#fff;border-radius:18px;padding:28px 24px;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.m{display:flex;align-items:center;gap:10px;font-weight:700;color:#c41e3a}.m span{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:8px;background:#2eb0c5;color:#fff;font-size:22px}
h1{font-size:1.35rem;margin:16px 0 4px}p{margin:0 0 18px;color:#6b5f62}
label{display:block;font-weight:600;font-size:.9rem;margin:14px 0 6px}
input{width:100%;font:inherit;padding:12px 14px;border:1px solid #d9cfd1;border-radius:12px;min-height:48px}
input:focus{outline:3px solid #c8c02d;outline-offset:1px;border-color:#c41e3a}
button{margin-top:20px;width:100%;min-height:50px;border:0;border-radius:999px;background:#c41e3a;color:#fff;font:inherit;font-weight:700;cursor:pointer}
button:focus-visible{outline:3px solid #c8c02d;outline-offset:2px}
.erro{background:#fee2e2;color:#991b1b;padding:10px 12px;border-radius:10px;margin:14px 0 0}
small{display:block;margin-top:18px;color:#8a7d80;text-align:center}
</style></head><body><main>
<div class="m"><span aria-hidden="true">+</span>PENSI+</div>
<h1>Planejamento de campanhas</h1><p>Acesso restrito. Entre com seu e-mail autorizado e a senha.</p>
${aviso}
<form method="post" action="${BASE}/entrar" autocomplete="on">
<label for="email">E-mail</label><input id="email" name="email" type="email" required autocomplete="username" inputmode="email" autofocus>
<label for="senha">Senha</label><input id="senha" name="senha" type="password" required autocomplete="current-password">
<button type="submit">Entrar</button>
</form><small>Área mantida pela METADAX</small></main></body></html>`;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function middleware(req) {
  const url = new URL(req.url);
  let caminho = url.pathname;
  if (caminho === '/u' || caminho === '/u/' || caminho === BASE) return redirecionar(`${BASE}/`);
  if (!caminho.startsWith(BASE + '/')) return naoEncontrado(req);
  let sub = caminho.slice(BASE.length) || '/';
  if (sub.length > 1 && sub.endsWith('/')) sub = sub.slice(0, -1);

  const env = lerEnv();
  if (!env.ok) {
    return resposta(paginaLogin({ mensagem: 'O acesso ainda não foi configurado (USERS, PASSWORD e PLANO_KEY).' }), 503, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  }

  if (sub === '/sair') {
    return redirecionar(`${BASE}/`, { 'Set-Cookie': `${COOKIE}=; Path=/u/; Max-Age=0; HttpOnly; Secure; SameSite=Strict` });
  }

  if (sub === '/entrar') {
    if (req.method !== 'POST') return redirecionar(`${BASE}/`);
    const origem = req.headers.get('origin');
    if (origem && origem !== url.origin) return resposta('Origem não permitida', 403, { 'Content-Type': 'text/plain; charset=utf-8' });
    let email = '', senha = '';
    try {
      const form = await req.formData();
      email = String(form.get('email') || '').trim().toLowerCase().slice(0, 254);
      senha = String(form.get('senha') || '').slice(0, 256);
    } catch { /* formulário inválido */ }
    const chave = await chaveHmac(env);
    const senhaOk = iguais(await assinar(chave, senha), await assinar(chave, env.PASSWORD));
    const emailOk = env.USERS.includes(email);
    if (!(senhaOk && emailOk)) {
      await espera(700); // freia tentativas em sequência
      return resposta(paginaLogin({ erro: true }), 401, { 'Content-Type': 'text/html; charset=utf-8' });
    }
    return redirecionar(`${BASE}/`, { 'Set-Cookie': await criarCookie(email, env) });
  }

  const alvo = ARQUIVOS[sub];
  if (!alvo) return naoEncontrado(req);
  const usuario = await sessaoValida(req, env);
  if (!usuario) {
    if (sub === '/' || sub === '/index.html') return resposta(paginaLogin(), 200, { 'Content-Type': 'text/html; charset=utf-8' });
    return resposta('Não autorizado', 401, { 'Content-Type': 'text/plain; charset=utf-8' });
  }
  let corpo;
  try { corpo = await decifrar(alvo[0], env); } catch { corpo = null; }
  if (!corpo) return resposta('Não foi possível abrir o planejamento. Confira a PLANO_KEY.', 500, { 'Content-Type': 'text/plain; charset=utf-8' });
  return resposta(corpo, 200, { 'Content-Type': alvo[1] });
}
