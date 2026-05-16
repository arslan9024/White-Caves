/**
 * Appointments API Routes
 * ─────────────────────────────────────────────────────────────────────────
 * Full CRUD for appointment scheduling (viewings, meetings, calls, signings).
 *
 * GET    /api/appointments           — List appointments (filtered, paginated)
 * GET    /api/appointments/upcoming  — Next 30 days only
 * GET    /api/appointments/:id       — Single appointment
 * POST   /api/appointments           — Create appointment
 * PATCH  /api/appointments/:id       — Update / reschedule / cancel
 * DELETE /api/appointments/:id       — Delete (admin only)
 */

import { Router, Response } from 'express';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { parsePagination } from '../config/pagination.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';

const router = Router();

const VALID_TYPES = ['viewing', 'meeting', 'call', 'inspection', 'signing'] as const;
const VALID_STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'] as const;

const mockAppointments: Array<Record<string, any>> = [];

const normalizeId = () => randomUUID().replace(/-/g, '').slice(0, 24);

const matchAppointmentWhere = (item: Record<string, any>, where?: Record<string, any>) => {
  if (!where) return true;

  for (const [key, value] of Object.entries(where)) {
    if (key === 'scheduledAt' && value && typeof value === 'object') {
      const date = new Date(item.scheduledAt);
      if (value.gte && date < new Date(value.gte)) return false;
      if (value.lte && date > new Date(value.lte)) return false;
      continue;
    }

    if (value && typeof value === 'object' && Array.isArray(value.in)) {
      if (!value.in.includes(item[key])) return false;
      continue;
    }

    if (item[key] !== value) return false;
  }

  return true;
};

const createMockAppointmentModel = () => ({
  findMany: async ({ where, orderBy, skip = 0, take }: any = {}) => {
    let rows = mockAppointments.filter(r => matchAppointmentWhere(r, where));

    if (orderBy?.scheduledAt) {
      rows = rows.sort((a, b) => {
        const av = new Date(a.scheduledAt).getTime();
        const bv = new Date(b.scheduledAt).getTime();
        return orderBy.scheduledAt === 'desc' ? bv - av : av - bv;
      });
    }

    const paged = rows.slice(skip, take ? skip + take : undefined);
    return paged;
  },

  count: async ({ where }: any = {}) => mockAppointments.filter(r => matchAppointmentWhere(r, where)).length,

  findUnique: async ({ where }: any) => mockAppointments.find(r => r.id === where.id) ?? null,

  create: async ({ data }: any) => {
    const created = {
      id: normalizeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockAppointments.push(created);
    return created;
  },

  update: async ({ where, data }: any) => {
    const idx = mockAppointments.findIndex(r => r.id === where.id);
    if (idx < 0) throw new AppError('Appointment not found', 404);
    mockAppointments[idx] = {
      ...mockAppointments[idx],
      ...data,
      updatedAt: new Date(),
    };
    return mockAppointments[idx];
  },

  delete: async ({ where }: any) => {
    const idx = mockAppointments.findIndex(r => r.id === where.id);
    if (idx < 0) throw new AppError('Appointment not found', 404);
    const [deleted] = mockAppointments.splice(idx, 1);
    return deleted;
  },
});

const getAppointmentModel = () => {
  const appointmentModel = (prisma as unknown as { appointment?: any }).appointment;
  if (!appointmentModel) {
    return createMockAppointmentModel();
  }
  return appointmentModel;
};

// ─── GET /api/appointments ───────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const appointmentModel = getAppointmentModel();
    const { page, limit, skip } = parsePagination(req.query);
    const { status, type, agentId, propertyId, leadId, from, to } = req.query as Record<
      string,
      string
    >;

    const where: Record<string, unknown> = {};
    if (status && VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      where.status = status;
    }
    if (type && VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      where.type = type;
    }
    if (agentId) where.agentId = agentId;
    if (propertyId) where.propertyId = propertyId;
    if (leadId) where.leadId = leadId;

    const dateFilter: Record<string, Date> = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);
    if (Object.keys(dateFilter).length > 0) where.scheduledAt = dateFilter;

    const [appointments, total] = await Promise.all([
      appointmentModel.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limit,
      }),
      appointmentModel.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/appointments/upcoming ─────────────────────────────────────
router.get(
  '/upcoming',
  requirePermission('view_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const appointmentModel = getAppointmentModel();
    const { limit: limitParam } = req.query as Record<string, string>;
    const limit = Math.min(parseInt(limitParam || '20', 10), 100);
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const appointments = await appointmentModel.findMany({
      where: {
        scheduledAt: { gte: now, lte: in30Days },
        status: { in: ['scheduled', 'confirmed'] },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });

    res.status(200).json({ success: true, data: appointments });
  })
);

// ─── GET /api/appointments/:id ───────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const appointmentModel = getAppointmentModel();
    validateIdParam(req.params.id, 'Appointment ID');
    const appt = await appointmentModel.findUnique({ where: { id: req.params.id } });
    if (!appt) throw new AppError('Appointment not found', 404);
    res.status(200).json({ success: true, data: appt });
  })
);

