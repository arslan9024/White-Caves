import { test, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Performance & Load Testing', () => {
  const performanceResults: any[] = [];

  test.afterAll(async () => {
    // Save performance results
    const reportPath = path.join(__dirname, '../../..', 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(performanceResults, null, 2));
  });

  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    performanceResults.push({
      page: 'home',
      loadTime: loadTime,
      timestamp: new Date().toISOString(),
    });

    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should load commissions page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/commissions', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    performanceResults.push({
      page: 'commissions',
      loadTime: loadTime,
      timestamp: new Date().toISOString(),
    });

    expect(loadTime).toBeLessThan(3000);
  });

  test('should measure Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    const vitals = await page.evaluate(() => {
      return {
        fcp: (performance as any).getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: (performance as any).getEntriesByName('largest-contentful-paint').pop()?.startTime,
        cls: (performance as any).getEntriesByType('layout-shift').reduce((a, b) => a + (b as any).value, 0),
      };
    });

    performanceResults.push({
      metric: 'core-web-vitals',
      vitals: vitals,
      timestamp: new Date().toISOString(),
    });

    // FCP should be < 1.8s
    expect(vitals.fcp).toBeLessThan(1800);
  });

  test('should render large commission list efficiently', async ({ page }) => {
    await page.goto('/commissions');

    const startTime = Date.now();
    const cards = page.locator('[data-testid="commission-card"]');
    await cards.first().waitFor();
    const renderTime = Date.now() - startTime;

    performanceResults.push({
      metric: 'commission-render',
      renderTime: renderTime,
      timestamp: new Date().toISOString(),
    });

    expect(renderTime).toBeLessThan(2000);
  });

  test('should handle search without performance degradation', async ({ page }) => {
    await page.goto('/freelancers');

    const startTime = Date.now();
    await page.fill('input[placeholder*="Search"]', 'Test');
    await page.waitForLoadState('networkidle');
    const searchTime = Date.now() - startTime;

    performanceResults.push({
      metric: 'search',
      searchTime: searchTime,
      timestamp: new Date().toISOString(),
    });

    expect(searchTime).toBeLessThan(2000);
  });

  test('should measure memory usage', async () => {
    const browser = await chromium.launch();
    const context = await browser.createContext();
    const page = await context.newPage();

    await page.goto('http://localhost:5000');

    const memoryUsage = await page.evaluate(() => {
      if ((performance as any).memory) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    performanceResults.push({
      metric: 'memory',
      usage: memoryUsage,
      timestamp: new Date().toISOString(),
    });

    await context.close();
    await browser.close();
  });

  test('should handle rapid navigation', async ({ page }) => {
    const pages = ['/commissions', '/freelancers', '/clients'];
    const startTime = Date.now();

    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
    }

    const totalTime = Date.now() - startTime;

    performanceResults.push({
      metric: 'rapid-navigation',
      totalTime: totalTime,
      pagesCount: pages.length,
      avgTimePerPage: totalTime / pages.length,
      timestamp: new Date().toISOString(),
    });

    expect(totalTime / pages.length).toBeLessThan(2500);
  });

  test('should not have layout shift issues', async ({ page }) => {
    await page.goto('/');

    const cls = await page.evaluate(() => {
      const entries = (performance as any).getEntriesByType('layout-shift');
      return entries.reduce((acc: number, entry: any) => acc + entry.value, 0);
    });

    performanceResults.push({
      metric: 'cumulative-layout-shift',
      cls: cls,
      timestamp: new Date().toISOString(),
    });

    // CLS should be < 0.1
    expect(cls).toBeLessThan(0.1);
  });
});
