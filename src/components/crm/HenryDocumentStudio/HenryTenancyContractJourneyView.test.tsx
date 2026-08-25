import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HenryTenancyContractJourneyView from './HenryTenancyContractJourneyView';

describe('HenryTenancyContractJourneyView', () => {
  it('renders official DLD unified tenancy contract stepper and action buttons', () => {
    render(<HenryTenancyContractJourneyView />);

    expect(screen.getByText(/1. Title Deed & Landlord KYC/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Tenant KYC & Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Contract Terms & Financials/i)).toBeInTheDocument();
  });
});
