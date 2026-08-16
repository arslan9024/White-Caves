/**
 * Portal Webhooks Handler — Wave 39 (REQ-PROP-008)
 *
 * Inbound webhook endpoints for external portals:
 * - POST /api/webhooks/portals/propertyfinder — Inbound PropertyFinder lead webhook
 * - POST /api/webhooks/portals/bayut — Inbound Bayut lead webhook
 *
 * Auto-creates leads in Clara CRM with source & lead score.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = Router();

interface PortalWebhookLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  propertyRef?: string;
}

function validatePortalWebhookLeadPayload(body: unknown): PortalWebhookLeadPayload {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid portal webhook payload', 400);
  }
  const { name, email, phone, message, propertyRef, comments, referenceNumber } = body as Record<string, unknown>;
  const cleanPhone = typeof phone === 'string' && phone.trim() ? phone.trim() : undefined;
  const cleanEmail = typeof email === 'string' && email.trim() ? email.trim() : undefined;

  if (!cleanPhone && !cleanEmail) {
    throw new AppError('phone or email is required for portal lead import', 400);
  }

  return {
    name: typeof name === 'string' ? name.trim() : undefined,
    email: cleanEmail,
    phone: cleanPhone,
    message: typeof message === 'string' ? message.trim() : typeof comments === 'string' ? comments.trim() : undefined,
    propertyRef: typeof propertyRef === 'string' ? propertyRef.trim() : typeof referenceNumber === 'string' ? referenceNumber.trim() : undefined,
  };
}

// ─── POST /api/webhooks/portals/propertyfinder ───────────────────────────
router.post(
  '/propertyfinder',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, message, propertyRef } = validatePortalWebhookLeadPayload(req.body);

    const leadName = name || 'PropertyFinder Lead';
    const cleanPhone = phone || null;
    const cleanEmail = email || null;
    const notes = `PropertyFinder lead for property ${propertyRef || 'General'}. Inquiry: "${message || ''}"`;

    let lead;
    if (cleanPhone) {
      lead = await prisma.lead.findFirst({ where: { phone: cleanPhone } });
    }

    if (lead) {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: Math.max(lead.score, 30),
          notes: `${lead.notes || ''}\n${notes}`,
        },
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          name: leadName,
          email: cleanEmail,
          phone: cleanPhone,
          source: 'PropertyFinder',
          status: 'new',
          score: 30,
          notes,
        },
      });
    }

    logger.info('[PortalWebhooks] PropertyFinder lead processed', {
      leadId: lead.id,
      phone: cleanPhone,
      propertyRef,
    });

    res.status(200).json({
      success: true,
      data: { leadId: lead.id, status: 'processed' },
    });
  })
);

// ─── POST /api/webhooks/portals/bayut ────────────────────────────────────
router.post(
  '/bayut',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, message, propertyRef } = validatePortalWebhookLeadPayload(req.body);

    const leadName = name || 'Bayut Lead';
    const cleanPhone = phone || null;
    const cleanEmail = email || null;
    const notes = `Bayut lead for property ${propertyRef || 'General'}. Comments: "${message || ''}"`;

    let lead;
    if (cleanPhone) {
      lead = await prisma.lead.findFirst({ where: { phone: cleanPhone } });
    }

    if (lead) {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: Math.max(lead.score, 30),
          notes: `${lead.notes || ''}\n${notes}`,
        },
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          name: leadName,
          email: cleanEmail,
          phone: cleanPhone,
          source: 'Bayut',
          status: 'new',
          score: 30,
          notes,
        },
      });
    }

    logger.info('[PortalWebhooks] Bayut lead processed', {
      leadId: lead.id,
      phone: cleanPhone,
      referenceNumber,
    });

    res.status(200).json({
      success: true,
      data: { leadId: lead.id, status: 'processed' },
    });
  })
);

export default router;
