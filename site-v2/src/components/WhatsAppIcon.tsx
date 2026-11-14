import { siWhatsapp } from 'simple-icons';

interface Props {
  className?: string;
  class?: string;
}

/** Ícone oficial do WhatsApp (Simple Icons). Decorativo: o texto do botão já descreve a ação. */
export default function WhatsAppIcon({ className, class: cls }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className ?? cls}>
      <path d={siWhatsapp.path} />
    </svg>
  );
}
