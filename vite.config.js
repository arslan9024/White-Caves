import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Don't auto-inject registration script — registerServiceWorker.ts handles it
      injectRegister: null,
      // Auto-update: the new SW takes over without a prompt on next navigation
      registerType: 'autoUpdate',
      // Let the plugin generate the SW using Workbox (generateSW strategy)
      strategies: 'generateSW',
      workbox: {
        // Precache all static assets produced by the Vite build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Navigation fallback: serve offline.html when network is unreachable
        navigateFallback: '/offline.html',
        // Don't apply the navigation fallback for API and asset requests
        navigateFallbackDenylist: [/^\/api\//, /^\/favicon/, /^\/manifest/],
        // Runtime cache strategies for high-traffic routes
        runtimeCaching: [
          {
            // Cache API property listing (stale-while-revalidate, 60s networkTimeout)
            urlPattern: /^https?:\/\/[^/]+\/api\/properties(\?.*)?$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-properties',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache property detail pages (cache first, 5min)
            urlPattern: /^https?:\/\/[^/]+\/api\/properties\/[^/?]+$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-property-detail',
              expiration: { maxEntries: 100, maxAgeSeconds: 300 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache homepage data (cache first, 1h)
            urlPattern: /^https?:\/\/[^/]+\/api\/homepage\/data/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-homepage',
              expiration: { maxEntries: 5, maxAgeSeconds: 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache images (cache first, 7 days)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // Ignore dev service workers and vendor source maps
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
      },
      manifest: {
        name: 'White Caves Real Estate',
        short_name: 'White Caves',
        description: "Dubai's premier luxury real estate platform",
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0a0a0f',
        theme_color: '#C9A84C',
        orientation: 'portrait-primary',
        categories: ['real estate', 'property', 'lifestyle'],
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/generated-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        shortcuts: [
          {
            name: 'Browse Properties',
            url: '/properties',
            description: 'View all available properties',
          },
          {
            name: 'Contact Us',
            url: '/contact',
            description: 'Get in touch with our team',
          },
        ],
      },
    }),
  ],
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'server/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['src/e2e/**', 'src/__tests__/e2e/**', 'node_modules/**'],
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
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: id => {
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
            // Framer Motion (large, only used on homepage + animations)
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Recharts (large charting library)
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
          }
          // Theme tokens: shared by design-system AND app-core — must be its own chunk
          if (id.includes('src/styles/')) {
            return 'theme-tokens';
          }
          // Foundational app runtime (single chunk to avoid app-utils <-> store circular cross-chunk refs)
          if (
            id.includes('src/store/') ||
            id.includes('src/utils/') ||
            id.includes('src/config/')
          ) {
            return 'app-foundation';
          }
          // Application code splitting by feature
          // Charts: lazy-loaded, separate from app-core
          if (id.includes('src/components/charts/')) {
            return 'charts';
          }
          // Design-system: UI primitives, loaded on-demand by pages
          if (id.includes('src/components/design-system/')) {
            return 'design-system';
          }
          // CRM: split into sub-chunks by module to avoid a massive single chunk
          if (id.includes('src/components/crm/')) {
            if (id.includes('/inventory/')) return 'crm-inventory';
            if (id.includes('/NancyHRCRM_NEW/')) return 'crm-hr';
            if (id.includes('/ClaraLeadsCRM_NEW/')) return 'crm-leads';
            if (id.includes('/AuroraCTODashboard_NEW/')) return 'crm-cto';
            if (id.includes('/MaryInventoryCRM_NEW/')) return 'crm-mary';
            if (id.includes('/OliviaMarketingCRM_NEW/')) return 'crm-marketing';
            if (id.includes('/NadiaWhatsAppCRM/') || id.includes('/NinaWhatsAppBotCRM_NEW/'))
              return 'crm-whatsapp';
            if (id.includes('/WillowBackendCRM_NEW/') || id.includes('/HazelFrontendCRM_NEW/'))
              return 'crm-dev';
            if (id.includes('/TheodoraFinanceCRM_NEW/')) return 'crm-finance';
            if (id.includes('/LailaComplianceCRM_NEW/')) return 'crm-compliance';
            if (id.includes('/SophiaSalesCRM_NEW/')) return 'crm-sales';
            if (id.includes('/DaisyLeasingCRM_NEW/')) return 'crm-leasing';
            if (id.includes('/ZoeExecutiveCRM_NEW/')) return 'crm-executive';
            // Split more CRM modules out of the catch-all
            if (id.includes('/AIAssistant') || id.includes('/AICommand')) return 'crm-ai';
            // CRM data files (pure data, no component deps)
            if (id.includes('/data/')) return 'crm-data';
            // Shared + standalone modules in one chunk (avoid circular deps)
            return 'crm-shared';
          }
          if (
            id.includes('src/components/dashboard/') ||
            id.includes('src/components/dashboards/')
          ) {
            return 'dashboards';
          }
          // Owner tabs: heavy dashboard sub-components — split from dashboards
          if (id.includes('src/components/owner/')) {
            return 'owner-tabs';
          }
          // Shared UI & layout primitives
          if (id.includes('src/shared/components/') || id.includes('src/components/ui/')) {
            return 'shared-ui';
          }
          // Homepage components (lazy-loaded sections)
          if (id.includes('src/components/homepage/')) {
            return 'homepage';
          }
          // Auth features: biometric, social login, role selection — lazy-loaded, not needed at startup
          if (id.includes('src/features/')) {
            return 'auth-features';
          }
          // Core app shell: layout + common-ui (navbar, sidebar, status bar)
          // Charts and design-system split into own lazy chunks above
          if (id.includes('src/components/layout/') || id.includes('src/components/common/')) {
            return 'app-core';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Suppress esbuild CSS nesting warnings from styled-components output
    cssMinify: 'esbuild',
  },
  css: {
    devSourcemap: true,
  },
  esbuild: {
    logOverride: {
      'css-syntax-error': 'silent',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
