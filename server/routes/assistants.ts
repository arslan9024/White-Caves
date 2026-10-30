/**
 * AI Assistants Routes — Phase 0.8
 * Endpoints for querying personas and creating, reading, updating, and deleting markdown plans.
 */

import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  listAssistants,
  getAssistantPlan,
  createAssistantPlan,
  updateAssistantPlan,
  deleteAssistantPlan,
} from '../controllers/assistants/index.js';

const router = Router();

// Public metadata query
router.get('/', asyncHandler(listAssistants));

// Protected plan operations
router.get('/:id/plan', authMiddleware, asyncHandler(getAssistantPlan));
router.post('/', authMiddleware, asyncHandler(createAssistantPlan));
router.put('/:id', authMiddleware, asyncHandler(updateAssistantPlan));
router.delete('/:id', authMiddleware, asyncHandler(deleteAssistantPlan));

export default router;
