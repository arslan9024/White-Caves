/**
 * Follow-Up Lead Sequence Controller
 * Handlers for starting, pausing, resuming, cancelling, and viewing automated lead sequences.
 */

import { Request, Response } from 'express';
import {
  startSequence,
  pauseSequence,
  resumeSequence,
  cancelSequence,
  getSequenceSummary,
  getLeadSequences,
  getFollowUpStats,
} from '../../services/automation/followUpEngine.js';
import { CADENCE_MAP } from '../../services/automation/cadenceTemplates.js';
import { logger } from '../../utils/logger.js';
import { formatDelay } from './followUpCommon.js';

export const startLeadSequence = async (req: Request, res: Response): Promise<void> => {
  const { leadId } = req.params as Record<string, string>;
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
};

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await getFollowUpStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
};

export const getCadenceTemplates = async (_req: Request, res: Response): Promise<void> => {
  const cadences = Object.values(CADENCE_MAP).map(c => ({
    cadenceType: c.cadenceType,
    name: c.name,
    description: c.description,
    totalSteps: c.totalSteps,
    maxDurationDays: c.maxDurationDays,
    steps: c.steps.map(s => ({
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
};

export const getSequencesForLead = async (req: Request, res: Response): Promise<void> => {
  const { leadId } = req.params as Record<string, string>;
  const sequences = await getLeadSequences(leadId);

  res.status(200).json({
    success: true,
    data: sequences,
    count: sequences.length,
  });
};

export const getSequenceDetail = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  const summary = await getSequenceSummary(id);

  if (!summary) {
    res.status(404).json({ success: false, error: 'Sequence not found' });
    return;
  }

  res.status(200).json({
    success: true,
    data: summary,
  });
};

export const pauseLeadSequence = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  await pauseSequence(id);

  res.status(200).json({
    success: true,
    message: 'Follow-up sequence paused',
  });
};

export const resumeLeadSequence = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  await resumeSequence(id);

  res.status(200).json({
    success: true,
    message: 'Follow-up sequence resumed',
  });
};

export const cancelLeadSequence = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  const { reason } = req.body || {};
  await cancelSequence(id, reason);

  res.status(200).json({
    success: true,
    message: 'Follow-up sequence cancelled',
  });
};

