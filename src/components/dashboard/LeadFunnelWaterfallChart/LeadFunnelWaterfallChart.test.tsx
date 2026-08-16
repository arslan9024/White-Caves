import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeadFunnelWaterfallChart } from './LeadFunnelWaterfallChart';

describe('LeadFunnelWaterfallChart Component', () => {
  it('renders lead funnel waterfall chart and pipeline stages', () => {
    render(<LeadFunnelWaterfallChart />);
    expect(screen.getByTestId('lead-funnel-waterfall-chart')).toBeDefined();
    expect(screen.getByText(/Sales Pipeline Conversion Funnel & Velocity/i)).toBeDefined();
    expect(screen.getByText(/CONVERSION WATERFALL/i)).toBeDefined();
    expect(screen.getByText(/1. Inbound Leads/i)).toBeDefined();
    expect(screen.getByText(/5. Signed & Closed/i)).toBeDefined();
  });
});
