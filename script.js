// PENSI+ v1: animações leves e consentimento de cookies (LGPD).
// O Hotjar só é carregado depois que o visitante aceita os cookies.

const HOTJAR_ID = 5093971;
const CONSENT_COOKIE = 'cookieconsent';

function getCookie(name) {
    const prefix = name + '=';
    for (const part of document.cookie.split(';')) {
        const c = part.trim();
        if (c.startsWith(prefix)) return decodeURIComponent(c.slice(prefix.length));
    }
    return null;
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax${secure}`;
}

function loadHotjar() {
    if (window.hj) return;
    window.hj = function () {
        (window.hj.q = window.hj.q || []).push(arguments);
    };
    window._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=6`;
    document.head.appendChild(s);
}

function buildBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Consentimento de cookies');

    const content = document.createElement('div');
    content.className = 'cc-content';

    const text = document.createElement('p');
    text.textContent =
        'Usamos cookies do Hotjar para entender como o site é usado e melhorá-lo. Eles só são ativados se você aceitar.';

    const buttons = document.createElement('div');
    buttons.className = 'cc-buttons';
    const deny = document.createElement('button');
    deny.type = 'button';
    deny.id = 'cc-deny';
    deny.textContent = 'Recusar';
    const accept = document.createElement('button');
    accept.type = 'button';
    accept.id = 'cc-accept';
    accept.textContent = 'Aceitar';
    buttons.append(deny, accept);

    content.append(text, buttons);
    banner.append(content);
    document.body.appendChild(banner);

    accept.addEventListener('click', () => {
        setCookie(CONSENT_COOKIE, 'accepted', 365);
        banner.style.display = 'none';
        loadHotjar();
    });
    deny.addEventListener('click', () => {
        setCookie(CONSENT_COOKIE, 'denied', 365);
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

    const consent = getCookie(CONSENT_COOKIE);
    let banner = null;
    if (consent === 'accepted') {
        loadHotjar();
    } else if (consent !== 'denied') {
        banner = buildBanner();
    }

    const settings = document.querySelector('.cc-floating');
    if (settings) {
        settings.addEventListener('click', () => {
            if (!banner) banner = buildBanner();
            banner.style.display = 'block';
        });
    }
});
