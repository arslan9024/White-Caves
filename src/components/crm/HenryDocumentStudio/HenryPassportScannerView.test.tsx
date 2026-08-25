import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HenryPassportScannerView from './HenryPassportScannerView';

describe('HenryPassportScannerView', () => {
  it('renders international passport live OCR extraction studio', () => {
    render(<HenryPassportScannerView />);

    expect(screen.getByText(/3.19.4 Scan International Passport/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload client passport bio-data/i)).toBeInTheDocument();
  });
});
