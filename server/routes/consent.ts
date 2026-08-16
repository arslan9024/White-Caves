/**
 * UAE PDPL Consent Management API Routes — Wave 42 (REQ-COMP-002, COMP-PDPL-001 to 005)
 *
 * Endpoints:
 * - POST /api/consent — Record user consent
 * - GET  /api/consent/:phone — Check consent status
 * - POST /api/consent/opt-out — Marketing opt-out mechanism
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

interface ConsentPayload {
  phone: string;
  email?: string;
  consentType?: string;
  version?: string;
  purpose?: string;
}

function validateConsentPayload(body: unknown): ConsentPayload {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid consent payload', 400);
  }
  const { phone, email, consentType, version, purpose } = body as Record<string, unknown>;
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    throw new AppError('phone is required and must be a non-empty string', 400);
  }
  return {
    phone: phone.trim(),
    email: typeof email === 'string' ? email.trim() : undefined,
    consentType: typeof consentType === 'string' ? consentType : undefined,
    version: typeof version === 'string' ? version : undefined,
    purpose: typeof purpose === 'string' ? purpose : undefined,
  };
}

// ─── POST /api/consent — Record user consent ─────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { phone, email, consentType, version, purpose } = validateConsentPayload(req.body);
    const cleanPhone = phone;

    const consentRecord = await prisma.whatsAppConsent.upsert({
      where: { phone: cleanPhone },
      update: {
        consent: true,
        optedOutAt: null,
      },
      create: {
        phone: cleanPhone,
        consent: true,
      },
    });

    res.status(200).json({
      success: true,
      data: consentRecord,
    });
  })
);

// ─── GET /api/consent/:phone — Check consent status ─────────────────────
router.get(
  '/:phone',
  asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.params as Record<string, string>;
    const cleanPhone = phone.trim();

    const consent = await prisma.whatsAppConsent.findUnique({
      where: { phone: cleanPhone },
    });

    res.status(200).json({
      success: true,
      data: {
        phone: cleanPhone,
        hasConsent: consent?.consent ?? false,
        consentDate: consent?.createdAt || null,
        optedOutAt: consent?.optedOutAt || null,
      },
    });
  })
);

// ─── POST /api/consent/opt-out — Marketing opt-out ──────────────────────
router.post(
  '/opt-out',
  asyncHandler(async (req: Request, res: Response) => {
    const { phone, reason } = req.body as {
      phone: string;
      reason?: string;
    };

    if (!phone) {
      throw new AppError('phone is required', 400);
    }

    const cleanPhone = phone.trim();

    const updated = await prisma.whatsAppConsent.upsert({
      where: { phone: cleanPhone },
      update: {
        consent: false,
        optedOutAt: new Date(),
      },
      create: {
        phone: cleanPhone,
        consent: false,
        optedOutAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        phone: cleanPhone,
        status: 'opted_out',
        optedOutAt: updated.optedOutAt,
      },
    });
  })
);

export default router;
