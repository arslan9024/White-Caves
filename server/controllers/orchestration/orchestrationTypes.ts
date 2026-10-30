import { Request } from 'express';

export type RouteRequest = Request<Record<string, string>>;

export type ModelTier = 'free' | 'standard' | 'premium';
export type TaskState = 'queued' | 'running' | 'done' | 'failed' | 'blocked';
export type TaskType =
  | 'research'
  | 'planning'
  | 'implementation'
  | 'review'
  | 'qa'
  | 'compliance'
  | 'documentation';

export interface AssistantExecutionProfile {
  id: string;
  role: string;
  modelPolicy: {
    defaultTier: ModelTier;
    premiumAllowed: boolean;
    requiresContextGate: boolean;
  };
  capabilities: string[];
  taskTypes: TaskType[];
}

export interface CollaborationEdge {
  from: string;
  to: string;
  reason: string;
}

export interface OrchestrationTask {
  id: string;
  assistantId: string;
  taskType: TaskType;
  title: string;
  state: TaskState;
  requestedTier: ModelTier;
  blockedReason: string | null;
  createdAt: string;
}

export interface OrchestrationMetrics {
  totalTasks: number;
  queuedTasks: number;
  runningTasks: number;
  doneTasks: number;
  failedTasks: number;
  blockedTasks: number;
  premiumTasks: number;
  standardTasks: number;
  freeTasks: number;
  lastTaskCreatedAt: string | null;
}

export interface SnapshotMeta {
  createdAt: string;
  label: string | null;
}

export interface PersistedOrchestrationState {
  weeklyPremiumRemaining: number;
  businessDaysRemaining: number;
  premiumConsumedToday: number;
  tasks: OrchestrationTask[];
  snapshotMeta?: SnapshotMeta;
}

export interface OrchestrationSnapshotSummary {
  fileName: string;
  createdAt: string;
  taskCount: number;
  label: string | null;
}

export interface OrchestrationSnapshotDetail extends OrchestrationSnapshotSummary {
  quota: {
    weeklyPremiumRemaining: number;
    businessDaysRemaining: number;
    premiumConsumedToday: number;
  };
  metrics: OrchestrationMetrics;
  tasks: OrchestrationTask[];
}

export interface SnapshotHistoryFacet {
  label: string;
  count: number;
}

export const ASSISTANT_EXECUTION_PROFILES: Record<string, AssistantExecutionProfile> = {
  linda: {
    id: 'linda',
    role: 'WhatsApp Orchestration Agent',
    modelPolicy: {
      defaultTier: 'standard',
      premiumAllowed: false,
      requiresContextGate: false,
    },
    capabilities: [
      'conversation_routing',
      'lead_intake',
      'handoff_to_sales',
      'template_execution',
      'message_audit',
    ],
    taskTypes: ['research', 'planning', 'documentation', 'review'],
  },
  henry: {
    id: 'henry',
    role: 'Record Keeper & Compliance Agent',
    modelPolicy: {
      defaultTier: 'standard',
      premiumAllowed: false,
      requiresContextGate: false,
    },
    capabilities: [
      'audit_trail_validation',
      'compliance_review',
      'timeline_tracking',
      'risk_flagging',
      'report_packaging',
    ],
    taskTypes: ['review', 'compliance', 'documentation', 'qa'],
  },
  mira: {
    id: 'mira',
    role: 'Lead Full-Stack Implementer',
    modelPolicy: {
      defaultTier: 'premium',
      premiumAllowed: true,
      requiresContextGate: true,
    },
    capabilities: ['feature_build', 'api_design', 'integration'],
    taskTypes: ['implementation', 'qa', 'review'],
  },
  una: {
    id: 'una',
    role: 'Luxury UI/UX Specialist',
    modelPolicy: {
      defaultTier: 'premium',
      premiumAllowed: true,
      requiresContextGate: true,
    },
    capabilities: ['visual_design', 'ux_patterns', 'interaction_design'],
    taskTypes: ['planning', 'implementation', 'review'],
  },
  katherine: {
    id: 'katherine',
    role: 'QA & Runtime Guard Lead',
    modelPolicy: {
      defaultTier: 'standard',
      premiumAllowed: true,
      requiresContextGate: true,
    },
    capabilities: ['runtime_validation', 'test_strategy', 'regression_guard'],
    taskTypes: ['qa', 'review', 'compliance'],
  },
};

export const COLLABORATION_GRAPH: CollaborationEdge[] = [
  { from: 'linda', to: 'henry', reason: 'Conversation events to immutable timeline' },
  { from: 'henry', to: 'katherine', reason: 'Compliance anomalies to QA guard' },
  { from: 'katherine', to: 'mira', reason: 'Validated defects and action items' },
  { from: 'mira', to: 'una', reason: 'Feature output to UX refinement' },
  { from: 'una', to: 'katherine', reason: 'UX updates to regression checks' },
];

export const TASK_STATES: TaskState[] = ['queued', 'running', 'done', 'failed', 'blocked'];
export const TASK_STATE_TRANSITIONS: Record<TaskState, TaskState[]> = {
  queued: ['running', 'blocked', 'failed'],
  running: ['done', 'failed', 'blocked'],
  done: [],
  failed: ['queued', 'blocked'],
  blocked: ['queued', 'failed'],
};

export const ASSISTANT_ENDPOINT_CONTRACT = {
  mountedPrefixes: [
    '/api/properties',
    '/api/leasing-inventory',
    '/api/documents',
    '/api/finance',
    '/api/invoices/lease',
    '/api/transactions',
    '/api/homepage',
    '/api/analytics',
    '/api/communications',
    '/api/orchestration',
    '/api/activities',
    '/api/compliance',
    '/api/nadia',
    '/api/linda',
    '/api/leads',
    '/api/crm',
    '/api/leases',
    '/api/tenants',
    '/api/maintenance',
    '/api/users',
    '/api/job-applications',
    '/api/integrations',
    '/api/assistants',
  ] as const,
  activeAssistantIds: [
    'mary',
    'theodora',
    'olivia',
    'zoe',
    'laila',
    'nadia',
    'linda',
    'sophia',
    'daisy',
    'clara',
    'nina',
    'nancy',
    'aurora',
    'henry',
  ] as const,
};
