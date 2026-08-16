import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type Request, type Response, type NextFunction } from 'express';

vi.mock('./errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    code: string;
    constructor(message: string, statusCode: number, options?: { code?: string }) {
      super(message);
      this.statusCode = statusCode;
      this.code = options?.code || 'ERROR';
    }
  },
}));

import { requireDoubleSubmitCsrf, CSRF_COOKIE_NAME } from './csrf.js';

describe('CSRF Protection Middleware — Wave 43 (W43-006)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows request when cookie token matches header token', () => {
    const token = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const req = {
      cookies: { [CSRF_COOKIE_NAME]: token },
      get: vi.fn().mockReturnValue(token),
    } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    requireDoubleSubmitCsrf(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('blocks request with 403 when CSRF token is missing', () => {
    const req = { cookies: {}, get: vi.fn().mockReturnValue(undefined) } as unknown as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    requireDoubleSubmitCsrf(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: 'CSRF_TOKEN_MISSING',
      })
    );
  });
});
