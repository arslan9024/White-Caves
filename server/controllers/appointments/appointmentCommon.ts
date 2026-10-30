/**
 * Appointment Common Constants, Types & Google Calendar Utilities
 */

import { Request } from 'express';
import { prisma } from '../../database.js';
import type { GoogleCalendarTokenSet } from '../../services/calendar/googleCalendarService.js';

export type RouteRequest = Request<Record<string, string>>;

export const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

// Database access reference
export const db = prisma as any;

export const VALID_TYPES = ['viewing', 'meeting', 'call', 'inspection', 'signing'] as const;
export type ValidAppointmentType = (typeof VALID_TYPES)[number];

export const VALID_STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'] as const;
export type ValidAppointmentStatus = (typeof VALID_STATUSES)[number];

export const GOOGLE_CALENDAR_SETTING_KEY = 'google_calendar_tokens';

export const getStoredGoogleCalendarTokens = async (): Promise<GoogleCalendarTokenSet | null> => {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: GOOGLE_CALENDAR_SETTING_KEY },
  });
  if (!setting || typeof setting.value !== 'object' || setting.value === null) return null;
  return setting.value as unknown as GoogleCalendarTokenSet;
};

export const appendGoogleEventMetaToNotes = (
  currentNotes: string | null,
  eventId?: string | null
): string => {
  if (!eventId) return currentNotes ?? '';
  const marker = `[GoogleEvent:${eventId}]`;
  if (!currentNotes) return marker;
  return currentNotes.includes(marker) ? currentNotes : `${currentNotes}\n${marker}`;
};

