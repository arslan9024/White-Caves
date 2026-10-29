import { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import {
  generateEjariExport,
  updateEjariStatus,
} from '../../services/compliance/complianceService.js';
import { dldMockService } from '../../services/mock/dldMockService.js';
import { ejariMockService } from '../../services/mock/ejariMockService.js';

const db = prisma as any;
const useMockDLD = process.env.USE_MOCK_DLD !== 'false';

/**
 * GET /api/compliance/ejari-export
 */
export async function exportEjariData(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  const user = (req as AuthRequest).user;
  if (!allowedRoles.includes(user?.role || '')) {
    throw new AppError('Access denied — compliance data requires manager role', 403);
  }

  const status = req.query.status as string | undefined;
  const fromDate = req.query.from ? new Date(req.query.from as string) : undefined;
  const toDate = req.query.to ? new Date(req.query.to as string) : undefined;
  const format = (req.query.format as string) || 'csv';

  const result = await generateEjariExport({ status, fromDate, toDate });

  if (format === 'json') {
    res.json({ success: true, data: { rows: result.rows, count: result.count } });
    return;
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="ejari-export-${new Date().toISOString().split('T')[0]}.csv"`
  );
  res.send(result.csv);
}

/**
 * PATCH /api/compliance/ejari/:leaseId
 */
export async function updateEjariCertificate(req: AuthRequest, res: Response): Promise<void> {
  const userRole = req.user?.role || '';
  if (!['owner', 'manager', 'admin'].includes(userRole)) {
    throw new AppError('Access denied — Ejari updates require manager role', 403);
  }

  const { leaseId } = req.params as Record<string, string>;
  const { ejariNumber, ejariStatus, ejariRegistrationDate, ejariExpiryDate } = req.body;

  if (ejariStatus && !['pending', 'registered', 'expired', 'cancelled'].includes(ejariStatus)) {
    throw new AppError(
      'Invalid ejariStatus. Must be: pending, registered, expired, cancelled',
      400
    );
  }

  const updated = await updateEjariStatus(leaseId, {
    ejariNumber,
    ejariStatus,
    ejariRegistrationDate: ejariRegistrationDate ? new Date(ejariRegistrationDate) : undefined,
    ejariExpiryDate: ejariExpiryDate ? new Date(ejariExpiryDate) : undefined,
  });

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'ejari_updated',
      description: `Ejari status updated for lease ${leaseId}: ${ejariStatus || 'updated'}`,
      userId: req.user?.id || null,
      metadata: JSON.stringify({ leaseId, ejariNumber, ejariStatus }),
    },
  });

  res.json({ success: true, data: updated });
}

/**
 * POST /api/compliance/dld/register-oqood
 */
export async function registerOqood(req: AuthRequest, res: Response): Promise<void> {
  if (!['owner', 'manager', 'admin'].includes(req.user?.role || '')) {
    throw new AppError('Access denied — DLD registration requires manager role', 403);
  }

  if (!useMockDLD) {
    throw new AppError('Live DLD API is not yet configured. Set USE_MOCK_DLD=true.', 501);
  }

  const {
    developerId,
    projectId,
    buyerEmiratesId,
    unitNumber,
    salePriceAED,
    spaDate,
    paymentPlanType,
  } = req.body;

  if (!developerId || !projectId || !buyerEmiratesId || !unitNumber || !salePriceAED) {
    throw new AppError(
      'developerId, projectId, buyerEmiratesId, unitNumber, and salePriceAED are required',
      400
    );
  }

  const result = dldMockService.registerOqood({
    developerId,
    projectId,
    buyerEmiratesId,
    unitNumber,
    salePriceAED: Number(salePriceAED),
    spaDate: spaDate ?? new Date().toISOString(),
    paymentPlanType: paymentPlanType ?? 'full_payment',
  });

  logger.info('DLD Oqood registration (mock)', {
    oqoodNumber: result.oqoodNumber,
    unitNumber,
    salePriceAED,
  });

  res.setHeader('X-Mock-DLD', 'true');
  res.status(201).json({ success: true, data: result });
}

/**
 * POST /api/compliance/ejari/activate
 */
export async function activateEjari(req: AuthRequest, res: Response): Promise<void> {
  if (!['owner', 'manager', 'admin'].includes(req.user?.role || '')) {
    throw new AppError('Access denied — Ejari activation requires manager role', 403);
  }

  if (!useMockDLD) {
    throw new AppError('Live Ejari API is not yet configured. Set USE_MOCK_DLD=true.', 501);
  }

  const {
    leaseId,
    landlordEmiratesId,
    tenantEmiratesId,
    propertyAddress,
    annualRentAED,
    leaseStartDate,
    leaseEndDate,
    paymentFrequency,
    numberOfCheques,
  } = req.body;

  if (!leaseId || !landlordEmiratesId || !tenantEmiratesId || !propertyAddress || !annualRentAED) {
    throw new AppError(
      'leaseId, landlordEmiratesId, tenantEmiratesId, propertyAddress, and annualRentAED are required',
      400
    );
  }

  const result = ejariMockService.activateContract({
    leaseId,
    landlordEmiratesId,
    tenantEmiratesId,
    propertyAddress,
    annualRentAED: Number(annualRentAED),
    leaseStartDate: leaseStartDate ?? new Date().toISOString(),
    leaseEndDate:
      leaseEndDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    paymentFrequency: paymentFrequency ?? 'annual',
    numberOfCheques: numberOfCheques ?? 1,
  });

  await updateEjariStatus(leaseId, {
    ejariNumber: result.ejariContractNumber,
    ejariStatus: 'registered',
    ejariRegistrationDate: new Date(),
  });

  logger.info('Ejari contract activated (mock)', {
    ejariContractNumber: result.ejariContractNumber,
    leaseId,
    activationReference: result.activationReference,
  });

  res.setHeader('X-Mock-DLD', 'true');
  res.status(201).json({ success: true, data: result });
}

/**
 * POST /api/compliance/ejari/renew
 */
export async function renewEjari(req: AuthRequest, res: Response): Promise<void> {
  if (!['owner', 'manager', 'admin'].includes(req.user?.role || '')) {
    throw new AppError('Access denied — Ejari renewal requires manager role', 403);
  }

  if (!useMockDLD) {
    throw new AppError('Live Ejari API is not yet configured. Set USE_MOCK_DLD=true.', 501);
  }

  const {
    leaseId,
    existingContractNumber,
    newAnnualRentAED,
    existingAnnualRentAED,
    newLeaseStartDate,
    newLeaseEndDate,
    propertyAddress,
  } = req.body;

  if (!leaseId || !existingContractNumber || !newAnnualRentAED || !existingAnnualRentAED) {
    throw new AppError(
      'leaseId, existingContractNumber, newAnnualRentAED, and existingAnnualRentAED are required',
      400
    );
  }

  const result = ejariMockService.renewContract({
    leaseId,
    existingContractNumber,
    newAnnualRentAED: Number(newAnnualRentAED),
    existingAnnualRentAED: Number(existingAnnualRentAED),
    newLeaseStartDate: newLeaseStartDate ?? new Date().toISOString(),
    newLeaseEndDate:
      newLeaseEndDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    propertyAddress: propertyAddress ?? '',
  });

  logger.info('Ejari contract renewal (mock)', {
    status: result.status,
    leaseId,
    rentIncreasePercentage: result.rentIncreasePercentage,
    reraPermittedIncreasePercentage: result.reraPermittedIncreasePercentage,
  });

  if (result.status === 'rejected') {
    res.setHeader('X-Mock-DLD', 'true');
    res.status(422).json({
      success: false,
      error: `Rent increase of ${result.rentIncreasePercentage}% exceeds RERA permitted maximum of ${result.reraPermittedIncreasePercentage}% for this area.`,
      data: result,
    });
    return;
  }

  res.setHeader('X-Mock-DLD', 'true');
  res.status(200).json({ success: true, data: result });
}

/**
 * GET /api/compliance/dld/health
 */
export async function getDldHealth(_req: Request, res: Response): Promise<void> {
  if (!useMockDLD) {
    res.json({ success: true, data: { status: 'live', useMock: false } });
    return;
  }
  res.setHeader('X-Mock-DLD', 'true');
  res.json({
    success: true,
    data: {
      dld: dldMockService.getHealthStatus(),
      ejari: ejariMockService.getHealthStatus(),
    },
  });
}
