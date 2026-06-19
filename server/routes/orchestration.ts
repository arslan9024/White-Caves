import { Router, Request, Response } from 'express';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

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
  snapshotMeta?: SnapshotMeta;
}

interface SnapshotMeta {
  createdAt: string;
  label: string | null;
}

interface OrchestrationSnapshotSummary {
  fileName: string;
  createdAt: string;
  taskCount: number;
  label: string | null;
}

interface OrchestrationSnapshotDetail extends OrchestrationSnapshotSummary {
  quota: {
    weeklyPremiumRemaining: number;
    businessDaysRemaining: number;
    premiumConsumedToday: number;
  };
  metrics: OrchestrationMetrics;
  tasks: OrchestrationTask[];
}

interface SnapshotHistoryFacet {
  label: string;
  count: number;
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
const ORCHESTRATION_SNAPSHOT_DIR = path.join(process.cwd(), 'logs', 'orchestration-snapshots');

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

function buildPersistedState(snapshotMeta?: SnapshotMeta): PersistedOrchestrationState {
  const baseState: PersistedOrchestrationState = {
    weeklyPremiumRemaining,
    businessDaysRemaining,
    premiumConsumedToday,
    tasks: orchestrationTasks.slice(0, 500),
  };

  if (snapshotMeta) {
    baseState.snapshotMeta = snapshotMeta;
  }

  return baseState;
}

function ensureDir(dirPath: string): void {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs path built from process.cwd()
  if (!existsSync(dirPath)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs path built from process.cwd()
    mkdirSync(dirPath, { recursive: true });
  }
}

function writeStateToFile(filePath: string, snapshotMeta?: SnapshotMeta): void {
  const dirPath = path.dirname(filePath);
  ensureDir(dirPath);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs/snapshots path built from process.cwd()
  writeFileSync(filePath, JSON.stringify(buildPersistedState(snapshotMeta), null, 2), 'utf-8');
}

function persistState(): void {
  try {
    writeStateToFile(ORCHESTRATION_STATE_FILE);
  } catch {
    // Persistence failures should never break orchestration APIs.
  }
}

function applyPersistedState(parsed: Partial<PersistedOrchestrationState>): void {
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
}

function readStateFile(filePath: string): void {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs/snapshots path built from process.cwd()
  const fileContents = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(fileContents) as Partial<PersistedOrchestrationState>;
  applyPersistedState(parsed);
}

function hydrateState(): void {
  try {
    if (!existsSync(ORCHESTRATION_STATE_FILE)) {
      return;
    }

    readStateFile(ORCHESTRATION_STATE_FILE);
  } catch {
    // Corrupt state is ignored safely and re-created on next successful mutation.
  }
}

function getSnapshotFiles(): string[] {
  if (!existsSync(ORCHESTRATION_SNAPSHOT_DIR)) {
    return [];
  }

  return readdirSync(ORCHESTRATION_SNAPSHOT_DIR)
    .filter(fileName => fileName.endsWith('.json'))
    .sort((left, right) => right.localeCompare(left));
}

function getSnapshotFilePath(fileName: string): string {
  return path.join(ORCHESTRATION_SNAPSHOT_DIR, path.basename(fileName));
}

function readSnapshotDetail(fileName: string): OrchestrationSnapshotDetail {
  const normalizedFileName = path.basename(fileName);
  const snapshotFiles = getSnapshotFiles();

  if (!snapshotFiles.includes(normalizedFileName)) {
    throw new AppError('Snapshot not found', 404);
  }

  const filePath = getSnapshotFilePath(normalizedFileName);
  const parsed = JSON.parse(
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- fileName restricted to local snapshot directory entries
    readFileSync(filePath, 'utf-8')
  ) as Partial<PersistedOrchestrationState>;
  const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.slice(0, 500) : [];
  const fallbackCreatedAt = normalizedFileName
    .replace(/^orch-snapshot-/, '')
    .replace(/\.json$/, '');
  const createdAt =
    typeof parsed.snapshotMeta?.createdAt === 'string' && parsed.snapshotMeta.createdAt.length > 0
      ? parsed.snapshotMeta.createdAt
      : fallbackCreatedAt;
  const label =
    typeof parsed.snapshotMeta?.label === 'string' && parsed.snapshotMeta.label.length > 0
      ? parsed.snapshotMeta.label
      : null;

  return {
    fileName: normalizedFileName,
    createdAt,
    taskCount: tasks.length,
    label,
    quota: {
      weeklyPremiumRemaining:
        typeof parsed.weeklyPremiumRemaining === 'number' ? parsed.weeklyPremiumRemaining : 0,
      businessDaysRemaining:
        typeof parsed.businessDaysRemaining === 'number' ? parsed.businessDaysRemaining : 0,
      premiumConsumedToday:
        typeof parsed.premiumConsumedToday === 'number' ? parsed.premiumConsumedToday : 0,
    },
    metrics: computeMetrics(tasks),
    tasks,
  };
}

function listSnapshotSummaries(): OrchestrationSnapshotSummary[] {
  return getSnapshotFiles().map(fileName => {
    const fallbackCreatedAt = fileName.replace(/^orch-snapshot-/, '').replace(/\.json$/, '');
    try {
      const filePath = path.join(ORCHESTRATION_SNAPSHOT_DIR, fileName);
      const parsed = JSON.parse(
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- fileName restricted to local snapshot directory entries
        readFileSync(filePath, 'utf-8')
      ) as Partial<PersistedOrchestrationState>;
      const taskCount = Array.isArray(parsed.tasks) ? parsed.tasks.length : 0;
      const createdAt =
        typeof parsed.snapshotMeta?.createdAt === 'string' &&
        parsed.snapshotMeta.createdAt.length > 0
          ? parsed.snapshotMeta.createdAt
          : fallbackCreatedAt;
      const label =
        typeof parsed.snapshotMeta?.label === 'string' && parsed.snapshotMeta.label.length > 0
          ? parsed.snapshotMeta.label
          : null;

      return { fileName, createdAt, taskCount, label };
    } catch {
      return { fileName, createdAt: fallbackCreatedAt, taskCount: 0, label: null };
    }
  });
}

function exportSnapshot(label?: string): OrchestrationSnapshotSummary {
  ensureDir(ORCHESTRATION_SNAPSHOT_DIR);
  const normalizedLabel =
    typeof label === 'string' && label.trim().length > 0
      ? `-${label
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}`
      : '';
  const exportedAt = new Date().toISOString();
  const createdAtSlug = exportedAt.replace(/[:.]/g, '-');
  const fileName = `orch-snapshot-${createdAtSlug}${normalizedLabel}.json`;
  const filePath = path.join(ORCHESTRATION_SNAPSHOT_DIR, fileName);
  const snapshotMeta: SnapshotMeta = {
    createdAt: exportedAt,
    label: typeof label === 'string' && label.trim().length > 0 ? label.trim() : null,
  };

  writeStateToFile(filePath, snapshotMeta);

  return {
    fileName,
    createdAt: exportedAt,
    taskCount: orchestrationTasks.length,
    label: snapshotMeta.label,
  };
}

function restoreSnapshot(fileName?: string): OrchestrationSnapshotSummary {
  const snapshotFiles = getSnapshotFiles();
  const targetFile = fileName ? path.basename(fileName) : snapshotFiles[0];

  if (!targetFile) {
    throw new AppError('No orchestration snapshots available', 404);
  }

  if (!snapshotFiles.includes(targetFile)) {
    throw new AppError('Snapshot not found', 404);
  }

  const filePath = path.join(ORCHESTRATION_SNAPSHOT_DIR, targetFile);
  readStateFile(filePath);
  persistState();

  return (
    listSnapshotSummaries().find(snapshot => snapshot.fileName === targetFile) ?? {
      fileName: targetFile,
      createdAt: '',
      taskCount: orchestrationTasks.length,
      label: null,
    }
  );
}

function deleteSnapshot(fileName: string): OrchestrationSnapshotSummary {
  const snapshot = readSnapshotDetail(fileName);
  const filePath = getSnapshotFilePath(snapshot.fileName);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- fileName restricted to local snapshot directory entries
  unlinkSync(filePath);
  return {
    fileName: snapshot.fileName,
    createdAt: snapshot.createdAt,
    taskCount: snapshot.taskCount,
    label: snapshot.label,
  };
}

function buildSnapshotLabelFacets(
  snapshots: OrchestrationSnapshotSummary[]
): SnapshotHistoryFacet[] {
  const counts = new Map<string, number>();

  snapshots.forEach(snapshot => {
    const key = snapshot.label ?? 'unlabeled';
    const existing = counts.get(key) ?? 0;
    counts.set(key, existing + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count);
}

function buildRestoreRecommendation(input: {
  totalTasks: number;
  runningTasks: number;
  failedTasks: number;
  premiumConsumedToday: number;
}): {
  decision: 'safe' | 'caution' | 'risky';
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 100;

  if (Math.abs(input.totalTasks) >= 20) {
    score -= 30;
    reasons.push('Large task volume delta detected (>=20).');
  } else if (Math.abs(input.totalTasks) >= 10) {
    score -= 15;
    reasons.push('Moderate task volume delta detected (>=10).');
  }

  if (Math.abs(input.runningTasks) >= 3) {
    score -= 25;
    reasons.push('Running task delta is high (>=3).');
  }

  if (input.failedTasks > 0) {
    score -= 20;
    reasons.push('Target introduces additional failed tasks.');
  }

  if (input.premiumConsumedToday > 0) {
    score -= 15;
    reasons.push('Target increases premium consumption for today.');
  }

  score = Math.max(0, Math.min(100, score));

  if (reasons.length === 0) {
    reasons.push('No material risk deltas detected.');
  }

  const decision: 'safe' | 'caution' | 'risky' =
    score >= 80 ? 'safe' : score >= 55 ? 'caution' : 'risky';

  return { decision, score, reasons };
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
  '/snapshots',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: listSnapshotSummaries().slice(0, 20),
    });
  })
);

