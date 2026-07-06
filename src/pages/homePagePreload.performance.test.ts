import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Homepage Preload Performance Regression
 * Validates that the route-scoped preload strategy is in place and configured correctly.
 * This ensures the LCP optimization for homepage hero image is maintained.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_ROOT = path.resolve(__dirname, '..');

describe('Homepage preload performance regression', () => {
  it('validates route-scoped preload helper is exported and properly configured', () => {
    const preloadHelperSource = fs.readFileSync(
      path.resolve(SRC_ROOT, 'pages/homePagePreload.ts'),
      'utf8'
    );

    // Verify the preload helper module exists and exports the functions
    expect(preloadHelperSource).toContain('export const ensureHomepageHeroPreload');
    expect(preloadHelperSource).toContain('export const cleanupHomepageHeroPreload');

    // Verify it targets the correct image for LCP preload
    expect(preloadHelperSource).toContain("'/images/dubai-skyline.jpg'");

    // Verify the link attributes are set correctly for image preload
    expect(preloadHelperSource).toContain("rel = 'preload'");
    expect(preloadHelperSource).toContain("as = 'image'");
  });

  it('confirms homepage mounts with preload effect (no global preload)', () => {
    const homePageSource = fs.readFileSync(path.resolve(SRC_ROOT, 'pages/HomePage.tsx'), 'utf8');

    // Verify HomePage uses the preload helper functions
    expect(homePageSource).toContain('ensureHomepageHeroPreload()');
    expect(homePageSource).toContain('cleanupHomepageHeroPreload()');

    // Verify no global preload constants in HomePage (they're in the helper)
    expect(homePageSource).not.toContain("HOMEPAGE_HERO_PRELOAD_ID = 'homepage-hero-preload'");
  });

  it('ensures index.html does not have a global preload (route-scoped only)', () => {
    const indexHtml = fs.readFileSync(path.resolve(SRC_ROOT, '..', 'index.html'), 'utf8');

    // Verify no global preload in index.html (performance regression guard)
    expect(indexHtml).not.toContain('rel="preload"');
    expect(indexHtml).not.toContain('/images/dubai-skyline.jpg');
  });
});
