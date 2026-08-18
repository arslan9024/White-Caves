/**
 * HenryDocumentStudioComponents.test.tsx
 *
 * Unit tests for Henry 3.19.1 through 3.19.5 Main Content Area Viewports
 * and Reusable Shared Document Uploader.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';
import HenryTenancyContractJourneyView from './HenryTenancyContractJourneyView';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import HenryTitleDeedScannerView from './HenryTitleDeedScannerView';
import HenryPassportScannerView from './HenryPassportScannerView';
import HenryTenancyContractScannerView from './HenryTenancyContractScannerView';
import henryTenancyContractTemplateService from '../../../services/HenryTenancyContractTemplateService';

describe('Henry Document Studio — Shared Uploader & 5 Content Area Views', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    henryTenancyContractTemplateService.resetDraft();
  });

  it('HenrySharedDocumentUploader renders title, dropzone, and calls onSampleLoad', () => {
    const mockSampleLoad = vi.fn();
    const mockUpload = vi.fn();

    render(
      <HenrySharedDocumentUploader
        title="Upload Emirates ID"
        subtitle="Extracts bio data"
        onFileUpload={mockUpload}
        onSampleLoad={mockSampleLoad}
        onSave={vi.fn()}
        onDiscard={vi.fn()}
      />
    );

    expect(screen.getByText('Upload Emirates ID')).toBeDefined();
    expect(screen.getByText('Extracts bio data')).toBeDefined();
    expect(screen.getByText(/Load Demo Benchmark/i)).toBeDefined();

    fireEvent.click(screen.getByText(/Load Demo Benchmark/i));
    expect(mockSampleLoad).toHaveBeenCalledTimes(1);
  });

  it('3.19.1 HenryTenancyContractJourneyView renders 4-stage stepper and navigates between stages', () => {
    render(<HenryTenancyContractJourneyView />);

    expect(screen.getByText(/1. Title Deed & Landlord KYC/i)).toBeDefined();
    expect(screen.getByText(/2. Tenant KYC & Documents/i)).toBeDefined();
    expect(screen.getByText(/3. Contract Terms & Financials/i)).toBeDefined();
    expect(screen.getByText(/4. Signatures & Final Actions/i)).toBeDefined();

    // Navigate to Stage 2
    fireEvent.click(screen.getByText(/2. Tenant KYC & Documents/i));
    expect(screen.getByText(/Tenant Contact & Legal Identity/i)).toBeDefined();

    // Navigate to Stage 3
    fireEvent.click(screen.getByText(/3. Contract Terms & Financials/i));
    expect(screen.getByText(/Stage 3: Lease Financials & Contract Period/i)).toBeDefined();

    // Navigate to Stage 4
    fireEvent.click(screen.getByText(/4. Signatures & Final Actions/i));
    expect(screen.getByText(/Stage 4: Endorsement Signatures & Vault Persistence/i)).toBeDefined();
  });

  it('3.19.2 HenryEmiratesIdScannerView loads sample and renders digital Emirates ID card and form', () => {
    render(<HenryEmiratesIdScannerView />);

    expect(screen.getByText(/3.19.2 Scan Emirates ID/i)).toBeDefined();
    expect(screen.getByText(/No Document Uploaded Yet/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByText(/Extracted Variables Form/i)).toBeDefined();
    expect(screen.getByText(/UNITED ARAB EMIRATES · IDENTITY CARD/i)).toBeDefined();
    expect(screen.getByDisplayValue('784-1993-1805733-0')).toBeDefined();
    expect(screen.getByDisplayValue('Arslan Malik Bashir Ahmad')).toBeDefined();

    // Test Ibrahim Siraj Indian client benchmark
    fireEvent.click(screen.getByText(/Ibrahim Siraj/i));
    expect(screen.getByDisplayValue('784-1970-7905987-5')).toBeDefined();
    expect(screen.getByDisplayValue('Ibrahim Siraj Sulthan Mohamed Kasim Sultan Mohammed')).toBeDefined();
    expect(screen.getByDisplayValue('India')).toBeDefined();
    expect(screen.getByDisplayValue('Accountant General')).toBeDefined();
    expect(screen.getByDisplayValue('Auto Vision Trading Fzco - Daz')).toBeDefined();

    // Test Extract button
    fireEvent.click(screen.getByText(/Extract Information From Uploaded ID to Form/i));
    expect(screen.getByDisplayValue('784-1970-7905987-5')).toBeDefined();
  });

  it('3.19.3 HenryTitleDeedScannerView loads sample and renders DLD ownership specifications and form', () => {
    render(<HenryTitleDeedScannerView />);

    expect(screen.getByText(/3.19.3 Scan Title Deed/i)).toBeDefined();
    expect(screen.getByText(/No Title Deed Uploaded Yet/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByText(/Extracted Title Deed Variables Form/i)).toBeDefined();
    expect(screen.getByDisplayValue('VIRIDIS A')).toBeDefined();
    expect(screen.getByDisplayValue('AKRAM DIB NEHME')).toBeDefined();
  });

  it('3.19.4 HenryPassportScannerView loads sample and renders passport bio card, MRZ and form', () => {
    render(<HenryPassportScannerView />);

    expect(screen.getByText(/3.19.4 Scan International Passport/i)).toBeDefined();
    expect(screen.getByText(/No Passport Uploaded Yet/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByText(/Extracted Passport Variables Form/i)).toBeDefined();
    expect(screen.getByDisplayValue('DR0760143')).toBeDefined();
    expect(screen.getByDisplayValue('Arslan Malik')).toBeDefined();
  });

  it('3.19.5 HenryTenancyContractScannerView loads sample and extracts contract domains and form', () => {
    render(<HenryTenancyContractScannerView />);

    expect(screen.getByText(/3.19.5 Scan & Extract Tenancy Agreement/i)).toBeDefined();
    expect(screen.getByText(/No Contract Uploaded Yet/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/i }));
    expect(screen.getByText(/Extracted Agreement Variables Form/i)).toBeDefined();
    expect(screen.getByText(/1. Property Specifications/i)).toBeDefined();
    expect(screen.getByText(/2. Landlord & Tenant Parties/i)).toBeDefined();
    expect(screen.getByText(/3. Financial Schedules & Dates/i)).toBeDefined();
  });
});
