import { test, expect } from '@playwright/test';

const latestValuation = {
  id: 'val-001',
  propertyId: 'prop-001',
  estimatedValueAed: 2400000,
  rentAnnualAed: 168000,
  grossYieldPct: 7,
  netYieldPct: 6.38,
  confidence: 'high',
  method: 'avm',
  ageDiscount: 0.02,
  amenityPremium: 0.06,
  priceRangeLow: 2280000,
  priceRangeHigh: 2520000,
  createdAt: '2026-05-22T10:00:00.000Z',
};

const recalculatedValuation = {
  ...latestValuation,
  id: 'val-002',
  estimatedValueAed: 2550000,
  grossYieldPct: 6.59,
  netYieldPct: 6.02,
  priceRangeLow: 2422500,
  priceRangeHigh: 2677500,
  createdAt: '2026-05-22T10:10:00.000Z',
};

const overriddenValuation = {
  ...recalculatedValuation,
  id: 'val-003',
  estimatedValueAed: 2600000,
  grossYieldPct: 6.46,
  netYieldPct: 6.46,
  method: 'manual_override',
  overrideReason: 'Certified valuer confirmation',
  createdAt: '2026-05-22T10:12:00.000Z',
};

const historyRecords = [overriddenValuation, recalculatedValuation, latestValuation];

const priceIndexRows = [
  {
    area: 'Palm Jumeirah',
    zone: 'premium',
    avgPricePerSqft: 3800,
    avgAnnualRent: 312000,
    grossYield: 8.2,
    transactionVol: 24,
    daysOnMarket: 36,
    source: 'database',
    dataDate: '2026-05-01T00:00:00.000Z',
  },
  {
    area: 'Business Bay',
    zone: 'mid',
    avgPricePerSqft: 2200,
    avgAnnualRent: 180000,
    grossYield: 6.4,
    transactionVol: 41,
    daysOnMarket: 44,
    source: 'database',
    dataDate: '2026-05-01T00:00:00.000Z',
  },
];

const indicatorPayload = {
  avgDaysOnMarket: 41,
  absorptionRate: 4.6,
  newListings: 18,
  activeListings: 132,
  areasIncluded: 2,
  source: 'database',
};

