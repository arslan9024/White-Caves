import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HenryTenancyContractScannerView from './HenryTenancyContractScannerView';

describe('HenryTenancyContractScannerView', () => {
  it('renders tenancy contract live optical extractor and contract preview', () => {
    render(<HenryTenancyContractScannerView />);

    expect(screen.getByText(/3.19.5 Scan & Extract Tenancy Agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload full Tenancy Agreement PDF/i)).toBeInTheDocument();
  });
});
