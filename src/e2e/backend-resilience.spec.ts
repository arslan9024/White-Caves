import { test, expect } from '@playwright/test';

test('shows outages, supports dismissal and resurfaces after recovery', async ({ page }) => {
  let healthy = true;
  let probes = 0;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.install();
  await page.route('**/api/health', async route => {
    probes += 1;
    await route.fulfill({
      status: healthy ? 200 : 503,
      contentType: 'application/json',
      body: JSON.stringify({ status: healthy ? 'OK' : 'unavailable' }),
    });
  });

  await page.goto('/signin');
  const banner = page
    .getByRole('status')
    .filter({ hasText: /server connection|reconnecting|offline/i });
  await expect.poll(() => probes).toBeGreaterThan(0);
  await expect(banner).toHaveCount(0);

  healthy = false;
  await page.clock.fastForward(31_000);
  await expect(banner).toContainText('Reconnecting');
  const dismiss = page.getByRole('button', { name: 'Dismiss server status banner' });
  const box = await dismiss.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await dismiss.click();
  await expect(banner).toHaveCount(0);

  healthy = true;
  const previous = probes;
  await page.clock.fastForward(31_000);
  await expect.poll(() => probes).toBeGreaterThan(previous);
  await expect(banner).toHaveCount(0);
  healthy = false;
  await page.clock.fastForward(31_000);
  await expect(banner).toContainText('Reconnecting');
});
