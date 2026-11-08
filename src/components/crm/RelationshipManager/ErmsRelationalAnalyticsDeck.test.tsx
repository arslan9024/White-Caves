/**
 * ErmsRelationalAnalyticsDeck.test.tsx
 * Targeted Vitest test suite for ErmsRelationalAnalyticsDeck
 * Verifies calculation accuracy for UAE 5% VAT, 9% Corporate Tax, and 70/30 commission splits
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsRelationalAnalyticsDeck } from './ErmsRelationalAnalyticsDeck';

describe('ErmsRelationalAnalyticsDeck (Pillars 2 & 5 Verification)', () => {
  it('renders all metrics accurately based on gross pipeline volume', () => {
    // 10,000,000 AED deal volume
    // 2% Commission = 200,000 AED
    // Agent 70% = 140,000 AED
    // Brokerage 30% = 60,000 AED
    // 5% VAT on 200k = 10,000 AED
    // 9% Corp Tax on 60k = 5,400 AED
    render(
      <ErmsRelationalAnalyticsDeck
        grossDealVolumeAED={10000000}
        totalDealsCount={10}
      />
    );

    expect(screen.getByText('AED 10,000,000')).toBeInTheDocument();
    expect(screen.getByText('AED 140,000')).toBeInTheDocument();
    expect(screen.getByText('AED 10,000')).toBeInTheDocument();
    expect(screen.getByText('AED 5,400')).toBeInTheDocument();
  });

  it('triggers onFilterPresetChange callback on preset click', () => {
    const handleFilterChange = vi.fn();
    render(<ErmsRelationalAnalyticsDeck onFilterPresetChange={handleFilterChange} />);

    const leasesBtn = screen.getByRole('button', { name: 'Active Leases' });
    fireEvent.click(leasesBtn);

    expect(handleFilterChange).toHaveBeenCalledWith('LEASES');
  });
});
