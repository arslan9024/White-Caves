import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport Touch & Swipe Gestures', () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test('should allow swiping the Featured Community Carousel', async ({ page }) => {
    await page.goto('/');
    
    const carousel = page.locator('[data-testid="featured-carousel"]');
    
    // Check if carousel exists (it might not be visible on all pages, adjust accordingly)
    if (await carousel.count() > 0) {
      await carousel.waitFor({ state: 'visible' });

      // Emulate touch swipe gesture
      await page.mouse.move(300, 400);
      await page.mouse.down();
      await page.mouse.move(100, 400, { steps: 5 }); // Swipe left
      await page.mouse.up();

      // Verify the carousel moved to the next item
      // Specific expectation depends on carousel implementation
      expect(await carousel.getAttribute('data-active-index')).not.toBe('0');
    }
  });

  test('should allow drag-to-dismiss on the Map Drawer', async ({ page }) => {
    await page.goto('/map');
    
    const drawer = page.locator('[data-testid="map-bottom-sheet"]');
    
    if (await drawer.count() > 0) {
      // Open drawer
      await page.click('[data-testid="open-drawer-btn"]');
      await expect(drawer).toBeVisible();

      // Emulate swipe down to dismiss
      const box = await drawer.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + 10);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + 300, { steps: 10 });
        await page.mouse.up();

        await expect(drawer).not.toBeVisible();
      }
    }
  });
});
