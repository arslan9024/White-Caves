/**
 * Appointments API Integration Tests
 * ────────────────────────────────────
 * Tests CRUD operations, validation rules, and filters for appointment scheduling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const {
  VALID_APT_ID,
  NON_EXISTENT_ID,
  VALID_AGENT_ID,
  VALID_PROP_ID,
  VALID_LEAD_ID,
} = vi.hoisted(() => ({
  VALID_APT_ID: '507f1f77bcf86cd799439011',
  NON_EXISTENT_ID: '507f1f77bcf86cd799439099',
  VALID_AGENT_ID: '507f1f77bcf86cd799439012',
  VALID_PROP_ID: '507f1f77bcf86cd799439013',
  VALID_LEAD_ID: '507f1f77bcf86cd799439014',
}));

// Mock dependencies before importing routes
vi.mock('../database.js', () => {
  const mockAppointments = [
    {
      id: '507f1f77bcf86cd799439011',
      title: 'Viewing at DAMAC Hills 2 Villa',
      type: 'viewing',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      durationMins: 45,
      agentId: '507f1f77bcf86cd799439012',
      propertyId: '507f1f77bcf86cd799439013',
      leadId: '507f1f77bcf86cd799439014',
      location: 'DAMAC Hills 2, Dubai',
      notes: 'Client interested in 4-bedroom layout',
    },
  ];

  return {
    prisma: {
      appointment: {
        findMany: vi.fn().mockResolvedValue(mockAppointments),
        findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
          if (where.id === '507f1f77bcf86cd799439011') {
            return Promise.resolve(mockAppointments[0]);
          }
          return Promise.resolve(null);
        }),
        count: vi.fn().mockResolvedValue(1),
        create: vi.fn().mockImplementation(({ data }: { data: any }) =>
          Promise.resolve({
            id: '507f1f77bcf86cd799439022',
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        ),
        update: vi.fn().mockImplementation(({ where, data }: { where: { id: string }; data: any }) =>
          Promise.resolve({
            ...mockAppointments[0],
            ...data,
            id: where.id,
            updatedAt: new Date().toISOString(),
          })
        ),
        delete: vi.fn().mockResolvedValue(mockAppointments[0]),
      },
      activity: {
        create: vi.fn().mockResolvedValue({ id: 'act-001' }),
      },
      systemSetting: {
        findUnique: vi.fn().mockResolvedValue(null),
        upsert: vi.fn().mockResolvedValue({}),
      },
    },
  };
});

// Mock RBAC middleware so requests pass with mock user
vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (req: any, _res: any, next: any) => {
    req.user = { id: 'admin-user-01', role: 'managing_director', email: 'arslanmalikgoraha@gmail.com' };
    next();
  },
  requireRole: () => (req: any, _res: any, next: any) => {
    req.user = { id: 'admin-user-01', role: 'managing_director', email: 'arslanmalikgoraha@gmail.com' };
    next();
  },
}));

vi.mock('../services/ai/leadAutoRescore.js', () => ({
  triggerLeadRescore: vi.fn().mockResolvedValue(true),
}));

import appointmentsRouter from './appointments.js';

describe('Appointments API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/appointments', appointmentsRouter);
    app.use(errorHandler);
  });

  describe('GET /api/appointments', () => {
    it('returns a paginated list of appointments', async () => {
      const res = await request(app).get('/api/appointments?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe(VALID_APT_ID);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(1);
    });

    it('applies type and status filters correctly', async () => {
      const res = await request(app).get('/api/appointments?type=viewing&status=scheduled');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/appointments/upcoming', () => {
    it('fetches upcoming appointments in the next 30 days', async () => {
      const res = await request(app).get('/api/appointments/upcoming?limit=5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/appointments/:id', () => {
    it('returns a single appointment when 24-character ID exists', async () => {
      const res = await request(app).get(`/api/appointments/${VALID_APT_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(VALID_APT_ID);
      expect(res.body.data.title).toContain('DAMAC Hills 2');
    });

    it('returns 404 when appointment does not exist', async () => {
      const res = await request(app).get(`/api/appointments/${NON_EXISTENT_ID}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    it('returns 400 when appointment ID format is invalid', async () => {
      const res = await request(app).get('/api/appointments/invalid-id-format');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/appointments', () => {
    it('creates an appointment with valid payload and future date', async () => {
      const payload = {
        title: 'Form F Contract Signing Meeting',
        type: 'signing',
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        durationMins: 60,
        agentId: VALID_AGENT_ID,
        leadId: VALID_LEAD_ID,
        location: 'White Caves Headquarters, Dubai',
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Form F Contract Signing Meeting');
      expect(res.body.data.type).toBe('signing');
    });

    it('rejects creation when required fields are missing with 422 status', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ notes: 'Incomplete' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/appointments/:id', () => {
    it('updates status of an existing appointment', async () => {
      const res = await request(app)
        .patch(`/api/appointments/${VALID_APT_ID}`)
        .send({ status: 'confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('confirmed');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('deletes an existing appointment', async () => {
      const res = await request(app).delete(`/api/appointments/${VALID_APT_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
