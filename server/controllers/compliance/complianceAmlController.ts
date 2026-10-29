/**
 * complianceAmlController.ts
 * Handlers for AML/PEP sanctions screening, alert triage, and resolution.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { screenAML } from '../../services/compliance/amlAdapter.js';
import { normalizeMetadata } from './complianceCommon.js';

const db = prisma as any;

export async function screenAml(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — AML screening requires agent role or above', 403);
  }

  const { leadId, amount, currency, transactionType, nationality, sourceOfFunds } = req.body;
  if (!leadId) {
    throw new AppError('leadId is required', 400);
  }

  const lead = await db.lead.findUnique({
    where: { id: String(leadId) },
    select: { id: true, name: true, tags: true, email: true, phone: true },
  });

  if (!lead) {
    throw new AppError('Lead not found for AML screening', 404);
  }

  const screening = await screenAML({
    leadId: lead.id,
    leadName: lead.name,
    amount: Number.isFinite(Number(amount)) ? Number(amount) : null,
    currency: currency ? String(currency) : null,
    transactionType: transactionType ? String(transactionType) : null,
    nationality: nationality ? String(nationality) : null,
    sourceOfFunds: sourceOfFunds ? String(sourceOfFunds) : null,
  });

  const isFlagged = screening.riskLevel === 'high' || screening.flags.length > 0;

  const activity = await db.activity.create({
    data: {
      type: 'compliance',
      action: isFlagged ? 'aml_alert_created' : 'aml_screened',
      description: isFlagged
        ? `AML alert created for lead ${lead.name || lead.id}`
        : `AML screening completed for lead ${lead.name || lead.id}`,
      userId: req.user?.id || null,
      leadId: lead.id,
      metadata: {
        screening,
        status: isFlagged ? 'open' : 'cleared',
        severity: screening.riskLevel,
        flags: screening.flags,
        amount: Number.isFinite(Number(amount)) ? Number(amount) : null,
        currency: currency ? String(currency) : 'AED',
        transactionType: transactionType ? String(transactionType) : null,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  if (isFlagged) {
    const normalizedTags = (lead.tags || []).map((t: unknown) => String(t).toLowerCase());
    const hasAmlFlagged = normalizedTags.includes('aml_flagged');
    if (!hasAmlFlagged) {
      await db.lead.update({
        where: { id: lead.id },
        data: { tags: [...(lead.tags || []), 'aml_flagged'] },
      });
    }
  }

  res.status(201).json({
    success: true,
    data: {
      alertId: isFlagged ? activity.id : null,
      screening,
      status: isFlagged ? 'open' : 'cleared',
    },
  });
}

export async function getAmlAlerts(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — AML alerts require manager role', 403);
  }

  const status = String(req.query.status || 'open');
  const take = Math.min(parseInt(String(req.query.limit || '100'), 10) || 100, 300);

  const alerts = await db.activity.findMany({
    where: {
      type: 'compliance',
      action: 'aml_alert_created',
    },
    include: {
      lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take,
  });

  const filtered = alerts.filter((a: any) => {
    const metadata = normalizeMetadata(a.metadata);
    const alertStatus = String(metadata.status || 'open');
    return status === 'all' ? true : alertStatus === status;
  });

  res.json({
    success: true,
    data: filtered.map((a: any) => {
      const metadata = normalizeMetadata(a.metadata);
      return {
        id: a.id,
        leadId: a.leadId,
        lead: a.lead,
        createdBy: a.user,
        status: metadata.status || 'open',
        severity: metadata.severity || 'medium',
        flags: metadata.flags || [],
        screening: metadata.screening || null,
        resolvedAt: metadata.resolvedAt || null,
        resolvedBy: metadata.resolvedBy || null,
        createdAt: a.createdAt,
      };
    }),
    summary: {
      totalFetched: alerts.length,
      returned: filtered.length,
    },
  });
}

export async function resolveAmlAlert(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — AML alert resolution requires manager role', 403);
  }

  const { alertId } = req.params as Record<string, string>;
  const { resolution, notes } = req.body;

  const alert = await db.activity.findUnique({ where: { id: alertId } });
  if (!alert || alert.type !== 'compliance' || alert.action !== 'aml_alert_created') {
    throw new AppError('AML alert not found', 404);
  }

  const metadata = normalizeMetadata(alert.metadata);
  const nextMetadata = {
    ...metadata,
    status: 'resolved',
    resolution: resolution ? sanitizeString(String(resolution)).substring(0, 500) : 'resolved',
    notes: notes ? sanitizeString(String(notes)).substring(0, 2000) : null,
    resolvedAt: new Date().toISOString(),
    resolvedBy: req.user?.id || null,
  };

  const updated = await db.activity.update({
    where: { id: alertId },
    data: { metadata: nextMetadata },
  });

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'aml_alert_resolved',
      description: `AML alert resolved: ${alertId}`,
      userId: req.user?.id || null,
      leadId: alert.leadId || null,
      metadata: {
        alertId,
        resolution: nextMetadata.resolution,
      },
    },
  });

  res.json({
    success: true,
    data: { id: updated.id, status: 'resolved', metadata: nextMetadata },
  });
}
