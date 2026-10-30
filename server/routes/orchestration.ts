import { Router } from 'express';
import { requireRole } from '../middleware/rbac.js';
import {
  compareSnapshot,
  createTask,
  deleteSnapshotHandler,
  exportSnapshotHandler,
  getAssistantEndpointsContract,
  getMetrics,
  getSnapshotDetail,
  getSnapshotHistory,
  getSnapshots,
  getStatus,
  getTasks,
  previewSnapshot,
  recommendRestore,
  restoreSnapshotHandler,
  updateQuota,
  updateTaskState,
} from '../controllers/orchestration/index.js';

const router = Router();

// Status & Metrics
router.get('/status', getStatus);
router.get('/metrics', getMetrics);
router.put('/quota', requireRole('owner'), updateQuota);

// Snapshots
router.get('/snapshots', getSnapshots);
router.get('/snapshots/history', getSnapshotHistory);
router.get('/snapshots/:fileName/compare', compareSnapshot);
router.get('/snapshots/:fileName/recommend-restore', recommendRestore);
router.get('/snapshots/:fileName/preview', previewSnapshot);
router.get('/snapshots/:fileName', getSnapshotDetail);
router.post('/snapshots/export', requireRole('owner', 'admin', 'manager'), exportSnapshotHandler);
router.post('/snapshots/restore', requireRole('owner', 'admin', 'manager'), restoreSnapshotHandler);
router.delete('/snapshots/:fileName', requireRole('owner', 'admin', 'manager'), deleteSnapshotHandler);

// Tasks & Contracts
router.get('/tasks', getTasks);
router.get('/contracts/assistant-endpoints', getAssistantEndpointsContract);
router.post('/tasks', requireRole('owner', 'admin', 'manager'), createTask);
router.patch('/tasks/:id/state', requireRole('owner', 'admin', 'manager'), updateTaskState);

export default router;
