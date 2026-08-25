import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FamilyOfficeAssetAllocationChart } from './FamilyOfficeAssetAllocationChart';

describe('FamilyOfficeAssetAllocationChart', () => {
  it('renders family office portfolio allocation pie chart and asset categories', () => {
    render(<FamilyOfficeAssetAllocationChart />);

    expect(screen.getByTestId('family-office-asset-allocation-chart')).toBeDefined();
    expect(screen.getByText(/Family Office Asset Allocation/i)).toBeDefined();
    expect(screen.getByText('Residential')).toBeDefined();
    expect(screen.getByText('Commercial')).toBeDefined();
    expect(screen.getByText('Off-Plan')).toBeDefined();
  });
});
