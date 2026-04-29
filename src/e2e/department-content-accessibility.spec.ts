import { test, expect } from '@playwright/test';

test.describe('Department Content Accessibility & Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modern-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('shows center breadcrumb and region semantics after selecting a department', async ({ page }) => {
    const departmentItems = page.locator('[role="treeitem"]');
    const hasDepartments = await departmentItems.count();
    test.skip(!hasDepartments, 'No department items available to select');

    await departmentItems.first().click();

    const centerRegion = page.locator('[role="region"][aria-label*="department content"]');
    await expect(centerRegion.first()).toBeVisible();

    const breadcrumb = page.locator('[aria-label="Center content breadcrumb"]');
    await expect(breadcrumb.first()).toBeVisible();

    await expect(page.locator('[aria-current="page"]').first()).toBeVisible();
  });

  test('supports keyboard service-card activation on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const departmentItems = page.locator('[role="treeitem"]');
    const hasDepartments = await departmentItems.count();
    test.skip(!hasDepartments, 'No department items available to select');

    await departmentItems.first().click();

    const serviceCards = page.locator('[role="button"][aria-label^="Open "]');
    const serviceCount = await serviceCards.count();
    test.skip(!serviceCount, 'No service cards available');

    await serviceCards.first().focus();
    await page.keyboard.press('Space');

    await expect(page.locator('h3:has-text("Quick Actions")').first()).toBeVisible();
  });
});
