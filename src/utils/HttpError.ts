/**
 * Unified HTTP Error Class
 * ────────────────────────
 * Single source of truth for HTTP errors thrown by apiClient and authFetch.
 * Extends Error with HTTP-specific metadata for structured error handling.
 *
 * Usage:
 *   import { HttpError } from '@/utils/HttpError';
 *
 *   throw new HttpError('Not found', 404, 'Not Found');
 *   throw new HttpError('Server error', 500, 'Internal Server Error', { detail: '...' });
 *
 *   // In catch blocks:
 *   if (error instanceof HttpError) {
 *     console.log(error.status);     // 404
 *     console.log(error.statusText); // 'Not Found'
 *     console.log(error.data);       // { detail: '...' } or null
 *   }
 */

export class HttpError extends Error {
  /** HTTP status code (e.g. 401, 404, 500). Defaults to 500. */
  readonly status: number;

  /** HTTP status text (e.g. 'Not Found', 'Unauthorized'). Defaults to ''. */
  readonly statusText: string;

  /** Response payload for structured introspection. Defaults to null. */
  readonly data: unknown;

  /**
   * Convenience accessor matching Axios error shape.
   * Allows `error.response.status` and `error.response.data` patterns.
   */
  readonly response: { status: number; statusText: string; data: unknown };

  constructor(
    message: string,
    status: number = 500,
    statusText: string = '',
    data: unknown = null,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.response = { status, statusText, data };

    // Preserve correct stack trace in V8 engines (Chrome, Node)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
