import { CONSENT_EVENT } from '../lib/tracking';

/** Reabre o banner de cookies para o visitante mudar a escolha. */
export default function ConsentButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}>
      Preferências de cookies
    </button>
  );
}
