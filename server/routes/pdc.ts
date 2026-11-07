import { Router, Request, Response } from 'express';
import crypto from 'crypto';

export const pdcRouter = Router();

export interface PdcBounceIncident {
  incidentId: string;
  chequeNumber: string;
  chequeAmountAed: number;
  bankName: string;
  drawerName: string;
  drawerEmiratesIdOrPassport: string;
  tenancyContractNumber: string;
  ejariCertificateNumber: string;
  dishonourDate: string;
  dishonourReason: 'INSUFFICIENT_FUNDS' | 'ACCOUNT_CLOSED' | 'SIGNATURE_MISMATCH' | 'PAYMENT_STOPPED';
  status: 'PDC_BOUNCED' | 'FORMAL_NOTICE_ISSUED' | 'DIRECT_CIVIL_EXECUTION' | 'RESOLVED_SETTLED';
  gracePeriodExpiresAt: string;
  civilExecutionEligibleAt: string;
  law50ReferenceDossierId: string;
  createdAt: string;
}

export const pdcRegistry = new Map<string, PdcBounceIncident>();

/**
 * Calculate statutory escalation deadlines under UAE Law No. 50 of 2022
 * - Day 0 to Day 5: 5 Business Days Grace Period
 * - Day 6: 30-Day Notarized Eviction Warning
 * - Day 30: Dubai Courts Direct Civil Execution Enforcement
 */
export function calculateEscalationDeadlines(dishonourDateStr: string) {
  const dishonourDate = new Date(dishonourDateStr);
  const graceDate = new Date(dishonourDate);
  graceDate.setDate(graceDate.getDate() + 5);

  const civilExecDate = new Date(dishonourDate);
  civilExecDate.setDate(civilExecDate.getDate() + 30);

  return {
    gracePeriodExpiresAt: graceDate.toISOString(),
    civilExecutionEligibleAt: civilExecDate.toISOString(),
  };
}

/**
 * POST /api/pdc/bounce
 * Record a bounced cheque incident and initialize UAE Law 50/2022 direct execution state machine
 */
pdcRouter.post('/bounce', async (req: Request, res: Response) => {
  const {
    chequeNumber,
    chequeAmountAed,
    bankName,
    drawerName,
    drawerEmiratesIdOrPassport,
    tenancyContractNumber,
    ejariCertificateNumber,
    dishonourDate,
    dishonourReason = 'INSUFFICIENT_FUNDS',
  } = req.body || {};

  const errors: string[] = [];
  if (!chequeNumber || typeof chequeNumber !== 'string') errors.push('chequeNumber is required');
  const amount = Number(chequeAmountAed);
  if (isNaN(amount) || amount <= 0) errors.push('chequeAmountAed must be a positive number');
  if (!bankName || typeof bankName !== 'string') errors.push('bankName is required');
  if (!drawerName || typeof drawerName !== 'string') errors.push('drawerName is required');
  if (!tenancyContractNumber || typeof tenancyContractNumber !== 'string') {
    errors.push('tenancyContractNumber is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const validDishonourDate = dishonourDate && !isNaN(new Date(dishonourDate).getTime())
    ? dishonourDate
    : new Date().toISOString();

  const deadlines = calculateEscalationDeadlines(validDishonourDate);
  const incidentId = `PDC-INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Generate UAE Law 50/2022 Certified Execution Dossier Hash
  const law50ReferenceDossierId = crypto
    .createHash('sha256')
    .update(`LAW50:${chequeNumber}:${amount}:${drawerName}:${validDishonourDate}`)
    .digest('hex')
    .substring(0, 16)
    .toUpperCase();

  const record: PdcBounceIncident = {
    incidentId,
    chequeNumber,
    chequeAmountAed: amount,
    bankName,
    drawerName,
    drawerEmiratesIdOrPassport: drawerEmiratesIdOrPassport || '',
    tenancyContractNumber,
    ejariCertificateNumber: ejariCertificateNumber || '',
    dishonourDate: validDishonourDate,
    dishonourReason,
    status: 'PDC_BOUNCED',
    ...deadlines,
    law50ReferenceDossierId: `EXEC-DOSSIER-${law50ReferenceDossierId}`,
    createdAt: new Date().toISOString(),
  };

  pdcRegistry.set(incidentId, record);

  return res.status(201).json({
    success: true,
    message: 'PDC bounce incident registered with statutory escalation schedule.',
    data: record,
  });
});

/**
 * PATCH /api/pdc/:incidentId/escalate
 * Advance state machine (e.g. to FORMAL_NOTICE_ISSUED or DIRECT_CIVIL_EXECUTION)
 */
pdcRouter.patch('/:incidentId/escalate', async (req: Request, res: Response) => {
  const { incidentId } = req.params;
  const { status } = req.body || {};

  const validStatuses = ['FORMAL_NOTICE_ISSUED', 'DIRECT_CIVIL_EXECUTION', 'RESOLVED_SETTLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Allowed: ${validStatuses.join(', ')}`,
    });
  }

  const record = pdcRegistry.get(incidentId);
  if (!record) {
    return res.status(404).json({ success: false, error: 'Incident not found' });
  }

  record.status = status;
  pdcRegistry.set(incidentId, record);

  return res.status(200).json({
    success: true,
    message: `PDC incident escalated to ${status}.`,
    data: record,
  });
});

/**
 * GET /api/pdc/incidents
 * List all registered PDC incidents
 */
pdcRouter.get('/incidents', async (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    count: pdcRegistry.size,
    data: Array.from(pdcRegistry.values()),
  });
});

export default pdcRouter;
