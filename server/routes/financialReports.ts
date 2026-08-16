/**
 * Financial Reports API Routes — Wave 44 (REQ-RPT-001, REQ-RPT-003)
 *
 * Endpoints:
 * - GET /api/financial-reports/monthly-pnl — Monthly P&L auto-generation statement
 * - GET /api/financial-reports/landlord-income — Rental income report per landlord
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

// ─── GET /api/financial-reports/monthly-pnl ──────────────────────────────
router.get(
  '/monthly-pnl',
  requirePermission('export_financial_reports'),
  asyncHandler(async (req: Request, res: Response) => {
    const year = parseInt((req.query.year as string) || String(new Date().getFullYear()), 10);
    const month = parseInt((req.query.month as string) || String(new Date().getMonth() + 1), 10);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [rentPayments, maintenanceRecords] = await Promise.all([
      prisma.rentPayment.findMany({
        where: {
          paidDate: { gte: startDate, lte: endDate },
          status: 'paid',
        },
      }),
      prisma.maintenance.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    const totalRentalRevenueAED = rentPayments.reduce((sum, r) => sum + (r.amountAED || 0), 0);
    const totalMaintenanceCostAED = maintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0);
    const netOperatingIncomeAED = totalRentalRevenueAED - totalMaintenanceCostAED;

    res.status(200).json({
      success: true,
      data: {
        period: `${year}-${String(month).padStart(2, '0')}`,
        currency: 'AED',
        revenue: {
          rentalRevenueAED: totalRentalRevenueAED,
          countPayments: rentPayments.length,
        },
        expenses: {
          maintenanceCostAED: totalMaintenanceCostAED,
          countRequests: maintenanceRecords.length,
        },
        netOperatingIncomeAED,
      },
    });
  })
);

// ─── GET /api/financial-reports/landlord-income ───────────────────────────
router.get(
  '/landlord-income',
  requirePermission('export_financial_reports'),
  asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.query.landlordId as string | undefined;

    const leases = await prisma.lease.findMany({
      where: {
        status: 'active',
        ...(landlordId ? { landlordId } : {}),
      },
      select: {
        id: true,
        landlordId: true,
        landlord: {
          select: { name: true, email: true },
        },
        monthlyRent: true,
        currency: true,
      },
    });

    const incomeByLandlord: Record<string, { landlordName: string; activeLeasesCount: number; annualIncomeAED: number }> = {};

    leases.forEach(l => {
      const id = l.landlordId || 'unknown';
      const annualRent = (l.monthlyRent || 0) * 12;
      if (!incomeByLandlord[id]) {
        incomeByLandlord[id] = {
          landlordName: l.landlord?.name || l.landlord?.email || 'Unspecified Landlord',
          activeLeasesCount: 0,
          annualIncomeAED: 0,
        };
      }
      incomeByLandlord[id].activeLeasesCount += 1;
      incomeByLandlord[id].annualIncomeAED += annualRent;
    });

    res.status(200).json({
      success: true,
      data: Object.entries(incomeByLandlord).map(([id, stats]) => ({
        landlordId: id,
        ...stats,
      })),
    });
  })
);

export default router;
