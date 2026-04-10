/**
 * Clients API Routes — Full CRUD Implementation
 * Client/Owner management for buyers, sellers, owners, investors
 * Endpoints: /api/clients
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';

const VALID_CLIENT_TYPES = ['buyer', 'seller', 'owner', 'investor'] as const;
const VALID_CLIENT_STATUSES = ['active', 'inactive', 'vip'] as const;

const router = Router();

// ─── GET /api/clients ───────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only owner, manager, admin, agent can access clients
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client data requires agent role or above', 403);
    }

    const { type, status, search } = req.query;

    const { page: pageNum, limit, skip } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where: Record<string, unknown> = {};
    if (type && type !== 'all') where.type = type as string;
    if (status && status !== 'all') where.status = status as string;
    if (search) {
      const s = search as string;
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
        { company: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.client.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: clients,
      pagination: {
        page: pageNum,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// ─── GET /api/clients/stats ─────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can view client statistics
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client statistics require manager role', 403);
    }

    const [total, byType, byStatus] = await Promise.all([
      prisma.client.count(),
      prisma.client.groupBy({ by: ['type'], _count: { _all: true } }),
      prisma.client.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const typeCounts: Record<string, number> = {};
    byType.forEach((t) => { typeCounts[t.type] = t._count._all; });

    const statusCounts: Record<string, number> = {};
    byStatus.forEach((s) => { statusCounts[s.status] = s._count._all; });

    res.status(200).json({
      success: true,
      data: {
        total,
        byType: typeCounts,
        byStatus: statusCounts,
      },
    });
  })
);

// ─── GET /api/clients/:id ───────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Client ID');

    // AUTHORIZATION: Only owner, manager, admin, agent can access
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client details require agent role or above', 403);
    }

    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) throw new AppError('Client not found', 404);

    res.status(200).json({ success: true, data: client });
  })
);

// ─── POST /api/clients ──────────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only owner, manager, admin, agent can create clients
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client creation requires agent role or above', 403);
    }

    const { name, email, phone, type, nationality, emiratesId, company,
      status, notes, address, propertyIds, tags } = req.body;

    validate(req.body, {
      name:        rules.requiredStringWithMax('Client name', 255),
      email:       rules.optionalEmail('Email'),
      phone:       rules.optionalStringWithMax('Phone', 50),
      type:        rules.oneOf('Type', [...VALID_CLIENT_TYPES]),
      nationality: rules.optionalStringWithMax('Nationality', 100),
      emiratesId:  rules.optionalStringWithMax('Emirates ID', 50),
      company:     rules.optionalStringWithMax('Company', 255),
      status:      rules.oneOf('Status', [...VALID_CLIENT_STATUSES]),
      notes:       rules.optionalStringWithMax('Notes', 5000),
      address:     rules.optionalStringWithMax('Address', 500),
      propertyIds: rules.optionalArray('Property IDs'),
      tags:        rules.optionalArray('Tags'),
    });

    const client = await prisma.client.create({
      data: {
        name: sanitizeString(name.trim()),
        email: email?.trim()?.toLowerCase() || null,
        phone: phone?.trim() || null,
        type: type || 'buyer',
        nationality: nationality ? sanitizeString(nationality.trim()) : null,
        emiratesId: emiratesId ? sanitizeString(emiratesId.trim()) : null,
        company: company ? sanitizeString(company.trim()) : null,
        status: status || 'active',
        notes: notes ? sanitizeString(notes) : null,
        address: address ? sanitizeString(address.trim()) : null,
        propertyIds: Array.isArray(propertyIds) ? propertyIds : [],
        tags: Array.isArray(tags) ? tags.map((t: unknown) => typeof t === 'string' ? sanitizeString(t) : String(t)) : [],
      },
    });

    await prisma.activity.create({
      data: {
        type: 'client',
        action: 'created',
        description: `New client created: ${client.name}${client.company ? ` (${client.company})` : ''}`,
        userId: (req as AuthRequest).user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: client });
  })
);

// ─── PATCH /api/clients/:id ─────────────────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Client ID');

    // AUTHORIZATION: Only owner, manager, admin, agent can update clients
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client update requires agent role or above', 403);
    }

    const { name, email, phone, type, nationality, emiratesId, company,
      status, notes, address, propertyIds, tags } = req.body;

    validate(req.body, {
      name:        rules.optionalStringWithMax('Client name', 255),
      email:       rules.optionalEmail('Email'),
      phone:       rules.optionalStringWithMax('Phone', 50),
      type:        rules.oneOf('Type', [...VALID_CLIENT_TYPES]),
      nationality: rules.optionalStringWithMax('Nationality', 100),
      emiratesId:  rules.optionalStringWithMax('Emirates ID', 50),
      company:     rules.optionalStringWithMax('Company', 255),
      status:      rules.oneOf('Status', [...VALID_CLIENT_STATUSES]),
      notes:       rules.optionalStringWithMax('Notes', 5000),
      address:     rules.optionalStringWithMax('Address', 500),
      propertyIds: rules.optionalArray('Property IDs'),
      tags:        rules.optionalArray('Tags'),
    });

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) throw new AppError('Client not found', 404);

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = sanitizeString(String(name).trim());
    if (email !== undefined) data.email = email ? String(email).trim().toLowerCase() : null;
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (type !== undefined) data.type = type;
    if (nationality !== undefined) data.nationality = nationality ? sanitizeString(String(nationality).trim()) : null;
    if (emiratesId !== undefined) data.emiratesId = emiratesId ? sanitizeString(String(emiratesId).trim()) : null;
    if (company !== undefined) data.company = company ? sanitizeString(String(company).trim()) : null;
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes ? sanitizeString(notes) : null;
    if (address !== undefined) data.address = address ? sanitizeString(String(address).trim()) : null;
    if (propertyIds !== undefined) data.propertyIds = Array.isArray(propertyIds) ? propertyIds : [];
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.map((t: unknown) => typeof t === 'string' ? sanitizeString(t) : String(t)) : [];

    const client = await prisma.client.update({ where: { id }, data });

    await prisma.activity.create({
      data: {
        type: 'client',
        action: 'updated',
        description: `Client "${client.name}" updated`,
        userId: (req as AuthRequest).user?.id || null,
      },
    });

    res.status(200).json({ success: true, data: client });
  })
);

// ─── DELETE /api/clients/:id ────────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Client ID');

    // AUTHORIZATION: Only owner, manager, admin, agent can delete clients
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client deletion requires agent role or above', 403);
    }

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) throw new AppError('Client not found', 404);

    await prisma.$transaction(async (tx) => {
      await tx.client.delete({ where: { id } });

      await tx.activity.create({
        data: {
          type: 'client',
          action: 'deleted',
          description: `Client deleted: ${existing.name} (by ${(req as AuthRequest).user?.email})`,
          userId: (req as AuthRequest).user?.id || null,
        },
      });
    });

    res.status(200).json({ success: true, message: `Client "${existing.name}" deleted` });
  })
);

// ─── GET /api/clients/:id/communications ────────────────────────────────
router.get(
  '/:id/communications',
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Client ID');

    // AUTHORIZATION: Only owner, manager, admin, agent can access
    const allowedRoles = ['owner', 'manager', 'admin', 'agent'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied — client communications require agent role or above', 403);
    }

    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) throw new AppError('Client not found', 404);

    const { page = '1', pageSize = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string) || 20));

    // Activities related to this client are logged with type 'client' and description containing client name
    const where = {
      type: 'client',
      description: { contains: client.name, mode: 'insensitive' as const },
    };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.activity.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

export default router;
