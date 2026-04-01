export interface DashboardData {
  activeAgents: number;
  totalAgents: number;
  activeCalls: number;
  callsToday: number;
  avgCallDuration: number;
  overallSuccessRate: number;
  meetingsBooked: number;
  languageDistribution: Record<string, number>;
}

export type AgentStatus = 'active' | 'idle' | 'error';

export interface CurrentCall {
  id: string;
  company: string;
  duration: number;
  sentiment: string;
}

export interface AgentMetrics {
  totalCalls: number;
  successRate: number;
  avgCallDuration: number;
  callsToday: number;
  conversionRate: number;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  language: string;
  currentCall: CurrentCall | null;
  metrics: AgentMetrics;
  error?: string;
  createdAt: string;
  lastActive: string;
}

export type CallStatus = 'in-progress' | 'completed' | 'failed';
export type CallDirection = 'inbound' | 'outbound';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface TranscriptEntry {
  speaker: 'agent' | 'contact';
  text: string;
  timestamp: number;
  sentiment: string;
}

export interface Call {
  id: string;
  agentId: string;
  agentName: string;
  company: string;
  contact: string;
  direction: CallDirection;
  status: CallStatus;
  startTime: string;
  endTime?: string;
  duration: number;
  language: string;
  sentiment: SentimentType;
  outcome: string | null;
  transcript?: TranscriptEntry[];
}
