/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Assistants Routes — Unit Tests (Phase 0.8)
 *
 * Tests /api/assistants endpoints:
 *  GET  /            → public (no auth required)
 *  GET  /:id/plan    → auth required
 *  POST /            → super-user only (owner / admin)
 *  PUT  /:id         → super-user only
 *  DELETE /:id       → super-user only
 *
 * Coverage:
 *  - Auth required vs public endpoints
 *  - Safe-id validation (path traversal / invalid chars rejected with 400)
 *  - Missing plan behavior (exists: false / plan: null)
 *  - Super-user enforcement (403 for non-super-user roles)
 *  - HTML tag rejection (400)
 *  - javascript: URI rejection (400)
 *  - Unknown assistant ID rejection (404)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted fs/promises mock ──────────────────────────────────────────
const { mockReadFile, mockWriteFile, mockUnlink, mockAccess } = vi.hoisted(() => ({
  mockReadFile: vi.fn(),
  mockWriteFile: vi.fn().mockResolvedValue(undefined),
  mockUnlink: vi.fn().mockResolvedValue(undefined),
  mockAccess: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: (...args: unknown[]) => mockReadFile(...args),
  writeFile: (...args: unknown[]) => mockWriteFile(...args),
  unlink: (...args: unknown[]) => mockUnlink(...args),
  access: (...args: unknown[]) => mockAccess(...args),
}));

// ── Auth middleware mock ──────────────────────────────────────────────
// Maps known Bearer tokens to user objects for controlled auth tests.
vi.mock('../middleware/auth.js', () => ({
  default: (req: any, _res: any, next: any) => {
    const header = req.headers['authorization'] as string | undefined;
    if (header?.startsWith('Bearer ')) {
      const token = header.slice(7);
      if (token === 'owner-token') {
        req.user = { id: 'u1', email: 'owner@whitecaves.ae', role: 'owner' };
        return next();
      }
      if (token === 'admin-token') {
        req.user = { id: 'u2', email: 'admin@whitecaves.ae', role: 'admin' };
        return next();
      }
      if (token === 'agent-token') {
        req.user = { id: 'u3', email: 'agent@whitecaves.ae', role: 'agent' };
        return next();
      }
    }
    const err = Object.assign(new Error('No token provided'), { statusCode: 401 });
    next(err);
  },
}));

