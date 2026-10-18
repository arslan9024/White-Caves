import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import HenryTenancyContractScannerView from './HenryTenancyContractScannerView';
import scanner from '../../../services/HenryTenancyContractScannerService';
import extractor from '../../../services/HenryEmiratesIdScannerService';
import { authFetch } from '../../../utils/authFetch';
import template from '../../../services/HenryTenancyContractTemplateService';

vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));
const sourceText = `Contract Reference: SOURCE-42
Landlord Name: TEST LESSOR
Tenant Name: TEST OCCUPANT
Building Name: TEST BUILDING
Unit Number: 42
Start Date: 01/01/2027
End Date: 31/12/2027
Annual Rent: 60000
Security Deposit: 3000`;
const file = () => new File(['%PDF-1.7 synthetic'], 'source.pdf', { type: 'application/pdf' });
beforeEach(() => {
  scanner.clearCachedContract();
  template.resetDraft();
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = vi.fn(() => 'blob:synthetic');
    static revokeObjectURL = vi.fn();
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); scanner.clearCachedContract(); });

describe('HenryTenancyContractScannerView', () => {
  it('renders tenancy contract live optical extractor and contract preview', () => {
    render(<HenryTenancyContractScannerView />);

    expect(screen.getByText(/3.19.5 Scan & Extract Tenancy Agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload full Tenancy Agreement PDF/i)).toBeInTheDocument();
  });
    it('saves the corrected nested contract and original source file', async () => {
      vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: sourceText, streamText: '' });
      vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: '123456789012345678901234' } })));
      render(<HenryTenancyContractScannerView />);
      const original = file();
      fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
      await screen.findByDisplayValue('TEST OCCUPANT');
      const save = screen.getByRole('button', { name: /Save to encrypted vault/ });
      expect(save).toBeDisabled();
      fireEvent.click(screen.getByLabelText(/I reviewed all extracted values/));
      expect(save).toBeEnabled();
      fireEvent.change(screen.getByDisplayValue('TEST OCCUPANT'), { target: { value: 'CORRECTED OCCUPANT' } });
      fireEvent.change(screen.getByDisplayValue('60000'), { target: { value: '65000' } });
      expect(save).toBeDisabled();
      expect(scanner.getCachedContract()).toBeNull();
      fireEvent.click(screen.getByLabelText(/I reviewed all extracted values/));
      fireEvent.click(screen.getByRole('button', { name: /Load into 3.19.1 Preparation Studio/ }));
      expect(template.loadActiveDraft()).toMatchObject({ tenantName: 'CORRECTED OCCUPANT', annualRent: 65000 });
      fireEvent.click(save);
      await screen.findByText(/Reviewed agreement and original saved to encrypted vault/);
      const body = vi.mocked(authFetch).mock.calls.at(-1)![1]!.body as FormData;
      expect(body.get('source')).toBe(original);
      expect(JSON.parse(String(body.get('metadata')))).toMatchObject({
        docType: 'tenancy_contract', referenceNumber: 'SOURCE-42',
        extractedJson: { tenant: { name: 'CORRECTED OCCUPANT' }, financials: { annualRentAed: 65000 } },
      });
    });

    it('discard prevents delayed extraction from restoring cleared data', async () => {
      let resolve!: (value: { ocrText: string; streamText: string }) => void;
      const read = vi.spyOn(extractor, 'extractDocumentText').mockReturnValue(new Promise(done => { resolve = done; }));
      render(<HenryTenancyContractScannerView />);
      fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [file()] } });
      await waitFor(() => expect(read).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { name: /Discard & Clear/ }));
      await act(async () => resolve({ ocrText: sourceText, streamText: '' }));
      expect(screen.queryByDisplayValue('TEST OCCUPANT')).not.toBeInTheDocument();
      expect(scanner.getCachedContract()).toBeNull();
    });
});
