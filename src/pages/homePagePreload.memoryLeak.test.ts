import { afterEach, describe, expect, it } from 'vitest';
import { cleanupHomepageHeroPreload, ensureHomepageHeroPreload } from './homePagePreload';

/**
 * Homepage Preload Memory Leak Regression
 * Ensures that repeatedly mounting/unmounting homepage doesn't accumulate stale preload links.
 * This guards against accidental ref leaks where preload links are created but not cleaned up.
 */
describe('Homepage hero preload memory safety', () => {
  afterEach(() => {
    // Clean up all preload links between tests
    document.querySelectorAll('link#homepage-hero-preload').forEach(link => link.remove());
  });

  it('does not accumulate preload links on repeated mounts and unmounts', () => {
    const iterations = 10;

    for (let i = 0; i < iterations; i++) {
      // Simulate mount: ensure preload link exists
      ensureHomepageHeroPreload();
      let links = document.head.querySelectorAll('link#homepage-hero-preload');
      expect(links).toHaveLength(1, `Iteration ${i}: Expected exactly 1 link after mount`);

      // Simulate unmount: cleanup preload link
      cleanupHomepageHeroPreload();
      links = document.head.querySelectorAll('link#homepage-hero-preload');
      expect(links).toHaveLength(0, `Iteration ${i}: Expected 0 links after cleanup`);
    }
  });

  it('handles rapid succession ensure/cleanup cycles without leaks', () => {
    const rapidCycles = 50;

    for (let i = 0; i < rapidCycles; i++) {
      ensureHomepageHeroPreload();
    }

    // Despite 50 ensure calls, only 1 link should exist (idempotent)
    let links = document.head.querySelectorAll('link#homepage-hero-preload');
    expect(links).toHaveLength(1);

    // Clean up once
    cleanupHomepageHeroPreload();

    // All links should be gone
    links = document.head.querySelectorAll('link#homepage-hero-preload');
    expect(links).toHaveLength(0);
  });
});
