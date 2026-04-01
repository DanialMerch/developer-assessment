'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Agent } from '@/types';
import { formatDuration, formatPercent, formatDate, cn } from '@/lib/utils';
import { Search, ChevronRight, Phone, AlertCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  idle: {
    label: 'Idle',
    cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  error: {
    label: 'Error',
    cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

interface Props {
  agents: Agent[];
}

export function AgentsTable({ agents }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  const languages = useMemo(
    () => Array.from(new Set(agents.map((a) => a.language))).sort(),
    [agents],
  );

  const filtered = useMemo(
    () =>
      agents.filter((a) => {
        const q = search.toLowerCase();
        const matchSearch =
          a.name.toLowerCase().includes(q) || a.language.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        const matchLang = languageFilter === 'all' || a.language === languageFilter;
        return matchSearch && matchStatus && matchLang;
      }),
    [agents, search, statusFilter, languageFilter],
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search agents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="error">Error</option>
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              {[
                'Agent',
                'Status',
                'Language',
                'Calls Today',
                'Success Rate',
                'Avg Duration',
                'Last Active',
                '',
              ].map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    'text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3',
                    i === 3 && 'hidden md:table-cell text-right',
                    i === 4 && 'hidden lg:table-cell text-right',
                    i === 5 && 'hidden lg:table-cell text-right',
                    i === 6 && 'hidden xl:table-cell text-right',
                    i === 7 && 'text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.map((agent) => {
              const sc = STATUS_CONFIG[agent.status];
              return (
                <tr
                  key={agent.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  {/* Agent */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 text-sm font-semibold">
                          {agent.name.charAt(0)}
                        </div>
                        <span
                          className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800',
                            sc.dot,
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                          {agent.name}
                        </p>
                        {agent.currentCall ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            {agent.currentCall.company}
                          </p>
                        ) : agent.error ? (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3" />
                            Service error
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Idle
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        sc.cls,
                      )}
                    >
                      {sc.label}
                    </span>
                  </td>

                  {/* Language */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{agent.language}</span>
                  </td>

                  {/* Calls Today */}
                  <td className="px-4 py-4 text-right hidden md:table-cell">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {agent.metrics.callsToday}
                    </span>
                  </td>

                  {/* Success Rate */}
                  <td className="px-4 py-4 text-right hidden lg:table-cell">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatPercent(agent.metrics.successRate)}
                    </span>
                  </td>

                  {/* Avg Duration */}
                  <td className="px-4 py-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {formatDuration(agent.metrics.avgCallDuration)}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="px-4 py-4 text-right hidden xl:table-cell">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(agent.lastActive)}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/agents/${agent.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                    >
                      View
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No agents match your filters.</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filtered.length} of {agents.length} agents
        </p>
      </div>
    </div>
  );
}
