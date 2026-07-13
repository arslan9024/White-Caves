/**
 * Server-side Pagination Constants
 * =================================
 * Centralized pagination defaults and limits for all API routes.
 * Import and use these instead of hardcoding pagination values.
 *
 * Usage:
 *   import { PAGINATION } from '../config/pagination.js';
 *   const page = parseInt(req.query.page as string) || 1;
 *   const limit = Math.min(parseInt(req.query.limit as string) || PAGINATION.DEFAULT_PAGE_SIZE, PAGINATION.MAX_PAGE_SIZE);
 *   const skip = (page - 1) * limit;
 */

export const PAGINATION = {
  /** Default number of items per page */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum allowed items per page (prevents abuse) */
  MAX_PAGE_SIZE: 100,
  /** Minimum page number */
  MIN_PAGE: 1,
} as const;

/**
 * Parse and validate pagination parameters from query string
 */
export function parsePagination(query: { page?: string; limit?: string }) {
  const page = Math.max(PAGINATION.MIN_PAGE, parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(
    Math.max(1, parseInt(query.limit || String(PAGINATION.DEFAULT_PAGE_SIZE), 10) || PAGINATION.DEFAULT_PAGE_SIZE),
    PAGINATION.MAX_PAGE_SIZE
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
