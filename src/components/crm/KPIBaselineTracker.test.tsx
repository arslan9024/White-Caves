import { describe, it, expect, vi } from 'vitest';
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

import KPIBaselineTracker from './KPIBaselineTracker';

describe('KPIBaselineTracker', () => {
  it('renders without crashing', () => {
    render(<KPIBaselineTracker />);
    expect(screen.getByText('KPI Baseline Tracker')).toBeDefined();
  });

  it('renders all 8 KPI cards', () => {
    render(<KPIBaselineTracker />);
    const allKPIs = [
      'First Response Time', 'Viewing Conversion Rate', 'Offer-to-Viewing Ratio',
      'Listing Completeness', 'Mobile CRM Sessions', 'Tenant Portal MAU',
      'Organic Leads Share', 'UX Regressions',
    ];
    for (const name of allKPIs) {
      expect(screen.getByText(name)).toBeDefined();
    }
  });

  it('renders 8 progressbar roles', () => {
    render(<KPIBaselineTracker />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars.length).toBe(8);
  });

  it('progressbars have aria-valuenow/min/max attributes', () => {
    render(<KPIBaselineTracker />);
    const bars = screen.getAllByRole('progressbar');
    for (const bar of bars) {
      expect(bar.getAttribute('aria-valuemin')).toBe('0');
      expect(bar.getAttribute('aria-valuemax')).toBe('100');
      expect(bar.getAttribute('aria-valuenow')).toBeDefined();
    }
  });

  it('shows target values', () => {
    render(<KPIBaselineTracker />);
    expect(screen.getByText('Target: <2h')).toBeDefined();
    expect(screen.getByText('Target: 35%')).toBeDefined();
  });
});


