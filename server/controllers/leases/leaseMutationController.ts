/**
 * leaseMutationController.ts
 * Handlers for creating, intake onboarding, updating, and deleting draft leases.
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import logger from '../../utils/logger.js';

export async function createLease(req: AuthRequest, res: Response): Promise<void> {
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
}

export async function intakeLeaseWizard(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const {
    propertyId,
    tenantId,
    landlordId,
    startDate,
    endDate,
    monthlyRent,
    depositAmount,
    ejariNumber,
    pdcSchedule,
  } = req.body;

  if (!propertyId) throw new AppError('propertyId is required', 400);
  if (!tenantId) throw new AppError('tenantId is required', 400);
  if (!startDate) throw new AppError('startDate is required', 400);
  if (!endDate) throw new AppError('endDate is required', 400);
  if (!monthlyRent || typeof monthlyRent !== 'number' || monthlyRent <= 0) {
    throw new AppError('monthlyRent must be a positive number', 400);
  }

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
      landlordId: landlordId || userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      monthlyRent,
      depositAmount: depositAmount || 0,
      leaseNumber: null,
      status: 'draft',
      documents: [],
    },
    include: { property: true, tenant: true, landlord: true },
  });

  let ejariResult = null;
  try {
    const { ejariMockService } = await import('../../services/mock/ejariMockService.js');
    const activationPayload = {
      leaseId: lease.id,
      landlordEmiratesId: ejariNumber || 'LANDLORD‑ID',
      tenantEmiratesId: 'TENANT‑ID',
      propertyAddress: property.title + ', ' + property.location,
      annualRentAED: monthlyRent * 12,
      leaseStartDate: startDate,
      leaseEndDate: endDate,
      paymentFrequency: 'monthly' as const,
      numberOfCheques: pdcSchedule?.length || 0,
    };
    ejariResult = ejariMockService.activateContract(activationPayload);
  } catch {
    const { ejariMockService } = await import('../../services/mock/ejariMockService.js');
    ejariResult = ejariMockService.activateContract({
      leaseId: lease.id,
      landlordEmiratesId: ejariNumber || 'LANDLORD‑ID',
      tenantEmiratesId: 'TENANT‑ID',
      propertyAddress: property.title + ', ' + property.location,
      annualRentAED: monthlyRent * 12,
      leaseStartDate: startDate,
      leaseEndDate: endDate,
      paymentFrequency: 'monthly' as const,
      numberOfCheques: pdcSchedule?.length || 0,
    });
  }

  logger.info('Lease intake wizard completed', { leaseId: lease.id, userId });
  res.status(201).json({ success: true, lease, ejari: ejariResult });
}

export async function updateLease(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const existing = await prisma.lease.findUnique({ where: { id } });
  if (!existing) throw new AppError('Lease not found', 404);

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
    ejariNumber,
    ejariStatus,
    ejariRegistrationDate,
    ejariExpiryDate,
    keyHandoverDate,
    keyHandoverNotes,
    meterReadings,
    addendumDocuments,
    offerId,
  } = req.body;
  const updateData: Record<string, unknown> = {};

  if (status !== undefined) {
    const validStatuses = ['draft', 'active', 'expiring', 'expired', 'terminated', 'renewed'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    if (status === 'active') {
      const ejariToUse = ejariNumber ?? existing.ejariNumber;
      if (!ejariToUse || String(ejariToUse).trim() === '') {
        throw new AppError(
          'Cannot activate lease: ejariNumber is required. Register with Ejari first (Dubai Decree No. 26/2013).',
          422
        );
      }
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
}

export async function deleteLease(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { id } = req.params as Record<string, string>;
  const existing = await prisma.lease.findUnique({ where: { id } });
  if (!existing) throw new AppError('Lease not found', 404);

  const userRole = req.user?.role;
  if (existing.landlordId !== userId && userRole !== 'owner') {
    throw new AppError('Access denied', 403);
  }

  if (existing.status !== 'draft') {
    throw new AppError('Only draft leases can be deleted. Terminate the lease instead.', 400);
  }

  await prisma.lease.delete({ where: { id } });

  logger.info('Lease deleted', { userId, leaseId: id });
  res.json({ success: true, message: 'Lease deleted' });
}
