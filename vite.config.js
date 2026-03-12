import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['src/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'node_modules/**']
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'attached_assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core React + Router + Redux (single vendor bundle to avoid circular deps)
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('react-redux') ||
              id.includes('@reduxjs/toolkit') ||
              id.includes('redux') ||
              id.includes('immer') ||
              id.includes('reselect')
            ) {
              return 'vendor';
            }
            // Firebase (large, lazily used)
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Styled-components
            if (id.includes('styled-components') || id.includes('stylis')) {
              return 'styled';
            }
            // Vercel analytics
            if (id.includes('@vercel')) {
              return 'analytics';
            }
          }
          // Application code splitting by feature
          // CRM: split into sub-chunks by module to avoid a massive single chunk
          if (id.includes('src/components/crm/')) {
            if (id.includes('/inventory/')) return 'crm-inventory';
            if (id.includes('/NancyHRCRM_NEW/')) return 'crm-hr';
            if (id.includes('/ClaraLeadsCRM_NEW/')) return 'crm-leads';
            if (id.includes('/AuroraCTODashboard_NEW/')) return 'crm-cto';
            if (id.includes('/MaryInventoryCRM_NEW/')) return 'crm-mary';
            if (id.includes('/OliviaMarketingCRM_NEW/')) return 'crm-marketing';
            if (id.includes('/LindaWhatsAppCRM_NEW/') || id.includes('/NinaWhatsAppBotCRM_NEW/')) return 'crm-whatsapp';
            if (id.includes('/WillowBackendCRM_NEW/') || id.includes('/HazelFrontendCRM_NEW/')) return 'crm-dev';
            if (id.includes('/TheodoraFinanceCRM_NEW/')) return 'crm-finance';
            if (id.includes('/LailaComplianceCRM_NEW/')) return 'crm-compliance';
            if (id.includes('/SophiaSalesCRM_NEW/')) return 'crm-sales';
            if (id.includes('/DaisyLeasingCRM_NEW/')) return 'crm-leasing';
            if (id.includes('/ZoeExecutiveCRM_NEW/')) return 'crm-executive';
            // Shared + misc combined into one chunk to avoid circular deps
            return 'crm-shared';
          }
          if (id.includes('src/components/dashboard/') || id.includes('src/components/dashboards/')) {
            return 'dashboards';
          }
          // Auth feature — large, lazy-loaded on login routes
          if (id.includes('src/features/auth/')) {
            return 'auth';
          }
          // Charts — used across dashboards, not on initial load
          if (id.includes('src/components/charts/')) {
            return 'charts';
          }
          // Design system — tokens, primitives
          if (id.includes('src/components/design-system/')) {
            return 'design-system';
          }
          // Shared UI & layout primitives
          if (id.includes('src/shared/components/')) {
            return 'shared-ui';
          }
          // Common reusable components
          if (id.includes('src/components/common/')) {
            return 'common-ui';
          }
          // Homepage components (lazy-loaded sections)
          if (id.includes('src/components/homepage/')) {
            return 'homepage';
          }
          // Core layout shell (always loaded)
          if (id.includes('src/components/layout/')) {
            return 'app-core';
          }
          // Remaining features (admin, registry)
          if (id.includes('src/features/')) {
            return 'app-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Suppress esbuild CSS nesting warnings from styled-components output
    cssMinify: 'esbuild'
  },
  css: {
    devSourcemap: true
  },
  esbuild: {
    logOverride: {
      'css-syntax-error': 'silent'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
