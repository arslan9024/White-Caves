/**
 * Cypress Configuration
 * E2E testing setup for sidebar navigation and department views
 */

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'e2e/support/e2e.ts',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    requestTimeout: 5000,
    responseTimeout: 5000,
    defaultCommandTimeout: 4000,

    setupNodeEvents(on, config) {
      // Load env variables
      // Add custom tasks
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
