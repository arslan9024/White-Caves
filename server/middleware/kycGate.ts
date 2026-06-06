/**
 * KYC Gate Middleware (P0-013)
 * Reusable middleware that enforces KYC verification for high-risk operations.
 * High-risk: type='sale' OR amount >= 500,000 AED
 * Checks: linked lead must have 'kyc_verified' tag
 */

import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../database.js';
import { AppError } from './errorHandler.js';

export const RISKY_AMOUNT_AED = 500_000;

export interface KycGateOptions {
  /** Body field containing the leadId — defaults to 'leadId' */
  leadIdField?: string;
  /** Body field for transaction type — defaults to 'type' */
  typeField?: string;
  /** Body field for amount — defaults to 'amount' */
  amountField?: string;
}

export function requireKycForRiskyTransaction(options: KycGateOptions = {}) {
  const { leadIdField = 'leadId', typeField = 'type', amountField = 'amount' } = options;

  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const body = req.body || {};
      const type = String(body[typeField] || '');
      const amount = parseFloat(String(body[amountField] || '0')) || 0;

      const isRisky = type === 'sale' || amount >= RISKY_AMOUNT_AED;
      if (!isRisky) return next();

      const leadId = body[leadIdField];
      if (!leadId || typeof leadId !== 'string') {
        throw new AppError(
          'KYC required: risky transactions must reference a verified lead (leadId missing)',
          400
        );
      }

      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { id: true, tags: true },
      });

      if (!lead) throw new AppError('KYC check failed: lead not found', 400);

      const hasKyc =
        Array.isArray(lead.tags) && lead.tags.some(t => String(t).toLowerCase() === 'kyc_verified');

      if (!hasKyc) {
        throw new AppError(
          'KYC verification required: lead must be verified before this transaction can proceed',
          403
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
