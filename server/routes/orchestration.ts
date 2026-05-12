import { Router, Request, Response } from 'express';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

type ModelTier = 'free' | 'standard' | 'premium';
type TaskState = 'queued' | 'running' | 'done' | 'failed' | 'blocked';
type TaskType =
  | 'research'
  | 'planning'
  | 'implementation'
  | 'review'
  | 'qa'
  | 'compliance'
  | 'documentation';

interface AssistantExecutionProfile {
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

interface CollaborationEdge {
  from: string;
  to: string;
  reason: string;
}

interface OrchestrationTask {
  id: string;
  assistantId: string;
  taskType: TaskType;
  title: string;
  state: TaskState;
  requestedTier: ModelTier;
  blockedReason: string | null;
  createdAt: string;
}

interface OrchestrationMetrics {
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

interface PersistedOrchestrationState {
  weeklyPremiumRemaining: number;
  businessDaysRemaining: number;
  premiumConsumedToday: number;
  tasks: OrchestrationTask[];
}

const ASSISTANT_EXECUTION_PROFILES: Record<string, AssistantExecutionProfile> = {
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

const COLLABORATION_GRAPH: CollaborationEdge[] = [
  { from: 'linda', to: 'henry', reason: 'Conversation events to immutable timeline' },
  { from: 'henry', to: 'katherine', reason: 'Compliance anomalies to QA guard' },
  { from: 'katherine', to: 'mira', reason: 'Validated defects and action items' },
  { from: 'mira', to: 'una', reason: 'Feature output to UX refinement' },
  { from: 'una', to: 'katherine', reason: 'UX updates to regression checks' },
];

const orchestrationTasks: OrchestrationTask[] = [];
const TASK_STATES: TaskState[] = ['queued', 'running', 'done', 'failed', 'blocked'];
const TASK_STATE_TRANSITIONS: Record<TaskState, TaskState[]> = {
  queued: ['running', 'blocked', 'failed'],
  running: ['done', 'failed', 'blocked'],
  done: [],
  failed: ['queued', 'blocked'],
  blocked: ['queued', 'failed'],
};

const ASSISTANT_ENDPOINT_CONTRACT = {
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

let weeklyPremiumRemaining = 48;
let businessDaysRemaining = 5;
let premiumConsumedToday = 0;

const ORCHESTRATION_STATE_FILE = path.join(process.cwd(), 'logs', 'orchestration-state.json');

function computeMetrics(tasks: OrchestrationTask[]): OrchestrationMetrics {
  const totalTasks = tasks.length;
  const queuedTasks = tasks.filter(task => task.state === 'queued').length;
  const runningTasks = tasks.filter(task => task.state === 'running').length;
  const doneTasks = tasks.filter(task => task.state === 'done').length;
  const failedTasks = tasks.filter(task => task.state === 'failed').length;
  const blockedTasks = tasks.filter(task => task.state === 'blocked').length;
  const premiumTasks = tasks.filter(task => task.requestedTier === 'premium').length;
  const standardTasks = tasks.filter(task => task.requestedTier === 'standard').length;
  const freeTasks = tasks.filter(task => task.requestedTier === 'free').length;

  return {
    totalTasks,
    queuedTasks,
    runningTasks,
    doneTasks,
    failedTasks,
    blockedTasks,
    premiumTasks,
    standardTasks,
    freeTasks,
    lastTaskCreatedAt: tasks.length > 0 ? tasks[0].createdAt : null,
  };
}

function persistState(): void {
  try {
    const dirPath = path.dirname(ORCHESTRATION_STATE_FILE);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const payload: PersistedOrchestrationState = {
      weeklyPremiumRemaining,
      businessDaysRemaining,
      premiumConsumedToday,
      tasks: orchestrationTasks.slice(0, 500),
    };

    writeFileSync(ORCHESTRATION_STATE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch {
    // Persistence failures should never break orchestration APIs.
  }
}

function hydrateState(): void {
  try {
    if (!existsSync(ORCHESTRATION_STATE_FILE)) {
      return;
    }

    const fileContents = readFileSync(ORCHESTRATION_STATE_FILE, 'utf-8');
    const parsed = JSON.parse(fileContents) as Partial<PersistedOrchestrationState>;

    if (typeof parsed.weeklyPremiumRemaining === 'number' && parsed.weeklyPremiumRemaining >= 0) {
      weeklyPremiumRemaining = Math.floor(parsed.weeklyPremiumRemaining);
    }

    if (typeof parsed.businessDaysRemaining === 'number' && parsed.businessDaysRemaining >= 0) {
      businessDaysRemaining = Math.floor(parsed.businessDaysRemaining);
    }

    if (typeof parsed.premiumConsumedToday === 'number' && parsed.premiumConsumedToday >= 0) {
      premiumConsumedToday = Math.floor(parsed.premiumConsumedToday);
    }

    if (Array.isArray(parsed.tasks)) {
      orchestrationTasks.splice(0, orchestrationTasks.length, ...parsed.tasks.slice(0, 500));
    }
  } catch {
    // Corrupt state is ignored safely and re-created on next successful mutation.
  }
}

hydrateState();

function calculateDailyPremiumCap(): number {
  if (businessDaysRemaining <= 0) return 0;
  return Math.max(0, Math.floor(weeklyPremiumRemaining / businessDaysRemaining));
}

function getTaskState(profile: AssistantExecutionProfile, requestedTier: ModelTier) {
  const dailyCap = calculateDailyPremiumCap();

  if (requestedTier === 'premium') {
    if (!profile.modelPolicy.premiumAllowed) {
      return {
        state: 'blocked' as TaskState,
        blockedReason: 'Assistant policy forbids premium execution for this role.',
      };
    }

    if (premiumConsumedToday >= dailyCap) {
      return {
        state: 'blocked' as TaskState,
        blockedReason: 'Daily premium cap exhausted. Task should be queued for next cycle.',
      };
    }

    premiumConsumedToday += 1;
  }

  return { state: 'queued' as TaskState, blockedReason: null };
}

router.get(
  '/status',
  asyncHandler(async (_req: Request, res: Response) => {
    const dailyCap = calculateDailyPremiumCap();

    res.json({
      success: true,
      data: {
        profiles: ASSISTANT_EXECUTION_PROFILES,
        collaborationGraph: COLLABORATION_GRAPH,
        quota: {
          weeklyPremiumRemaining,
          businessDaysRemaining,
          dailyCap,
          premiumConsumedToday,
          premiumRemainingToday: Math.max(0, dailyCap - premiumConsumedToday),
        },
        metrics: computeMetrics(orchestrationTasks),
        tasks: orchestrationTasks.slice(0, 50),
      },
    });
  })
);

router.get(
  '/metrics',
  asyncHandler(async (_req: Request, res: Response) => {
    const dailyCap = calculateDailyPremiumCap();
    res.json({
      success: true,
      data: {
        quota: {
          weeklyPremiumRemaining,
          businessDaysRemaining,
          dailyCap,
          premiumConsumedToday,
          premiumRemainingToday: Math.max(0, dailyCap - premiumConsumedToday),
        },
        metrics: computeMetrics(orchestrationTasks),
      },
    });
  })
);

router.get(
  '/tasks',
  asyncHandler(async (req: Request, res: Response) => {
    const assistantId = typeof req.query.assistantId === 'string' ? req.query.assistantId : null;

    const filtered = assistantId
      ? orchestrationTasks.filter(task => task.assistantId === assistantId)
      : orchestrationTasks;

    res.json({ success: true, data: filtered.slice(0, 50) });
  })
);

router.get(
  '/contracts/assistant-endpoints',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        ...ASSISTANT_ENDPOINT_CONTRACT,
        generatedAt: new Date().toISOString(),
      },
    });
  })
);

router.post(
  '/tasks',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const { assistantId, taskType, title, requestedTier } = req.body as {
      assistantId?: string;
      taskType?: TaskType;
      title?: string;
      requestedTier?: ModelTier;
    };

    if (!assistantId || !taskType || !title) {
      throw new AppError('assistantId, taskType, and title are required', 400);
    }

    const profile = Object.values(ASSISTANT_EXECUTION_PROFILES).find(
      candidate => candidate.id === assistantId
    );
    if (!profile) {
      throw new AppError(`Unknown assistant '${assistantId}'`, 404);
    }

    if (!profile.taskTypes.includes(taskType)) {
      throw new AppError(
        `Task type '${taskType}' is not allowed for assistant '${assistantId}'`,
        400
      );
    }

    const tier = requestedTier ?? profile.modelPolicy.defaultTier;
    const statusInfo = getTaskState(profile, tier);

    const task: OrchestrationTask = {
      id: `orch_${Date.now()}`,
      assistantId,
      taskType,
      title: title.trim(),
      state: statusInfo.state,
      requestedTier: tier,
      blockedReason: statusInfo.blockedReason,
      createdAt: new Date().toISOString(),
    };

    orchestrationTasks.unshift(task);
    persistState();

    res.status(201).json({ success: true, data: task });
  })
);

