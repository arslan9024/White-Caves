/**
 * Viewings API Routes — Enhanced Phase 3C
 * Endpoints for property viewing/tour scheduling, conflict detection, .ics export, and notifications.
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getViewings,
  getUpcomingViewings,
  getViewingSlots,
  getViewingIcs,
  scheduleViewing,
  updateViewing,
  deleteViewing,
} from '../controllers/viewings/index.js';

const router = Router();

// Query endpoints
router.get('/', asyncHandler(getViewings));
router.get('/upcoming', asyncHandler(getUpcomingViewings));
router.get('/slots', asyncHandler(getViewingSlots));
router.get('/:id/ics', asyncHandler(getViewingIcs));

// Mutation endpoints
router.post('/', asyncHandler(scheduleViewing));
router.patch('/:id', asyncHandler(updateViewing));
router.delete('/:id', asyncHandler(deleteViewing));

export default router;
