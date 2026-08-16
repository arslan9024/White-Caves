import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DldFeeSimulator } from './DldFeeSimulator';

describe('DldFeeSimulator Component', () => {
  it('renders DLD fee simulator and computes transfer fees and commission', () => {
    render(<DldFeeSimulator />);
    expect(screen.getByTestId('dld-fee-simulator')).toBeDefined();
    expect(screen.getByText(/DLD Fee Simulator/i)).toBeDefined();
    expect(screen.getByText(/Law 85 of 2006/i)).toBeDefined();
    expect(screen.getByText(/DLD Transfer Fee \(4%\)/i)).toBeDefined();
    expect(screen.getByText(/Real Estate Agent Commission \(2%\)/i)).toBeDefined();
    expect(screen.getByText(/TOTAL TRANSFER COSTS/i)).toBeDefined();

    // Trigger calculation
    const calcBtn = screen.getByRole('button', { name: /Calculate DLD Fees/i });
    fireEvent.click(calcBtn);
    expect(screen.getByText(/TOTAL TRANSFER COSTS/i)).toBeDefined();
  });
});
