/**
 * leaseQueryController.ts
 * Handlers for retrieving leases, expiring contracts, Ejari tracking, details, and P&L statements.
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';

export async function listLeases(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const status = req.query.status as string | undefined;
  const role = req.query.role as string | undefined;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

  const where: Record<string, unknown> = {};

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
}

export async function getExpiringLeases(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function getEjariTracking(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const role = req.query.role as string | undefined;
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
}

export async function getLeaseDetail(req: AuthRequest, res: Response): Promise<void> {
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

  const userRole = req.user?.role;
  if (lease.tenantId !== userId && lease.landlordId !== userId && userRole !== 'owner') {
    throw new AppError('Access denied', 403);
  }

  res.json({ success: true, data: lease });
}

export async function getLeasePnl(req: AuthRequest, res: Response): Promise<void> {
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

  const startMs = lease.startDate.getTime();
  const endMs = lease.endDate.getTime();
  const durationMonths = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24 * 30)));

  const clearedPDC = lease.pdcSchedule.filter(p => p.status === 'cleared');
  const rentCollected = clearedPDC.reduce((s, p) => s + p.amount, 0);

  const commissions = await prisma.commission.findMany({
    where: { propertyId: lease.propertyId },
    select: { amount: true, status: true, type: true },
  });
  const totalCommission = commissions.reduce((s, c) => s + c.amount, 0);
  const paidCommission = commissions
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + c.amount, 0);

  const maintenance = await prisma.maintenance.findMany({
    where: { propertyId: lease.propertyId },
    select: { cost: true, status: true },
  });
  const maintenanceCost = maintenance
    .filter(m => m.status === 'completed')
    .reduce((s, m) => s + (m.cost || 0), 0);

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
}

