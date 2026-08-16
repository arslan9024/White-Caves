import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { JvEquityIrrDistributionModel } from './JvEquityIrrDistributionModel';

describe('JvEquityIrrDistributionModel Component', () => {
  it('renders JV equity waterfall hurdle model with LP and GP returns', () => {
    render(<JvEquityIrrDistributionModel />);
    expect(screen.getByTestId('jv-equity-irr-distribution-model')).toBeDefined();
    expect(screen.getByText(/Institutional JV Equity Waterfall/i)).toBeDefined();
    expect(screen.getByText(/WATERFALL IRR/i)).toBeDefined();
    expect(screen.getByText(/Limited Partner \(LP \/ Capital Investor\)/i)).toBeDefined();
    expect(screen.getByText(/General Partner \(GP Sponsor \/ Developer\)/i)).toBeDefined();
  });
});
