/**
 * Scheduling Service — Phase 3C
 * ──────────────────────────────
 * Agent availability management, viewing slot computation,
 * conflict detection, .ics calendar file generation, and
 * viewing reminder scheduling.
 *
 * Features:
 * - Agent availability CRUD (weekly schedule with breaks)
 * - Available slot computation (respects bookings + breaks)
 * - Double-booking conflict detection
 * - .ics (iCalendar) file generation for viewing events
 * - Automated reminder scheduling (24h + 1h before)
 *
 * @module schedulingService
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

// ─── Types ───────────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string;   // ISO 8601 datetime
  end: string;     // ISO 8601 datetime
  available: boolean;
  reason?: string; // Why unavailable (e.g., "booked", "break", "outside_hours")
}

export interface AgentSchedule {
  dayOfWeek: number;     // 0-6
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  isActive: boolean;
  slotDuration: number;  // minutes
  breakStart?: string;   // HH:mm
  breakEnd?: string;     // HH:mm
}

export interface ViewingConflict {
  hasConflict: boolean;
  conflictingViewings: Array<{
    id: string;
    scheduledAt: Date;
    duration: number;
    propertyId: string;
    status: string;
  }>;
  message?: string;
}

export interface ICSEvent {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  organizer?: { name: string; email: string };
  attendees?: Array<{ name: string; email: string }>;
  uid: string;
  url?: string;
}

// ─── Default Agent Schedule (Sun-Thu, Dubai business hours) ─────────────

const DEFAULT_SCHEDULE: AgentSchedule[] = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30, breakStart: '12:30', breakEnd: '13:30' },  // Sunday
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30, breakStart: '12:30', breakEnd: '13:30' },  // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30, breakStart: '12:30', breakEnd: '13:30' },  // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30, breakStart: '12:30', breakEnd: '13:30' },  // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30, breakStart: '12:30', breakEnd: '13:30' },  // Thursday
  { dayOfWeek: 5, startTime: '10:00', endTime: '14:00', isActive: false, slotDuration: 30 },  // Friday (UAE weekend)
  { dayOfWeek: 6, startTime: '10:00', endTime: '16:00', isActive: false, slotDuration: 30 },  // Saturday (UAE weekend)
];

// ─── Helper Functions ────────────────────────────────────────────────────

/**
 * Parse "HH:mm" string to minutes since midnight.
 */
function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Format minutes since midnight to "HH:mm" string.
 */
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Set time on a date using "HH:mm" string (in UTC+4 / Gulf Standard Time).
 * Returns a UTC Date object with the correct GST time.
 */
function setTimeOnDate(date: Date, timeStr: string): Date {
  const result = new Date(date);
  const [h, m] = timeStr.split(':').map(Number);
  result.setUTCHours(h - 4, m, 0, 0); // GST = UTC+4
  return result;
}

/**
 * Generate a unique ICS token for calendar download authentication.
 */
export function generateIcsToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

// ─── Agent Availability ──────────────────────────────────────────────────

/**
 * Get agent's weekly availability schedule.
 * Returns stored schedule or default Dubai-business-hours schedule.
 */
export async function getAgentAvailability(agentId: string): Promise<AgentSchedule[]> {
  const stored = await prisma.agentAvailability.findMany({
    where: { agentId },
    orderBy: { dayOfWeek: 'asc' },
  });

  if (stored.length === 0) {
    return DEFAULT_SCHEDULE;
  }

  return stored.map((s) => ({
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
    isActive: s.isActive,
    slotDuration: s.slotDuration,
    breakStart: s.breakStart ?? undefined,
    breakEnd: s.breakEnd ?? undefined,
  }));
}

/**
 * Set agent's availability for a specific day of the week.
 * Upserts: creates if not exists, updates if it does.
 */
export async function setAgentAvailability(
  agentId: string,
  schedule: AgentSchedule,
): Promise<AgentSchedule> {
  // Validate
  if (schedule.dayOfWeek < 0 || schedule.dayOfWeek > 6) {
    throw new Error('dayOfWeek must be 0-6 (Sunday-Saturday)');
  }
  const startMin = parseTimeToMinutes(schedule.startTime);
  const endMin = parseTimeToMinutes(schedule.endTime);
  if (startMin >= endMin) {
    throw new Error('startTime must be before endTime');
  }
  if (schedule.breakStart && schedule.breakEnd) {
    const breakStartMin = parseTimeToMinutes(schedule.breakStart);
    const breakEndMin = parseTimeToMinutes(schedule.breakEnd);
    if (breakStartMin >= breakEndMin) {
      throw new Error('breakStart must be before breakEnd');
    }
    if (breakStartMin < startMin || breakEndMin > endMin) {
      throw new Error('break must be within working hours');
    }
  }

  const result = await prisma.agentAvailability.upsert({
    where: { agentId_dayOfWeek: { agentId, dayOfWeek: schedule.dayOfWeek } },
    create: {
      agentId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive,
      slotDuration: schedule.slotDuration || 30,
      breakStart: schedule.breakStart || null,
      breakEnd: schedule.breakEnd || null,
    },
    update: {
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive,
      slotDuration: schedule.slotDuration || 30,
      breakStart: schedule.breakStart || null,
      breakEnd: schedule.breakEnd || null,
    },
  });

  return {
    dayOfWeek: result.dayOfWeek,
    startTime: result.startTime,
    endTime: result.endTime,
    isActive: result.isActive,
    slotDuration: result.slotDuration,
    breakStart: result.breakStart ?? undefined,
    breakEnd: result.breakEnd ?? undefined,
  };
}

