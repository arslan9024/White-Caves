/**
 * Leases API Routes
 * ─────────────────
 * CRUD endpoints for property lease management.
 *
 * GET    /api/leases                   — List leases (tenant sees own, landlord sees own)
 * GET    /api/leases/expiring          — Leases expiring within N days
 * GET    /api/leases/:id               — Get lease detail
 * POST   /api/leases                   — Create a new lease
 * PATCH  /api/leases/:id               — Update lease (renew, terminate, Ejari, key handover)
 * DELETE /api/leases/:id               — Delete a lease (draft only)
 * POST   /api/leases/:id/addendum      — Add an addendum clause to a lease
 * GET    /api/leases/:id/addenda       — List addenda for a lease
 * POST   /api/leases/:id/key-handover  — Record key handover event
 * GET    /api/leases/:id/pnl           — Per-lease P&L report
 * GET    /api/leases/:id/pdc           — List PDC schedule for a lease
 * POST   /api/leases/:id/pdc           — Add a PDC cheque to schedule
 * PATCH  /api/leases/:id/pdc/:pdcId    — Update PDC status (presented/cleared/bounced)
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

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
  })
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
  })
);

// ─── GET /api/leases/ejari/tracking — Ejari compliance dashboard data ──────
router.get(
  '/ejari/tracking',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const role = req.query.role as string | undefined; // tenant | landlord
    const days = Math.max(1, parseInt(req.query.days as string) || 30);
    const requestedStatus = req.query.status as string | undefined;
    const validEjariStatuses = ['pending', 'registered', 'expired', 'cancelled'];

    if (requestedStatus && !validEjariStatuses.includes(requestedStatus)) {
      throw new AppError(
        `Invalid Ejari status. Must be one of: ${validEjariStatuses.join(', ')}`,
        400
      );
    }

    const where: Record<string, unknown> = {};

    if (role === 'tenant') {
      where.tenantId = userId;
    } else if (role === 'landlord') {
      where.landlordId = userId;
    } else {
      where.OR = [{ tenantId: userId }, { landlordId: userId }];
    }

    if (requestedStatus) {
      where.ejariStatus = requestedStatus;
    }

    const leases = await prisma.lease.findMany({
      where,
      include: {
        property: {
          select: { id: true, title: true, location: true, type: true },
        },
        tenant: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: [{ ejariExpiryDate: 'asc' }, { createdAt: 'desc' }],
      take: 500,
    });

    const now = Date.now();
    const expiryWindow = new Date();
    expiryWindow.setDate(expiryWindow.getDate() + days);

    const data = leases.map(lease => {
      const expiry = lease.ejariExpiryDate ? lease.ejariExpiryDate.getTime() : null;
      const daysToExpiry =
        expiry !== null ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : null;

      return {
        id: lease.id,
        leaseNumber: lease.leaseNumber,
        ejariNumber: lease.ejariNumber,
        ejariStatus: lease.ejariStatus,
        ejariRegistrationDate: lease.ejariRegistrationDate,
        ejariExpiryDate: lease.ejariExpiryDate,
        daysToExpiry,
        isExpiringSoon:
          lease.ejariStatus === 'registered' &&
          Boolean(lease.ejariExpiryDate) &&
          (lease.ejariExpiryDate as Date) >= new Date() &&
          (lease.ejariExpiryDate as Date) <= expiryWindow,
        property: lease.property,
        tenant: lease.tenant,
      };
    });

    const summary = {
      total: data.length,
      pending: data.filter(i => i.ejariStatus === 'pending').length,
      registered: data.filter(i => i.ejariStatus === 'registered').length,
      expired: data.filter(i => i.ejariStatus === 'expired').length,
      cancelled: data.filter(i => i.ejariStatus === 'cancelled').length,
      expiringSoon: data.filter(i => i.isExpiringSoon).length,
    };

    res.status(200).json({
      success: true,
      data,
      summary,
      meta: {
        expiringWithinDays: days,
      },
    });
  })
);

// ─── GET /api/leases/:id — Get lease detail ──────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
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
  })
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

    logger.info('Lease created', { userId, leaseId: lease.id, propertyId, tenantId });
    res.status(201).json({ success: true, data: lease });
  })
);

// ─── PATCH /api/leases/:id — Update a lease ─────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lease not found', 404);

    // Only landlord or owner can update
    const userRole = req.user?.role;
    if (existing.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied — only landlord or owner can update leases', 403);
    }

    const {
      status,
      monthlyRent,
      endDate,
      terms,
      nextPaymentDue,
      leaseNumber,
      documents,
      // Ejari fields
      ejariNumber,
      ejariStatus,
      ejariRegistrationDate,
      ejariExpiryDate,
      // Key handover fields (handled via dedicated endpoint but allow PATCH too)
      keyHandoverDate,
      keyHandoverNotes,
      meterReadings,
      addendumDocuments,
      // Linked offer
      offerId,
    } = req.body;
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
    // Ejari fields
    if (ejariNumber !== undefined) updateData.ejariNumber = ejariNumber;
    if (ejariStatus !== undefined) {
      const validEjariStatuses = ['pending', 'registered', 'expired', 'cancelled'];
      if (!validEjariStatuses.includes(ejariStatus)) {
        throw new AppError(
          `Invalid ejariStatus. Must be one of: ${validEjariStatuses.join(', ')}`,
          400
        );
      }
      updateData.ejariStatus = ejariStatus;
    }
    if (ejariRegistrationDate !== undefined) {
      updateData.ejariRegistrationDate = ejariRegistrationDate
        ? new Date(ejariRegistrationDate)
        : null;
    }
    if (ejariExpiryDate !== undefined) {
      updateData.ejariExpiryDate = ejariExpiryDate ? new Date(ejariExpiryDate) : null;
    }
    // Key handover fields
    if (keyHandoverDate !== undefined) {
      updateData.keyHandoverDate = keyHandoverDate ? new Date(keyHandoverDate) : null;
    }
    if (keyHandoverNotes !== undefined) updateData.keyHandoverNotes = keyHandoverNotes;
    if (meterReadings !== undefined) updateData.meterReadings = meterReadings;
    if (addendumDocuments !== undefined) updateData.addendumDocuments = addendumDocuments;
    if (offerId !== undefined) updateData.offerId = offerId || null;

    const updated = await prisma.lease.update({ where: { id }, data: updateData });

    logger.info('Lease updated', { userId, leaseId: id, status: updated.status });
    res.json({ success: true, data: updated });
  })
);

// ─── DELETE /api/leases/:id — Delete a lease (draft only) ───────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
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

    logger.info('Lease deleted', { userId, leaseId: id });
    res.json({ success: true, message: 'Lease deleted' });
  })
);

// ─── POST /api/leases/:id/addendum — Add an addendum clause ─────────────────
router.post(
  '/:id/addendum',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (existing.landlordId !== userId && existing.tenantId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    const { clause, agreedBy, signedAt, documentUrl } = req.body;
    if (!clause || typeof clause !== 'string') throw new AppError('clause is required', 400);

    const addendum = await prisma.leaseAddendum.create({
      data: {
        leaseId: id,
        clause,
        agreedBy: Array.isArray(agreedBy) ? agreedBy : [],
        signedAt: signedAt ? new Date(signedAt) : null,
        documentUrl: documentUrl || null,
      },
    });

    logger.info('Lease addendum created', { userId, leaseId: id, addendumId: addendum.id });
    res.status(201).json({ success: true, data: addendum });
  })
);

// ─── GET /api/leases/:id/addenda — List addenda for a lease ─────────────────
router.get(
  '/:id/addenda',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const lease = await prisma.lease.findUnique({
      where: { id },
      select: { tenantId: true, landlordId: true },
    });
    if (!lease) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (lease.tenantId !== userId && lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    const addenda = await prisma.leaseAddendum.findMany({
      where: { leaseId: id },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: addenda });
  })
);

// ─── POST /api/leases/:id/key-handover — Record key handover ─────────────────
router.post(
  '/:id/key-handover',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (existing.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied — only landlord or owner can record key handover', 403);
    }

    const { handoverDate, notes, meterReadings, documentUrl } = req.body;

    const handover = new Date(handoverDate || Date.now());
    if (isNaN(handover.getTime())) throw new AppError('Invalid handoverDate', 400);

    const updated = await prisma.lease.update({
      where: { id },
      data: {
        keyHandoverDate: handover,
        keyHandoverNotes: notes || null,
        meterReadings: meterReadings || null,
        // Append handover document to documents list if provided
        ...(documentUrl ? { addendumDocuments: { push: documentUrl } } : {}),
      },
    });

    // Log the key handover event in Activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'lease',
        action: 'key_handover',
        description: `Key handover recorded for lease ${existing.leaseNumber || id}`,
        metadata: { leaseId: id, handoverDate: handover.toISOString(), meterReadings },
      },
    });

    logger.info('Key handover recorded', { userId, leaseId: id, handoverDate: handover });
    res.json({ success: true, data: updated, message: 'Key handover recorded' });
  })
);

// ─── GET /api/leases/:id/pnl — Per-lease P&L report ─────────────────────────
router.get(
  '/:id/pnl',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        property: { select: { id: true, title: true, location: true } },
        tenant: { select: { id: true, name: true, email: true } },
        landlord: { select: { id: true, name: true, email: true } },
        pdcSchedule: true,
      },
    });
    if (!lease) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (lease.tenantId !== userId && lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    // Lease duration in months
    const startMs = lease.startDate.getTime();
    const endMs = lease.endDate.getTime();
    const durationMonths = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24 * 30)));

    // Revenue: rent collected via cleared PDC cheques
    const clearedPDC = lease.pdcSchedule.filter(p => p.status === 'cleared');
    const rentCollected = clearedPDC.reduce((s, p) => s + p.amount, 0);

    // Commissions for this property
    const commissions = await prisma.commission.findMany({
      where: { propertyId: lease.propertyId },
      select: { amount: true, status: true, type: true },
    });
    const totalCommission = commissions.reduce((s, c) => s + c.amount, 0);
    const paidCommission = commissions
      .filter(c => c.status === 'paid')
      .reduce((s, c) => s + c.amount, 0);

    // Maintenance costs for this property
    const maintenance = await prisma.maintenance.findMany({
      where: { propertyId: lease.propertyId },
      select: { cost: true, status: true },
    });
    const maintenanceCost = maintenance
      .filter(m => m.status === 'completed')
      .reduce((s, m) => s + (m.cost || 0), 0);

    // Annual rent projections
    const annualRent = lease.monthlyRent * 12;
    const grossIncomeProjected = lease.monthlyRent * durationMonths;
    const netProfit = rentCollected - totalCommission - maintenanceCost;

    const pdcSummary = {
      total: lease.pdcSchedule.length,
      cleared: clearedPDC.length,
      pending: lease.pdcSchedule.filter(p => p.status === 'pending').length,
      presented: lease.pdcSchedule.filter(p => p.status === 'presented').length,
      bounced: lease.pdcSchedule.filter(p => p.status === 'bounced').length,
    };

    res.json({
      success: true,
      data: {
        lease: {
          id: lease.id,
          leaseNumber: lease.leaseNumber,
          status: lease.status,
          startDate: lease.startDate,
          endDate: lease.endDate,
          monthlyRent: lease.monthlyRent,
          depositAmount: lease.depositAmount,
          currency: lease.currency,
          ejariNumber: lease.ejariNumber,
          ejariStatus: lease.ejariStatus,
          property: lease.property,
          tenant: lease.tenant,
          landlord: lease.landlord,
        },
        financials: {
          durationMonths,
          annualRent,
          grossIncomeProjected,
          rentCollected,
          totalCommission,
          paidCommission,
          maintenanceCost,
          netProfit,
          collectionRate:
            grossIncomeProjected > 0 ? Math.round((rentCollected / grossIncomeProjected) * 100) : 0,
        },
        pdcSummary,
      },
    });
  })
);

// ─── GET /api/leases/:id/pdc — List PDC schedule ─────────────────────────────
router.get(
  '/:id/pdc',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const lease = await prisma.lease.findUnique({
      where: { id },
      select: { tenantId: true, landlordId: true },
    });
    if (!lease) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (lease.tenantId !== userId && lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    const pdc = await prisma.pDCSchedule.findMany({
      where: { leaseId: id },
      orderBy: { dueDate: 'asc' },
    });

    res.json({ success: true, data: pdc });
  })
);

// ─── POST /api/leases/:id/pdc — Add PDC cheque ───────────────────────────────
router.post(
  '/:id/pdc',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params as Record<string, string>;
    const lease = await prisma.lease.findUnique({ where: { id } });
    if (!lease) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied — only landlord or owner can add PDC entries', 403);
    }

    const { chequeNumber, bankName, amount, dueDate, chequeImageUrl, notes, tenantId } = req.body;
    if (!chequeNumber) throw new AppError('chequeNumber is required', 400);
    if (!bankName) throw new AppError('bankName is required', 400);
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }
    if (!dueDate) throw new AppError('dueDate is required', 400);

    const due = new Date(dueDate);
    if (isNaN(due.getTime())) throw new AppError('Invalid dueDate', 400);

    const effectiveTenantId = tenantId || lease.tenantId;

    const pdc = await prisma.pDCSchedule.create({
      data: {
        leaseId: id,
        tenantId: effectiveTenantId,
        chequeNumber,
        bankName,
        amount,
        dueDate: due,
        chequeImageUrl: chequeImageUrl || null,
        notes: notes || null,
      },
    });

    logger.info('PDC cheque added', { userId, leaseId: id, pdcId: pdc.id, dueDate: due });
    res.status(201).json({ success: true, data: pdc });
  })
);

// ─── PATCH /api/leases/:id/pdc/:pdcId — Update PDC status ───────────────────
router.patch(
  '/:id/pdc/:pdcId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id, pdcId } = req.params as Record<string, string>;
    const lease = await prisma.lease.findUnique({
      where: { id },
      select: { landlordId: true, tenantId: true },
    });
    if (!lease) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied — only landlord or owner can update PDC status', 403);
    }

    const pdc = await prisma.pDCSchedule.findUnique({ where: { id: pdcId } });
    if (!pdc || pdc.leaseId !== id) throw new AppError('PDC record not found for this lease', 404);

    const { status, notes } = req.body;
    const validStatuses = ['pending', 'presented', 'cleared', 'bounced'];
    if (!status || !validStatuses.includes(status)) {
      throw new AppError(`status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updated = await prisma.pDCSchedule.update({
      where: { id: pdcId },
      data: { status, notes: notes || pdc.notes },
    });

    logger.info('PDC status updated', { userId, leaseId: id, pdcId, status });
    res.json({ success: true, data: updated });
  })
);

// ─── GET /api/leases/overdue-collection-queue ──────────────────────────────
// Returns bounced/overdue rent cheque queue for collections workflow.
router.get(
  '/collections/overdue-queue',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const role = req.user?.role;
    const isOwner = role === 'owner';

    const overdueItems = await prisma.pDCSchedule.findMany({
      where: {
        OR: [{ status: 'bounced' }, { status: 'pending', dueDate: { lt: new Date() } }],
        ...(isOwner ? {} : { lease: { landlordId: userId } }),
      },
      include: {
        lease: {
          select: {
            id: true,
            leaseNumber: true,
            monthlyRent: true,
            currency: true,
            property: { select: { id: true, title: true, location: true } },
            tenant: { select: { id: true, name: true, email: true, phone: true } },
            landlord: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
      take: 300,
    });

    const now = Date.now();
    const data = overdueItems.map(item => ({
      id: item.id,
      leaseId: item.leaseId,
      chequeNumber: item.chequeNumber,
      bankName: item.bankName,
      amount: item.amount,
      currency: item.lease?.currency || 'AED',
      dueDate: item.dueDate,
      status: item.status,
      daysOverdue: Math.max(0, Math.floor((now - item.dueDate.getTime()) / 86400000)),
      notes: item.notes,
      lease: item.lease,
    }));

    res.status(200).json({
      success: true,
      data,
      summary: {
        total: data.length,
        bounced: data.filter(i => i.status === 'bounced').length,
        overduePending: data.filter(i => i.status === 'pending').length,
      },
    });
  })
);

const notifyOverdueCollection = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { pdcId } = req.params as Record<string, string>;
  const pdc = await prisma.pDCSchedule.findUnique({
    where: { id: pdcId },
    include: {
      lease: { select: { id: true, leaseNumber: true, tenantId: true, landlordId: true } },
    },
  });

  if (!pdc || !pdc.lease) {
    throw new AppError('PDC record not found', 404);
  }

  const role = req.user?.role;
  const isOwner = role === 'owner';
  if (!isOwner && pdc.lease.landlordId !== userId) {
    throw new AppError('Access denied — only lease landlord or owner can notify collections', 403);
  }

  const channel = typeof req.body?.channel === 'string' ? req.body.channel : 'whatsapp';
  const note =
    typeof req.body?.note === 'string'
      ? req.body.note
      : 'Automated overdue rent collection reminder';

  const activity = await prisma.activity.create({
    data: {
      type: 'payment',
      action: 'overdue_collection_notified',
      description: `Collection reminder sent for cheque ${pdc.chequeNumber} (${channel})`,
      userId,
      metadata: {
        pdcId: pdc.id,
        leaseId: pdc.lease.id,
        leaseNumber: pdc.lease.leaseNumber,
        channel,
        note,
        status: pdc.status,
      },
    },
  });

  res.status(200).json({
    success: true,
    data: {
      pdcId: pdc.id,
      leaseId: pdc.lease.id,
      channel,
      notifiedAt: activity.createdAt,
      activityId: activity.id,
    },
    message: 'Collection reminder logged',
  });
};

// ─── POST /api/leases/collections/overdue-queue/:pdcId/notify ─────────────
// Canonical route for overdue rent queue reminder logging.
router.post('/collections/overdue-queue/:pdcId/notify', asyncHandler(notifyOverdueCollection));

// ─── POST /api/leases/overdue-collection-queue/:pdcId/notify ───────────────
// Backward-compatible alias for existing clients.
router.post('/overdue-collection-queue/:pdcId/notify', asyncHandler(notifyOverdueCollection));

export default router;
