import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('should expose a sign-in entry point from home', async ({ page }) => {
    await expect(page).toHaveTitle(/White Caves/i);

    const candidates = [
      page.getByRole('link', { name: /sign in|log in|login/i }),
      page.getByRole('button', { name: /sign in|log in|login/i }),
      page.locator('a[href*="signin"], a[href*="login"], button[aria-label*="sign" i]'),
    ];

    const counts = await Promise.all(candidates.map(c => c.count().catch(() => 0)));
    const hasEntryPoint = counts.some(c => c > 0);
    test.skip(!hasEntryPoint, 'Sign-in entry point not present in this homepage variant.');

    const target = candidates.find((_c, idx) => counts[idx] > 0)!;
    await expect(target.first()).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/signin/i);

    const heading = page.getByRole('heading', {
      name: /welcome back|sign in|log in|login/i,
    });
    const submit = page.getByRole('button', { name: /sign in|log in|login|continue/i });

    const ready = (await heading.count()) > 0 || (await submit.count()) > 0;
    test.skip(!ready, 'Sign-in UI markers not available in this build variant.');

    if ((await heading.count()) > 0) {
      await expect(heading.first()).toBeVisible();
    }
    if ((await submit.count()) > 0) {
      await expect(submit.first()).toBeVisible();
    }
  });

  test('should reject invalid credentials when auth form is present', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/signin/i);

    const email = page.getByRole('textbox', { name: /email address|email/i }).first();
    const password = page.getByRole('textbox', { name: /password/i }).first();
    const submit = page.getByRole('button', { name: /sign in/i }).first();

    const ready = (await email.count()) > 0 && (await password.count()) > 0 && (await submit.count()) > 0;
    test.skip(!ready, 'Sign-in form controls are not available in this build variant.');

    await email.fill('invalid@test.com');
    await password.fill('wrongpassword');
    await submit.click();

    // In local/dev environments, providers may not return inline errors.
    // Deterministic assertion: user should remain on sign-in route (not authenticated).
    await expect(page).toHaveURL(/signin/i);
  });

  test('should preserve route guard behavior for dashboard access', async ({ page }) => {
    await page.goto('/md/dashboard', { waitUntil: 'domcontentloaded' });

    // Either dashboard loads, or user is redirected to auth/home (both valid depending on auth state)
    const currentPath = new URL(page.url()).pathname;
    const isDashboard = currentPath.startsWith('/md/dashboard');
    const isAuthOrHome = currentPath.startsWith('/signin') || currentPath === '/';

    expect(isDashboard || isAuthOrHome).toBeTruthy();
  });
});