/**
 * Set agent's full weekly availability (bulk upsert all 7 days).
 */
export async function setAgentWeeklyAvailability(
  agentId: string,
  schedules: AgentSchedule[],
): Promise<AgentSchedule[]> {
  const results: AgentSchedule[] = [];
  for (const schedule of schedules) {
    results.push(await setAgentAvailability(agentId, schedule));
  }
  return results;
}

// ─── Slot Computation ────────────────────────────────────────────────────

/**
 * Get available viewing slots for a specific agent on a specific date.
 *
 * Algorithm:
 * 1. Get agent's availability for that day of week
 * 2. Generate all possible slots based on schedule
 * 3. Remove slots overlapping with break time
 * 4. Remove slots overlapping with existing bookings
 * 5. Remove slots in the past
 */
export async function getAvailableSlots(
  agentId: string,
  date: Date,
  duration?: number,
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getUTCDay(); // 0=Sunday
  const agentSchedule = await getAgentAvailability(agentId);
  const daySchedule = agentSchedule.find((s) => s.dayOfWeek === dayOfWeek);

  if (!daySchedule || !daySchedule.isActive) {
    return []; // Agent doesn't work this day
  }

  const slotDuration = duration || daySchedule.slotDuration || 30;
  const startMin = parseTimeToMinutes(daySchedule.startTime);
  const endMin = parseTimeToMinutes(daySchedule.endTime);

  // Generate all possible slots
  const allSlots: TimeSlot[] = [];
  for (let min = startMin; min + slotDuration <= endMin; min += slotDuration) {
    const slotStart = setTimeOnDate(date, minutesToTime(min));
    const slotEnd = setTimeOnDate(date, minutesToTime(min + slotDuration));

    allSlots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      available: true,
    });
  }

  // Mark break slots as unavailable
  if (daySchedule.breakStart && daySchedule.breakEnd) {
    const breakStartMin = parseTimeToMinutes(daySchedule.breakStart);
    const breakEndMin = parseTimeToMinutes(daySchedule.breakEnd);

    for (const slot of allSlots) {
      const slotMin = parseTimeToMinutes(
        new Date(slot.start).toISOString().slice(11, 16),
      );
      // Recalculate from GST perspective
      const slotStartGST = new Date(slot.start).getUTCHours() * 60 + new Date(slot.start).getUTCMinutes() + 240; // +4h for GST
      if (slotStartGST >= breakStartMin && slotStartGST < breakEndMin) {
        slot.available = false;
        slot.reason = 'break';
      }
    }
  }

  // Get existing bookings for this agent on this date
  const dayStart = new Date(date);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setUTCHours(23, 59, 59, 999);

  const existingViewings = await prisma.viewing.findMany({
    where: {
      OR: [
        { agentId },
        { userId: agentId },
      ],
      scheduledAt: { gte: dayStart, lte: dayEnd },
      status: { in: ['scheduled', 'confirmed'] },
    },
    select: { scheduledAt: true, duration: true },
  });

  // Mark booked slots as unavailable
  for (const slot of allSlots) {
    if (!slot.available) continue; // Already marked (break)

    const slotStart = new Date(slot.start).getTime();
    const slotEnd = new Date(slot.end).getTime();

    for (const booking of existingViewings) {
      const bookingStart = booking.scheduledAt.getTime();
      const bookingEnd = bookingStart + booking.duration * 60 * 1000;

      // Check overlap: slots overlap if one starts before the other ends
      if (slotStart < bookingEnd && slotEnd > bookingStart) {
        slot.available = false;
        slot.reason = 'booked';
        break;
      }
    }
  }

  // Mark past slots as unavailable
  const now = Date.now();
  for (const slot of allSlots) {
    if (new Date(slot.start).getTime() <= now) {
      slot.available = false;
      slot.reason = slot.reason || 'past';
    }
  }

  return allSlots;
}

