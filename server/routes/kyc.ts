/**
 * KYC Workflow API Routes — Wave 41 (REQ-COMP-002)
 *
 * Endpoints:
 * - GET    /api/kyc — List KYC submissions
 * - GET    /api/kyc/checklist/:type — Get transaction checklist
 * - POST   /api/kyc — Initiate KYC record
 * - POST   /api/kyc/:id/documents — Attach document
 * - PATCH  /api/kyc/:id/status — Verify or reject KYC
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  getKycChecklist,
  createKycRecord,
  addKycDocument,
  updateKycStatus,
  KycTransactionType,
  KycStatus,
} from '../services/kycService.js';
import { validateIdParam } from '../utils/validate.js';

const router = Router();

// ─── GET /api/kyc — List KYC submissions ──────────────────────────────────
router.get(
  '/',
  requirePermission('manage_rera_compliance'),
  asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;

    const records = await prisma.kycRecord.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: records,
    });
  })
);

// ─── GET /api/kyc/checklist/:type — Get checklist items ─────────────────
router.get(
  '/checklist/:type',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.params as Record<string, string>;
    const checklist = getKycChecklist(type as KycTransactionType);

    res.status(200).json({
      success: true,
      data: {
        transactionType: type,
        checklist,
      },
    });
  })
);

// ─── POST /api/kyc — Initiate KYC record ─────────────────────────────────
router.post(
  '/',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { clientId, clientName, clientEmail, clientPhone, transactionType } = req.body as {
      clientId?: string;
      clientName: string;
      clientEmail?: string;
      clientPhone?: string;
      transactionType?: KycTransactionType;
    };

    if (!clientName) {
      throw new AppError('clientName is required', 400);
    }

    const kyc = await createKycRecord({
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      transactionType: transactionType || 'lease',
    });

    res.status(201).json({
      success: true,
      data: kyc,
    });
  })
);

// ─── POST /api/kyc/:id/documents — Attach document ───────────────────────
router.post(
  '/:id/documents',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'KYC ID');

    const { docType, fileUrl, documentName } = req.body as {
      docType: string;
      fileUrl: string;
      documentName?: string;
    };

    if (!docType || !fileUrl) {
      throw new AppError('docType and fileUrl are required', 400);
    }

    const updated = await addKycDocument(id, { docType, fileUrl, documentName });

    res.status(200).json({
      success: true,
      data: updated,
    });
  })
);

// ─── PATCH /api/kyc/:id/status — Verify or reject KYC ───────────────────
router.patch(
  '/:id/status',
  requirePermission('manage_rera_compliance'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'KYC ID');

    const { status, rejectionReason } = req.body as {
      status: KycStatus;
      rejectionReason?: string;
    };

    if (!['verified', 'rejected', 'under_review', 'pending_submission'].includes(status)) {
      throw new AppError('Invalid status value', 400);
    }

    const reviewer = req.user ? { id: req.user.id, name: req.user.email || 'Compliance Officer' } : undefined;

    const updated = await updateKycStatus(id, status, reviewer, rejectionReason);

    res.status(200).json({
      success: true,
      data: updated,
    });
  })
);

export default router;
