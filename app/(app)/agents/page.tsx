import { getAgents } from '@/lib/data';
import { AgentsTable } from '@/components/agents/AgentsTable';

export const metadata = { title: 'Agents — Agent Monitor' };

export default function AgentsPage() {
  const agents = getAgents();

  const active = agents.filter((a) => a.status === 'active').length;
  const idle = agents.filter((a) => a.status === 'idle').length;
  const error = agents.filter((a) => a.status === 'error').length;

  return (
    <div className="p-6 md:p-8 pt-14 md:pt-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {agents.length} agents configured
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">{active} active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">{idle} idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-300">{error} error</span>
          </div>
        </div>
      </div>

      <AgentsTable agents={agents} />
    </div>
  );
}
