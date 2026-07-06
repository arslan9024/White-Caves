import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_t, tag: string) =>
      ({ children, ...p }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag as string, p, children),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

vi.mock('recharts', () => {
  const Mock = ({ children }: { children?: React.ReactNode }) => React.createElement('div', { 'data-testid': 'recharts-mock' }, children);
  return {
    BarChart: Mock, Bar: Mock, XAxis: Mock, YAxis: Mock,
    CartesianGrid: Mock, Tooltip: Mock, ResponsiveContainer: Mock, Cell: Mock,
  };
});

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import FunnelEconomicsDashboard from './FunnelEconomicsDashboard';

describe('FunnelEconomicsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockRejectedValue(new Error('not found')); // force mock data
  });

  it('renders without crashing', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('Funnel Economics')).toBeDefined();
  });

  it('shows Total Leads KPI tile', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('Total Leads')).toBeDefined();
  });

  it('shows Viewing Rate KPI tile', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('Viewing Rate')).toBeDefined();
  });

  it('shows Offer Rate KPI tile', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('Offer Rate')).toBeDefined();
  });

  it('shows Won Rate KPI tile', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('Won Rate')).toBeDefined();
  });

  it('renders period toggle buttons', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('7d')).toBeDefined();
    expect(screen.getByText('30d')).toBeDefined();
    expect(screen.getByText('90d')).toBeDefined();
  });

  it('renders Pipeline Stages heading', () => {
    render(<FunnelEconomicsDashboard />);
    expect(screen.getByText('Pipeline Stages')).toBeDefined();
  });
});


