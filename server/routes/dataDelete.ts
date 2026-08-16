/**
 * UAE PDPL Data Deletion API — Wave 42 (REQ-COMP-002, COMP-PDPL-009)
 *
 * Provides UAE Personal Data Protection Law "Right to Erasure" deletion request endpoint.
 * POST /api/data-delete
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = Router();

interface DataDeletePayload {
  identifier: string;
  reason?: string;
}

function validateDataDeletePayload(body: unknown): DataDeletePayload {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid data deletion payload', 400);
  }
  const { identifier, reason } = body as Record<string, unknown>;
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    throw new AppError('identifier is required for data erasure request', 400);
  }
  return {
    identifier: identifier.trim(),
    reason: typeof reason === 'string' ? reason.trim() : undefined,
  };
}

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { identifier, reason } = validateDataDeletePayload(req.body);
    const cleanId = identifier;

    // 1. Revoke consent if exists
    await prisma.whatsAppConsent.updateMany({
      where: { phone: cleanId },
      data: { consent: false, optedOutAt: new Date() },
    });

    // 2. Record deletion audit log
    const activity = await prisma.activity.create({
      data: {
        type: 'compliance',
        action: 'pdpl_data_erasure_requested',
        description: `PDPL data erasure requested for identifier ${cleanId}: ${reason || 'User requested deletion'}`,
        metadata: { identifier: cleanId, reason: reason || 'User requested deletion', requestedAt: new Date().toISOString() },
      },
    });

    logger.info('[DataDelete] Recorded PDPL data erasure request', { identifier: cleanId, activityId: activity.id });

    res.status(200).json({
      success: true,
      data: {
        requestId: activity.id,
        identifier: cleanId,
        status: 'erasure_scheduled',
        message: 'Your data deletion request under UAE PDPL has been received and scheduled.',
      },
    });
  })
);

export default router;
