import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  AssistantExecutionProfile,
  ModelTier,
  OrchestrationMetrics,
  OrchestrationTask,
  PersistedOrchestrationState,
  SnapshotMeta,
  TaskState,
} from './orchestrationTypes.js';

export * from './orchestrationTypes.js';

export const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

export const orchestrationTasks: OrchestrationTask[] = [];

export const quotaState = {
  weeklyPremiumRemaining: 48,
  businessDaysRemaining: 5,
  premiumConsumedToday: 0,
};

export const ORCHESTRATION_STATE_FILE = path.join(process.cwd(), 'logs', 'orchestration-state.json');
export const ORCHESTRATION_SNAPSHOT_DIR = path.join(process.cwd(), 'logs', 'orchestration-snapshots');

export function computeMetrics(tasks: OrchestrationTask[]): OrchestrationMetrics {
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

export function buildPersistedState(snapshotMeta?: SnapshotMeta): PersistedOrchestrationState {
  const baseState: PersistedOrchestrationState = {
    weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
    businessDaysRemaining: quotaState.businessDaysRemaining,
    premiumConsumedToday: quotaState.premiumConsumedToday,
    tasks: orchestrationTasks.slice(0, 500),
  };

  if (snapshotMeta) {
    baseState.snapshotMeta = snapshotMeta;
  }

  return baseState;
}

export function ensureDir(dirPath: string): void {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs path built from process.cwd()
  if (!existsSync(dirPath)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs path built from process.cwd()
    mkdirSync(dirPath, { recursive: true });
  }
}

export function writeStateToFile(filePath: string, snapshotMeta?: SnapshotMeta): void {
  const dirPath = path.dirname(filePath);
  ensureDir(dirPath);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs/snapshots path built from process.cwd()
  writeFileSync(filePath, JSON.stringify(buildPersistedState(snapshotMeta), null, 2), 'utf-8');
}

export function persistState(): void {
  try {
    writeStateToFile(ORCHESTRATION_STATE_FILE);
  } catch {
    // Persistence failures should never break orchestration APIs.
  }
}

export function applyPersistedState(parsed: Partial<PersistedOrchestrationState>): void {
  if (typeof parsed.weeklyPremiumRemaining === 'number' && parsed.weeklyPremiumRemaining >= 0) {
    quotaState.weeklyPremiumRemaining = Math.floor(parsed.weeklyPremiumRemaining);
  }

  if (typeof parsed.businessDaysRemaining === 'number' && parsed.businessDaysRemaining >= 0) {
    quotaState.businessDaysRemaining = Math.floor(parsed.businessDaysRemaining);
  }

  if (typeof parsed.premiumConsumedToday === 'number' && parsed.premiumConsumedToday >= 0) {
    quotaState.premiumConsumedToday = Math.floor(parsed.premiumConsumedToday);
  }

  if (Array.isArray(parsed.tasks)) {
    orchestrationTasks.splice(0, orchestrationTasks.length, ...parsed.tasks.slice(0, 500));
  }
}

export function readStateFile(filePath: string): void {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- internal logs/snapshots path built from process.cwd()
  const fileContents = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(fileContents) as Partial<PersistedOrchestrationState>;
  applyPersistedState(parsed);
}

export function hydrateState(): void {
  try {
    if (!existsSync(ORCHESTRATION_STATE_FILE)) {
      return;
    }

    readStateFile(ORCHESTRATION_STATE_FILE);
  } catch {
    // Corrupt state is ignored safely and re-created on next successful mutation.
  }
}

export function calculateDailyPremiumCap(): number {
  if (quotaState.businessDaysRemaining <= 0) return 0;
  return Math.max(0, Math.floor(quotaState.weeklyPremiumRemaining / quotaState.businessDaysRemaining));
}

export function getTaskState(profile: AssistantExecutionProfile, requestedTier: ModelTier) {
  const dailyCap = calculateDailyPremiumCap();

  if (requestedTier === 'premium') {
    if (!profile.modelPolicy.premiumAllowed) {
      return {
        state: 'blocked' as TaskState,
        blockedReason: 'Assistant policy forbids premium execution for this role.',
      };
    }

    if (quotaState.premiumConsumedToday >= dailyCap) {
      return {
        state: 'blocked' as TaskState,
        blockedReason: 'Daily premium cap exhausted. Task should be queued for next cycle.',
      };
    }

    quotaState.premiumConsumedToday += 1;
  }

  return { state: 'queued' as TaskState, blockedReason: null };
}

hydrateState();
