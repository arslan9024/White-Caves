/**
 * HenryDocumentStudioComponents.test.tsx
 *
 * Unit tests for Henry 3.19.1 through 3.19.5 Main Content Area Viewports
 * and Reusable Shared Document Uploader.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';
import HenryTenancyContractJourneyView from './HenryTenancyContractJourneyView';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import HenryTitleDeedScannerView from './HenryTitleDeedScannerView';
import HenryPassportScannerView from './HenryPassportScannerView';
import HenryTenancyContractScannerView from './HenryTenancyContractScannerView';
import henryTenancyContractTemplateService from '../../../services/HenryTenancyContractTemplateService';
import eid, { EMPTY_EMIRATES_ID } from '../../../services/HenryEmiratesIdScannerService';
import deed from '../../../services/HenryTitleDeedScannerService';
import passport from '../../../services/HenryPassportScannerService';
import contract from '../../../services/HenryTenancyContractScannerService';
import { canUseScan } from '../../../services/henryScanReview';
import { getButtonByVisibleTextInActionGroup } from '../../../test/getButtonByName';

describe('Henry Document Studio — Shared Uploader & 5 Content Area Views', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    henryTenancyContractTemplateService.resetDraft();
    eid.clearCachedEmiratesId();
    deed.clearCachedTitleDeed();
    passport.clearCachedPassport();
    contract.clearCachedContract();
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
    expect(screen.getByText(/Stage 4: Endorsement Signatures & Session Draft/i)).toBeDefined();
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Keep for this session only/i));
    expect(screen.getByText(/Not saved to the encrypted vault; it will be lost on reload/i)).toBeInTheDocument();
  });

  it('3.19.2 previews both demo sides but forbids confirmation, autofill and archival', () => {
    render(<HenryEmiratesIdScannerView />);

    expect(screen.getByText(/3.19.2 Emirates ID Live Extraction Studio/i)).toBeDefined();
    expect(screen.getByText(/Emirates ID Document Viewer/i)).toBeDefined();
    expect(screen.getByText(/1. Identity & Card Numbers/i)).toBeDefined();

    // Toggle Back Side preview
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Back Side \(MRZ\)/i));
    expect(screen.getByText(/SMART CHIP & ICAO TD1 MRZ SPECIFICATION/i)).toBeDefined();

    // Toggle Front Side preview
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Front Side/i));
    expect(screen.getByText(/UNITED ARAB EMIRATES · RESIDENT IDENTITY CARD/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Load Demo Benchmark/i));
    expect(screen.getByDisplayValue('784-1993-1805733-0')).toBeDefined();
    expect(screen.getByDisplayValue('Arslan Malik Bashir Ahmad')).toBeDefined();

    expect(getButtonByVisibleTextInActionGroup(/Auto-Fill Tenancy \(as Tenant\)/i)).toBeDisabled();
    expect(getButtonByVisibleTextInActionGroup(/Confirm & Save to KYC Vault/i)).toBeDisabled();
    expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
    expect(eid.getCachedEmiratesId()).toBeNull();
  });

  it('3.19.3 HenryTitleDeedScannerView loads sample and renders DLD ownership specifications and form', () => {
    render(<HenryTitleDeedScannerView />);

    expect(screen.getByText(/3.19.3 Scan Title Deed/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Load Demo Benchmark/i));
    expect(screen.getByText(/Extracted Title Deed Variables Form/i)).toBeDefined();
    expect(screen.getByDisplayValue('VIRIDIS A')).toBeDefined();
    expect(screen.getByDisplayValue('AKRAM DIB NEHME')).toBeDefined();

    expect(getButtonByVisibleTextInActionGroup(/Auto-Fill Tenancy Lease/i)).toBeDisabled();
    expect(getButtonByVisibleTextInActionGroup(/Save to Property Vault/i)).toBeDisabled();
    expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
    expect(deed.getCachedTitleDeed()).toBeNull();
  });

  it('3.19.4 previews passport benchmark but rejects autofill and vault persistence', async () => {
    render(<HenryPassportScannerView />);

    expect(screen.getByText(/3.19.4 Scan International Passport/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Load Demo Benchmark/i));
    expect(screen.getByText(/Extracted Passport Variables Form/i)).toBeDefined();
    expect(screen.getByDisplayValue('DR0760143')).toBeDefined();
    expect(screen.getByDisplayValue('Arslan Malik')).toBeDefined();

    // Test 1-click Auto-Fill Tenancy (as Tenant)
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Auto-Fill Tenancy \(as Tenant\)/i));
    expect(getButtonByVisibleTextInActionGroup(/Auto-Fill Tenancy \(as Tenant\)/i)).toBeDisabled();
    expect(screen.getByText(/Demo only — cannot save or autofill/)).toBeInTheDocument();

    // Test Save to KYC Vault
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Save to KYC Vault/i));
    expect(getButtonByVisibleTextInActionGroup(/Save to KYC Vault/i)).toBeDisabled();
    expect(passport.getCachedPassport()).toBeNull();
    expect(canUseScan(passport.getCachedPassport() || {})).toBe(false);
  });

  it('3.19.5 previews contract domains without importing or persisting benchmark fields', async () => {
    render(<HenryTenancyContractScannerView />);

    expect(screen.getByText(/3.19.5 Scan & Extract Tenancy Agreement/i)).toBeDefined();

    // Load benchmark demo
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Load Demo Benchmark/i));
    expect(screen.getByText(/Extracted Agreement Variables Form/i)).toBeDefined();

    // Test 1-click Load into 3.19.1 Preparation Studio
    fireEvent.click(getButtonByVisibleTextInActionGroup(/Load into 3.19.1 Preparation Studio/i));
    expect(getButtonByVisibleTextInActionGroup(/Load into 3.19.1 Preparation Studio/i)).toBeDisabled();
    expect(screen.getByText(/Demo only — cannot save or autofill/)).toBeInTheDocument();
    expect(henryTenancyContractTemplateService.loadActiveDraft().tenantName).toBe('');

    fireEvent.click(getButtonByVisibleTextInActionGroup(/Save to encrypted vault/i));
    expect(getButtonByVisibleTextInActionGroup(/Save to encrypted vault/i)).toBeDisabled();
    expect(contract.getCachedContract()).toBeNull();

    expect(screen.getByText(/1. Property Specifications/i)).toBeDefined();
    expect(screen.getByText(/2. Landlord & Tenant Parties/i)).toBeDefined();
    expect(screen.getByText(/3. Financial Schedules & Dates/i)).toBeDefined();
  });

  it('publishes only freshly reviewed synthetic ID fields and revokes them after editing', async () => {
    const scan = vi.spyOn(eid, 'scanEmiratesId').mockResolvedValue({
      ...EMPTY_EMIRATES_ID, idNumber: '784-2001-0000001-1', fullNameEn: 'SYNTHETIC TENANT',
      expiryDate: '01/01/2099', demoOnly: false, missingFields: [], reviewConfirmed: false,
    });
    const createUrl = URL.createObjectURL;
    const revokeUrl = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn().mockReturnValue('blob:synthetic');
    URL.revokeObjectURL = vi.fn();
    const view = render(<HenryEmiratesIdScannerView />);
    try {
      fireEvent.change(screen.getByLabelText('Approved lead ID'), { target: { value: 'previous-lead' } });
      fireEvent.click(screen.getByLabelText('Confirm these existing CRM links (server checks ownership)'));
      fireEvent.change(screen.getByLabelText('Upload document'), {
        target: { files: [new File(['synthetic'], 'synthetic.png', { type: 'image/png' })] },
      });
      await waitFor(() => expect(screen.getByLabelText('Confirm document review')).not.toBeDisabled());
      expect(screen.getByLabelText('Approved lead ID')).toHaveValue('');
      expect(screen.getByLabelText('Confirm these existing CRM links (server checks ownership)')).not.toBeChecked();
      const autofill = screen.getByRole('button', { name: /Auto-Fill Tenancy \(as Tenant\)/i });
      expect(autofill).toBeDisabled();
      fireEvent.click(screen.getByLabelText('Confirm document review'));
      fireEvent.click(autofill);
      expect(eid.getCachedEmiratesId()).toMatchObject({ fullNameEn: 'SYNTHETIC TENANT', reviewConfirmed: true });
      fireEvent.change(screen.getByDisplayValue('SYNTHETIC TENANT'), { target: { value: 'CORRECTED TENANT' } });
      expect(eid.getCachedEmiratesId()).toBeNull();
      expect(autofill).toBeDisabled();
      fireEvent.click(screen.getByLabelText('Confirm document review'));
      fireEvent.click(autofill);
      expect(eid.getCachedEmiratesId()?.fullNameEn).toBe('CORRECTED TENANT');
    } finally {
      view.unmount();
      scan.mockRestore(); URL.createObjectURL = createUrl; URL.revokeObjectURL = revokeUrl; eid.clearCachedEmiratesId();
    }
  });
});
