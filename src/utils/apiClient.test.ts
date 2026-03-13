import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './apiClient';

describe('ApiClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    apiClient.setAuthToken(null);
  });

  it('should set authorization header when token is provided', () => {
    apiClient.setAuthToken('test-token');
    expect(apiClient.defaultHeaders['Authorization']).toBe('Bearer test-token');
  });

  it('should remove authorization header when null is passed', () => {
    apiClient.setAuthToken('test-token');
    apiClient.setAuthToken(null);
    expect(apiClient.defaultHeaders['Authorization']).toBeUndefined();
  });

  it('should make GET request with correct URL', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    const result = await apiClient.get('/test');
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual({ success: true });
  });

  it('should make POST request with JSON body', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ id: 1 }),
    });

    const result = await apiClient.post('/users', { name: 'Test' });
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      })
    );
    expect(result).toEqual({ id: 1 });
  });

  it('should throw HttpError on non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ message: 'Not found' }),
    });

    await expect(apiClient.get('/missing')).rejects.toThrow('Not found');
  });
});
