// @ts-nocheck
/**
 * Contracts API Routes
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * Full CRUD for White Caves contract records (sale, rental, MOU, Form F, etc.)
 *
 * GET    /api/contracts           â€” List contracts (filtered, paginated)
 * GET    /api/contracts/:id       â€” Get single contract
 * POST   /api/contracts           â€” Create contract
 * PATCH  /api/contracts/:id       â€” Update contract
 * DELETE /api/contracts/:id       â€” Delete contract (admin only)
 */

import { Router, Response } from 'express';
import type { Request } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { parsePagination } from '../config/pagination.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';

const router = Router();
const db = prisma as any;

const VALID_CONTRACT_TYPES = ['sale', 'rental', 'mou', 'form_f', 'listing', 'management'] as const;
const VALID_CONTRACT_STATUSES = [
  'draft',
  'pending_signature',
  'active',
  'expired',
  'terminated',
  'cancelled',
] as const;

function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `WC-C-${year}-${random}`;
}

// â”€â”€â”€ GET /api/contracts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/',
  requirePermission('view_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { status, type, propertyId, leadId, search } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};
    if (
      status &&
      VALID_CONTRACT_STATUSES.includes(status as (typeof VALID_CONTRACT_STATUSES)[number])
    ) {
      where.status = status;
    }
    if (type && VALID_CONTRACT_TYPES.includes(type as (typeof VALID_CONTRACT_TYPES)[number])) {
      where.type = type;
    }
    if (propertyId) where.propertyId = propertyId;
    if (leadId) where.leadId = leadId;
    if (search) {
      const s = sanitizeString(String(search)).trim().slice(0, 120);
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { contractNumber: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [contracts, total] = await Promise.all([
      db.contract.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.contract.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: contracts,
      pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// â”€â”€â”€ GET /api/contracts/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/:id',
  requirePermission('view_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Contract ID');
    const contract = await db.contract.findUnique({ where: { id: req.params.id } });
    if (!contract) throw new AppError('Contract not found', 404);
    res.status(200).json({ success: true, data: contract });
  })
);

// â”€â”€â”€ POST /api/contracts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/',
  requirePermission('create_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      title,
      type,
      status,
      description,
      value,
      currency,
      startDate,
      endDate,
      parties,
      terms,
      attachmentUrls,
      propertyId,
      leadId,
      transactionId,
      assignedToId,
      metadata,
    } = req.body;

    validate(req.body, {
      title: rules.requiredStringWithMax('Title', 255),
      type: rules.oneOf('Contract type', [...VALID_CONTRACT_TYPES]),
      status: rules.oneOf('Status', [...VALID_CONTRACT_STATUSES]),
      description: rules.optionalStringWithMax('Description', 2000),
      value: rules.optionalPositiveNumber('Value'),
      propertyId: rules.optionalMongoId('Property ID'),
      leadId: rules.optionalMongoId('Lead ID'),
      assignedToId: rules.optionalMongoId('Assigned agent ID'),
    });

    const contract = await db.contract.create({
      data: {
        contractNumber: generateContractNumber(),
        title: sanitizeString(title.trim()),
        type: type || 'sale',
        status: status || 'draft',
        description: description ? sanitizeString(description) : null,
        value: value ? parseFloat(value) : null,
        currency: currency || 'AED',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        parties: parties || null,
        terms: terms ? sanitizeString(terms) : null,
        attachmentUrls: Array.isArray(attachmentUrls) ? attachmentUrls : [],
        propertyId: propertyId || null,
        leadId: leadId || null,
        transactionId: transactionId || null,
        assignedToId: assignedToId || null,
        metadata: metadata || null,
        createdById: req.user?.id || null,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'contract',
        action: 'created',
        description: `Contract created: ${contract.title} (${contract.contractNumber})`,
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: contract });
  })
);

// â”€â”€â”€ PATCH /api/contracts/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/:id',
  requirePermission('create_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Contract ID');

    const existing = await db.contract.findUnique({ where: { id } });
    if (!existing) throw new AppError('Contract not found', 404);

    const {
      title,
      type,
      status,
      description,
      value,
      currency,
      startDate,
      endDate,
      signedAt,
      terminatedAt,
      terminationReason,
      parties,
      terms,
      attachmentUrls,
      propertyId,
      leadId,
      transactionId,
      assignedToId,
      metadata,
    } = req.body;

    validate(req.body, {
      title: rules.optionalStringWithMax('Title', 255),
      type: rules.oneOf('Contract type', [...VALID_CONTRACT_TYPES]),
      status: rules.oneOf('Status', [...VALID_CONTRACT_STATUSES]),
      description: rules.optionalStringWithMax('Description', 2000),
      value: rules.optionalPositiveNumber('Value'),
      propertyId: rules.optionalMongoId('Property ID'),
      leadId: rules.optionalMongoId('Lead ID'),
      assignedToId: rules.optionalMongoId('Assigned agent ID'),
    });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = sanitizeString(String(title).trim());
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (description !== undefined)
      data.description = description ? sanitizeString(description) : null;
    if (value !== undefined) data.value = value ? parseFloat(value) : null;
    if (currency !== undefined) data.currency = currency;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (signedAt !== undefined) data.signedAt = signedAt ? new Date(signedAt) : null;
    if (terminatedAt !== undefined)
      data.terminatedAt = terminatedAt ? new Date(terminatedAt) : null;
    if (terminationReason !== undefined)
      data.terminationReason = terminationReason ? sanitizeString(terminationReason) : null;
    if (parties !== undefined) data.parties = parties;
    if (terms !== undefined) data.terms = terms ? sanitizeString(terms) : null;
    if (attachmentUrls !== undefined)
      data.attachmentUrls = Array.isArray(attachmentUrls) ? attachmentUrls : [];
    if (propertyId !== undefined) data.propertyId = propertyId || null;
    if (leadId !== undefined) data.leadId = leadId || null;
    if (transactionId !== undefined) data.transactionId = transactionId || null;
    if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    if (metadata !== undefined) data.metadata = metadata;

    const updated = await db.contract.update({ where: { id }, data });

    const statusChanged = status !== undefined && status !== existing.status;
    await prisma.activity.create({
      data: {
        type: 'contract',
        action: statusChanged ? 'status_changed' : 'updated',
        description: statusChanged
          ? `Contract "${updated.title}" status: ${existing.status} â†’ ${status}`
          : `Contract "${updated.title}" updated`,
        userId: req.user?.id || null,
        metadata: statusChanged ? { oldStatus: existing.status, newStatus: status } : undefined,
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

// â”€â”€â”€ DELETE /api/contracts/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Contract ID');

    const existing = await db.contract.findUnique({ where: { id } });
    if (!existing) throw new AppError('Contract not found', 404);

    await db.contract.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        type: 'contract',
        action: 'deleted',
        description: `Contract deleted: ${existing.title} (${existing.contractNumber}) by ${req.user?.email}`,
        userId: req.user?.id || null,
      },
    });

    res.status(200).json({ success: true, message: `Contract "${existing.title}" deleted` });
  })
);

export default router;
