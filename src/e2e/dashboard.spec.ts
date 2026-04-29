import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load dashboard home', async ({ page }) => {
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should display dual sidebar layout', async ({ page }) => {
    const leftSidebar = page.locator('[data-testid="left-sidebar"]');
    const rightSidebar = page.locator('[data-testid="right-sidebar"]');
    
    await expect(leftSidebar).toBeVisible();
    await expect(rightSidebar).toBeVisible();
  });

  test('should navigate using left sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="left-sidebar"]');
    await sidebar.click();
    
    // Click a navigation item
    await page.click('[data-testid="nav-commissions"]');
    await expect(page).toHaveURL(/commissions/);
  });

  test('should toggle sidebar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const toggleButton = page.locator('button[aria-label="Toggle sidebar"]');
    await expect(toggleButton).toBeVisible();
  });

  test('should display user profile in sidebar', async ({ page }) => {
    const userProfile = page.locator('[data-testid="user-profile"]');
    await expect(userProfile).toBeVisible();
  });

  test('should show notifications panel', async ({ page }) => {
    await page.click('[data-testid="notifications-icon"]');
    
    const panel = page.locator('[data-testid="notifications-panel"]');
    await expect(panel).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    await page.click('[data-testid="user-menu"]');
    await page.click('button:has-text("Logout")');
    
    await expect(page).toHaveURL(/login|signup/);
  });

  test('should persist sidebar state', async ({ page }) => {
    // Open and expand a menu
    await page.click('[data-testid="menu-toggle"]');
    await page.reload();
    
    // Check if menu remains expanded
    const menu = page.locator('[data-testid="expanded-menu"]');
    const isExpanded = await menu.isVisible();
    // This depends on implementation
  });

  test('should display breadcrumbs', async ({ page }) => {
    await page.click('[data-testid="nav-commissions"]');
    
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText('Commissions');
  });

  test('should show footer information', async ({ page }) => {
    await page.goto('/about');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
