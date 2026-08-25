import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyDetailMortgageEmi } from './PropertyDetailMortgageEmi';

describe('PropertyDetailMortgageEmi', () => {
  it('renders mortgage calculator with initial EMI and recalculates on input change', () => {
    render(<PropertyDetailMortgageEmi />);

    expect(screen.getByTestId('property-detail-mortgage-emi')).toBeDefined();
    expect(screen.getByText(/Estimated Monthly Installment/i)).toBeDefined();

    const priceInput = screen.getByDisplayValue('18500000');
    fireEvent.change(priceInput, { target: { value: '10000000' } });

    expect(screen.getByDisplayValue('10000000')).toBeDefined();
  });
});
