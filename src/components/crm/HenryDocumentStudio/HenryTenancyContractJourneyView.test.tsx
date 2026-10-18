import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import HenryTenancyContractJourneyView from './HenryTenancyContractJourneyView';

describe('HenryTenancyContractJourneyView', () => {
  it('renders official DLD unified tenancy contract stepper and action buttons', () => {
    render(<HenryTenancyContractJourneyView />);

    expect(screen.getByText(/1. Title Deed & Landlord KYC/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Tenant KYC & Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Contract Terms & Financials/i)).toBeInTheDocument();
  });
  it('describes draft saving as session-only, never durable vault archival', () => {
    render(<HenryTenancyContractJourneyView />);
    fireEvent.click(screen.getByText('4. Signatures & Final Actions'));
    fireEvent.click(screen.getByText('Keep for this session only'));
    expect(screen.getByText(/Not saved to the encrypted vault; it will be lost on reload/)).toBeInTheDocument();
    expect(screen.queryByText('Save to Henry Vault')).not.toBeInTheDocument();
  });
});
