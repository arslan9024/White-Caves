/**
 * KYC Transaction Enforcement Gate Middleware — Wave 41 (REQ-COMP-002)
 *
 * Enforces compliance policy:
 * Rejects lease/sale contract creation if client KYC status is not verified.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';
import { isClientKycVerified } from '../services/kycService.js';

export const RISKY_AMOUNT_AED = 55000;

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
