import { test, expect } from '@playwright/test';
import { PDFDocument, StandardFonts } from 'pdf-lib';

// Component browser smoke on the existing CRM route. No auth/vault proof:
// the test-only Vite mount avoids requiring real accounts or persistence.
// Native PDF extraction is real; test shell is mocked, auth/vault and image OCR
// are not exercised. No backend requests are permitted.
for (const profile of [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false },
  { name: 'mobile emulation (not a physical device)', viewport: { width: 390, height: 844 }, isMobile: true },
]) {
  test.describe(profile.name, () => {
    test.use({ viewport: profile.viewport, hasTouch: profile.isMobile });
    test('synthetic native PDF upload, review reset and camera semantics', async ({ page }) => {
      test.setTimeout(60000);
      const networkLeaks: string[] = [];
      page.on('request', req => {
        if (['POST', 'PUT', 'PATCH'].includes(req.method())) networkLeaks.push(req.url());
      });
      // Runs only against local Vite: never navigate to a production host.
      const base = new URL(test.info().project.use.baseURL as string);
      if (!['localhost', '127.0.0.1'].includes(base.hostname))
        throw new Error('Henry synthetic browser smoke requires a local Vite server.');
      // Test-only page shell on the existing route, isolating this component from auth.
      // Scanner modules and PDF worker are served by real Vite, never intercepted.
      await page.route('**/crm?tab=henry-scan-title-deed', route => route.fulfill({
        contentType: 'text/html',
        body: `<html><body><main id="henry-browser-smoke"></main><script type="module">
          import RefreshRuntime from '/@react-refresh';
          RefreshRuntime.injectIntoGlobalHook(window);
          window.$RefreshReg$ = () => {};
          window.$RefreshSig$ = () => (type) => type;
          window.__vite_plugin_react_preamble_installed__ = true;
        </script><script type="module">
          import React from '/node_modules/.vite/deps/react.js';
          import ReactDOM from '/node_modules/.vite/deps/react-dom_client.js';
          import Scanner from '/src/components/crm/HenryDocumentStudio/HenryTitleDeedScannerView.tsx';
          ReactDOM.createRoot(document.getElementById('henry-browser-smoke')).render(React.createElement(Scanner));
        </script></body></html>`,
      }));
      await page.goto('/crm?tab=henry-scan-title-deed');
      const scanner = page.locator('#henry-browser-smoke');
      const upload = scanner.getByLabel('Upload document', { exact: true });
      await expect(upload).toHaveAttribute('accept', /application\/pdf/);
      await expect(scanner.getByLabel('Camera document capture')).toHaveAttribute('capture', 'environment');
      await expect(scanner.getByRole('button', { name: 'Browse document' })).toHaveAttribute('tabindex', '0');
      const review = scanner.getByRole('checkbox', { name: 'Confirm document review' });
      await expect(review).toBeDisabled();
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const sheet = pdf.addPage([600, 800]);
      [
        'SYNTHETIC TEST DOCUMENT - NOT AN OFFICIAL DEED',
        'Certificate Number: 123/2026',
        'Owner Name: SYNTHETIC OWNER',
        'Plot Number: 42',
        'Property Number: 101',
      ].forEach((text, index) => sheet.drawText(text, { x: 40, y: 730 - index * 40, size: 16, font }));
      const file = { name: 'synthetic-deed.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) };
      await upload.setInputFiles(file);
      await expect(review).toBeEnabled({ timeout: 30000 });
      await expect(scanner.getByRole('status').filter({ hasText: 'Readiness: needs review.' })).toBeVisible();
      await expect(scanner.getByText('Native PDF text read without OCR.', { exact: false })).toBeVisible();
      await review.check();
      await expect(review).toBeChecked();
      await upload.setInputFiles(file);
      await expect(review).not.toBeChecked();
      await expect(scanner.getByRole('status').filter({ hasText: 'Readiness: needs review.' })).toBeVisible({ timeout: 30000 });
      expect(networkLeaks).toEqual([]);
      await upload.setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from('SYNTHETIC') });
      await expect(scanner.getByRole('alert').filter({ hasText: /Use a PNG, JPEG or PDF/ })).toBeVisible();
      await scanner.getByRole('button', { name: /Discard/ }).click();
      await expect(review).toBeDisabled();
    });
  });
}
