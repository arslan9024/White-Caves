// @ts-nocheck
/**
 * Landlord Portal API Routes
 * ──────────────────────────
 * Scoped to the authenticated landlord (userId = req.user.id with role landlord/owner/manager).
 *
 * GET  /api/landlord/stats        — Overview KPIs (properties, tenants, income, maintenance)
 * GET  /api/landlord/properties   — Properties owned by the current landlord
 * POST /api/landlord/properties   — Add a new property (delegates to /api/properties)
 * GET  /api/landlord/maintenance  — Maintenance requests for landlord's properties
 * PATCH /api/landlord/maintenance/:id — Update maintenance status
 * GET  /api/landlord/finances     — Income summary derived from leases
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/landlord/stats ────────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    // All properties owned by this landlord
    const [properties, activeLeasesCount, maintenanceOpen, maintenanceEmergency] = await Promise.all([
      prisma.property.count({ where: { userId } }),
      prisma.lease.count({ where: { landlordId: userId, status: 'active' } }),
      prisma.maintenance.count({
        where: {
          property: { userId },
          status: { in: ['open', 'in_progress'] },
        },
      }),
      prisma.maintenance.count({
        where: {
          property: { userId },
          priority: 'emergency',
          status: { notIn: ['completed', 'cancelled'] },
        },
      }),
    ]);

    // Monthly income from active leases
    const activeLeases = await prisma.lease.findMany({
      where: { landlordId: userId, status: 'active' },
      select: { monthlyRent: true, currency: true },
    });
    const monthlyIncomeAED = activeLeases.reduce((sum, l) => sum + l.monthlyRent, 0);

    res.json({
      success: true,
      stats: {
        totalProperties: properties,
        activeTenants: activeLeasesCount,
        openMaintenanceRequests: maintenanceOpen,
        emergencyRequests: maintenanceEmergency,
        monthlyIncomeAED,
      },
    });
  })
);

// ─── GET /api/landlord/properties ───────────────────────────────────────────
router.get(
  '/properties',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const status = req.query.status as string | undefined;

    const properties = await prisma.property.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        leases: {
          where: { status: 'active' },
          select: {
            id: true,
            monthlyRent: true,
            currency: true,
            startDate: true,
            endDate: true,
            tenant: { select: { id: true, name: true, email: true, phone: true } },
          },
          take: 1,
        },
      },
    });

    // Flatten for portal consumption
    const data = properties.map(p => {
      const activeLease = p.leases[0] ?? null;
      return {
        id: p.id,
        title: p.title,
        address: p.location,
        type: p.type,
        status: activeLease ? 'occupied' : 'vacant',
        propertyStatus: p.status,
        monthlyRent: activeLease?.monthlyRent ?? p.price,
        currency: activeLease?.currency ?? p.currency,
        tenantName: activeLease?.tenant?.name ?? null,
        tenantEmail: activeLease?.tenant?.email ?? null,
        leaseStart: activeLease?.startDate ?? null,
        leaseEnd: activeLease?.endDate ?? null,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        sqft: p.sqft,
        images: p.images,
        createdAt: p.createdAt,
      };
    });

    res.json({ success: true, properties: data });
  })
);

// ─── POST /api/landlord/properties ──────────────────────────────────────────
router.post(
  '/properties',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const {
      title,
      description,
      type = 'apartment',
      price,
      bedrooms = 0,
      bathrooms = 0,
      sqft = 0,
      location,
      area,
      amenities = [],
      images = [],
    } = req.body;

    if (!title || typeof title !== 'string') throw new AppError('title is required', 400);
    if (!price || typeof price !== 'number' || price <= 0) throw new AppError('price must be a positive number', 400);
    if (!location || typeof location !== 'string') throw new AppError('location is required', 400);

    const property = await prisma.property.create({
      data: {
        title: String(title).slice(0, 200),
        description: description ? String(description).slice(0, 2000) : undefined,
        type: String(type),
        price,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: Number(sqft),
        location: String(location).slice(0, 200),
        area: area ? String(area).slice(0, 100) : undefined,
        amenities: Array.isArray(amenities) ? amenities.map(String) : [],
        images: Array.isArray(images) ? images.map(String) : [],
        userId,
      },
    });

    logger.info('Landlord portal: property created', { propertyId: property.id, userId });
    res.status(201).json({ success: true, property });
  })
);

// ─── GET /api/landlord/maintenance ──────────────────────────────────────────
router.get(
  '/maintenance',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const statusFilter = req.query.status as string | undefined;

    const requests = await prisma.maintenance.findMany({
      where: {
        property: { userId },
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        property: { select: { id: true, title: true, location: true } },
        requester: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ success: true, requests });
  })
);

// ─── PATCH /api/landlord/maintenance/:id ────────────────────────────────────
router.patch(
  '/maintenance/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const { status, notes, scheduledDate, cost } = req.body;

    const request = await prisma.maintenance.findUnique({
      where: { id },
      include: { property: { select: { userId: true } } },
    });

    if (!request) throw new AppError('Maintenance request not found', 404);
    if (request.property.userId !== userId) throw new AppError('Access denied', 403);

    const VALID_STATUSES = ['open', 'in_progress', 'scheduled', 'completed', 'cancelled'];
    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }

    const updated = await prisma.maintenance.update({
      where: { id },
      data: {
        ...(status ? { status, ...(status === 'completed' ? { completedAt: new Date() } : {}) } : {}),
        ...(notes ? { notes: String(notes).slice(0, 2000) } : {}),
        ...(scheduledDate ? { scheduledDate: new Date(scheduledDate) } : {}),
        ...(cost !== undefined ? { cost: Number(cost) } : {}),
      },
    });

    logger.info('Landlord portal: maintenance updated', { id, userId, status });
    res.json({ success: true, request: updated });
  })
);

// ─── GET /api/landlord/finances ─────────────────────────────────────────────
router.get(
  '/finances',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [activeLeases, allLeases, maintenanceCosts] = await Promise.all([
      // Active leases = current income
      prisma.lease.findMany({
        where: { landlordId: userId, status: 'active' },
        select: {
          id: true,
          monthlyRent: true,
          depositAmount: true,
          currency: true,
          tenant: { select: { id: true, name: true } },
          property: { select: { id: true, title: true } },
        },
      }),
      // All leases for historical context
      prisma.lease.count({ where: { landlordId: userId } }),
      // Maintenance costs this month
      prisma.maintenance.findMany({
        where: {
          property: { userId },
          status: 'completed',
          completedAt: { gte: startOfMonth },
        },
        select: { cost: true, costCurrency: true },
      }),
    ]);

    const totalMonthlyIncome = activeLeases.reduce((sum, l) => sum + l.monthlyRent, 0);
    const totalDepositsHeld = activeLeases.reduce((sum, l) => sum + l.depositAmount, 0);
    const maintenanceCostThisMonth = maintenanceCosts.reduce((sum, m) => sum + (m.cost ?? 0), 0);
    const netIncomeThisMonth = totalMonthlyIncome - maintenanceCostThisMonth;

    res.json({
      success: true,
      finances: {
        totalMonthlyIncome,
        totalDepositsHeld,
        maintenanceCostThisMonth,
        netIncomeThisMonth,
        activeLeaseCount: activeLeases.length,
        totalLeaseCount: allLeases,
        leases: activeLeases.map(l => ({
          id: l.id,
          tenantName: l.tenant.name,
          propertyTitle: l.property.title,
          monthlyRent: l.monthlyRent,
          depositAmount: l.depositAmount,
          currency: l.currency,
        })),
      },
    });
  })
);

export default router;
