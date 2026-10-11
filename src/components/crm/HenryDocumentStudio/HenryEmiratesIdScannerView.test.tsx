import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';

describe('HenryEmiratesIdScannerView', () => {
  it('renders Emirates ID verification studio with action buttons', () => {
    render(<HenryEmiratesIdScannerView />);

    expect(screen.getByText(/3.19.2 Emirates ID Live Extraction Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Emirates ID Document Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm & Save to KYC Vault/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm & Save to KYC Vault/i })).toBeDisabled();
    expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
    expect(screen.queryByDisplayValue('784-1970-7905987-5')).not.toBeInTheDocument();
  });
  it('keeps demo fields unsaveable even when a user tries confirmation', () => {
    render(<HenryEmiratesIdScannerView />);
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByText(/Demo only — saving and autofill disabled/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Confirm & Save to KYC Vault/i })).toBeDisabled();
  });
});
