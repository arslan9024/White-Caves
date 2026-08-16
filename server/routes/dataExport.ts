/**
 * UAE PDPL Data Export API — Wave 42 (REQ-COMP-002, COMP-PDPL-008)
 *
 * Provides UAE Personal Data Protection Law "Right of Access" data export endpoint.
 * GET /api/data-export/:identifier
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

router.get(
  '/:identifier',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = req.params as Record<string, string>;
    const cleanId = identifier.trim();

    const [lead, consent, kyc] = await Promise.all([
      prisma.lead.findFirst({
        where: {
          OR: [{ email: cleanId }, { phone: cleanId }, { id: cleanId }],
        },
      }),
      prisma.whatsAppConsent.findFirst({
        where: { phone: cleanId },
      }),
      prisma.kycRecord.findFirst({
        where: {
          OR: [{ clientEmail: cleanId }, { clientPhone: cleanId }, { clientId: cleanId }],
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        identifier: cleanId,
        exportedAt: new Date().toISOString(),
        personalData: {
          leadRecord: lead || null,
          consentRecord: consent || null,
          kycRecord: kyc || null,
        },
      },
    });
  })
);

export default router;
