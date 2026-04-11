/**
 * Standardized Error Messages & Utilities
 *
 * Centralizes all error message strings and provides a type-safe
 * helper for extracting error messages from unknown catch values.
 *
 * Usage:
 *   import { getErrorMessage, ERROR_MESSAGES } from '@/constants/errors';
 *
 *   // In async thunks:
 *   catch (error: unknown) {
 *     return rejectWithValue(getErrorMessage(error, ERROR_MESSAGES.FETCH_FAILED('leads')));
 *   }
 */

// ─── Error Message Constants ─────────────────────────────────────────────

export const ERROR_MESSAGES = {
  /** Generic unexpected error (default fallback) */
  UNEXPECTED: 'An unexpected error occurred',

  /** Operation-specific fetch failure */
  FETCH_FAILED: (resource: string) => `Failed to fetch ${resource}`,

  /** Operation-specific create failure */
  CREATE_FAILED: (resource: string) => `Failed to create ${resource}`,

  /** Operation-specific update failure */
  UPDATE_FAILED: (resource: string) => `Failed to update ${resource}`,

  /** Operation-specific delete failure */
  DELETE_FAILED: (resource: string) => `Failed to delete ${resource}`,

  /** Network / connectivity */
  NETWORK_ERROR: 'Network error — please check your connection',

  /** Auth / session */
  UNAUTHORIZED: 'Your session has expired — please sign in again',

  /** Permission denied */
  FORBIDDEN: 'You do not have permission to perform this action',

  /** Not found */
  NOT_FOUND: (resource: string) => `${resource} not found`,

  /** Rate limited */
  RATE_LIMITED: 'Too many requests — please try again shortly',

  /** Validation */
  VALIDATION_FAILED: 'Please check the form and correct any errors',

  /** Payment */
  PAYMENT_FAILED: 'Failed to process payment — please try again',
} as const;

// ─── Error Extraction Helper ─────────────────────────────────────────────

/**
 * Safely extract a human-readable error message from any thrown value.
 *
 * Handles: Error instances, strings, objects with `.message`, and unknowns.
 * Always returns a string — never throws.
 *
 * @param error   The caught value (any type)
 * @param fallback  Fallback message when error can't be parsed (defaults to UNEXPECTED)
 * @returns A user-facing error string
 */
export function getErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.UNEXPECTED,
): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  ) {
    return (error as Record<string, unknown>).message as string;
  }
  return fallback;
}
