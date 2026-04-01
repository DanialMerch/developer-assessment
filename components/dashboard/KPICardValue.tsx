'use client';

import { useEffect, useRef, useState } from 'react';

function isFraction(v: number | string): v is string {
  return typeof v === 'string' && /^\d+\/\d+$/.test(v);
}

function isAnimatable(v: number | string): boolean {
  return typeof v === 'number' || isFraction(v);
}

function useCountUp(target: number | string, duration = 1400) {
  const [display, setDisplay] = useState<string>(() =>
    isAnimatable(target) ? '0' : String(target),
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (isFraction(target)) {
      const [rawNum, denom] = target.split('/');
      const num = parseInt(rawNum, 10);
      let startTime = 0;
      const animate = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setDisplay(`${Math.round(eased * num)}/${denom}`);
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }

    if (typeof target === 'string') return;

    let startTime = 0;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(String(Math.round(eased * target)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setDisplay(String(target));
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

interface Props {
  value: string | number;
  subtitle?: string;
}

export function KPICardValue({ value, subtitle }: Props) {
  const display = useCountUp(value);
  const animatable = isAnimatable(value);

  return (
    <>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
        {animatable ? display : value}
      </p>
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      )}
    </>
  );
}
