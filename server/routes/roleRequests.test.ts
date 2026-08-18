/**
 * Role Requests API Integration Tests
 * ────────────────────────────────────
 * Tests self-service role elevation requests, pending checks, admin listing,
 * approvals with automatic role updates, and rejections with review notes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockRoleRequest } = vi.hoisted(() => ({
  mockRoleRequest: {
    id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    currentRole: 'agent',
    requestedRole: 'senior_agent',
    reason: 'Exceeded sales target by 200% this quarter.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    roleRequest: {
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({
          id: '507f1f77bcf86cd799439011',
          ...data,
          createdAt: new Date().toISOString(),
        })
      ),
      findMany: vi.fn().mockResolvedValue([mockRoleRequest]),
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === '507f1f77bcf86cd799439011') {
          return Promise.resolve(mockRoleRequest);
        }
        return Promise.resolve(null);
      }),
      update: vi.fn().mockImplementation(({ where, data }: { where: { id: string }; data: any }) =>
        Promise.resolve({
          ...mockRoleRequest,
          ...data,
          id: where.id,
        })
      ),
    },
    user: {
      findMany: vi.fn().mockResolvedValue([
        { id: '507f1f77bcf86cd799439012', name: 'Elena Rostova', email: 'elena@whitecaves.ae', role: 'agent' },
      ]),
      update: vi.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439012', role: 'senior_agent' }),
    },
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-001' }),
    },
  },
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));

import { roleRequestRouter, adminRoleRequestRouter } from './roleRequests.js';

describe('Role Requests API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Attach mock user
    app.use((req: any, _res: any, next: any) => {
      req.user = { id: '507f1f77bcf86cd799439012', role: 'agent', email: 'agent@whitecaves.ae' };
      next();
    });
    app.use('/api/users/role-request', roleRequestRouter);
    app.use('/api/admin/role-requests', adminRoleRequestRouter);
    app.use(errorHandler);
  });

  describe('POST /api/users/role-request', () => {
    it('submits a role elevation request and returns 201', async () => {
      const payload = {
        requestedRole: 'senior_agent',
        reason: 'Exceeded sales target by 200% this quarter.',
      };

      const res = await request(app)
        .post('/api/users/role-request')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.requestedRole).toBe('senior_agent');
    });

    it('rejects request when requestedRole is invalid with 400', async () => {
      const payload = {
        requestedRole: 'super_admin_unauthorized',
      };

      const res = await request(app)
        .post('/api/users/role-request')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/role-requests', () => {
    it('lists all role requests with requester metadata', async () => {
      const res = await request(app).get('/api/admin/role-requests');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.requests)).toBe(true);
      expect(res.body.data.requests[0].requestedRole).toBe('senior_agent');
    });
  });

  describe('POST /api/admin/role-requests/:id/approve', () => {
    it('approves role request and updates user role', async () => {
      const res = await request(app)
        .post('/api/admin/role-requests/507f1f77bcf86cd799439011/approve')
        .send({ reviewNote: 'Promotion approved by MD.' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('approved');
    });
  });

  describe('POST /api/admin/role-requests/:id/reject', () => {
    it('rejects role request with review note', async () => {
      const res = await request(app)
        .post('/api/admin/role-requests/507f1f77bcf86cd799439011/reject')
        .send({ reason: 'Requires 6 additional months of tenure.' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('rejected');
    });
  });
});
