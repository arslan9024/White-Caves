import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SecurityDepositRefundLedger } from './SecurityDepositRefundLedger';

describe('SecurityDepositRefundLedger Component', () => {
  it('renders security deposit refund ledger with itemized deductions', () => {
    render(<SecurityDepositRefundLedger />);
    expect(screen.getByTestId('security-deposit-refund-ledger')).toBeDefined();
    expect(screen.getByText(/Security Deposit Refund Ledger/i)).toBeDefined();
    expect(screen.getByText(/Repainting — Master Bedroom/i)).toBeDefined();
    expect(screen.getByText(/Broken AC Unit Repair/i)).toBeDefined();
  });
});
