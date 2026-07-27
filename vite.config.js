import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(async ({ command }) => {
  const plugins = [
    react(),
    federation({
      name: 'white_caves_host',
      filename: 'remoteEntry.js',
      exposes: {
        './OperationsDepartmentView': './src/pages/crm/OperationsDepartmentView.tsx',
        './FinanceDepartmentView': './src/pages/crm/FinanceDepartmentView.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
    }),
  ];

  if (command === 'build') {
    try {
      const { visualizer } = await import('rollup-plugin-visualizer');
      plugins.push(
        visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      );
    } catch (e) {
      console.warn('rollup-plugin-visualizer not available; continuing without visualizer');
    }

    try {
      const { VitePWA } = await import('vite-plugin-pwa');
      plugins.push(
        VitePWA({
          // Don't auto-inject registration script — registerServiceWorker.ts handles it
          injectRegister: null,
          // Auto-update: the new SW takes over without a prompt on next navigation
          registerType: 'autoUpdate',
          // Let the plugin generate the SW using Workbox (generateSW strategy)
          strategies: 'generateSW',
          workbox: {
            importScripts: ['/custom-sw.js'],
            // Precache all static assets produced by the Vite build
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            // Navigation fallback: serve offline.html when network is unreachable
            navigateFallback: '/offline.html',
            // Don't apply the navigation fallback for API and asset requests
            navigateFallbackDenylist: [/^\/api\//, /^\/favicon/, /^\/manifest/],
            // Runtime cache strategies for high-traffic routes
            runtimeCaching: [
              {
                urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
                method: 'POST',
                handler: 'NetworkOnly',
                options: {
                  backgroundSync: {
                    name: 'crm-writes-queue',
                    options: { maxRetentionTime: 48 * 60 },
                  },
                },
              },
              {
                urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
                method: 'PATCH',
                handler: 'NetworkOnly',
                options: {
                  backgroundSync: {
                    name: 'crm-writes-queue',
                    options: { maxRetentionTime: 48 * 60 },
                  },
                },
              },
              {
                urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
                method: 'DELETE',
                handler: 'NetworkOnly',
                options: {
                  backgroundSync: {
                    name: 'crm-writes-queue',
                    options: { maxRetentionTime: 48 * 60 },
                  },
                },
              },
              {
                // Wave 17 policy: all API GET calls use network-first with short fallback cache
                urlPattern: /^https?:\/\/[^/]+\/api\/.*$/,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-network-first',
                  networkTimeoutSeconds: 5,
                  expiration: { maxEntries: 120, maxAgeSeconds: 300 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
              {
                // Cache static built assets
                urlPattern: /\/assets\/.*\.(?:js|css|woff2?|png|svg|webp)$/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'static-assets',
                  expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
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
                purpose: 'any maskable',
              },
              {
                src: '/generated-icon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
          // Better URL handling for app-like navigation
          devOptions: {
            enabled: false,
          },
        })
      );
    } catch (error) {
      console.warn('vite-plugin-pwa not available; continuing without PWA plugin in dev/build');
    }
  }

  return {
    plugins,
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      allowedHosts: true,
      watch: {
        ignored: ['**/logs/**', '**/.git/**'],
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
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
      target: 'esnext',
      rollupOptions: {
        output: {
          // Disabled manualChunks to avoid css dependency recursion crash in Vite Module Federation
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
  };
});
