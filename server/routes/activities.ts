/**
 * Activities API Routes — Standalone CRUD
 * Endpoints: /api/activities
 * Complements: /api/dashboard/activities (read-only feed) and /api/leads/:id/activities (lead-scoped)
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { prisma } from '../database.js';
import { validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { sanitizeString } from '../utils/sanitize';
import { requirePermission } from '../middleware/rbac';
import { triggerLeadRescore } from '../services/ai/leadAutoRescore.js';

const router = Router();

function buildActivityWhere(params: Record<string, string | undefined>): Prisma.ActivityWhereInput {
  const { type, action, userId, leadId, search } = params;
  const where: Prisma.ActivityWhereInput = {};
  if (type && type !== 'all') where.type = type as string;
  if (action && action !== 'all') where.action = action as string;
  if (userId) where.userId = userId as string;
  if (leadId) where.leadId = leadId as string;
  if (typeof search === 'string' && search.trim().length > 0) {
    const query = sanitizeString(search).trim().slice(0, 120);
    where.OR = [
      { description: { contains: query, mode: 'insensitive' } },
      { type: { contains: query, mode: 'insensitive' } },
      { action: { contains: query, mode: 'insensitive' } },
      { user: { is: { name: { contains: query, mode: 'insensitive' } } } },
      { user: { is: { email: { contains: query, mode: 'insensitive' } } } },
      { lead: { is: { name: { contains: query, mode: 'insensitive' } } } },
    ];
  }
  return where;
}

// ─── GET /api/activities ────────────────────────────────────────────────
// Filterable by type, action, userId, leadId
router.get(
  '/',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, action, userId, leadId, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query as Record<string, string | undefined>;

    const { page: pageNum, limit, skip } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where = buildActivityWhere({ type, action, userId, leadId, search });

    const validSorts = ['createdAt', 'type', 'action'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Prisma.ActivityOrderByWithRelationInput = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          lead: { select: { id: true, name: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: activities.map((a) => ({
        id: a.id,
        type: a.type,
        action: a.action,
        description: a.description,
        metadata: a.metadata,
        createdAt: a.createdAt.toISOString(),
        userId: a.userId,
        user: a.user ? { id: a.user.id, name: a.user.name, email: a.user.email } : null,
        leadId: a.leadId,
        lead: a.lead ? { id: a.lead.id, name: a.lead.name } : null,
      })),
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/activities/export/csv ──────────────────────────────────────
router.get(
  '/export/csv',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, action, userId, leadId, search } = req.query as Record<string, string | undefined>;
    const where = buildActivityWhere({ type, action, userId, leadId, search });

    const rows = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000,
      include: {
        user: { select: { name: true, email: true } },
        lead: { select: { name: true } },
      },
    });

    const escape = (value: unknown): string => {
      const text = String(value ?? '');
      if (!text.includes(',') && !text.includes('"') && !text.includes('\n')) return text;
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvLines = [
      ['id', 'createdAt', 'type', 'action', 'description', 'user', 'email', 'lead'].join(','),
      ...rows.map((row) =>
        [
          escape(row.id),
          escape(row.createdAt.toISOString()),
          escape(row.type),
          escape(row.action),
          escape(row.description),
          escape(row.user?.name || 'System'),
          escape(row.user?.email || ''),
          escape(row.lead?.name || ''),
        ].join(','),
      ),
    ];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-log.csv"');
    res.status(200).send(csvLines.join('\n'));
  }),
);

// ─── GET /api/activities/export/xlsx ─────────────────────────────────────
router.get(
  '/export/xlsx',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, action, userId, leadId, search } = req.query as Record<string, string | undefined>;
    const where = buildActivityWhere({ type, action, userId, leadId, search });

    const rows = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000,
      include: {
        user: { select: { name: true, email: true } },
        lead: { select: { name: true } },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Audit Log');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 28 },
      { header: 'Created At', key: 'createdAt', width: 26 },
      { header: 'Type', key: 'type', width: 14 },
      { header: 'Action', key: 'action', width: 18 },
      { header: 'Description', key: 'description', width: 60 },
      { header: 'User', key: 'user', width: 24 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Lead', key: 'lead', width: 24 },
    ];

    for (const row of rows) {
      sheet.addRow({
        id: row.id,
        createdAt: row.createdAt.toISOString(),
        type: row.type,
        action: row.action,
        description: row.description,
        user: row.user?.name || 'System',
        email: row.user?.email || '',
        lead: row.lead?.name || '',
      });
    }

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.autoFilter = {
      from: 'A1',
      to: 'H1',
    };

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-log.xlsx"');
    res.status(200).send(Buffer.from(buffer));
  }),
);

// ─── GET /api/activities/:id ────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id as string, 'Activity ID');

    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { id: true, name: true, email: true } },
        lead: { select: { id: true, name: true } },
      },
    });

    if (!activity) throw new AppError('Activity not found', 404);

    res.status(200).json({
      success: true,
      data: {
        id: activity.id,
        type: activity.type,
        action: activity.action,
        description: activity.description,
        metadata: activity.metadata,
        createdAt: activity.createdAt.toISOString(),
        userId: activity.userId,
        user: activity.user ? { id: activity.user.id, name: activity.user.name, email: activity.user.email } : null,
        leadId: activity.leadId,
        lead: activity.lead ? { id: activity.lead.id, name: activity.lead.name } : null,
      },
    });
  })
);

// ─── POST /api/activities ───────────────────────────────────────────────
// Create a standalone activity (not tied to a lead)
router.post(
  '/',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { type, action, description, metadata, leadId } = req.body;

    if (!type || typeof type !== 'string') {
      throw new AppError('Activity type is required (lead, property, deal, commission, agent, client, system)', 400);
    }
    if (!action || typeof action !== 'string') {
      throw new AppError('Activity action is required (created, updated, deleted, status_changed, note_added, call, email, visit)', 400);
    }
    if (!description || typeof description !== 'string') {
      throw new AppError('Activity description is required', 400);
    }

    const activity = await prisma.activity.create({
      data: {
        type: sanitizeString(type),
        action: sanitizeString(action),
        description: sanitizeString(description),
        metadata: metadata || null,
        userId: req.user?.id || null,
        leadId: leadId || null,
      },
    });
    triggerLeadRescore(activity.leadId, 'activity_created');

    res.status(201).json({
      success: true,
      data: {
        id: activity.id,
        type: activity.type,
        action: activity.action,
        description: activity.description,
        metadata: activity.metadata,
        createdAt: activity.createdAt.toISOString(),
        userId: activity.userId,
        leadId: activity.leadId,
      },
    });
  })
);

// ─── PATCH /api/activities/:id ──────────────────────────────────────────
// Update activity metadata/description
router.patch(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Activity ID');

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new AppError('Activity not found', 404);

    const { description, metadata } = req.body;
    const data: Record<string, unknown> = {};
    if (description !== undefined) data.description = sanitizeString(String(description));
    if (metadata !== undefined) data.metadata = metadata;

    const updated = await prisma.activity.update({ where: { id }, data });
    triggerLeadRescore(updated.leadId, 'activity_updated');

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        type: updated.type,
        action: updated.action,
        description: updated.description,
        metadata: updated.metadata,
        createdAt: updated.createdAt.toISOString(),
        userId: updated.userId,
        leadId: updated.leadId,
      },
    });
  })
);

// ─── DELETE /api/activities/:id ─────────────────────────────────────────
router.delete(
  '/:id',
  requirePermission('manage_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Activity ID');

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) throw new AppError('Activity not found', 404);

    // Only managers+ can delete activities
    const isAdmin = ['owner', 'manager', 'admin'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only managers can delete activity records', 403);
    }

    await prisma.activity.delete({ where: { id } });
    triggerLeadRescore(existing.leadId, 'activity_deleted');

    res.status(200).json({ success: true, message: 'Activity deleted' });
  })
);

export default router;
