import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Two test projects: frontend (jsdom) and server (node).
    // This replaces the deprecated environmentMatchGlobs feature.
    projects: [
      {
        // Frontend / React component tests
        test: {
          name: 'frontend',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./test/setup.js', './src/setupTests.js'],
          include: [
            'test/**/*.{test,spec}.{js,jsx,ts,tsx}',
            'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
            'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
            'test/**/__tests__/**/*.{js,jsx,ts,tsx}',
          ],
          exclude: [
            'node_modules',
            '**/node_modules/**',
            'modules/**',
            'dist',
            '.wwebjs_auth',
            '.wwebjs_cache',
            'build',
            'server/**',
          ],
        },
      },
      {
        // Backend / Express API tests  — pure Node.js environment, no browser globals
        test: {
          name: 'server',
          environment: 'node',
          globals: true,
          include: ['server/**/*.{test,spec}.{ts,js}'],
          exclude: ['node_modules'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.spec.js',
        '**/*.test.js',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.jsx',
        '**/*.test.jsx',
        '**/*.spec.tsx',
        '**/*.test.tsx',
        '**/mocks/**',
        '**/__tests__/**',
        '.wwebjs_auth/**',
        '.wwebjs_cache/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
