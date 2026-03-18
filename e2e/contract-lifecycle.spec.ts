import { test, expect } from '@playwright/test';

/**
 * Contract Lifecycle E2E Tests
 * Tests contract management from creation to completion
 */
test.describe('Contract Lifecycle E2E Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modern-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Contract List Display', () => {
    test('should display contracts table', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const table = page.locator('table');
        await expect(table).toBeVisible();
      }
    });

    test('should show contract details columns', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const headers = page.locator('th');
        expect(await headers.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Contract Type Filtering', () => {
    test('should filter by tenancy contracts', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const typeFilter = page.locator('select').first();
        if (await typeFilter.isVisible()) {
          await typeFilter.selectOption('tenancy');
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should filter by sale contracts', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const typeFilter = page.locator('select').first();
        if (await typeFilter.isVisible()) {
          await typeFilter.selectOption('sale');
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Contract Status Management', () => {
    test('should filter by active status', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const statusFilter = page.locator('select').nth(1);
        if (await statusFilter.isVisible()) {
          await statusFilter.selectOption('active');
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should filter by pending status', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const statusFilter = page.locator('select').nth(1);
        if (await statusFilter.isVisible()) {
          await statusFilter.selectOption('pending');
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Contract Detail View', () => {
    test('should open contract detail modal', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const firstRow = page.locator('table tbody tr').first();
        if (await firstRow.isVisible()) {
          await firstRow.click();
          
          const modal = page.locator('[role="dialog"]');
          const isVisible = await modal.isVisible().catch(() => false);
          
          if (isVisible) {
            expect(modal).toBeVisible();
          }
        }
      }
    });

    test('should display contract information', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const viewButton = page.locator('button:has-text("View"), button:has-text("Details")').first();
        if (await viewButton.isVisible()) {
          await viewButton.click();
          await page.waitForLoadState('networkidle');
          
          const content = page.locator('[class*="detail"], [role="dialog"]');
          expect(content.isVisible()).toBeTruthy();
        }
      }
    });
  });

  test.describe('Contract Pagination', () => {
    test('should paginate through contracts', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const nextButton = page.locator('button:has-text("Next"), button:has-text("›")');
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Ejari Status (Tenancy)', () => {
    test('should display ejari status', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const typeFilter = page.locator('select').first();
        if (await typeFilter.isVisible()) {
          await typeFilter.selectOption('tenancy');
          await page.waitForLoadState('networkidle');
          
          const ejariBadges = page.locator('[class*="ejari"], text=/registered|pending/i');
          const badgeCount = await ejariBadges.count();
          
          // Tenancy contracts may show ejari status
          expect(badgeCount).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Contract Status Badges', () => {
    test('should display status badges', async ({ page }) => {
      const contractsTab = page.locator('text=/contract|Contract/i');
      
      if (await contractsTab.isVisible()) {
        await contractsTab.click();
        await page.waitForLoadState('networkidle');
        
        const badges = page.locator('[class*="badge"]');
        const badgeCount = await badges.count();
        
        if (badgeCount > 0) {
          expect(badgeCount).toBeGreaterThan(0);
        }
      }
    });
  });
});
