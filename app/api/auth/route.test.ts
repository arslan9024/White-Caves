import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET, DELETE } from './route';

describe('Auth API Handlers', () => {
  it('POST /api/auth rejects missing email with 422', async () => {
    const req = new NextRequest('http://localhost:3001/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'secretpassword' }),
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/auth returns 401 when no token is present', async () => {
    const req = new NextRequest('http://localhost:3001/api/auth');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe('UNAUTHORIZED');
  });

  it('DELETE /api/auth clears auth cookie and returns 200', async () => {
    const res = await DELETE();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe('Logged out');
  });
});
