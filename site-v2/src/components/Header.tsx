import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { NAV } from '../data/site';
import { cn } from '../lib/utils';
import WhatsAppIcon from './WhatsAppIcon';

interface Props {
  logoSrc: string;
  whatsappHref: string;
  /** Prefixo dos links de âncora; use '/v2/' em páginas internas. */
  hrefPrefix?: string;
}

/** Cabeçalho fixo no padrão "floating navbar" do 21st.dev, com menu móvel acessível. */
export default function Header({ logoSrc, whatsappHref, hrefPrefix = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('a');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5',
          scrolled
            ? 'bg-white/90 shadow-[0_8px_30px_-12px_rgba(29,20,22,0.25)] ring-1 ring-tinta/10 backdrop-blur-md'
            : 'bg-white/70 ring-1 ring-white/40 backdrop-blur-sm',
        )}
      >
        <a href={`${hrefPrefix}#topo`} className="flex shrink-0 items-center gap-2" aria-label="PENSI+, voltar ao início">
          <img src={logoSrc} alt="" width={86} height={48} className="h-10 w-auto" />
        </a>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={`${hrefPrefix}${item.href}`}
                  className="rounded-full px-3.5 py-2 text-[15px] font-medium text-tinta-600 transition-colors hover:bg-pensi-50 hover:text-pensi"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-pensi px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-pensi-700 sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            Agende uma aula
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-tinta hover:bg-pensi-50 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl bg-white p-3 shadow-xl ring-1 ring-tinta/10 lg:hidden"
          >
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={`${hrefPrefix}${item.href}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-lg font-medium text-tinta hover:bg-pensi-50 hover:text-pensi"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-pensi px-5 py-3.5 text-lg font-semibold text-white"
            >
              <WhatsAppIcon className="size-5" />
              Agende uma aula no WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
