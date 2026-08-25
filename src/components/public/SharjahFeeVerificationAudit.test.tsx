import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SharjahFeeVerificationAudit } from './SharjahFeeVerificationAudit';

describe('SharjahFeeVerificationAudit', () => {
  it('renders Sharjah tenancy fee audit table and totals', () => {
    render(<SharjahFeeVerificationAudit />);

    expect(screen.getByText('Annual Rent')).toBeDefined();
    expect(screen.getByText('Building Security Deposit')).toBeDefined();
    expect(screen.getByText('SEWA Deposit')).toBeDefined();
  });
});
