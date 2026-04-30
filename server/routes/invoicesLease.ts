/**
 * Lease Invoices API Routes
 * ─────────────────────────
 * Invoice management for the leasing workflow.
 * Supports deposit invoices and monthly rent invoices.
 *
 * GET    /api/invoices/lease           — List lease-related invoices
 * POST   /api/invoices/lease           — Create an invoice (deposit or rent)
 * GET    /api/invoices/lease/:id       — Get invoice detail
 * PATCH  /api/invoices/lease/:id       — Update invoice status (mark paid, cancel)
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/invoices/lease — List lease invoices ───────────────────────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const leaseId = req.query.leaseId as string | undefined;
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined; // deposit, rent
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

    // Build where clause — restrict to invoices the user can see
    const userRole = req.user?.role;
    const where: Record<string, unknown> = {};

    if (leaseId) {
      // Verify user has access to this lease
      const lease = await prisma.lease.findUnique({
        where: { id: leaseId },
        select: { tenantId: true, landlordId: true },
      });
      if (!lease) throw new AppError('Lease not found', 404);
      if (lease.tenantId !== userId && lease.landlordId !== userId && userRole !== 'owner') {
        throw new AppError('Access denied', 403);
      }
      where.property = leaseId; // stored as leaseId in the property field for lease invoices
    } else if (userRole !== 'owner') {
      // Non-admins can only see their own invoices (by client name matching or created by them)
      where.createdById = userId;
    }

    if (status) where.status = status;
    if (type) {
      // Filter by type stored in notes field (e.g., "TYPE:deposit")
      where.notes = { contains: `TYPE:${type}` };
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      success: true,
      data: invoices,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  }),
);

// ─── POST /api/invoices/lease — Create a lease invoice ───────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const {
      leaseId,
      invoiceType, // 'deposit' | 'rent'
      clientName,
      amount,
      vatAmount,
      dueDate,
      notes,
      invoiceNumber,
    } = req.body;

    if (!leaseId) throw new AppError('leaseId is required', 400);
    if (!clientName) throw new AppError('clientName is required', 400);
    if (!invoiceType || !['deposit', 'rent'].includes(invoiceType)) {
      throw new AppError("invoiceType must be 'deposit' or 'rent'", 400);
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }
    if (!dueDate) throw new AppError('dueDate is required', 400);

    const due = new Date(dueDate);
    if (isNaN(due.getTime())) throw new AppError('Invalid dueDate', 400);

    // Verify lease exists and requester has access
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      select: { tenantId: true, landlordId: true, leaseNumber: true },
    });
    if (!lease) throw new AppError('Lease not found', 404);

    const userRole = req.user?.role;
    if (lease.landlordId !== userId && userRole !== 'owner') {
      throw new AppError('Access denied — only landlord or owner can create invoices', 403);
    }

    const vatAmt = vatAmount ?? 0;
    const totalAmount = amount + vatAmt;

    // Generate invoice number if not provided
    const now = new Date();
    const resolvedInvoiceNumber =
      invoiceNumber ||
      `INV-LEASE-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: resolvedInvoiceNumber,
        client: clientName,
        property: leaseId, // store leaseId in property field for filtering
        amount,
        vatAmount: vatAmt,
        totalAmount,
        dueDate: due,
        notes: `TYPE:${invoiceType}${notes ? ` | ${notes}` : ''}`,
        createdById: userId,
      },
    });

    logger.info('Lease invoice created', {
      userId,
      invoiceId: invoice.id,
      leaseId,
      invoiceType,
      amount,
    });
    res.status(201).json({ success: true, data: invoice });
  }),
);

// ─── GET /api/invoices/lease/:id — Get invoice detail ────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new AppError('Invoice not found', 404);

    const userRole = req.user?.role;
    // Allow access if user created it or is admin
    if (invoice.createdById !== userId && userRole !== 'owner') {
      // Also allow if the user is the landlord/tenant on the associated lease
      if (invoice.property) {
        const lease = await prisma.lease.findUnique({
          where: { id: invoice.property },
          select: { tenantId: true, landlordId: true },
        });
        if (!lease || (lease.tenantId !== userId && lease.landlordId !== userId)) {
          throw new AppError('Access denied', 403);
        }
      } else {
        throw new AppError('Access denied', 403);
      }
    }

    res.json({ success: true, data: invoice });
  }),
);

// ─── PATCH /api/invoices/lease/:id — Update invoice status ───────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new AppError('Invoice not found', 404);

    const userRole = req.user?.role;
    if (invoice.createdById !== userId && userRole !== 'owner') {
      throw new AppError('Access denied', 403);
    }

    const { status, paidAt, notes } = req.body;
    const validStatuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded'];
    if (status && !validStatuses.includes(status)) {
      throw new AppError(`status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (status === 'paid') {
      updateData.paidAt = paidAt ? new Date(paidAt) : new Date();
    }
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.invoice.update({ where: { id }, data: updateData });

    // If invoice paid and linked to a lease, update the lease's nextPaymentDue
    if (status === 'paid' && invoice.property) {
      const lease = await prisma.lease.findUnique({
        where: { id: invoice.property },
        select: { id: true, nextPaymentDue: true, endDate: true },
      });
      if (lease && invoice.notes?.includes('TYPE:rent')) {
        const nextDue = new Date(lease.nextPaymentDue || new Date());
        nextDue.setMonth(nextDue.getMonth() + 1);
        if (nextDue <= lease.endDate) {
          await prisma.lease.update({
            where: { id: lease.id },
            data: { nextPaymentDue: nextDue },
          });
        }
      }
    }

    logger.info('Lease invoice updated', { userId, invoiceId: id, status: updated.status });
    res.json({ success: true, data: updated });
  }),
);

export default router;
