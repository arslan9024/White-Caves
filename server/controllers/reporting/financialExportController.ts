/**
 * financialExportController.ts
 * Handlers for leasing P&L dashboard and Excel/PDF exports (Leads, Properties, P&L, Commissions).
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { documentService } from '../../services/DocumentService.js';

export async function getLeasingDashboard(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'managing_director'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — leasing dashboard requires manager or above role', 403);
  }

  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  const sixtyDaysFromNow = new Date(now);
  sixtyDaysFromNow.setDate(now.getDate() + 60);
  const ninetyDaysFromNow = new Date(now);
  ninetyDaysFromNow.setDate(now.getDate() + 90);

  const [
    activeLeases,
    expiringIn30,
    expiringIn60,
    expiringIn90,
    totalLeases,
    leasingLeads,
    pendingOffers,
    acceptedOffers,
    pdcCleared,
    pdcBounced,
    pdcPending,
    maintenanceCosts,
    commissions,
  ] = await Promise.all([
    prisma.lease.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        leaseNumber: true,
        monthlyRent: true,
        currency: true,
        endDate: true,
        ejariStatus: true,
        ejariNumber: true,
        property: { select: { id: true, title: true, location: true } },
        tenant: { select: { id: true, name: true, email: true } },
        landlord: { select: { id: true, name: true } },
      },
      orderBy: { endDate: 'asc' },
    }),
    prisma.lease.count({
      where: { status: 'active', endDate: { lte: thirtyDaysFromNow, gte: now } },
    }),
    prisma.lease.count({
      where: { status: 'active', endDate: { lte: sixtyDaysFromNow, gte: now } },
    }),
    prisma.lease.count({
      where: { status: 'active', endDate: { lte: ninetyDaysFromNow, gte: now } },
    }),
    prisma.lease.count(),
    prisma.lead.count({ where: { dealType: 'lease' } }),
    prisma.offer.count({ where: { offerType: 'lease', status: 'pending' } }),
    prisma.offer.count({ where: { offerType: 'lease', status: 'accepted' } }),
    prisma.pDCSchedule.aggregate({
      where: { status: 'cleared' },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.pDCSchedule.aggregate({
      where: { status: 'bounced' },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.pDCSchedule.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.maintenance.aggregate({ where: { status: 'completed' }, _sum: { cost: true } }),
    prisma.commission.findMany({
      where: { type: 'rental' },
      select: { amount: true, status: true },
    }),
  ]);

  const mrr = activeLeases.reduce((s, l) => s + l.monthlyRent, 0);

  const totalCommission = commissions.reduce((s, c) => s + c.amount, 0);
  const paidCommission = commissions
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + c.amount, 0);
  const pendingCommission = commissions
    .filter(c => c.status === 'pending')
    .reduce((s, c) => s + c.amount, 0);

  const totalRentCollected = pdcCleared._sum.amount || 0;
  const totalExpenses = (maintenanceCosts._sum.cost || 0) + totalCommission;
  const netProfit = totalRentCollected - totalExpenses;

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalLeases,
        activeLeases: activeLeases.length,
        mrr,
        currency: 'AED',
        leasingLeads,
        pendingOffers,
        acceptedOffers,
      },
      renewalForecast: {
        expiringIn30,
        expiringIn60,
        expiringIn90,
      },
      activeLeasesList: activeLeases,
      pdc: {
        cleared: { count: pdcCleared._count._all, amount: pdcCleared._sum.amount || 0 },
        pending: { count: pdcPending._count._all, amount: pdcPending._sum.amount || 0 },
        bounced: { count: pdcBounced._count._all, amount: pdcBounced._sum.amount || 0 },
      },
      pnl: {
        totalRentCollected,
        totalCommission,
        paidCommission,
        pendingCommission,
        maintenanceCost: maintenanceCosts._sum.cost || 0,
        netProfit,
      },
    },
  });
}

export async function exportLeadsExcel(_req: Request, res: Response): Promise<void> {
  const file = await documentService.generateLeadsExcel();
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.status(200).send(file.buffer);
}

export async function exportPropertiesExcel(_req: Request, res: Response): Promise<void> {
  const file = await documentService.generatePropertiesExcel();
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.status(200).send(file.buffer);
}

export async function exportPlExcel(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — P&L report requires finance or manager role', 403);
  }
  const file = await documentService.generateMonthlyPLReport();
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.status(200).send(file.buffer);
}

export async function exportCommissionsExcel(req: Request, res: Response): Promise<void> {
  const agentId = req.query.agentId as string | undefined;
  const file = await documentService.generateCommissionDetailExcel(agentId);

  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.status(200).send(file.buffer);
}

export async function exportPnlPdf(req: Request, res: Response): Promise<void> {
  const now = new Date();
  const year = parseInt((req.query.year as string) || String(now.getFullYear()), 10);
  const month = parseInt((req.query.month as string) || String(now.getMonth() + 1), 10);

  const file = await documentService.generateMonthlyPnLPdf(year, month);

  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.status(200).send(file.buffer);
}
