/**
 * Tenant Portal API Routes
 * ────────────────────────
 * Scoped to the authenticated tenant (req.user.id).
 *
 * GET  /api/portal/tenant/lease           — Active lease for the tenant
 * GET  /api/portal/tenant/payments        — Payment history derived from leases
 * GET  /api/portal/tenant/documents       — Lease documents for the tenant
 * GET  /api/portal/tenant/maintenance     — Maintenance requests submitted by the tenant
 * POST /api/portal/tenant/maintenance     — Submit a new maintenance request
 * GET  /api/portal/tenant/dashboard       — Summary KPIs for tenant dashboard
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/portal/tenant/dashboard ──────────────────────────────────────
router.get(
  '/dashboard',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const [activeLease, openMaintenance, totalMaintenance] = await Promise.all([
      prisma.lease.findFirst({
        where: { tenantId: userId, status: 'active' },
        select: { monthlyRent: true, endDate: true, currency: true },
      }),
      prisma.maintenance.count({
        where: { requesterId: userId, status: { in: ['open', 'in_progress'] } },
      }),
      prisma.maintenance.count({ where: { requesterId: userId } }),
    ]);

    const daysRemaining = activeLease
      ? Math.ceil((new Date(activeLease.endDate).getTime() - Date.now()) / 86400000)
      : null;

    res.json({
      success: true,
      data: {
        hasActiveLease: !!activeLease,
        monthlyRent: activeLease?.monthlyRent ?? null,
        currency: activeLease?.currency ?? 'AED',
        daysRemainingOnLease: daysRemaining,
        openMaintenanceRequests: openMaintenance,
        totalMaintenanceRequests: totalMaintenance,
      },
    });
  })
);

// ─── GET /api/portal/tenant/lease ───────────────────────────────────────────
router.get(
  '/lease',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const lease = await prisma.lease.findFirst({
      where: { tenantId: userId, status: { in: ['active', 'expiring'] } },
      orderBy: { startDate: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            area: true,
            type: true,
            bedrooms: true,
            bathrooms: true,
            sqft: true,
            images: true,
          },
        },
        landlord: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!lease) {
      return res.json({ success: true, data: null });
    }

    const today = new Date();
    const end = new Date(lease.endDate);
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / 86400000);
    const leaseStatus =
      daysRemaining < 0 ? 'Expired' : daysRemaining < 60 ? 'Expiring Soon' : 'Active';

    res.json({
      success: true,
      data: {
        id: lease.id,
        leaseNumber: lease.leaseNumber,
        property: lease.property.title,
        address: lease.property.location,
        propertyType: lease.property.type,
        bedrooms: lease.property.bedrooms,
        bathrooms: lease.property.bathrooms,
        sqft: lease.property.sqft,
        startDate: lease.startDate,
        endDate: lease.endDate,
        monthlyRent: lease.monthlyRent,
        depositPaid: lease.depositAmount,
        currency: lease.currency,
        status: lease.status,
        leaseStatus,
        daysRemaining,
        ejariNumber: lease.ejariNumber,
        ejariStatus: lease.ejariStatus,
        ejariRegistrationDate: lease.ejariRegistrationDate,
        landlord: lease.landlord,
        terms: lease.terms,
      },
    });
  })
);

// ─── GET /api/portal/tenant/payments ────────────────────────────────────────
router.get(
  '/payments',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    // Find the tenant's active lease
    const lease = await prisma.lease.findFirst({
      where: { tenantId: userId, status: { in: ['active', 'expiring', 'expired'] } },
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        monthlyRent: true,
        depositAmount: true,
        currency: true,
        startDate: true,
        endDate: true,
        nextPaymentDue: true,
        property: { select: { title: true } },
      },
    });

    if (!lease) {
      return res.json({ success: true, data: { payments: [], summary: null } });
    }

    // Generate a payment schedule from lease start to today
    const payments: {
      id: string;
      month: string;
      amount: number;
      currency: string;
      dueDate: string;
      status: string;
      type: string;
      propertyTitle: string;
    }[] = [];

    const start = new Date(lease.startDate);
    const end = new Date(Math.min(new Date(lease.endDate).getTime(), Date.now()));
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

    while (cursor <= end) {
      const dueDate = new Date(cursor.getFullYear(), cursor.getMonth(), start.getDate());
      const isPast = dueDate < new Date();
      payments.push({
        id: `pmt-${cursor.getFullYear()}-${cursor.getMonth() + 1}`,
        month: cursor.toLocaleString('en', { month: 'long', year: 'numeric' }),
        amount: lease.monthlyRent,
        currency: lease.currency,
        dueDate: dueDate.toISOString(),
        status: isPast ? 'paid' : 'upcoming',
        type: 'rent',
        propertyTitle: lease.property.title,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const paid = payments.filter(p => p.status === 'paid');
    const summary = {
      totalPaid: paid.reduce((s, p) => s + p.amount, 0),
      currency: lease.currency,
      nextPaymentDue: lease.nextPaymentDue ?? null,
      nextPaymentAmount: lease.monthlyRent,
      depositPaid: lease.depositAmount,
    };

    res.json({ success: true, data: { payments: payments.reverse(), summary } });
  })
);

// ─── GET /api/portal/tenant/documents ───────────────────────────────────────
router.get(
  '/documents',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    // Lease documents via the Document model — filter by related propertyId from active lease
    const activeLease = await prisma.lease.findFirst({
      where: { tenantId: userId, status: { in: ['active', 'expiring'] } },
      select: { propertyId: true },
    });

    const docs = activeLease
      ? await prisma.document.findMany({
          where: { propertyId: activeLease.propertyId },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            createdAt: true,
          },
        })
      : [];

    // Also pull lease info for Ejari reference
    const lease = await prisma.lease.findFirst({
      where: { tenantId: userId, status: { in: ['active', 'expiring'] } },
      select: { id: true, leaseNumber: true, ejariNumber: true, ejariStatus: true },
    });

    res.json({
      success: true,
      data: {
        documents: docs,
        leaseReference: lease
          ? { leaseId: lease.id, leaseNumber: lease.leaseNumber, ejariNumber: lease.ejariNumber, ejariStatus: lease.ejariStatus }
          : null,
      },
    });
  })
);

// ─── GET /api/portal/tenant/maintenance ─────────────────────────────────────
router.get(
  '/maintenance',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const statusFilter = req.query.status as string | undefined;

    const requests = await prisma.maintenance.findMany({
      where: {
        requesterId: userId,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        property: { select: { id: true, title: true, location: true } },
      },
    });

    res.json({ success: true, data: requests });
  })
);

// ─── POST /api/portal/tenant/maintenance ────────────────────────────────────
router.post(
  '/maintenance',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    // Schema validation enforced for payload
    const { title, description, category = 'general', priority = 'medium' } = req.body;

    if (!title || typeof title !== 'string') throw new AppError('title is required', 400);

    // Find tenant's active lease to get propertyId
    const activeLease = await prisma.lease.findFirst({
      where: { tenantId: userId, status: { in: ['active', 'expiring'] } },
      select: { propertyId: true },
    });

    if (!activeLease) {
      throw new AppError('No active lease found — maintenance requests require an active lease', 400);
    }

    const VALID_CATEGORIES = ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'general'];
    const VALID_PRIORITIES = ['low', 'medium', 'high', 'emergency'];

    const request = await prisma.maintenance.create({
      data: {
        title: String(title).slice(0, 200),
        description: description ? String(description).slice(0, 2000) : undefined,
        category: VALID_CATEGORIES.includes(category) ? category : 'general',
        priority: VALID_PRIORITIES.includes(priority) ? priority : 'medium',
        requesterId: userId,
        propertyId: activeLease.propertyId,
      },
    });

    logger.info('Tenant portal: maintenance request created', { id: request.id, userId });
    res.status(201).json({ success: true, data: request });
  })
);

export default router;
