import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/White Caves/i);
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should handle form validation', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    const emailInput = page.locator('input[name="email"]');
    const isInvalid = await emailInput.evaluate(el => {
      return (el as HTMLInputElement).validity.valid === false;
    });
    expect(isInvalid).toBe(true);
  });

  test('should navigate to signup', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/signup|register/i);
  });

  test('should clear form when clicking reset', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    await page.click('button:has-text("Reset")');
    
    const emailValue = await page.inputValue('input[name="email"]');
    const passwordValue = await page.inputValue('input[name="password"]');
    
    expect(emailValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('should persist session on page reload', async ({ page, context }) => {
    // Simulate logged-in state
    await context.addCookies([
      {
        name: 'authToken',
        value: 'test-token-123',
        url: '',
      },
    ]);
    
    await page.goto('/dashboard');
    // If auth works, we should see dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});
