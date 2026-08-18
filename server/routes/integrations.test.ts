/**
 * External AI Integrations Gateway API Integration Tests
 * ─────────────────────────────────────────────────────────
 * Tests health checks, status queries, and configuration introspection
 * for external AI modules (Linda & Henry).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../services/integrations/externalModulesService.js', () => ({
  externalModulesService: {
    getConfig: vi.fn().mockReturnValue({ lindaEnabled: true, henryEnabled: true }),
    getLindaHealth: vi.fn().mockResolvedValue({ ok: true, version: '1.2.0' }),
    getLindaModuleStatus: vi.fn().mockResolvedValue({ activeJobs: 0, memoryUsageMb: 85 }),
    getHenryHealth: vi.fn().mockResolvedValue({ ok: true, version: '2.0.1' }),
    getHenryArchive: vi.fn().mockResolvedValue([{ id: 'arch-1', title: 'Q2 Deal Logs' }]),
  },
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

import integrationsRouter from './integrations.js';

describe('External Integrations Gateway API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/integrations', integrationsRouter);
  });

  describe('GET /api/integrations/status', () => {
    it('returns combined health and configuration for all external modules', async () => {
      const res = await request(app).get('/api/integrations/status');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.linda.ok).toBe(true);
      expect(res.body.data.henry.ok).toBe(true);
      expect(res.body.data.config.lindaEnabled).toBe(true);
    });
  });

  describe('GET /api/integrations/linda/health', () => {
    it('returns Linda module health probe', async () => {
      const res = await request(app).get('/api/integrations/linda/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.version).toBe('1.2.0');
    });
  });

  describe('GET /api/integrations/henry/archive', () => {
    it('returns Henry archive dataset', async () => {
      const res = await request(app).get('/api/integrations/henry/archive');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].id).toBe('arch-1');
    });
  });
});
