import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { HenryTitleDeedScannerView } from './HenryTitleDeedScannerView';

describe('HenryTitleDeedScannerView', () => {
  it('renders Title Deed scanner studio with DLD property extraction form', () => {
    render(<HenryTitleDeedScannerView />);

    expect(screen.getByText(/3.19.3 Scan Title Deed \/ Oqood/i)).toBeInTheDocument();
    expect(screen.getByText(/Property Presets/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save to Property Vault/i })).toBeDisabled();
  });
  it('never enables saving or downstream autofill for demos', () => {
    render(<HenryTitleDeedScannerView />);
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Save to Property Vault/i })).toBeDisabled();
  });
});
