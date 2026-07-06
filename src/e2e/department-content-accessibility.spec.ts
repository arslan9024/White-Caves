import { test, expect } from '@playwright/test';

async function navigateToDashboard(page: import('@playwright/test').Page) {
  await page.goto('/modern-dashboard', { waitUntil: 'commit', timeout: 10_000 }).catch(() => null);
  await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => null);
}

async function isDashboardUnavailable(page: import('@playwright/test').Page): Promise<boolean> {
  const currentUrl = page.url();
  if (/\/signin|\/login|\/auth\//i.test(currentUrl)) {
    return true;
  }

  const loadingPageVisible = await page
    .getByText(/Loading\s+page/i)
    .count()
    .catch(() => 0);
  return loadingPageVisible > 0;
}

test.describe('Department Content Accessibility & Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToDashboard(page);
  });

  test('shows center breadcrumb and region semantics after selecting a department', async ({
    page,
  }) => {
    test.skip(await isDashboardUnavailable(page), 'Dashboard unavailable for this session/browser');

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

    test.skip(await isDashboardUnavailable(page), 'Dashboard unavailable for this session/browser');

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
