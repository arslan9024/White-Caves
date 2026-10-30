/**
 * analyticsMetricsController.ts
 * Handlers for executive metrics, KPI metrics, lead funnel statistics, and time-series trends.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { cacheService } from '../../services/CacheService.js';

export async function getExecutiveAnalytics(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — executive analytics requires manager or above role', 403);
  }

  const data = await cacheService.getOrSet(
    'wc:dashboard:executive',
    async () => {
      const [
        leadsByStatus,
        leadsBySource,
        propertiesByStatus,
        propertiesByType,
        commissionsByStatus,
        portfolioValue,
      ] = await Promise.all([
        prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
        prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.property.groupBy({ by: ['type'], _count: { _all: true } }),
        prisma.commission.groupBy({
          by: ['status'],
          _count: { _all: true },
          _sum: { amount: true },
        }),
        prisma.property.aggregate({ _sum: { price: true } }),
      ]);

      const toMap = (
        arr: Array<{ _count: { _all: number }; [key: string]: unknown }>,
        keyField: string
      ) => {
        const map: Record<string, number> = {};
        arr.forEach(item => {
          map[String(item[keyField])] = item._count._all;
        });
        return map;
      };

      return {
        leads: {
          byStatus: toMap(leadsByStatus, 'status'),
          bySource: toMap(leadsBySource, 'source'),
        },
        properties: {
          byStatus: toMap(propertiesByStatus, 'status'),
          byType: toMap(propertiesByType, 'type'),
        },
        commissions: commissionsByStatus.map(c => ({
          status: c.status,
          count: c._count._all,
          totalValue: c._sum.amount || 0,
        })),
        portfolioValue: portfolioValue._sum.price || 0,
      };
    },
    300
  );

  res.status(200).json({
    success: true,
    data,
  });
}

export async function getKpiMetrics(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — KPI data requires manager or above role', 403);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await cacheService.getOrSet(
    'wc:dashboard:kpis',
    async () => {
      const [newLeads30d, wonDeals30d, newProperties30d, totalRevenue, avgDealSize] =
        await Promise.all([
          prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
          prisma.lead.count({ where: { status: 'won', updatedAt: { gte: thirtyDaysAgo } } }),
          prisma.property.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
          prisma.commission.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
          prisma.commission.aggregate({ where: { status: 'paid' }, _avg: { amount: true } }),
        ]);

      return {
        period: '30d',
        kpis: {
          newLeads: newLeads30d,
          wonDeals: wonDeals30d,
          newListings: newProperties30d,
          totalRevenue: totalRevenue._sum.amount || 0,
          avgDealSize: Math.round(avgDealSize._avg.amount || 0),
        },
      };
    },
    300
  );

  res.status(200).json({
    success: true,
    data,
  });
}

export async function getLeadFunnel(_req: Request, res: Response): Promise<void> {
  const data = await cacheService.getOrSet(
    'wc:dashboard:lead-funnel',
    async () => {
      const stages = ['new', 'contacted', 'qualified', 'viewing', 'negotiating', 'won', 'lost'];
      const counts = await Promise.all(
        stages.map(status => prisma.lead.count({ where: { status } }))
      );
      const total = counts.reduce((sum, c) => sum + c, 0);

      const funnel = stages.map((stage, i) => ({
        stage,
        count: counts[i],
        percentage: total > 0 ? Math.round((counts[i] / total) * 100) : 0,
      }));

      const tiers = ['hot', 'warm', 'cold', 'inactive'];
      const tierCounts = await Promise.all(
        tiers.map(tier => prisma.lead.count({ where: { scoreTier: tier } }))
      );
      const tierDistribution = tiers.map((tier, i) => ({
        tier,
        count: tierCounts[i],
      }));

      return { funnel, tierDistribution, total };
    },
    300
  );

  res.status(200).json({
    success: true,
    data,
  });
}

export async function getTrends(req: Request, res: Response): Promise<void> {
  const days = parseInt(req.query.days as string) || 30;

  const data = await cacheService.getOrSet(
    `wc:dashboard:trends:${days}`,
    async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [leads, transactions, commissions] = await Promise.all([
        prisma.lead.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
        }),
        prisma.transaction.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true, amount: true },
          orderBy: { createdAt: 'asc' },
        }),
        prisma.commission.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true, amount: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

      const groupByDate = <T extends { createdAt: Date }>(
        items: T[],
        getValue?: (item: T) => number
      ) => {
        const map: Record<string, { count: number; value: number }> = {};
        for (const item of items) {
          const dateKey = item.createdAt.toISOString().split('T')[0];
          if (!map[dateKey]) map[dateKey] = { count: 0, value: 0 };
          map[dateKey].count++;
          if (getValue) map[dateKey].value += getValue(item);
        }
        return map;
      };

      const leadsByDate = groupByDate(leads);
      const transactionsByDate = groupByDate(transactions, t => t.amount);
      const commissionsByDate = groupByDate(commissions, c => c.amount);

      const series: Array<{
        date: string;
        leads: number;
        transactions: number;
        transactionValue: number;
        commissions: number;
        commissionValue: number;
      }> = [];

      for (let d = 0; d < days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        const key = date.toISOString().split('T')[0];
        series.push({
          date: key,
          leads: leadsByDate[key]?.count || 0,
          transactions: transactionsByDate[key]?.count || 0,
          transactionValue: transactionsByDate[key]?.value || 0,
          commissions: commissionsByDate[key]?.count || 0,
          commissionValue: commissionsByDate[key]?.value || 0,
        });
      }

      return { period: `${days}d`, startDate: startDate.toISOString(), series };
    },
    300
  );

  res.status(200).json({
    success: true,
    data,
  });
}

