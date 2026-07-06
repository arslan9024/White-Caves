/**
 * Documents Routes — REST API for document generation and management
 *
 * Endpoints:
 *   POST   /api/documents/generate          â€” Generate a document from template
 *   GET    /api/documents                    â€” List documents (with filters)
 *   GET    /api/documents/types              â€” List available document types
 *   GET    /api/documents/:id                â€” Get single document (with HTML)
 *   GET    /api/documents/:id/html           â€” Get raw HTML (for rendering/printing)
 *   PATCH  /api/documents/:id/status         â€” Update document status
 */

import { Router, Request, Response } from 'express';
type RouteRequest = Request<Record<string, string>>;
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  generateDocument,
  getDocument,
  listDocuments,
  updateDocumentStatus,
  getAvailableDocumentTypes,
} from '../services/documents/documentGenerator.js';
import { documentService } from '../services/DocumentService.js';
import {
  autoFillVariables,
  getAutoFillableEntities,
  getEntityRequirements,
} from '../services/documents/documentAutoFill.js';
import { logger } from '../utils/logger.js';

const router = Router();

const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

// â”€â”€ Generate a document â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.post(
  '/generate',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { type, variables, transactionId, leadId, propertyId, commissionId } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, error: 'Document type is required' });
    }
    if (!variables || typeof variables !== 'object') {
      return res.status(400).json({ success: false, error: 'Template variables are required' });
    }

    logger.info(`Generating document: ${type}`, { leadId, transactionId, propertyId });

    const document = await generateDocument({
      type,
      variables,
      transactionId,
      leadId,
      propertyId,
      commissionId,
      generatedById: req.user?.id,
    });

    res.status(201).json({
      success: true,
      data: document,
      message: `${document.title} generated successfully`,
    });
  })
);

// â”€â”€ List documents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { type, status, transactionId, leadId, propertyId, page, pageSize } = req.query as Record<
      string,
      string | undefined
    >;

    const result = await listDocuments({
      type: type as string | undefined,
      status: status as string | undefined,
      transactionId: transactionId as string | undefined,
      leadId: leadId as string | undefined,
      propertyId: propertyId as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 20,
      },
    });
  })
);

// â”€â”€ List available document types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/types',
  requirePermission('view_leads'),
  asyncHandler(async (_req: RouteRequest, res: Response) => {
    const types = getAvailableDocumentTypes();

    res.status(200).json({
      success: true,
      data: types,
    });
  })
);

// â”€â”€ Get auto-fill entity requirements â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/auto-fill/entities',
  requirePermission('view_leads'),
  asyncHandler(async (_req: RouteRequest, res: Response) => {
    const entities = getAutoFillableEntities();

    res.status(200).json({
      success: true,
      data: entities,
    });
  })
);

// â”€â”€ Preview auto-filled variables (without generating) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.post(
  '/auto-fill/preview',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const {
      type,
      leadId,
      propertyId,
      transactionId,
      commissionId,
      viewingId,
      leaseId,
      offerId,
      overrides,
    } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, error: 'Document type is required' });
    }

    const result = await autoFillVariables(
      type,
      { leadId, propertyId, transactionId, commissionId, viewingId, leaseId, offerId },
      overrides
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// â”€â”€ Generate document with auto-filled variables from DB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.post(
  '/generate-auto',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const {
      type,
      leadId,
      propertyId,
      transactionId,
      commissionId,
      viewingId,
      leaseId,
      offerId,
      overrides,
    } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, error: 'Document type is required' });
    }

    logger.info(`Auto-generating document: ${type}`, { leadId, transactionId, propertyId });

    // 1. Auto-fill variables from DB
    const autoFilled = await autoFillVariables(
      type,
      { leadId, propertyId, transactionId, commissionId, viewingId, leaseId, offerId },
      overrides
    );

    // 2. Generate document with filled variables
    const document = await generateDocument({
      type,
      variables: autoFilled.variables,
      transactionId,
      leadId,
      propertyId,
      commissionId,
      generatedById: req.user?.id,
    });

    res.status(201).json({
      success: true,
      data: {
        document,
        autoFillContext: autoFilled.context,
      },
      message: `${document.title} auto-generated successfully`,
    });
  })
);

// â”€â”€ Download contract PDF summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/contract/:id/pdf',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const contractId = routeParamToString(req.params.id);
    if (!contractId) {
      throw new AppError('Contract ID is required', 400);
    }
    const file = await documentService.generateContractPdf(contractId);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.status(200).send(file.buffer);
  })
);

// â”€â”€ Download commission PDF summary by agent â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/commission/:agentId/pdf',
  requirePermission('view_all_reports'),
  asyncHandler(async (req: Request, res: Response) => {
    const agentId = routeParamToString(req.params.agentId);
    if (!agentId) {
      throw new AppError('Agent ID is required', 400);
    }
    const file = await documentService.generateCommissionPdf(agentId);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.status(200).send(file.buffer);
  })
);

// â”€â”€ Get single document â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/:id',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    const document = await getDocument(id);

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  })
);

// â”€â”€ Get raw HTML for rendering/printing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.get(
  '/:id/html',
  requirePermission('view_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    const document = await getDocument(id);

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(document.htmlContent);
  })
);

// â”€â”€ Update document status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

router.patch(
  '/:id/status',
  requirePermission('manage_leads'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    const { status } = req.body;

    const validStatuses = ['draft', 'final', 'signed', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    await updateDocumentStatus(id, status);

    res.status(200).json({
      success: true,
      message: `Document status updated to ${status}`,
    });
  })
);

export default router;
