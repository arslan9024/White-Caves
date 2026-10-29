/**
 * leaseActionController.ts
 * Handlers for lifecycle actions: lease renewals, early termination, addenda management, and key handover events.
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import logger from '../../utils/logger.js';
import { createPdcSchedule, ChequeScheduleItem } from './leaseCommon.js';

export async function renewLease(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const { newEndDate, bankName } = req.body as { newEndDate: string; bankName?: string };
  if (!newEndDate) throw new AppError('newEndDate is required', 400);

  const lease = await prisma.lease.findUnique({ where: { id } });
  if (!lease) throw new AppError('Lease not found', 404);

  const userRole = req.user?.role;
  if (lease.landlordId !== userId && userRole !== 'owner') {
    throw new AppError('Access denied — only landlord or owner can renew lease', 403);
  }

  const newEnd = new Date(newEndDate);
  if (isNaN(newEnd.getTime())) throw new AppError('Invalid newEndDate', 400);
  if (newEnd <= lease.startDate) throw new AppError('newEndDate must be after startDate', 400);

  const schedule = createPdcSchedule(
    lease.id,
    lease.startDate,
    newEnd,
    lease.monthlyRent,
    bankName ?? 'Emirates NBD'
  );

  await prisma.pDCSchedule.createMany({
    data: schedule.map((item: ChequeScheduleItem) => ({
      leaseId: lease.id,
      tenantId: lease.tenantId,
      chequeNumber: item.chequeNumber,
      bankName: item.bankName,
      amount: item.amountAED,
      dueDate: new Date(item.dueDate),
      status: item.status.toLowerCase() as any,
    })),
  });

  const updated = await prisma.lease.update({
    where: { id },
    data: { endDate: newEnd, status: 'renewed' },
  });

  await prisma.activity.create({
    data: {
      userId,
      type: 'lease',
      action: 'renew',
      description: `Lease ${id} renewed to ${newEndDate}`,
      metadata: { leaseId: id, newEndDate },
    },
  });

  logger.info('Lease renewed', { userId, leaseId: id, newEndDate });
  res.json({ success: true, data: updated, schedule });
}

export async function terminateLease(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const { terminationReason } = req.body as { terminationReason?: string };

  const lease = await prisma.lease.findUnique({ where: { id } });
  if (!lease) throw new AppError('Lease not found', 404);

  const userRole = req.user?.role;
  if (lease.landlordId !== userId && userRole !== 'owner') {
    throw new AppError('Access denied — only landlord or owner can terminate lease', 403);
  }

  const updated = await prisma.lease.update({
    where: { id },
    data: {
      status: 'terminated',
      terminationDate: new Date(),
      terminationReason: terminationReason ?? null,
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      type: 'lease',
      action: 'terminate',
      description: `Lease ${id} terminated${terminationReason ? ': ' + terminationReason : ''}`,
      metadata: { leaseId: id, terminationReason },
    },
  });

  logger.info('Lease terminated', { userId, leaseId: id, terminationReason });
  res.json({ success: true, data: updated });
}

export async function addLeaseAddendum(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function listLeaseAddenda(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function recordKeyHandover(req: AuthRequest, res: Response): Promise<void> {
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
      ...(documentUrl ? { addendumDocuments: { push: documentUrl } } : {}),
    },
  });

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
}
