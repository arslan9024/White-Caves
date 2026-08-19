/**
 * MobileDashboardPage.test.tsx — Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MobileDashboardPage } from './MobileDashboardPage';

// Mock child components to isolate unit under test
vi.mock('../MobileKpiTileRow', () => ({
  MobileKpiTileRow: () => <div data-testid="mock-kpi-row" />,
}));
vi.mock('../../pwa/ServiceWorkerRegistrationBanner', () => ({
  ServiceWorkerRegistrationBanner: () => <div data-testid="mock-sw-banner" />,
}));
vi.mock('../../pwa/OfflineSyncStatusIndicator', () => ({
  OfflineSyncStatusIndicator: () => <div data-testid="mock-sync-indicator" />,
}));
vi.mock('../PullToRefreshWrapper', () => ({
  PullToRefreshWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-ptr">{children}</div>
  ),
}));
vi.mock('./logic/MobileDashboardPage.logic', () => ({
  useMobileDashboardPageLogic: () => ({
    activities: [
      {
        id: 'A1',
        type: 'lead',
        title: 'New lead assigned',
        detail: 'Mohammed Al Rashidi',
        time: '5m ago',
        icon: 'Users',
        color: '#3b82f6',
      },
    ],
    isRefreshing: false,
    agentName: 'Arslan Malik',
    handleRefresh: vi.fn(),
  }),
}));

describe('MobileDashboardPage', () => {
  it('renders page root', () => {
    render(<MobileDashboardPage />);
    expect(screen.getByTestId('mobile-dashboard-page')).toBeDefined();
  });

  it('renders greeting with agent first name', () => {
    render(<MobileDashboardPage />);
    expect(screen.getByText(/Arslan/i)).toBeDefined();
  });

  it('renders activity item', () => {
    render(<MobileDashboardPage />);
    expect(screen.getByText('New lead assigned')).toBeDefined();
    expect(screen.getByText('5m ago')).toBeDefined();
  });

  it('renders KPI row, SW banner, and pull-to-refresh', () => {
    render(<MobileDashboardPage />);
    expect(screen.getByTestId('mock-kpi-row')).toBeDefined();
    expect(screen.getByTestId('mock-sw-banner')).toBeDefined();
    expect(screen.getByTestId('mock-ptr')).toBeDefined();
  });
});
