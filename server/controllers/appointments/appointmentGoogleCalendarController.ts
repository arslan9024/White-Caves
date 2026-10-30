/**
 * Appointment Google Calendar Integration Controller
 * Handles Google Calendar OAuth exchange, callback, and appointment synchronization.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import {
  createGoogleCalendarEvent,
  exchangeGoogleCalendarCode,
  getGoogleCalendarAuthUrl,
} from '../../services/calendar/googleCalendarService.js';
import {
  RouteRequest,
  db,
  GOOGLE_CALENDAR_SETTING_KEY,
  getStoredGoogleCalendarTokens,
  appendGoogleEventMetaToNotes,
} from './appointmentCommon.js';

export const getGoogleAuthUrl = async (_req: RouteRequest, res: Response): Promise<void> => {
  const authUrl = getGoogleCalendarAuthUrl();
  res.status(200).json({ success: true, data: { authUrl } });
};

export const handleGoogleCallback = async (req: RouteRequest, res: Response): Promise<void> => {
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
};

export const syncGoogleCalendarEvent = async (req: RouteRequest, res: Response): Promise<void> => {
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
};

