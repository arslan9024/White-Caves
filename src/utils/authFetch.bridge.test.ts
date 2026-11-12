import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authFetch } from './authFetch';
import { v1DealsApi } from '../services/api/v1ApiClient';

vi.mock('../config/constants', () => ({
  getApiUrl: (path: string) =>
    `https://api.example.test/api/${path.replace(/^\/+/, '')}`.replace(/\/$/, ''),
}));

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  vi.restoreAllMocks();
  document.cookie = 'csrf_token=; Max-Age=0; path=/';
});

describe('bridge-aware authenticated clients', () => {
  it('resolves relative API calls against the configured backend', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    await authFetch('/api/properties');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.test/api/properties',
      expect.objectContaining({ credentials: 'include' })
    );
  });

  it('does not rewrite unrelated URLs', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    await authFetch('/assets/data.json');
    expect(fetch.mock.calls[0][0]).toBe('/assets/data.json');
  });

  it('never retries a gateway failure for a write', async () => {
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 503 }));
    await expect(
      authFetch('/api/properties', { method: 'POST', body: '{}' })
    ).rejects.toMatchObject({ status: 503 });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('preserves Request methods and CSRF headers without replaying writes', async () => {
    document.cookie = 'csrf_token=test-csrf; path=/';
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 503 }));
    await expect(
      authFetch(
        new Request('https://api.example.test/api/auth/test', {
          method: 'POST',
          body: '{}',
        })
      )
    ).rejects.toMatchObject({ status: 503 });
    expect(fetch).toHaveBeenCalledTimes(1);
    const headers = new Headers(fetch.mock.calls[0][1]?.headers);
    expect(headers.get('x-csrf-token')).toBe('test-csrf');
  });

  it('refreshes on the configured backend and still enforces a retried 403', async () => {
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}', { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { token: 'test-rotated-token' } }))
      )
      .mockResolvedValueOnce(new Response('{}', { status: 403 }));
    await expect(authFetch('/api/private')).rejects.toMatchObject({ status: 403 });
    expect(fetch.mock.calls[1][0]).toBe('https://api.example.test/api/auth/refresh');
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('removes caller abort listeners after completion', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    const controller = new AbortController();
    const remove = vi.spyOn(controller.signal, 'removeEventListener');
    await authFetch('/api/properties', { signal: controller.signal });
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
  });

  it('routes V1 requests through the configured backend and preserves null on write failure', async () => {
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 503 }));
    await expect(v1DealsApi.updateStatus('one', 'COMPLETED')).resolves.toBeNull();
    expect(fetch.mock.calls[0][0]).toBe('https://api.example.test/api/v1/deals/one/status');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
