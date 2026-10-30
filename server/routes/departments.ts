/**
 * Departments API Routes — Phase 30
 * Aggregates real-time KPI data and serves it to departmental view components.
 * Endpoints: /api/departments
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  requireDepartmentAccess,
  requireDepartmentPermission,
} from '../middleware/departmentAuth.js';
import {
  getDepartments,
  getDepartmentDataByCode,
  getDepartmentKpis,
  getDepartmentTrends,
  getDepartmentSummary,
} from '../controllers/departments/index.js';

const router = Router();

// List all supported departments
router.get('/', requirePermission('view_analytics'), asyncHandler(getDepartments));

// Aggregated KPI data for a department
router.get(
  '/:code/data',
  requirePermission('view_analytics'),
  requireDepartmentAccess,
  requireDepartmentPermission('READ'),
  asyncHandler(getDepartmentDataByCode)
);

// KPI array for a department
router.get(
  '/:code/kpis',
  requirePermission('view_analytics'),
  requireDepartmentAccess,
  requireDepartmentPermission('READ'),
  asyncHandler(getDepartmentKpis)
);

// Monthly trend data for a department
router.get(
  '/:code/trends',
  requirePermission('view_analytics'),
  requireDepartmentAccess,
  requireDepartmentPermission('READ'),
  asyncHandler(getDepartmentTrends)
);

// Summary stats for a department
router.get(
  '/:code/summary',
  requirePermission('view_analytics'),
  requireDepartmentAccess,
  requireDepartmentPermission('READ'),
  asyncHandler(getDepartmentSummary)
);

export default router;
