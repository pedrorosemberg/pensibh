// Rastreamento com consentimento (LGPD) e Google Consent Mode v2 no modo avançado.
// - O GTM (scripts/gtm.mjs) carrega sempre. Sem autorização, o Google recebe sinais sem cookies com o
//   estado "denied", e o clique no WhatsApp entra no dataLayer (evento whatsapp_contact) com a recusa.
// - Com autorização, tudo é enviado normalmente.
// - Meta Pixel, Microsoft Clarity e Hotjar são cookies de análise e observabilidade: só carregam com o
//   aceite da categoria "Análise".
// O GA4 (G-RRH6VX6G3D) e o Google Ads (AW-428944447) vêm só do GTM. O clique no WhatsApp é enviado pelo
// script de entrada (scripts/gtm.mjs) como click_whatsapp + conversão; não crie tags iguais no GTM.

type Consent = { analytics: boolean; marketing: boolean };
type Stored = Consent & { v: 1; ts: string };

const env = import.meta.env;
export const IDS = {
  meta: (env.PUBLIC_META_PIXEL_ID as string | undefined) ?? '',
  clarity: (env.PUBLIC_CLARITY_ID as string | undefined) ?? '',
  hotjar: (env.PUBLIC_HOTJAR_ID as string | undefined) ?? '5093971',
};

// IDs só podem ter letras, números e hífens: impede injeção pela configuração.
const SAFE_ID = /^[A-Za-z0-9-]+$/;
const ok = (id: string) => id.length > 0 && SAFE_ID.test(id);

// O contêiner pode usar as duas categorias mesmo sem IDs locais.
export const HAS_ANALYTICS = true;
export const HAS_MARKETING = true;
export const HAS_TRACKERS = HAS_ANALYTICS || HAS_MARKETING;

const KEY = 'pensi-consent';
export const CONSENT_EVENT = 'pensi:open-consent';

type W = Window & {
  dataLayer?: unknown[];
  __pensiConsent?: Consent;
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
  apply(c, true);
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
  // Reserva: o bootstrap do GTM já define gtag e o consentimento padrão.
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

const state = (v: boolean) => (v ? 'granted' : 'denied');
let applied: Consent = { analytics: false, marketing: false };

function apply(c: Consent, decided: boolean) {
  ensureGtag();
  w.__pensiConsent = c;
  w.gtag!('consent', 'update', {
    analytics_storage: state(c.analytics),
    ad_storage: state(c.marketing),
    ad_user_data: state(c.marketing),
    ad_personalization: state(c.marketing),
  });
  w.gtag!('set', 'ads_data_redaction', !c.marketing);
  if (decided) {
    w.dataLayer!.push({
      event: 'consent_update',
      consent_analytics: state(c.analytics),
      consent_marketing: state(c.marketing),
      consent_decided: 'yes',
    });
  }

  // Cookies de análise e observabilidade: Clarity, Hotjar e Meta Pixel.
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

  if (c.analytics && ok(IDS.meta) && !w.fbq) {
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

/**
 * Clique em qualquer link do WhatsApp. O dataLayer, o GA4 e o Google Ads recebem o clique pelo script de
 * entrada do GTM, com ou sem autorização. Aqui vão só as ferramentas de análise, que exigem aceite.
 */
function trackContact(link: HTMLAnchorElement) {
  if (!applied.analytics) return;
  const section = link.closest('section')?.id || link.closest('header,footer')?.tagName.toLowerCase() || 'pagina';
  if (w.fbq) w.fbq('trackCustom', 'ClickWhatsApp', { content_name: section });
  if (w.clarity) w.clarity('event', 'whatsapp_contato');
  if (w.hj) w.hj('event', 'whatsapp_contato');
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
  apply(c ?? { analytics: false, marketing: false }, false);
}
