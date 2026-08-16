import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LandlordPayoutBatchDispatch } from './LandlordPayoutBatchDispatch';

describe('LandlordPayoutBatchDispatch Component', () => {
  it('renders landlord payout batch dispatch engine and landlord payout cards', () => {
    render(<LandlordPayoutBatchDispatch />);
    expect(screen.getByTestId('landlord-payout-batch-dispatch')).toBeDefined();
    expect(screen.getByText(/Landlord Monthly Net Payout Automated Batch Dispatch/i)).toBeDefined();
    expect(screen.getByText(/Dr. Tariq Al Qasimi/i)).toBeDefined();
    expect(screen.getByText(/Elena Rostova/i)).toBeDefined();
  });
});
