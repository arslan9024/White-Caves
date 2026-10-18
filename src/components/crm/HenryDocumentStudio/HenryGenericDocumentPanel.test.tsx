import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import HenryGenericDocumentPanel from './HenryGenericDocumentPanel';
import { genericDocumentRegistry, genericDocumentTypes, type GenericDocumentType } from '../../../../server/shared/henryDocumentRegistry';
import extractor from '../../../services/HenryEmiratesIdScannerService';
import { authFetch } from '../../../utils/authFetch';

vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));
const text = (type: GenericDocumentType) => genericDocumentRegistry[type].fields.map(spec => `${spec.label}: ${
  spec.kind === 'date' ? spec.key === 'endDate' || spec.key === 'expiryDate' ? '31/12/2027' : '01/01/2027'
    : spec.kind === 'amount' ? '0' : spec.key === 'documentReference' ? 'SYNTHETIC-42' : 'SYNTHETIC VALUE'
}`).join('\n');
const original = () => new File(['%PDF-1.7 synthetic'], 'do-not-infer-from-filename.pdf', { type: 'application/pdf' });
const upload = (file = original()) => fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [file] } });
const select = (type: GenericDocumentType) => fireEvent.change(screen.getByLabelText('Document category'), { target: { value: type } });
const confirm = () => fireEvent.click(screen.getByLabelText(/I compared every field/));
const save = () => screen.getByRole('button', { name: 'Save reviewed original to encrypted vault' });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = vi.fn(() => 'blob:synthetic-current-original');
    static revokeObjectURL = vi.fn();
  });
  vi.mocked(authFetch).mockImplementation(async url => new Response(JSON.stringify(String(url).includes('link-options')
    ? { success: true, data: [] } : { success: true, data: { id: 'a'.repeat(24) } })));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Henry integrated generic document review', () => {
  it.each(genericDocumentTypes)('requires explicit %s choice and renders exactly its supported fields', async type => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: text(type), streamText: '' });
    render(<HenryGenericDocumentPanel />);
    expect(screen.getByText(/No source loaded/)).toBeInTheDocument();
    upload();
    await screen.findByLabelText('Document category');
    expect(screen.getByLabelText('Document category')).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Save reviewed original to encrypted vault' })).not.toBeInTheDocument();
    select(type);
    for (const spec of genericDocumentRegistry[type].fields) expect(screen.getByLabelText(spec.label)).toBeInTheDocument();
    expect(save()).toBeDisabled();
    expect(screen.getByRole('link', { name: /Open immutable original/ })).toHaveAttribute('href', 'blob:synthetic-current-original');
    confirm();
    expect(save()).toBeEnabled();
    fireEvent.change(screen.getByLabelText(genericDocumentRegistry[type].fields[0].label), { target: { value: 'CORRECTED-42' } });
    expect(save()).toBeDisabled();
    expect(screen.getByLabelText(/I compared every field/)).not.toBeChecked();
    expect(screen.getByText(/No government, signature, payment/)).toBeInTheDocument();
  });
  it('shows ambiguous marker ranking but never automatically selects a type', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: 'Invoice Number: A42\nReceipt Number: B42', streamText: '' });
    render(<HenryGenericDocumentPanel />);
    upload();
    await screen.findByLabelText('Document category');
    expect(screen.getByText(/Text-marker candidates: Invoice \(1\), Receipt \(1\)/)).toBeInTheDocument();
    expect(screen.getByLabelText('Document category')).toHaveValue('');
    select('invoice');
    expect(screen.getByLabelText('Invoice Number')).toHaveValue('A42');
    expect(save()).toBeDisabled();
  });
  it('archives current reviewed original, resets review after save and revokes confirmation on type/new invalid file', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: text('receipt'), streamText: '' });
    render(<HenryGenericDocumentPanel />);
    const file = original();
    upload(file);
    await screen.findByLabelText('Document category'); select('receipt'); confirm(); fireEvent.click(save());
    await screen.findByText(/Reviewed document and immutable original saved/);
    expect(save()).toBeDisabled();
    const call = vi.mocked(authFetch).mock.calls.find(([url]) => String(url).endsWith('/documents/save'))!;
    const form = call[1]!.body as FormData;
    expect(form.get('source')).toBe(file);
    expect(JSON.parse(String(form.get('metadata')))).toMatchObject({
      docType: 'receipt', referenceNumber: 'SYNTHETIC-42',
      extractedJson: { documentType: 'receipt', demoOnly: false, reviewConfirmed: true, values: { totalAmountAed: 0 } },
    });
    confirm(); select('invoice');
    expect(screen.getByLabelText(/I compared every field/)).not.toBeChecked();
    upload(new File(['bad'], 'invalid.txt', { type: 'text/plain' }));
    expect(screen.queryByLabelText('Document category')).not.toBeInTheDocument();
    expect(screen.queryByText(/Reviewed document and immutable original saved/)).not.toBeInTheDocument();
    expect(screen.getByText(/under 4 MB/)).toBeInTheDocument();
  });
  it('clears previous fields and review after OCR failure instead of using cached data', async () => {
    const extraction = vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: text('cheque'), streamText: '' });
    render(<HenryGenericDocumentPanel />);
    upload(); await screen.findByLabelText('Document category'); select('cheque'); confirm();
    extraction.mockRejectedValueOnce(new Error('Unreadable'));
    upload();
    await screen.findByText(/Source extraction failed/);
    expect(screen.queryByLabelText('Cheque Number')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save reviewed original to encrypted vault' })).not.toBeInTheDocument();
    expect(screen.getByText(/No source loaded/)).toBeInTheDocument();
  });
  it.each(['category', 'upload'])('does not silently save previously confirmed dossier links after a new %s', async change => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({
      ocrText: `${text('invoice')}\n${text('receipt')}`, streamText: '',
    });
    const entity = 'b'.repeat(24);
    vi.mocked(authFetch).mockImplementation(async url => new Response(JSON.stringify(String(url).includes('link-options')
      ? { success: true, data: [{ id: entity, name: 'Synthetic dossier' }] }
      : { success: true, data: { id: 'a'.repeat(24) } })));
    render(<HenryGenericDocumentPanel />);
    upload(); await screen.findByLabelText('Document category'); select('invoice');
    for (const [kind, button] of [
      ['lead', 'leads'], ['property', 'properties'], ['tenancy', 'tenancy records'], ['transaction', 'transaction records'],
    ]) {
      fireEvent.click(screen.getByRole('button', { name: `Load authorized ${button}` }));
      const selector = screen.getByLabelText(`Select authorized ${kind}`);
      await waitFor(() => expect(selector).toHaveTextContent('Synthetic dossier'));
      fireEvent.change(selector, { target: { value: entity } });
    }
    fireEvent.click(screen.getByLabelText(/Confirm selected dossier links/));
    expect(screen.getByLabelText(/Confirm selected dossier links/)).toBeChecked();
    confirm(); fireEvent.click(save());
    await screen.findByText(/Reviewed document and immutable original saved/);
    const saveCalls = () => vi.mocked(authFetch).mock.calls.filter(([url]) => String(url).endsWith('/documents/save'));
    const metadata = (index: number) => JSON.parse(String((saveCalls()[index][1]!.body as FormData).get('metadata')));
    expect(metadata(0)).toMatchObject({ leadId: entity, propertyId: entity, tenancyId: entity, transactionId: entity });
    confirm();
    if (change === 'category') select('receipt');
    else {
      upload(); await screen.findByLabelText('Document category'); select('receipt');
    }
    expect(screen.getByLabelText(/I compared every field/)).not.toBeChecked();
    expect(screen.getByLabelText(/Confirm selected dossier links/)).not.toBeChecked();
    for (const kind of ['lead', 'property', 'tenancy', 'transaction'])
      expect(screen.getByLabelText(`Select authorized ${kind}`)).toHaveValue('');
    confirm(); fireEvent.click(save());
    await waitFor(() => expect(saveCalls()).toHaveLength(2));
    for (const key of ['leadId', 'propertyId', 'tenancyId', 'transactionId'])
      expect(metadata(1)).not.toHaveProperty(key);
    expect(metadata(1).docType).toBe('receipt');
    await screen.findByText(/Reviewed document and immutable original saved/);
  });
  it('discards stale extraction and save responses after reset', async () => {
    let resolveExtraction!: (value: { ocrText: string; streamText: string }) => void;
    vi.spyOn(extractor, 'extractDocumentText').mockImplementationOnce(() =>
      new Promise(resolve => { resolveExtraction = resolve; }));
    render(<HenryGenericDocumentPanel />);
    upload();
    fireEvent.click(screen.getByRole('button', { name: /Discard/ }));
    await act(async () => resolveExtraction({ ocrText: text('invoice'), streamText: '' }));
    expect(screen.queryByLabelText('Document category')).not.toBeInTheDocument();
    vi.mocked(extractor.extractDocumentText).mockResolvedValue({ ocrText: text('invoice'), streamText: '' });
    upload(); await screen.findByLabelText('Document category'); select('invoice'); confirm();
    let resolveSave!: (value: Response) => void;
    vi.mocked(authFetch).mockImplementation(async url => {
      if (String(url).endsWith('/documents/save')) return new Promise(resolve => { resolveSave = resolve; });
      return new Response(JSON.stringify({ success: true, data: [] }));
    });
    fireEvent.click(save());
    await waitFor(() => expect(resolveSave).toBeTypeOf('function'));
    fireEvent.click(screen.getByRole('button', { name: /Discard/ }));
    await act(async () => resolveSave(new Response(JSON.stringify({ success: true, data: { id: 'b'.repeat(24) } }))));
    expect(screen.queryByText(/Reviewed document and immutable original saved/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Document category')).not.toBeInTheDocument();
  });
  it('revokes review after a failed save, leaving an explicit retry error', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: text('invoice'), streamText: '' });
    vi.mocked(authFetch).mockImplementation(async url => new Response(JSON.stringify({ success: true, data: [] }),
      { status: String(url).endsWith('/documents/save') ? 503 : 200 }));
    render(<HenryGenericDocumentPanel />);
    upload(); await screen.findByLabelText('Document category'); select('invoice'); confirm(); fireEvent.click(save());
    await screen.findByText(/Nothing confirmed saved/);
    expect(save()).toBeDisabled();
    expect(screen.getByLabelText(/I compared every field/)).not.toBeChecked();
  });
  it('blocks missing fields and conflicts until manually corrected and reviewed', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({
      ocrText: `${text('invoice')}\nInvoice Number: OTHER-42`, streamText: '',
    });
    render(<HenryGenericDocumentPanel />);
    upload(); await screen.findByLabelText('Document category'); select('invoice'); confirm();
    expect(save()).toBeDisabled();
    expect(screen.getByText(/Conflicting source values/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Invoice Number'), { target: { value: 'OTHER-42' } });
    confirm(); expect(save()).toBeEnabled();
    fireEvent.change(screen.getByLabelText('Issue Date'), { target: { value: '31/02/2027' } });
    confirm(); expect(save()).toBeDisabled();
  });
});
