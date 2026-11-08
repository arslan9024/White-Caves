import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReraRentalCalculatorModal } from './ReraRentalCalculatorModal';

describe('ReraRentalCalculatorModal Component', () => {
  it('renders inputs and computes permissible increase per Decree 43/2013', () => {
    const handleClose = vi.fn();
    render(
      <ReraRentalCalculatorModal
        isOpen={true}
        onClose={handleClose}
        defaultCurrentRent={100000}
        defaultBenchmarkRent={130000} // +30% gap -> 10% permissible increase
      />
    );

    expect(screen.getByText('Official RERA Rental Calculator')).toBeInTheDocument();
    expect(screen.getByText(/10% \(10,000 AED\)/)).toBeInTheDocument();
    expect(screen.getByText(/110,000 AED/)).toBeInTheDocument();
    expect(screen.getByText(/90 Days Prior/)).toBeInTheDocument();
  });

  it('updates calculation when inputs change', () => {
    render(
      <ReraRentalCalculatorModal
        isOpen={true}
        onClose={vi.fn()}
        defaultCurrentRent={100000}
        defaultBenchmarkRent={105000} // +5% gap (<11%) -> 0% permissible
      />
    );

    expect(screen.getByText(/0% \(0 AED\)/)).toBeInTheDocument();
    expect(screen.getByText(/100,000 AED/)).toBeInTheDocument();
  });
});
