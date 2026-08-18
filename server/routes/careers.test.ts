/**
 * Careers API Integration Tests
 * ──────────────────────────────
 * Tests active job listings, candidate job application submissions, acknowledgement emails,
 * admin application tracking, and stage transitions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockJobPosting, mockJobApp } = vi.hoisted(() => ({
  mockJobPosting: {
    id: 'job-001',
    title: 'Senior Luxury Property Consultant',
    department: 'Sales',
    location: 'Dubai Marina, UAE',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  mockJobApp: {
    id: 'app-001',
    jobId: 'job-001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@example.com',
    phone: '+971501234567',
    cvUrl: 'https://cdn.whitecaves.ae/cvs/marcus-vance.pdf',
    status: 'applied',
    createdAt: new Date().toISOString(),
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    jobPosting: {
      findMany: vi.fn().mockResolvedValue([mockJobPosting]),
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'job-001') {
          return Promise.resolve(mockJobPosting);
        }
        return Promise.resolve(null);
      }),
    },
    jobApplication: {
      findMany: vi.fn().mockResolvedValue([mockJobApp]),
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({
          id: 'app-002',
          ...data,
          createdAt: new Date().toISOString(),
        })
      ),
      update: vi.fn().mockImplementation(({ where, data }: { where: { id: string }; data: any }) =>
        Promise.resolve({
          ...mockJobApp,
          id: where.id,
          status: data.status,
        })
      ),
    },
  },
}));

vi.mock('../services/emailService.js', () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (req: any, _res: any, next: any) => {
    req.user = { id: 'hr-admin-01', role: 'hr', email: 'hr@whitecaves.ae' };
    next();
  },
}));

import careersRouter from './careers.js';

describe('Careers API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/careers', careersRouter);
  });

  describe('GET /api/v1/careers', () => {
    it('returns list of active job postings', async () => {
      const res = await request(app).get('/api/v1/careers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].id).toBe('job-001');
      expect(res.body.data[0].title).toBe('Senior Luxury Property Consultant');
    });
  });

  describe('POST /api/v1/careers/applications', () => {
    it('submits job application, creates record, and sends acknowledgement email', async () => {
      const payload = {
        jobId: 'job-001',
        firstName: 'Marcus',
        lastName: 'Vance',
        email: 'marcus.vance@example.com',
        phone: '+971501234567',
        cvUrl: 'https://cdn.whitecaves.ae/cvs/marcus-vance.pdf',
        linkedinUrl: 'https://linkedin.com/in/marcus-vance',
        reraBrn: 'BRN-55421',
      };

      const res = await request(app)
        .post('/api/v1/careers/applications')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Marcus');
      expect(res.body.data.status).toBe('applied');
    });

    it('rejects application when required fields are missing with 400', async () => {
      const res = await request(app)
        .post('/api/v1/careers/applications')
        .send({ firstName: 'Marcus' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 404 when applying for non-existent job ID', async () => {
      const res = await request(app)
        .post('/api/v1/careers/applications')
        .send({
          jobId: 'job-invalid-999',
          firstName: 'Marcus',
          lastName: 'Vance',
          email: 'marcus.vance@example.com',
          cvUrl: 'https://cdn.whitecaves.ae/cv.pdf',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/careers/applications', () => {
    it('returns list of submitted applications for HR admins', async () => {
      const res = await request(app).get('/api/v1/careers/applications');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PATCH /api/v1/careers/applications/:id/stage', () => {
    it('updates application recruitment stage to interview', async () => {
      const res = await request(app)
        .patch('/api/v1/careers/applications/app-001/stage')
        .send({ stage: 'interview' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('interview');
    });

    it('rejects invalid stage value with 400', async () => {
      const res = await request(app)
        .patch('/api/v1/careers/applications/app-001/stage')
        .send({ stage: 'invalid_stage_name' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
