import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CONSENT_EVENT, HAS_ANALYTICS, HAS_MARKETING, HAS_TRACKERS, initTracking, readConsent, saveConsent } from '../lib/tracking';

interface Props {
  privacyHref: string;
}

/** Banner de cookies (LGPD): recusar é tão fácil quanto aceitar, e nada carrega antes da escolha. */
export default function ConsentBanner({ privacyHref }: Props) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const reduce = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    initTracking();
    const saved = readConsent();
    if (HAS_TRACKERS && !saved) setOpen(true);
    const reopen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="region"
          aria-labelledby={titleId}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-3xl bg-white p-5 text-tinta shadow-2xl ring-1 ring-tinta/10 sm:bottom-5 sm:p-6"
        >
          <h2 id={titleId} className="text-lg font-bold">
            Sua privacidade
          </h2>
          <p className="mt-2 text-[15px] text-tinta-600">
            Usamos cookies para medir o uso do site e o resultado dos nossos anúncios. Eles só são ativados com a sua
            autorização, e você pode mudar a escolha quando quiser.{' '}
            <a href={privacyHref} className="font-semibold text-pensi underline underline-offset-4">
              Política de privacidade
            </a>
          </p>

          {custom && (
            <fieldset className="mt-4 space-y-3">
              <legend className="sr-only">Escolha os tipos de cookies</legend>
              <label className="flex items-start gap-3 rounded-2xl bg-papel p-3">
                <input type="checkbox" checked disabled className="mt-1 size-5 accent-pensi" />
                <span>
                  <span className="block font-semibold">Essenciais</span>
                  <span className="block text-sm text-tinta-600">Guardam a sua escolha de cookies. Sempre ativos.</span>
                </span>
              </label>
              {HAS_ANALYTICS && (
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-papel p-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 size-5 accent-pensi"
                  />
                  <span>
                    <span className="block font-semibold">Análise</span>
                    <span className="block text-sm text-tinta-600">Google Analytics, Microsoft Clarity e Hotjar.</span>
                  </span>
                </label>
              )}
              {HAS_MARKETING && (
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-papel p-3">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 size-5 accent-pensi"
                  />
                  <span>
                    <span className="block font-semibold">Marketing</span>
                    <span className="block text-sm text-tinta-600">Google Ads e Meta Pixel (Facebook e Instagram).</span>
                  </span>
                </label>
              )}
            </fieldset>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {custom ? (
              <button
                type="button"
                onClick={() => decide(analytics, marketing)}
                className="min-h-12 rounded-full px-5 font-semibold text-tinta ring-1 ring-tinta/20 hover:bg-papel"
              >
                Salvar escolhas
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCustom(true)}
                className="min-h-12 rounded-full px-5 font-semibold text-tinta ring-1 ring-tinta/20 hover:bg-papel"
              >
                Personalizar
              </button>
            )}
            <button
              type="button"
              onClick={() => decide(false, false)}
              className="min-h-12 rounded-full px-5 font-semibold text-tinta ring-1 ring-tinta/20 hover:bg-papel"
            >
              Recusar
            </button>
            <button
              type="button"
              onClick={() => decide(HAS_ANALYTICS, HAS_MARKETING)}
              className="min-h-12 rounded-full bg-pensi px-6 font-semibold text-white hover:bg-pensi-700"
            >
              Aceitar todos
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
