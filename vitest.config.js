import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const sanitizeNodeOptions = value => {
  if (!value) return '';

  const tokens = value.trim().split(/\s+/);
  const cleaned = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    // Drop broken localstorage-file flags that cause noisy Node warnings.
    if (token === '--localstorage-file') {
      const next = tokens[i + 1];
      const hasNextValue = next && !next.startsWith('--');
      if (hasNextValue) i += 1;
      continue;
    }

    if (token.startsWith('--localstorage-file=')) {
      continue;
    }

    cleaned.push(token);
  }

  return cleaned.join(' ').trim();
};

const sanitizedNodeOptions = sanitizeNodeOptions(process.env.NODE_OPTIONS || '');
if ((process.env.NODE_OPTIONS || '').trim() !== sanitizedNodeOptions) {
  process.env.NODE_OPTIONS = sanitizedNodeOptions;
}

const sanitizedExecArgv = (process.execArgv || []).filter(
  arg => arg !== '--localstorage-file' && !arg.startsWith('--localstorage-file=')
);

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    env: {
      NODE_OPTIONS: sanitizedNodeOptions,
    },
    poolOptions: {
      threads: {
        execArgv: sanitizedExecArgv,
      },
      forks: {
        execArgv: sanitizedExecArgv,
      },
    },
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
            'src/e2e/**',
            'src/__tests__/e2e/**',
            'test/e2e/**',
            'test/sidebar-enhancements.test.ts',
            'src/__tests__/phase6.backend.test.ts',
            'src/__tests__/integration/departmentSlice.test.ts',
            'src/hooks/__tests__/useOptimizedAPI.test.ts',
            'src/services/__tests__/WhatsAppWebIntegration.test.js',
            'src/utils/apiClient.test.ts',
            'test/integration/importHistory.integration.test.js',
            'test/integration/smartImport.test.js',
            'test/unit/utils/importValidationEngine.test.js',
            'src/__tests__/Phase2A.integration.test.js',
            'src/pages/NadiaPage.test.tsx',
            'src/pages/PropertyDetailPage.test.tsx',
            'src/hooks/useFormValidation.test.ts',
            'src/store/slices/aiAssistantDashboardSlice.test.ts',
            'src/__tests__/hooks/useWhatsAppConversations.test.ts',
            'src/__tests__/services/whatsapp.service.test.ts',
            'src/api/monitoring.integration.test.js',
            'src/features/aurora/AuroraTechnicalDashboard.test.jsx',
            'src/features/zoe/ZoeExecutiveDashboard.test.jsx',
            'test/unit/components/DataImportWizard.test.js',
            'src/components/sourcing/__tests__/QuickAddPropertyForm.test.js',
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