const reraRows = [
  {
    area: 'Downtown Dubai',
    propertyType: 'apartment',
    bedrooms: '1BR',
    avgRentAed: 90000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
];

const competitorPricingRows = [
  {
    area: 'Downtown Dubai',
    portal: 'bayut',
    avgPricePerSqft: 2410,
    deltaVsWhiteCavesPct: 4.12,
    updatedAt: '2026-05-16T10:15:00.000Z',
    source: 'derived-benchmark',
  },
  {
    area: 'Palm Jumeirah',
    portal: 'propertyfinder',
    avgPricePerSqft: 3650,
    deltaVsWhiteCavesPct: -1.2,
    updatedAt: '2026-05-16T10:15:00.000Z',
    source: 'derived-benchmark',
  },
];

test.describe('Wave 13 - Valuation and Market workflow coverage', () => {
  test('valuation page loads, recalculates, overrides, and computes yield', async ({ page }) => {
    await page.route('**/api/valuations/**', async route => {
      const url = new URL(route.request().url());
      const method = route.request().method();

      if (url.pathname.endsWith('/yield-calculator')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { grossYieldPct: 4.5, netYieldPct: 3.75 },
          }),
        });
        return;
      }

      if (url.pathname.endsWith('/prop-001/history')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: historyRecords,
            pagination: { page: 1, pageSize: 10, total: historyRecords.length, totalPages: 1 },
          }),
        });
        return;
      }

      if (url.pathname.endsWith('/prop-001/recalculate') && method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: recalculatedValuation }),
        });
        return;
      }

      if (url.pathname.endsWith('/prop-001/override') && method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: overriddenValuation }),
        });
        return;
      }

      if (url.pathname.endsWith('/prop-001')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { latest: latestValuation, totalSnapshots: historyRecords.length },
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/valuation', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Property Valuation' })).toBeVisible();

    await page.getByPlaceholder('Enter Property ID').fill('prop-001');
    await page.getByRole('button', { name: 'Load' }).click();

    await expect(page.getByText('Latest Valuation')).toBeVisible();
    await expect(page.getByText(/2,400,000/).first()).toBeVisible();
    await expect(page.getByText('Valuation History')).toBeVisible();

    await page.getByRole('button', { name: /Recalculate AVM/i }).click();
    await expect(page.getByText(/2,550,000/).first()).toBeVisible();

    await page.getByRole('button', { name: 'Manual Override' }).click();
    const overrideForm = page.locator('form').filter({ hasText: 'Manual Override' });
    await overrideForm.locator('input[type="number"]').fill('2600000');
    await overrideForm
      .getByPlaceholder('e.g. RERA-certified valuer assessment')
      .fill('Certified valuer confirmation');
    await overrideForm.getByRole('button', { name: 'Save Override' }).click();

    await expect(page.getByText(/2,600,000/).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Manual Override' })).toBeVisible();

    await page.getByPlaceholder('2,000,000').fill('2000000');
    await page.getByPlaceholder('90,000').fill('90000');
    await page.getByPlaceholder('15,000').fill('15000');
    await page.getByRole('button', { name: 'Calculate', exact: true }).click();

    await expect(page.getByText('4.5%')).toBeVisible();
    await expect(page.getByText('3.75%')).toBeVisible();
  });

  test('market intelligence page renders price index, indicators, and RERA tabs', async ({
    page,
  }) => {
    await page.route('**/api/market/**', async route => {
      const url = new URL(route.request().url());

      if (url.pathname.endsWith('/price-index')) {
        const zone = url.searchParams.get('zone');
        const data = zone ? priceIndexRows.filter(row => row.zone === zone) : priceIndexRows;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data }),
        });
        return;
      }

      if (url.pathname.endsWith('/indicators')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: indicatorPayload }),
        });
        return;
      }

      if (url.pathname.endsWith('/rera-index')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: reraRows }),
        });
        return;
      }

      if (url.pathname.endsWith('/competitor-pricing')) {
        const area = url.searchParams.get('area')?.toLowerCase() ?? '';
        const portal = url.searchParams.get('portal')?.toLowerCase() ?? '';

        const data = competitorPricingRows.filter(row => {
          const areaMatch = area ? row.area.toLowerCase().includes(area) : true;
          const portalMatch = portal ? row.portal === portal : true;
          return areaMatch && portalMatch;
        });

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/market', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/market');
    await expect(page.getByRole('heading', { name: 'Market Intelligence' })).toBeVisible();

    await expect(page.getByText('Palm Jumeirah')).toBeVisible();
    await expect(page.getByText('Business Bay')).toBeVisible();

    await page.selectOption('select', 'premium');
    await expect(page.getByText('Palm Jumeirah')).toBeVisible();
    await expect(page.getByText('Business Bay')).not.toBeVisible();

    await page.getByRole('button', { name: 'Indicators' }).click();
    await expect(page.getByText('Avg Days on Market')).toBeVisible();
    await expect(page.getByText('41')).toBeVisible();
    await expect(page.getByText('132')).toBeVisible();

    await page.getByRole('button', { name: 'RERA Index' }).click();
    await expect(page.getByText(/Based on RERA Rental Index 2024/i)).toBeVisible();
    await expect(page.getByText('Downtown Dubai')).toBeVisible();
    await expect(page.getByText('90,000')).toBeVisible();

    await page.getByRole('button', { name: 'Competitor Pricing' }).click();
    await expect(page.getByText('Downtown Dubai')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Bayut' })).toBeVisible();
    await expect(page.getByText('+4.12%')).toBeVisible();

    await page.getByPlaceholder('Filter by area').fill('Palm');
    await expect(page.getByText('Palm Jumeirah')).toBeVisible();
  });
});
