/**
 * CRM Dashboard & General Routes — Full Implementation
 * General CRM operations, analytics, search, and dashboard data
 * Endpoints: /api/crm
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';

const router = Router();

// ─── GET /api/crm/dashboard ────────────────────────────────────────────
router.get(
  '/dashboard',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can access CRM dashboard metrics
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — CRM dashboard requires manager or above role', 403);
    }
    const [
      leadCount, propertyCount, agentCount, activityCount,
      hotLeads, recentActivity,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.property.count(),
      prisma.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
      prisma.activity.count(),
      prisma.lead.count({ where: { status: 'qualified' } }),
      prisma.activity.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { id: true, name: true } } },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: { leads: leadCount, properties: propertyCount, agents: agentCount, activities: activityCount, hotLeads },
        recentActivity: recentActivity.map((a) => ({
          id: a.id, type: a.type, action: a.action, description: a.description,
          user: a.user?.name || 'System', timestamp: a.createdAt.toISOString(),
        })),
      },
    });
  })
);

// ─── GET /api/crm/analytics ────────────────────────────────────────────
router.get(
  '/analytics',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can access CRM analytics
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — CRM analytics requires manager or above role', 403);
    }
    const [leadsBySource, leadsByStatus, propertiesByType, commissionStats] = await Promise.all([
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['type'], _count: { _all: true } }),
      prisma.commission.aggregate({ _sum: { amount: true }, _avg: { amount: true }, _count: { _all: true } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        leads: {
          bySource: leadsBySource.map((s) => ({ source: s.source, count: s._count._all })),
          byStatus: leadsByStatus.map((s) => ({ status: s.status, count: s._count._all })),
        },
        properties: {
          byType: propertiesByType.map((t) => ({ type: t.type, count: t._count._all })),
        },
        commissions: {
          total: commissionStats._count._all,
          totalValue: commissionStats._sum.amount || 0,
          averageValue: Math.round(commissionStats._avg.amount || 0),
        },
      },
    });
  })
);

// ─── GET /api/crm/search ───────────────────────────────────────────────
// Global search across leads, properties, and agents
router.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can perform global CRM search
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — global search requires manager or above role', 403);
    }

    const { q } = req.query;
    if (!q || (q as string).trim().length < 2) {
      return res.status(200).json({ success: true, data: { leads: [], properties: [], agents: [] } });
    }

    const term = (q as string).trim();

    const [leads, properties, agents] = await Promise.all([
      prisma.lead.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
            { company: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, status: true, source: true },
        take: 10,
      }),
      prisma.property.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { location: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, location: true, price: true, status: true },
        take: 10,
      }),
      prisma.user.findMany({
        where: {
          role: { in: ['agent', 'owner'] },
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, role: true, department: true },
        take: 10,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: { leads, properties, agents },
      pagination: { totalResults: leads.length + properties.length + agents.length },
    });
  })
);

// ─── GET /api/crm/export ───────────────────────────────────────────────
router.get(
  '/export',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only admins can export CRM data
    const isAdmin = ['owner', 'manager', 'admin'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only admins can export CRM data', 403);
    }

    const VALID_ENTITIES = ['leads', 'properties', 'agents', 'commissions'] as const;
    const rawEntity = (req.query.entity as string) || 'leads';
    const format = (req.query.format as string) || 'json';

    if (!VALID_ENTITIES.includes(rawEntity as typeof VALID_ENTITIES[number])) {
      throw new AppError(`Invalid export entity. Allowed: ${VALID_ENTITIES.join(', ')}`, 400);
    }
    const entity = rawEntity as typeof VALID_ENTITIES[number];

    // Pagination: cap export batch size at 1000 to prevent memory/timeout issues
    const MAX_EXPORT_BATCH = 1000;
    const pageNum = Math.max(1, parseInt((req.query.page as string) || '1', 10) || 1);
    const pageSize = Math.min(MAX_EXPORT_BATCH, Math.max(1, parseInt((req.query.pageSize as string) || '500', 10) || 500));
    const skip = (pageNum - 1) * pageSize;

    let data: Record<string, unknown>[] = [];
    let total = 0;
    switch (entity) {
      case 'leads':
        [data, total] = await Promise.all([
          prisma.lead.findMany({
            select: {
              id: true, name: true, email: true, phone: true, company: true,
              status: true, source: true, budget: true, score: true, tags: true,
              lastContact: true, createdAt: true, updatedAt: true,
              assignedTo: { select: { name: true } },
            },
            skip,
            take: pageSize,
          }),
          prisma.lead.count(),
        ]);
        break;
      case 'properties':
        [data, total] = await Promise.all([
          prisma.property.findMany({
            select: {
              id: true, title: true, type: true, status: true, price: true,
              bedrooms: true, bathrooms: true, sqft: true, location: true, area: true,
              featured: true, agentName: true, createdAt: true, updatedAt: true,
            },
            skip,
            take: pageSize,
          }),
          prisma.property.count(),
        ]);
        break;
      case 'agents':
        [data, total] = await Promise.all([
          prisma.user.findMany({
            where: { role: { in: ['agent', 'owner'] } },
            select: {
              id: true, name: true, email: true, phone: true, role: true,
              department: true, status: true, createdAt: true,
            },
            skip,
            take: pageSize,
          }),
          prisma.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
        ]);
        break;
      case 'commissions':
        [data, total] = await Promise.all([
          prisma.commission.findMany({
            select: {
              id: true, amount: true, percentage: true, status: true, type: true,
              paidAt: true, createdAt: true,
              agent: { select: { name: true } },
            },
            skip,
            take: pageSize,
          }),
          prisma.commission.count(),
        ]);
        break;
      // No default needed — entity is pre-validated above
    }

    // Respond in requested format
    if (format === 'csv') {
      // RFC 4180: Escape fields containing commas, quotes, or newlines
      const escapeCSV = (value: unknown): string => {
        const str = String(value ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      const keys = data.length > 0 ? Object.keys(data[0]) : [];
      const csvLines = [
        keys.map(escapeCSV).join(','),
        ...data.map((row) => keys.map((k) => escapeCSV((row as Record<string, unknown>)[k])).join(','))
      ];
      const csvContent = csvLines.join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${entity}-export.csv"`);
      res.status(200).send(csvContent);
    } else {
      res.status(200).json({
        success: true,
        data,
        meta: { entity, format, count: data.length, exportedAt: new Date().toISOString() },
        pagination: { page: pageNum, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      });
    }
  })
);

export default router;
