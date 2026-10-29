/**
 * complianceConsentController.ts
 * Handlers for UAE PDPL data privacy consent capture, revocation, export, and right-to-be-forgotten deletion.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import {
  ensureComplianceManagerRole,
  normalizeMetadata,
} from './complianceCommon.js';

const db = prisma as any;

export async function recordConsent(req: Request, res: Response): Promise<void> {
  ensureComplianceManagerRole(
    req.user?.role,
    'Access denied — consent creation requires manager role or above'
  );

  const { entityType = 'lead', entityId, purpose, channel, consentTextVersion } = req.body;
  if (!entityId || !purpose) {
    throw new AppError('entityId and purpose are required', 400);
  }

  if (String(entityType) === 'lead') {
    const lead = await db.lead.findUnique({
      where: { id: String(entityId) },
      select: { id: true },
    });
    if (!lead) throw new AppError('Lead not found for consent record', 404);
  }

  const consent = await db.activity.create({
    data: {
      type: 'compliance',
      action: 'pdpl_consent_created',
      description: `PDPL consent captured for ${String(entityType)}:${String(entityId)}`,
      userId: req.user?.id || null,
      leadId: String(entityType) === 'lead' ? String(entityId) : null,
      metadata: {
        entityType: sanitizeString(String(entityType)).substring(0, 50),
        entityId: sanitizeString(String(entityId)).substring(0, 120),
        purpose: sanitizeString(String(purpose)).substring(0, 500),
        channel: channel ? sanitizeString(String(channel)).substring(0, 100) : 'crm_form',
        consentTextVersion: consentTextVersion
          ? sanitizeString(String(consentTextVersion)).substring(0, 50)
          : 'v1',
        status: 'active',
        consentedAt: new Date().toISOString(),
        consentedBy: req.user?.id || null,
      },
    },
  });

  res.status(201).json({
    success: true,
    data: { id: consent.id, status: 'active', metadata: consent.metadata },
  });
}

export async function revokeConsent(req: Request, res: Response): Promise<void> {
  ensureComplianceManagerRole(
    req.user?.role,
    'Access denied — consent revoke requires manager role'
  );

  const { consentId } = req.params as Record<string, string>;
  const { reason } = req.body;

  const consent = await db.activity.findUnique({ where: { id: consentId } });
  if (!consent || consent.type !== 'compliance' || consent.action !== 'pdpl_consent_created') {
    throw new AppError('Consent record not found', 404);
  }

  const metadata = normalizeMetadata(consent.metadata);
  const updatedMetadata = {
    ...metadata,
    status: 'revoked',
    revokedAt: new Date().toISOString(),
    revokedBy: req.user?.id || null,
    revokeReason: reason ? sanitizeString(String(reason)).substring(0, 1000) : null,
  };

  const updated = await db.activity.update({
    where: { id: consentId },
    data: { metadata: updatedMetadata },
  });

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'pdpl_consent_revoked',
      description: `PDPL consent revoked: ${consentId}`,
      userId: req.user?.id || null,
      leadId: consent.leadId || null,
      metadata: {
        consentId,
        reason: updatedMetadata.revokeReason,
      },
    },
  });

  res.json({
    success: true,
    data: { id: updated.id, status: 'revoked', metadata: updatedMetadata },
  });
}

export async function exportConsents(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — consent export requires manager role', 403);
  }

  const status = String(req.query.status || 'all');
  const entityType = req.query.entityType ? String(req.query.entityType) : undefined;
  const entityId = req.query.entityId ? String(req.query.entityId) : undefined;
  const take = Math.min(parseInt(String(req.query.limit || '300'), 10) || 300, 1000);

  const records = await db.activity.findMany({
    where: {
      type: 'compliance',
      action: 'pdpl_consent_created',
    },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      lead: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
    take,
  });

  const mapped = records.map((r: any) => {
    const metadata = normalizeMetadata(r.metadata);
    return {
      id: r.id,
      entityType: metadata.entityType || 'lead',
      entityId: metadata.entityId || r.leadId,
      purpose: metadata.purpose || null,
      channel: metadata.channel || null,
      status: metadata.status || 'active',
      consentedAt: metadata.consentedAt || r.createdAt?.toISOString?.() || new Date().toISOString(),
      revokedAt: metadata.revokedAt || null,
      createdBy: r.user,
      lead: r.lead,
    };
  });

  const filtered = mapped.filter((row: any) => {
    if (status !== 'all' && String(row.status) !== status) return false;
    if (entityType && String(row.entityType) !== entityType) return false;
    if (entityId && String(row.entityId) !== entityId) return false;
    return true;
  });

  res.json({
    success: true,
    data: filtered,
    summary: {
      totalFetched: mapped.length,
      returned: filtered.length,
    },
  });
}

export async function deleteConsentRecord(req: Request, res: Response): Promise<void> {
  ensureComplianceManagerRole(
    req.user?.role,
    'Access denied — consent delete requires manager role or above'
  );

  const { consentId } = req.params;
  const consent = await db.activity.findUnique({ where: { id: consentId } });
  if (!consent || consent.type !== 'compliance' || consent.action !== 'pdpl_consent_created') {
    throw new AppError('Consent record not found', 404);
  }

  const metadata = normalizeMetadata(consent.metadata);
  const updatedMetadata = {
    ...metadata,
    status: 'deleted',
    deletedAt: new Date().toISOString(),
    deletedBy: req.user?.id || null,
    purpose: '[deleted]',
    channel: '[deleted]',
  };

  await db.activity.update({
    where: { id: consentId },
    data: { metadata: updatedMetadata },
  });

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'pdpl_consent_deleted',
      description: `PDPL consent deleted/anonymized: ${consentId}`,
      userId: req.user?.id || null,
      leadId: consent.leadId || null,
      metadata: {
        consentId,
        status: 'deleted',
      },
    },
  });

  res.json({ success: true, data: { id: consentId, status: 'deleted' } });
}
