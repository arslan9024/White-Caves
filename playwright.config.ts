import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';

const isLocalManagedBaseUrl = (() => {
  if (!process.env.TEST_BASE_URL) return true;

  try {
    const parsed = new URL(process.env.TEST_BASE_URL);
    const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
    return isLocalhost && port === '5000';
  } catch {
    return false;
  }
})();

const USE_EXTERNAL_BASE_URL = !isLocalManagedBaseUrl;

export default defineConfig({
  testDir: './src/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: USE_EXTERNAL_BASE_URL
    ? undefined
    : {
        command: 'npm run dev:all',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
