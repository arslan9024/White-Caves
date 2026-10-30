/**
 * leasePdcController.ts
 * Handlers for Post-Dated Cheque (PDC) schedules, status transitions (bounced/cleared),
 * bounced cheque notifications, overdue collections queue, and reminder dispatches.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import logger from '../../utils/logger.js';

export async function listPdcSchedule(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function addPdcCheque(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function updatePdcStatus(req: AuthRequest, res: Response): Promise<void> {
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

  const { status, notes, bouncedReason, clearanceDate } = req.body;
  const validStatuses = ['pending', 'presented', 'cleared', 'bounced'];
  if (!status || !validStatuses.includes(status)) {
    throw new AppError(`status must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const updatePayload: Prisma.PDCScheduleUpdateInput = {
    status,
    notes: notes || pdc.notes,
  };

  if (status === 'cleared') {
    updatePayload.clearanceDate = clearanceDate ? new Date(clearanceDate) : new Date();
    updatePayload.bouncedReason = null;
  } else if (status === 'bounced') {
    updatePayload.clearanceDate = null;
    updatePayload.bouncedReason = bouncedReason || 'Insufficient funds or account issue';
  }

  const updated = await prisma.pDCSchedule.update({
    where: { id: pdcId },
    data: updatePayload,
  });

  if (status === 'bounced') {
    const reasonText = updatePayload.bouncedReason || 'Insufficient funds';
    const alertMsg = `Rent cheque #${pdc.chequeNumber} for ${pdc.currency} ${pdc.amount.toLocaleString()} has bounced (${reasonText}). Action required.`;

    await Promise.allSettled([
      lease.tenantId
        ? prisma.notification.create({
            data: {
              userId: lease.tenantId,
              type: 'error',
              channel: 'in_app',
              title: 'CRITICAL: Rent Cheque Bounced',
              message: alertMsg,
              metadata: {
                leaseId: id,
                pdcId,
                chequeNumber: pdc.chequeNumber,
                amount: pdc.amount,
              },
            },
          })
        : Promise.resolve(),
      prisma.notification.create({
        data: {
          userId: lease.landlordId,
          type: 'warning',
          channel: 'in_app',
          title: 'ALERT: Tenant Cheque Bounced',
          message: alertMsg,
          metadata: { leaseId: id, pdcId, chequeNumber: pdc.chequeNumber, amount: pdc.amount },
        },
      }),
      prisma.activity.create({
        data: {
          type: 'lease',
          action: 'cheque_bounced',
          description: `Cheque #${pdc.chequeNumber} (${pdc.currency} ${pdc.amount}) marked as bounced for lease ${id}`,
          userId,
          metadata: { leaseId: id, pdcId, chequeNumber: pdc.chequeNumber, reason: reasonText },
        },
      }),
    ]).catch(() => {});
  }

  logger.info('PDC status updated', { userId, leaseId: id, pdcId, status });
  res.json({ success: true, data: updated });
}

export async function getOverdueCollectionQueue(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function notifyOverdueCollection(req: AuthRequest, res: Response): Promise<void> {
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
}

