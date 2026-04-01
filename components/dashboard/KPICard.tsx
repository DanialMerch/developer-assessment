import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { KPICardValue } from './KPICardValue';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: 'violet' | 'emerald' | 'blue' | 'amber';
}

const accentMap = {
  violet: {
    icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    bar: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
  },
  emerald: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    bar: 'linear-gradient(90deg, #059669, #34d399)',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    bar: 'linear-gradient(90deg, #2563eb, #60a5fa)',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    bar: 'linear-gradient(90deg, #d97706, #fbbf24)',
  },
};

export function KPICard({ title, value, subtitle, icon: Icon, accent = 'violet' }: KPICardProps) {
  const { icon: iconCls, bar } = accentMap[accent];

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-4 overflow-hidden group transition-all hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-slate-900/50">
      {/* Accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: bar }}
      />

      {/* Title + Icon — rendered in the Server Component, no boundary crossing */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={cn('p-2 rounded-lg', iconCls)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Animated value — only plain props (string | number) cross to the Client Component */}
      <KPICardValue value={value} subtitle={subtitle} />
    </div>
  );
}
