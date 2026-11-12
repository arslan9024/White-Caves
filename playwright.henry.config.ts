import { defineConfig } from '@playwright/test';
import config from './playwright.config';

const baseURL = 'http://127.0.0.1:4174';

export default defineConfig({
  ...config,
  testMatch: '**/henry-scanner.spec.ts',
  testIgnore: [],
  use: { ...config.use, baseURL },
  webServer: {
    command: 'npm run dev:client -- --host 127.0.0.1 --port 4174 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
