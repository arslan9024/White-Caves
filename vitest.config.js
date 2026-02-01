import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.js', './src/setupTests.js'],
    include: [
      'test/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      '.wwebjs_auth',
      '.wwebjs_cache',
      'build',
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
