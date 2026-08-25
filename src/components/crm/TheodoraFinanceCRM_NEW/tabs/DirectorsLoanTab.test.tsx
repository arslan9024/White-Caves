import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DirectorsLoanTab } from './DirectorsLoanTab';

describe('DirectorsLoanTab', () => {
  it('renders Director Loan Account (DLA) ledger with outstanding balances and transaction history', () => {
    render(<DirectorsLoanTab />);

    expect(screen.getByText(/Total Advances \(Owner Equity\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Settled & Reimbursed/i)).toBeInTheDocument();
    expect(screen.getByText(/Property Finder Portal August Subscription/i)).toBeInTheDocument();
  });
});
