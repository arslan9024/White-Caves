/**
 * Appointments API Routes
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * Full CRUD for appointment scheduling (viewings, meetings, calls, signings).
 *
 * GET    /api/appointments           â€” List appointments (filtered, paginated)
 * GET    /api/appointments/upcoming  â€” Next 30 days only
 * GET    /api/appointments/:id       â€” Single appointment
 * POST   /api/appointments           â€” Create appointment
 * PATCH  /api/appointments/:id       â€” Update / reschedule / cancel
 * DELETE /api/appointments/:id       â€” Delete (admin only)
 */

import { Router, Response } from 'express';
import type { Request } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { parsePagination } from '../config/pagination.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import {
  createGoogleCalendarEvent,
  exchangeGoogleCalendarCode,
  getGoogleCalendarAuthUrl,
  type GoogleCalendarTokenSet,
} from '../services/calendar/googleCalendarService.js';
import { triggerLeadRescore } from '../services/ai/leadAutoRescore.js';

const router = Router();
const db = prisma as any;

const VALID_TYPES = ['viewing', 'meeting', 'call', 'inspection', 'signing'] as const;
const VALID_STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'] as const;

const GOOGLE_CALENDAR_SETTING_KEY = 'google_calendar_tokens';

const getStoredGoogleCalendarTokens = async (): Promise<GoogleCalendarTokenSet | null> => {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: GOOGLE_CALENDAR_SETTING_KEY },
  });
  if (!setting || typeof setting.value !== 'object' || setting.value === null) return null;
  return setting.value as unknown as GoogleCalendarTokenSet;
};

const appendGoogleEventMetaToNotes = (
  currentNotes: string | null,
  eventId?: string | null
): string => {
  if (!eventId) return currentNotes ?? '';
  const marker = `[GoogleEvent:${eventId}]`;
  if (!currentNotes) return marker;
  return currentNotes.includes(marker) ? currentNotes : `${currentNotes}\n${marker}`;
};

// â”€â”€â”€ GET /api/appointments/calendar/google/auth-url â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/calendar/google/auth-url',
  requirePermission('manage_appointments'),
  asyncHandler(async (_req: Request, res: Response) => {
    const authUrl = getGoogleCalendarAuthUrl();
    res.status(200).json({ success: true, data: { authUrl } });
  })
);

// â”€â”€â”€ GET /api/appointments/calendar/google/callback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/calendar/google/callback',
  requirePermission('manage_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;
    if (!code) throw new AppError('Missing OAuth code', 400);

    const tokens = await exchangeGoogleCalendarCode(code);
    await prisma.systemSetting.upsert({
      where: { key: GOOGLE_CALENDAR_SETTING_KEY },
      update: {
        value: tokens as unknown as Prisma.InputJsonValue,
        category: 'integrations',
        updatedBy: req.user?.id || null,
      },
      create: {
        key: GOOGLE_CALENDAR_SETTING_KEY,
        value: tokens as unknown as Prisma.InputJsonValue,
        category: 'integrations',
        updatedBy: req.user?.id || null,
      },
    });

    res.status(200).json({
      success: true,
      data: { connected: true, scope: tokens.scope ?? null, expiry: tokens.expiry_date ?? null },
    });
  })
);

// â”€â”€â”€ POST /api/appointments/:id/calendar-sync/google â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/:id/calendar-sync/google',
  requirePermission('manage_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Appointment ID');

    const appointment = await db.appointment.findUnique({ where: { id } });
    if (!appointment) throw new AppError('Appointment not found', 404);

    const tokens = await getStoredGoogleCalendarTokens();
    if (!tokens?.access_token) {
      throw new AppError('Google Calendar is not connected. Complete OAuth setup first.', 400);
    }

    const start = new Date(appointment.scheduledAt);
    const end = new Date(start.getTime() + appointment.durationMins * 60 * 1000);
    const googleEvent = await createGoogleCalendarEvent(tokens, {
      summary: appointment.title,
      description: appointment.notes || `White Caves appointment (${appointment.type})`,
      location: appointment.location || undefined,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    });

    await db.appointment.update({
      where: { id },
      data: {
        notes: appendGoogleEventMetaToNotes(appointment.notes, googleEvent.id),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        appointmentId: id,
        googleEventId: googleEvent.id ?? null,
        googleEventUrl: googleEvent.htmlLink ?? null,
      },
    });
  })
);

// â”€â”€â”€ GET /api/appointments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/',
  requirePermission('view_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
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
      db.appointment.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limit,
      }),
      db.appointment.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// â”€â”€â”€ GET /api/appointments/upcoming â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/upcoming',
  requirePermission('view_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit: limitParam } = req.query as Record<string, string>;
    const limit = Math.min(parseInt(limitParam || '20', 10), 100);
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const appointments = await db.appointment.findMany({
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

// â”€â”€â”€ GET /api/appointments/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/:id',
  requirePermission('view_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Appointment ID');
    const appt = await db.appointment.findUnique({ where: { id: req.params.id } });
    if (!appt) throw new AppError('Appointment not found', 404);
    res.status(200).json({ success: true, data: appt });
  })
);

// â”€â”€â”€ POST /api/appointments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/',
  requirePermission('manage_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
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

    const appt = await db.appointment.create({
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
    triggerLeadRescore(appt.leadId, 'appointment_created');

    res.status(201).json({ success: true, data: appt });
  })
);

// â”€â”€â”€ PATCH /api/appointments/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/:id',
  requirePermission('manage_appointments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Appointment ID');

    const existing = await db.appointment.findUnique({ where: { id } });
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

    const updated = await db.appointment.update({ where: { id }, data });

    const statusChanged = status !== undefined && status !== existing.status;
    if (statusChanged || scheduledAt !== undefined) {
      await prisma.activity.create({
        data: {
          type: 'appointment',
          action: scheduledAt !== undefined ? 'rescheduled' : 'status_changed',
          description:
            scheduledAt !== undefined
              ? `Appointment "${updated.title}" rescheduled to ${new Date(scheduledAt).toLocaleDateString('en-AE')}`
              : `Appointment "${updated.title}" status: ${existing.status} â†’ ${status}`,
          userId: req.user?.id || null,
          leadId: updated.leadId || null,
        },
      });
    }
    triggerLeadRescore(
      updated.leadId,
      statusChanged ? 'appointment_status_changed' : 'appointment_updated'
    );

    res.status(200).json({ success: true, data: updated });
  })
);

// â”€â”€â”€ DELETE /api/appointments/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Appointment ID');

    const existing = await db.appointment.findUnique({ where: { id } });
    if (!existing) throw new AppError('Appointment not found', 404);

    await db.appointment.delete({ where: { id } });
    triggerLeadRescore(existing.leadId, 'appointment_deleted');

    res.status(200).json({ success: true, message: `Appointment "${existing.title}" deleted` });
  })
);

export default router;
