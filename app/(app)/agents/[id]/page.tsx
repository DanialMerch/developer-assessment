import { getAgent, getCallsByAgent } from '@/lib/data';
import { notFound } from 'next/navigation';
import { formatDuration, formatPercent, formatDate, cn, outcomeLabel } from '@/lib/utils';
import {
  ArrowLeft,
  Phone,
  TrendingUp,
  Clock,
  Target,
  CalendarDays,
  AlertTriangle,
  Globe,
  Activity,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLE = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  idle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SENTIMENT_STYLE: Record<string, string> = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  neutral: 'text-slate-500 dark:text-slate-400',
  negative: 'text-red-500 dark:text-red-400',
};

const CALL_STATUS_STYLE: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const agent = getAgent(id);
  return { title: agent ? `${agent.name} — Agent Monitor` : 'Agent Not Found' };
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const agent = getAgent(id);

  if (!agent) notFound();

  const calls = getCallsByAgent(agent.id);

  return (
    <div className="p-6 md:p-8 pt-14 md:pt-8">
      {/* Back */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 text-xl font-bold flex-shrink-0">
              {agent.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{agent.name}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    STATUS_STYLE[agent.status],
                  )}
                >
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                  {agent.language}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 sm:text-right">
            <p>Created {formatDate(agent.createdAt)}</p>
            <p className="mt-0.5">Last active {formatDate(agent.lastActive)}</p>
          </div>
        </div>

        {/* Error alert */}
        {agent.error && (
          <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{agent.error}</p>
          </div>
        )}

        {/* Current call */}
        {agent.currentCall && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Live call · {agent.currentCall.company}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                Duration: {formatDuration(agent.currentCall.duration)} · Sentiment:{' '}
                <span className={SENTIMENT_STYLE[agent.currentCall.sentiment]}>
                  {agent.currentCall.sentiment}
                </span>
              </p>
            </div>
            <Link
              href={`/calls/${agent.currentCall.id}`}
              className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex-shrink-0"
            >
              View call →
            </Link>
          </div>
        )}
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Calls', value: agent.metrics.totalCalls.toLocaleString(), icon: Phone, accent: 'violet' as const },
          { label: 'Success Rate', value: formatPercent(agent.metrics.successRate), icon: TrendingUp, accent: 'emerald' as const },
          { label: 'Avg Duration', value: formatDuration(agent.metrics.avgCallDuration), icon: Clock, accent: 'blue' as const },
          { label: 'Calls Today', value: agent.metrics.callsToday, icon: CalendarDays, accent: 'amber' as const },
          { label: 'Conversion', value: formatPercent(agent.metrics.conversionRate), icon: Target, accent: 'violet' as const },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <div
                className={cn(
                  'p-1.5 rounded-lg',
                  accent === 'violet' && 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
                  accent === 'emerald' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                  accent === 'blue' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                  accent === 'amber' && 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Calls for this agent */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Call History{' '}
            <span className="text-slate-400 dark:text-slate-500 font-normal">({calls.length})</span>
          </h2>
        </div>

        {calls.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No calls found for this agent.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  {['Company', 'Contact', 'Direction', 'Status', 'Duration', 'Sentiment', 'Outcome', ''].map(
                    (h, i) => (
                      <th
                        key={i}
                        className={cn(
                          'text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3',
                          i >= 3 && i <= 4 && 'hidden sm:table-cell',
                          i === 5 && 'hidden md:table-cell',
                          i === 6 && 'hidden lg:table-cell',
                          i === 7 && 'text-right',
                        )}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {calls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      {call.company}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {call.contact}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs capitalize text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {call.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          CALL_STATUS_STYLE[call.status] ??
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
                        )}
                      >
                        {call.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hidden md:table-cell">
                      {formatDuration(call.duration)}
                    </td>
                    <td
                      className={cn(
                        'px-4 py-3 text-sm font-medium capitalize hidden md:table-cell',
                        SENTIMENT_STYLE[call.sentiment],
                      )}
                    >
                      {call.sentiment}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hidden lg:table-cell">
                      {outcomeLabel(call.outcome)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/calls/${call.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                      >
                        View
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
