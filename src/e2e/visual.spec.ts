import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing', () => {
  test('Dashboard page visual comparison', async ({ page }) => {
    // Navigate to the main application page
    await page.goto('/');

    // Wait for critical elements to ensure page is loaded
    await page.waitForLoadState('networkidle');

    // Take full page screenshot and compare with baseline
    // The maxDiffPixelRatio allows up to 1% difference across browsers
    await expect(page).toHaveScreenshot('dashboard-full-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01, 
      animations: 'disabled'
    });
  });

  test('Property details modal visual comparison', async ({ page }) => {
    await page.goto('/crm');
    await page.waitForLoadState('networkidle');

    // Take screenshot of the CRM Hub
    await expect(page).toHaveScreenshot('crm-hub-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled'
    });
  });
});
