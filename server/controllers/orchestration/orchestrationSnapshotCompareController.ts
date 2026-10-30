import { Request, Response } from 'express';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import {
  computeMetrics,
  orchestrationTasks,
  quotaState,
  routeParamToString,
} from './orchestrationCommon.js';
import {
  buildRestoreRecommendation,
  readSnapshotDetail,
} from './orchestrationSnapshotHelper.js';

export const compareSnapshot = asyncHandler(async (req: Request, res: Response) => {
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
      weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
      businessDaysRemaining: quotaState.businessDaysRemaining,
      premiumConsumedToday: quotaState.premiumConsumedToday,
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
});

export const recommendRestore = asyncHandler(async (req: Request, res: Response) => {
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
          weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
          businessDaysRemaining: quotaState.businessDaysRemaining,
          premiumConsumedToday: quotaState.premiumConsumedToday,
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
});

export const previewSnapshot = asyncHandler(async (req: Request, res: Response) => {
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
          weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
          businessDaysRemaining: quotaState.businessDaysRemaining,
          premiumConsumedToday: quotaState.premiumConsumedToday,
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
        premiumConsumedToday: snapshot.quota.premiumConsumedToday - quotaState.premiumConsumedToday,
      },
    },
  });
});

