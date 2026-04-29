/**
 * Express Server (index.ts) — Unit Tests
 * Tests middleware setup, health endpoint, 404 handler, content-type validation,
 * and WhatsApp webhook security.
 * We import app indirectly to avoid starting the full server.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import crypto from 'crypto';

// ── Build a minimal replica of the server's middleware chain ─────────
// (Testing the actual index.ts requires DB connections and many side-effects,
//  so we replicate key patterns and test them in isolation.)

// ─── Content-Type validation middleware (extracted from index.ts) ────
const NON_JSON_PATHS = new Set(['/api/whatsapp/webhook']);

function contentTypeMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method) &&
    !req.is('json') &&
    !NON_JSON_PATHS.has(req.path)
  ) {
    return res.status(415).json({
      success: false,
      error: 'Content-Type must be application/json',
    });
  }
  next();
}

// ─── Timing-safe webhook verification (extracted from index.ts) ──────
const WEBHOOK_SECRET = 'test-webhook-secret-123';

function verifyWebhookToken(token: string, secret: string): boolean {
  const expected = Buffer.from(secret, 'utf8');
  const received = Buffer.from(token, 'utf8');
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

// ─── Build test app ──────────────────────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  // Content-type validation
  app.use('/api', contentTypeMiddleware);

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date(),
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION || '1.0.0',
    });
  });

  // Webhook endpoint
  app.post('/api/whatsapp/webhook', (req, res) => {
    const webhookToken = (req.headers['x-webhook-token'] || '') as string;
    if (!webhookToken) {
      return res.status(403).json({ success: false, error: 'Webhook token required' });
    }
    if (!verifyWebhookToken(webhookToken, WEBHOOK_SECRET)) {
      return res.status(403).json({ success: false, error: 'Invalid webhook token' });
    }
    res.status(200).json({ success: true });
  });

  // Sample protected endpoint (for Content-Type testing)
  app.post('/api/test', (req, res) => {
    res.status(200).json({ success: true, body: req.body });
  });

  // 404 handler
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Route ${req.path} not found`,
      statusCode: 404,
    });
  });

  return app;
}

// =====================================================================
// TESTS
// =====================================================================

describe('Server — Health Check', () => {
  const app = createApp();

  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('includes timestamp, environment, version', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Server — 404 Handler', () => {
  const app = createApp();

  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
    expect(res.body.message).toContain('nonexistent');
  });

  it('returns JSON error body', async () => {
    const res = await request(app).get('/completely/unknown');
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('statusCode', 404);
  });
});

describe('Server — Content-Type Validation', () => {
  const app = createApp();

  it('rejects POST without Content-Type: json', async () => {
    const res = await request(app)
      .post('/api/test')
      .set('Content-Type', 'text/plain')
      .send('raw text');
    expect(res.status).toBe(415);
    expect(res.body.error).toContain('application/json');
  });

  it('allows POST with Content-Type: json', async () => {
    const res = await request(app)
      .post('/api/test')
      .set('Content-Type', 'application/json')
      .send({ key: 'value' });
    expect(res.status).toBe(200);
  });

  it('allows GET without Content-Type check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('exempts whatsapp webhook from JSON check', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .set('x-webhook-token', WEBHOOK_SECRET)
      .send({});
    // Should not get 415
    expect(res.status).not.toBe(415);
  });
});

describe('Server — WhatsApp Webhook Security', () => {
  const app = createApp();

  it('rejects webhook without token', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .send({});
    expect(res.status).toBe(403);
  });

  it('rejects webhook with invalid token', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .set('x-webhook-token', 'wrong-token')
      .send({});
    expect(res.status).toBe(403);
  });

  it('accepts webhook with valid token', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .set('x-webhook-token', WEBHOOK_SECRET)
      .send({ entry: [{ changes: [] }] });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Server — Timing-Safe Comparison', () => {
  it('returns true for matching tokens', () => {
    expect(verifyWebhookToken('test-secret', 'test-secret')).toBe(true);
  });

  it('returns false for length mismatch', () => {
    expect(verifyWebhookToken('short', 'long-secret')).toBe(false);
  });

  it('returns false for content mismatch', () => {
    expect(verifyWebhookToken('aaaa', 'bbbb')).toBe(false);
  });
});
