/**
 * Maintenance API Routes
 * CRUD endpoints for property maintenance requests, contractor assignment, and ratings.
 * Endpoints: /api/maintenance
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getMaintenanceRequests,
  getMaintenanceStats,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  assignContractor,
  rateMaintenanceRequest,
  deleteMaintenanceRequest,
} from '../controllers/maintenance/index.js';

const router = Router();

// Query endpoints
router.get('/', asyncHandler(getMaintenanceRequests));
router.get('/stats', asyncHandler(getMaintenanceStats));
router.get('/:id', asyncHandler(getMaintenanceRequestById));

// Mutation endpoints
router.post('/', asyncHandler(createMaintenanceRequest));
router.patch('/:id', asyncHandler(updateMaintenanceRequest));
router.patch('/:id/assign', asyncHandler(assignContractor));
router.patch('/:id/rate', asyncHandler(rateMaintenanceRequest));
router.delete('/:id', asyncHandler(deleteMaintenanceRequest));

export default router;