// ─── POST /api/appointments ──────────────────────────────────────────────
router.post(
  '/',
  requirePermission('manage_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const appointmentModel = getAppointmentModel();
    const {
      title,
      type,
      scheduledAt,
      durationMins,
      location,
      notes,
      clientName,
      clientEmail,
      clientPhone,
      agentId,
      propertyId,
      leadId,
    } = req.body;

    validate(req.body, {
      title: rules.requiredStringWithMax('Title', 255),
      type: rules.oneOf('Appointment type', [...VALID_TYPES]),
      location: rules.optionalStringWithMax('Location', 500),
      notes: rules.optionalStringWithMax('Notes', 2000),
      clientEmail: rules.optionalEmail('Client email'),
      agentId: rules.optionalMongoId('Agent ID'),
      propertyId: rules.optionalMongoId('Property ID'),
      leadId: rules.optionalMongoId('Lead ID'),
    });

    if (!scheduledAt) throw new AppError('scheduledAt is required', 400);

    const scheduled = new Date(scheduledAt);
    if (isNaN(scheduled.getTime())) throw new AppError('scheduledAt must be a valid date', 400);
    if (scheduled < new Date())
      throw new AppError('Appointment cannot be scheduled in the past', 400);

    const appt = await appointmentModel.create({
      data: {
        title: sanitizeString(title.trim()),
        type: type || 'viewing',
        status: 'scheduled',
        scheduledAt: scheduled,
        durationMins: durationMins
          ? Math.min(480, Math.max(15, parseInt(String(durationMins), 10)))
          : 60,
        location: location ? sanitizeString(location) : null,
        notes: notes ? sanitizeString(notes) : null,
        clientName: clientName ? sanitizeString(clientName) : null,
        clientEmail: clientEmail?.trim()?.toLowerCase() || null,
        clientPhone: clientPhone?.trim() || null,
        agentId: agentId || null,
        propertyId: propertyId || null,
        leadId: leadId || null,
        createdById: req.user?.id || null,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'appointment',
        action: 'created',
        description: `Appointment scheduled: ${appt.title} on ${scheduled.toLocaleDateString('en-AE')}`,
        userId: req.user?.id || null,
        leadId: leadId || null,
      },
    });

    res.status(201).json({ success: true, data: appt });
  })
);

// ─── PATCH /api/appointments/:id ─────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('manage_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const appointmentModel = getAppointmentModel();
    const { id } = req.params;
    validateIdParam(id, 'Appointment ID');

    const existing = await appointmentModel.findUnique({ where: { id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    const {
      title,
      type,
      status,
      scheduledAt,
      durationMins,
      location,
      notes,
      cancelReason,
      clientName,
      clientEmail,
      clientPhone,
      agentId,
      propertyId,
      leadId,
    } = req.body;

    validate(req.body, {
      title: rules.optionalStringWithMax('Title', 255),
      type: rules.oneOf('Appointment type', [...VALID_TYPES]),
      status: rules.oneOf('Status', [...VALID_STATUSES]),
      location: rules.optionalStringWithMax('Location', 500),
      notes: rules.optionalStringWithMax('Notes', 2000),
      clientEmail: rules.optionalEmail('Client email'),
      agentId: rules.optionalMongoId('Agent ID'),
      propertyId: rules.optionalMongoId('Property ID'),
      leadId: rules.optionalMongoId('Lead ID'),
    });

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = sanitizeString(String(title).trim());
    if (type !== undefined) data.type = type;
    if (status !== undefined) {
      data.status = status;
      if (status === 'completed' && !existing.completedAt) data.completedAt = new Date();
    }
    if (scheduledAt !== undefined) {
      const d = new Date(scheduledAt);
      if (isNaN(d.getTime())) throw new AppError('scheduledAt must be a valid date', 400);
      data.scheduledAt = d;
    }
    if (durationMins !== undefined) {
      data.durationMins = Math.min(480, Math.max(15, parseInt(String(durationMins), 10)));
    }
    if (location !== undefined) data.location = location ? sanitizeString(location) : null;
    if (notes !== undefined) data.notes = notes ? sanitizeString(notes) : null;
    if (cancelReason !== undefined)
      data.cancelReason = cancelReason ? sanitizeString(cancelReason) : null;
    if (clientName !== undefined) data.clientName = clientName ? sanitizeString(clientName) : null;
    if (clientEmail !== undefined) data.clientEmail = clientEmail?.trim()?.toLowerCase() || null;
    if (clientPhone !== undefined) data.clientPhone = clientPhone?.trim() || null;
    if (agentId !== undefined) data.agentId = agentId || null;
    if (propertyId !== undefined) data.propertyId = propertyId || null;
    if (leadId !== undefined) data.leadId = leadId || null;

    const updated = await appointmentModel.update({ where: { id }, data });

    const statusChanged = status !== undefined && status !== existing.status;
    if (statusChanged || scheduledAt !== undefined) {
      await prisma.activity.create({
        data: {
          type: 'appointment',
          action: scheduledAt !== undefined ? 'rescheduled' : 'status_changed',
          description:
            scheduledAt !== undefined
              ? `Appointment "${updated.title}" rescheduled to ${new Date(scheduledAt).toLocaleDateString('en-AE')}`
              : `Appointment "${updated.title}" status: ${existing.status} → ${status}`,
          userId: req.user?.id || null,
          leadId: updated.leadId || null,
        },
      });
    }

    res.status(200).json({ success: true, data: updated });
  })
);

// ─── DELETE /api/appointments/:id ────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const appointmentModel = getAppointmentModel();
    const { id } = req.params;
    validateIdParam(id, 'Appointment ID');

    const existing = await appointmentModel.findUnique({ where: { id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    await appointmentModel.delete({ where: { id } });

    res.status(200).json({ success: true, message: `Appointment "${existing.title}" deleted` });
  })
);

export default router;