// ─── Conflict Detection ──────────────────────────────────────────────────

/**
 * Check for scheduling conflicts for a proposed viewing.
 * Checks both agent and client calendars.
 */
export async function detectConflicts(
  agentId: string | null,
  userId: string,
  scheduledAt: Date,
  duration: number = 30,
  excludeViewingId?: string,
): Promise<ViewingConflict> {
  const proposedStart = scheduledAt.getTime();
  const proposedEnd = proposedStart + duration * 60 * 1000;

  // Buffer time: 15 min before and after for travel
  const bufferMs = 15 * 60 * 1000;
  const searchStart = new Date(proposedStart - bufferMs);
  const searchEnd = new Date(proposedEnd + bufferMs);

  const whereConditions: Array<Record<string, unknown>> = [
    { userId },
  ];
  if (agentId) {
    whereConditions.push({ agentId });
  }

  const existingViewings = await prisma.viewing.findMany({
    where: {
      OR: whereConditions,
      scheduledAt: { gte: searchStart, lte: searchEnd },
      status: { in: ['scheduled', 'confirmed'] },
      ...(excludeViewingId ? { NOT: { id: excludeViewingId } } : {}),
    },
    select: {
      id: true,
      scheduledAt: true,
      duration: true,
      propertyId: true,
      status: true,
    },
  });

  // Check actual time overlap (not just buffer overlap)
  const conflicts = existingViewings.filter((v) => {
    const vStart = v.scheduledAt.getTime();
    const vEnd = vStart + v.duration * 60 * 1000;
    return proposedStart < vEnd && proposedEnd > vStart;
  });

  if (conflicts.length > 0) {
    return {
      hasConflict: true,
      conflictingViewings: conflicts,
      message: `Conflict detected: ${conflicts.length} overlapping viewing(s) found. Consider rescheduling.`,
    };
  }

  // Check buffer violations (warn, don't block)
  const bufferViolations = existingViewings.filter((v) => {
    const vStart = v.scheduledAt.getTime();
    const vEnd = vStart + v.duration * 60 * 1000;
    return (
      (proposedStart >= vEnd && proposedStart < vEnd + bufferMs) ||
      (proposedEnd > vStart - bufferMs && proposedEnd <= vStart)
    );
  });

  if (bufferViolations.length > 0) {
    return {
      hasConflict: false,
      conflictingViewings: [],
      message: `Warning: ${bufferViolations.length} viewing(s) within 15-minute buffer. Allow extra travel time.`,
    };
  }

  return { hasConflict: false, conflictingViewings: [] };
}

// ─── .ics Calendar Generation ────────────────────────────────────────────

/**
 * Generate an .ics (iCalendar) file content for a viewing.
 * RFC 5545 compliant.
 */
