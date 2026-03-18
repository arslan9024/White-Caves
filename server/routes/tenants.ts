/**
 * Tenants API Routes — Full Implementation
 * Tenant management and leasing
 * Endpoints: /api/tenants
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/tenants ───────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', pageSize = '20', status, search } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string)));

    const where: any = {};
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

// ─── GET /api/tenants/stats ─────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const [total, byStatus, rentStats] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.tenant.aggregate({ _sum: { monthlyRent: true }, _avg: { monthlyRent: true } }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach((s: any) => { statusCounts[s.status] = s._count._all; });

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

// ─── GET /api/tenants/:id ───────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const tenant = await prisma.tenant.findUnique({ where: { id: req.params.id } });
    if (!tenant) throw new AppError('Tenant not found', 404);
    res.status(200).json({ success: true, data: tenant });
  })
);

// ─── POST /api/tenants ──────────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, nationality, emiratesId, propertyId,
      monthlyRent, deposit, moveInDate, notes } = req.body;

    if (!name?.trim()) throw new AppError('Tenant name is required', 400);

    const tenant = await prisma.tenant.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        nationality: nationality || null,
        emiratesId: emiratesId || null,
        propertyId: propertyId || null,
        monthlyRent: monthlyRent ? parseFloat(monthlyRent) : null,
        deposit: deposit ? parseFloat(deposit) : null,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        notes: notes || null,
        status: 'active',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'client',
        action: 'created',
        description: `New tenant added: ${tenant.name}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: tenant });
  })
);

// ─── PATCH /api/tenants/:id ─────────────────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, nationality, emiratesId, propertyId,
      monthlyRent, deposit, moveInDate, moveOutDate, notes, status } = req.body;

    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing) throw new AppError('Tenant not found', 404);

    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (email !== undefined) data.email = email?.trim() || null;
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (nationality !== undefined) data.nationality = nationality;
    if (emiratesId !== undefined) data.emiratesId = emiratesId;
    if (propertyId !== undefined) data.propertyId = propertyId;
    if (monthlyRent !== undefined) data.monthlyRent = monthlyRent ? parseFloat(monthlyRent) : null;
    if (deposit !== undefined) data.deposit = deposit ? parseFloat(deposit) : null;
    if (moveInDate !== undefined) data.moveInDate = moveInDate ? new Date(moveInDate) : null;
    if (moveOutDate !== undefined) data.moveOutDate = moveOutDate ? new Date(moveOutDate) : null;
    if (notes !== undefined) data.notes = notes;
    if (status !== undefined) data.status = status;

    const tenant = await prisma.tenant.update({ where: { id }, data });

    res.status(200).json({ success: true, data: tenant });
  })
);

// ─── DELETE /api/tenants/:id ────────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing) throw new AppError('Tenant not found', 404);

    await prisma.tenant.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        type: 'client',
        action: 'deleted',
        description: `Tenant deleted: ${existing.name}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(200).json({ success: true, message: `Tenant "${existing.name}" deleted` });
  })
);

// ─── GET /api/tenants/:id/leases ────────────────────────────────────────
// Returns the property info as a "lease" for this tenant
router.get(
  '/:id/leases',
  asyncHandler(async (req: Request, res: Response) => {
    const tenant = await prisma.tenant.findUnique({ where: { id: req.params.id } });
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
        ? [{
            id: `lease-${tenant.id}`,
            propertyId: property.id,
            property: property,
            tenantId: tenant.id,
            monthlyRent: tenant.monthlyRent,
            deposit: tenant.deposit,
            moveInDate: tenant.moveInDate,
            moveOutDate: tenant.moveOutDate,
            status: tenant.status,
          }]
        : [],
    });
  })
);

export default router;
