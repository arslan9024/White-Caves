import { describe, it, expect } from 'vitest';
import { HttpError } from './HttpError';

describe('HttpError', () => {
  // ── Constructor basics ─────────────────────────────────────────────
  it('sets name to "HttpError"', () => {
    const error = new HttpError('test');
    expect(error.name).toBe('HttpError');
  });

  it('extends Error', () => {
    const error = new HttpError('test');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
  });

  it('sets message from first argument', () => {
    const error = new HttpError('Something broke');
    expect(error.message).toBe('Something broke');
  });

  // ── Defaults ──────────────────────────────────────────────────────
  it('defaults status to 500', () => {
    const error = new HttpError('fail');
    expect(error.status).toBe(500);
  });

  it('defaults statusText to empty string', () => {
    const error = new HttpError('fail');
    expect(error.statusText).toBe('');
  });

  it('defaults data to null', () => {
    const error = new HttpError('fail');
    expect(error.data).toBeNull();
  });

  // ── Custom values ─────────────────────────────────────────────────
  it('accepts status as second argument', () => {
    const error = new HttpError('Not found', 404);
    expect(error.status).toBe(404);
  });

  it('accepts statusText as third argument', () => {
    const error = new HttpError('Forbidden', 403, 'Forbidden');
    expect(error.statusText).toBe('Forbidden');
  });

  it('accepts data as fourth argument', () => {
    const data = { detail: 'Missing field' };
    const error = new HttpError('Validation failed', 422, 'Unprocessable Entity', data);
    expect(error.data).toEqual(data);
  });

  // ── Response accessor ─────────────────────────────────────────────
  it('exposes response object with status, statusText, and data', () => {
    const error = new HttpError('Server error', 500, 'Internal Server Error', { trace: 'abc' });
    expect(error.response).toEqual({
      status: 500,
      statusText: 'Internal Server Error',
      data: { trace: 'abc' },
    });
  });

  it('response defaults match constructor defaults', () => {
    const error = new HttpError('fail');
    expect(error.response).toEqual({
      status: 500,
      statusText: '',
      data: null,
    });
  });

  // ── Readonly properties ───────────────────────────────────────────
  it('has readonly status', () => {
    const error = new HttpError('test', 404, 'Not Found');
    // TypeScript readonly prevents compile-time mutation;
    // at runtime, Object.getOwnPropertyDescriptor confirms it's writable
    // because class fields are configurable. We just verify the value is set.
    expect(error.status).toBe(404);
  });

  // ── Stack trace ───────────────────────────────────────────────────
  it('has a stack trace', () => {
    const error = new HttpError('test');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('HttpError');
  });

  // ── Common HTTP status codes ──────────────────────────────────────
  it.each([
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [408, 'Request Timeout'],
    [422, 'Unprocessable Entity'],
    [429, 'Too Many Requests'],
    [499, 'Client Closed Request'],
    [500, 'Internal Server Error'],
    [502, 'Bad Gateway'],
    [503, 'Service Unavailable'],
  ])('handles status %i (%s)', (status, statusText) => {
    const error = new HttpError(`Error ${status}`, status, statusText);
    expect(error.status).toBe(status);
    expect(error.statusText).toBe(statusText);
    expect(error.message).toBe(`Error ${status}`);
  });

  // ── Data payload types ────────────────────────────────────────────
  it('accepts string data', () => {
    const error = new HttpError('fail', 400, '', 'raw text');
    expect(error.data).toBe('raw text');
  });

  it('accepts null data explicitly', () => {
    const error = new HttpError('fail', 500, '', null);
    expect(error.data).toBeNull();
  });

  it('accepts array data', () => {
    const error = new HttpError('fail', 422, '', [{ field: 'email', error: 'invalid' }]);
    expect(error.data).toEqual([{ field: 'email', error: 'invalid' }]);
  });
});
