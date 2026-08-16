/**
 * Suspicious Activity Report (SAR) API Routes — Wave 42 (REQ-COMP-002, COMP-AML-004)
 *
 * Endpoints:
 * - GET   /api/sar — List SAR records
 * - POST  /api/sar — File a new SAR record
 * - PATCH /api/sar/:id/goaml-status — Update goAML status
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import { createSarRecord } from '../services/amlScreeningService.js';
import { validateIdParam } from '../utils/validate.js';

const router = Router();

// ─── GET /api/sar — List SAR records ─────────────────────────────────────
router.get(
  '/',
  requirePermission('manage_rera_compliance'),
  asyncHandler(async (_req: Request, res: Response) => {
    const sars = await prisma.activity.findMany({
      where: { action: 'sar_created' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: sars,
    });
  })
);

// ─── POST /api/sar — File SAR record ────────────────────────────────────
router.post(
  '/',
  requirePermission('manage_rera_compliance'),
  asyncHandler(async (req: Request, res: Response) => {
    const { clientId, clientName, suspicionReason, transactionAmountAED } = req.body as {
      clientId?: string;
      clientName: string;
      suspicionReason: string;
      transactionAmountAED?: number;
    };

    if (!clientName || !suspicionReason) {
      throw new AppError('clientName and suspicionReason are required', 400);
    }

    const sar = await createSarRecord({
      clientId,
      clientName,
      suspicionReason,
      transactionAmountAED,
      reportedById: req.user?.id || 'compliance-officer',
    });

    res.status(201).json({
      success: true,
      data: sar,
    });
  })
);

// ─── PATCH /api/sar/:id/goaml-status — Update goAML submission status ─────
router.patch(
  '/:id/goaml-status',
  requirePermission('manage_rera_compliance'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'SAR ID');

    const { goAmlStatus, referenceNumber } = req.body as {
      goAmlStatus: string;
      referenceNumber?: string;
    };

    const sar = await prisma.activity.findUnique({ where: { id } });
    if (!sar) throw new AppError('SAR record not found', 404);

    const existingMetadata = (sar.metadata as Record<string, unknown>) || {};
    const updatedMetadata = {
      ...existingMetadata,
      goAmlStatus,
      goAmlReferenceNumber: referenceNumber || existingMetadata.goAmlReferenceNumber || null,
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.activity.update({
      where: { id },
      data: { metadata: updatedMetadata as Prisma.InputJsonObject },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  })
);

export default router;
