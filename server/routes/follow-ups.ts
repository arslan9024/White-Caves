/**
 * Follow-Up Routes — REST API for automated follow-up sequences
 *
 * Endpoints:
 *   POST   /api/follow-ups/:leadId/start      — Start a follow-up sequence for a lead
 *   GET    /api/follow-ups/:leadId             — Get all sequences for a lead
 *   GET    /api/follow-ups/sequence/:id        — Get single sequence detail
 *   POST   /api/follow-ups/sequence/:id/pause  — Pause an active sequence
 *   POST   /api/follow-ups/sequence/:id/resume — Resume a paused sequence
 *   POST   /api/follow-ups/sequence/:id/cancel — Cancel a sequence
 *   GET    /api/follow-ups/stats               — Dashboard statistics
 *   GET    /api/follow-ups/cadences            — List available cadence templates
 */

import { Router, Request, Response } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  startSequence,
  pauseSequence,
  resumeSequence,
  cancelSequence,
  getSequenceSummary,
  getLeadSequences,
  getFollowUpStats,
} from '../services/automation/followUpEngine.js';
import { CADENCE_MAP } from '../services/automation/cadenceTemplates.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ── Start a sequence for a lead ─────────────────────────────────────────

router.post('/:leadId/start', requirePermission('manage_leads'), asyncHandler(async (req: Request, res: Response) => {
  const { leadId } = req.params;
  const { cadenceType } = req.body || {};

  logger.info(`Starting follow-up sequence for lead ${leadId}`, { cadenceType });

  const result = await startSequence(leadId, {
    cadenceType: cadenceType || undefined,
    createdById: req.user?.id,
  });

  res.status(201).json({
    success: true,
    data: result,
    message: `Follow-up sequence started: ${result.cadenceType} cadence, ${result.totalSteps} steps`,
  });
}));

// ── Get all sequences for a lead ────────────────────────────────────────

router.get('/:leadId', requirePermission('view_leads'), asyncHandler(async (req: Request, res: Response) => {
  const { leadId } = req.params;
  const sequences = await getLeadSequences(leadId);

  res.status(200).json({
    success: true,
    data: sequences,
    count: sequences.length,
  });
}));

// ── Get dashboard stats ─────────────────────────────────────────────────

router.get('/stats', requirePermission('view_leads'), asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getFollowUpStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
}));

// ── List available cadence templates ────────────────────────────────────

router.get('/cadences', requirePermission('view_leads'), asyncHandler(async (_req: Request, res: Response) => {
  const cadences = Object.values(CADENCE_MAP).map((c) => ({
    cadenceType: c.cadenceType,
    name: c.name,
    description: c.description,
    totalSteps: c.totalSteps,
    maxDurationDays: c.maxDurationDays,
    steps: c.steps.map((s) => ({
      stepNumber: s.stepNumber,
      channel: s.channel,
      delayDescription: formatDelay(s.delayMs),
      description: s.description,
    })),
  }));

  res.status(200).json({
    success: true,
    data: cadences,
  });
}));

// ── Get single sequence ─────────────────────────────────────────────────

router.get('/sequence/:id', requirePermission('view_leads'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const summary = await getSequenceSummary(id);

  if (!summary) {
    return res.status(404).json({ success: false, error: 'Sequence not found' });
  }

  res.status(200).json({
    success: true,
    data: summary,
  });
}));

// ── Pause a sequence ────────────────────────────────────────────────────

router.post('/sequence/:id/pause', requirePermission('manage_leads'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await pauseSequence(id);

  res.status(200).json({
    success: true,
    message: 'Follow-up sequence paused',
  });
}));

// ── Resume a sequence ───────────────────────────────────────────────────

router.post('/sequence/:id/resume', requirePermission('manage_leads'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await resumeSequence(id);

  res.status(200).json({
    success: true,
    message: 'Follow-up sequence resumed',
  });
}));

// ── Cancel a sequence ───────────────────────────────────────────────────

router.post('/sequence/:id/cancel', requirePermission('manage_leads'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  await cancelSequence(id, reason);

  res.status(200).json({
    success: true,
    message: 'Follow-up sequence cancelled',
  });
}));

// ── Helpers ─────────────────────────────────────────────────────────────

function formatDelay(ms: number): string {
  const minutes = ms / 60000;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours} hours`;
  const days = hours / 24;
  return `${days} days`;
}

export default router;
