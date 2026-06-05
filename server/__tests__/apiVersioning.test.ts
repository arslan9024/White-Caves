import express from 'express';
import { describe, expect, it } from 'vitest';
import {
  API_PREFIX,
  API_V1_PREFIX,
  createV1CompatibilityProxy,
  markLegacyApiDeprecated,
} from '../middleware/apiVersioning.js';

function createApp() {
  const app = express();
  app.use(API_V1_PREFIX, createV1CompatibilityProxy(app));
  app.use(API_PREFIX, markLegacyApiDeprecated);
  app.get('/api/leads', (_req, res) => {
    res.status(200).json({ success: true, data: [] });
  });
  return app;
}

async function requestJson(path: string) {
  const app = createApp();
  const server = await new Promise<import('http').Server>(resolve => {
    const s = app.listen(0, () => resolve(s));
  });
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  try {
    const res = await fetch(`http://127.0.0.1:${port}${path}`);
    const raw = await res.text();
    const body = (() => {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    })();
    return { status: res.status, headers: res.headers, body };
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
  }
}

describe('API versioning middleware', () => {
  it('serves /api/v1 routes through the compatibility layer without deprecation headers', async () => {
    const res = await requestJson('/api/v1/leads');
    expect(res.status).toBe(200);
    expect(typeof res.body === 'object' && res.body !== null && 'success' in res.body).toBe(true);
    expect((res.body as { success: boolean }).success).toBe(true);
    expect(res.headers.get('deprecation')).toBeNull();
    expect(res.headers.get('link')).toBeNull();
  });

  it('marks legacy /api routes as deprecated and advertises v1 successor path', async () => {
    const res = await requestJson('/api/leads');
    expect(res.status).toBe(200);
    expect(res.headers.get('deprecation')).toBe('true');
    expect(res.headers.get('sunset')).toBeTruthy();
    expect(res.headers.get('link')).toBe('</api/v1/leads>; rel="successor-version"');
  });
});
