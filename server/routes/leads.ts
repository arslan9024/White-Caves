/**
 * Leads API Routes — Declarative Modular Router
 * Endpoints: /api/leads
 * Decomposed under Single Purpose File Law (< 350 lines) into server/controllers/leads/
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission, requireRole, scopeToOwn, requireMinRole } from '../middleware/rbac.js';
import {
  listLeads,
  getLeadById,
  getLeadStats,
  getConversionAnalytics,
  getFunnelAnalytics,
  getAgentPerformanceMetrics,
  getSlaBreaches,
  getTaskCockpit,
  triggerSlaNudge,
  getLeadTimeline,
  getLeadActivities,
  createLeadActivity,
  createLead,
  updateLead,
  deleteLead,
  createLeadFromSearch,
  executeBulkAction,
  getScoredLeads,
  getRoutingRulesList,
  getTrendingLeads,
  autoRouteLead,
  getLeadScore,
  overrideLeadScore,
  batchRescore,
  getScoreHistoryList,
  scoreWhatsApp,
  importUpload,
  importLeadsFile,
  bulkImportLeads,
} from '../controllers/leads/index.js';

const router = Router();

// ─── Core Queries & Analytics ───────────────────────────────────────────
router.get('/', requirePermission('view_leads'), scopeToOwn('assignedToId'), asyncHandler(listLeads));
router.get('/stats', requirePermission('view_leads'), requireMinRole('manager'), asyncHandler(getLeadStats));
router.get('/analytics/conversion', requirePermission('view_leads'), requireMinRole('manager'), asyncHandler(getConversionAnalytics));
router.get('/analytics/funnel', requirePermission('view_analytics'), asyncHandler(getFunnelAnalytics));
router.get('/agent-performance', requirePermission('view_analytics'), asyncHandler(getAgentPerformanceMetrics));
router.get('/sla-breaches', requirePermission('view_leads'), requireMinRole('manager'), asyncHandler(getSlaBreaches));
router.get('/task-cockpit', requirePermission('view_leads'), scopeToOwn('assignedToId'), asyncHandler(getTaskCockpit));

// ─── Lead Scoring & Routing Engine ──────────────────────────────────────
router.get('/scored', requirePermission('view_leads'), asyncHandler(getScoredLeads));
router.get('/routing-rules', requirePermission('view_leads'), asyncHandler(getRoutingRulesList));
router.get('/trending', requirePermission('view_leads'), asyncHandler(getTrendingLeads));
router.post('/batch-rescore', requirePermission('manage_leads'), asyncHandler(batchRescore));

// ─── Import & Bulk Operations ───────────────────────────────────────────
router.post('/import/file', requirePermission('manage_leads'), importUpload.single('file'), asyncHandler(importLeadsFile));
router.post('/bulk-import', requirePermission('manage_leads'), asyncHandler(bulkImportLeads));
router.post('/bulk-action', requirePermission('manage_leads'), asyncHandler(executeBulkAction));

// ─── Public Capture & Core Creation ─────────────────────────────────────
router.post('/from-search', asyncHandler(createLeadFromSearch));
router.post('/', requirePermission('manage_leads'), asyncHandler(createLead));

// ─── Parameterized Endpoints (Must be registered after static paths) ────
router.get('/:id', requirePermission('view_leads'), asyncHandler(getLeadById));
router.patch('/:id', requirePermission('manage_leads'), asyncHandler(updateLead));
router.delete('/:id', requireRole('owner', 'manager', 'admin'), asyncHandler(deleteLead));

router.get('/:id/timeline', requirePermission('view_leads'), asyncHandler(getLeadTimeline));
router.get('/:id/activities', requirePermission('view_leads'), asyncHandler(getLeadActivities));
router.post('/:id/activities', requirePermission('manage_leads'), asyncHandler(createLeadActivity));
router.post('/:id/sla-nudge', requirePermission('manage_leads'), requireMinRole('manager'), asyncHandler(triggerSlaNudge));

router.post('/:id/auto-route', requirePermission('manage_leads'), asyncHandler(autoRouteLead));
router.get('/:id/score', requirePermission('view_leads'), asyncHandler(getLeadScore));
router.post('/:id/score/override', requirePermission('manage_leads'), asyncHandler(overrideLeadScore));
router.get('/:id/score/history', requirePermission('view_leads'), asyncHandler(getScoreHistoryList));
router.post('/:id/score/whatsapp', requirePermission('manage_leads'), asyncHandler(scoreWhatsApp));

export default router;
