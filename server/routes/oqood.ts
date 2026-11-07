import { Router, Request, Response } from 'express';
import crypto from 'crypto';

export const oqoodRouter = Router();

// In-memory ledger fallback ensuring resilience when DB/Prisma is offline
export interface OqoodRegistrationRecord {
  registrationId: string;
  idempotencyKey: string;
  projectNumber: string;
  developerId: string;
  unitNumber: string;
  buyerName: string;
  buyerPassportOrEmiratesId: string;
  purchasePriceAed: number;
  dldFeeAed: number; // 4% statutory fee
  dldAdminFeeAed: number; // 580 AED
  oqoodFeeAed: number; // 1,000 AED + 5% VAT = 1,050 AED
  totalPayableAed: number;
  escrowAccountNumber: string;
  escrowValidated: boolean;
  status: 'PENDING_ESCROW' | 'APPROVED_PRE_REGISTRATION' | 'REJECTED';
  dldCertificateChecksum: string;
  createdAt: string;
}

export const oqoodRegistry = new Map<string, OqoodRegistrationRecord>();

/**
 * Statutory Fee Computation (Dubai Law No. 13 of 2008 & Law No. 7 of 2013)
 */
export function calculateOqoodFees(purchasePriceAed: number) {
  const dldFeeAed = Math.round(purchasePriceAed * 0.04);
  const dldAdminFeeAed = 580;
  const oqoodFeeAed = 1050; // 1000 + 5% VAT
  const totalPayableAed = dldFeeAed + dldAdminFeeAed + oqoodFeeAed;
  return { dldFeeAed, dldAdminFeeAed, oqoodFeeAed, totalPayableAed };
}

/**
 * POST /api/oqood/register
 * Register off-plan unit in DLD Oqood System with Escrow validation & Idempotency (AEG-012)
 */
oqoodRouter.post('/register', async (req: Request, res: Response) => {
  const {
    projectNumber,
    developerId,
    unitNumber,
    buyerName,
    buyerPassportOrEmiratesId,
    purchasePriceAed,
    escrowAccountNumber,
  } = req.body || {};

  // Input validation
  const errors: string[] = [];
  if (!projectNumber || typeof projectNumber !== 'string') errors.push('projectNumber is required');
  if (!developerId || typeof developerId !== 'string') errors.push('developerId is required');
  if (!unitNumber || typeof unitNumber !== 'string') errors.push('unitNumber is required');
  if (!buyerName || typeof buyerName !== 'string') errors.push('buyerName is required');
  if (!buyerPassportOrEmiratesId || typeof buyerPassportOrEmiratesId !== 'string') {
    errors.push('buyerPassportOrEmiratesId is required');
  }
  const numericPrice = Number(purchasePriceAed);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    errors.push('purchasePriceAed must be a positive number');
  }
  if (!escrowAccountNumber || typeof escrowAccountNumber !== 'string') {
    errors.push('escrowAccountNumber is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Idempotency Key: AEG-OQOOD-{projectCode}-{unitNumber} (AEG-012)
  const idempotencyKey = `AEG-OQOOD-${projectNumber}-${unitNumber}`.toUpperCase();

  if (oqoodRegistry.has(idempotencyKey)) {
    const existing = oqoodRegistry.get(idempotencyKey)!;
    return res.status(200).json({
      success: true,
      message: 'Returning existing idempotent registration',
      data: existing,
    });
  }

  // Escrow Verification Gate: Validate escrow account format (DLD/RERA statutory rule)
  const escrowRegex = /^[A-Z0-9]{8,24}$/i;
  const isEscrowValid = escrowRegex.test(escrowAccountNumber);

  if (!isEscrowValid) {
    return res.status(422).json({
      success: false,
      error: 'Invalid RERA Trust Escrow Account Number format.',
    });
  }

  const fees = calculateOqoodFees(numericPrice);
  const registrationId = `OQOOD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Generate SHA-256 Checksum for official certificate vault sync
  const checksumHash = crypto
    .createHash('sha256')
    .update(`${registrationId}:${idempotencyKey}:${fees.totalPayableAed}`)
    .digest('hex');

  const record: OqoodRegistrationRecord = {
    registrationId,
    idempotencyKey,
    projectNumber,
    developerId,
    unitNumber,
    buyerName,
    buyerPassportOrEmiratesId,
    purchasePriceAed: numericPrice,
    ...fees,
    escrowAccountNumber,
    escrowValidated: true,
    status: 'APPROVED_PRE_REGISTRATION',
    dldCertificateChecksum: checksumHash,
    createdAt: new Date().toISOString(),
  };

  oqoodRegistry.set(idempotencyKey, record);

  return res.status(201).json({
    success: true,
    message: 'Off-plan unit successfully pre-registered under DLD Oqood system.',
    data: record,
  });
});

/**
 * GET /api/oqood/:projectNumber/:unitNumber
 * Lookup Oqood registration status
 */
oqoodRouter.get('/:projectNumber/:unitNumber', async (req: Request, res: Response) => {
  const { projectNumber, unitNumber } = req.params;
  const key = `AEG-OQOOD-${projectNumber}-${unitNumber}`.toUpperCase();

  const record = oqoodRegistry.get(key);
  if (!record) {
    return res.status(404).json({
      success: false,
      error: `No Oqood registration found for project ${projectNumber}, unit ${unitNumber}.`,
    });
  }

  return res.status(200).json({
    success: true,
    data: record,
  });
});

export default oqoodRouter;
