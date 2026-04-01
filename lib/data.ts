import dashboardData from '../dashboard.json';
import agentsData from '../agents.json';
import callsData from '../calls.json';
import type { DashboardData, Agent, Call } from '@/types';

export function getDashboard(): DashboardData {
  return dashboardData as DashboardData;
}

export function getAgents(): Agent[] {
  return agentsData as Agent[];
}

export function getAgent(id: string): Agent | undefined {
  return (agentsData as Agent[]).find((a) => a.id === id);
}

export function getCalls(): Call[] {
  return callsData as Call[];
}

export function getCall(id: string): Call | undefined {
  return (callsData as Call[]).find((c) => c.id === id);
}

export function getCallsByAgent(agentId: string): Call[] {
  return (callsData as Call[]).filter((c) => c.agentId === agentId);
}
