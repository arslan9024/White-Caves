import { describe, it, expect, vi } from 'vitest';
import sitemap from './sitemap';

vi.mock('@/lib/prisma', () => ({
  prisma: {},
  safeQuery: vi.fn(async (fn, fallback) => {
    try {
      return await fn({
        property: {
          findMany: async () => [{ id: 'prop-101', updatedAt: new Date() }],
        },
      });
    } catch {
      return fallback;
    }
  }),
}));

describe('Dynamic SEO Sitemap Generator', () => {
  it('returns valid MetadataRoute.Sitemap array containing static and property routes', async () => {
    const result = await sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(4);

    const urls = result.map((item) => item.url);
    expect(urls).toContain('https://whitecaves.ae');
    expect(urls).toContain('https://whitecaves.ae/properties');
    expect(urls).toContain('https://whitecaves.ae/off-plan');
    expect(urls).toContain('https://whitecaves.ae/properties/prop-101');
  });
});
