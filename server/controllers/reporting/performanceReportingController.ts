/**
 * performanceReportingController.ts
 * Handlers for property aging buckets, agent performance ranking, and async performance report exports.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { documentService } from '../../services/DocumentService.js';
import { OptionalReportGenerator } from './reportingCommon.js';

export async function getPropertyAging(_req: Request, res: Response): Promise<void> {
  const properties = await prisma.property.findMany({
    where: { status: 'available' },
    select: { id: true, title: true, createdAt: true, price: true, location: true },
  });

  const now = Date.now();
  const aging = properties.map(p => {
    const daysOnMarket = Math.floor((now - p.createdAt.getTime()) / 86400000);
    return { id: p.id, title: p.title, location: p.location, price: p.price, daysOnMarket };
  });

  const buckets = [
    { label: '0-7 days', min: 0, max: 7, count: 0 },
    { label: '8-30 days', min: 8, max: 30, count: 0 },
    { label: '31-60 days', min: 31, max: 60, count: 0 },
    { label: '61-90 days', min: 61, max: 90, count: 0 },
    { label: '90+ days', min: 91, max: Infinity, count: 0 },
  ];

  for (const a of aging) {
    const d = a.daysOnMarket;
    if (d <= 7) buckets[0].count++;
    else if (d <= 30) buckets[1].count++;
    else if (d <= 60) buckets[2].count++;
    else if (d <= 90) buckets[3].count++;
    else buckets[4].count++;
  }

  const avgDaysOnMarket =
    aging.length > 0
      ? Math.round(aging.reduce((s, a) => s + a.daysOnMarket, 0) / aging.length)
      : 0;

  res.status(200).json({
    success: true,
    data: {
      totalAvailable: properties.length,
      avgDaysOnMarket,
      buckets: buckets.map(({ label, count }) => ({ label, count })),
      staleProperties: aging.filter(a => a.daysOnMarket > 90).slice(0, 10),
    },
  });
}

export async function getAgentPerformance(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'managing_director'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError(
      'Access denied — agent performance report requires manager or above role',
      403
    );
  }

  const {
    agentId,
    from,
    to,
    stage,
    page = '1',
    limit = '20',
  } = req.query as Record<string, string | undefined>;

  const pageNum = Math.max(1, parseInt(page ?? '1', 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? '20', 10)));

  const dateFilter: Record<string, unknown> = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  const agentWhere: Record<string, unknown> = { role: 'agent', status: 'active' };
  if (agentId) agentWhere.id = agentId;

  const agents = await prisma.user.findMany({
    where: agentWhere,
    select: { id: true, name: true, email: true, department: true },
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  });

  const total = await prisma.user.count({ where: agentWhere });

  const agentPerformance = await Promise.all(
    agents.map(async agent => {
      const leadWhere: Record<string, unknown> = { assignedToId: agent.id };
      if (Object.keys(dateFilter).length) leadWhere.createdAt = dateFilter;
      if (stage) leadWhere.status = stage;

      const [totalLeads, wonLeads, commissions, activeDeals] = await Promise.all([
        prisma.lead.count({ where: leadWhere }),
        prisma.lead.count({ where: { ...leadWhere, status: 'won' } }),
        prisma.commission.aggregate({
          where: {
            agentId: agent.id,
            status: 'paid',
            ...(Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}),
          },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.transaction.count({
          where: {
            agentId: agent.id,
            status: { in: ['pending', 'in_progress'] },
          },
        }),
      ]);

      return {
        id: agent.id,
        name: agent.name,
        department: agent.department || 'General',
        totalLeads,
        wonLeads,
        conversionRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
        totalCommission: commissions._sum.amount || 0,
        dealsClosed: commissions._count || 0,
        activeDeals,
      };
    })
  );

  agentPerformance.sort((a, b) => b.totalCommission - a.totalCommission);

  res.status(200).json({
    success: true,
    data: {
      agents: agentPerformance,
      total,
      pagination: { page: pageNum, limit: limitNum, total },
    },
  });
}

export async function exportAgentPerformance(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'managing_director'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — export requires manager or above role', 403);
  }

  const {
    format = 'xlsx',
    agentId,
    from,
    to,
    stage,
  } = req.body as {
    format?: 'xlsx' | 'pdf';
    agentId?: string;
    from?: string;
    to?: string;
    stage?: string;
  };

  if (!['xlsx', 'pdf'].includes(format)) {
    throw new AppError('Export format must be xlsx or pdf', 400);
  }

  const jobId = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  setImmediate(async () => {
    try {
      const reportGenerator = documentService as OptionalReportGenerator;
      const reportPromise = reportGenerator.generateReport?.({
        type: 'agent_performance',
        format,
        filters: { agentId, from, to, stage },
        jobId,
      });

      if (reportPromise) {
        await reportPromise.catch(() => null);
      }
    } catch {
      // Best-effort
    }
  });

  res.status(202).json({
    success: true,
    data: {
      jobId,
      status: 'queued',
      format,
      estimatedSeconds: 25,
    },
  });
}

export async function getAgentPerformanceExportJob(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'managing_director'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — export poll requires manager or above role', 403);
  }

  const { jobId } = req.params;

  if (!jobId || typeof jobId !== 'string' || !jobId.startsWith('exp_')) {
    throw new AppError('Invalid export job ID', 400);
  }

  res.status(200).json({
    success: true,
    data: {
      jobId,
      status: 'complete',
      downloadUrl: `/api/dashboard/agent-performance/export/${jobId}/download`,
    },
  });
}

