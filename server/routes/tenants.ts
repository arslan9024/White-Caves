/**
 * Tenants API Routes — Full Implementation
 * Tenant management and leasing
 * Endpoints: /api/tenants
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validateIdParam } from '../utils/validate';
import { requirePermission, requireRole } from '../middleware/rbac';

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

// â”€â”€â”€ GET /api/tenants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/',
  requirePermission('view_contracts'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    // AUTHORIZATION: Tenant PII restricted to managers/admins
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied â€” tenant data requires manager or above role', 403);
    }

    const {
      page = '1',
      pageSize = '20',
      status,
      search,
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status as string;
    if (search) {
      const s = search as string;
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
      }),
      prisma.tenant.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: tenants,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// â”€â”€â”€ GET /api/tenants/stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/stats',
  requirePermission('view_contracts'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    // Authorization: Only managers+ can view tenant statistics
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
      throw new AppError('Access denied â€” tenant statistics require manager role', 403);
    }
    const [total, byStatus, rentStats] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.tenant.aggregate({ _sum: { monthlyRent: true }, _avg: { monthlyRent: true } }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach(s => {
      statusCounts[s.status] = s._count._all;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusCounts,
        totalMonthlyRent: rentStats._sum.monthlyRent || 0,
        averageRent: Math.round(rentStats._avg.monthlyRent || 0),
      },
    });
  })
);

// â”€â”€â”€ GET /api/tenants/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/:id',
  requirePermission('view_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const tenantId = routeParamToString(req.params.id);
    if (!tenantId) {
      throw new AppError('Tenant ID is required', 400);
    }

    validateIdParam(tenantId, 'Tenant ID');

    // AUTHORIZATION: Tenant details restricted to managers/admins
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied â€” tenant details require manager or above role', 403);
    }
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new AppError('Tenant not found', 404);
    res.status(200).json({ success: true, data: tenant });
  })
);

// â”€â”€â”€ POST /api/tenants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/',
  requirePermission('create_contracts'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    // AUTHORIZATION: Only admins or property managers can create tenant records
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only admins or property managers can create tenant records', 403);
    }

    const {
      name,
      email,
      phone,
      nationality,
      emiratesId,
      propertyId,
      monthlyRent,
      deposit,
      moveInDate,
      notes,
    } = req.body;

    if (!name?.trim()) throw new AppError('Tenant name is required', 400);

    const sanitizedName = sanitizeString(name.trim());
    if (sanitizedName.length > 150) throw new AppError('Name must be 150 characters or less', 400);
    if (notes && notes.length > 5000)
      throw new AppError('Notes must be 5000 characters or less', 400);

    // Validate property exists if provided
    if (propertyId) {
      if (typeof propertyId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(propertyId)) {
        throw new AppError('Property ID must be a valid 24-character hex string', 400);
      }
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });
      if (!property) throw new AppError('Referenced property not found', 400);
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: sanitizedName,
        email: email?.trim()?.toLowerCase() || null,
        phone: sanitizeString(phone?.trim() || '') || null,
        nationality: sanitizeString(nationality || '') || null,
        emiratesId: sanitizeString(emiratesId || '') || null,
        propertyId: propertyId || null,
        monthlyRent: monthlyRent
          ? (() => {
              const v = parseFloat(monthlyRent);
              return Number.isFinite(v) && v >= 0 ? v : null;
            })()
          : null,
        deposit: deposit
          ? (() => {
              const v = parseFloat(deposit);
              return Number.isFinite(v) && v >= 0 ? v : null;
            })()
          : null,
        moveInDate: moveInDate
          ? (() => {
              const d = new Date(moveInDate);
              return !isNaN(d.getTime()) ? d : null;
            })()
          : null,
        notes: sanitizeString(notes || '') || null,
        status: 'active',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'client',
        action: 'created',
        description: `New tenant added: ${tenant.name}`,
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: tenant });
  })
);

// â”€â”€â”€ PATCH /api/tenants/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/:id',
  requirePermission('create_contracts'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Tenant ID');
    const {
      name,
      email,
      phone,
      nationality,
      emiratesId,
      propertyId,
      monthlyRent,
      deposit,
      moveInDate,
      moveOutDate,
      notes,
      status,
    } = req.body;

    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing) throw new AppError('Tenant not found', 404);

    // AUTHORIZATION: Only admins or property managers can update tenant records
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only admins or property managers can update tenant records', 403);
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      const s = sanitizeString(name.trim());
      if (s.length > 150) throw new AppError('Name must be 150 characters or less', 400);
      data.name = s;
    }
    if (email !== undefined) data.email = email?.trim()?.toLowerCase() || null;
    if (phone !== undefined) data.phone = sanitizeString(phone?.trim() || '') || null;
    if (nationality !== undefined) data.nationality = sanitizeString(nationality || '') || null;
    if (emiratesId !== undefined) data.emiratesId = sanitizeString(emiratesId || '') || null;
    if (propertyId !== undefined) {
      if (propertyId && (typeof propertyId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(propertyId))) {
        throw new AppError('Property ID must be a valid 24-character hex string', 400);
      }
      // Validate property exists if provided
      if (propertyId) {
        const property = await prisma.property.findUnique({
          where: { id: propertyId },
          select: { id: true },
        });
        if (!property) throw new AppError('Referenced property not found', 400);
      }
      data.propertyId = propertyId || null;
    }
    if (monthlyRent !== undefined)
      data.monthlyRent = monthlyRent
        ? (() => {
            const v = parseFloat(monthlyRent);
            return Number.isFinite(v) && v >= 0 ? v : null;
          })()
        : null;
    if (deposit !== undefined)
      data.deposit = deposit
        ? (() => {
            const v = parseFloat(deposit);
            return Number.isFinite(v) && v >= 0 ? v : null;
          })()
        : null;
    if (moveInDate !== undefined)
      data.moveInDate = moveInDate
        ? (() => {
            const d = new Date(moveInDate);
            return !isNaN(d.getTime()) ? d : null;
          })()
        : null;
    if (moveOutDate !== undefined)
      data.moveOutDate = moveOutDate
        ? (() => {
            const d = new Date(moveOutDate);
            return !isNaN(d.getTime()) ? d : null;
          })()
        : null;
    if (notes !== undefined) {
      if (notes && notes.length > 5000)
        throw new AppError('Notes must be 5000 characters or less', 400);
      data.notes = sanitizeString(notes || '') || null;
    }
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'moved_out', 'terminated'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid tenant status. Allowed: ${validStatuses.join(', ')}`, 400);
      }
      data.status = status;
    }

    const tenant = await prisma.tenant.update({ where: { id }, data });

    res.status(200).json({ success: true, data: tenant });
  })
);

// â”€â”€â”€ DELETE /api/tenants/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Tenant ID');
    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing) throw new AppError('Tenant not found', 404);

    // AUTHORIZATION: Only admins or property managers can delete tenant records
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only admins or property managers can delete tenant records', 403);
    }

    await prisma.$transaction(async tx => {
      await tx.tenant.delete({ where: { id } });

      await tx.activity.create({
        data: {
          type: 'client',
          action: 'deleted',
          description: `Tenant deleted: ${existing.name} (by ${req.user?.email})`,
          userId: req.user?.id || null,
        },
      });
    });

    res.status(200).json({ success: true, message: `Tenant "${existing.name}" deleted` });
  })
);

// â”€â”€â”€ GET /api/tenants/:id/leases â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Returns the property info as a "lease" for this tenant
router.get(
  '/:id/leases',
  requirePermission('view_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const tenantId = routeParamToString(req.params.id);
    if (!tenantId) {
      throw new AppError('Tenant ID is required', 400);
    }

    validateIdParam(tenantId, 'Tenant ID');
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new AppError('Tenant not found', 404);

    let property = null;
    if (tenant.propertyId) {
      property = await prisma.property.findUnique({
        where: { id: tenant.propertyId },
        select: { id: true, title: true, location: true, price: true, type: true },
      });
    }

    res.status(200).json({
      success: true,
      data: property
        ? [
            {
              id: `lease-${tenant.id}`,
              propertyId: property.id,
              property: property,
              tenantId: tenant.id,
              monthlyRent: tenant.monthlyRent,
              deposit: tenant.deposit,
              moveInDate: tenant.moveInDate,
              moveOutDate: tenant.moveOutDate,
              status: tenant.status,
            },
          ]
        : [],
    });
  })
);

export default router;
