import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing', () => {
  test('Homepage hero visual comparison', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.getByTestId('hero-section');
    await expect(hero).toBeVisible();
    await expect(hero).toHaveScreenshot('homepage-hero.png', {
      mask: [hero.locator('.luxury-hero__stats')],
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      timeout: 15_000,
    });
  });

  test('Property details modal visual comparison', async ({ page }) => {
    await page.goto('/crm');
    await page.waitForLoadState('networkidle');

    // Take screenshot of the CRM Hub
    await expect(page).toHaveScreenshot('crm-hub-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      timeout: 15_000,
    });
  });
});
