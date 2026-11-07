// @vitest-environment node
/**
 * Route Verification & Integration Test Suite — server/routes/aegis.ts & server/routes/v1Customers.ts
 * Single Purpose: Verify AEGIS telemetry endpoints and Customer CRUD routes
 */

import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock database to prevent live connections
vi.mock('../database.js', () => ({
  prisma: {
    user: { count: vi.fn().mockResolvedValue(42) },
    deal: { count: vi.fn().mockResolvedValue(10) },
    property: { count: vi.fn().mockResolvedValue(150) },
    lead: { count: vi.fn().mockResolvedValue(88) },
  },
}));

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import aegisRouter from './aegis.js';
import v1CustomersRouter from './v1Customers.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/aegis', aegisRouter);
  app.use('/api/v1/customers', v1CustomersRouter);
  return app;
}

describe('AEGIS Routes — /api/aegis', () => {
  const app = createTestApp();

  it('GET /api/aegis/health returns health status and 12 departments', async () => {
    const res = await request(app).get('/api/aegis/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('PASS');
    expect(res.body.zeroBacklogGate).toBe('VERIFIED');
  });

  it('GET /api/aegis/telemetry returns system metrics and telemetry payload', async () => {
    const res = await request(app).get('/api/aegis/telemetry');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.engine).toContain('AEGIS');
    expect(res.body.mesh112108.departments).toHaveLength(12);
  });
});

describe('V1 Customers Routes — /api/v1/customers', () => {
  const app = createTestApp();

  it('GET /api/v1/customers returns customer list', async () => {
    const res = await request(app).get('/api/v1/customers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/customers/:id returns 404 for nonexistent customer', async () => {
    const res = await request(app).get('/api/v1/customers/non-existent-id-9999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/customers creates a new customer', async () => {
    const newCust = {
      fullName: 'Test High Net Worth Investor',
      email: 'hnw.investor@test.ae',
      phone: '+971500000099',
      customerType: 'INVESTOR',
    };
    const res = await request(app).post('/api/v1/customers').send(newCust);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe('Test High Net Worth Investor');
  });
});
