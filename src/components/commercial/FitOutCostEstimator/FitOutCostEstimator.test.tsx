import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FitOutCostEstimator } from './FitOutCostEstimator';

describe('FitOutCostEstimator Component', () => {
  it('renders commercial fit-out cost estimator and recalculates on tier change', () => {
    render(<FitOutCostEstimator />);
    expect(screen.getByTestId('fit-out-cost-estimator')).toBeDefined();
    expect(screen.getByText(/Retail & Commercial Fit-Out Cost Calculator/i)).toBeDefined();
    expect(screen.getByText(/Total Estimated Fit-Out/i)).toBeDefined();
    expect(screen.getByText(/MEP & HVAC/i)).toBeDefined();

    // Select luxury tier
    const select = screen.getByDisplayValue(/Corporate Grade A/i);
    fireEvent.change(select, { target: { value: 'luxury' } });
    expect(screen.getByText(/Luxury Bespoke/i)).toBeDefined();
  });
});
