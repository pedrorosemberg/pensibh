import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
}

/** Número que conta até o valor final ao aparecer na tela. O HTML inicial já traz o valor final. */
export default function CountUp({ value, prefix = '', suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
