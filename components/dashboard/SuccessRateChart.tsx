'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CalendarCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface Props {
  successRate: number;
  meetingsBooked: number;
}

interface TooltipPayload {
  name: string;
  value: number;
}

function CustomTooltip({
  active,
  payload,
  isDark,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  isDark: boolean;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      style={{
        background: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(148,163,184,0.15)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 10,
        padding: '8px 12px',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
      }}
    >
      <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 11, marginBottom: 3 }}>
        {item.name}
      </p>
      <p style={{ color: isDark ? '#f8fafc' : '#0f172a', fontSize: 15, fontWeight: 700 }}>
        {item.value.toFixed(1)}%
      </p>
    </div>
  );
}

export function SuccessRateChart({ successRate, meetingsBooked }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const isDark = !mounted || theme === 'dark';
  const pct = successRate * 100;

  const data = [
    { name: 'Success', value: pct },
    { name: 'Other', value: 100 - pct },
  ];

  const renderTooltip = (props: object) =>
    CustomTooltip({ ...(props as { active?: boolean; payload?: TooltipPayload[] }), isDark });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Success Rate</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overall call outcomes</p>
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={82}
              startAngle={90}
              endAngle={-270}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={200}
              animationDuration={1200}
            >
              <Cell fill="#7c3aed" />
              <Cell fill={isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)'} />
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {pct.toFixed(0)}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Success</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-slate-300">Successful</span>
          </div>
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {pct.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
            <span className="text-xs text-slate-600 dark:text-slate-300">Other outcomes</span>
          </div>
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {(100 - pct).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Meetings booked */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <CalendarCheck className="w-4 h-4" />
          <span className="text-xs font-medium">Meetings Booked</span>
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">{meetingsBooked}</span>
      </div>
    </div>
  );
}
