// E2E do consentimento e da medição (Playwright). Uso:
//   node scripts/build.mjs && node tests/e2e/consent-tracking.mjs
// Variáveis opcionais: BASE_URL (padrão: servidor local do dist/), CHROME_PATH, PLAYWRIGHT_MODULE.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };

let server;
let base = process.env.BASE_URL;
if (!base) {
  server = createServer(async (req, res) => {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(dist, p);
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { file = join(dist, '404.html'); }
    try { res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }); res.end(await readFile(file)); }
    catch { res.writeHead(404); res.end(); }
  }).listen(0);
  base = `http://localhost:${server.address().port}`;
}

const BF = '?utm_source=google&utm_medium=paid_demand_gen&utm_campaign=bf26_demand_gen&utm_term=black_friday&utm_content=cesec&utm_id=24473833822&adgroup_id=abc';
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'OK  ' : 'FALHA'} ${msg}`); if (!ok) failures++; };

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const context = await browser.newContext();
// Nada sai para fora: domínios externos respondem vazio (a CSP é avaliada antes da rede).
await context.route(/^https?:\/\/(?!localhost)/, (r) => r.fulfill({ status: 204, body: '' }));
await context.addInitScript(() => {
  window.__csp = [];
  document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
});

const page = await context.newPage();
// Abas do WhatsApp abertas pelos cliques são fechadas.
context.on('page', (p) => { if (p !== page) p.close().catch(() => {}); });
const dl = () => page.evaluate(() => JSON.parse(JSON.stringify((window.dataLayer || []).map((x) => (x && typeof x === 'object' && 'length' in x ? Array.from(x) : x)))));
const lastContact = async () => (await dl()).filter((x) => x && x.event === 'whatsapp_contact').pop();
const gtagCalls = async (name) => (await dl()).filter((x) => Array.isArray(x) && x[0] === 'event' && x[1] === name);
const clickWhatsApp = async () => { await page.locator('a[href^="https://wa.me/"]').first().click(); await page.waitForTimeout(300); };

// 1) Sem escolha: recusa por padrão, banner com o texto novo, clique enviado com a recusa.
await page.goto(`${base}/${BF}`);
await page.waitForTimeout(1500);
let d = await dl();
const def = d.find((x) => Array.isArray(x) && x[0] === 'consent' && x[1] === 'default');
check(def && def[2].analytics_storage === 'denied' && def[2].ad_storage === 'denied', 'consentimento padrão negado');
check(d.some((x) => x && x.consent_decided === 'no'), 'dataLayer informa que não houve escolha');
check(await page.getByText('Sem autorização, o site registra só cliques de contato, sem cookies.').isVisible(), 'banner com o texto novo');
await clickWhatsApp();
let c = await lastContact();
check(c && c.consent_analytics === 'denied' && c.consent_marketing === 'denied', 'whatsapp_contact enviado com a recusa');
check(c && c.ads_campaign === 'bf26_demand_gen' && c.ads_course === 'cesec' && c.ads_campaign_id === '24473833822' && !c.ads_ad_group_id, 'atribuição da Black Friday (ID inválido descartado)');
check((await gtagCalls('click_whatsapp')).length === 1, 'GA4 click_whatsapp enviado uma vez');
check((await gtagCalls('conversion')).some((x) => x[2].send_to === 'AW-428944447/ech4CJzShKYZEL_YxMwB'), 'conversão do Google Ads com o rótulo do WhatsApp');
check(await page.evaluate(() => !localStorage.getItem('pensi-consent')), 'nada salvo no navegador sem escolha');

// 2) Aceitar tudo.
await page.getByRole('button', { name: 'Aceitar todos' }).click();
await page.waitForTimeout(300);
d = await dl();
check(d.some((x) => x && x.event === 'consent_update' && x.consent_analytics === 'granted' && x.consent_marketing === 'granted'), 'consent_update com aceite');
check(d.some((x) => Array.isArray(x) && x[0] === 'consent' && x[1] === 'update' && x[2].ad_storage === 'granted'), 'gtag consent update granted');
await clickWhatsApp();
c = await lastContact();
check(c && c.consent_analytics === 'granted' && c.consent_marketing === 'granted', 'whatsapp_contact enviado com o aceite');

// 3) Recarregar: o aceite salvo vale antes do GTM.
await page.goto(`${base}/`);
await page.waitForTimeout(800);
d = await dl();
const def2 = d.find((x) => Array.isArray(x) && x[0] === 'consent' && x[1] === 'default');
check(def2 && def2[2].analytics_storage === 'granted', 'aceite salvo aplicado no consentimento padrão');
check(!(await page.getByText('Sua privacidade').isVisible().catch(() => false)), 'banner não reaparece depois da escolha');

// 4) CSP: endpoints do Google liberados e nenhum script inline bloqueado.
const endpoints = ['https://analytics.google.com/g/collect', 'https://region1.google-analytics.com/g/collect', 'https://ad.doubleclick.net/ccm/s/collect', 'https://www.google.com/ccm/collect', 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1/', 'https://www.googleadservices.com/pagead/conversion/1/'];
await page.evaluate((urls) => Promise.all(urls.map((u) => fetch(u, { mode: 'no-cors' }).catch(() => {}))), endpoints);
await page.waitForTimeout(300);
const violations = await page.evaluate(() => window.__csp);
check(violations.length === 0, `CSP sem bloqueios${violations.length ? ': ' + violations.join(', ') : ''}`);

// 5) Recusar depois: volta a negado.
await page.evaluate(() => window.dispatchEvent(new Event('pensi:open-consent')));
await page.getByRole('button', { name: 'Recusar' }).click();
await page.waitForTimeout(300);
d = await dl();
check(d.filter((x) => x && x.event === 'consent_update').pop()?.consent_analytics === 'denied', 'recusa posterior registrada');

await browser.close();
server?.close();
console.log(failures ? `\n${failures} falha(s)` : '\nTudo certo');
process.exit(failures ? 1 : 0);
