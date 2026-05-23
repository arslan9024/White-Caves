/**
 * Standardized Error Messages & Utilities
 *
 * Single source of truth for ALL error message strings, domain-specific
 * message groups, and type-safe helpers for extracting error messages
 * from unknown catch values or HTTP response objects.
 *
 * Usage:
 *   import { getErrorMessage, getHttpErrorMessage, ERROR_MESSAGES } from '@/constants/errors';
 *
 *   // In async thunks (catch blocks):
 *   catch (error: unknown) {
 *     return rejectWithValue(getErrorMessage(error, ERROR_MESSAGES.FETCH_FAILED('leads')));
 *   }
 *
 *   // In API clients (HTTP response-aware):
 *   catch (error: unknown) {
 *     const msg = getHttpErrorMessage(error);
 *   }
 */

// ─── Error Message Constants ─────────────────────────────────────────────

export const ERROR_MESSAGES = {
  // ── Generic / top-level ──────────────────────────────────────────────

  /** Generic unexpected error (default fallback for getErrorMessage) */
  UNEXPECTED: 'An unexpected error occurred',

  /** Generic server-side error (default fallback for getHttpErrorMessage) */
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',

  /** Network / connectivity */
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',

  /** Auth / session expired */
  UNAUTHORIZED: 'Your session has expired — please sign in again',

  /** Authentication required (not yet signed in) */
  AUTHENTICATION_REQUIRED: 'Please sign in to continue.',

  /** Permission denied */
  FORBIDDEN: 'You do not have permission to perform this action',

  /** Validation (generic) */
  VALIDATION_FAILED: 'Please check the form and correct any errors',

  /** Rate limited */
  RATE_LIMITED: 'Too many requests — please try again shortly',

  /** Payment (generic) */
  PAYMENT_FAILED: 'Failed to process payment — please try again',

  // ── Dynamic resource messages ────────────────────────────────────────

  /** Operation-specific fetch failure */
  FETCH_FAILED: (resource: string) => `Failed to fetch ${resource}`,

  /** Operation-specific create failure */
  CREATE_FAILED: (resource: string) => `Failed to create ${resource}`,

  /** Operation-specific update failure */
  UPDATE_FAILED: (resource: string) => `Failed to update ${resource}`,

  /** Operation-specific delete failure */
  DELETE_FAILED: (resource: string) => `Failed to delete ${resource}`,

  /** Not found (dynamic) */
  NOT_FOUND: (resource: string) => `${resource} not found`,

  // ── Domain: Authentication ───────────────────────────────────────────

  AUTH: {
    LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
    SIGNUP_FAILED: 'Account creation failed. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
  },

  // ── Domain: Property ─────────────────────────────────────────────────

  PROPERTY: {
    LOAD_FAILED: 'Unable to load properties. Please try again.',
    CREATE_FAILED: 'Unable to create property listing. Please try again.',
    UPDATE_FAILED: 'Unable to update property. Please try again.',
    DELETE_FAILED: 'Unable to delete property. Please try again.',
    NOT_FOUND: 'Property not found.',
  },

  // ── Domain: Appointments ─────────────────────────────────────────────

  APPOINTMENT: {
    CREATE_FAILED: 'Unable to schedule appointment. Please try again.',
    LOAD_FAILED: 'Unable to load appointments. Please try again.',
    INVALID_DATE: 'Please select a valid date and time.',
    SLOT_UNAVAILABLE: 'This time slot is no longer available. Please choose another time.',
  },

  // ── Domain: Payment ──────────────────────────────────────────────────

  PAYMENT: {
    PROCESSING_FAILED: 'Payment processing failed. Please try again or use a different payment method.',
    INVALID_AMOUNT: 'Invalid payment amount.',
    STRIPE_NOT_CONFIGURED: 'Payment processing is currently unavailable. Please contact support.',
  },

  // ── Domain: Tenancy ──────────────────────────────────────────────────

  TENANCY: {
    CREATE_FAILED: 'Unable to create tenancy agreement. Please try again.',
    SIGN_FAILED: 'Unable to process signature. Please try again.',
    LOAD_FAILED: 'Unable to load tenancy agreements. Please try again.',
    INVALID_EMAIL: 'The email address does not match our records.',
    UNAUTHORIZED_SIGNER: 'You are not authorized to sign this agreement.',
    ALREADY_SIGNED: 'You have already signed this agreement.',
  },

  // ── Domain: Form Validation ──────────────────────────────────────────

  FORM: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    INVALID_DATE: 'Please enter a valid date.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  },

  // ── Domain: File Upload ──────────────────────────────────────────────

  FILE: {
    UPLOAD_FAILED: 'File upload failed. Please try again.',
    INVALID_TYPE: 'Invalid file type. Please upload a valid file.',
    TOO_LARGE: 'File is too large. Maximum size is 5MB.',
  },

  // ── Domain: Database ─────────────────────────────────────────────────

  DATABASE: {
    CONNECTION_FAILED: 'Database connection failed. Some features may be unavailable.',
    OPERATION_FAILED: 'Database operation failed. Please try again.',
  },
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

// ─── HTTP-Response-Aware Error Extraction ────────────────────────────────

/**
 * Extract a user-facing error message from an HTTP error object.
 *
 * Handles Axios-style `{ response: { status, data } }` shapes,
 * network errors `{ request }`, and plain Error objects.
 * Falls back to SERVER_ERROR for unrecognised shapes.
 *
 * @param error  The caught value (any type)
 * @returns A user-facing error string
 */
export function getHttpErrorMessage(error: unknown): string {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;

  const err = error as {
    response?: { status?: number; data?: { message?: string; error?: string } };
    message?: string;
    request?: unknown;
  };

  if (err.response) {
    const status = err.response.status;
    const message = err.response.data?.message || err.response.data?.error;

    if (message) return message;

    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_FAILED;
      case 401:
        return ERROR_MESSAGES.AUTHENTICATION_REQUIRED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND('resource');
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.SERVER_ERROR;
    }
  }

  if (err.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return err.message || ERROR_MESSAGES.SERVER_ERROR;
}
