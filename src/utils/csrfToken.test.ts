import { afterEach, describe, expect, it, vi } from 'vitest';
import { ensureCsrfToken } from './csrfToken';

afterEach(() => {
  vi.restoreAllMocks();
  document.cookie = 'csrf_token=; Max-Age=0; path=/';
});

describe('ensureCsrfToken', () => {
  it('returns an existing token without making a request', async () => {
    document.cookie = 'csrf_token=existing-token; path=/';
    const fetch = vi.spyOn(globalThis, 'fetch');

    await expect(ensureCsrfToken()).resolves.toBe('existing-token');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches a token from the same-origin auth endpoint when missing', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      document.cookie = 'csrf_token=issued-token; path=/';
      return new Response(null, { status: 204 });
    });

    await expect(ensureCsrfToken()).resolves.toBe('issued-token');
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/csrf',
      expect.objectContaining({ method: 'GET', credentials: 'include', cache: 'no-store' })
    );
  });

  it('fails explicitly when the endpoint does not issue a readable cookie', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await expect(ensureCsrfToken()).rejects.toThrow(
      'CSRF token endpoint did not set a readable cookie'
    );
  });
});
