import { describe, expect, it } from 'vitest';
import {
  buildRuntimeChecks,
  checkEndpointWithRetries,
  normalizeBaseUrl,
  verifyRuntimeEndpoints,
} from '../../scripts/verify-runtime-endpoints.js';

describe('verify-runtime-endpoints helpers', () => {
  it('normalizes URL and strips trailing slash', () => {
    expect(normalizeBaseUrl('https://whitecaves.com/')).toBe('https://whitecaves.com');
    expect(normalizeBaseUrl('whitecaves.com')).toBe('https://whitecaves.com');
  });

  it('builds required + optional checks', () => {
    const checks = buildRuntimeChecks('https://whitecaves.com');
    expect(checks).toHaveLength(4);
    expect(checks.some(c => c.required && c.path === '/')).toBe(true);
    expect(checks.some(c => c.required && c.path === '/api/health')).toBe(true);
    expect(checks.some(c => !c.required && c.path === '/robots.txt')).toBe(true);
    expect(checks.some(c => !c.required && c.path === '/sitemap.xml')).toBe(true);
  });

  it('fails only when required checks fail', async () => {
    const fakeRequester = async url => {
      if (url.endsWith('/api/health'))
        return { success: false, statusCode: 503, error: 'Service Unavailable' };
      return { success: true, statusCode: 200 };
    };

    const result = await verifyRuntimeEndpoints('https://whitecaves.com', {
      requester: fakeRequester,
    });
    expect(result.success).toBe(false);
    expect(result.requiredFailures).toHaveLength(1);
    expect(result.requiredFailures[0].path).toBe('/api/health');
  });

  it('passes when only optional checks fail', async () => {
    const fakeRequester = async url => {
      if (url.endsWith('/robots.txt') || url.endsWith('/sitemap.xml')) {
        return { success: false, statusCode: 404 };
      }
      return { success: true, statusCode: 200 };
    };

    const result = await verifyRuntimeEndpoints('https://whitecaves.com', {
      requester: fakeRequester,
    });
    expect(result.success).toBe(true);
    expect(result.requiredFailures).toHaveLength(0);
  });

  it('retries endpoint checks and succeeds on later attempt', async () => {
    let attempts = 0;
    const fakeRequester = async () => {
      attempts += 1;
      if (attempts < 3) return { success: false, statusCode: 503 };
      return { success: true, statusCode: 200 };
    };

    const result = await checkEndpointWithRetries('https://whitecaves.com/api/health', {
      retries: 3,
      retryDelayMs: 0,
      requester: fakeRequester,
    });

    expect(result.success).toBe(true);
    expect(result.attempts).toBe(3);
  });

  it('verifyRuntimeEndpoints reports attempts when retries are enabled', async () => {
    const callCounter = new Map();
    const fakeRequester = async url => {
      const current = (callCounter.get(url) || 0) + 1;
      callCounter.set(url, current);

      if (url.endsWith('/api/health') && current < 2) {
        return { success: false, statusCode: 503 };
      }

      return { success: true, statusCode: 200 };
    };

    const result = await verifyRuntimeEndpoints('https://whitecaves.com', {
      retries: 2,
      retryDelayMs: 0,
      requester: fakeRequester,
    });

    const apiHealth = result.checks.find(c => c.path === '/api/health');
    expect(result.success).toBe(true);
    expect(apiHealth?.attempts).toBe(2);
  });
});
