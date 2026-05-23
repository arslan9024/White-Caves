/**
 * ReportingDashboardPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useReportingDashboard', () => ({
  useReportingDashboard: () => ({
    kpis: { newLeads: 42, wonDeals: 8, revenue: 1500000, avgDealSize: 187500 },
    leadSourceBreakdown: [
      { source: 'website', count: 20, percentage: 48 },
      { source: 'referral', count: 12, percentage: 29 },
    ],
    propertyStatusBreakdown: [
      { status: 'available', count: 15, percentage: 60 },
      { status: 'sold', count: 10, percentage: 40 },
    ],
    commissionSummary: { total: 300000, pending: 100000, paid: 200000 },
    loading: false,
    error: null,
    dateRange: { start: '', end: '' },
    setDateRange: vi.fn(),
    exportFormat: 'csv',
    setExportFormat: vi.fn(),
    handleExport: vi.fn(),
    retryFetch: vi.fn(),
    goBack: vi.fn(),
    formatCurrency: (v: number | undefined) => v ? `AED ${v.toLocaleString()}` : '—',
    ...hookOverrides,
  }),
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

import ReportingDashboardPage from './ReportingDashboardPage';

describe('ReportingDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "Reporting Dashboard"', () => {
    render(<ReportingDashboardPage />);
    expect(screen.getByText(/Reporting Dashboard/)).toBeDefined();
  });

  it('renders KPI cards', () => {
    render(<ReportingDashboardPage />);
    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('8')).toBeDefined();
    expect(screen.getByText('New Leads')).toBeDefined();
    expect(screen.getByText('Won Deals')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
    expect(screen.getByText('Avg Deal Size')).toBeDefined();
  });

  it('renders export button', () => {
    render(<ReportingDashboardPage />);
    expect(screen.getByText(/Export Report/)).toBeDefined();
  });

  it('shows loading banner when loading', () => {
    hookOverrides = { loading: true };
    render(<ReportingDashboardPage />);
    expect(screen.getByText(/Loading reports/)).toBeDefined();
  });
});
