/**
 * API Response Helpers — Tests
 * Tests sendSuccess, sendCreated, sendError, and buildPagination.
 */

import { describe, it, expect, vi } from 'vitest';
import { sendSuccess, sendCreated, sendError, buildPagination } from './apiResponse';
import type { Response } from 'express';

// ─── Helpers ────────────────────────────────────────────────────────────
function mockRes(): Response & {
  _status: number;
  _body: unknown;
} {
  const res = {
    _status: 0,
    _body: null,
    status: vi.fn().mockImplementation(function (this: typeof res, code: number) {
      this._status = code;
      return this;
    }),
    json: vi.fn().mockImplementation(function (this: typeof res, body: unknown) {
      this._body = body;
      return this;
    }),
  };
  return res as unknown as Response & { _status: number; _body: unknown };
}

// ─── sendSuccess ────────────────────────────────────────────────────────
describe('sendSuccess', () => {
  it('sends 200 with success format by default', () => {
    const res = mockRes();
    const data = { id: '1', name: 'Test Property' };

    sendSuccess(res, data);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'OK',
      data,
    });
  });

  it('uses custom message', () => {
    const res = mockRes();
    sendSuccess(res, null, 'Properties retrieved');

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Properties retrieved',
      data: null,
    });
  });

  it('uses custom status code', () => {
    const res = mockRes();
    sendSuccess(res, {}, 'OK', 202);

    expect(res.status).toHaveBeenCalledWith(202);
  });

  it('includes pagination when provided', () => {
    const res = mockRes();
    const pagination = { page: 1, pageSize: 10, total: 50, totalPages: 5 };

    sendSuccess(res, [{ id: '1' }], 'OK', 200, pagination);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'OK',
      data: [{ id: '1' }],
      pagination: { page: 1, pageSize: 10, total: 50, totalPages: 5 },
    });
  });

  it('omits pagination when not provided', () => {
    const res = mockRes();
    sendSuccess(res, []);

    const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(body).not.toHaveProperty('pagination');
  });

  it('works with different data types', () => {
    const res = mockRes();

    // Array
    sendSuccess(res, [1, 2, 3]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: [1, 2, 3] })
    );

    // String
    const res2 = mockRes();
    sendSuccess(res2, 'hello');
    expect(res2.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: 'hello' })
    );

    // Null
    const res3 = mockRes();
    sendSuccess(res3, null);
    expect(res3.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: null })
    );
  });
});

// ─── sendCreated ────────────────────────────────────────────────────────
describe('sendCreated', () => {
  it('sends 201 with "Created" message by default', () => {
    const res = mockRes();
    const data = { id: 'new-1', name: 'New Lead' };

    sendCreated(res, data);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Created',
      data,
    });
  });

  it('uses custom message', () => {
    const res = mockRes();
    sendCreated(res, { id: '1' }, 'Lead created successfully');

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Lead created successfully' })
    );
  });
});

// ─── sendError ──────────────────────────────────────────────────────────
describe('sendError', () => {
  it('sends error response with correct status', () => {
    const res = mockRes();
    sendError(res, 404, 'Property not found');

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Property not found',
    });
  });

  it('sends 400 for bad request', () => {
    const res = mockRes();
    sendError(res, 400, 'Invalid request body');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid request body',
    });
  });

  it('sends 500 for internal error', () => {
    const res = mockRes();
    sendError(res, 500, 'Internal server error');

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('sends 401 for unauthorized', () => {
    const res = mockRes();
    sendError(res, 401, 'Unauthorized');

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized',
    });
  });

  it('sends 422 for validation error', () => {
    const res = mockRes();
    sendError(res, 422, 'Validation failed: email is required');

    expect(res.status).toHaveBeenCalledWith(422);
  });
});

// ─── buildPagination ────────────────────────────────────────────────────
describe('buildPagination', () => {
  it('builds correct pagination metadata', () => {
    const result = buildPagination(1, 10, 50);
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      total: 50,
      totalPages: 5,
    });
  });

  it('calculates totalPages correctly with remainder', () => {
    const result = buildPagination(1, 10, 53);
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      total: 53,
      totalPages: 6, // ceil(53/10) = 6
    });
  });

  it('handles single page', () => {
    const result = buildPagination(1, 25, 10);
    expect(result).toEqual({
      page: 1,
      pageSize: 25,
      total: 10,
      totalPages: 1,
    });
  });

  it('handles zero total', () => {
    const result = buildPagination(1, 10, 0);
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it('handles large datasets', () => {
    const result = buildPagination(5, 20, 1000);
    expect(result).toEqual({
      page: 5,
      pageSize: 20,
      total: 1000,
      totalPages: 50,
    });
  });

  it('guards against zero/negative pageSize', () => {
    // pageSize 0 should be treated as 1 (guards division by zero)
    const result = buildPagination(1, 0, 50);
    expect(result.pageSize).toBe(1);
    expect(result.totalPages).toBe(50);
  });

  it('guards against negative pageSize', () => {
    const result = buildPagination(1, -5, 50);
    expect(result.pageSize).toBe(1);
    expect(result.totalPages).toBe(50);
  });

  it('preserves exact page number passed', () => {
    const result = buildPagination(3, 10, 100);
    expect(result.page).toBe(3);
  });
});
