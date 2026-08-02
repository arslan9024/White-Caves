import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('@/lib/prisma', () => ({
  prisma: {},
  safeQuery: vi.fn(async (fn, fallback) => {
    try {
      return await fn({
        lead: {
          findMany: async () => [{ id: 'lead-1', name: 'Test Lead', email: 'test@whitecaves.ae' }],
          count: async () => 1,
        },
      });
    } catch {
      return fallback;
    }
  }),
}));

describe('Leads API Handlers', () => {
  it('GET /api/leads returns paginated list envelope with meta', async () => {
    const req = new NextRequest('http://localhost:3001/api/leads?page=1&limit=10');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toBeDefined();
    expect(json.meta).toBeDefined();
    expect(json.meta.page).toBe(1);
    expect(json.meta.limit).toBe(10);
  });

  it('POST /api/leads rejects invalid body with 400', async () => {
    const req = new NextRequest('http://localhost:3001/api/leads', {
      method: 'POST',
      body: 'invalid-json',
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe('INVALID_BODY');
  });

  it('POST /api/leads validates missing required name field with 422', async () => {
    const req = new NextRequest('http://localhost:3001/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@whitecaves.ae' }),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe('VALIDATION_ERROR');
  });
});