router.patch(
  '/tasks/:id/state',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { state, blockedReason } = req.body as { state?: TaskState; blockedReason?: string };

    if (!state) {
      throw new AppError('state is required', 400);
    }

    if (!TASK_STATES.includes(state)) {
      throw new AppError(`Invalid task state '${state}'`, 400);
    }

    const task = orchestrationTasks.find(item => item.id === id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const allowedNext = TASK_STATE_TRANSITIONS[task.state];
    if (!allowedNext.includes(state)) {
      throw new AppError(`Invalid state transition from '${task.state}' to '${state}'`, 400);
    }

    task.state = state;
    task.blockedReason =
      state === 'blocked'
        ? typeof blockedReason === 'string' && blockedReason.trim().length > 0
          ? blockedReason.trim()
          : (task.blockedReason ?? 'Blocked by orchestration policy')
        : null;

    persistState();

    res.json({ success: true, data: task });
  })
);

router.put(
  '/quota',
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      weeklyPremiumRemaining: weeklyInput,
      businessDaysRemaining: daysInput,
      premiumConsumedToday: consumedInput,
    } = req.body as {
      weeklyPremiumRemaining?: number;
      businessDaysRemaining?: number;
      premiumConsumedToday?: number;
    };

    if (typeof weeklyInput === 'number' && weeklyInput >= 0) {
      weeklyPremiumRemaining = Math.floor(weeklyInput);
    }
    if (typeof daysInput === 'number' && daysInput >= 0) {
      businessDaysRemaining = Math.floor(daysInput);
    }
    if (typeof consumedInput === 'number' && consumedInput >= 0) {
      premiumConsumedToday = Math.floor(consumedInput);
    }

    persistState();

    res.json({
      success: true,
      data: {
        weeklyPremiumRemaining,
        businessDaysRemaining,
        premiumConsumedToday,
        dailyCap: calculateDailyPremiumCap(),
      },
    });
  })
);

export default router;
