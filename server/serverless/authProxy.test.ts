import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createAuthProxy } from './authProxy.js';

describe('same-origin auth proxy', () => {
  it('forwards credentials and preserves upstream auth cookies', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'set-cookie': 'refresh_token=rotated; Path=/api/auth; HttpOnly; SameSite=Strict',
        },
      })
    );
    const app = express();
    app.use(express.json());
    app.use('/api/auth', createAuthProxy('https://api.example.test', fetcher));

    const response = await request(app)
      .post('/api/auth/login')
      .set('cookie', 'csrf_token=csrf; refresh_token=old')
      .set('x-csrf-token', 'csrf')
      .set('x-forwarded-host', 'attacker.example.test')
      .send({ email: 'agent@example.test' });

    expect(response.status).toBe(200);
    expect(fetcher).toHaveBeenCalledWith(
      new URL('https://api.example.test/api/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'agent@example.test' }),
      })
    );
    const forwardedHeaders = new Headers(fetcher.mock.calls[0][1]?.headers);
    expect(forwardedHeaders.get('cookie')).toBe('csrf_token=csrf; refresh_token=old');
    expect(forwardedHeaders.get('x-csrf-token')).toBe('csrf');
    expect(forwardedHeaders.get('x-forwarded-host')).toBeNull();
    expect(response.headers['set-cookie']).toContain(
      'refresh_token=rotated; Path=/api/auth; HttpOnly; SameSite=Strict'
    );
  });

  it('fails closed when no backend origin is configured', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const app = express();
    app.use('/api/auth', createAuthProxy(undefined, fetcher));

    const response = await request(app).post('/api/auth/refresh').send({});

    expect(response.status).toBe(503);
    expect(response.body.error).toBe('Authentication backend is not configured');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('rejects insecure or path-scoped backend origins in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const app = express();
    app.use('/api/auth', createAuthProxy('http://api.example.test'));

    const response = await request(app).post('/api/auth/refresh').send({});
    expect(response.status).toBe(503);
  });

  it('returns an explicit gateway error when upstream authentication fails', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('connection refused'));
    const app = express();
    app.use('/api/auth', createAuthProxy('https://api.example.test', fetcher));

    const response = await request(app).get('/api/auth/profile');

    expect(response.status).toBe(502);
    expect(response.body.error).toBe('Authentication service is temporarily unavailable');
  });
});
