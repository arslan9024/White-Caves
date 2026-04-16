/**
 * Leases API Routes
 * ─────────────────
 * CRUD endpoints for property lease management.
 *
 * GET    /api/leases           — List leases (tenant sees own, landlord sees own)
 * GET    /api/leases/:id       — Get lease detail
 * POST   /api/leases           — Create a new lease
 * PATCH  /api/leases/:id       — Update lease (renew, terminate, update terms)
 * DELETE /api/leases/:id       — Delete a lease (draft only)
 * GET    /api/leases/expiring  — Leases expiring within N days
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Leases');
const router = Router();

// ─── GET /api/leases — List leases for current user ─────────────────────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const status = req.query.status as string | undefined;
    const role = req.query.role as string | undefined; // 'tenant' or 'landlord'
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

    const where: Record<string, unknown> = {};

    // If role specified, filter to that role; otherwise show all matching leases
    if (role === 'tenant') {
      where.tenantId = userId;
    } else if (role === 'landlord') {
      where.landlordId = userId;
    } else {
      where.OR = [{ tenantId: userId }, { landlordId: userId }];
    }

    if (status) where.status = status;

    const [leases, total] = await Promise.all([
      prisma.lease.findMany({
        where,
        include: {
          property: {
            select: { id: true, title: true, location: true, type: true, images: true },
          },
          tenant: {
            select: { id: true, name: true, email: true, phone: true },
          },
          landlord: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lease.count({ where }),
    ]);

    res.json({
      success: true,
      data: leases,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  }),
);

// ─── GET /api/leases/expiring — Leases expiring within N days ────────────────
router.get(
  '/expiring',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const days = Math.max(1, parseInt(req.query.days as string) || 90);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const leases = await prisma.lease.findMany({
      where: {
        OR: [{ tenantId: userId }, { landlordId: userId }],
        endDate: { lte: futureDate, gte: new Date() },
        status: { in: ['active', 'expiring'] },
      },
      include: {
        property: {
          select: { id: true, title: true, location: true },
        },
        tenant: {
          select: { id: true, name: true, email: true },
        },
        landlord: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { endDate: 'asc' },
    });

    res.json({ success: true, data: leases, meta: { expiringWithinDays: days } });
  }),
);

// ─── GET /api/leases/:id — Get lease detail ──────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        landlord: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
    });
    if (!lease) throw new AppError('Lease not found', 404);

    // Only tenant, landlord, or owner/admin can view
    const userRole = req.user?.role;
    if (lease.tenantId !== userId && lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    res.json({ success: true, data: lease });
  }),
);

// ─── POST /api/leases — Create a new lease ───────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const {
      propertyId,
      tenantId,
      startDate,
      endDate,
      monthlyRent,
      depositAmount,
      terms,
      leaseNumber,
    } = req.body;

    if (!propertyId) throw new AppError('propertyId is required', 400);
    if (!tenantId) throw new AppError('tenantId is required', 400);
    if (!startDate) throw new AppError('startDate is required', 400);
    if (!endDate) throw new AppError('endDate is required', 400);
    if (!monthlyRent || typeof monthlyRent !== 'number' || monthlyRent <= 0) {
      throw new AppError('monthlyRent must be a positive number', 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError('Invalid date format', 400);
    }
    if (end <= start) throw new AppError('endDate must be after startDate', 400);

    // Verify property and tenant exist
    const [property, tenant] = await Promise.all([
      prisma.property.findUnique({ where: { id: propertyId } }),
      prisma.user.findUnique({ where: { id: tenantId } }),
    ]);
    if (!property) throw new AppError('Property not found', 404);
    if (!tenant) throw new AppError('Tenant not found', 404);

    const lease = await prisma.lease.create({
      data: {
        propertyId,
        tenantId,
        landlordId: userId,
        startDate: start,
        endDate: end,
        monthlyRent,
        depositAmount: depositAmount || 0,
        terms: terms || null,
        leaseNumber: leaseNumber || null,
        documents: [],
      },
      include: {
        property: { select: { id: true, title: true, location: true } },
        tenant: { select: { id: true, name: true, email: true } },
      },
    });

    log.info('Lease created', { userId, leaseId: lease.id, propertyId, tenantId });
    res.status(201).json({ success: true, data: lease });
  }),
);

// ─── PATCH /api/leases/:id — Update a lease ─────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lease not found', 404);

    // Only landlord or owner can update
    const userRole = req.user?.role;
    if (existing.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied — only landlord or owner can update leases', 403);
    }

    const { status, monthlyRent, endDate, terms, nextPaymentDue, leaseNumber, documents } = req.body;
    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      const validStatuses = ['draft', 'active', 'expiring', 'expired', 'terminated', 'renewed'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      updateData.status = status;
    }
    if (monthlyRent !== undefined) updateData.monthlyRent = monthlyRent;
    if (endDate !== undefined) {
      const d = new Date(endDate);
      if (isNaN(d.getTime())) throw new AppError('Invalid endDate', 400);
      updateData.endDate = d;
    }
    if (terms !== undefined) updateData.terms = terms;
    if (nextPaymentDue !== undefined) {
      updateData.nextPaymentDue = nextPaymentDue ? new Date(nextPaymentDue) : null;
    }
    if (leaseNumber !== undefined) updateData.leaseNumber = leaseNumber;
    if (documents !== undefined) updateData.documents = documents;

    const updated = await prisma.lease.update({ where: { id }, data: updateData });

    log.info('Lease updated', { userId, leaseId: id, status: updated.status });
    res.json({ success: true, data: updated });
  }),
);

// ─── DELETE /api/leases/:id — Delete a lease (draft only) ───────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lease not found', 404);

    // Only landlord or owner can delete
    const userRole = req.user?.role;
    if (existing.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    // Only draft leases can be deleted
    if (existing.status !== 'draft') {
      throw new AppError('Only draft leases can be deleted. Terminate the lease instead.', 400);
    }

    await prisma.lease.delete({ where: { id } });

    log.info('Lease deleted', { userId, leaseId: id });
    res.json({ success: true, message: 'Lease deleted' });
  }),
);

export default router;
