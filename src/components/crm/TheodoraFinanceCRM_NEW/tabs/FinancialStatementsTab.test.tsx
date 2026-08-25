import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FinancialStatementsTab } from './FinancialStatementsTab';

describe('FinancialStatementsTab', () => {
  it('renders P&L, Balance Sheet, Cash Flow, and Audit Pack sub-navigation tabs', () => {
    render(<FinancialStatementsTab />);

    expect(screen.getByText(/Profit & Loss \(P&L\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Balance Sheet/i)).toBeInTheDocument();
    expect(screen.getByText(/Cash Flow & Bank Recon/i)).toBeInTheDocument();
  });
});
