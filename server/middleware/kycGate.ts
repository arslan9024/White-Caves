/**
 * KYC Transaction Enforcement Gate Middleware — Wave 41 (REQ-COMP-002)
 *
 * Enforces compliance policy:
 * Rejects lease/sale contract creation if client KYC status is not verified.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';
import { isClientKycVerified } from '../services/kycService.js';
import { prisma } from '../database.js';

/**
 * Statutory UAE goAML & FIU Cash Threshold for Real Estate (AED 55,000)
 */
export const GOAML_CASH_THRESHOLD_AED = 55000;
export const RISKY_AMOUNT_AED = 500000;

export function requireKycForRiskyTransaction() {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const type = String(req.body?.type || '').toLowerCase();
    const amount = Number(req.body?.amount || 0);
    const isRisky = type === 'sale' || (type !== 'lease' && amount >= RISKY_AMOUNT_AED);

    if (!isRisky) {
      return next();
    }

    const leadId = req.body?.leadId as string | undefined;
    if (!leadId) {
      return next(new AppError('KYC verification requires a valid leadId for high-value or sale transactions.', 400));
    }

    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) {
        return next(new AppError(`Lead not found: ${leadId}`, 400));
      }

      const tags = Array.isArray((lead as { tags?: string[] }).tags) ? (lead as { tags: string[] }).tags : [];
      if (!tags.includes('kyc_verified')) {
        return next(new AppError('KYC verification required before proceeding with this transaction.', 403));
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export function requireVerifiedKyc(clientIdExtractor?: (req: Request) => string | undefined) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const clientId = clientIdExtractor ? clientIdExtractor(req) : (req.body?.clientId as string | undefined);

    if (!clientId) {
      // If no client context provided, proceed to standard validation
      return next();
    }

    try {
      const verified = await isClientKycVerified(clientId);
      if (!verified) {
        return next(
          new AppError(
            `Transaction blocked: Client (ID: ${clientId}) does not have a verified KYC record. Please complete identity verification first.`,
            403
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
