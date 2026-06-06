/**
 * P0-020: KPIBaselineTracker component
 * Tests: loading skeleton, API data rendered, static fallback on error.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import KPIBaselineTracker from '../../crm/KPIBaselineTracker';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', props, children),
  },
}));

describe('KPIBaselineTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;
    render(<KPIBaselineTracker />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders API KPI data when fetch succeeds', async () => {
    const mockKpis = Array.from({ length: 8 }, (_, i) => ({
      name: `KPI ${i + 1}`,
      current: i * 10,
      target: 100,
      unit: '%',
      trend: '↑',
      higherIsBetter: true,
    }));
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { kpis: mockKpis } }),
      })
    ) as unknown as typeof fetch;

    render(<KPIBaselineTracker />);
    await waitFor(() => expect(screen.getByText('KPI 1')).toBeInTheDocument());
    expect(screen.getByText('KPI 8')).toBeInTheDocument();
  });

  it('falls back to static KPIs when API fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ) as unknown as typeof fetch;

    render(<KPIBaselineTracker />);
    await waitFor(() => screen.getByText('First Response Time'));
    expect(screen.getByText('First Response Time')).toBeInTheDocument();
  });
});
