import { Request, Response } from 'express';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import {
  RouteRequest,
  computeMetrics,
  orchestrationTasks,
  routeParamToString,
} from './orchestrationCommon.js';
import {
  buildSnapshotLabelFacets,
  deleteSnapshot,
  exportSnapshot,
  listSnapshotSummaries,
  readSnapshotDetail,
  restoreSnapshot,
} from './orchestrationSnapshotHelper.js';

export const getSnapshots = asyncHandler(async (_req: RouteRequest, res: Response) => {
  res.json({
    success: true,
    data: listSnapshotSummaries().slice(0, 20),
  });
});

export const getSnapshotHistory = asyncHandler(async (req: RouteRequest, res: Response) => {
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
});

export const getSnapshotDetail = asyncHandler(async (req: Request, res: Response) => {
  const fileName = routeParamToString(req.params.fileName);
  if (!fileName) {
    throw new AppError('Snapshot file name is required', 400);
  }

  const snapshot = readSnapshotDetail(fileName);
  res.json({ success: true, data: snapshot });
});

export const exportSnapshotHandler = asyncHandler(async (req: RouteRequest, res: Response) => {
  const { label } = req.body as { label?: string };
  const snapshot = exportSnapshot(label);
  res.status(201).json({ success: true, data: snapshot });
});

export const restoreSnapshotHandler = asyncHandler(async (req: RouteRequest, res: Response) => {
  const { fileName } = req.body as { fileName?: string };
  const snapshot = restoreSnapshot(fileName);
  res.json({
    success: true,
    data: {
      snapshot,
      metrics: computeMetrics(orchestrationTasks),
    },
  });
});

export const deleteSnapshotHandler = asyncHandler(async (req: Request, res: Response) => {
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
});
