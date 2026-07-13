/**
 * Error Handler Middleware — Tests
 * Tests AppError class, asyncHandler, errorHandler middleware, and error factory helpers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the logger before importing errorHandler
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

import { AppError, asyncHandler, errorHandler, errors } from './errorHandler.js';
import type { Request, Response, NextFunction } from 'express';

// ─── Helpers ────────────────────────────────────────────────────────────
function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function mockReq(overrides: Partial<Request> = {}): Request {
  return { ...overrides } as Request;
}

// ─── AppError Class ─────────────────────────────────────────────────────
describe('AppError', () => {
  it('creates an error with message and default statusCode 500', () => {
    const error = new AppError('Something failed');
    expect(error.message).toBe('Something failed');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('creates an error with custom statusCode', () => {
    const error = new AppError('Not found', 404);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
  });

  it('has a stack trace', () => {
    const error = new AppError('Test error', 400);
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('Test error');
  });

  it('sets isOperational to true', () => {
    const error = new AppError('Operational error', 422);
    expect(error.isOperational).toBe(true);
  });

  it('inherits from Error properly', () => {
    const error = new AppError('Test');
    expect(error.name).toBe('Error');
    expect(error instanceof Error).toBe(true);
  });
});

// ─── asyncHandler ───────────────────────────────────────────────────────
describe('asyncHandler', () => {
  it('calls the wrapped function with req, res, next', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('catches rejected promises and calls next with the error', async () => {
    const testError = new Error('async failure');
    const fn = vi.fn().mockRejectedValue(testError);
    const handler = asyncHandler(fn);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
  });

  it('catches errors from async functions that throw', async () => {
    const testError = new AppError('async thrown error', 400);
    const fn = vi.fn().mockImplementation(async () => {
      throw testError;
    });
    const handler = asyncHandler(fn);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
  });

  it('works with synchronous handlers that return void', async () => {
    const fn = vi.fn();
    const handler = asyncHandler(fn);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    await handler(req, res, next);

    expect(fn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

// ─── errorHandler Middleware ────────────────────────────────────────────
describe('errorHandler', () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = mockRes();
    next = vi.fn();
  });

  it('responds with 500 for a generic Error', () => {
    const err = new Error('generic failure');
    errorHandler(err, mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'generic failure',
        statusCode: 500,
      })
    );
  });

  it('responds with the AppError statusCode', () => {
    const err = new AppError('Bad request', 400);
    errorHandler(err, mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Bad request',
        statusCode: 400,
      })
    );
  });

  it('responds with 404 for Not Found errors', () => {
    const err = new AppError('Resource not found', 404);
    errorHandler(err, mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('responds with 422 for validation errors', () => {
    const err = new AppError('Validation failed', 422);
    errorHandler(err, mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('uses "Internal Server Error" as default message', () => {
    const err = { statusCode: 500 } as Error;
    err.message = '';
    errorHandler(err, mockReq(), res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal Server Error',
      })
    );
  });

  it('includes stack trace in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new AppError('dev error', 500);
    errorHandler(err, mockReq(), res, next);

    const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonArg.stack).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  it('excludes stack trace in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new AppError('prod error', 500);
    errorHandler(err, mockReq(), res, next);

    const jsonArg = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(jsonArg.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});

// ─── Error Factory Helpers ──────────────────────────────────────────────
describe('errors', () => {
  it('UNAUTHORIZED returns 401 AppError', () => {
    const err = errors.UNAUTHORIZED();
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Unauthorized');
  });

  it('FORBIDDEN returns 403 AppError', () => {
    const err = errors.FORBIDDEN();
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('Forbidden');
  });

  it('NOT_FOUND returns 404 AppError with resource name', () => {
    const err = errors.NOT_FOUND('Property');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Property not found');
  });

  it('BAD_REQUEST returns 400 AppError with custom message', () => {
    const err = errors.BAD_REQUEST('Invalid input');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Invalid input');
  });

  it('INTERNAL_SERVER_ERROR returns 500 AppError', () => {
    const err = errors.INTERNAL_SERVER_ERROR();
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe('Internal server error');
  });

  it('VALIDATION_ERROR returns 422 AppError with prefixed message', () => {
    const err = errors.VALIDATION_ERROR('Email is required');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(422);
    expect(err.message).toBe('Validation error: Email is required');
  });

  it('CONFLICT returns 409 AppError with custom message', () => {
    const err = errors.CONFLICT('Email already exists');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe('Email already exists');
  });

  it('all errors are operational', () => {
    expect(errors.UNAUTHORIZED().isOperational).toBe(true);
    expect(errors.FORBIDDEN().isOperational).toBe(true);
    expect(errors.NOT_FOUND('X').isOperational).toBe(true);
    expect(errors.BAD_REQUEST('X').isOperational).toBe(true);
    expect(errors.INTERNAL_SERVER_ERROR().isOperational).toBe(true);
    expect(errors.VALIDATION_ERROR('X').isOperational).toBe(true);
    expect(errors.CONFLICT('X').isOperational).toBe(true);
  });
});
