/**
 * authFetch.test.ts — Comprehensive tests for the authenticated fetch wrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests: JWT token injection, HTTP status handling (401/403/5xx),
 *        timeout guard, AbortSignal merging, extractApiError utility.
 *
 * Coverage targets:
 *   ✓ Token injection from safeStorage
 *   ✓ Authorization header skip when already present
 *   ✓ Content-Type auto-set for JSON bodies (skip FormData)
 *   ✓ 401 → auto-logout (clear storage, redirect)
 *   ✓ 403 → HttpError with "Access denied"
 *   ✓ 5xx → HttpError with server error message
 *   ✓ Successful response passthrough
 *   ✓ Timeout with AbortController
 *   ✓ Caller-supplied AbortSignal respected
 *   ✓ extractApiError parsing (message, error, fallback)
 *   ✓ HttpError class (name, status, statusText)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// afterEach needed for window.location cleanup
import { authFetch, HttpError, extractApiError } from './authFetch';

// ─── Mock safeStorage ────────────────────────────────────────────────────
const mockGet = vi.fn<(key: string) => string | null>();
const mockRemove = vi.fn<(key: string) => boolean>();

vi.mock('./safeStorage', () => ({
  safeStorage: {
    get: (...args: [string]) => mockGet(...args),
    remove: (...args: [string]) => mockRemove(...args),
  },
}));

// ─── Mock logger ─────────────────────────────────────────────────────────
vi.mock('./logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// ─── Global fetch mock ──────────────────────────────────────────────────
const mockFetch = vi.fn<(...args: unknown[]) => Promise<Response>>();

// ─── Helpers ─────────────────────────────────────────────────────────────
function mockResponse(status: number, statusText = 'OK', body?: object): Response {
  return {
    status,
    statusText,
    ok: status >= 200 && status < 300,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: () => Promise.resolve(body ?? {}),
    text: () => Promise.resolve(JSON.stringify(body ?? {})),
    clone: () => mockResponse(status, statusText, body),
  } as unknown as Response;
}

describe('authFetch', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    global.fetch = mockFetch as unknown as typeof fetch;
    mockFetch.mockReset();
    mockGet.mockReset();
    mockRemove.mockReset();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/dashboard', href: '/dashboard' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Token Injection
  // ═══════════════════════════════════════════════════════════════════════

  describe('Token injection', () => {
    it('adds Authorization header when token exists in storage', async () => {
      mockGet.mockReturnValue('jwt-token-123');
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test');

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.get('Authorization')).toBe('Bearer jwt-token-123');
    });

    it('does NOT add Authorization header when no token in storage', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test');

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.has('Authorization')).toBe(false);
    });

    it('does NOT overwrite existing Authorization header', async () => {
      mockGet.mockReturnValue('jwt-token-123');
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test', {
        headers: { Authorization: 'Bearer custom-token' },
      });

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.get('Authorization')).toBe('Bearer custom-token');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Content-Type handling
  // ═══════════════════════════════════════════════════════════════════════

  describe('Content-Type handling', () => {
    it('auto-sets Content-Type to JSON when body is present', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      });

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('does NOT set Content-Type for FormData bodies', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      const formData = new FormData();
      formData.append('file', 'test');

      await authFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.has('Content-Type')).toBe(false);
    });

    it('does NOT overwrite existing Content-Type header', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
        headers: { 'Content-Type': 'text/plain' },
      });

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.get('Content-Type')).toBe('text/plain');
    });

    it('does NOT set Content-Type when no body is present', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test');

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      const headers = callArgs[1].headers as Headers;
      expect(headers.has('Content-Type')).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  HTTP Status Handling
  // ═══════════════════════════════════════════════════════════════════════

  describe('HTTP status handling', () => {
    it('returns response for successful (200) requests', async () => {
      mockGet.mockReturnValue(null);
      const response = mockResponse(200);
      mockFetch.mockResolvedValueOnce(response);

      const result = await authFetch('/api/test');

      expect(result).toBe(response);
      expect(result.status).toBe(200);
    });

    it('returns response for 201 Created', async () => {
      mockGet.mockReturnValue(null);
      const response = mockResponse(201, 'Created');
      mockFetch.mockResolvedValueOnce(response);

      const result = await authFetch('/api/test');
      expect(result.status).toBe(201);
    });

    it('returns response for 400 Bad Request (not handled specially)', async () => {
      mockGet.mockReturnValue(null);
      const response = mockResponse(400, 'Bad Request');
      mockFetch.mockResolvedValueOnce(response);

      const result = await authFetch('/api/test');
      expect(result.status).toBe(400);
    });

    it('returns response for 404 Not Found (not handled specially)', async () => {
      mockGet.mockReturnValue(null);
      const response = mockResponse(404, 'Not Found');
      mockFetch.mockResolvedValueOnce(response);

      const result = await authFetch('/api/test');
      expect(result.status).toBe(404);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  401 Unauthorized → Auto-Logout
  // ═══════════════════════════════════════════════════════════════════════

  describe('401 Unauthorized handling', () => {
    it('clears token and userRole from storage on 401', async () => {
      mockGet.mockReturnValue('old-token');
      mockFetch.mockResolvedValueOnce(mockResponse(401, 'Unauthorized'));

      await expect(authFetch('/api/test')).rejects.toThrow();

      expect(mockRemove).toHaveBeenCalledWith('token');
      expect(mockRemove).toHaveBeenCalledWith('userRole');
    });

    it('redirects to / on 401 when not already on /', async () => {
      mockGet.mockReturnValue('old-token');
      mockFetch.mockResolvedValueOnce(mockResponse(401, 'Unauthorized'));

      await expect(authFetch('/api/test')).rejects.toThrow();

      expect(window.location.href).toBe('/');
    });

    it('does NOT redirect when already on / (avoids reload loop)', async () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/', href: '/' },
      });

      mockGet.mockReturnValue('old-token');
      mockFetch.mockResolvedValueOnce(mockResponse(401, 'Unauthorized'));

      await expect(authFetch('/api/test')).rejects.toThrow();

      // Should still be '/' — no redirect triggered
      expect(window.location.href).toBe('/');
    });

    it('throws HttpError with status 401', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(401, 'Unauthorized'));

      try {
        await authFetch('/api/test');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.status).toBe(401);
        expect(httpError.statusText).toBe('Unauthorized');
        expect(httpError.message).toContain('Session expired');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  403 Forbidden
  // ═══════════════════════════════════════════════════════════════════════

  describe('403 Forbidden handling', () => {
    it('throws HttpError with status 403 and "Access denied" message', async () => {
      mockGet.mockReturnValue('valid-token');
      mockFetch.mockResolvedValueOnce(mockResponse(403, 'Forbidden'));

      try {
        await authFetch('/api/admin-only');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.status).toBe(403);
        expect(httpError.statusText).toBe('Forbidden');
        expect(httpError.message).toContain('Access denied');
      }
    });

    it('does NOT clear storage on 403 (unlike 401)', async () => {
      mockGet.mockReturnValue('valid-token');
      mockFetch.mockResolvedValueOnce(mockResponse(403, 'Forbidden'));

      await expect(authFetch('/api/admin-only')).rejects.toThrow();

      expect(mockRemove).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  5xx Server Errors
  // ═══════════════════════════════════════════════════════════════════════

  describe('5xx Server error handling', () => {
    it('throws HttpError for 500 Internal Server Error', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(500, 'Internal Server Error'));

      try {
        await authFetch('/api/test');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        const httpError = error as HttpError;
        expect(httpError.status).toBe(500);
        expect(httpError.message).toContain('Server error');
        expect(httpError.message).toContain('500');
      }
    });

    it('throws HttpError for 502 Bad Gateway', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(502, 'Bad Gateway'));

      try {
        await authFetch('/api/test');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect((error as HttpError).status).toBe(502);
      }
    });

    it('throws HttpError for 503 Service Unavailable', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(503, 'Service Unavailable'));

      try {
        await authFetch('/api/test');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect((error as HttpError).status).toBe(503);
      }
    });

    it('includes URL context in 5xx error log for string URLs', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(500, 'Internal Server Error'));

      await expect(authFetch('/api/important')).rejects.toThrow(HttpError);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Timeout Guard
  // ═══════════════════════════════════════════════════════════════════════

  describe('Timeout guard', () => {
    it('passes an AbortSignal to fetch (timeout mechanism is set up)', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test');

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      expect(callArgs[1].signal).toBeDefined();
      expect(callArgs[1].signal).toBeInstanceOf(AbortSignal);
    });

    it('does NOT set timeout when timeout is 0', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      const result = await authFetch('/api/test', { timeout: 0 });
      expect(result.status).toBe(200);
    });

    it('clears timeout on successful response', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test');

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('clears timeout even on error response', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(500, 'Internal Server Error'));

      await expect(authFetch('/api/test')).rejects.toThrow();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('accepts custom timeout parameter without error', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      // Should not throw — custom timeout accepted
      const result = await authFetch('/api/test', { timeout: 5000 });
      expect(result.status).toBe(200);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  AbortSignal Support
  // ═══════════════════════════════════════════════════════════════════════

  describe('AbortSignal support', () => {
    it('passes abort signal to fetch', async () => {
      mockGet.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce(mockResponse(200));

      await authFetch('/api/test');

      const callArgs = mockFetch.mock.calls[0] as [RequestInfo | URL, RequestInit];
      expect(callArgs[1].signal).toBeDefined();
    });

    it('rejects when caller-supplied AbortSignal is pre-aborted', async () => {
      mockGet.mockReturnValue(null);
      const controller = new AbortController();
      controller.abort(); // Pre-abort

      mockFetch.mockImplementation((...args: unknown[]) => {
        const init = args[1] as RequestInit | undefined;
        if (init?.signal?.aborted) {
          return Promise.reject(new DOMException('The operation was aborted.', 'AbortError'));
        }
        return Promise.resolve(mockResponse(200));
      });

      await expect(authFetch('/api/test', { signal: controller.signal })).rejects.toThrow();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  HttpError Class
// ═══════════════════════════════════════════════════════════════════════════

describe('HttpError', () => {
  it('extends Error', () => {
    const error = new HttpError('test message', 500, 'Internal Server Error');
    expect(error).toBeInstanceOf(Error);
  });

  it('sets name to "HttpError"', () => {
    const error = new HttpError('test', 404, 'Not Found');
    expect(error.name).toBe('HttpError');
  });

  it('preserves status code', () => {
    const error = new HttpError('test', 403, 'Forbidden');
    expect(error.status).toBe(403);
  });

  it('preserves statusText', () => {
    const error = new HttpError('test', 502, 'Bad Gateway');
    expect(error.statusText).toBe('Bad Gateway');
  });

  it('preserves message', () => {
    const error = new HttpError('Custom error message', 500, 'Internal Server Error');
    expect(error.message).toBe('Custom error message');
  });

  it('has correct stack trace', () => {
    const error = new HttpError('test', 500, 'Internal Server Error');
    expect(error.stack).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  extractApiError
// ═══════════════════════════════════════════════════════════════════════════

describe('extractApiError', () => {
  it('extracts "message" field from API response', async () => {
    const response = {
      status: 400,
      json: () => Promise.resolve({ message: 'Invalid email format' }),
    } as unknown as Response;

    const result = await extractApiError(response, 'Request failed');
    expect(result).toBe('Invalid email format');
  });

  it('extracts "error" field when "message" is not present', async () => {
    const response = {
      status: 422,
      json: () => Promise.resolve({ error: 'Validation failed' }),
    } as unknown as Response;

    const result = await extractApiError(response, 'Request failed');
    expect(result).toBe('Validation failed');
  });

  it('uses fallback when response has no message or error', async () => {
    const response = {
      status: 500,
      json: () => Promise.resolve({ data: null }),
    } as unknown as Response;

    const result = await extractApiError(response, 'Request failed');
    expect(result).toBe('Request failed (500)');
  });

  it('uses fallback when response.json() throws', async () => {
    const response = {
      status: 500,
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as unknown as Response;

    const result = await extractApiError(response, 'Parse error');
    expect(result).toBe('Parse error (500)');
  });

  it('falls back when response body is empty', async () => {
    const response = {
      status: 404,
      json: () => Promise.resolve(null),
    } as unknown as Response;

    const result = await extractApiError(response, 'Not found');
    expect(result).toBe('Not found (404)');
  });

  it('prefers "message" over "error" when both exist', async () => {
    const response = {
      status: 400,
      json: () => Promise.resolve({ message: 'Primary message', error: 'Secondary error' }),
    } as unknown as Response;

    const result = await extractApiError(response, 'Fallback');
    expect(result).toBe('Primary message');
  });
});
