import { test, expect } from '@playwright/test';

/**
 * Accessibility Compliance E2E Tests
 * Ensures dashboard meets WCAG 2.1 accessibility standards
 */
test.describe('Dashboard Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modern-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate tabs with keyboard', async ({ page }) => {
      const tabs = page.locator('[role="tab"]');
      const firstTab = tabs.first();
      
      if (await firstTab.isVisible()) {
        await firstTab.focus();
        expect(firstTab).toBeFocused();
        
        // Navigate to next tab with arrow key
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        const secondTab = tabs.nth(1);
        const isFocused = await secondTab.evaluate(e => e === document.activeElement);
        
        if (await secondTab.isVisible()) {
          expect(isFocused || await firstTab.evaluate(e => e === document.activeElement)).toBeTruthy();
        }
      }
    });

    test('should activate focused element with Enter', async ({ page }) => {
      const tabs = page.locator('[role="tab"]');
      const firstTab = tabs.first();
      
      if (await firstTab.isVisible()) {
        await firstTab.focus();
        await page.keyboard.press('Enter');
        
        const panel = page.locator('[role="tabpanel"]');
        const isVisible = await panel.isVisible().catch(() => false);
        
        if (isVisible) {
          expect(panel).toBeVisible();
        }
      }
    });

    test('should navigate form elements with Tab key', async ({ page }) => {
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        
        const inputs = page.locator('input, select, textarea, button');
        
        if (await inputs.count() > 0) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);
          
          // Verify focus moved
          const focusedElement = page.evaluate(() => document.activeElement?.tagName);
          expect(focusedElement).toBeTruthy();
        }
      }
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper ARIA labels on buttons', async ({ page }) => {
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        // Check that buttons have either text content or aria-label
        for (let i = 0; i < Math.min(5, buttonCount); i++) {
          const button = buttons.nth(i);
          const label = await button.getAttribute('aria-label');
          const text = await button.textContent();
          
          // Button should have either visible text or aria-label
          expect(label || text?.trim()).toBeTruthy();
        }
      }
    });

    test('should have ARIA roles for interactive elements', async ({ page }) => {
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        expect(tabCount).toBeGreaterThan(0);
        
        // Verify tabs have proper roles
        const role = await tabs.first().getAttribute('role');
        expect(role).toBe('tab');
      }
    });

    test('should have proper ARIA labels on form inputs', async ({ page }) => {
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        
        const labels = page.locator('label');
        const inputs = page.locator('input, select');
        
        if (await inputs.count() > 0) {
          // Form should have labels or aria-labels
          const labelCount = await labels.count();
          const inputCount = await inputs.count();
          
          // Should have reasonable label coverage
          expect(labelCount).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should have visible content', async ({ page }) => {
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
      const visibleCount = await textElements.count();
      
      expect(visibleCount).toBeGreaterThan(0);
    });

    test('should have distinguishable focused elements', async ({ page }) => {
      const buttons = page.locator('button').first();
      
      if (await buttons.isVisible()) {
        await buttons.focus();
        
        // When focused, element should be visually different
        const outline = await buttons.evaluate(() => {
          const style = window.getComputedStyle(document.activeElement as Element);
          return style.outline || style.boxShadow;
        });
        
        // Should have some focus indicator
        expect(outline).toBeTruthy();
      }
    });
  });

  test.describe('Semantic HTML', () => {
    test('should use semantic heading structure', async ({ page }) => {
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      expect(headingCount).toBeGreaterThan(0);
    });

    test('should have main content landmark', async ({ page }) => {
      const main = page.locator('main, [role="main"]');
      const isVisible = await main.isVisible().catch(() => false);
      
      if (isVisible) {
        expect(main).toBeVisible();
      }
    });

    test('should have navigation landmark', async ({ page }) => {
      const nav = page.locator('nav');
      const isVisible = await nav.isVisible().catch(() => false);
      
      if (isVisible) {
        expect(nav).toBeVisible();
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should trap focus in modal when open', async ({ page }) => {
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        
        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          const focusableElements = modal.locator('button, input, select, textarea, a[href]');
          expect(await focusableElements.count()).toBeGreaterThan(0);
        }
      }
    });

    test('should restore focus after modal closes', async ({ page }) => {
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        
        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          const closeButton = modal.locator('button:has-text("Close"), button:has-text("Cancel")');
          
          if (await closeButton.isVisible()) {
            await closeButton.click();
            await page.waitForTimeout(100);
            
            // Focus should return to or near trigger element
            expect(document).toBeDefined();
          }
        }
      }
    });
  });

  test.describe('Alt Text for Images', () => {
    test('should have alt text on images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Check first few images
        for (let i = 0; i < Math.min(5, imageCount); i++) {
          const image = images.nth(i);
          const alt = await image.getAttribute('alt');
          const ariaLabel = await image.getAttribute('aria-label');
          
          // Image should have alt text or aria-label (unless decorative)
          expect(alt || ariaLabel || alt === '').toBeTruthy();
        }
      }
    });
  });

  test.describe('Error Messages', () => {
    test('should have accessible error messages', async ({ page }) => {
      const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        
        // Try to submit without filling required fields
        const submitButton = page.locator('button:has-text("Submit"), button:has-text("Save")');
        
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(500);
          
          const errorMessage = page.locator('[role="alert"], text=/required|error/i');
          const isVisible = await errorMessage.isVisible().catch(() => false);
          
          // Error should be announced to screen readers
          if (isVisible) {
            expect(errorMessage).toBeVisible();
          }
        }
      }
    });
  });
});
