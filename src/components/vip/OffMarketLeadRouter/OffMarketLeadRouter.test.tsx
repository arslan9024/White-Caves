import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OffMarketLeadRouter } from './OffMarketLeadRouter';

describe('OffMarketLeadRouter', () => {
  it('renders off-market lead router and routing tiers', () => {
    render(<OffMarketLeadRouter />);

    expect(screen.getByTestId('off-market-lead-router')).toBeDefined();
    expect(screen.getByText(/Off-Market Ultra-Luxury Lead Router/i)).toBeDefined();
    expect(screen.getByText(/LEVEL 5 SOVEREIGN ACCESS/i)).toBeDefined();
  });
});
