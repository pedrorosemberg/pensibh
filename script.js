// PENSI+ v1: animações leves, consentimento de cookies (LGPD) e medição de contatos.
// Nada de medição carrega antes do aceite. Os IDs são preenchidos no build (scripts/build.mjs)
// a partir das variáveis PUBLIC_* da Vercel; ID vazio = ferramenta desligada.
// A escolha de cookies é a mesma da v2 (chave "pensi-consent" no navegador).

const RAW_IDS = {
    ga4: '__PUBLIC_GA4_ID__',
    ads: '__PUBLIC_GADS_ID__',
    adsContactLabel: '__PUBLIC_GADS_CONTACT_LABEL__',
    meta: '__PUBLIC_META_PIXEL_ID__',
    clarity: '__PUBLIC_CLARITY_ID__',
    hotjar: '__PUBLIC_HOTJAR_ID__',
};
const SAFE_ID = /^[A-Za-z0-9-]+$/;
const IDS = Object.fromEntries(
    Object.entries(RAW_IDS).map(([k, v]) => [k, v.startsWith('__') || !SAFE_ID.test(v) ? '' : v]),
);
const HAS_ANALYTICS = Boolean(IDS.ga4 || IDS.clarity || IDS.hotjar);
const HAS_MARKETING = Boolean(IDS.ads || IDS.meta);
const CONSENT_KEY = 'pensi-consent';

function readConsent() {
    try {
        const v = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
        if (!v || v.v !== 1) return null;
        return { analytics: v.analytics === true, marketing: v.marketing === true };
    } catch {
        return null;
    }
}

function saveConsent(c) {
    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, v: 1, ts: new Date().toISOString() }));
    } catch {
        /* navegação privada: vale só para esta visita */
    }
    applyConsent(c);
}

function addScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
}

let applied = { analytics: false, marketing: false };

function applyConsent(c) {
    const useGa = c.analytics && IDS.ga4;
    const useAds = c.marketing && IDS.ads;
    if (useGa || useAds) {
        if (!window.gtag) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
                window.dataLayer.push(arguments);
            };
            window.gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
            });
            window.gtag('js', new Date());
        }
        window.gtag('consent', 'update', {
            analytics_storage: c.analytics ? 'granted' : 'denied',
            ad_storage: c.marketing ? 'granted' : 'denied',
            ad_user_data: c.marketing ? 'granted' : 'denied',
            ad_personalization: c.marketing ? 'granted' : 'denied',
        });
        addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(useGa ? IDS.ga4 : IDS.ads)}`);
        if (useGa && !applied.analytics) window.gtag('config', IDS.ga4, { anonymize_ip: true });
        if (useAds && !applied.marketing) window.gtag('config', IDS.ads);
    }
    if (c.analytics && IDS.clarity && !window.clarity) {
        window.clarity = function () {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        addScript(`https://www.clarity.ms/tag/${encodeURIComponent(IDS.clarity)}`);
        window.clarity('consent');
    }
    if (c.analytics && /^\d+$/.test(IDS.hotjar) && !window.hj) {
        window.hj = function () {
            (window.hj.q = window.hj.q || []).push(arguments);
        };
        window._hjSettings = { hjid: Number(IDS.hotjar), hjsv: 6 };
        addScript(`https://static.hotjar.com/c/hotjar-${IDS.hotjar}.js?sv=6`);
    }
    if (c.marketing && IDS.meta && !window.fbq) {
        const fbq = function () {
            if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
            else fbq.queue.push(arguments);
        };
        fbq.queue = [];
        fbq.loaded = true;
        fbq.version = '2.0';
        fbq.push = fbq;
        window.fbq = window._fbq = fbq;
        addScript('https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', IDS.meta);
        window.fbq('track', 'PageView');
    }
    applied = c;
}

// Clique em qualquer link do WhatsApp conta como "contato" nas ferramentas autorizadas.
function trackContact(link) {
    const section = (link.closest('section') || {}).id || 'cabecalho';
    if (window.gtag && applied.analytics && IDS.ga4) window.gtag('event', 'generate_lead', { method: 'whatsapp', section });
    if (window.gtag && applied.marketing && IDS.ads && IDS.adsContactLabel) {
        window.gtag('event', 'conversion', { send_to: `${IDS.ads}/${IDS.adsContactLabel}` });
    }
    if (window.fbq && applied.marketing) window.fbq('track', 'Contact', { content_name: section });
    if (window.clarity && applied.analytics) window.clarity('event', 'whatsapp_contato');
    if (window.hj && applied.analytics) window.hj('event', 'whatsapp_contato');
}

function buildBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Consentimento de cookies');

    const content = document.createElement('div');
    content.className = 'cc-content';

    const text = document.createElement('p');
    text.append(
        'Usamos cookies para medir o uso do site e o resultado dos anúncios. Eles só são ativados com a sua autorização. ',
    );
    const more = document.createElement('a');
    more.href = '/v2/privacidade/';
    more.id = 'cc-more';
    more.textContent = 'Política de privacidade';
    text.append(more);

    const buttons = document.createElement('div');
    buttons.className = 'cc-buttons';
    const deny = document.createElement('button');
    deny.type = 'button';
    deny.id = 'cc-deny';
    deny.textContent = 'Recusar';
    const accept = document.createElement('button');
    accept.type = 'button';
    accept.id = 'cc-accept';
    accept.textContent = 'Aceitar todos';
    buttons.append(deny, accept);

    content.append(text, buttons);
    banner.append(content);
    document.body.appendChild(banner);

    accept.addEventListener('click', () => {
        saveConsent({ analytics: HAS_ANALYTICS, marketing: HAS_MARKETING });
        banner.style.display = 'none';
    });
    deny.addEventListener('click', () => {
        saveConsent({ analytics: false, marketing: false });
        banner.style.display = 'none';
    });
    return banner;
}

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 },
        );
        document.querySelectorAll('section').forEach((section) => observer.observe(section));

        document.querySelectorAll('.hover-effect').forEach((el) => {
            el.addEventListener('mouseenter', () => el.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => el.classList.remove('is-hover'));
        });
    }

    document.addEventListener(
        'click',
        (e) => {
            const a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
            if (a) trackContact(a);
        },
        { capture: true },
    );

    const consent = readConsent();
    let banner = null;
    if (consent) applyConsent(consent);
    else if (HAS_ANALYTICS || HAS_MARKETING) banner = buildBanner();

    const settings = document.querySelector('.cc-floating');
    if (settings) {
        settings.addEventListener('click', () => {
            if (!banner) banner = buildBanner();
            banner.style.display = 'block';
        });
    }
});
