import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAuthenticationRequired } from './authenticationPolicy.js';

afterEach(() => vi.unstubAllEnvs());

describe('backend authentication policy', () => {
  it.each(['production', 'staging', 'test', 'unknown'])(
    'requires authentication in %s even with a bypass flag',
    environment => {
      vi.stubEnv('NODE_ENV', environment);
      vi.stubEnv('DEV_AUTH_BYPASS', 'true');
      expect(isAuthenticationRequired()).toBe(true);
    }
  );
  it('only permits explicitly local development behavior', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('DEV_AUTH_BYPASS', 'true');
    expect(isAuthenticationRequired()).toBe(false);
    vi.stubEnv('DEV_AUTH_BYPASS', 'false');
    expect(isAuthenticationRequired()).toBe(true);
  });
});
