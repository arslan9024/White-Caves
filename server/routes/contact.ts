/**
 * Contact Route — @Mira (CTO/API Lead)
 * POST /api/contact
 *
 * Creates a CRM Lead from the homepage contact form.
 * Source is always "website". Status starts as "new".
 * Auth: PUBLIC (homepage contact form — no JWT required)
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── Allowed inquiry types ────────────────────────────────────────────────────
const INQUIRY_TYPES = ['buy', 'rent', 'invest', 'general'] as const;
type InquiryType = (typeof INQUIRY_TYPES)[number];

// ─── POST /api/contact ────────────────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, message, inquiryType } = req.body as {
      name?: unknown;
      email?: unknown;
      phone?: unknown;
      message?: unknown;
      inquiryType?: unknown;
    };

    // ── Validation ─────────────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new AppError('Name is required (min 2 characters)', 422);
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError('A valid email address is required', 422);
    }

    // ── Sanitize ────────────────────────────────────────────────────────────────
    const safeName    = sanitizeString(name.trim(), 100);
    const safeEmail   = email.trim().toLowerCase().slice(0, 254);
    const safePhone   = phone   && typeof phone   === 'string' ? sanitizeString(phone.trim(),   30) : undefined;
    const safeMessage = message && typeof message === 'string' ? sanitizeString(message.trim(), 2000) : undefined;
    const safeInquiry: InquiryType = INQUIRY_TYPES.includes(inquiryType as InquiryType)
      ? (inquiryType as InquiryType)
      : 'general';

    // ── Find system owner to assign lead ───────────────────────────────────────
    // Assign to first owner/admin — gracefully skips assignment if none found
    const owner = await prisma.user.findFirst({
      where: { role: { in: ['owner', 'admin'] } },
      select: { id: true },
    });

    // ── Create Lead from homepage inquiry ─────────────────────────────────────
    const lead = await prisma.lead.create({
      data: {
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        source: 'website',
        status: 'new',
        notes: safeMessage
          ? `[Homepage Contact Form — ${safeInquiry.toUpperCase()}]\n${safeMessage}`
          : `[Homepage Contact Form — ${safeInquiry.toUpperCase()}]`,
        ...(owner ? { userId: owner.id } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        source: true,
        createdAt: true,
      },
    });

    logger.info(`Contact form lead created: ${lead.id} (${safeName} <${safeEmail}>, inquiry: ${safeInquiry})`);

    res.status(201).json({
      success: true,
      message: "Thank you! We'll be in touch within 24 hours.",
      data: {
        leadId: lead.id,
        inquiryType: safeInquiry,
      },
    });
  })
);

export default router;
