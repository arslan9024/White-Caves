/**
 * Client Error Logging API Integration Tests
 * ───────────────────────────────────────────
 * Tests client error intake, validation, file logging, error statistics,
 * and error log retrieval.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import errorsRouter from './errors.js';

describe('Client Error Logging API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/errors', errorsRouter);
  });

  describe('POST /api/errors/log', () => {
    it('logs client error payload and returns 200 with errorId', async () => {
      const res = await request(app)
        .post('/api/errors/log')
        .send({
          errorId: 'ERR-2026-001',
          message: 'Failed to load high-res floor plan GLTF',
          componentStack: 'at VirtualTourViewer (VirtualTourViewer.tsx:42)',
          environment: 'staging',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.errorId).toBe('ERR-2026-001');
    });

    it('rejects payload missing message with 400', async () => {
      const res = await request(app)
        .post('/api/errors/log')
        .send({ errorId: 'ERR-2026-002' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/errors/list', () => {
    it('returns error log listings array', async () => {
      const res = await request(app).get('/api/errors/list?days=1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe('GET /api/errors/stats', () => {
    it('returns aggregated client error statistics', async () => {
      const res = await request(app).get('/api/errors/stats?days=1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toBeDefined();
    });
  });
});
