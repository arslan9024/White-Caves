/**
 * Users API Routes — Full User Management
 * Endpoints: /api/users
 * Provides admin-level CRUD over all platform users.
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireRole, requireMinRole } from '../middleware/rbac.js';
import {
  getUsers,
  getCurrentUser,
  getPendingUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} from '../controllers/users/index.js';

const router = Router();

// Query endpoints
router.get('/', requireMinRole('admin'), asyncHandler(getUsers));
router.get('/me', asyncHandler(getCurrentUser));
router.get('/pending', requireMinRole('admin'), asyncHandler(getPendingUsers));
router.get('/:id', requireMinRole('admin'), asyncHandler(getUserById));

// Mutation endpoints
router.patch('/:id', requireRole('owner'), asyncHandler(updateUser));
router.patch('/:id/status', requireMinRole('admin'), asyncHandler(updateUserStatus));

export default router;
