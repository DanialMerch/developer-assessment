import { getCall } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  formatDuration,
  formatDate,
  cn,
  outcomeLabel,
} from '@/lib/utils';
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  User,
  Clock,
  Globe,
  CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import type { TranscriptEntry } from '@/types';

const STATUS_STYLE: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SENTIMENT_STYLE: Record<string, string> = {
  positive: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  neutral: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
  negative: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
};

const OUTCOME_STYLE: Record<string, string> = {
  meeting_booked: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  callback_requested: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  not_interested: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const call = getCall(id);
  return { title: call ? `${call.company} — Agent Monitor` : 'Call Not Found' };
}

function TranscriptBubble({ entry }: { entry: TranscriptEntry }) {
  const isAgent = entry.speaker === 'agent';
  return (
    <div className={cn('flex gap-3', isAgent ? 'flex-row' : 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
          isAgent
            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
        )}
      >
        {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={cn('flex flex-col gap-1 max-w-[75%]', isAgent ? 'items-start' : 'items-end')}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
            {entry.speaker === 'agent' ? 'Agent' : 'Contact'}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {entry.timestamp}s
          </span>
          <span
            className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-medium capitalize',
              SENTIMENT_STYLE[entry.sentiment] ??
                'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700',
            )}
          >
            {entry.sentiment}
          </span>
        </div>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isAgent
              ? 'bg-violet-600 text-white rounded-tl-sm'
              : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-tr-sm',
          )}
        >
          {entry.text}
        </div>
      </div>
    </div>
  );
}

export default async function CallDetailPage({ params }: PageProps) {
  const { id } = await params;
  const call = getCall(id);

  if (!call) notFound();

  return (
    <div className="p-6 md:p-8 pt-14 md:pt-8">
      {/* Back */}
      <Link
        href="/calls"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calls
      </Link>

      {/* Header card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{call.company}</h1>
              <span
                className={cn(
                  'text-xs px-2.5 py-0.5 rounded-full font-medium',
                  STATUS_STYLE[call.status] ??
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
                )}
              >
                {call.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Contact: {call.contact}</p>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg self-start">
            {call.id}
          </span>
        </div>

        {/* Metadata grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-5 border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Agent</p>
            <Link
              href={`/agents/${call.agentId}`}
              className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
            >
              {call.agentName}
            </Link>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Direction</p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white capitalize">
              {call.direction === 'outbound' ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
              )}
              {call.direction}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Language
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{call.language}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Duration
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {formatDuration(call.duration)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sentiment</p>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                SENTIMENT_STYLE[call.sentiment] ??
                  'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-700',
              )}
            >
              {call.sentiment}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Outcome</p>
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
              <span className="text-sm text-slate-400">—</span>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            Started: {formatDate(call.startTime)}
          </span>
          {call.endTime && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Ended: {formatDate(call.endTime)}
            </span>
          )}
        </div>
      </div>

      {/* Transcript */}
      {call.transcript && call.transcript.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Conversation Transcript
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {call.transcript.length} messages
              </p>
            </div>
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                </div>
                Agent
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-3 h-3 text-slate-500" />
                </div>
                Contact
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {call.transcript.map((entry, i) => (
              <TranscriptBubble key={i} entry={entry} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No transcript available for this call.
          </p>
        </div>
      )}
    </div>
  );
}
