import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  API_PREFIX,
  API_V1_PREFIX,
  markLegacyApiDeprecated,
  rewriteV1ToLegacyApi,
} from './apiVersioning.js';

function createApp() {
  const app = express();
  app.use(API_V1_PREFIX, rewriteV1ToLegacyApi);
  app.use(API_PREFIX, markLegacyApiDeprecated);
  app.get('/api/leads', (_req, res) => {
    res.status(200).json({ success: true, data: [] });
  });
  return app;
}

describe('API versioning middleware', () => {
  it('serves /api/v1 routes through the compatibility layer without deprecation headers', async () => {
    const res = await request(createApp()).get('/api/v1/leads');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers.deprecation).toBeUndefined();
    expect(res.headers.link).toBeUndefined();
  });

  it('marks legacy /api routes as deprecated and advertises v1 successor path', async () => {
    const res = await request(createApp()).get('/api/leads');
    expect(res.status).toBe(200);
    expect(res.headers.deprecation).toBe('true');
    expect(res.headers.sunset).toBeDefined();
    expect(res.headers.link).toBe('</api/v1/leads>; rel="successor-version"');
  });
});
