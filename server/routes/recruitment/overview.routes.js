/**
 * overview.routes.js — Recruitment overview & KPI trend export endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { requireRecruitmentAccess } from './recruitment.access.js';
import { buildRecruitmentOverview } from './recruitment.metrics.js';
import { buildKpiTrends } from './recruitment.metrics.js';
import { buildKpiTrendExportRows } from './recruitment.metrics.js';
import { toCsv } from './recruitment.metrics.js';

const router = express.Router();

// Recruitment overview for Zoe analytics
router.get('/overview', requireRecruitmentAccess('read'), async (req, res) => {
  try {
    const [jobs, applications, scores, recruitmentMetrics] = await Promise.all([
      ctx.prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { applications: true } } },
      }),
      ctx.prisma.application.findMany({ orderBy: { applied_at: 'desc' } }),
      ctx.prisma.candidateScore.findMany({ orderBy: { created_at: 'desc' } }),
      ctx.prisma.recruitmentMetric.findMany({ orderBy: { metric_date: 'asc' }, take: 12 }),
    ]);

    const overview = buildRecruitmentOverview(jobs, applications, scores);
    overview.kpi_trends = buildKpiTrends(recruitmentMetrics);

    res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    console.error('Error fetching recruitment overview:', error);
    res.status(500).json({
      error: 'Failed to fetch recruitment overview',
      details: error.message,
    });
  }
});

// Export recruitment KPI trend history for executive reporting
router.get('/overview/export', requireRecruitmentAccess('read'), async (req, res) => {
  try {
    const recruitmentMetrics = await ctx.prisma.recruitmentMetric.findMany({
      orderBy: { metric_date: 'asc' },
      take: 12,
    });

    const kpiTrends = buildKpiTrends(recruitmentMetrics);
    const rows = buildKpiTrendExportRows(kpiTrends);
    const csv = toCsv(rows);
    const dateStamp = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=recruitment-kpi-trends-${dateStamp}.csv`
    );
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting recruitment KPI trends:', error);
    return res.status(500).json({
      error: 'Failed to export recruitment KPI trends',
      details: error.message,
    });
  }
});

export default router;
