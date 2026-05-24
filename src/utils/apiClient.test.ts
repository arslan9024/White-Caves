import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './apiClient';

// Cast fetch to mock for testing
const mockFetch = vi.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
    apiClient.setAuthToken(null);
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
});
