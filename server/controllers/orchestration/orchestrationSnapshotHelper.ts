import { existsSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { AppError } from '../../middleware/errorHandler.js';
import {
  ORCHESTRATION_SNAPSHOT_DIR,
  OrchestrationSnapshotDetail,
  OrchestrationSnapshotSummary,
  PersistedOrchestrationState,
  SnapshotHistoryFacet,
  SnapshotMeta,
  computeMetrics,
  ensureDir,
  orchestrationTasks,
  persistState,
  readStateFile,
  writeStateToFile,
} from './orchestrationCommon.js';

export function getSnapshotFiles(): string[] {
  if (!existsSync(ORCHESTRATION_SNAPSHOT_DIR)) {
    return [];
  }

  return readdirSync(ORCHESTRATION_SNAPSHOT_DIR)
    .filter(fileName => fileName.endsWith('.json'))
    .sort((left, right) => right.localeCompare(left));
}

export function getSnapshotFilePath(fileName: string): string {
  return path.join(ORCHESTRATION_SNAPSHOT_DIR, path.basename(fileName));
}

export function readSnapshotDetail(fileName: string): OrchestrationSnapshotDetail {
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

export function listSnapshotSummaries(): OrchestrationSnapshotSummary[] {
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

export function exportSnapshot(label?: string): OrchestrationSnapshotSummary {
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

export function restoreSnapshot(fileName?: string): OrchestrationSnapshotSummary {
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

export function deleteSnapshot(fileName: string): OrchestrationSnapshotSummary {
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

export function buildSnapshotLabelFacets(
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

export function buildRestoreRecommendation(input: {
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

