import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SRC_ROOT, '..');

describe('Runtime stability regressions', () => {
  it('keeps hero preload route-scoped instead of globally preloading in index.html', () => {
    const indexHtml = fs.readFileSync(path.resolve(REPO_ROOT, 'index.html'), 'utf8');
    const homePageSource = fs.readFileSync(path.resolve(SRC_ROOT, 'pages/HomePage.tsx'), 'utf8');
    const preloadHelperSource = fs.readFileSync(
      path.resolve(SRC_ROOT, 'pages/homePagePreload.ts'),
      'utf8'
    );

    expect(indexHtml).not.toContain('rel="preload"');
    expect(indexHtml).not.toContain('/images/dubai-skyline.jpg');

    expect(homePageSource).toContain('ensureHomepageHeroPreload()');
    expect(homePageSource).toContain('cleanupHomepageHeroPreload()');

    expect(preloadHelperSource).toContain(
      "const HOMEPAGE_HERO_PRELOAD_ID = 'homepage-hero-preload'"
    );
    expect(preloadHelperSource).toContain(
      "const HOMEPAGE_HERO_IMAGE = '/images/dubai-skyline.jpg'"
    );
    expect(preloadHelperSource).toContain("preloadLink.rel = 'preload'");
    expect(preloadHelperSource).toContain("preloadLink.as = 'image'");
    expect(preloadHelperSource).toContain('preloadLink.href = HOMEPAGE_HERO_IMAGE');
  });

  it('keeps Redux dev middleware warn thresholds configured to reduce console noise', () => {
    const storeSource = fs.readFileSync(path.resolve(SRC_ROOT, 'store/store.tsx'), 'utf8');

    expect(storeSource).toContain('const DEV_MIDDLEWARE_WARN_AFTER_MS = 128');
    expect(storeSource).toContain('serializableCheck: {');
    expect(storeSource).toContain('immutableCheck: {');
    expect(storeSource).toContain('warnAfter: DEV_MIDDLEWARE_WARN_AFTER_MS');
  });
});