router.get(
  '/snapshots/history',
  asyncHandler(async (req: Request, res: Response) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const labelQuery = typeof req.query.label === 'string' ? req.query.label.trim() : '';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const rawOffset = Number.parseInt(String(req.query.offset ?? '0'), 10);
    const rawLimit = Number.parseInt(String(req.query.limit ?? '10'), 10);
    const offset = Number.isFinite(rawOffset) ? Math.max(0, rawOffset) : 0;
    const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, rawLimit)) : 10;

    const all = listSnapshotSummaries();
    const ordered = all.slice().sort((left, right) => {
      const leftValue = left.createdAt;
      const rightValue = right.createdAt;
      const compare = leftValue.localeCompare(rightValue);
      return order === 'asc' ? compare : -compare;
    });
    const searched =
      q.length > 0
        ? ordered.filter(snapshot => {
            const label = snapshot.label ? snapshot.label.toLowerCase() : '';
            return (
              snapshot.fileName.toLowerCase().includes(q) ||
              snapshot.createdAt.toLowerCase().includes(q) ||
              label.includes(q)
            );
          })
        : ordered;

    const normalizedLabelFilter = labelQuery.length > 0 ? labelQuery.toLowerCase() : null;
    const filtered =
      normalizedLabelFilter === null
        ? searched
        : searched.filter(snapshot => {
            if (normalizedLabelFilter === 'unlabeled') {
              return snapshot.label === null;
            }
            return (snapshot.label ?? '').toLowerCase() === normalizedLabelFilter;
          });

    const items = filtered.slice(offset, offset + limit);
    const facets = buildSnapshotLabelFacets(searched);

    res.json({
      success: true,
      data: {
        items,
        facets,
        pageInfo: {
          offset,
          limit,
          total: filtered.length,
          hasMore: offset + items.length < filtered.length,
          query: q,
          order,
          label: normalizedLabelFilter,
        },
      },
    });
  })
);

