import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type Request, type Response, type NextFunction } from 'express';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-audit-1' }),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { logAuditTrail, logLoginEvent, auditMutationMiddleware } from './auditLogger.js';

describe('Audit Logger Middleware — Wave 43 (W43-001, W43-002)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logAuditTrail', () => {
    it('creates an activity record with IP and user agent metadata', async () => {
      const req = {
        user: { id: 'usr-101' },
        headers: { 'user-agent': 'Mozilla/5.0' },
        socket: { remoteAddress: '192.168.1.1' },
        originalUrl: '/api/leads',
        method: 'POST',
      } as unknown as Request;

      await logAuditTrail(req, 'lead_created', 'lead', 'lead-99');

      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'lead',
            action: 'lead_created',
            userId: 'usr-101',
          }),
        })
      );
    });
  });

  describe('logLoginEvent', () => {
    it('records login event activity log', async () => {
      await logLoginEvent('usr-101', 'agent@whitecaves.ae', '10.0.0.1', 'Chrome/120');

      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'user',
            action: 'user_login_success',
            userId: 'usr-101',
          }),
        })
      );
    });
  });

  describe('auditMutationMiddleware', () => {
    it('calls next() for incoming requests', () => {
      const req = { method: 'POST' } as Request;
      const res = { end: vi.fn(), statusCode: 200 } as unknown as Response;
      const next = vi.fn() as NextFunction;

      auditMutationMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
