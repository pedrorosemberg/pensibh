import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV } from '../data/site';
import WhatsAppIcon from './WhatsAppIcon';

interface Props {
  logoSrc: string;
  whatsappHref: string;
  /** Prefixo dos links de âncora; use '/' em páginas internas. */
  hrefPrefix?: string;
}

/** Cabeçalho fixo no padrão "floating navbar" do 21st.dev, com menu móvel acessível. */
export default function Header({ logoSrc, whatsappHref, hrefPrefix = '' }: Props) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

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
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl bg-white/95 px-4 py-2.5 shadow-sm ring-1 ring-tinta/10 sm:px-5"
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

      <nav
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        aria-label="Menu principal"
        className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-6xl overflow-auto rounded-2xl bg-white p-3 shadow-xl ring-1 ring-tinta/10 lg:hidden"
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

      </nav>
    </header>
  );
}