export function generateICSContent(event: ICSEvent): string {
  const formatDate = (d: Date): string =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//White Caves//Viewing Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.startTime)}`,
    `DTEND:${formatDate(event.endTime)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
  ];

  if (event.organizer) {
    lines.push(
      `ORGANIZER;CN=${escapeICSText(event.organizer.name)}:mailto:${event.organizer.email}`,
    );
  }

  if (event.attendees) {
    for (const attendee of event.attendees) {
      lines.push(
        `ATTENDEE;ROLE=REQ-PARTICIPANT;CN=${escapeICSText(attendee.name)}:mailto:${attendee.email}`,
      );
    }
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  // Add reminders: 1 hour and 15 minutes before
  lines.push(
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Viewing reminder - 1 hour',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Viewing reminder - 15 minutes',
    'END:VALARM',
  );

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Escape special characters for ICS text fields.
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate ICS content for a viewing record from the database.
 */
export async function generateViewingICS(viewingId: string): Promise<string> {
  const viewing = await prisma.viewing.findUnique({
    where: { id: viewingId },
    include: {
      property: { select: { id: true, title: true, location: true, type: true } },
      user: { select: { name: true, email: true } },
      agent: { select: { name: true, email: true } },
    },
  });

  if (!viewing) {
    throw new Error('Viewing not found');
  }

  const endTime = new Date(
    viewing.scheduledAt.getTime() + viewing.duration * 60 * 1000,
  );

  const attendees: Array<{ name: string; email: string }> = [];
  if (viewing.user) {
    attendees.push({
      name: viewing.user.name || 'Client',
      email: viewing.user.email,
    });
  }
  if (viewing.agent) {
    attendees.push({
      name: viewing.agent.name || 'Agent',
      email: viewing.agent.email,
    });
  }

  const event: ICSEvent = {
    title: `Property Viewing: ${viewing.property?.title || 'Unknown Property'}`,
    description: [
      `Property: ${viewing.property?.title || 'N/A'}`,
      `Type: ${viewing.type}`,
      `Duration: ${viewing.duration} minutes`,
      viewing.notes ? `Notes: ${viewing.notes}` : '',
      '',
      'Powered by White Caves Real Estate CRM',
    ]
      .filter(Boolean)
      .join('\\n'),
    location: viewing.location || viewing.property?.location || 'TBD',
    startTime: viewing.scheduledAt,
    endTime,
    uid: `viewing-${viewing.id}@whitecaves.ae`,
    attendees,
  };

  if (attendees.length > 0) {
    event.organizer = attendees[attendees.length - 1]; // Agent or last attendee
  }

  return generateICSContent(event);
}

// ─── Viewing Reminder Scheduler ──────────────────────────────────────────

/**
 * Process upcoming viewing reminders.
 * Sends reminders for viewings happening in:
 * - 24 hours (first reminder)
 * - 1 hour (final reminder)
 *
 * Called by a cron job or scheduler.
 */
export async function processViewingReminders(): Promise<{
  sent: number;
  errors: number;
}> {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Find viewings needing reminders (within 1h or 24h window, not yet reminded)
  const viewingsNeedingReminder = await prisma.viewing.findMany({
    where: {
      status: { in: ['scheduled', 'confirmed'] },
      reminderSent: false,
      scheduledAt: {
        gte: now,
        lte: twentyFourHoursFromNow,
      },
    },
    include: {
      property: { select: { title: true, location: true } },
      user: { select: { name: true, email: true, phone: true } },
      agent: { select: { name: true, email: true, phone: true } },
    },
    take: 50, // Process in batches
  });

  let sent = 0;
  let errors = 0;

  for (const viewing of viewingsNeedingReminder) {
    try {
      const isUrgent = viewing.scheduledAt.getTime() <= oneHourFromNow.getTime();
      const timeLabel = isUrgent ? '1 hour' : '24 hours';

      logger.info('Sending viewing reminder', {
        viewingId: viewing.id,
        timeLabel,
        scheduledAt: viewing.scheduledAt.toISOString(),
        userName: viewing.user?.name,
        propertyTitle: viewing.property?.title,
      });

      // Try to send email notification
      try {
        const { sendEmailTracked, wrapInBrandedTemplate } = await import('./emailService.js');
        const emailBody = wrapInBrandedTemplate(`
          <h2 style="color: #c9a84c;">Viewing Reminder</h2>
          <p>Your property viewing is in <strong>${timeLabel}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold;">Property:</td><td style="padding: 8px;">${viewing.property?.title || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${viewing.location || viewing.property?.location || 'TBD'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${viewing.scheduledAt.toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Duration:</td><td style="padding: 8px;">${viewing.duration} minutes</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Type:</td><td style="padding: 8px;">${viewing.type.replace('_', ' ')}</td></tr>
          </table>
          <p style="margin-top: 16px; color: #666;">Please arrive 5 minutes early. Contact your agent if you need to reschedule.</p>
        `);

        if (viewing.user?.email) {
          await sendEmailTracked({
            to: viewing.user.email,
            subject: `Viewing Reminder: ${viewing.property?.title || 'Property Viewing'} in ${timeLabel}`,
            html: emailBody,
            tags: [{ name: 'type', value: 'viewing_reminder' }],
          });
        }
      } catch (emailError) {
        logger.warn('Failed to send viewing email reminder', { viewingId: viewing.id, error: emailError });
      }

      // Mark reminder as sent
      await prisma.viewing.update({
        where: { id: viewing.id },
        data: { reminderSent: true },
      });

      sent++;
    } catch (error) {
      logger.error('Failed to process viewing reminder', { viewingId: viewing.id, error });
      errors++;
    }
  }

  if (sent > 0 || errors > 0) {
    logger.info('Viewing reminders processed', { sent, errors, total: viewingsNeedingReminder.length });
  }

  return { sent, errors };
}

/**
 * Start the viewing reminder scheduler.
 * Checks every 15 minutes for viewings needing reminders.
 */
export function startViewingReminderScheduler(): NodeJS.Timeout {
  logger.info('Starting viewing reminder scheduler (every 15 min)');

  const interval = setInterval(async () => {
    try {
      await processViewingReminders();
    } catch (error) {
      logger.error('Viewing reminder scheduler error', { error });
    }
  }, 15 * 60 * 1000); // 15 minutes

  // Run once on startup (after 30s delay)
  setTimeout(() => {
    processViewingReminders().catch((err) =>
      logger.error('Initial viewing reminder check failed', { error: err }),
    );
  }, 30_000);

  return interval;
}
