import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import eid, { EMPTY_EMIRATES_ID } from '../../../services/HenryEmiratesIdScannerService';

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
  it('shows unknown rather than NaN days for an impossible expiry', () => {
    const demo = eid.getDemoExtractedData();
    const mock = vi
      .spyOn(eid, 'getDemoExtractedData')
      .mockReturnValue({ ...demo, expiryDate: '31/02/2027' });
    render(<HenryEmiratesIdScannerView />);
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByText('Unknown expiry')).toBeInTheDocument();
    expect(screen.queryByText(/NaN days to expiry/)).not.toBeInTheDocument();
    mock.mockRestore();
  });
  it('requires fresh expired-ID acknowledgment before review or downstream reuse', () => {
    const mock = vi.spyOn(eid, 'getCachedEmiratesId').mockReturnValue({
      ...EMPTY_EMIRATES_ID,
      idNumber: '784-2001-0000001-1',
      fullNameEn: 'TEST PERSON',
      expiryDate: '01/01/2002',
      missingFields: [],
      demoOnly: false,
      reviewConfirmed: false,
    });
    try {
      render(<HenryEmiratesIdScannerView />);
      const review = screen.getByLabelText('Confirm document review');
      const autofill = screen.getByRole('button', { name: 'Auto-Fill Tenancy (as Tenant)' });
      expect(review).toBeDisabled();
      expect(autofill).toBeDisabled();
      fireEvent.click(screen.getByLabelText('Acknowledge expired ID'));
      expect(review).not.toBeDisabled();
      expect(autofill).toBeDisabled();
      fireEvent.click(review);
      expect(autofill).not.toBeDisabled();
      fireEvent.click(screen.getByLabelText('Acknowledge expired ID'));
      expect(review).not.toBeChecked();
      expect(autofill).toBeDisabled();
    } finally {
      mock.mockRestore();
      eid.clearCachedEmiratesId();
    }
  });
});
