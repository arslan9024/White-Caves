// FILE: src/components/crm/DldEscrowCalculator/DldEscrowCalculator.test.tsx
/**
 * White Caves Real Estate LLC - DLD & Sovereign Escrow Underwriting Suite
 * Standard: Vitest + Testing Library
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { calculateDldEscrow } from './DldEscrowCalculator.logic';
import { DldEscrowCalculatorView } from './DldEscrowCalculatorView';

afterEach(() => {
  cleanup();
});

describe('calculateDldEscrow pure mathematical logic', () => {
  it('calculates statutory 4% DLD fee and standard ready title deed fee', () => {
    const result = calculateDldEscrow({
      propertyPrice: 2000000,
      category: 'READY_RESIDENTIAL',
      buyerType: 'INDIVIDUAL_RESIDENT',
      hasMortgage: false,
      mortgageAmount: 0,
      commissionPercentage: 2.0,
      developerEscrowAcc: 'AE03-DLD-ESCROW-0094821',
    });

    expect(result.dldTransferFee).toBe(80000); // 4% of 2M
    expect(result.dldAdminFee).toBe(580); // Ready title deed
    expect(result.trusteeFee).toBe(4200); // 4000 * 1.05
    expect(result.agencyCommission).toBe(40000); // 2% of 2M
    expect(result.vatOnCommission).toBe(2000); // 5% of 40k
    expect(result.corporateTaxReserve).toBe(3600); // 9% of 40k
  });

  it('calculates mortgage registration fees when mortgage is present', () => {
    const result = calculateDldEscrow({
      propertyPrice: 4000000,
      category: 'READY_RESIDENTIAL',
      buyerType: 'INDIVIDUAL_RESIDENT',
      hasMortgage: true,
      mortgageAmount: 3000000,
      commissionPercentage: 2.0,
      developerEscrowAcc: 'AE03-DLD-ESCROW-0094821',
    });

    expect(result.mortgageRegistrationFee).toBe(7500); // 0.25% of 3M
    expect(result.mortgageAdminFee).toBe(290);
    expect(result.totalGovFees).toBe(160000 + 580 + 4200 + 7500 + 290);
  });
});

describe('DldEscrowCalculatorView component mounting', () => {
  it('renders root container and interactive inputs properly', () => {
    render(<DldEscrowCalculatorView initialPrice={3000000} />);
    
    expect(screen.getByTestId('dld-escrow-calculator-root')).toBeInTheDocument();
    expect(screen.getByTestId('stat-dld-fee')).toHaveTextContent('AED 120,000');
    expect(screen.getByTestId('btn-proceed-escrow')).toBeInTheDocument();
  });

  it('updates dynamic closing calculations when property price changes', () => {
    render(<DldEscrowCalculatorView initialPrice={1000000} />);
    
    const priceInput = screen.getByTestId('input-property-price');
    fireEvent.change(priceInput, { target: { value: '5000000' } });

    expect(screen.getByTestId('stat-dld-fee')).toHaveTextContent('AED 200,000');
  });
});
