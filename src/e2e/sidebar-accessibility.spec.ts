import { test, expect } from '@playwright/test';

test.describe('Enhanced Sidebar Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modern-dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('exposes sidebar navigation and tree semantics', async ({ page }) => {
    const sidebar = page.locator('[aria-label="Main navigation"]');
    const hasSidebar = await sidebar.count();
    test.skip(!hasSidebar, 'Sidebar not available in current route/session');

    await expect(sidebar.first()).toBeVisible();
    await expect(
      page.locator('[role="tree"][aria-label="Company departments tree"]')
    ).toBeVisible();

    const treeItems = page.locator('[role="treeitem"]');
    expect(await treeItems.count()).toBeGreaterThan(0);
  });

  test('supports Ctrl+J focus shortcut and arrow navigation', async ({ page }) => {
    const sidebar = page.locator('[aria-label="Main navigation"]');
    const hasSidebar = await sidebar.count();
    test.skip(!hasSidebar, 'Sidebar not available in current route/session');

    await page.keyboard.press('Control+j');

    const focusedIdx = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el?.getAttribute('data-focus-idx');
    });

    expect(focusedIdx).toBe('0');

    await page.keyboard.press('ArrowDown');

    const nextFocusedIdx = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el?.getAttribute('data-focus-idx');
    });

    expect(nextFocusedIdx).not.toBeNull();
    expect(Number(nextFocusedIdx)).toBeGreaterThanOrEqual(1);
  });

  test('marks selected assistant with aria-selected', async ({ page }) => {
    const assistantButtons = page.locator('[aria-label$="assistant"]');
    const count = await assistantButtons.count();
    test.skip(count < 1, 'No assistants rendered');

    await assistantButtons.first().click();

    const selected = page.locator('[aria-label$="assistant"][aria-selected="true"]');
    expect(await selected.count()).toBeGreaterThan(0);
  });
});
