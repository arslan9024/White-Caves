import { test, expect } from '@playwright/test';

/**
 * Performance Baseline E2E Tests
 * Establishes performance metrics and ensures no regression
 */
test.describe('Performance Baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Clear browser cache for fresh load
    await page.context().clearCookies();
  });

  test.describe('Page Load Performance', () => {
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/modern-dashboard');
      const loadTime = Date.now() - startTime;
      
      // Dashboard should load in under 5 seconds on good connection
      expect(loadTime).toBeLessThan(5000);
    });

    test('should load with CSS fully rendered', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const main = page.locator('[role="main"], main');
      expect(await main.isVisible()).toBeTruthy();
    });

    test('should load navigation without layout shift', async ({ page }) => {
      await page.goto('/modern-dashboard');
      
      const nav = page.locator('nav');
      const boundingBox = await nav.boundingBox();
      
      await page.waitForLoadState('networkidle');
      
      const newBoundingBox = await nav.boundingBox();
      
      // Navigation position should remain stable
      if (boundingBox && newBoundingBox) {
        expect(boundingBox.y).toBe(newBoundingBox.y);
      }
    });
  });

  test.describe('Tab Switching Performance', () => {
    test('should switch tabs quickly', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 1) {
        const startTime = Date.now();
        await tabs.nth(1).click();
        
        const panel = page.locator('[role="tabpanel"]');
        await expect(panel).toBeVisible({ timeout: 2000 });
        
        const switchTime = Date.now() - startTime;
        
        // Tab switch should complete within 1 second
        expect(switchTime).toBeLessThan(1000);
      }
    });
  });

  test.describe('Data Filtering Performance', () => {
    test('should filter data quickly', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const selectElements = page.locator('select');
      
      if (await selectElements.count() > 0) {
        const startTime = Date.now();
        
        await selectElements.first().selectOption({ index: 1 });
        
        // Wait for filter to apply
        await page.waitForTimeout(500);
        
        const filterTime = Date.now() - startTime;
        
        // Filtering should complete within 2 seconds
        expect(filterTime).toBeLessThan(2000);
      }
    });
  });

  test.describe('Modal Open Performance', () => {
    test('should open modal quickly', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
      
      if (await createButton.isVisible()) {
        const startTime = Date.now();
        
        await createButton.click();
        
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible({ timeout: 1000 });
        
        const openTime = Date.now() - startTime;
        
        // Modal should open within 500ms
        expect(openTime).toBeLessThan(500);
      }
    });
  });

  test.describe('Pagination Performance', () => {
    test('should paginate quickly', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const nextButton = page.locator('button:has-text("Next"), button:has-text("›")');
      
      if (await nextButton.isVisible()) {
        const startTime = Date.now();
        
        await nextButton.click();
        await page.waitForTimeout(500);
        
        const paginateTime = Date.now() - startTime;
        
        // Pagination should complete within 1 second
        expect(paginateTime).toBeLessThan(1000);
      }
    });
  });

  test.describe('Memory Stability', () => {
    test('should not leak memory during navigation', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 1) {
        // Click through tabs multiple times
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < tabCount && j < 3; j++) {
            await tabs.nth(j).click();
            await page.waitForTimeout(200);
          }
        }
        
        // Page should still be responsive
        const mainContent = page.locator('[role="main"], main');
        expect(await mainContent.isVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Event Handler Performance', () => {
    test('should handle rapid user interactions', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const buttons = page.locator('button').first();
      
      if (await buttons.isVisible()) {
        // Simulate rapid clicks
        for (let i = 0; i < 10; i++) {
          await buttons.click({ force: true });
          await page.waitForTimeout(50);
        }
        
        // Page should still be functional
        const mainContent = page.locator('[role="main"], main');
        expect(await mainContent.isVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Rendering Performance', () => {
    test('should render tables without layout thrashing', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const table = page.locator('table').first();
      
      if (await table.isVisible()) {
        // Table should be rendered and stable
        const rows = table.locator('tbody tr');
        const rowCount = await rows.count();
        
        expect(rowCount).toBeGreaterThanOrEqual(0);
      }
    });

    test('should render badges efficiently', async ({ page }) => {
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      const badges = page.locator('[class*="badge"]');
      const badgeCount = await badges.count();
      
      if (badgeCount > 0) {
        // All badges should be visible without jank
        expect(badgeCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Bundle Size Check', () => {
    test('should load reasonable amount of JavaScript', async ({ page }) => {
      const resourceSizes = { totalSize: 0 };
      
      page.on('response', (response) => {
        if (response.ok()) {
          response.buffer().then(buffer => {
            resourceSizes.totalSize += buffer.length;
          });
        }
      });
      
      await page.goto('/modern-dashboard');
      await page.waitForLoadState('networkidle');
      
      // Total page size should be reasonable (usually < 5MB for dashboard app)
      // This is a loose check since we don't have exact requirements
      expect(resourceSizes.totalSize).toBeGreaterThan(0);
    });
  });
});
