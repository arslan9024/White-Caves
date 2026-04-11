import { describe, it, expect } from 'vitest';
import { getErrorMessage, getHttpErrorMessage, ERROR_MESSAGES } from './errors';

// ═══════════════════════════════════════════════════════════════════════
describe('ERROR_MESSAGES', () => {
  it('has a static UNEXPECTED fallback', () => {
    expect(ERROR_MESSAGES.UNEXPECTED).toBe('An unexpected error occurred');
  });

  it('generates FETCH_FAILED with resource name', () => {
    expect(ERROR_MESSAGES.FETCH_FAILED('leads')).toBe('Failed to fetch leads');
  });

  it('generates CREATE_FAILED with resource name', () => {
    expect(ERROR_MESSAGES.CREATE_FAILED('property')).toBe('Failed to create property');
  });

  it('generates UPDATE_FAILED with resource name', () => {
    expect(ERROR_MESSAGES.UPDATE_FAILED('agent')).toBe('Failed to update agent');
  });

  it('generates DELETE_FAILED with resource name', () => {
    expect(ERROR_MESSAGES.DELETE_FAILED('commission')).toBe('Failed to delete commission');
  });

  it('generates NOT_FOUND with resource name', () => {
    expect(ERROR_MESSAGES.NOT_FOUND('User')).toBe('User not found');
  });

  it('has static NETWORK_ERROR', () => {
    expect(ERROR_MESSAGES.NETWORK_ERROR).toContain('connect');
  });

  it('has static UNAUTHORIZED', () => {
    expect(ERROR_MESSAGES.UNAUTHORIZED).toContain('session');
  });

  it('has static FORBIDDEN', () => {
    expect(ERROR_MESSAGES.FORBIDDEN).toContain('permission');
  });

  it('has static RATE_LIMITED', () => {
    expect(ERROR_MESSAGES.RATE_LIMITED).toContain('Too many');
  });

  it('has static VALIDATION_FAILED', () => {
    expect(ERROR_MESSAGES.VALIDATION_FAILED).toContain('form');
  });

  it('has static PAYMENT_FAILED', () => {
    expect(ERROR_MESSAGES.PAYMENT_FAILED).toContain('payment');
  });
});

