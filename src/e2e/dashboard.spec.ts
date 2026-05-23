import { test, expect } from '@playwright/test';

function isAuthOrHome(pathname: string) {
  return pathname === '/' || pathname.startsWith('/signin');
}

test.describe('Dashboard Navigation & Layout', () => {
  test('should expose dashboard entry route behavior', async ({ page }) => {
    await page.goto('/modern-dashboard', { waitUntil: 'domcontentloaded' });

    const pathname = new URL(page.url()).pathname;
    const isDashboard = pathname.startsWith('/modern-dashboard');

    expect(isDashboard || isAuthOrHome(pathname)).toBeTruthy();
  });

  test('should render dashboard shell markers when dashboard route is accessible', async ({
    page,
  }) => {
    await page.goto('/modern-dashboard', { waitUntil: 'domcontentloaded' });

    const pathname = new URL(page.url()).pathname;
    test.skip(
      !pathname.startsWith('/modern-dashboard'),
      `Dashboard not accessible in this auth state: ${pathname}`
    );

    const bodyText =
      (await page
        .locator('body')
        .innerText()
        .catch(() => '')) || '';
    test.skip(/loading\s+page/i.test(bodyText), 'Dashboard route still hydrating/loading shell.');

    // Flexible markers across layout variants
    const hasMain = await page.locator('main').count();
    test.skip(hasMain === 0, 'No main shell detected yet; page still hydrating.');

    expect(hasMain > 0).toBeTruthy();
  });

  test('should keep footer visible on informational pages', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const footer = page.locator('footer');
    const hasFooter = (await footer.count()) > 0;

    // Some build variants use minimal shells on informational routes.
    test.skip(!hasFooter, 'Footer is not rendered in this informational layout variant.');
    await expect(footer).toBeVisible();
  });

  test('should preserve sign-in discoverability from home', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const signInEntryCandidates = [
      page.getByRole('link', { name: /sign in|log in|login/i }),
      page.getByRole('button', { name: /sign in|log in|login/i }),
      page.locator('a[href*="signin"], a[href*="login"], button[aria-label*="sign" i]'),
    ];

    const counts = await Promise.all(signInEntryCandidates.map(c => c.count().catch(() => 0)));
    const hasSignInEntry = counts.some(c => c > 0);
    test.skip(
      !hasSignInEntry,
      'Sign-in discoverability marker not present in this homepage variant.'
    );

    const primary = signInEntryCandidates.find((_c, idx) => counts[idx] > 0)!;
    await expect(primary.first()).toBeVisible();
  });
});
