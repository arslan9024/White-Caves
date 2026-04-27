import { describe, expect, it } from 'vitest';
import { checkSeoFiles, getRuntimeConfig } from '../../scripts/verify-deployment.js';

describe('verify-deployment script helpers', () => {
  it('returns runtime config with localhost default', () => {
    const cfg = getRuntimeConfig();
    expect(cfg.baseUrl.startsWith('http://')).toBe(true);
  });

  it('checkSeoFiles detects local SEO files list', () => {
    const results = checkSeoFiles();
    expect(Array.isArray(results)).toBe(true);
    expect(results.some(r => r.name.includes('robots.txt'))).toBe(true);
    expect(results.some(r => r.name.includes('sitemap.xml'))).toBe(true);
  });
});