router.get(
  '/snapshots/:fileName/compare',
  asyncHandler(async (req: Request, res: Response) => {
    const fileName = routeParamToString(req.params.fileName);
    if (!fileName) {
      throw new AppError('Snapshot file name is required', 400);
    }

    const sourceSnapshot = readSnapshotDetail(fileName);
    const targetFileName =
      typeof req.query.target === 'string' && req.query.target.trim().length > 0
        ? req.query.target.trim()
        : 'current';

    const currentTarget = {
      kind: 'current' as const,
      snapshot: null,
      quota: {
        weeklyPremiumRemaining,
        businessDaysRemaining,
        premiumConsumedToday,
      },
      metrics: computeMetrics(orchestrationTasks),
    };

    const target =
      targetFileName === 'current'
        ? currentTarget
        : (() => {
            const detail = readSnapshotDetail(targetFileName);
            return {
              kind: 'snapshot' as const,
              snapshot: {
                fileName: detail.fileName,
                createdAt: detail.createdAt,
                taskCount: detail.taskCount,
                label: detail.label,
              },
              quota: detail.quota,
              metrics: detail.metrics,
            };
          })();

    const source = {
      snapshot: {
        fileName: sourceSnapshot.fileName,
        createdAt: sourceSnapshot.createdAt,
        taskCount: sourceSnapshot.taskCount,
        label: sourceSnapshot.label,
      },
      quota: sourceSnapshot.quota,
      metrics: sourceSnapshot.metrics,
    };

    res.json({
      success: true,
      data: {
        targetQuery: targetFileName,
        source,
        target,
        delta: {
          totalTasks: target.metrics.totalTasks - source.metrics.totalTasks,
          queuedTasks: target.metrics.queuedTasks - source.metrics.queuedTasks,
          runningTasks: target.metrics.runningTasks - source.metrics.runningTasks,
          doneTasks: target.metrics.doneTasks - source.metrics.doneTasks,
          failedTasks: target.metrics.failedTasks - source.metrics.failedTasks,
          blockedTasks: target.metrics.blockedTasks - source.metrics.blockedTasks,
          premiumTasks: target.metrics.premiumTasks - source.metrics.premiumTasks,
          weeklyPremiumRemaining:
            target.quota.weeklyPremiumRemaining - source.quota.weeklyPremiumRemaining,
          businessDaysRemaining:
            target.quota.businessDaysRemaining - source.quota.businessDaysRemaining,
          premiumConsumedToday:
            target.quota.premiumConsumedToday - source.quota.premiumConsumedToday,
        },
      },
    });
  })
);

