/**
 * DashboardRenderer.test.tsx — Tests for component registry + renderer
 * ─────────────────────────────────────────────────────────────────────
 * Tests: getDashboardComponent, getAllRegisteredComponents,
 *        DashboardSubTabRenderer (renders known, handles unknown).
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  getDashboardComponent,
  getAllRegisteredComponents,
  DashboardSubTabRenderer,
} from './DashboardRenderer';

// ─── getDashboardComponent ───────────────────────────────────────────

describe('getDashboardComponent', () => {
  it('returns a component for known buyer tab', () => {
    expect(getDashboardComponent('BuyerOverview')).not.toBeNull();
    expect(typeof getDashboardComponent('BuyerOverview')).toBe('function');
  });

  it('returns a component for known seller tab', () => {
    expect(getDashboardComponent('SellerListings')).not.toBeNull();
  });

  it('returns a component for known landlord tab', () => {
    expect(getDashboardComponent('LandlordProperties')).not.toBeNull();
  });

  it('returns a component for known tenant tab', () => {
    expect(getDashboardComponent('TenantOverview')).not.toBeNull();
  });

  it('returns a component for known agent tab', () => {
    expect(getDashboardComponent('LeasingPipeline')).not.toBeNull();
    expect(getDashboardComponent('SalesPipeline')).not.toBeNull();
  });

  it('returns a component for known owner tab', () => {
    expect(getDashboardComponent('OwnerOverview')).not.toBeNull();
    expect(getDashboardComponent('SystemHealth')).not.toBeNull();
  });

  it('returns null for unknown component name', () => {
    expect(getDashboardComponent('NonExistentComponent')).toBeNull();
    expect(getDashboardComponent('')).toBeNull();
  });
});

// ─── getAllRegisteredComponents ───────────────────────────────────────

describe('getAllRegisteredComponents', () => {
  it('returns an array of registered component names', () => {
    const names = getAllRegisteredComponents();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(30); // We have 41 sub-tabs
  });

  it('includes all buyer components', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('BuyerOverview');
    expect(names).toContain('SavedProperties');
    expect(names).toContain('ViewingSchedule');
    expect(names).toContain('PriceAlerts');
    expect(names).toContain('BuyerOffers');
  });

  it('includes all seller components', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('SellerListings');
    expect(names).toContain('SellerInquiries');
    expect(names).toContain('MarketInsights');
    expect(names).toContain('ReceivedOffers');
    expect(names).toContain('SellerAnalytics');
  });

  it('includes all landlord components', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('LandlordProperties');
    expect(names).toContain('TenantManagement');
    expect(names).toContain('MaintenanceRequests');
    expect(names).toContain('FinancialSummary');
    expect(names).toContain('LeaseManagement');
  });

  it('includes all tenant components', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('TenantOverview');
    expect(names).toContain('TenantLease');
    expect(names).toContain('TenantPayments');
    expect(names).toContain('TenantMaintenance');
    expect(names).toContain('TenantDocuments');
  });

  it('includes all agent components', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('LeasingPipeline');
    expect(names).toContain('SalesPipeline');
    expect(names).toContain('ActiveDeals');
    expect(names).toContain('AgentPerformance');
  });

  it('includes all owner components', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('OwnerOverview');
    expect(names).toContain('BusinessAnalytics');
    expect(names).toContain('WhatsAppDashboard');
    expect(names).toContain('SystemHealth');
    expect(names).toContain('SystemSettings');
  });

  it('includes lazy-loaded pages', () => {
    const names = getAllRegisteredComponents();
    expect(names).toContain('FavoriteListings');
    expect(names).toContain('SavedSearches');
  });
});

// ─── DashboardSubTabRenderer ─────────────────────────────────────────

describe('DashboardSubTabRenderer', () => {
  it('renders "Coming soon" for unknown component name', () => {
    render(<DashboardSubTabRenderer componentName="UnknownWidget" />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it('includes the component name in the fallback message', () => {
    render(<DashboardSubTabRenderer componentName="FutureFeature" />);
    expect(screen.getByText(/FutureFeature/i)).toBeInTheDocument();
  });
});
