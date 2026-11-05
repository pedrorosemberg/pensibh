// Rastreamento com consentimento (LGPD) e Google Consent Mode v2.
// Nenhuma tag é carregada antes do aceite. IDs vêm de variáveis PUBLIC_* da Vercel;
// ID vazio = ferramenta desligada.

type Consent = { analytics: boolean; marketing: boolean };
type Stored = Consent & { v: 1; ts: string };

const env = import.meta.env;
export const IDS = {
  ga4: (env.PUBLIC_GA4_ID as string | undefined) ?? '',
  ads: (env.PUBLIC_GADS_ID as string | undefined) ?? '',
  adsContactLabel: (env.PUBLIC_GADS_CONTACT_LABEL as string | undefined) ?? '',
  meta: (env.PUBLIC_META_PIXEL_ID as string | undefined) ?? '',
  clarity: (env.PUBLIC_CLARITY_ID as string | undefined) ?? '',
  hotjar: (env.PUBLIC_HOTJAR_ID as string | undefined) ?? '5093971',
};

// IDs só podem ter letras, números e hífens: impede injeção pela configuração.
const SAFE_ID = /^[A-Za-z0-9-]+$/;
const ok = (id: string) => id.length > 0 && SAFE_ID.test(id);

export const HAS_ANALYTICS = ok(IDS.ga4) || ok(IDS.clarity) || ok(IDS.hotjar);
export const HAS_MARKETING = ok(IDS.ads) || ok(IDS.meta);
export const HAS_TRACKERS = HAS_ANALYTICS || HAS_MARKETING;

const KEY = 'pensi-consent';
export const CONSENT_EVENT = 'pensi:open-consent';

type W = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: unknown; push?: unknown };
  _fbq?: unknown;
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  hj?: ((...args: unknown[]) => void) & { q?: unknown[] };
  _hjSettings?: { hjid: number; hjsv: number };
};
const w = (typeof window === 'undefined' ? {} : window) as W;

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Stored>;
    if (v.v !== 1) return null;
    return { analytics: v.analytics === true, marketing: v.marketing === true };
  } catch {
    return null;
  }
}

export function saveConsent(c: Consent) {
  try {
    const value: Stored = { ...c, v: 1, ts: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* navegação privada: vale só para esta visita */
  }
  apply(c);
}

function addScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function ensureGtag() {
  if (w.gtag) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });
  w.gtag('js', new Date());
}

let applied: Consent = { analytics: false, marketing: false };

function apply(c: Consent) {
  const useGa = c.analytics && ok(IDS.ga4);
  const useAds = c.marketing && ok(IDS.ads);

  if (useGa || useAds) {
    ensureGtag();
    w.gtag!('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
    });
    const first = useGa ? IDS.ga4 : IDS.ads;
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(first)}`);
    if (useGa && !applied.analytics) w.gtag!('config', IDS.ga4, { anonymize_ip: true });
    if (useAds && !applied.marketing) w.gtag!('config', IDS.ads);
  } else if (w.gtag) {
    w.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  if (c.analytics && ok(IDS.clarity) && !w.clarity) {
    w.clarity = function clarity() {
      // eslint-disable-next-line prefer-rest-params
      (w.clarity!.q = w.clarity!.q || []).push(arguments);
    };
    addScript(`https://www.clarity.ms/tag/${encodeURIComponent(IDS.clarity)}`);
    w.clarity('consent');
  }

  if (c.analytics && ok(IDS.hotjar) && /^\d+$/.test(IDS.hotjar) && !w.hj) {
    w.hj = function hj() {
      // eslint-disable-next-line prefer-rest-params
      (w.hj!.q = w.hj!.q || []).push(arguments);
    };
    w._hjSettings = { hjid: Number(IDS.hotjar), hjsv: 6 };
    addScript(`https://static.hotjar.com/c/hotjar-${IDS.hotjar}.js?sv=6`);
  }

  if (c.marketing && ok(IDS.meta) && !w.fbq) {
    const fbq = function fbq() {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      const f = w.fbq!;
      if (typeof f.callMethod === 'function') (f.callMethod as (...a: unknown[]) => void).apply(f, args as unknown as unknown[]);
      else f.queue!.push(args);
    } as NonNullable<W['fbq']>;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    w.fbq = fbq;
    w._fbq = fbq;
    addScript('https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', IDS.meta);
    w.fbq('track', 'PageView');
  }

  applied = c;
}

/** Clique em qualquer link do WhatsApp conta como "contato" em todas as ferramentas aceitas. */
function trackContact(link: HTMLAnchorElement) {
  const label = (link.textContent || link.getAttribute('aria-label') || 'whatsapp').trim().slice(0, 80);
  const section = link.closest('section')?.id || link.closest('header,footer')?.tagName.toLowerCase() || 'pagina';
  if (w.gtag && applied.analytics && ok(IDS.ga4)) {
    w.gtag('event', 'generate_lead', { method: 'whatsapp', link_text: label, section });
  }
  if (w.gtag && applied.marketing && ok(IDS.ads) && ok(IDS.adsContactLabel)) {
    w.gtag('event', 'conversion', { send_to: `${IDS.ads}/${IDS.adsContactLabel}` });
  }
  if (w.fbq && applied.marketing) w.fbq('track', 'Contact', { content_name: section });
  if (w.clarity && applied.analytics) w.clarity('event', 'whatsapp_contato');
  if (w.hj && applied.analytics) w.hj('event', 'whatsapp_contato');
}

export function initTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]') as HTMLAnchorElement | null;
      if (a) trackContact(a);
    },
    { capture: true },
  );
  const c = readConsent();
  if (c) apply(c);
}
