// FILE: src/components/crm/AiAssistantManager/AiAssistantManager.types.ts
/**
 * White Caves Real Estate LLC - AI Assistants Management System (AIAMS) Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Types)
 * Single Purpose File Law: < 350 lines
 */

export type AiAgentTier = 'EXECUTIVE' | 'MANAGER' | 'SUPERVISOR' | 'SPECIALIST';

export type AiAgentStatus = 'ACTIVE' | 'OPTIMAL' | 'STANDBY' | 'BUSY';

export interface AiAgentRecord {
  id: string;
  agentId: string;
  code: string;
  name: string;
  role: string;
  departmentId: string;
  department: string;
  tier: AiAgentTier;
  status: AiAgentStatus;
  model: string;
  specialty: string;
  systemPrompt: string;
  capabilities: string[];
  assignedTasks: string[];
  slaResponseTime: string;
  accuracyRate: number;
  activeWorkload: number;
  avatar?: string;
}

export interface AiAgentFormPayload {
  agentId?: string;
  code?: string;
  name: string;
  role: string;
  departmentId?: string;
  department: string;
  tier: AiAgentTier;
  status: AiAgentStatus;
  model: string;
  specialty?: string;
  systemPrompt?: string;
  capabilities?: string[];
  assignedTasks?: string[];
  slaResponseTime?: string;
  accuracyRate?: number;
  activeWorkload?: number;
}

export interface AiAssistantManagerMetrics {
  total: number;
  activeCount: number;
  executivesAndManagers: number;
  supervisors: number;
  totalWorkload: number;
}
