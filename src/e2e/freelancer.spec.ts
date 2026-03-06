import { test, expect } from '@playwright/test';

test.describe('Freelancer Search & Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/freelancers');
  });

  test('should display freelancer list', async ({ page }) => {
    await expect(page.locator('text=Freelancers')).toBeVisible();
    const cards = page.locator('[data-testid="freelancer-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should search freelancers by name', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'John');
    await page.waitForLoadState('networkidle');
    
    const cards = page.locator('[data-testid="freelancer-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('should filter freelancers by skill', async ({ page }) => {
    await page.click('[data-testid="filter-button"]');
    await page.click('label:has-text("React")');
    await page.waitForLoadState('networkidle');
    
    const cards = page.locator('[data-testid="freelancer-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('should sort freelancers by rating', async ({ page }) => {
    await page.click('select[name="sort"]');
    await page.click('option[value="rating"]');
    await page.waitForLoadState('networkidle');
    
    const ratings = page.locator('[data-testid="freelancer-rating"]');
    const count = await ratings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should open freelancer profile', async ({ page }) => {
    await page.click('[data-testid="freelancer-card"]');
    await expect(page).toHaveURL(/freelancers\/\d+/);
    await expect(page.locator('[data-testid="freelancer-profile"]')).toBeVisible();
  });

  test('should display freelancer stats', async ({ page }) => {
    await page.click('[data-testid="freelancer-card"]');
    
    await expect(page.locator('[data-testid="total-projects"]')).toContainText(/\d+/);
    await expect(page.locator('[data-testid="total-earnings"]')).toContainText(/\$/);
    await expect(page.locator('[data-testid="completion-rate"]')).toContainText(/%/);
  });

  test('should manage freelancer clients', async ({ page }) => {
    await page.click('[data-testid="freelancer-card"]');
    await page.click('button:has-text("Clients")');
    
    const clientList = page.locator('[data-testid="client-list"]');
    await expect(clientList).toBeVisible();
  });

  test('should add new client', async ({ page }) => {
    await page.click('[data-testid="freelancer-card"]');
    await page.click('button:has-text("Add Client")');
    
    const modal = page.locator('[data-testid="client-modal"]');
    await expect(modal).toBeVisible();
    
    await page.fill('input[name="clientName"]', 'New Client Inc');
    await page.fill('input[name="email"]', 'contact@newclient.com');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=Client added successfully')).toBeVisible();
  });

  test('should edit freelancer rates', async ({ page }) => {
    await page.click('[data-testid="freelancer-card"]');
    await page.click('button[aria-label="Edit rates"]');
    
    await page.fill('input[name="hourlyRate"]', '150');
    await page.click('button:has-text("Update")');
    
    await expect(page.locator('text=Rates updated')).toBeVisible();
  });

  test('should view freelancer history', async ({ page }) => {
    await page.click('[data-testid="freelancer-card"]');
    await page.click('button:has-text("History")');
    
    const historyTable = page.locator('[data-testid="history-table"]');
    await expect(historyTable).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'NONEXISTENT12345');
    await page.waitForLoadState('networkidle');
    
    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText(/No results/i);
  });
});
