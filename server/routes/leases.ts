import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import rentPaymentsRouter from './rentPayments.js';
import {
  listLeases,
  getExpiringLeases,
  getEjariTracking,
  getLeaseDetail,
  getLeasePnl,
  createLease,
  intakeLeaseWizard,
  updateLease,
  deleteLease,
  renewLease,
  terminateLease,
  addLeaseAddendum,
  listLeaseAddenda,
  recordKeyHandover,
  listPdcSchedule,
  addPdcCheque,
  updatePdcStatus,
  getOverdueCollectionQueue,
  notifyOverdueCollection,
} from '../controllers/leases/index.js';

const router = Router();

// ─── Collections & Tracking (must precede :id) ────────────────────────────────
router.get('/expiring', asyncHandler(getExpiringLeases));
router.get('/ejari/tracking', asyncHandler(getEjariTracking));
router.get('/collections/overdue-queue', asyncHandler(getOverdueCollectionQueue));
router.post('/collections/overdue-queue/:pdcId/notify', asyncHandler(notifyOverdueCollection));
router.post('/overdue-collection-queue/:pdcId/notify', asyncHandler(notifyOverdueCollection));

// ─── CRUD & Intake ────────────────────────────────────────────────────────────
router.get('/', asyncHandler(listLeases));
router.post('/', asyncHandler(createLease));
router.post('/intake', asyncHandler(intakeLeaseWizard));

// ─── Lease Detail & PnL ───────────────────────────────────────────────────────
router.get('/:id', asyncHandler(getLeaseDetail));
router.patch('/:id', asyncHandler(updateLease));
router.delete('/:id', asyncHandler(deleteLease));
router.get('/:id/pnl', asyncHandler(getLeasePnl));

// ─── Lease Actions ────────────────────────────────────────────────────────────
router.patch('/:id/renew', asyncHandler(renewLease));
router.patch('/:id/terminate', asyncHandler(terminateLease));
router.post('/:id/addendum', asyncHandler(addLeaseAddendum));
router.get('/:id/addenda', asyncHandler(listLeaseAddenda));
router.post('/:id/key-handover', asyncHandler(recordKeyHandover));

// ─── PDC (Post-Dated Cheques) ─────────────────────────────────────────────────
router.get('/:id/pdc', asyncHandler(listPdcSchedule));
router.post('/:id/pdc', asyncHandler(addPdcCheque));
router.patch('/:id/pdc/:pdcId', asyncHandler(updatePdcStatus));

// ─── Wave 35: Mount Rent Payments Sub-router ──────────────────────────────────
router.use('/:leaseId/payments', rentPaymentsRouter);

export default router;
