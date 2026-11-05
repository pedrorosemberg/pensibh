import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CalendarDays, Clock } from 'lucide-react';
import { PLANS, SLOTS, brl, whatsapp } from '../data/site';
import { cn } from '../lib/utils';
import WhatsAppIcon from './WhatsAppIcon';

/** Seletor de turma em abas (padrão "pricing tabs" do 21st.dev), com navegação por teclado. */
export default function PlanExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const plan = PLANS[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = PLANS.length - 1;
    let next = i;
    if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Escolha o curso"
        className="mx-auto flex w-full max-w-2xl flex-wrap justify-center gap-1 rounded-2xl bg-white p-1.5 ring-1 ring-tinta/10 sm:flex-nowrap"
      >
        {PLANS.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${p.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'relative min-h-11 flex-1 rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-colors',
                selected ? 'text-white' : 'text-tinta-600 hover:text-pensi',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={reduce ? undefined : 'plan-pill'}
                  className="absolute inset-0 rounded-xl bg-pensi"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative">{p.name}</span>
            </button>
          );
        })}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${plan.id}`} className="mt-8">
        <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-tinta-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-4 text-pensi" />
            {plan.period}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-4 text-pensi" />
            Segunda a sexta · {plan.note}
          </span>
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={plan.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-5 md:grid-cols-3"
          >
            {SLOTS.map((slot, i) => {
              const price = plan.prices[slot.id];
              const off = Math.round((1 - price.to / price.from) * 100);
              const featured = i === 0;
              return (
                <li
                  key={slot.id}
                  className={cn(
                    'relative flex flex-col rounded-3xl bg-white p-6 ring-1 ring-tinta/10 transition-shadow hover:shadow-[0_20px_50px_-24px_rgba(190,31,61,0.45)]',
                    featured && 'ring-2 ring-pensi',
                  )}
                >
                  {featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-oliva px-3 py-1 text-xs font-bold uppercase tracking-wide text-oliva-900">
                      Melhor custo por hora
                    </span>
                  )}
                  <p className="text-sm font-semibold uppercase tracking-wide text-agua-700">{slot.period}</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight">{slot.label}</h3>
                  <p className="text-tinta-600">{slot.duration} · 5 aulas por semana</p>

                  <div className="mt-6">
                    <p className="text-sm text-tinta-600">
                      De <s>{brl(price.from)}</s> por
                    </p>
                    <p className="flex items-baseline gap-2">
                      <span className="text-4xl font-black tracking-tight text-pensi">{brl(price.to)}</span>
                      <span className="rounded-full bg-agua-50 px-2 py-0.5 text-sm font-semibold text-agua-700">−{off}%</span>
                    </p>
                  </div>

                  <ul className="mt-5 space-y-1.5 text-[15px] text-tinta-600">
                    <li>Turma de até 8 alunos</li>
                    <li>Atendimento individual</li>
                    <li>Você escolhe as matérias</li>
                  </ul>

                  <a
                    href={whatsapp(
                      `Olá, Bruno! Tenho interesse no curso ${plan.name} no horário das ${slot.label}. Ainda há vagas?`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold transition',
                      featured ? 'bg-pensi text-white hover:bg-pensi-700' : 'bg-pensi-50 text-pensi hover:bg-pensi hover:text-white',
                    )}
                  >
                    <WhatsAppIcon className="size-4" />
                    Reservar vaga
                    <span className="sr-only">
                      {' '}
                      no {plan.name}, {slot.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
        <p className="mt-6 text-center text-sm text-tinta-600">Somente 8 vagas por turma. Sem aula em feriados nacionais.</p>
      </div>
    </div>
  );
}
