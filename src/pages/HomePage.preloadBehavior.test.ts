import { afterEach, describe, expect, it } from 'vitest';
import { cleanupHomepageHeroPreload, ensureHomepageHeroPreload } from './homePagePreload';

describe('HomePage hero preload behavior', () => {
  afterEach(() => {
    cleanupHomepageHeroPreload();
  });

  it('adds exactly one preload link and reuses it across repeated ensure calls', () => {
    const first = ensureHomepageHeroPreload();
    const second = ensureHomepageHeroPreload();

    const links = document.head.querySelectorAll('link#homepage-hero-preload');

    expect(first).toBe(second);
    expect(links).toHaveLength(1);
    expect(first.rel).toBe('preload');
    expect(first.as).toBe('image');
    expect(first.getAttribute('href')).toBe('/images/dubai-skyline.jpg');
  });

  it('removes preload link on cleanup', () => {
    ensureHomepageHeroPreload();
    cleanupHomepageHeroPreload();

    const link = document.head.querySelector('link#homepage-hero-preload');
    expect(link).toBeNull();
  });
});
