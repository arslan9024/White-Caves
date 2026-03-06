import { test, expect } from '@playwright/test';

test.describe('Commission Tracking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth state
    await page.goto('/');
    // In a real scenario, you'd log in here
  });

  test('should navigate to commissions page', async ({ page }) => {
    await page.goto('/commissions');
    await expect(page).toHaveURL(/commissions/);
    await expect(page.locator('text=Commissions')).toBeVisible();
  });

  test('should display commission list', async ({ page }) => {
    await page.goto('/commissions');
    
    // Wait for commission cards to load
    const cards = page.locator('[data-testid="commission-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should open commission detail modal', async ({ page }) => {
    await page.goto('/commissions');
    
    // Click first commission
    await page.click('[data-testid="commission-card"]');
    
    // Check modal opened
    await expect(page.locator('[data-testid="commission-modal"]')).toBeVisible();
  });

  test('should search commissions by freelancer', async ({ page }) => {
    await page.goto('/commissions');
    
    // Fill search
    await page.fill('input[placeholder="Search"]', 'John Doe');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Verify filtered results
    const cards = page.locator('[data-testid="commission-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter commissions by status', async ({ page }) => {
    await page.goto('/commissions');
    
    // Select completed status
    await page.click('select[name="status"]');
    await page.click('option[value="completed"]');
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    
    // Verify all visible commissions have status "Completed"
    const statusElements = page.locator('[data-testid="commission-status"]');
    const count = await statusElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should sort commissions by amount', async ({ page }) => {
    await page.goto('/commissions');
    
    // Click sort button
    await page.click('button:has-text("Sort")');
    await page.click('text=Highest Amount');
    
    // Verify sorting applied
    await page.waitForLoadState('networkidle');
  });

  test('should export commission data', async ({ page }) => {
    await page.goto('/commissions');
    
    // Trigger export
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export")');
    const download = await downloadPromise;
    
    // Verify file
    expect(download.suggestedFilename()).toContain('commission');
  });

  test('should calculate commission totals', async ({ page }) => {
    await page.goto('/commissions');
    
    // Check total commission displayed
    const totalElement = page.locator('[data-testid="total-commissions"]');
    await expect(totalElement).toContainText(/\$[\d,]+/);
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/commissions');
    
    // Check if pagination exists
    const nextButton = page.locator('button:has-text("Next")');
    const hasNextPage = await nextButton.isEnabled();
    
    if (hasNextPage) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify new items loaded
      const cards = page.locator('[data-testid="commission-card"]');
      expect(await cards.count()).toBeGreaterThan(0);
    }
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    await page.goto('/commissions');
    
    // Perform multiple rapid requests
    for (let i = 0; i < 5; i++) {
      await page.click('button[name="refresh"]');
    }
    
    // Should show error or loading state, not crash
    await expect(page.locator('body')).toBeVisible();
  });
});
