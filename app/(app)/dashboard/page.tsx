import { getDashboard, getAgents, getCalls } from '@/lib/data';
import { KPICard } from '@/components/dashboard/KPICard';
import { LanguageChart } from '@/components/dashboard/LanguageChart';
import { SuccessRateChart } from '@/components/dashboard/SuccessRateChart';
import { formatDuration } from '@/lib/utils';
import { Bot, Phone, CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusStyle: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  idle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function DashboardPage() {
  const data = getDashboard();
  const agents = getAgents();
  const calls = getCalls();

  const activeAgents = agents.filter((a) => a.status === 'active');
  const recentCalls = calls.slice(0, 5);

  return (
    <div className="p-6 md:p-8 pt-14 md:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time overview of all agents and calls
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Active Agents"
          value={`${data.activeAgents}/${data.totalAgents}`}
          subtitle="Agents online now"
          icon={Bot}
          accent="violet"
        />
        <KPICard
          title="Active Calls"
          value={data.activeCalls}
          subtitle="In progress"
          icon={Phone}
          accent="emerald"
        />
        <KPICard
          title="Calls Today"
          value={data.callsToday}
          subtitle="Total calls made"
          icon={CalendarDays}
          accent="blue"
        />
        <KPICard
          title="Avg Duration"
          value={formatDuration(data.avgCallDuration)}
          subtitle="Per call"
          icon={Clock}
          accent="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <LanguageChart data={data.languageDistribution} />
        </div>
        <div>
          <SuccessRateChart
            successRate={data.overallSuccessRate}
            meetingsBooked={data.meetingsBooked}
          />
        </div>
      </div>

      {/* Bottom row: Active agents + Recent calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active agents */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Agents</h3>
            <Link
              href="/agents"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {activeAgents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 text-xs font-semibold">
                    {agent.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{agent.name}</p>
                  {agent.currentCall && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      On call · {agent.currentCall.company}
                    </p>
                  )}
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusStyle[agent.status])}>
                  {agent.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent calls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Calls</h3>
            <Link
              href="/calls"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <Link
                key={call.id}
                href={`/calls/${call.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{call.company}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{call.agentName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      call.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : call.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    )}
                  >
                    {call.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
