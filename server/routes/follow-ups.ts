/**
 * Follow-Up Routes — REST API for automated follow-up sequences
 * Endpoints: /api/follow-ups
 */

import { Router } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  startLeadSequence,
  getDashboardStats,
  getCadenceTemplates,
  getCadenceRules,
  createCadenceRule,
  updateCadenceRule,
  deleteCadenceRule,
  getSequencesForLead,
  getSequenceDetail,
  pauseLeadSequence,
  resumeLeadSequence,
  cancelLeadSequence,
} from '../controllers/followUps/index.js';

const router = Router();

// Sequence Execution & Monitoring
router.post('/:leadId/start', requirePermission('manage_leads'), asyncHandler(startLeadSequence));
router.get('/stats', requirePermission('view_leads'), asyncHandler(getDashboardStats));
router.get('/cadences', requirePermission('view_leads'), asyncHandler(getCadenceTemplates));

// Dynamic Cadence Rules
router.get('/rules', requirePermission('view_leads'), asyncHandler(getCadenceRules));
router.post('/rules', requirePermission('manage_leads'), asyncHandler(createCadenceRule));
router.patch('/rules/:id', requirePermission('manage_leads'), asyncHandler(updateCadenceRule));
router.delete('/rules/:id', requirePermission('manage_leads'), asyncHandler(deleteCadenceRule));

// Lead Sequences Management
router.get('/:leadId', requirePermission('view_leads'), asyncHandler(getSequencesForLead));
router.get('/sequence/:id', requirePermission('view_leads'), asyncHandler(getSequenceDetail));
router.post('/sequence/:id/pause', requirePermission('manage_leads'), asyncHandler(pauseLeadSequence));
router.post('/sequence/:id/resume', requirePermission('manage_leads'), asyncHandler(resumeLeadSequence));
router.post('/sequence/:id/cancel', requirePermission('manage_leads'), asyncHandler(cancelLeadSequence));

export default router;
