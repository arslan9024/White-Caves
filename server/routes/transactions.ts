/**
 * Transactions API Routes — Full Implementation
 * Sales and lease transaction management
 * Endpoints: /api/transactions
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  getTransactions,
  getTransactionStats,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactions/index.js';

const router = Router();

// Query endpoints
router.get('/', requirePermission('view_payments'), asyncHandler(getTransactions));
router.get('/stats', requirePermission('view_payments'), asyncHandler(getTransactionStats));
router.get('/:id', requirePermission('view_payments'), asyncHandler(getTransactionById));

// Mutation endpoints
router.post('/', requirePermission('process_payments'), asyncHandler(createTransaction));
router.patch('/:id', requirePermission('process_payments'), asyncHandler(updateTransaction));
router.delete('/:id', requirePermission('process_payments'), asyncHandler(deleteTransaction));

export default router;
