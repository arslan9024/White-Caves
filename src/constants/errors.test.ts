import { describe, it, expect } from 'vitest';
import { getErrorMessage, ERROR_MESSAGES } from './errors';

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
    expect(ERROR_MESSAGES.NETWORK_ERROR).toContain('Network error');
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
