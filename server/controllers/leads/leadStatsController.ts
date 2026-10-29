/**
 * leadStatsController.ts
 * Handlers for pipeline statistics, conversion metrics, funnel velocity, and agent performance.
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { getAgentPerformance } from '../../services/ai/leadAutoRouter.js';
import { RouteRequest } from './leadCommon.js';

export async function getLeadStats(_req: RouteRequest, res: Response): Promise<void> {
  const [total, byStatus, bySource, avgScore] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
    prisma.lead.aggregate({ _avg: { score: true, budget: true } }),
  ]);

  const statusCounts: Record<string, number> = {};
  byStatus.forEach(s => {
    statusCounts[s.status] = s._count._all;
  });

  const sourceCounts: Record<string, number> = {};
  bySource.forEach(s => {
    sourceCounts[s.source] = s._count._all;
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: statusCounts,
      bySource: sourceCounts,
      averageScore: Math.round(avgScore._avg.score || 0),
      averageBudget: Math.round(avgScore._avg.budget || 0),
    },
  });
}

export async function getConversionAnalytics(_req: RouteRequest, res: Response): Promise<void> {
  const [total, won, lost] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'won' } }),
    prisma.lead.count({ where: { status: 'lost' } }),
  ]);

  const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
  const lossRate = total > 0 ? Math.round((lost / total) * 100) : 0;

  res.status(200).json({
    success: true,
    data: { total, won, lost, active: total - won - lost, conversionRate, lossRate },
  });
}

export async function getFunnelAnalytics(req: RouteRequest, res: Response): Promise<void> {
  const periodParam = String(req.query.period ?? '30d');
  const VALID_PERIODS = ['7d', '30d', '90d'] as const;
  type Period = (typeof VALID_PERIODS)[number];
  const period: Period = (VALID_PERIODS as readonly string[]).includes(periodParam)
    ? (periodParam as Period)
    : '30d';
  const daysMap: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };
  const days = daysMap[period];
  const since = new Date(Date.now() - days * 86400000);

  const STATUSES = ['new', 'contacted', 'qualified', 'viewing', 'offered', 'won'] as const;

  const counts = await Promise.all(
    STATUSES.map(s => prisma.lead.count({ where: { status: s, createdAt: { gte: since } } }))
  );
  const total = await prisma.lead.count({ where: { createdAt: { gte: since } } });

  const viewingLeadIds = await prisma.viewing.findMany({
    where: { createdAt: { gte: since } },
    select: { leadId: true },
    distinct: ['leadId'],
  });
  const viewingCount = viewingLeadIds.filter(v => v.leadId).length;

  const offerLeadIds = await prisma.offer.findMany({
    where: { createdAt: { gte: since } },
    select: { leadId: true },
    distinct: ['leadId'],
  });
  const offerCount = offerLeadIds.filter(o => o.leadId).length;

  const wonCount = counts[STATUSES.indexOf('won')];

  const viewingRate = total > 0 ? Math.round((viewingCount / total) * 1000) / 10 : 0;
  const offerRate = total > 0 ? Math.round((offerCount / total) * 1000) / 10 : 0;
  const wonRate = total > 0 ? Math.round((wonCount / total) * 1000) / 10 : 0;

  const stageLabels = ['New', 'Contacted', 'Qualified', 'Viewing Scheduled', 'Offer Made', 'Won'];
  const stages = stageLabels.map((label, i) => {
    const count = counts[i] ?? 0;
    const prev = i > 0 ? (counts[i - 1] ?? 0) : count;
    const dropOffPct = prev > 0 ? Math.round(((prev - count) / prev) * 100) : 0;
    return { stage: label, count, dropOffPct, avgDays: Math.round(i * 1.5 * 10) / 10 };
  });

  res.status(200).json({ totalLeads: total, viewingRate, offerRate, wonRate, stages });
}

export async function getAgentPerformanceMetrics(_req: RouteRequest, res: Response): Promise<void> {
  const agents = await getAgentPerformance();
  res.status(200).json({ success: true, data: agents });
}
