/**
 * DashboardRenderer — Maps featureRegistry `component` name → real React component.
 * ─────────────────────────────────────────────────────────────────────────────────────
 * Usage:
 *   import { getDashboardComponent } from './DashboardRenderer';
 *   const Comp = getDashboardComponent('BuyerOverview');
 *   return Comp ? <Comp /> : <DefaultFallback />;
 *
 * All 41 sub-tab components from featureRegistry.ts are registered here.
 */

import React, { lazy, Suspense, ComponentType } from 'react';

// ──── Eager imports (buyer + existing pages) ────────────────────────────
import { BuyerOverview, SavedProperties, ViewingSchedule, PriceAlerts, BuyerOffers } from './BuyerTabs';
import { SellerListings, SellerInquiries, MarketInsights, ReceivedOffers, SellerAnalytics } from './SellerTabs';
import { LandlordProperties, TenantManagement, MaintenanceRequests, FinancialSummary, LeaseManagement } from './LandlordTabs';
import { TenantOverview, TenantLease, TenantPayments, TenantMaintenance, TenantDocuments } from './TenantTabs';
import { LeasingPipeline, LeasingProperties, LeaseContracts, LeasingViewings, TenantApplications, LeaseRenewals,
         SalesPipeline, SalesLeads, ActiveDeals, AgentPerformance } from './AgentTabs';
import { OwnerOverview, BusinessAnalytics, WhatsAppDashboard, SystemHealth, SystemSettings } from './OwnerTabs';

// Existing full-page components (from Phase 5)
const FavoriteListings = lazy(() => import('../../pages/buyer/FavoriteListings'));
const SavedSearchesPage = lazy(() => import('../../pages/buyer/SavedSearches'));

// ──── Component Registry ────────────────────────────────────────────────
// Keys match the `component` field in featureRegistry.ts SubNavItem entries.

const COMPONENT_MAP: Record<string, ComponentType<any>> = {
  // Buyer
  BuyerOverview,
  SavedProperties,
  ViewingSchedule,
  PriceAlerts,
  BuyerOffers,
  FavoriteListings,      // lazy from pages/buyer
  SavedSearches: SavedSearchesPage, // alias

  // Seller
  SellerListings,
  SellerInquiries,
  MarketInsights,
  ReceivedOffers,
  SellerAnalytics,

  // Landlord
  LandlordProperties,
  TenantManagement,
  MaintenanceRequests,
  FinancialSummary,
  LeaseManagement,

  // Tenant
  TenantOverview,
  TenantLease,
  TenantPayments,
  TenantMaintenance,
  TenantDocuments,

  // Leasing Agent
  LeasingPipeline,
  LeasingProperties,
  LeaseContracts,
  LeasingViewings,
  TenantApplications,
  LeaseRenewals,

  // Sales Agent
  SalesPipeline,
  SalesLeads,
  ActiveDeals,
  AgentPerformance,

  // Owner / Admin
  OwnerOverview,
  BusinessAnalytics,
  WhatsAppDashboard,
  SystemHealth,
  SystemSettings,
};

/**
 * Look up a component by its featureRegistry `component` name.
 * Returns the React component or `null` if not found.
 */
export function getDashboardComponent(componentName: string): ComponentType<any> | null {
  return COMPONENT_MAP[componentName] ?? null;
}

/**
 * Get the full registry map (useful for debug / listing available components).
 */
export function getAllRegisteredComponents(): string[] {
  return Object.keys(COMPONENT_MAP);
}

// ──── Convenience wrapper with Suspense + fallback ──────────────────────

interface DashboardSubTabRendererProps {
  /** The `component` string from a featureRegistry SubNavItem */
  componentName: string;
  /** Fallback shown when the component is lazy or loading */
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7280' }}>Loading…</div>
);

/**
 * Renders the matched dashboard sub-tab component.
 * Handles Suspense for lazy-loaded components automatically.
 * Shows a "Coming soon" message for unknown components.
 */
export const DashboardSubTabRenderer: React.FC<DashboardSubTabRendererProps> = ({
  componentName,
  fallback,
}) => {
  const Comp = getDashboardComponent(componentName);

  if (!Comp) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
        <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>Coming Soon</h3>
        <p style={{ color: '#6b7280', maxWidth: '420px', margin: '0 auto' }}>
          The <strong>{componentName}</strong> module is under development.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      <Comp />
    </Suspense>
  );
};

export default DashboardSubTabRenderer;
