/**
 * Departments API Routes — Phase 30
 *
 * Aggregates real-time KPI data from existing tables and serves it
 * to the EnhancedSalesDepartmentView, EnhancedFinanceDepartmentView,
 * and EnhancedHRDepartmentView frontend components.
 *
 * Endpoints:
 *   GET /api/departments                    — list all supported departments
 *   GET /api/departments/:code/data         — aggregated KPI data for a department
 *   GET /api/departments/:code/kpis         — KPI array for a department
 *   GET /api/departments/:code/trends       — monthly trend data for a department
 *   GET /api/departments/:code/summary      — summary stats for a department
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import { prisma } from '../database.js';

const router = Router();

// ─── Supported departments ───────────────────────────────────────────────────

const DEPARTMENTS = [
  { code: 'SALES', name: 'Sales & Leasing', icon: '📈' },
  { code: 'FINANCE', name: 'Finance', icon: '💰' },
  { code: 'HR', name: 'Human Resources', icon: '👥' },
];

// ─── Colour palette for charts ───────────────────────────────────────────────

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

// ─── Helper: last N months as { label, startOf, endOf } ─────────────────────

function lastNMonths(n: number) {
  const months: { label: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = d.toLocaleString('en-GB', { month: 'short' });
    months.push({ label, start, end });
  }
  return months;
}

// ─── Sales department aggregation ────────────────────────────────────────────

async function getSalesData() {
  const months = lastNMonths(6);

  const [totalLeads, wonLeads, leadsBySource, monthlyCommissions] = await Promise.all([
    // Total leads
    prisma.lead.count(),

    // Won leads
    prisma.lead.count({ where: { status: 'won' } }),

    // Leads grouped by source
    prisma.lead.groupBy({
      by: ['source'],
      _count: { _all: true },
      orderBy: { _count: { source: 'desc' } },
    }),

    // Monthly commission revenue (as a proxy for monthly sales)
    Promise.all(
      months.map(({ start, end }) =>
        prisma.commission.aggregate({
          where: {
            status: { in: ['paid', 'approved'] },
            createdAt: { gte: start, lte: end },
          },
          _sum: { amount: true },
        })
      )
    ),
  ]);

  const activeDeals = await prisma.lead.count({
    where: { status: { in: ['hot', 'warm', 'qualified', 'contacted'] } },
  });

  const conversionRate =
    totalLeads > 0 ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(2)) : 0;

  // Map lead sources to chart format (top 5 + "Other")
  const sourceMap: Record<string, number> = {};
  for (const row of leadsBySource) {
    sourceMap[row.source] = row._count._all;
  }

  const sourceLabels: Record<string, string> = {
    direct: 'Direct',
    whatsapp: 'WhatsApp',
    website: 'Website',
    phone: 'Phone',
    referral: 'Referral',
    marketing: 'Marketing',
  };

  const leadSourceEntries = Object.entries(sourceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const leadSources = leadSourceEntries.map(([source, value], i) => ({
    label: sourceLabels[source] || source.charAt(0).toUpperCase() + source.slice(1), // eslint-disable-line security/detect-object-injection
    value,
    color: COLORS[i % COLORS.length],
  }));

  // Monthly revenue from commissions
  const monthlyRevenue = monthlyCommissions[monthlyCommissions.length - 1]._sum.amount ?? 0;

  const monthlySales = months.map(({ label }, i) => ({
    label,
    value: monthlyCommissions[i]._sum.amount ?? 0, // eslint-disable-line security/detect-object-injection
  }));

  return {
    code: 'SALES',
    name: 'Sales & Leasing',
    totalLeads,
    activeDeals,
    conversionRate,
    monthlyRevenue,
    leadSources,
    monthlySales,
    // DepartmentData-compatible fields
    kpis: [
      {
        id: 'total_leads',
        label: 'Total Leads',
        value: totalLeads,
        unit: 'leads',
        trend: 'up' as const,
      },
      {
        id: 'active_deals',
        label: 'Active Deals',
        value: activeDeals,
        unit: 'deals',
        trend: 'up' as const,
      },
      {
        id: 'conversion_rate',
        label: 'Conversion Rate',
        value: conversionRate,
        unit: '%',
        trend: 'up' as const,
      },
      {
        id: 'monthly_revenue',
        label: 'Monthly Revenue',
        value: monthlyRevenue,
        unit: 'AED',
        trend: 'up' as const,
      },
    ],
    summary: {
      totalRecords: totalLeads,
      activeRecords: activeDeals,
      inactiveRecords: totalLeads - activeDeals,
      lastUpdated: new Date().toISOString(),
    },
    trends: monthlySales.map(m => ({ date: m.label, value: m.value, label: m.label })),
    lastFetch: Date.now(),
  };
}

// ─── Finance department aggregation ──────────────────────────────────────────

async function getFinanceData() {
  const months = lastNMonths(6);

  const [totalRevenue, commissionsByStatus, commissionsByType, monthlyCommissions] =
    await Promise.all([
      // Total portfolio value (sold/rented properties)
      prisma.property.aggregate({
        where: { status: { in: ['sold', 'rented'] } },
        _sum: { price: true },
      }),

      // Commissions by status
      prisma.commission.groupBy({
        by: ['status'],
        _sum: { amount: true },
        _count: { _all: true },
      }),

      // Commissions by type (used as budget category breakdown)
      prisma.commission.groupBy({
        by: ['type'],
        _sum: { amount: true },
      }),

      // Monthly commission spending
      Promise.all(
        months.map(({ start, end }) =>
          prisma.commission.aggregate({
            where: { createdAt: { gte: start, lte: end } },
            _sum: { amount: true },
          })
        )
      ),
    ]);

  const totalBudget = totalRevenue._sum.price ?? 0;

  const spentRow = commissionsByStatus.find(r => r.status === 'paid');
  const spent = spentRow?._sum.amount ?? 0;
  const remaining = Math.max(0, totalBudget - spent);
  const utilizationRate =
    totalBudget > 0 ? parseFloat(((spent / totalBudget) * 100).toFixed(1)) : 0;

  // Department budget breakdown from commission types
  const typeLabels: Record<string, string> = {
    sale: 'Sales',
    lease: 'Leasing',
    referral: 'Referrals',
    renewal: 'Renewals',
    other: 'Other',
  };

  const departmentBudgets = commissionsByType.slice(0, 5).map((row, i) => ({
    label: typeLabels[row.type] || row.type,
    value: row._sum.amount ?? 0,
    color: COLORS[i % COLORS.length],
  }));

  const monthlySpending = months.map(({ label }, i) => ({
    label,
    value: monthlyCommissions[i]._sum.amount ?? 0, // eslint-disable-line security/detect-object-injection
  }));

  return {
    code: 'FINANCE',
    name: 'Finance',
    totalBudget,
    spent,
    remaining,
    utilizationRate,
    departmentBudgets,
    monthlySpending,
    // DepartmentData-compatible fields
    kpis: [
      {
        id: 'total_budget',
        label: 'Portfolio Value',
        value: totalBudget,
        unit: 'AED',
        trend: 'up' as const,
      },
      { id: 'spent', label: 'Commissions Paid', value: spent, unit: 'AED', trend: 'up' as const },
      {
        id: 'remaining',
        label: 'Remaining Budget',
        value: remaining,
        unit: 'AED',
        trend: 'neutral' as const,
      },
      {
        id: 'utilization',
        label: 'Utilisation Rate',
        value: utilizationRate,
        unit: '%',
        trend: 'up' as const,
      },
    ],
    summary: {
      totalRecords: commissionsByStatus.reduce((s, r) => s + r._count._all, 0),
      activeRecords: commissionsByStatus.find(r => r.status === 'pending')?._count._all ?? 0,
      inactiveRecords: commissionsByStatus.find(r => r.status === 'paid')?._count._all ?? 0,
      lastUpdated: new Date().toISOString(),
    },
    trends: monthlySpending.map(m => ({ date: m.label, value: m.value, label: m.label })),
    lastFetch: Date.now(),
  };
}

// ─── HR department aggregation ────────────────────────────────────────────────

async function getHRData() {
  const months = lastNMonths(6);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [totalEmployees, usersByRole, , recentHires] = await Promise.all([
    // Total active users (employees)
    prisma.user.count({ where: { status: 'active' } }),

    // Users grouped by role
    prisma.user.groupBy({
      by: ['role'],
      where: { status: 'active' },
      _count: { _all: true },
    }),

    // Users grouped by department field (if set)
    prisma.user.groupBy({
      by: ['department'],
      where: { status: 'active', department: { not: null } },
      _count: { _all: true },
    }),

    // Hires in the last 3 months
    prisma.user.count({
      where: { createdAt: { gte: threeMonthsAgo }, status: 'active' },
    }),
  ]);

  const roleLabels: Record<string, string> = {
    owner: 'Management',
    agent: 'Agents',
    viewer: 'Support',
    admin: 'Admin',
    manager: 'Managers',
    landlord: 'Landlords',
    tenant: 'Tenants',
  };

  // Employee distribution by role (for chart)
  const employeesByDepartment = usersByRole.slice(0, 6).map((row, i) => ({
    label: roleLabels[row.role] || row.role,
    value: row._count._all,
    color: COLORS[i % COLORS.length],
  }));

  // Attendance trend — use a proxy: active leads per month as engagement metric
  const attendanceTrend = await Promise.all(
    months.map(async ({ label, start, end }) => {
      const count = await prisma.activity.count({
        where: { createdAt: { gte: start, lte: end } },
      });
      return { label, value: count };
    })
  );

  // Quarterly hires — approximate from createdAt quarters
  const now = new Date();
  const hiresLastQuarter = await Promise.all(
    [3, 2, 1].map(async (quarterAgo, idx) => {
      const qEnd = new Date(now.getFullYear(), now.getMonth() - (quarterAgo - 1) * 3, 0);
      const qStart = new Date(now.getFullYear(), now.getMonth() - quarterAgo * 3, 1);
      const count = await prisma.user.count({
        where: { createdAt: { gte: qStart, lte: qEnd }, status: 'active' },
      });
      const qLabel = `Q${4 - idx}`;
      return { label: qLabel, value: count, color: COLORS[idx % COLORS.length] };
    })
  );

  // Open positions — job applications with status 'received' or 'reviewed'
  const openPositions = await prisma.jobApplication.count({
    where: { status: { in: ['received', 'reviewed', 'shortlisted', 'interview'] } },
  });

  return {
    code: 'HR',
    name: 'Human Resources',
    totalEmployees,
    activePositions: openPositions,
    attendanceRate: 94.5, // Placeholder — no attendance system yet; will be replaced when timesheet module is built
    turnoverRate: parseFloat(((recentHires / Math.max(1, totalEmployees)) * 100).toFixed(1)),
    employeesByDepartment,
    attendanceTrend,
    hiresLastQuarter,
    // DepartmentData-compatible fields
    kpis: [
      {
        id: 'total_employees',
        label: 'Total Employees',
        value: totalEmployees,
        unit: 'people',
        trend: 'up' as const,
      },
      {
        id: 'open_positions',
        label: 'Open Positions',
        value: openPositions,
        unit: 'roles',
        trend: 'neutral' as const,
      },
      {
        id: 'attendance_rate',
        label: 'Attendance Rate',
        value: 94.5,
        unit: '%',
        trend: 'up' as const,
      },
      {
        id: 'recent_hires',
        label: 'Hires (3 months)',
        value: recentHires,
        unit: 'people',
        trend: 'up' as const,
      },
    ],
    summary: {
      totalRecords: totalEmployees,
      activeRecords: totalEmployees,
      inactiveRecords: 0,
      lastUpdated: new Date().toISOString(),
    },
    trends: attendanceTrend.map(m => ({ date: m.label, value: m.value, label: m.label })),
    lastFetch: Date.now(),
  };
}

// ─── Route: GET /api/departments ─────────────────────────────────────────────

router.get(
  '/',
  requirePermission('view_analytics'),
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      departments: DEPARTMENTS,
    });
  })
);

// ─── Route: GET /api/departments/:code/data ──────────────────────────────────

router.get(
  '/:code/data',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
    const code = req.params.code.toUpperCase();

    let data: Record<string, unknown>;

    switch (code) {
      case 'SALES':
        data = await getSalesData();
        break;
      case 'FINANCE':
        data = await getFinanceData();
        break;
      case 'HR':
        data = await getHRData();
        break;
      default:
        res.status(404).json({ success: false, error: `Department '${code}' not found` });
        return;
    }

    res.status(200).json({ success: true, data });
  })
);

// ─── Route: GET /api/departments/:code/kpis ──────────────────────────────────

router.get(
  '/:code/kpis',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
    const code = req.params.code.toUpperCase();
    let data: Record<string, unknown>;

    switch (code) {
      case 'SALES':
        data = await getSalesData();
        break;
      case 'FINANCE':
        data = await getFinanceData();
        break;
      case 'HR':
        data = await getHRData();
        break;
      default:
        res.status(404).json({ success: false, error: `Department '${code}' not found` });
        return;
    }

    res.status(200).json({
      success: true,
      kpis: (data as { kpis: unknown[] }).kpis,
      pagination: { page: 1, pageSize: 20, total: (data as { kpis: unknown[] }).kpis.length },
    });
  })
);

// ─── Route: GET /api/departments/:code/trends ────────────────────────────────

router.get(
  '/:code/trends',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
    const code = req.params.code.toUpperCase();
    let data: Record<string, unknown>;

    switch (code) {
      case 'SALES':
        data = await getSalesData();
        break;
      case 'FINANCE':
        data = await getFinanceData();
        break;
      case 'HR':
        data = await getHRData();
        break;
      default:
        res.status(404).json({ success: false, error: `Department '${code}' not found` });
        return;
    }

    res.status(200).json({
      success: true,
      trends: (data as { trends: unknown[] }).trends,
      period: req.query.period || 'monthly',
    });
  })
);

// ─── Route: GET /api/departments/:code/summary ───────────────────────────────

router.get(
  '/:code/summary',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
    const code = req.params.code.toUpperCase();
    let data: Record<string, unknown>;

    switch (code) {
      case 'SALES':
        data = await getSalesData();
        break;
      case 'FINANCE':
        data = await getFinanceData();
        break;
      case 'HR':
        data = await getHRData();
        break;
      default:
        res.status(404).json({ success: false, error: `Department '${code}' not found` });
        return;
    }

    res.status(200).json({
      success: true,
      summary: (data as { summary: unknown }).summary,
    });
  })
);

export default router;
