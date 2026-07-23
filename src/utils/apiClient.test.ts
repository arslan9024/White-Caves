import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './apiClient';

// Cast fetch to mock for testing
const mockFetch = vi.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
    apiClient.setAuthToken(null);
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('should set authorization header when token is provided', async () => {
    apiClient.setAuthToken('test-token');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });
    await apiClient.get('/test');
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers['Authorization']).toBe('Bearer test-token');
  });

  it('should remove authorization header when null is passed', async () => {
    apiClient.setAuthToken('test-token');
    apiClient.setAuthToken(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });
    await apiClient.get('/test');
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers['Authorization']).toBeUndefined();
  });

  it('should make GET request with correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    const result = await apiClient.get('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
    expect(result).toEqual({ success: true });
  });

  it('should include credentials for auth cookie flows by default', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    await apiClient.post('/auth/firebase-sync', { firebaseUid: 'uid-1' });

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].credentials).toBe('include');
  });

  it('should attach csrf header for auth mutations when csrf cookie exists', async () => {
    document.cookie = 'csrf_token=test-csrf-token; path=/';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    await apiClient.post('/auth/logout', {});

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers['x-csrf-token']).toBe('test-csrf-token');
  });

  it('should make POST request with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ id: 1 }),
    });

    const result = await apiClient.post('/users', { name: 'Test' });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      })
    );
    expect(result).toEqual({ id: 1 });
  });

  it('should throw HttpError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ message: 'Not found' }),
    });

    await expect(apiClient.get('/missing')).rejects.toThrow('Not found');
  });

  it('should refresh the access token on 401 and retry the original request', async () => {
    document.cookie = 'csrf_token=refresh-csrf; path=/';
    apiClient.setAuthToken('stale-token');

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true, data: { token: 'fresh-token' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ success: true, data: { ok: true } }),
      });

    const result = await apiClient.get('/secure');

    expect(result).toEqual({ success: true, data: { ok: true } });
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch.mock.calls[1][0]).toBe('/api/auth/refresh');
    expect(mockFetch.mock.calls[1][1].headers['x-csrf-token']).toBe('refresh-csrf');
    expect(mockFetch.mock.calls[2][1].headers['Authorization']).toBe('Bearer fresh-token');
  });
});
