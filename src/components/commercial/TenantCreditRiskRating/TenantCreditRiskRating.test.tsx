import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TenantCreditRiskRating } from './TenantCreditRiskRating';

describe('TenantCreditRiskRating Component', () => {
  it('renders commercial tenant underwriting credit risk rating and displays assessment grade', () => {
    render(<TenantCreditRiskRating />);
    expect(screen.getByTestId('tenant-credit-risk-rating')).toBeDefined();
    expect(screen.getByText(/Commercial Tenant Underwriting & Credit Risk Rating/i)).toBeDefined();
    expect(screen.getByText(/RISK APPRAISAL/i)).toBeDefined();
    expect(screen.getByText(/Underwriting Assessment Grade/i)).toBeDefined();
    expect(screen.getByText(/Rent-to-Revenue Ratio/i)).toBeDefined();
  });
});
