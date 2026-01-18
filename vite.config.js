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
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // ============ CORE VENDOR CHUNKS ============
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom', 'react-router'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux'],
          
          // ============ FIREBASE CHUNKS (Split by module) ============
          'firebase-core': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-database': ['firebase/database', 'firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
          
          // ============ CRM DASHBOARD CHUNKS ============
          'crm-mary-inventory': ['src/components/crm/MaryInventoryCRM.jsx'],
          'crm-zoe-executive': ['src/components/crm/ZoeExecutiveCRM.jsx'],
          'crm-linda-whatsapp': ['src/components/crm/LindaWhatsAppCRM.jsx'],
          'crm-clara-leads': ['src/components/crm/ClaraLeadsCRM.jsx'],
          'crm-nina-chatbot': ['src/components/crm/NinaWhatsAppBotCRM.jsx'],
          'crm-core': ['src/components/crm/AIAssistantHub.jsx', 'src/components/crm/AICommandCenter.jsx'],
          
          // ============ PAGE CHUNKS ============
          'page-buyer': ['src/pages/buyer/BuyerDashboardPage.jsx', 'src/pages/buyer/MortgageCalculatorPage.jsx'],
          'page-seller': ['src/pages/seller/SellerDashboardPage.jsx', 'src/pages/seller/PricingToolsPage.jsx'],
          'page-landlord': ['src/pages/landlord/LandlordDashboardPage.jsx', 'src/pages/landlord/RentalManagementPage.jsx'],
          'page-leasing': ['src/pages/leasing-agent/LeasingAgentDashboardPage.jsx'],
          'page-secondary-sales': ['src/pages/secondary-sales-agent/SalesAgentDashboardPage.jsx'],
          'page-tenant': ['src/pages/tenant/TenantDashboardPage.jsx'],
          'page-owner': ['src/pages/owner/MDDashboardPage.jsx', 'src/pages/owner/ModernDashboardPage.jsx'],
          'page-public': ['src/pages/AboutPage.jsx', 'src/pages/ServicesPage.jsx', 'src/pages/CareersPage.jsx', 'src/pages/PropertiesPage.jsx']
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          } else if (ext === 'css') {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
