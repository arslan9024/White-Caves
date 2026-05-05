import { test, expect, type Page, type APIResponse } from '@playwright/test';

const SESSION_EVENTS_KEY = '__wc_homepage_events__';

async function enableHomepageEventCapture(page: Page): Promise<void> {
  await page.addInitScript(
    ({ storageKey }: { storageKey: string }) => {
      sessionStorage.setItem(storageKey, JSON.stringify([]));

      window.addEventListener('wc-homepage-event', evt => {
        const event = evt as CustomEvent<{ event?: string }>;
        const previous = JSON.parse(sessionStorage.getItem(storageKey) || '[]') as string[];
        const eventName = event?.detail?.event;
        if (typeof eventName === 'string') {
          previous.push(eventName);
          sessionStorage.setItem(storageKey, JSON.stringify(previous));
        }
      });
    },
    { storageKey: SESSION_EVENTS_KEY }
  );
}

async function getCapturedEvents(page: Page): Promise<string[]> {
  return page.evaluate(
    ({ storageKey }: { storageKey: string }) => {
      try {
        return JSON.parse(sessionStorage.getItem(storageKey) || '[]') as string[];
      } catch {
        return [];
      }
    },
    { storageKey: SESSION_EVENTS_KEY }
  );
}

async function expectNotMissingEndpoint(response: APIResponse, endpoint: string): Promise<void> {
  expect(
    response.status(),
    `${endpoint} should exist (404 indicates broken lifecycle continuity)`
  ).not.toBe(404);
}

test.describe('Phase 33 — Leasing Continuity Hardening', () => {
  test('hero conversion path is leasing-first and tracks CTA event', async ({ page }) => {
    await enableHomepageEventCapture(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const findRentalsButton = page.getByRole('button', { name: 'Find Rentals' });
    await expect(findRentalsButton).toBeVisible();

    await findRentalsButton.click();
    await page.waitForURL('**/properties**');
    await expect(page).toHaveURL(/mode=rent/);

    const events = await getCapturedEvents(page);
    expect(events).toContain('homepage_hero_cta_click');
  });

  test('leasing search submit emits homepage leasing conversion event', async ({ page }) => {
    await enableHomepageEventCapture(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const searchSubmitButton = page.locator('button[aria-label="Search properties"]');
    await expect(searchSubmitButton).toBeVisible();

    await searchSubmitButton.click();
    await page.waitForURL('**/properties**');

    const events = await getCapturedEvents(page);
    expect(events).toContain('homepage_leasing_search_submit');
  });

  test('viewing request + whatsapp CTA emit continuity events', async ({ page }) => {
    await enableHomepageEventCapture(page);

    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 'phase33_contact_001' } }),
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact-cta');
    await contactSection.scrollIntoViewIfNeeded();

    const whatsappButton = page.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(whatsappButton).toBeVisible();

    const popupPromise = page.waitForEvent('popup').catch(() => null);
    await whatsappButton.click();
    const popup = await popupPromise;
    if (popup) await popup.close();

    await page.getByPlaceholder('Your Name').fill('Phase 33 QA');
    await page.getByPlaceholder('Email Address').fill('phase33.qa@whitecaves.ae');
    await page.getByPlaceholder('Your Message...').fill('Testing leasing continuity flow.');

    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByText('Message Sent!')).toBeVisible();

    const events = await getCapturedEvents(page);
    expect(events).toContain('homepage_whatsapp_start');
    expect(events).toContain('homepage_viewing_request_submit');
  });

  test('leasing lifecycle APIs are present across lead/viewing/lease/maintenance stages', async ({
    request,
  }) => {
    const leadResponse = await request.post('/api/leads/from-search', {
      data: { mode: 'rent', location: 'Dubai Marina' },
    });
    await expectNotMissingEndpoint(leadResponse, '/api/leads/from-search');

    const viewingsResponse = await request.get('/api/viewings');
    await expectNotMissingEndpoint(viewingsResponse, '/api/viewings');

    const leasesResponse = await request.get('/api/leases?role=tenant');
    await expectNotMissingEndpoint(leasesResponse, '/api/leases?role=tenant');

    const maintenanceResponse = await request.get('/api/maintenance');
    await expectNotMissingEndpoint(maintenanceResponse, '/api/maintenance');

    const ejariExportResponse = await request.get('/api/compliance/ejari-export');
    await expectNotMissingEndpoint(ejariExportResponse, '/api/compliance/ejari-export');
  });

  test('tenant, landlord, and leasing-agent route surfaces remain reachable', async ({ page }) => {
    const roleRoutes = ['/tenant-portal', '/landlord-portal', '/leasing-agent/dashboard'];

    for (const routePath of roleRoutes) {
      const response = await page
        .goto(routePath, { waitUntil: 'domcontentloaded' })
        .catch(() => null);
      if (response) {
        expect(
          response.status(),
          `${routePath} should not return 404; lifecycle route continuity must remain intact`
        ).not.toBe(404);
      }
    }
  });
});
