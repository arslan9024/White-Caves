/**
 * Job Applications API Integration Tests
 * ──────────────────────────────────────
 * Tests public application submission, email validation, HR paginated listings,
 * and recruitment status transitions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockApplication } = vi.hoisted(() => ({
  mockApplication: {
    id: 'app-101',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@example.com',
    phone: '+971509988776',
    position: 'Luxury Off-Plan Sales Specialist',
    experience: '8 years in Dubai prime real estate',
    coverLetter: 'Extensive track record with Emaar and DAMAC developments.',
    status: 'received',
    createdAt: new Date().toISOString(),
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    jobApplication: {
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({
          id: 'app-102',
          name: data.name,
          position: data.position,
          status: 'received',
          createdAt: new Date().toISOString(),
        })
      ),
      findMany: vi.fn().mockResolvedValue([mockApplication]),
      count: vi.fn().mockResolvedValue(1),
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'app-101') {
          return Promise.resolve(mockApplication);
        }
        return Promise.resolve(null);
      }),
      update: vi.fn().mockImplementation(({ where, data }: { where: { id: string }; data: any }) =>
        Promise.resolve({
          ...mockApplication,
          ...data,
          id: where.id,
        })
      ),
    },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: 'admin-01', role: 'managing_director', email: 'director@whitecaves.ae' };
    next();
  },
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

import jobApplicationsRouter from './jobApplications.js';

describe('Job Applications API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/job-applications', jobApplicationsRouter);
    app.use(errorHandler);
  });

  describe('POST /api/job-applications', () => {
    it('submits a new public job application and returns 201', async () => {
      const payload = {
        name: 'Tariq Al-Mansoor',
        email: 'tariq.mansoor@example.com',
        phone: '+971509988776',
        position: 'Luxury Off-Plan Sales Specialist',
        experience: '8 years in Dubai prime real estate',
        coverLetter: 'Extensive track record with Emaar and DAMAC developments.',
      };

      const res = await request(app)
        .post('/api/job-applications')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Tariq Al-Mansoor');
      expect(res.body.data.position).toBe('Luxury Off-Plan Sales Specialist');
      expect(res.body.data.status).toBe('received');
    });

    it('rejects submission when email format is invalid with 400', async () => {
      const payload = {
        name: 'Tariq Al-Mansoor',
        email: 'invalid-email-without-at',
        position: 'Luxury Off-Plan Sales Specialist',
      };

      const res = await request(app)
        .post('/api/job-applications')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects submission when applicant name is missing with 400', async () => {
      const res = await request(app)
        .post('/api/job-applications')
        .send({ email: 'tariq@example.com', position: 'Consultant' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/job-applications', () => {
    it('lists applications with pagination and filters', async () => {
      const res = await request(app).get('/api/job-applications?page=1&pageSize=10&status=received');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].id).toBe('app-101');
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('PATCH /api/job-applications/:id', () => {
    it('updates application recruitment status to shortlisted', async () => {
      const res = await request(app)
        .patch('/api/job-applications/app-101')
        .send({ status: 'shortlisted', notes: 'Strong candidate for Palm Jumeirah team.' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('shortlisted');
    });

    it('rejects update with 400 when status is invalid', async () => {
      const res = await request(app)
        .patch('/api/job-applications/app-101')
        .send({ status: 'unknown_status' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 404 when application does not exist', async () => {
      const res = await request(app)
        .patch('/api/job-applications/app-non-existent')
        .send({ status: 'interview' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
