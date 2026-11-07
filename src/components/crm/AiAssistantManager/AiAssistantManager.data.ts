// FILE: src/components/crm/AiAssistantManager/AiAssistantManager.data.ts
/**
 * White Caves Real Estate LLC - AI Assistants Management System (AIAMS) Seed & Storage
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Data & Persistence)
 * Single Purpose File Law: < 350 lines
 */

import {
  EXECUTIVE_COMMAND_1,
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
} from '../../../data/assistants108Registry.data';
import type { AiAgentRecord } from './AiAssistantManager.types';

export const AIAMS_STORAGE_KEY = 'wc_aiams_agents_v1';
export const AIAMS_SYNC_EVENT = 'wc-aiams-agents-updated';

export const AI_DEPARTMENTS_OPTIONS = [
  { id: 'all', name: 'All 12 Corporate Departments' },
  { id: 'executive_command', name: 'Floor 13 · Executive Command (MD & COO)' },
  ...CORPORATE_DEPARTMENTS_12.map(d => ({
    id: d.id,
    name: `${d.code} · ${d.name}`,
  })),
];

export const AI_MODELS_LIST = [
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'claude-3-5-sonnet',
  'gpt-4o',
];

function buildCanonicalAiAgentsSeed(): AiAgentRecord[] {
  const zoeAgent: AiAgentRecord = {
    id: 'ai-zoe-001',
    agentId: EXECUTIVE_COMMAND_1.executiveAi.id,
    code: EXECUTIVE_COMMAND_1.executiveAi.code,
    name: EXECUTIVE_COMMAND_1.executiveAi.name,
    role: EXECUTIVE_COMMAND_1.executiveAi.title,
    departmentId: 'executive_command',
    department: 'Executive Governance & Sovereign Operations',
    tier: 'EXECUTIVE',
    status: 'OPTIMAL',
    model: 'gemini-1.5-pro',
    specialty: EXECUTIVE_COMMAND_1.executiveAi.role,
    systemPrompt:
      'Directs the 1-12-108 autonomous AI mesh and executes P0 SLA workflows under Managing Director authority.',
    capabilities: [
      '1-12-108 Mesh Orchestration',
      '15-Min SLA Enforcement',
      'Cross-Department Governance',
      'Statutory Compliance Audit',
    ],
    assignedTasks: EXECUTIVE_COMMAND_1.executiveAi.responsibilities,
    slaResponseTime: '< 2s',
    accuracyRate: 99.9,
    activeWorkload: 28,
    avatar: EXECUTIVE_COMMAND_1.executiveAi.avatar,
  };

  const lindaAgent: AiAgentRecord = {
    id: 'ai-linda-001',
    agentId: 'linda',
    code: 'BOT-LINDA',
    name: 'AI Linda',
    role: 'Autonomous WhatsApp Broker & Lead Nurturer (v2.0)',
    departmentId: 'performance_marketing',
    department: 'Performance Marketing & Lead Generation',
    tier: 'SPECIALIST',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash',
    specialty: 'Multi-Account WhatsApp Outreach & Lead Qualification',
    systemPrompt:
      'Sovereign conversational AI agent driving luxury lead conversions, bilingual EN/AR qualification, and automated viewing bookings.',
    capabilities: [
      'WhatsApp Business API',
      'Bilingual EN/AR',
      'Area Owner Outreach',
      'Lead Scoring',
    ],
    assignedTasks: [
      'Instant 60-second WhatsApp lead qualification',
      'Automated viewing scheduling & CRM sync',
    ],
    slaResponseTime: '< 3s',
    accuracyRate: 99.6,
    activeWorkload: 18,
    avatar: 'https://ui-avatars.com/api/?name=Linda+Bot&background=25D366&color=fff',
  };

  const managerAgents: AiAgentRecord[] = CORPORATE_DEPARTMENTS_12.map((dept, idx) => ({
    id: `ai-mgr-${String(idx + 1).padStart(2, '0')}`,
    agentId: dept.managerAi.id,
    code: `AI-MGR-${String(idx + 1).padStart(2, '0')}`,
    name: dept.managerAi.name,
    role: dept.managerAi.title,
    departmentId: dept.id,
    department: dept.name,
    tier: 'MANAGER',
    status: 'OPTIMAL',
    model: 'gemini-1.5-pro',
    specialty: `${dept.name} Directorate & 9-Squad Supervision`,
    systemPrompt: dept.description,
    capabilities: ['Department Orchestration', '9-Squad SLA Oversight', 'Statutory Verification'],
    assignedTasks: [dept.description],
    slaResponseTime: '< 4s',
    accuracyRate: 99.8,
    activeWorkload: 12 + (idx % 7),
    avatar: dept.managerAi.avatar,
  }));

  const supervisorAgents: AiAgentRecord[] = SUPERVISORS_108.map(sup => ({
    id: `ai-${sup.id}`,
    agentId: sup.id,
    code: sup.code,
    name: sup.name,
    role: sup.title,
    departmentId: sup.departmentId,
    department: sup.departmentName,
    tier: 'SUPERVISOR',
    status: sup.status === 'optimal' ? 'OPTIMAL' : sup.status === 'standby' ? 'STANDBY' : 'ACTIVE',
    model: 'gemini-1.5-flash',
    specialty: sup.specialty,
    systemPrompt: sup.description,
    capabilities: sup.capabilities,
    assignedTasks: sup.assignedTasks,
    slaResponseTime: sup.slaResponseTime,
    accuracyRate: sup.metrics.accuracyRate,
    activeWorkload: sup.metrics.tasksCompletedToday,
    avatar: sup.avatar,
  }));

  return [zoeAgent, lindaAgent, ...managerAgents, ...supervisorAgents];
}

export const INITIAL_AI_AGENTS_SEED: AiAgentRecord[] = buildCanonicalAiAgentsSeed();

export function loadAiAgentsFromStorage(): AiAgentRecord[] {
  if (typeof window === 'undefined') return INITIAL_AI_AGENTS_SEED;
  try {
    const raw = window.localStorage.getItem(AIAMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to canonical seed
  }
  return INITIAL_AI_AGENTS_SEED;
}

export function saveAiAgentsToStorage(agents: AiAgentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AIAMS_STORAGE_KEY, JSON.stringify(agents));
    window.dispatchEvent(new CustomEvent(AIAMS_SYNC_EVENT, { detail: agents }));
  } catch {
    // Ignore storage quota errors in test/restricted environments
  }
}
