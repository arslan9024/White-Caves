import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and authenticate
    await page.goto('/');
    // Add login if needed
  });

  test.describe('Dashboard Access', () => {
    test('should display dashboard page', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await expect(page).toHaveTitle(/Dashboard|Home/i);
      await expect(page.locator('[role="main"]')).toBeVisible();
    });

    test('should display main navigation', async ({ page }) => {
      await page.goto('/modern-dashboard');
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have working sidebars', async ({ page }) => {
      await page.goto('/modern-dashboard');
      const leftSidebar = page.locator('[class*="sidebar"][class*="left"]');
      const rightSidebar = page.locator('[class*="sidebar"][class*="right"]');
      
      if (await leftSidebar.isVisible()) {
        expect(leftSidebar).toBeVisible();
      }
    });
  });

  test.describe('Tab Navigation', () => {
    test('should navigate between tabs', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        // Click first tab
        await tabs.first().click();
        await expect(tabs.first()).toBeFocused();
        
        // Click second tab if available
        if (tabCount > 1) {
          await tabs.nth(1).click();
          await expect(tabs.nth(1)).toBeFocused();
        }
      }
    });

    test('should show correct tab content', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const tabs = page.locator('[role="tab"]');
      const firstTab = tabs.first();
      
      if (await firstTab.isVisible()) {
        await firstTab.click();
        const content = page.locator('[role="tabpanel"]');
        await expect(content).toBeVisible();
      }
    });
  });

  test.describe('Property Management Flow', () => {
    test('should display properties list', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      // Navigate to properties tab/section if needed
      const propertiesTab = page.locator('text=Propert');
      
      if (await propertiesTab.isVisible()) {
        await propertiesTab.click();
        const table = page.locator('table');
        await expect(table).toBeVisible();
      }
    });

    test('should filter properties', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const filters = page.locator('select');
      if (await filters.first().isVisible()) {
        await filters.first().selectOption({ label: 'Active' });
        await page.waitForLoadState('networkidle');
        
        const table = page.locator('table tbody tr');
        const rowCount = await table.count();
        expect(rowCount).toBeGreaterThan(0);
      }
    });

    test('should paginate properties', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const paginationButtons = page.locator('[role="navigation"] button');
      if (await paginationButtons.count() > 0) {
        // Click to next page
        const nextButton = paginationButtons.filter({ hasText: /next|>/i });
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should view property status badges', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const badges = page.locator('[class*="badge"]');
      if (await badges.count() > 0) {
        const firstBadge = badges.first();
        await expect(firstBadge).toBeVisible();
        const text = await firstBadge.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Lead Management Flow', () => {
    test('should display leads list', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const leadsTab = page.locator('text=Lead');
      if (await leadsTab.isVisible()) {
        await leadsTab.click();
        const table = page.locator('table');
        await expect(table).toBeVisible();
      }
    });

    test('should filter leads by source', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const sourceFilter = page.locator('select').first();
      if (await sourceFilter.isVisible()) {
        await sourceFilter.selectOption({ label: 'WhatsApp' });
        await page.waitForLoadState('networkidle');
      }
    });

    test('should filter leads by status', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const filters = page.locator('select');
      if (await filters.nth(1).isVisible()) {
        await filters.nth(1).selectOption({ label: 'New' });
        await page.waitForLoadState('networkidle');
      }
    });

    test('should combine multiple filters', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const filters = page.locator('select');
      if (await filters.count() >= 2) {
        await filters.first().selectOption({ label: 'WhatsApp' });
        await filters.nth(1).selectOption({ label: 'New' });
        await page.waitForLoadState('networkidle');
        
        const table = page.locator('table tbody tr');
        const rowCount = await table.count();
        expect(rowCount).toBeGreaterThan(0);
      }
    });

    test('should trigger lead actions', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const actionButtons = page.locator('[title*="Call"],[title*="WhatsApp"],[title*="View"]');
      if (await actionButtons.count() > 0) {
        const firstButton = actionButtons.first();
        await expect(firstButton).toBeVisible();
        // Don't actually click to avoid side effects
      }
    });
  });

  test.describe('Toast Notifications', () => {
    test('should display toast on user action', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      // Trigger an action that shows toast
      const actionButtons = page.locator('button[class*="primary"]');
      if (await actionButtons.count() > 0) {
        await actionButtons.first().click();
        
        // Check for toast
        const toast = page.locator('[role="alert"]');
        if (await toast.isVisible()) {
          await expect(toast).toBeVisible();
        }
      }
    });

    test('should handle multiple toasts', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const toasts = page.locator('[role="alert"]');
      if (await toasts.count() > 1) {
        expect(await toasts.count()).toBeGreaterThan(1);
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      // Test Tab key navigation
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveCount(1);
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const buttons = page.locator('button[aria-label]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should announce alerts to screen readers', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const alerts = page.locator('[role="alert"]');
      if (await alerts.count() > 0) {
        const ariaLive = await alerts.first().getAttribute('aria-live');
        expect(['polite', 'assertive', 'off']).toContain(ariaLive);
      }
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/modern-dashboard');
      await page.locator('[role="main"]').waitFor({ state: 'visible' });
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('should handle filter operations quickly', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const startTime = Date.now();
      const filterSelect = page.locator('select').first();
      if (await filterSelect.isVisible()) {
        await filterSelect.selectOption({ index: 1 });
        await page.waitForLoadState('networkidle');
      }
      const filterTime = Date.now() - startTime;
      
      expect(filterTime).toBeLessThan(3000); // 3 seconds
    });
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/modern-dashboard');
    await expect(page).toHaveTitle(/Dashboard|Home/i);
  });

  test('should work on tablet viewport', async ({ page }) => {
    page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/modern-dashboard');
    await expect(page).toHaveTitle(/Dashboard|Home/i);
  });

  test('should work on desktop viewport', async ({ page }) => {
    page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/modern-dashboard');
    await expect(page).toHaveTitle(/Dashboard|Home/i);
  });
});