router.get(
  '/snapshots/:fileName/recommend-restore',
  asyncHandler(async (req: Request, res: Response) => {
    const fileName = routeParamToString(req.params.fileName);
    if (!fileName) {
      throw new AppError('Snapshot file name is required', 400);
    }

    const sourceSnapshot = readSnapshotDetail(fileName);
    const targetFileName =
      typeof req.query.target === 'string' && req.query.target.trim().length > 0
        ? req.query.target.trim()
        : 'current';

    const targetMetrics =
      targetFileName === 'current'
        ? computeMetrics(orchestrationTasks)
        : readSnapshotDetail(targetFileName).metrics;
    const targetQuota =
      targetFileName === 'current'
        ? {
            weeklyPremiumRemaining,
            businessDaysRemaining,
            premiumConsumedToday,
          }
        : readSnapshotDetail(targetFileName).quota;

    const delta = {
      totalTasks: targetMetrics.totalTasks - sourceSnapshot.metrics.totalTasks,
      runningTasks: targetMetrics.runningTasks - sourceSnapshot.metrics.runningTasks,
      failedTasks: targetMetrics.failedTasks - sourceSnapshot.metrics.failedTasks,
      premiumConsumedToday:
        targetQuota.premiumConsumedToday - sourceSnapshot.quota.premiumConsumedToday,
    };

    const recommendation = buildRestoreRecommendation(delta);

    res.json({
      success: true,
      data: {
        source: {
          fileName: sourceSnapshot.fileName,
          createdAt: sourceSnapshot.createdAt,
          label: sourceSnapshot.label,
        },
        target: targetFileName,
        delta,
        recommendation,
      },
    });
  })
);

router.get(
  '/snapshots/:fileName/preview',
  asyncHandler(async (req: Request, res: Response) => {
    const fileName = routeParamToString(req.params.fileName);
    if (!fileName) {
      throw new AppError('Snapshot file name is required', 400);
    }

    const snapshot = readSnapshotDetail(fileName);
    const currentMetrics = computeMetrics(orchestrationTasks);
    const snapshotMetrics = snapshot.metrics;

    res.json({
      success: true,
      data: {
        snapshot: {
          fileName: snapshot.fileName,
          createdAt: snapshot.createdAt,
          taskCount: snapshot.taskCount,
          label: snapshot.label,
        },
        current: {
          quota: {
            weeklyPremiumRemaining,
            businessDaysRemaining,
            premiumConsumedToday,
          },
          metrics: currentMetrics,
        },
        preview: {
          quota: snapshot.quota,
          metrics: snapshotMetrics,
        },
        delta: {
          totalTasks: snapshotMetrics.totalTasks - currentMetrics.totalTasks,
          queuedTasks: snapshotMetrics.queuedTasks - currentMetrics.queuedTasks,
          runningTasks: snapshotMetrics.runningTasks - currentMetrics.runningTasks,
          doneTasks: snapshotMetrics.doneTasks - currentMetrics.doneTasks,
          failedTasks: snapshotMetrics.failedTasks - currentMetrics.failedTasks,
          blockedTasks: snapshotMetrics.blockedTasks - currentMetrics.blockedTasks,
          premiumConsumedToday: snapshot.quota.premiumConsumedToday - premiumConsumedToday,
        },
      },
    });
  })
);

router.get(
  '/snapshots/:fileName',
  asyncHandler(async (req: Request, res: Response) => {
    const fileName = routeParamToString(req.params.fileName);
    if (!fileName) {
      throw new AppError('Snapshot file name is required', 400);
    }

    const snapshot = readSnapshotDetail(fileName);
    res.json({ success: true, data: snapshot });
  })
);

router.post(
  '/snapshots/export',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const { label } = req.body as { label?: string };
    const snapshot = exportSnapshot(label);
    res.status(201).json({ success: true, data: snapshot });
  })
);

router.post(
  '/snapshots/restore',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const { fileName } = req.body as { fileName?: string };
    const snapshot = restoreSnapshot(fileName);
    res.json({
      success: true,
      data: {
        snapshot,
        metrics: computeMetrics(orchestrationTasks),
      },
    });
  })
);

router.delete(
  '/snapshots/:fileName',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const fileName = routeParamToString(req.params.fileName);
    if (!fileName) {
      throw new AppError('Snapshot file name is required', 400);
    }

    const deletedSnapshot = deleteSnapshot(fileName);
    res.json({
      success: true,
      data: {
        snapshot: deletedSnapshot,
        remaining: listSnapshotSummaries().slice(0, 20),
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
    const { id } = req.params as Record<string, string>;
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
