'use client';

import { useEffect, useState } from 'react';

const LANG_CONFIG: Record<string, { color: string; gradient: string; bg: string }> = {
  German: {
    color: '#7c3aed',
    gradient: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
    bg: 'rgba(124,58,237,0.1)',
  },
  English: {
    color: '#2563eb',
    gradient: 'linear-gradient(90deg, #2563eb, #60a5fa)',
    bg: 'rgba(37,99,235,0.1)',
  },
  Dutch: {
    color: '#0891b2',
    gradient: 'linear-gradient(90deg, #0891b2, #22d3ee)',
    bg: 'rgba(8,145,178,0.1)',
  },
  French: {
    color: '#d946ef',
    gradient: 'linear-gradient(90deg, #d946ef, #e879f9)',
    bg: 'rgba(217,70,239,0.1)',
  },
};

const FALLBACK = {
  color: '#7c3aed',
  gradient: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
  bg: 'rgba(124,58,237,0.1)',
};

interface Props {
  data: Record<string, number>;
}

export function LanguageChart({ data }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Calls by Language
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {total} total calls across {entries.length} regions
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
          Today
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-5">
        {entries.map(([language, calls], i) => {
          const cfg = LANG_CONFIG[language] ?? FALLBACK;
          const widthPct = (calls / max) * 100;
          const sharePct = total > 0 ? ((calls / total) * 100).toFixed(1) : '0.0';

          return (
            <div key={language} className="group">
              {/* Row header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                    style={{ background: cfg.color }}
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {language}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                    {sharePct}%
                  </span>
                  <span
                    className="text-sm font-bold tabular-nums w-7 text-right"
                    style={{ color: cfg.color }}
                  >
                    {calls}
                  </span>
                </div>
              </div>

              {/* Track + fill */}
              <div
                className="relative h-3 rounded-full overflow-hidden"
                style={{ background: cfg.bg }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: animated ? `${widthPct}%` : '0%',
                    background: cfg.gradient,
                    transition: `width 800ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    transitionDelay: `${i * 110}ms`,
                    boxShadow: calls > 0 ? `0 0 8px ${cfg.color}55` : 'none',
                  }}
                />
                {/* Shimmer overlay */}
                {calls > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: animated ? `${widthPct}%` : '0%',
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                      transition: `width 800ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                      transitionDelay: `${i * 110}ms`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary chips */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
        {entries
          .filter(([, v]) => v > 0)
          .map(([lang, calls]) => {
            const cfg = LANG_CONFIG[lang] ?? FALLBACK;
            return (
              <span
                key={lang}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: cfg.bg,
                  color: cfg.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: cfg.color }}
                />
                {lang} · {calls}
              </span>
            );
          })}
        {entries.filter(([, v]) => v === 0).map(([lang]) => (
          <span
            key={lang}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
          >
            {lang} · 0
          </span>
        ))}
      </div>
    </div>
  );
}
