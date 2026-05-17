/**
 * Contracts API Routes
 * ─────────────────────────────────────────────────────────────────────────
 * Full CRUD for White Caves contract records (sale, rental, MOU, Form F, etc.)
 *
 * GET    /api/contracts           — List contracts (filtered, paginated)
 * GET    /api/contracts/:id       — Get single contract
 * POST   /api/contracts           — Create contract
 * PATCH  /api/contracts/:id       — Update contract
 * DELETE /api/contracts/:id       — Delete contract (admin only)
 */

import { Router, Response } from 'express';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { parsePagination } from '../config/pagination.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';

const router = Router();

const VALID_CONTRACT_TYPES = ['sale', 'rental', 'mou', 'form_f', 'listing', 'management'] as const;
const VALID_CONTRACT_STATUSES = [
  'draft',
  'pending_signature',
  'active',
  'expired',
  'terminated',
  'cancelled',
] as const;

const mockContracts: Array<Record<string, any>> = [];

const normalizeId = () => randomUUID().replace(/-/g, '').slice(0, 24);

const containsInsensitive = (value: unknown, needle: string) =>
  String(value ?? '')
    .toLowerCase()
    .includes(needle.toLowerCase());

const matchContractWhere = (item: Record<string, any>, where?: Record<string, any>) => {
  if (!where) return true;

  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR' && Array.isArray(value)) {
      const orMatch = value.some((clause: Record<string, any>) => {
        const [field, condition] = Object.entries(clause)[0] || [];
        const contains = condition?.contains;
        return field && contains ? containsInsensitive(item[field], contains) : false;
      });
      if (!orMatch) return false;
      continue;
    }

    if (item[key] !== value) return false;
  }

  return true;
};

const createMockContractModel = () => ({
  findMany: async ({ where, orderBy, skip = 0, take }: any = {}) => {
    let rows = mockContracts.filter(r => matchContractWhere(r, where));

    if (orderBy?.createdAt) {
      rows = rows.sort((a, b) => {
        const av = new Date(a.createdAt).getTime();
        const bv = new Date(b.createdAt).getTime();
        return orderBy.createdAt === 'asc' ? av - bv : bv - av;
      });
    }

    return rows.slice(skip, take ? skip + take : undefined);
  },

  count: async ({ where }: any = {}) =>
    mockContracts.filter(r => matchContractWhere(r, where)).length,

  findUnique: async ({ where }: any) => mockContracts.find(r => r.id === where.id) ?? null,

  create: async ({ data }: any) => {
    const created = {
      id: normalizeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockContracts.push(created);
    return created;
  },

  update: async ({ where, data }: any) => {
    const idx = mockContracts.findIndex(r => r.id === where.id);
    if (idx < 0) throw new AppError('Contract not found', 404);
    mockContracts[idx] = {
      ...mockContracts[idx],
      ...data,
      updatedAt: new Date(),
    };
    return mockContracts[idx];
  },

  delete: async ({ where }: any) => {
    const idx = mockContracts.findIndex(r => r.id === where.id);
    if (idx < 0) throw new AppError('Contract not found', 404);
    const [deleted] = mockContracts.splice(idx, 1);
    return deleted;
  },
});

const getContractModel = () => {
  const contractModel = (prisma as unknown as { contract?: any }).contract;
  if (!contractModel) {
    return createMockContractModel();
  }
  return contractModel;
};

function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `WC-C-${year}-${random}`;
}

// ─── GET /api/contracts ──────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const contractModel = getContractModel();
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
      contractModel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      contractModel.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: contracts,
      pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/contracts/:id ──────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const contractModel = getContractModel();
    validateIdParam(req.params.id, 'Contract ID');
    const contract = await contractModel.findUnique({ where: { id: req.params.id } });
    if (!contract) throw new AppError('Contract not found', 404);
    res.status(200).json({ success: true, data: contract });
  })
);

// ─── POST /api/contracts ─────────────────────────────────────────────────
router.post(
  '/',
  requirePermission('create_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const contractModel = getContractModel();
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

    const contract = await contractModel.create({
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

// ─── PATCH /api/contracts/:id ────────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('create_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const contractModel = getContractModel();
    const { id } = req.params;
    validateIdParam(id, 'Contract ID');

    const existing = await contractModel.findUnique({ where: { id } });
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

    const updated = await contractModel.update({ where: { id }, data });

    const statusChanged = status !== undefined && status !== existing.status;
    await prisma.activity.create({
      data: {
        type: 'contract',
        action: statusChanged ? 'status_changed' : 'updated',
        description: statusChanged
          ? `Contract "${updated.title}" status: ${existing.status} → ${status}`
          : `Contract "${updated.title}" updated`,
        userId: req.user?.id || null,
        metadata: statusChanged ? { oldStatus: existing.status, newStatus: status } : undefined,
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

// ─── DELETE /api/contracts/:id ───────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const contractModel = getContractModel();
    const { id } = req.params;
    validateIdParam(id, 'Contract ID');

    const existing = await contractModel.findUnique({ where: { id } });
    if (!existing) throw new AppError('Contract not found', 404);

    await contractModel.delete({ where: { id } });

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
