/**
 * Agent Availability Routes — Unit Tests
 * Tests /api/agent-availability endpoints: GET by agentId, PUT single day,
 * PUT weekly, DELETE day
 * All Prisma calls and scheduling service calls are mocked.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const {
  mockPrisma,
  mockGetAgentAvailability,
  mockSetAgentAvailability,
  mockSetAgentWeeklyAvailability,
} = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      user: {
        findUnique: fn().mockResolvedValue({
          id: 'agent-aabbccddee11223344556677',
          name: 'Agent Smith',
          role: 'agent',
        }),
      },
      agentAvailability: {
        findUnique: fn().mockResolvedValue({
          id: 'avail-1',
          agentId: 'agent-aabbccddee11223344556677',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '18:00',
          isActive: true,
          slotDuration: 30,
        }),
        delete: fn().mockResolvedValue({}),
      },
    },
    mockGetAgentAvailability: fn().mockResolvedValue([
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30 },
    ]),
    mockSetAgentAvailability: fn().mockResolvedValue({
      agentId: 'user-1',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '18:00',
      isActive: true,
      slotDuration: 30,
    }),
    mockSetAgentWeeklyAvailability: fn().mockResolvedValue([
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
    ]),
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
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
vi.mock('../middleware/auth.js', () => ({ default: null }));
vi.mock('../services/schedulingService.js', () => ({
  getAgentAvailability: mockGetAgentAvailability,
  setAgentAvailability: mockSetAgentAvailability,
  setAgentWeeklyAvailability: mockSetAgentWeeklyAvailability,
}));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import agentAvailabilityRoutes from './agentAvailability';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(userId = 'user-1', role = 'agent') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'agent@whitecaves.ae', role };
    next();
  });
  app.use('/api/agent-availability', agentAvailabilityRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

function createUnauthApp() {
  const app = express();
  app.use(express.json());
  // No user attached — simulates unauthenticated request
  app.use('/api/agent-availability', agentAvailabilityRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const AGENT_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Agent Availability Routes — /api/agent-availability', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── GET /:agentId ────────────────────────────────────────────────
  describe('GET /api/agent-availability/:agentId', () => {
    it('returns agent availability schedule', async () => {
      const res = await request(createApp()).get(`/api/agent-availability/${AGENT_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('agentId');
      expect(res.body.data).toHaveProperty('schedule');
      expect(Array.isArray(res.body.data.schedule)).toBe(true);
    });

    it('returns 404 when agent not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp()).get(`/api/agent-availability/${AGENT_ID}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/agent not found/i);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await request(createUnauthApp()).get(`/api/agent-availability/${AGENT_ID}`);

      expect(res.status).toBe(401);
    });

    it('includes agent name in response', async () => {
      const res = await request(createApp()).get(`/api/agent-availability/${AGENT_ID}`);

      expect(res.body.data.agentName).toBe('Agent Smith');
    });
  });

  // ── PUT / ────────────────────────────────────────────────────────
  describe('PUT /api/agent-availability (single day)', () => {
    const validPayload = {
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '18:00',
    };

    it('sets availability for a single day', async () => {
      const res = await request(createApp()).put('/api/agent-availability').send(validPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await request(createUnauthApp())
        .put('/api/agent-availability')
        .send(validPayload);

      expect(res.status).toBe(401);
    });

    it('returns 400 when dayOfWeek is missing', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability')
        .send({ startTime: '09:00', endTime: '18:00' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/dayOfWeek/i);
    });

    it('returns 400 when startTime is missing', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability')
        .send({ dayOfWeek: 1, endTime: '18:00' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/startTime/i);
    });

    it('returns 400 when endTime is missing', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability')
        .send({ dayOfWeek: 1, startTime: '09:00' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/endTime/i);
    });

    it('returns 400 for invalid time format (startTime)', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability')
        .send({ dayOfWeek: 1, startTime: '25:00', endTime: '18:00' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/startTime/i);
    });

    it('returns 400 for invalid time format (endTime)', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability')
        .send({ dayOfWeek: 1, startTime: '09:00', endTime: '9am' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/endTime/i);
    });

    it('returns 400 for invalid breakStart format', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability')
        .send({ dayOfWeek: 1, startTime: '09:00', endTime: '18:00', breakStart: 'noon' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/breakStart/i);
    });

    it('accepts valid break times', async () => {
      const res = await request(createApp()).put('/api/agent-availability').send({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '18:00',
        breakStart: '12:30',
        breakEnd: '13:30',
      });

      expect(res.status).toBe(200);
    });
  });

  // ── PUT /weekly ──────────────────────────────────────────────────
  describe('PUT /api/agent-availability/weekly', () => {
    const validWeekly = {
      schedules: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      ],
    };

    it('sets a weekly availability schedule', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability/weekly')
        .send(validWeekly);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await request(createUnauthApp())
        .put('/api/agent-availability/weekly')
        .send(validWeekly);

      expect(res.status).toBe(401);
    });

    it('returns 400 when schedules array is missing', async () => {
      const res = await request(createApp()).put('/api/agent-availability/weekly').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/schedules/i);
    });

    it('returns 400 when schedules array is empty', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability/weekly')
        .send({ schedules: [] });

      expect(res.status).toBe(400);
    });

    it('returns 400 when more than 7 schedules provided', async () => {
      const schedules = Array.from({ length: 8 }, (_, i) => ({
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '18:00',
      }));

      const res = await request(createApp())
        .put('/api/agent-availability/weekly')
        .send({ schedules });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/maximum 7/i);
    });

    it('returns 400 when a schedule is missing dayOfWeek', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability/weekly')
        .send({ schedules: [{ startTime: '09:00', endTime: '18:00' }] });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/dayOfWeek/i);
    });

    it('returns 400 for invalid time format in weekly schedule', async () => {
      const res = await request(createApp())
        .put('/api/agent-availability/weekly')
        .send({ schedules: [{ dayOfWeek: 1, startTime: 'bad', endTime: '18:00' }] });

      expect(res.status).toBe(400);
    });
  });

  // ── DELETE /:dayOfWeek ───────────────────────────────────────────
  describe('DELETE /api/agent-availability/:dayOfWeek', () => {
    it('removes a day schedule', async () => {
      const res = await request(createApp()).delete('/api/agent-availability/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/removed/i);
    });

    it('returns 401 when unauthenticated', async () => {
      const res = await request(createUnauthApp()).delete('/api/agent-availability/1');

      expect(res.status).toBe(401);
    });

    it('returns 400 for invalid dayOfWeek (NaN)', async () => {
      const res = await request(createApp()).delete('/api/agent-availability/notanumber');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/dayOfWeek/i);
    });

    it('returns 400 for dayOfWeek > 6', async () => {
      const res = await request(createApp()).delete('/api/agent-availability/7');

      expect(res.status).toBe(400);
    });

    it('returns 404 when no availability is set for the day', async () => {
      mockPrisma.agentAvailability.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp()).delete('/api/agent-availability/3');

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/no availability/i);
    });
  });
});
