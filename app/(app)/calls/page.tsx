import { getCalls } from '@/lib/data';
import { CallsTable } from '@/components/calls/CallsTable';

export const metadata = { title: 'Calls — Agent Monitor' };

export default function CallsPage() {
  const calls = getCalls();

  const completed = calls.filter((c) => c.status === 'completed').length;
  const inProgress = calls.filter((c) => c.status === 'in-progress').length;

  return (
    <div className="p-6 md:p-8 pt-14 md:pt-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calls</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {calls.length} calls in history
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-300">{inProgress} in progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">{completed} completed</span>
          </div>
        </div>
      </div>

      <CallsTable calls={calls} />
    </div>
  );
}
