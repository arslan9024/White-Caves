import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

describe('Edge Auth Middleware', () => {
  it('allows access to unprotected routes without token', () => {
    const req = new NextRequest('http://localhost:3001/properties');
    const res = middleware(req);
    expect(res.status).toBe(200);
  });

  it('redirects unauthenticated access to /crm/leads to homepage with redirect param', () => {
    const req = new NextRequest('http://localhost:3001/crm/leads');
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('redirect=%2Fcrm%2Fleads');
  });

  it('allows authenticated access to /crm/leads when wc_token cookie is present', () => {
    const req = new NextRequest('http://localhost:3001/crm/leads', {
      headers: { cookie: 'wc_token=valid-jwt-token' },
    });
    const res = middleware(req);
    expect(res.status).toBe(200);
  });
});
