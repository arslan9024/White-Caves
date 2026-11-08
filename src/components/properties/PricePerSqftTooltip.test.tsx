import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricePerSqftTooltip } from './PricePerSqftTooltip';

describe('PricePerSqftTooltip (Target T-0007)', () => {
  it('renders rate per sqft and displays DLD valuation tooltip on hover', () => {
    render(
      <PricePerSqftTooltip
        priceAed={2000000}
        areaSqft={1000}
        benchmarkPricePerSqft={1800} // listed: 2000 vs bench: 1800 -> +11%
      />
    );

    expect(screen.getByText(/AED 2,000/)).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    const triggerBtn = screen.getByRole('button', { name: /Price per square foot market analysis/i });
    fireEvent.mouseEnter(triggerBtn.parentElement!);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('DLD Area Valuation')).toBeInTheDocument();
    expect(screen.getByText(/\+11% vs median/)).toBeInTheDocument();

    fireEvent.mouseLeave(triggerBtn.parentElement!);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
