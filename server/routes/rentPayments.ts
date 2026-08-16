/**
 * Rent Payments Route Handler — Wave 35 (REQ-TENANT-001, REQ-TENANT-002)
 *
 * Endpoints:
 * - GET /api/leases/:leaseId/payments — List rent payment schedule for a lease
 * - PATCH /api/leases/:leaseId/payments/:paymentId — Update payment status (paid/overdue/waived)
 * - POST /api/leases/:leaseId/generate-schedule — Auto-generate payment schedule & PDC cheques
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import { generateRentSchedule } from '../services/rentScheduleService.js';
import { validateIdParam } from '../utils/validate.js';

const router = Router({ mergeParams: true });

// ─── GET /api/leases/:leaseId/payments ────────────────────────────────
router.get(
  '/',
  requirePermission('view_own_lease'),
  asyncHandler(async (req: Request, res: Response) => {
    const leaseId = (req.params as Record<string, string>).leaseId;
    validateIdParam(leaseId, 'Lease ID');

    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      select: { id: true, landlordId: true, tenantId: true },
    });

    if (!lease) {
      throw new AppError('Lease not found', 404);
    }

    const payments = await prisma.rentPayment.findMany({
      where: { leaseId },
      orderBy: { installment: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  })
);

// ─── POST /api/leases/:leaseId/generate-schedule ──────────────────────
router.post(
  '/generate-schedule',
  requirePermission('create_contracts'),
  asyncHandler(async (req: Request, res: Response) => {
    const leaseId = (req.params as Record<string, string>).leaseId;
    validateIdParam(leaseId, 'Lease ID');

    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
    });

    if (!lease) {
      throw new AppError('Lease not found', 404);
    }

    const { numberOfCheques = 12, bankName = 'Emirates NBD' } = req.body as {
      numberOfCheques?: number;
      bankName?: string;
    };

    const result = await generateRentSchedule({
      leaseId: lease.id,
      startDate: lease.startDate,
      endDate: lease.endDate,
      monthlyRent: lease.monthlyRent,
      numberOfCheques,
      bankName,
      tenantId: lease.tenantId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// ─── PATCH /api/leases/:leaseId/payments/:paymentId ────────────────────
router.patch(
  '/:paymentId',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { leaseId, paymentId } = req.params as Record<string, string>;
    validateIdParam(leaseId, 'Lease ID');
    validateIdParam(paymentId, 'Payment ID');

    const payment = await prisma.rentPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.leaseId !== leaseId) {
      throw new AppError('Rent payment installment not found', 404);
    }

    const { status, paymentMethod, notes } = req.body as {
      status?: 'pending' | 'paid' | 'overdue' | 'waived';
      paymentMethod?: string;
      notes?: string;
    };

    const nextStatus = status || payment.status;
    const paidDate = nextStatus === 'paid' ? new Date() : payment.paidDate;
    const receiptNumber =
      nextStatus === 'paid' && !payment.receiptNumber
        ? `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        : payment.receiptNumber;

    const updated = await prisma.rentPayment.update({
      where: { id: paymentId },
      data: {
        status: nextStatus,
        paymentMethod: paymentMethod || payment.paymentMethod,
        notes: notes || payment.notes,
        paidDate,
        receiptNumber,
      },
    });

    if (nextStatus === 'paid') {
      await prisma.activity.create({
        data: {
          type: 'lease',
          action: 'rent_payment_received',
          description: `Rent payment installment ${payment.installment} (AED ${payment.amountAED}) marked as PAID. Receipt #${receiptNumber}`,
          userId: req.user?.id || null,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  })
);

export default router;
