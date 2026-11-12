import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveSocketUrl } from './socketConfig';

afterEach(() => vi.unstubAllEnvs());

describe('socket origin resolution', () => {
  it('accepts a relative API path without treating it as invalid', () => {
    vi.stubEnv('VITE_API_URL', '/api');
    expect(resolveSocketUrl()).toBe(window.location.origin);
  });
  it('removes the API path from an absolute configured URL', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.whitecaves.com/api');
    expect(resolveSocketUrl()).toBe('https://api.whitecaves.com');
  });
  it('rejects non-HTTP protocols', () => {
    vi.stubEnv('VITE_API_URL', 'javascript:alert(1)');
    expect(resolveSocketUrl()).toBe(window.location.origin);
  });
});
