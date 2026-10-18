import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import baseConfig from './vitest.config.js';

// Keep existing aliases/setup/jsdom, but discover only App's route/bootstrap suite.
// Explicit root also prevents a runner invoked from another checkout using its files.
export default defineConfig({
  ...baseConfig,
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    ...baseConfig.test,
    include: ['src/App.test.tsx'],
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
    reporters: ['dot'],
  },
});
