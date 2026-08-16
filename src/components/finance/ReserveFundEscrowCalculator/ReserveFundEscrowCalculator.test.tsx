import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReserveFundEscrowCalculator } from './ReserveFundEscrowCalculator';

describe('ReserveFundEscrowCalculator Component', () => {
  it('renders sinking and reserve fund escrow calculator and computes statutory allocations', () => {
    render(<ReserveFundEscrowCalculator />);
    expect(screen.getByTestId('reserve-fund-escrow-calculator')).toBeDefined();
    expect(screen.getByText(/Sinking & Reserve Fund Escrow Model/i)).toBeDefined();
    expect(screen.getByText(/ASSET GOVERNANCE/i)).toBeDefined();
    expect(screen.getByText(/Annual Reserve Escrow/i)).toBeDefined();
    expect(screen.getByText(/Statutory CapEx Reserve Sub-Accounts/i)).toBeDefined();
    expect(screen.getByText(/HVAC & Mechanical Plant Replacement/i)).toBeDefined();

    const unitsInput = screen.getByDisplayValue('24');
    fireEvent.change(unitsInput, { target: { value: '48' } });
    expect(screen.getByText(/Per Unit Allocation/i)).toBeDefined();
  });
});
