/**
 * complianceBrnController.ts
 * Handlers for RERA Broker Registration Number (BRN) monitoring and check history.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import {
  getBRNExpiryReport,
  checkBRNExpirations,
} from '../../services/compliance/reraExpiryScheduler.js';
import {
  ensureComplianceManagerRole,
  normalizeMetadata,
} from './complianceCommon.js';

const db = prisma as any;

export async function getBrnExpiry(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — compliance data requires manager role', 403);
  }

  const report = await getBRNExpiryReport();

  const summary = {
    total: report.length,
    valid: report.filter(a => a.status === 'valid').length,
    expiringSoon: report.filter(a => a.status === 'expiring_soon').length,
    expired: report.filter(a => a.status === 'expired').length,
    notSet: report.filter(a => a.status === 'not_set').length,
  };

  res.json({ success: true, data: { agents: report, summary } });
}

export async function checkBrn(req: Request, res: Response): Promise<void> {
  ensureComplianceManagerRole(
    req.user?.role,
    'Access denied — BRN checks require manager role or above'
  );

  logger.info('Manual BRN expiry check triggered', { userId: req.user?.id });
  const result = await checkBRNExpirations();

  await db.activity.create({
    data: {
      type: 'compliance',
      action: 'brn_manual_check',
      description: `Manual BRN expiry check executed (notified=${result.notified}, errors=${result.errors})`,
      userId: req.user?.id || null,
      metadata: {
        notified: result.notified,
        errors: result.errors,
        agentCount: result.agents.length,
        agentIds: result.agents.map(agent => agent.id),
        checkedAt: new Date().toISOString(),
      },
    },
  });

  res.json({
    success: true,
    data: {
      notified: result.notified,
      errors: result.errors,
      agents: result.agents,
    },
  });
}

export async function getBrnCheckHistory(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — BRN check history requires manager role', 403);
  }

  const limit = Math.max(1, Math.min(200, parseInt(String(req.query.limit || '25'), 10) || 25));

  const runs = await db.activity.findMany({
    where: {
      type: 'compliance',
      action: 'brn_manual_check',
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true, role: true, email: true } },
    },
  });

  const data = runs.map((run: any) => {
    const metadata = normalizeMetadata(run.metadata);
    return {
      id: run.id,
      description: run.description,
      createdAt: run.createdAt,
      user: run.user,
      summary: {
        notified: Number(metadata.notified || 0),
        errors: Number(metadata.errors || 0),
        agentCount: Number(metadata.agentCount || 0),
        agentIds: Array.isArray(metadata.agentIds) ? metadata.agentIds : [],
      },
    };
  });

  res.status(200).json({
    success: true,
    data,
    summary: {
      total: data.length,
      totalNotified: data.reduce((sum: number, run: any) => sum + run.summary.notified, 0),
      totalErrors: data.reduce((sum: number, run: any) => sum + run.summary.errors, 0),
    },
  });
}