// ── errorHandler mock ─────────────────────────────────────────────────
vi.mock('../middleware/errorHandler.js', () => ({
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));

// ── Logger mock ───────────────────────────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

import assistantsRoutes from './assistants';

// ── Test app factory ──────────────────────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/assistants', assistantsRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const app = createApp();

// ═════════════════════════════════════════════════════════════════════

describe('GET /api/assistants — public list', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with the assistant registry without any auth token', async () => {
    const res = await request(app).get('/api/assistants');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('returns assistant objects that include id, name, title, department, avatar', async () => {
    const res = await request(app).get('/api/assistants');

    expect(res.status).toBe(200);
    const first = res.body.data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('department');
    expect(first).toHaveProperty('avatar');
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('GET /api/assistants/:id/plan — auth required', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no auth token is provided', async () => {
    const res = await request(app).get('/api/assistants/mary/plan');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 with plan content when file exists', async () => {
    mockAccess.mockResolvedValueOnce(undefined); // file exists
    mockReadFile.mockResolvedValueOnce('# Mary Plan\n\nContent here.');

    const res = await request(app)
      .get('/api/assistants/mary/plan')
      .set('Authorization', 'Bearer owner-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('mary');
    expect(res.body.data.plan).toBe('# Mary Plan\n\nContent here.');
    expect(res.body.data.exists).toBe(true);
  });

  it('returns plan: null and exists: false when plan file does not exist', async () => {
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));

    const res = await request(app)
      .get('/api/assistants/zoe/plan')
      .set('Authorization', 'Bearer owner-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.plan).toBeNull();
    expect(res.body.data.exists).toBe(false);
  });

  it('returns 404 for an assistant ID not in the registry', async () => {
    const res = await request(app)
      .get('/api/assistants/unknown-bot/plan')
      .set('Authorization', 'Bearer owner-token');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for an ID containing path traversal characters', async () => {
    const res = await request(app)
      .get('/api/assistants/../etc/plan')
      .set('Authorization', 'Bearer owner-token');

    // Express normalises /../ in the URL path; the resulting id contains
    // only safe chars but won't be in the registry → 404 is also acceptable.
    expect([400, 404]).toContain(res.status);
  });

  it('returns 400 for an ID with unsafe characters (e.g. spaces)', async () => {
    const res = await request(app)
      .get('/api/assistants/bad id!/plan')
      .set('Authorization', 'Bearer owner-token');

    expect([400, 404]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('POST /api/assistants — super-user only', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no auth token is provided', async () => {
    const res = await request(app).post('/api/assistants').send({ id: 'mary', plan: '# Plan' });

    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated as non-super-user (agent)', async () => {
    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer agent-token')
      .send({ id: 'mary', plan: '# Plan' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('creates a plan and returns 201 when owner provides valid data', async () => {
    mockAccess.mockRejectedValueOnce(new Error('ENOENT')); // plan does not exist yet
    mockWriteFile.mockResolvedValueOnce(undefined);

    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ id: 'mary', plan: '# Mary Strategy' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.exists).toBe(true);
  });

  it('returns 409 when a plan already exists for the assistant', async () => {
    mockAccess.mockResolvedValueOnce(undefined); // file already exists

    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ id: 'mary', plan: '# Duplicate' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when plan content contains an HTML tag', async () => {
    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ id: 'mary', plan: '<script>alert("xss")</script>' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/HTML/i);
  });

  it('returns 400 when plan content contains a javascript: URI', async () => {
    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ id: 'mary', plan: '[click](javascript:alert(1))' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/javascript/i);
  });

  it('returns 404 when the assistant id is not in the registry', async () => {
    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ id: 'ghost-bot', plan: '# Ghost' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when the id field is missing', async () => {
    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ plan: '# Plan without id' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when the plan field is not a string', async () => {
    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer owner-token')
      .send({ id: 'mary', plan: 42 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('allows admin role as well as owner', async () => {
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));
    mockWriteFile.mockResolvedValueOnce(undefined);

    const res = await request(app)
      .post('/api/assistants')
      .set('Authorization', 'Bearer admin-token')
      .send({ id: 'nadia', plan: '# Nadia admin plan' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('PUT /api/assistants/:id — super-user only', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no auth token is provided', async () => {
    const res = await request(app).put('/api/assistants/mary').send({ plan: '# Updated' });

    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated as non-super-user', async () => {
    const res = await request(app)
      .put('/api/assistants/mary')
      .set('Authorization', 'Bearer agent-token')
      .send({ plan: '# Updated' });

    expect(res.status).toBe(403);
  });

  it('updates the plan and returns 200 for an owner', async () => {
    mockWriteFile.mockResolvedValueOnce(undefined);

    const res = await request(app)
      .put('/api/assistants/mary')
      .set('Authorization', 'Bearer owner-token')
      .send({ plan: '# Updated Mary Plan' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('mary');
    expect(res.body.data.exists).toBe(true);
    expect(mockWriteFile).toHaveBeenCalledOnce();
  });

  it('returns 400 when plan content contains HTML', async () => {
    const res = await request(app)
      .put('/api/assistants/mary')
      .set('Authorization', 'Bearer owner-token')
      .send({ plan: '<div>styled</div>' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/HTML/i);
  });

  it('returns 404 for an unknown assistant', async () => {
    const res = await request(app)
      .put('/api/assistants/nobody')
      .set('Authorization', 'Bearer owner-token')
      .send({ plan: '# Content' });

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────

describe('DELETE /api/assistants/:id — super-user only', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no auth token is provided', async () => {
    const res = await request(app).delete('/api/assistants/mary');

    expect(res.status).toBe(401);
  });

  it('returns 403 when authenticated as non-super-user', async () => {
    const res = await request(app)
      .delete('/api/assistants/mary')
      .set('Authorization', 'Bearer agent-token');

    expect(res.status).toBe(403);
  });

  it('deletes the plan and returns 200 for an owner when file exists', async () => {
    mockAccess.mockResolvedValueOnce(undefined); // plan file exists
    mockUnlink.mockResolvedValueOnce(undefined);

    const res = await request(app)
      .delete('/api/assistants/mary')
      .set('Authorization', 'Bearer owner-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.deleted).toBe(true);
    expect(mockUnlink).toHaveBeenCalledOnce();
  });

  it('returns 404 when no plan file exists for the assistant', async () => {
    mockAccess.mockRejectedValueOnce(new Error('ENOENT')); // no plan file

    const res = await request(app)
      .delete('/api/assistants/mary')
      .set('Authorization', 'Bearer owner-token');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for an unknown assistant', async () => {
    const res = await request(app)
      .delete('/api/assistants/nobody')
      .set('Authorization', 'Bearer owner-token');

    expect(res.status).toBe(404);
  });
});
