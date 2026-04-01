'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Call } from '@/types';
import { formatDuration, formatDate, cn, outcomeLabel } from '@/lib/utils';
import { Search, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const STATUS_STYLE: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SENTIMENT_STYLE: Record<string, string> = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  neutral: 'text-slate-500 dark:text-slate-400',
  negative: 'text-red-500 dark:text-red-400',
};

const OUTCOME_STYLE: Record<string, string> = {
  meeting_booked: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  callback_requested: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  not_interested: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface Props {
  calls: Call[];
}

export function CallsTable({ calls }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const outcomes = useMemo(
    () =>
      Array.from(new Set(calls.map((c) => c.outcome).filter(Boolean) as string[])).sort(),
    [calls],
  );

  const filtered = useMemo(
    () =>
      calls.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch =
          c.company.toLowerCase().includes(q) ||
          c.contact.toLowerCase().includes(q) ||
          c.agentName.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchOutcome = outcomeFilter === 'all' || c.outcome === outcomeFilter;
        const matchDate =
          !dateFilter ||
          new Date(c.startTime).toISOString().startsWith(dateFilter);
        return matchSearch && matchStatus && matchOutcome && matchDate;
      }),
    [calls, search, statusFilter, outcomeFilter, dateFilter],
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      {/* Toolbar — kept outside overflow-hidden so date picker isn't clipped on mobile */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search company, contact, agent…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="min-w-[150px] w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
                aria-label="Clear date"
              >
                ×
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Outcomes</option>
            {outcomes.map((o) => (
              <option key={o} value={o}>
                {outcomeLabel(o)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table — overflow scoped here only, not on the outer card */}
      <div className="overflow-x-auto rounded-b-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              {[
                'Call',
                'Agent',
                'Direction',
                'Status',
                'Duration',
                'Sentiment',
                'Outcome',
                'Started',
                '',
              ].map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    'text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3',
                    i === 1 && 'hidden sm:table-cell',
                    i === 2 && 'hidden md:table-cell',
                    i === 4 && 'hidden md:table-cell text-right',
                    i === 5 && 'hidden lg:table-cell',
                    i === 6 && 'hidden lg:table-cell',
                    i === 7 && 'hidden xl:table-cell',
                    i === 8 && 'text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.map((call) => (
              <tr
                key={call.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/* Call / Company */}
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{call.company}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{call.contact}</p>
                </td>

                {/* Agent */}
                <td className="px-4 py-4 hidden sm:table-cell">
                  <Link
                    href={`/agents/${call.agentId}`}
                    className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    {call.agentName}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{call.language}</p>
                </td>

                {/* Direction */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {call.direction === 'outbound' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span className="capitalize">{call.direction}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'text-xs px-2.5 py-0.5 rounded-full font-medium',
                      STATUS_STYLE[call.status] ??
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    {call.status}
                  </span>
                </td>

                {/* Duration */}
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 text-right hidden md:table-cell">
                  {formatDuration(call.duration)}
                </td>

                {/* Sentiment */}
                <td
                  className={cn(
                    'px-4 py-4 text-sm font-medium capitalize hidden lg:table-cell',
                    SENTIMENT_STYLE[call.sentiment],
                  )}
                >
                  {call.sentiment}
                </td>

                {/* Outcome */}
                <td className="px-4 py-4 hidden lg:table-cell">
                  {call.outcome ? (
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        OUTCOME_STYLE[call.outcome] ??
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
                      )}
                    >
                      {outcomeLabel(call.outcome)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>

                {/* Started */}
                <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400 hidden xl:table-cell">
                  {formatDate(call.startTime)}
                </td>

                {/* Action */}
                <td className="px-4 py-4 text-right">
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

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No calls match your filters.</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filtered.length} of {calls.length} calls
        </p>
      </div>
    </div>
  );
}
