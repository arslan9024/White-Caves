import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AnalyticsDashboard from './AnalyticsDashboard';

const mockAuthFetch = vi.fn();

vi.mock('../../../utils/authFetch', () => ({
  authFetch: (...args) => mockAuthFetch(...args),
}));

vi.mock('./MetricCard', () => ({
  default: ({ title, value }) => (
    <div data-testid="metric-card">
      <span>{title}</span>
      <span>{String(value)}</span>
    </div>
  ),
}));

vi.mock('./PropertyDistributionChart', () => ({
  default: () => <div data-testid="distribution-chart" />,
}));

vi.mock('./PricingAnalyticsChart', () => ({
  default: () => <div data-testid="pricing-chart" />,
}));

vi.mock('./OccupancyChart', () => ({
  default: () => <div data-testid="occupancy-chart" />,
}));

vi.mock('./AnalyticsDashboard.css', () => ({}));

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

describe('AnalyticsDashboard', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('loads dashboard stats via authFetch and renders heading', async () => {
    mockAuthFetch.mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: {
          keyMetrics: {
            totalProperties: 12,
            occupiedProperties: 9,
            vacantProperties: 3,
            averagePrice: 2400000,
            totalPortfolioValue: 45000000,
            occupancyRate: 75,
          },
          distribution: { byType: [] },
          pricing: { avg: 100 },
          occupancy: { current: 75 },
          areaAnalytics: [],
        },
      })
    );

    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/property-inventory/analytics/dashboard');
      expect(screen.getByText('Analytics & Reports')).toBeInTheDocument();
    });
  });

  it('retries fetch on Try Again after load failure', async () => {
    mockAuthFetch.mockResolvedValueOnce(jsonResponse({ error: 'boom' }, 500)).mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: {
          keyMetrics: { totalProperties: 1, occupiedProperties: 1, occupancyRate: 100 },
          distribution: {},
          pricing: {},
          occupancy: {},
          areaAnalytics: [],
        },
      })
    );

    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to Load Dashboard')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Analytics & Reports')).toBeInTheDocument();
    });
  });
});
