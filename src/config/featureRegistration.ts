// src/config/featureRegistration.ts
/**
 * Feature Registration Configuration
 * This file registers all features in the FeatureRegistry
 * Import this in your App.tsx or main entry point
 */

import { Feature } from '../components/layout/DashboardWorkspace/FeatureRegistry';
import { InventoryDashboard } from '../components/features/InventoryDashboard/InventoryDashboard';
import { DataImportWizard } from '../components/features/DataImportWizard/DataImportWizard';
import { ImportHistory } from '../components/features/ImportHistory/ImportHistory';
import { SearchProperties } from '../components/features/SearchProperties/SearchProperties';

/**
 * Mary Inventory Features
 */
export const maryInventoryFeatures: Feature[] = [
  {
    id: 'inventory-dashboard',
    name: 'Inventory Dashboard',
    label: 'Dashboard',
    category: 'inventory',
    description: 'Overview of all properties in your inventory',
    icon: '📊',
    component: InventoryDashboard,
    permissions: ['view:inventory'],
    badge: 'NEW',
  },
  {
    id: 'smart-import',
    name: 'Smart Data Import',
    label: 'Smart Import',
    category: 'inventory',
    description: 'Import properties from Excel/CSV files',
    icon: '📥',
    component: DataImportWizard,
    permissions: ['import:data'],
  },
  {
    id: 'import-history',
    name: 'Import History',
    label: 'Import History',
    category: 'inventory',
    description: 'View and manage past import sessions',
    icon: '📜',
    component: ImportHistory,
    permissions: ['view:importHistory'],
  },
  // Add more features as needed
  {
    id: 'inventory-search',
    name: 'Property Search',
    label: 'Search Properties',
    category: 'inventory',
    description: 'Search and filter properties',
    icon: '🔍',
    component: SearchProperties,
    permissions: ['view:inventory'],
  },
];

/**
 * Linda WhatsApp Features (Template)
 */
export const lindaWhatsAppFeatures: Feature[] = [
  // {
  //   id: 'whatsapp-dashboard',
  //   name: 'WhatsApp Dashboard',
  //   label: 'Dashboard',
  //   category: 'whatsapp',
  //   description: 'Overview of WhatsApp conversations and counters',
  //   icon: '💬',
  //   component: LindaWhatsAppDashboard,
  //   permissions: ['view:whatsapp'],
  // },
  // Add more WhatsApp features
];

/**
 * Admin Features (Template)
 */
export const adminFeatures: Feature[] = [
  // {
  //   id: 'admin-dashboard',
  //   name: 'Admin Dashboard',
  //   label: 'Dashboard',
  //   category: 'admin',
  //   description: 'System administration and monitoring',
  //   icon: '⚙️',
  //   component: AdminDashboard,
  //   permissions: ['admin:view'],
  // },
];

/**
 * Combine all features
 */
export const allFeatures: Feature[] = [
  ...maryInventoryFeatures,
  ...lindaWhatsAppFeatures,
  ...adminFeatures,
];

export default allFeatures;
