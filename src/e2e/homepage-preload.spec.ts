import { test, expect } from '@playwright/test';

/**
 * Homepage Preload E2E Test
 * Validates that the hero image preload link is:
 * 1. Present in the DOM when on the homepage
 * 2. Removed from the DOM when navigating away
 * 3. Re-added when navigating back to the homepage
 */

test.describe('Homepage hero preload link (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });

    await page.exposeFunction('getCollectedConsoleErrors', () => consoleErrors);
  });

  test('should add preload link on homepage and remove it on navigation', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that the preload link exists
    const preloadLink = page.locator('link#homepage-hero-preload');
    await expect(preloadLink).toHaveCount(1);

    // Verify preload link attributes
    await expect(preloadLink).toHaveAttribute('rel', 'preload');
    await expect(preloadLink).toHaveAttribute('as', 'image');
    await expect(preloadLink).toHaveAttribute('href', '/images/dubai-skyline.jpg');

    // Navigate to a different route (About page if available, or Properties)
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Check that the preload link is removed
    const preloadLinkAfterNav = page.locator('link#homepage-hero-preload');
    await expect(preloadLinkAfterNav).toHaveCount(0);

    // Navigate back to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that the preload link is re-added
    const preloadLinkAfterReturn = page.locator('link#homepage-hero-preload');
    await expect(preloadLinkAfterReturn).toHaveCount(1);

    const runtimeErrors = (await page.evaluate(async () =>
      (
        window as unknown as { getCollectedConsoleErrors: () => Promise<string[]> }
      ).getCollectedConsoleErrors()
    )) as string[];
    expect(runtimeErrors).toEqual([]);
  });

  test('should not have preload link on non-homepage routes', async ({ page }) => {
    // Navigate directly to a non-homepage route
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Check that the preload link does not exist
    const preloadLink = page.locator('link#homepage-hero-preload');
    await expect(preloadLink).toHaveCount(0);

    const runtimeErrors = (await page.evaluate(async () =>
      (
        window as unknown as { getCollectedConsoleErrors: () => Promise<string[]> }
      ).getCollectedConsoleErrors()
    )) as string[];
    expect(runtimeErrors).toEqual([]);
  });
});
