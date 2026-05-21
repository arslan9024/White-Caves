/**
 * UnifiedCRM — Unit Tests
 * Tests: render, RBAC view filtering, view switching, loading state,
 * access denied, dashboard configs, metric rendering, callback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import UnifiedCRM from './UnifiedCRM';

// ── Store factory ────────────────────────────────────────────────
function createMockStore(role: string = 'admin') {
  return configureStore({
    reducer: {
      auth: () => ({
        user: { id: 'u1', name: 'Test', email: 'test@wc.ae', role },
      }),
    },
  });
}

function renderWithStore(ui: React.ReactElement, role = 'admin') {
  const store = createMockStore(role);
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

// ═══════════════════════════════════════════════════════════════════

describe('UnifiedCRM', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Render — Admin ──────────────────────────────────────────────
  it('renders default company view for admin', () => {
    renderWithStore(<UnifiedCRM />);
    // Company Overview appears in both <h1> and <button>
    expect(screen.getAllByText(/Company Overview/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Company-wide metrics and KPIs/)).toBeDefined();
  });

  it('renders view selector buttons for admin role', () => {
    renderWithStore(<UnifiedCRM />);
    // Admin has access to all 12 dashboards — buttons in view selector
    expect(screen.getAllByText(/Sales Pipeline/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Property Inventory/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Commission Tracking/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Leads Management/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Financial Dashboard/).length).toBeGreaterThan(0);
  });

  it('renders metrics cards for the current view', () => {
    renderWithStore(<UnifiedCRM />);
    // Company view metrics
    expect(screen.getByText('TOTAL REVENUE')).toBeDefined();
    expect(screen.getByText('TOTAL AGENTS')).toBeDefined();
    expect(screen.getByText('TOTAL CLIENTS')).toBeDefined();
    expect(screen.getByText('MARKET POSITION')).toBeDefined();
  });

  it('renders features list for the current view', () => {
    renderWithStore(<UnifiedCRM />);
    expect(screen.getByText('Available Features')).toBeDefined();
    expect(screen.getByText('COMPANY METRICS')).toBeDefined();
    expect(screen.getByText('TEAM OVERVIEW')).toBeDefined();
    expect(screen.getByText('FINANCIAL SUMMARY')).toBeDefined();
  });

  it('renders role badges for accessible roles', () => {
    renderWithStore(<UnifiedCRM />);
    expect(screen.getByText('ADMIN')).toBeDefined();
    expect(screen.getByText('CEO')).toBeDefined();
    expect(screen.getByText('COO')).toBeDefined();
  });

  // ── View Switching ──────────────────────────────────────────────
  it('switches view when clicking a view button', async () => {
    renderWithStore(<UnifiedCRM />);

    fireEvent.click(screen.getByText(/Sales Pipeline/));

    // Should show loading
    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    // Now shows sales metrics
    expect(screen.getByText('PIPELINE VALUE')).toBeDefined();
    expect(screen.getByText('DEALS IN PROGRESS')).toBeDefined();
    expect(screen.getByText('CONVERSION RATE')).toBeDefined();
  });

  it('shows loading skeleton during view transition', () => {
    renderWithStore(<UnifiedCRM />);
    fireEvent.click(screen.getByText(/Sales Pipeline/));
    expect(screen.getByTestId('unified-crm-loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Available Features')).toBeNull();
  });

  it('calls onViewChange callback when view changes', async () => {
    const onViewChange = vi.fn();
    renderWithStore(<UnifiedCRM onViewChange={onViewChange} />);

    fireEvent.click(screen.getByText(/Leads Management/));
    expect(onViewChange).toHaveBeenCalledWith('leads');

    await act(async () => {
      vi.advanceTimersByTime(600);
    });
  });

  it('accepts a custom default view', async () => {
    renderWithStore(<UnifiedCRM defaultView="financial" />);
    // Financial Dashboard appears in both h1 and button
    expect(screen.getAllByText(/Financial Dashboard/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('TOTAL REVENUE')).toBeDefined();
    expect(screen.getByText('OPERATING COSTS')).toBeDefined();
  });

  // ── RBAC — Agent Role ───────────────────────────────────────────
  it('shows only agent-accessible views for agent role', () => {
    renderWithStore(<UnifiedCRM defaultView="sales" />, 'agent');
    // Agent can see: sales, property, commission, leads, agent, performance, client
    // Sales Pipeline appears in h1 + button
    expect(screen.getAllByText(/Sales Pipeline/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Commission Tracking/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Performance KPIs/).length).toBeGreaterThan(0);
    // Should NOT see admin-only views
    expect(screen.queryByText(/^.*Department$/)).toBeNull();
    expect(screen.queryByText(/Financial Dashboard/)).toBeNull();
  });

  // ── RBAC — Finance Role ─────────────────────────────────────────
  it('shows only finance-accessible views for finance role', () => {
    renderWithStore(<UnifiedCRM defaultView="commission" />, 'finance');
    // Commission Tracking appears in h1 + button
    expect(screen.getAllByText(/Commission Tracking/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Financial Dashboard/).length).toBeGreaterThan(0);
    // Should NOT see agent views
    expect(screen.queryByText(/Sales Pipeline/)).toBeNull();
    expect(screen.queryByText(/Leads Management/)).toBeNull();
  });

  // ── RBAC — Operations Role ──────────────────────────────────────
  it('shows only operations-accessible views for operations role', () => {
    renderWithStore(<UnifiedCRM defaultView="property" />, 'operations');
    // Property Inventory appears in h1 + button
    expect(screen.getAllByText(/Property Inventory/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Inventory Management/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Office Management/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sales Pipeline/)).toBeNull();
  });

  // ── Access Denied ───────────────────────────────────────────────
  it('shows Access Denied for unauthorized view', () => {
    // Finance role does NOT have access to "company" — let's check
    // company roles = ['admin', 'ceo', 'coo']
    renderWithStore(<UnifiedCRM defaultView="company" />, 'agent');
    // Agent doesn't have access to company view
    expect(screen.getByText('Access Denied')).toBeDefined();
    expect(screen.getByText(/don't have permission/)).toBeDefined();
  });

  // ── Metric Display Values ───────────────────────────────────────
  it('shows $ prefix for revenue and commission metrics', () => {
    renderWithStore(<UnifiedCRM />);
    // Revenue metric should have $ prefix
    const metricValues = screen.getAllByText(/^\$250,000$/);
    expect(metricValues.length).toBeGreaterThan(0);
  });

  it('shows plain numbers for non-currency metrics', () => {
    renderWithStore(<UnifiedCRM />);
    // Non-currency metrics show 1,250
    const plainMetrics = screen.getAllByText('1,250');
    expect(plainMetrics.length).toBeGreaterThan(0);
  });

  // ── Role Display ────────────────────────────────────────────────
  it('displays capitalized user role in subtitle', () => {
    // Manager has access to department view, not company (default)
    renderWithStore(<UnifiedCRM defaultView="department" />, 'manager');
    expect(screen.getByText(/Manager/)).toBeDefined();
  });

  // ── Multiple View Switches ──────────────────────────────────────
  it('handles multiple rapid view switches', async () => {
    renderWithStore(<UnifiedCRM />);

    fireEvent.click(screen.getByText(/Sales Pipeline/));
    fireEvent.click(screen.getByText(/Leads Management/));

    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    // Should end up on leads
    expect(screen.getByText('TOTAL LEADS')).toBeDefined();
  });
});
