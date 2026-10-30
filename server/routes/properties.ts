/**
 * Properties API Routes — Declarative Modular Router
 * Endpoints: /api/properties
 * Decomposed under Single Purpose File Law (< 350 lines) into server/controllers/properties/
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission, scopeToOwn, requireMinRole } from '../middleware/rbac.js';
import {
  listProperties,
  getFacets,
  getPropertyStats,
  getInventoryStats,
  getCompletenessSummary,
  getPropertyById,
  getPropertyCompleteness,
  createProperty,
  updateProperty,
  patchProperty,
  deleteProperty,
} from '../controllers/properties/index.js';

const router = Router();

// ─── Query Endpoints ────────────────────────────────────────────────────
router.get('/', requirePermission('view_properties'), scopeToOwn('userId'), asyncHandler(listProperties));
router.get('/stats', requirePermission('view_properties'), requireMinRole('manager'), asyncHandler(getPropertyStats));
router.get('/inventory-stats', requirePermission('view_properties'), asyncHandler(getInventoryStats));
router.get('/facets', requirePermission('view_properties'), asyncHandler(getFacets));
router.get('/completeness-summary', requirePermission('view_properties'), requireMinRole('manager'), asyncHandler(getCompletenessSummary));

// ─── Detail & Completeness (Must be registered after static paths) ──────
router.get('/:id/completeness', requirePermission('view_properties'), asyncHandler(getPropertyCompleteness));
router.get('/:id', requirePermission('view_properties'), asyncHandler(getPropertyById));

// ─── Mutation Endpoints ─────────────────────────────────────────────────
router.post('/', requirePermission('create_property'), asyncHandler(createProperty));
router.put('/:id', requirePermission('edit_property'), asyncHandler(updateProperty));
router.patch('/:id', requirePermission('edit_property'), asyncHandler(patchProperty));
router.delete('/:id', requirePermission('delete_property'), asyncHandler(deleteProperty));

export default router;
