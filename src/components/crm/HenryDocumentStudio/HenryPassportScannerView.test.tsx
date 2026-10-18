import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import HenryPassportScannerView from './HenryPassportScannerView';
import scanner from '../../../services/HenryPassportScannerService';
import extractor from '../../../services/HenryEmiratesIdScannerService';
import { authFetch } from '../../../utils/authFetch';
import template from '../../../services/HenryTenancyContractTemplateService';

vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));
const sourceText = 'Full Name: TEST TRAVELER\nPassport Number: T12345678\nCountry Code: UTO\nDate of Birth: 02/03/1990\nExpiry Date: 04/05/2035';
const file = () => new File(['%PDF-1.7 synthetic'], 'source.pdf', { type: 'application/pdf' });
beforeEach(() => {
  scanner.clearCachedPassport();
  template.resetDraft();
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = vi.fn(() => 'blob:synthetic');
    static revokeObjectURL = vi.fn();
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); scanner.clearCachedPassport(); });

describe('HenryPassportScannerView', () => {
  it('processes an explicitly selected Drive original through the existing scanner and preserves provenance only for that exact File', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: sourceText, streamText: '' });
    vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: 'a'.repeat(24) } })));
    const original = file();
    render(<HenryPassportScannerView importedSource={{ file: original, sourceId: 'a'.repeat(24), driveOrigin: { proof: 'synthetic-drive-proof' } }} />);
    await screen.findByDisplayValue('TEST TRAVELER');
    const save = screen.getByRole('button', { name: /Save to KYC Vault/ });
    expect(save).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/I reviewed all extracted values/));
    fireEvent.click(save);
    await screen.findByText(/Reviewed passport and original saved/);
    const form = vi.mocked(authFetch).mock.calls.at(-1)![1]!.body as FormData;
    expect(form.get('source')).toBe(original);
    expect(JSON.parse(String(form.get('metadata'))).driveOrigin).toEqual({ proof: 'synthetic-drive-proof' });
  });
  it('renders international passport live OCR extraction studio', () => {
    render(<HenryPassportScannerView />);

    expect(screen.getByText(/3.19.4 Scan International Passport/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload client passport bio-data/i)).toBeInTheDocument();
  });

  it('reviews genuine file readings, revokes review on correction, autofills, and saves original multipart', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: sourceText, streamText: '' });
    vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: '123456789012345678901234' } })));
    render(<HenryPassportScannerView />);
    const original = file();
    fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
    await screen.findByDisplayValue('TEST TRAVELER');
    const save = screen.getByRole('button', { name: /Save to KYC Vault/ });
    const autofill = screen.getByRole('button', { name: /Auto-Fill Tenancy \(as Tenant\)/ });
    expect(save).toBeDisabled();
    expect(scanner.getCachedPassport()).toBeNull();
    fireEvent.click(screen.getByLabelText(/I reviewed all extracted values/));
    expect(save).toBeEnabled();
    fireEvent.change(screen.getByDisplayValue('TEST TRAVELER'), { target: { value: 'CORRECTED TRAVELER' } });
    expect(save).toBeDisabled();
    expect(scanner.getCachedPassport()).toBeNull();
    fireEvent.click(screen.getByLabelText(/I reviewed all extracted values/));
    fireEvent.click(autofill);
    expect(template.loadActiveDraft().tenantName).toBe('CORRECTED TRAVELER');
    expect(template.loadActiveDraft().tenantEmiratesId).toBe('Passport: T12345678 (UTO)');
    fireEvent.click(screen.getByRole('button', { name: /Auto-Fill Tenancy \(as Landlord\)/ }));
    expect(template.loadActiveDraft()).toMatchObject({
      ownerName: 'CORRECTED TRAVELER', lessorName: 'CORRECTED TRAVELER',
      lessorEmiratesId: 'Passport: T12345678 (UTO)', tenantEmiratesId: 'Passport: T12345678 (UTO)',
    });
    fireEvent.click(save);
    await screen.findByText(/Reviewed passport and original saved to encrypted vault/);
    const options = vi.mocked(authFetch).mock.calls.at(-1)![1]!;
    expect(options.body).toBeInstanceOf(FormData);
    const body = options.body as FormData;
    expect(body.get('source')).toBe(original);
    expect(JSON.parse(String(body.get('metadata')))).toMatchObject({
      docType: 'passport', extractedJson: { fullName: 'CORRECTED TRAVELER', reviewConfirmed: true, demoOnly: false },
    });
  });

  it('discard invalidates a delayed scan and never republishes its result', async () => {
    let resolve!: (value: { ocrText: string; streamText: string }) => void;
    const read = vi.spyOn(extractor, 'extractDocumentText').mockReturnValue(new Promise(done => { resolve = done; }));
    render(<HenryPassportScannerView />);
    fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [file()] } });
    await waitFor(() => expect(read).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: /Discard & Clear/ }));
    await act(async () => resolve({ ocrText: sourceText, streamText: '' }));
    expect(screen.queryByDisplayValue('TEST TRAVELER')).not.toBeInTheDocument();
    expect(scanner.getCachedPassport()).toBeNull();
  });
});
