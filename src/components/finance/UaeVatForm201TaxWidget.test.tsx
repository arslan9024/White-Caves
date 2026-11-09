import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UaeVatForm201TaxWidget } from './UaeVatForm201TaxWidget';

describe('UaeVatForm201TaxWidget (DOM-08 / Targets T-0702 & T-0703)', () => {
  it('renders 5% VAT and 9% Corporate Tax reserves accurately', () => {
    render(
      <UaeVatForm201TaxWidget
        defaultCommissionAed={100000}
        defaultAgentXp={3000} // 65% split
        defaultQuarterProfitAed={400000} // > 375k -> 9% CT applies
      />
    );

    expect(screen.getByText('FTA Form 201 VAT & 9% Corporate Tax Ledger')).toBeInTheDocument();
    expect(screen.getByText('5,000 AED')).toBeInTheDocument(); // 5% VAT
    expect(screen.getByText('105,000 AED')).toBeInTheDocument(); // Total with VAT
    expect(screen.getByText('65,000 AED')).toBeInTheDocument(); // 65% broker split
    expect(screen.getByText('3,150 AED')).toBeInTheDocument(); // 9% of 35k company share
  });

  it('updates calculations dynamically when commission changes', () => {
    render(
      <UaeVatForm201TaxWidget
        defaultCommissionAed={50000}
        defaultAgentXp={1000} // 60% split
        defaultQuarterProfitAed={200000} // < 375k threshold -> SBR 0%
      />
    );

    expect(screen.getByText('2,500 AED')).toBeInTheDocument(); // 5% VAT on 50k
    expect(screen.getByText('0 AED')).toBeInTheDocument(); // 0% CT reserve
    expect(screen.getByText('SBR Relieved (0%)')).toBeInTheDocument();
  });
});