// ═══════════════════════════════════════════════════════════════════════
describe('getErrorMessage', () => {
  // ── Error instances ────────────────────────────────────────────────
  it('extracts message from Error instance', () => {
    expect(getErrorMessage(new Error('Network timeout'))).toBe('Network timeout');
  });

  it('extracts message from TypeError', () => {
    expect(getErrorMessage(new TypeError('Cannot read property'))).toBe('Cannot read property');
  });

  it('extracts message from RangeError', () => {
    expect(getErrorMessage(new RangeError('Out of bounds'))).toBe('Out of bounds');
  });

  // ── String errors ──────────────────────────────────────────────────
  it('returns string errors directly', () => {
    expect(getErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('returns empty string when thrown value is empty string', () => {
    expect(getErrorMessage('')).toBe('');
  });

  // ── Objects with .message ──────────────────────────────────────────
  it('extracts .message from plain object', () => {
    expect(getErrorMessage({ message: 'API limit exceeded' })).toBe('API limit exceeded');
  });

  it('ignores non-string .message property', () => {
    expect(getErrorMessage({ message: 42 })).toBe('An unexpected error occurred');
  });

  // ── Fallback behavior ─────────────────────────────────────────────
  it('returns default fallback for null', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
  });

  it('returns default fallback for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
  });

  it('returns default fallback for number', () => {
    expect(getErrorMessage(404)).toBe('An unexpected error occurred');
  });

  it('returns default fallback for boolean', () => {
    expect(getErrorMessage(false)).toBe('An unexpected error occurred');
  });

  it('returns default fallback for empty object', () => {
    expect(getErrorMessage({})).toBe('An unexpected error occurred');
  });

  // ── Custom fallback ────────────────────────────────────────────────
  it('uses custom fallback when provided', () => {
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
  });

  it('uses custom fallback for non-Error objects', () => {
    expect(getErrorMessage(42, 'Failed to calculate')).toBe('Failed to calculate');
  });

  // ── Integration with ERROR_MESSAGES ────────────────────────────────
  it('works with ERROR_MESSAGES.FETCH_FAILED as fallback', () => {
    expect(getErrorMessage(null, ERROR_MESSAGES.FETCH_FAILED('metrics'))).toBe('Failed to fetch metrics');
  });

  it('prefers Error.message over custom fallback', () => {
    expect(getErrorMessage(new Error('Actual error'), 'Fallback')).toBe('Actual error');
  });
});

// ═══════════════════════════════════════════════════════════════════════
describe('ERROR_MESSAGES — new top-level keys', () => {
  it('has SERVER_ERROR', () => {
    expect(ERROR_MESSAGES.SERVER_ERROR).toContain('wrong');
  });

  it('has AUTHENTICATION_REQUIRED', () => {
    expect(ERROR_MESSAGES.AUTHENTICATION_REQUIRED).toContain('sign in');
  });
});

// ═══════════════════════════════════════════════════════════════════════
describe('ERROR_MESSAGES — domain groups', () => {
  it.each([
    'AUTH',
    'PROPERTY',
    'APPOINTMENT',
    'PAYMENT',
    'TENANCY',
    'FORM',
    'FILE',
    'DATABASE',
  ] as const)('has %s category with at least one message', (category) => {
    const cat = ERROR_MESSAGES[category];
    expect(typeof cat).toBe('object');
    expect(Object.keys(cat).length).toBeGreaterThan(0);
    Object.values(cat).forEach((msg) => {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    });
  });

  it('AUTH has LOGIN_FAILED', () => {
    expect(ERROR_MESSAGES.AUTH.LOGIN_FAILED).toContain('Login failed');
  });

  it('AUTH has INVALID_CREDENTIALS', () => {
    expect(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS).toContain('Invalid');
  });

  it('PROPERTY covers full CRUD', () => {
    expect(ERROR_MESSAGES.PROPERTY.LOAD_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.PROPERTY.CREATE_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.PROPERTY.UPDATE_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.PROPERTY.DELETE_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.PROPERTY.NOT_FOUND).toBeDefined();
  });

  it('FORM has validation messages', () => {
    expect(ERROR_MESSAGES.FORM.REQUIRED_FIELD).toBeDefined();
    expect(ERROR_MESSAGES.FORM.INVALID_EMAIL).toContain('email');
    expect(ERROR_MESSAGES.FORM.INVALID_PHONE).toContain('phone');
    expect(ERROR_MESSAGES.FORM.PASSWORD_TOO_SHORT).toContain('8 characters');
    expect(ERROR_MESSAGES.FORM.PASSWORDS_DONT_MATCH).toContain('match');
  });

  it('FILE has upload, type, and size limits', () => {
    expect(ERROR_MESSAGES.FILE.UPLOAD_FAILED).toBeDefined();
    expect(ERROR_MESSAGES.FILE.INVALID_TYPE).toBeDefined();
    expect(ERROR_MESSAGES.FILE.TOO_LARGE).toContain('5MB');
  });
});

// ═══════════════════════════════════════════════════════════════════════
describe('getHttpErrorMessage', () => {
  // ── Falsy inputs ───────────────────────────────────────────────────
  it('returns SERVER_ERROR for null', () => {
    expect(getHttpErrorMessage(null)).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for undefined', () => {
    expect(getHttpErrorMessage(undefined)).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for empty string', () => {
    expect(getHttpErrorMessage('')).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for 0', () => {
    expect(getHttpErrorMessage(0)).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  // ── HTTP response with data message ────────────────────────────────
  it('returns response.data.message when present', () => {
    const error = { response: { status: 400, data: { message: 'Custom server message' } } };
    expect(getHttpErrorMessage(error)).toBe('Custom server message');
  });

  it('returns response.data.error when no message', () => {
    const error = { response: { status: 500, data: { error: 'Internal error detail' } } };
    expect(getHttpErrorMessage(error)).toBe('Internal error detail');
  });

  it('prefers message over status code mapping', () => {
    const error = { response: { status: 401, data: { message: 'Token expired' } } };
    expect(getHttpErrorMessage(error)).toBe('Token expired');
  });

  // ── HTTP status code mapping ───────────────────────────────────────
  it('maps 400 to VALIDATION_FAILED', () => {
    const error = { response: { status: 400, data: {} } };
    expect(getHttpErrorMessage(error)).toBe(ERROR_MESSAGES.VALIDATION_FAILED);
  });

  it('maps 401 to AUTHENTICATION_REQUIRED', () => {
    const error = { response: { status: 401, data: {} } };
    expect(getHttpErrorMessage(error)).toBe(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
  });

  it('maps 403 to FORBIDDEN', () => {
    const error = { response: { status: 403, data: {} } };
    expect(getHttpErrorMessage(error)).toBe(ERROR_MESSAGES.FORBIDDEN);
  });

  it('maps 404 to NOT_FOUND', () => {
    const error = { response: { status: 404, data: {} } };
    expect(getHttpErrorMessage(error)).toContain('not found');
  });

  it('maps 500 to SERVER_ERROR', () => {
    const error = { response: { status: 500, data: {} } };
    expect(getHttpErrorMessage(error)).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  it('maps unknown status codes to SERVER_ERROR', () => {
    const error = { response: { status: 503, data: {} } };
    expect(getHttpErrorMessage(error)).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  // ── Network errors ─────────────────────────────────────────────────
  it('returns NETWORK_ERROR when request exists but no response', () => {
    const error = { request: {} };
    expect(getHttpErrorMessage(error)).toBe(ERROR_MESSAGES.NETWORK_ERROR);
  });

  // ── Errors with message property ───────────────────────────────────
  it('returns error.message for generic Error', () => {
    expect(getHttpErrorMessage(new Error('Something broke'))).toBe('Something broke');
  });

  it('returns error.message for plain object', () => {
    expect(getHttpErrorMessage({ message: 'Custom message' })).toBe('Custom message');
  });

  // ── Fallbacks ──────────────────────────────────────────────────────
  it('returns SERVER_ERROR for unknown object shape', () => {
    expect(getHttpErrorMessage({ foo: 'bar' })).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });

  it('returns SERVER_ERROR for number', () => {
    expect(getHttpErrorMessage(42)).toBe(ERROR_MESSAGES.SERVER_ERROR);
  });
});
