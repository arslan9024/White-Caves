/**
 * Tenants API Routes — Full Implementation
 * Tenant management and leasing
 * Endpoints: /api/tenants
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import {
  getTenants,
  getTenantStats,
  getTenantById,
  getTenantLeases,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenants/index.js';

const router = Router();

// Query endpoints
router.get('/', requirePermission('view_contracts'), asyncHandler(getTenants));
router.get('/stats', requirePermission('view_contracts'), asyncHandler(getTenantStats));
router.get('/:id', requirePermission('view_contracts'), asyncHandler(getTenantById));
router.get('/:id/leases', requirePermission('view_contracts'), asyncHandler(getTenantLeases));

// Mutation endpoints
router.post('/', requirePermission('create_contracts'), asyncHandler(createTenant));
router.patch('/:id', requirePermission('create_contracts'), asyncHandler(updateTenant));
router.delete('/:id', requireRole('owner', 'manager', 'admin'), asyncHandler(deleteTenant));

export default router;
