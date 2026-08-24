import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';

describe('HenryEmiratesIdScannerView', () => {
  it('renders Emirates ID verification studio with action buttons', () => {
    render(<HenryEmiratesIdScannerView />);

    expect(screen.getByText(/3.19.2 Emirates ID Live Extraction Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Emirates ID Document Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm & Save to KYC Vault/i)).toBeInTheDocument();
  });
});
