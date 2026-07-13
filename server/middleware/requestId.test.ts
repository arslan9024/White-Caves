/**
 * Request ID Middleware — Tests
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requestIdMiddleware } from './requestId.js';

function mockReq(xRequestId?: string): Request {
  return {
    headers: xRequestId ? { 'x-request-id': xRequestId } : {},
  } as unknown as Request;
}

function mockRes(): { headers: Record<string, string>; setHeader: ReturnType<typeof vi.fn> } {
  const headers: Record<string, string> = {};
  return {
    headers,
    setHeader: vi.fn((name: string, value: string) => {
      // eslint-disable-next-line security/detect-object-injection
      headers[name] = value;
    }),
  };
}

describe('requestIdMiddleware', () => {
  it('generates a UUID when no X-Request-ID header is present', () => {
    const req = mockReq();
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(req.requestId).toBeDefined();
    expect(typeof req.requestId).toBe('string');
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    expect(req.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // no error
  });

  it('echoes the generated UUID back in X-Request-ID response header', () => {
    const req = mockReq();
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', req.requestId);
    expect(res.headers['X-Request-ID']).toBe(req.requestId);
  });

  it('accepts a valid incoming X-Request-ID header', () => {
    const incomingId = 'my-proxy-request-id-12345';
    const req = mockReq(incomingId);
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(req.requestId).toBe(incomingId);
    expect(res.headers['X-Request-ID']).toBe(incomingId);
  });

  it('accepts a UUID-style incoming X-Request-ID', () => {
    const incomingId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
    const req = mockReq(incomingId);
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(req.requestId).toBe(incomingId);
  });

  it('rejects an X-Request-ID with invalid characters (replaces with new UUID)', () => {
    const maliciousId = '<script>alert(1)</script>';
    const req = mockReq(maliciousId);
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(req.requestId).not.toBe(maliciousId);
    expect(req.requestId).not.toContain('<');
    expect(req.requestId).not.toContain('>');
  });

  it('rejects a header injection attempt (newlines)', () => {
    const injectionId = 'valid\r\nX-Injected: evil';
    const req = mockReq(injectionId);
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(req.requestId).not.toBe(injectionId);
    expect(req.requestId).not.toContain('\r');
    expect(req.requestId).not.toContain('\n');
  });

  it('rejects a header value exceeding 128 characters', () => {
    const longId = 'a'.repeat(129);
    const req = mockReq(longId);
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    // Must fall back to a new UUID
    expect(req.requestId).not.toBe(longId);
    expect(req.requestId.length).toBeLessThanOrEqual(36); // UUID v4 length
  });

  it('accepts a header value of exactly 128 characters', () => {
    const maxLengthId = 'a'.repeat(128);
    const req = mockReq(maxLengthId);
    const res = mockRes();
    const next: NextFunction = vi.fn();

    requestIdMiddleware(req, res as unknown as Response, next);

    expect(req.requestId).toBe(maxLengthId);
  });

  it('generates unique IDs for concurrent requests', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const req = mockReq();
      const res = mockRes();
      const next: NextFunction = vi.fn();
      requestIdMiddleware(req, res as unknown as Response, next);
      ids.add(req.requestId);
    }
    expect(ids.size).toBe(50);
  });

  it('calls next() without an error argument in all cases', () => {
    const cases = [undefined, 'valid-id', '<invalid>', 'a'.repeat(200)];
    for (const id of cases) {
      const req = mockReq(id);
      const res = mockRes();
      const next: NextFunction = vi.fn();
      requestIdMiddleware(req, res as unknown as Response, next);
      expect(next).toHaveBeenCalledWith(); // called with no arguments (no error)
    }
  });
});
