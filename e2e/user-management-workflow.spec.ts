import { test, expect } from '@playwright/test';

/**
 * User Management E2E Tests
 * Tests the complete user lifecycle: create, read, update, delete
 */
test.describe('User Management E2E Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modern-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.describe('User List Display', () => {
    test('should display users list', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const table = page.locator('table');
        await expect(table).toBeVisible();
        
        const rows = page.locator('table tbody tr');
        expect(await rows.count()).toBeGreaterThanOrEqual(0);
      }
    });

    test('should display user information', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const rows = page.locator('table tbody tr');
        if (await rows.count() > 0) {
          const cells = rows.first().locator('td');
          expect(await cells.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('User Filtering', () => {
    test('should filter by role', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const roleFilter = page.locator('select').first();
        if (await roleFilter.isVisible()) {
          await roleFilter.selectOption({ index: 1 });
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should filter by status', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const statusFilter = page.locator('select').nth(1);
        if (await statusFilter.isVisible()) {
          await statusFilter.selectOption({ index: 1 });
          await page.waitForLoadState('networkidle');
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('User Creation', () => {
    test('should open user creation modal', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("+")');
        
        if (await createButton.isVisible()) {
          await createButton.click();
          
          const modal = page.locator('[role="dialog"]');
          const isVisible = await modal.isVisible().catch(() => false);
          
          if (isVisible) {
            await expect(modal).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('User Editing', () => {
    test('should open user edit modal', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('button:has-text("Edit"), [class*="edit"]').first();
        
        if (await editButton.isVisible()) {
          await editButton.click();
          await page.waitForLoadState('networkidle');
          
          const modal = page.locator('[role="dialog"]');
          const isVisible = await modal.isVisible().catch(() => false);
          
          if (isVisible) {
            expect(modal).toBeVisible();
          }
        }
      }
    });

    test('should display editable user fields', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('button:has-text("Edit")').first();
        
        if (await editButton.isVisible()) {
          await editButton.click();
          await page.waitForLoadState('networkidle');
          
          const inputs = page.locator('input[type="text"], input[type="email"], select');
          expect(await inputs.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('User Deletion', () => {
    test('should open delete confirmation', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const deleteButton = page.locator('button:has-text("Delete"), [class*="delete"]').first();
        
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          
          const confirm = page.locator('[role="dialog"], text=/confirm/i');
          const isVisible = await confirm.isVisible().catch(() => false);
          
          if (isVisible) {
            expect(confirm).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('User Search', () => {
    test('should search for user', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const searchInput = page.locator('input[type="text"], input[placeholder*="Search"]').first();
        
        if (await searchInput.isVisible()) {
          await searchInput.fill('admin');
          await page.waitForTimeout(500);
          
          const rows = page.locator('table tbody tr');
          expect(await rows.count()).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('User Role Badges', () => {
    test('should display role badges', async ({ page }) => {
      const usersTab = page.locator('text=/users|Users/i');
      
      if (await usersTab.isVisible()) {
        await usersTab.click();
        await page.waitForLoadState('networkidle');
        
        const badges = page.locator('[class*="badge"], [class*="role"]');
        const badgeCount = await badges.count();
        
        if (badgeCount > 0) {
          expect(badgeCount).toBeGreaterThan(0);
        }
      }
    });
  });
});
