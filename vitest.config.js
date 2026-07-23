import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      nodemailer: path.resolve(__dirname, '__mocks__/nodemailer.js'),
      winston: path.resolve(__dirname, '__mocks__/winston.js'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'server/**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    exclude: [
      'src/e2e/**',
      'src/__tests__/e2e/**',
      'node_modules/**',
      '**/node_modules/**',
      'modules/**',
      // Legacy custom test-runner files (not Vitest describe/it format)
      'server/tests/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/e2e/**',
        'src/**/*.test.*',
        'src/**/*.spec.*',
        'node_modules/**',
      ],
    },
  },
});
