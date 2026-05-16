import { describe, it, expect, beforeEach, vi } from 'vitest';
import { APIClient } from '../apiClient';

describe('services/apiClient', () => {
  let client: APIClient;
  let storage: Map<string, string>;

  beforeEach(() => {
    vi.restoreAllMocks();
    storage = new Map<string, string>();
    vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation((key: string) =>
      storage.has(key) ? (storage.get(key) ?? null) : null
    );
    vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(
      (key: string, value: string) => {
        storage.set(key, String(value));
      }
    );
    vi.spyOn(globalThis.localStorage, 'removeItem').mockImplementation((key: string) => {
      storage.delete(key);
    });
    vi.spyOn(globalThis.localStorage, 'clear').mockImplementation(() => {
      storage.clear();
    });
    localStorage.clear();
    client = new APIClient();
  });

  it('adds auth header and query params for GET', async () => {
    localStorage.setItem('authToken', 'token-123');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const result = await client.get<{ ok: boolean }>('/resource', {
      params: { page: 2, active: true },
    });

    expect(result.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/resource');
    expect(url).toContain('page=2');
    expect(url).toContain('active=true');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer token-123');
  });

  it('serializes POST JSON body', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ created: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    await client.post('/items', { name: 'A' });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ name: 'A' }));
  });

  it('retries on network error and succeeds', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ recovered: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

    const out = await client.get<{ recovered: boolean }>('/retry');
    expect(out.recovered).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries on 500 and succeeds', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'server down' }), {
          status: 500,
          headers: { 'content-type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

    const out = await client.get<{ ok: boolean }>('/unstable');
    expect(out.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes token on 401 and retries original request', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'unauthorized' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

    localStorage.setItem('refreshToken', 'refresh-123');

    const out = await client.get<{ ok: boolean }>('/secure');
    expect(out.ok).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('new-token');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('rejects with API error payload on 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'missing' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    );

    await expect(client.get('/missing')).rejects.toMatchObject({
      success: false,
      error: 'missing',
      code: '404',
    });
  });

  it('downloads blob successfully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('file-data', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    );

    const blob = await client.download('/export');
    expect(blob).toBeInstanceOf(Blob);
  });

  it('clears auth tokens', () => {
    localStorage.setItem('authToken', 'a');
    localStorage.setItem('refreshToken', 'r');

    client.clearAuthTokens();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('setAuthToken supports null to remove token', () => {
    client.setAuthToken('abc');
    expect(localStorage.getItem('authToken')).toBe('abc');

    client.setAuthToken(null);
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
