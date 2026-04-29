import { describe, expect, it } from 'vitest';
import {
  buildRobotsTxt,
  buildSitemapXml,
  resolveDomain,
} from '../../scripts/generate-seo-assets.js';

describe('generate-seo-assets script helpers', () => {
  it('builds robots.txt with provided domain', () => {
    const txt = buildRobotsTxt({ domain: 'https://whitecaves.com' });
    expect(txt).toContain('Sitemap: https://whitecaves.com/sitemap.xml');
    expect(txt).toContain('Disallow: /api/');
  });

  it('builds sitemap xml with routes + date', () => {
    const xml = buildSitemapXml({
      domain: 'https://whitecaves.com',
      today: '2026-04-26',
      routes: [
        { path: '/', changefreq: 'daily', priority: '1.0' },
        { path: '/properties', changefreq: 'daily', priority: '0.9' },
      ],
    });

    expect(xml).toContain('<loc>https://whitecaves.com/</loc>');
    expect(xml).toContain('<loc>https://whitecaves.com/properties</loc>');
    expect(xml).toContain('<lastmod>2026-04-26</lastmod>');
  });

  it('resolveDomain strips trailing slash', () => {
    expect(resolveDomain('https://whitecaves.com/')).toBe('https://whitecaves.com');
  });
});
