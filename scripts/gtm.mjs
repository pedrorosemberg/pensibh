// GTM + Google Consent Mode v2 no modo AVANÇADO, compartilhado pelo site (Astro) e pela área /u/planejamento.
//
// Regras de coleta:
// - Sem autorização (padrão): as tags do Google carregam e enviam sinais SEM cookies (Consent Mode avançado),
//   com o estado "denied" em cada envio. Os cliques de contato (WhatsApp) entram no dataLayer como ação e
//   conversão, com a informação da recusa.
// - Com autorização: tudo é enviado normalmente, com cookies.
//
// O script inline abaixo é liberado na CSP por hash (GTM_HASH). Ao editar `bootstrap`, rode
// o build (scripts/build.mjs): ele falha e mostra o hash novo quando GTM_HASH não bate com o script.
export const GTM_ID = 'GTM-WZ75JWVK';

export const GTM_BOOTSTRAP = `
(function () {
  var a = false, m = false, d = false;
  try {
    var s = JSON.parse(localStorage.getItem('pensi-consent') || 'null');
    if (s && s.v === 1) { d = true; a = s.analytics === true; m = s.marketing === true; }
  } catch (e) {}
  var g = function (x) { return x ? 'granted' : 'denied'; };
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: g(a),
    ad_storage: g(m),
    ad_user_data: g(m),
    ad_personalization: g(m),
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  window.gtag('set', 'ads_data_redaction', !m);
  window.gtag('set', 'url_passthrough', true);
  window.dataLayer.push({ consent_analytics: g(a), consent_marketing: g(m), consent_decided: d ? 'yes' : 'no' });
  window.gtag('js', new Date());
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  // Atribuição das campanhas da Black Friday (só valores conhecidos; IDs numéricos).
  var attr = {};
  try {
    var q = new URLSearchParams(location.search);
    var camp = q.get('utm_campaign'), med = q.get('utm_medium'), course = q.get('utm_content');
    if (q.get('utm_source') === 'google' && q.get('utm_term') === 'black_friday' &&
        ((camp === 'bf26_demand_gen' && med === 'paid_demand_gen') || (camp === 'bf26_video' && med === 'paid_video')) &&
        (course === 'cefet' || course === 'enem' || course === 'cesec')) {
      attr = { ads_campaign: camp, ads_ad_group: 'black_friday', ads_course: course };
      [['utm_id', 'ads_campaign_id'], ['adgroup_id', 'ads_ad_group_id'], ['ad_id', 'ads_ad_id']].forEach(function (k) {
        var v = q.get(k[0]); if (v && /^\\d{1,20}$/.test(v)) attr[k[1]] = v;
      });
    }
  } catch (e) {}
  // Clique no WhatsApp: ação e conversão, enviadas com ou sem autorização (sem cookies quando recusado).
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a[href^="https://wa.me/"]') : null;
    if (!el) return;
    var sec = el.closest('section');
    var st = window.__pensiConsent || { analytics: a, marketing: m };
    var p = {
      contact_method: 'whatsapp',
      contact_text: (el.textContent || el.getAttribute('aria-label') || 'whatsapp').trim().slice(0, 80),
      contact_section: sec && sec.id ? sec.id : (el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : 'pagina'),
      consent_analytics: g(st.analytics),
      consent_marketing: g(st.marketing)
    };
    for (var k in attr) p[k] = attr[k];
    var ev = { event: 'whatsapp_contact' };
    for (var k2 in p) ev[k2] = p[k2];
    window.dataLayer.push(ev);
    var ga = { send_to: 'G-RRH6VX6G3D', method: 'whatsapp' };
    for (var k3 in p) ga[k3] = p[k3];
    window.gtag('event', 'click_whatsapp', ga);
    window.gtag('event', 'conversion', { send_to: 'AW-428944447/ech4CJzShKYZEL_YxMwB' });
  }, true);
})();
`;

export const GTM_HEAD = `<script>${GTM_BOOTSTRAP}</script>
<script async src="https://www.googletagmanager.com/gtm.js?id=${GTM_ID}"></script>`;

export const GTM_HASH = 'sha256-a9yDh+i3sJ/ul2QWURJFy9psD1XzOTeEOG+EwSfX3OU=';

// Domínios do Google Tag Manager, Analytics e Ads liberados na CSP (site e /u/planejamento).
// Curingas como https://*.analytics.google.com NÃO cobrem o domínio raiz, por isso os dois aparecem.
export const GOOGLE_CSP = {
  script: [
    'https://www.googletagmanager.com',
    'https://*.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://ssl.google-analytics.com',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google.com',
  ],
  connect: [
    'https://www.googletagmanager.com',
    'https://*.googletagmanager.com',
    'https://analytics.google.com',
    'https://*.analytics.google.com',
    'https://google-analytics.com',
    'https://*.google-analytics.com',
    'https://www.google.com',
    'https://google.com',
    'https://www.google.com.br',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://*.doubleclick.net',
    'https://*.google.com',
    'https://*.googleadservices.com',
    'https://*.googlesyndication.com',
  ],
  img: [
    'https://www.googletagmanager.com',
    'https://*.googletagmanager.com',
    'https://analytics.google.com',
    'https://*.analytics.google.com',
    'https://*.google-analytics.com',
    'https://www.google.com',
    'https://www.google.com.br',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://*.doubleclick.net',
    'https://*.google.com',
    'https://*.googleadservices.com',
    'https://*.googlesyndication.com',
  ],
  frame: ['https://www.googletagmanager.com', 'https://td.doubleclick.net', 'https://*.doubleclick.net', 'https://www.google.com'],
};

export function addGtmToHead(html) {
  if (html.includes(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`)) return html;
  return html.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}\n${GTM_HEAD}`);
}
