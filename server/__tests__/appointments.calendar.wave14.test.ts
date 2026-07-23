/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const {
  mockPrisma,
  triggerLeadRescore,
  getGoogleCalendarAuthUrl,
  exchangeGoogleCalendarCode,
  createGoogleCalendarEvent,
} = vi.hoisted(() => ({
  mockPrisma: {
    appointment: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    systemSetting: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
  },
  triggerLeadRescore: vi.fn(),
  getGoogleCalendarAuthUrl: vi.fn(() => 'https://accounts.google.com/o/oauth2/auth'),
  exchangeGoogleCalendarCode: vi.fn(async () => ({
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    expiry_date: Date.now() + 3600_000,
  })),
  createGoogleCalendarEvent: vi.fn(async () => ({
    id: 'google-event-1',
    htmlLink: 'https://calendar.google.com/event?eid=123',
  })),
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/ai/leadAutoRescore.js', () => ({ triggerLeadRescore }));
vi.mock('../services/calendar/googleCalendarService.js', () => ({
  getGoogleCalendarAuthUrl,
  exchangeGoogleCalendarCode,
  createGoogleCalendarEvent,
}));
vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));
vi.mock('../middleware/errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../utils/sanitize.js', () => ({ sanitizeString: (s: string) => s }));
vi.mock('../utils/validate.js', () => ({
  validate: vi.fn(),
  rules: {
    optionalStringWithMax: () => ({}),
    oneOf: () => ({}),
    optionalEmail: () => ({}),
    optionalMongoId: () => ({}),
    requiredStringWithMax: () => ({}),
  },
  validateIdParam: (id: string, label: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      const err = new Error(`${label} must be a valid 24-character hex string`);
      (err as any).statusCode = 400;
      throw err;
    }
  },
}));
vi.mock('../config/pagination.js', () => ({
  parsePagination: () => ({ page: 1, limit: 20, skip: 0 }),
}));

import appointmentsRoutes from '../routes/appointments.js';

const VALID_ID = 'aabbccddee11223344556677';

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', role: 'owner', email: 'owner@whitecaves.ae' };
    next();
  });
  app.use('/api/appointments', appointmentsRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
};

describe('Appointments routes — wave 14 calendar sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.systemSetting.findUnique.mockResolvedValue(null);
    mockPrisma.systemSetting.upsert.mockResolvedValue({});
    mockPrisma.appointment.findUnique.mockResolvedValue({
      id: VALID_ID,
      title: 'Client Viewing',
      type: 'viewing',
      notes: 'Bring brochure',
      location: 'Downtown Dubai',
      scheduledAt: new Date('2026-06-10T10:00:00.000Z'),
      durationMins: 60,
      leadId: 'lead-1',
    });
    mockPrisma.appointment.update.mockResolvedValue({});
    mockPrisma.appointment.delete.mockResolvedValue({});
  });

  it('returns Google auth URL', async () => {
    const res = await request(createApp()).get('/api/appointments/calendar/google/auth-url');
    expect(res.status).toBe(200);
    expect(res.body.data.authUrl).toContain('google.com');
  });

  it('returns 400 on callback when code is missing', async () => {
    const res = await request(createApp()).get('/api/appointments/calendar/google/callback');
    expect(res.status).toBe(400);
  });

  it('stores OAuth tokens on callback', async () => {
    const res = await request(createApp()).get('/api/appointments/calendar/google/callback?code=abc123');
    expect(res.status).toBe(200);
    expect(exchangeGoogleCalendarCode).toHaveBeenCalledWith('abc123');
    expect(mockPrisma.systemSetting.upsert).toHaveBeenCalled();
  });

  it('returns 400 when Google Calendar is not connected', async () => {
    mockPrisma.systemSetting.findUnique.mockResolvedValueOnce(null);
    const res = await request(createApp()).post(`/api/appointments/${VALID_ID}/calendar-sync/google`);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not connected/i);
  });

  it('syncs appointment and stores Google event marker', async () => {
    mockPrisma.systemSetting.findUnique.mockResolvedValueOnce({
      key: 'google_calendar_tokens',
      value: {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      },
    });
    const res = await request(createApp()).post(`/api/appointments/${VALID_ID}/calendar-sync/google`);
    expect(res.status).toBe(200);
    expect(createGoogleCalendarEvent).toHaveBeenCalled();
    expect(mockPrisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: VALID_ID },
        data: expect.objectContaining({
          notes: expect.stringContaining('[GoogleEvent:google-event-1]'),
        }),
      })
    );
  });

  it('triggers lead rescore when appointment is deleted', async () => {
    const res = await request(createApp()).delete(`/api/appointments/${VALID_ID}`);
    expect(res.status).toBe(200);
    expect(triggerLeadRescore).toHaveBeenCalledWith('lead-1', 'appointment_deleted');
  });
});
