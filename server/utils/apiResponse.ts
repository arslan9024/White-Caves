/**
 * Standardized API Response Helpers
 * Ensures consistent response format across all endpoints.
 *
 * Success: { success: true, message, data, pagination? }
 * Error:   { success: false, error }
 */

import { Response } from 'express';

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Send a success response with consistent structure
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
  pagination?: PaginationMeta
): void {
  const body: Record<string, unknown> = {
    success: true,
    message,
    data,
  };
  if (pagination) {
    body.pagination = pagination;
  }
  res.status(statusCode).json(body);
}

/**
 * Send a created (201) response
 */
export function sendCreated<T>(res: Response, data: T, message = 'Created'): void {
  sendSuccess(res, data, message, 201);
}

/**
 * Send an error response with consistent structure
 */
export function sendError(res: Response, statusCode: number, error: string): void {
  res.status(statusCode).json({
    success: false,
    error,
  });
}

/**
 * Build pagination metadata from query params and total count
 */
export function buildPagination(page: number, pageSize: number, total: number): PaginationMeta {
  const safePageSize = Math.max(1, pageSize || 1);
  return {
    page,
    pageSize: safePageSize,
    total,
    totalPages: Math.ceil(total / safePageSize),
  };
}
