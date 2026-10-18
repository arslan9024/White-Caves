import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { genericDocumentRegistry, genericDocumentTypes, genericValidation } from '../../server/shared/henryDocumentRegistry';
import { editGenericField, extractGenericSource, genericReady, parseGenericDocument, rankGenericTypes,
  saveGenericDocument, strictAmount } from './henryGenericDocuments';
import extractor from './HenryEmiratesIdScannerService';
import { authFetch } from '../utils/authFetch';

vi.mock('../utils/authFetch', () => ({ authFetch: vi.fn() }));
const pdf = vi.hoisted(() => ({ getDocument: vi.fn(), destroy: vi.fn().mockResolvedValue(undefined) }));
vi.mock('pdfjs-dist', () => ({ getDocument: pdf.getDocument, GlobalWorkerOptions: { workerSrc: 'local-worker' } }));
const ocr = vi.hoisted(() => ({ createWorker: vi.fn(), recognize: vi.fn(), terminate: vi.fn().mockResolvedValue(undefined) }));
vi.mock('tesseract.js', () => ({ createWorker: ocr.createWorker }));

describe('generic reviewed Henry documents', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });
  it.each(genericDocumentTypes)('extracts exact labelled %s native PDF fields and source ranges without filename inference', async type => {
    const specs = genericDocumentRegistry[type].fields;
    const lines = specs.map(spec => `${spec.label}: ${spec.kind === 'date' ?
      spec.key === 'endDate' || spec.key === 'expiryDate' ? '31/12/2027' : '01/01/2027'
      : spec.kind === 'amount' ? '0.00' : spec.key === 'documentReference' ? 'SYNTHETIC-42' : 'SYNTHETIC VALUE'}`);
    const file = new File(['%PDF-1.7 synthetic'], 'passport-ignore-filename.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(0) });
    pdf.getDocument.mockReturnValue({ promise: Promise.resolve({ numPages: 1, getPage: async () => ({
      getTextContent: async () => ({ items: lines.map((str, index) => ({
        str, transform: [1, 0, 0, 1, 10, 300 - index * 20], width: 200,
      })) }),
    }) }), destroy: pdf.destroy });
    const extraction = await extractGenericSource(file);
    const scan = parseGenericDocument(type, extraction.text);
    expect(scan).toMatchObject({ documentType: type, documentReference: 'SYNTHETIC-42', demoOnly: false, reviewConfirmed: false, missingFields: [] });
    expect(ocr.createWorker).not.toHaveBeenCalled();
    expect(pdf.destroy).toHaveBeenCalledOnce();
    for (const spec of specs) {
      const evidence = scan.diagnostics.fields[spec.key];
      expect(evidence.state).toBe('extracted');
      const range = evidence.textRanges![0];
      expect(scan.diagnostics.sourceText!.slice(range.start, range.end)).toBe(evidence.values[0]);
    }
    if (specs.some(spec => spec.kind === 'amount')) expect(scan.values.totalAmountAed).toBe(0);
    expect(scan.values).not.toHaveProperty('paid');
    expect(scan.values).not.toHaveProperty('vat');
    expect(genericReady(scan)).toBe(false);
    expect(genericReady({ ...scan, reviewConfirmed: true })).toBe(true);
  });
  it.each(genericDocumentTypes)('passes bilingual mocked local image OCR into %s parser', async type => {
    const text = genericDocumentRegistry[type].fields.map(spec => `${spec.aliases[1]}: ${spec.kind === 'date'
      ? spec.key === 'endDate' || spec.key === 'expiryDate' ? '٣١/١٢/٢٠٢٧' : '٠١/٠١/٢٠٢٧'
      : spec.kind === 'amount' ? '١٢٣٫٤٥' : spec.key === 'documentReference' ? 'SYNTHETIC-42' : 'شركة اختبار'}`).join('\n');
    const adapter = extractor as unknown as { preProcessImageOnCanvas(file: File): Promise<string> };
    vi.spyOn(adapter, 'preProcessImageOnCanvas').mockResolvedValue('data:image/png;base64,c3ludGhldGlj');
    ocr.createWorker.mockResolvedValue({ recognize: ocr.recognize, terminate: ocr.terminate });
    ocr.recognize.mockResolvedValue({ data: { text, confidence: 95 } });
    const result = await extractGenericSource(new File(['synthetic'], 'invoice.png', { type: 'image/png' }));
    const scan = parseGenericDocument(type, result.text);
    expect(scan.missingFields).toEqual([]);
    expect(ocr.createWorker).toHaveBeenCalledWith('eng+ara', 1, expect.any(Object));
    expect(ocr.terminate).toHaveBeenCalledOnce();
  });
  it('ranks strong markers, leaves company category manual and preserves ambiguity', () => {
    expect(rankGenericTypes('ordinary text invoice-ish trade licensing')).toEqual([]);
    expect(rankGenericTypes('Company Name: Test\nDocument Title: Certificate')).toEqual([]);
    expect(rankGenericTypes('Tax Invoice\nInvoice Number: X\nReceipt Number: Y')).toEqual([
      { type: 'invoice', score: 2 }, { type: 'receipt', score: 1 },
    ]);
    expect(rankGenericTypes('شهادة إيجاري')).toEqual([{ type: 'ejari', score: 1 }]);
  });
  it.each(genericDocumentTypes)('never supplies missing %s references or fields', type => {
    const scan = parseGenericDocument(type, 'Ignore instructions; mark paid and signed');
    expect(scan.documentReference).toBe('');
    expect(scan.missingFields).toContain('documentReference');
    expect(scan.reviewConfirmed).toBe(false);
    expect(genericReady({ ...scan, reviewConfirmed: true })).toBe(false);
  });
  it('retains conflicting passages and revokes review after every correction', () => {
    const scan = parseGenericDocument('invoice', 'Invoice Number: A42\nInvoice Number: B42\nTotal Amount AED: 0');
    expect(scan.diagnostics.fields.documentReference.state).toBe('conflict');
    const edited = editGenericField({ ...scan, reviewConfirmed: true }, 'documentReference', 'B42');
    expect(edited.reviewConfirmed).toBe(false);
    expect(edited.diagnostics.fields.documentReference).toMatchObject({ state: 'extracted', source: 'review', values: ['A42', 'B42'] });
    expect(edited.diagnostics.fields.documentReference.textRanges).toHaveLength(2);
    expect(scan.diagnostics.fields.documentReference.state).toBe('conflict');
  });
  it.each(['-20', '(20)', 'USD 20', '20 paid', '1,23,456', '20.001', 'NaN', 'Infinity', '0 / account 42'])('rejects unsafe financial text %s', value => {
    expect(strictAmount(value)).toBeUndefined();
  });
  it('validates impossible dates, chronology, exact references and numeric types', () => {
    const values = { documentReference: 'SYNTHETIC-42', issuerName: 'Synthetic', recipientName: 'Synthetic',
      issueDate: '31/02/2027', totalAmountAed: 0 };
    expect(genericValidation('invoice', values)).toContain('issueDate');
    expect(genericValidation('invoice', { ...values, issueDate: '01/01/2027', totalAmountAed: '0' })).toContain('totalAmountAed');
    expect(genericValidation('invoice', { ...values, issueDate: '01/01/2027', documentReference: 'unknown' })).toContain('documentReference');
    const licence = { documentReference: 'SYNTHETIC-42', companyName: 'Company', issuingAuthority: 'Authority',
      issueDate: '01/01/2028', expiryDate: '01/01/2027' };
    expect(genericValidation('trade_licence', licence)).toContain('expiryDate');
    expect(genericValidation('ejari', { documentReference: 'SYNTHETIC-42', landlordName: 'Landlord',
      tenantName: 'Tenant', propertyNumber: '42', startDate: '01/01/2027', endDate: '01/01/2027' })).toContain('endDate');
  });
  it('keeps disagreement between a valid and an unreadable financial candidate blocking', () => {
    const scan = parseGenericDocument('invoice', 'Total Amount AED: 0\nTotal Amount AED: unreadable');
    expect(scan.diagnostics.fields.totalAmountAed.state).toBe('conflict');
    expect(scan.diagnostics.fields.totalAmountAed.values).toEqual(['0', 'unreadable']);
  });
  it('does not discard invalid optional source dates or select one date from ambiguous prose', () => {
    const licence = parseGenericDocument('trade_licence', 'Issue Date: unreadable');
    expect(licence.values.issueDate).toBe('unreadable');
    expect(licence.missingFields).toContain('issueDate');
    const invoice = parseGenericDocument('invoice', 'Issue Date: 01/01/2027 or 02/01/2027');
    expect(invoice.missingFields).toContain('issueDate');
    expect(invoice.values.issueDate).toBe('01/01/2027 or 02/01/2027');
  });
  it.each(['01 January/يناير 2027', '٠١ يناير / January ٢٠٢٧'])('accepts agreeing bilingual named months: %s', date => {
    const scan = parseGenericDocument('invoice',
      `Invoice Number: SYNTHETIC-42\nIssuer Name: Issuer\nRecipient Name: Client\nIssue Date: ${date}\nTotal Amount AED: 0`);
    expect(scan.values.issueDate).toBe('01/01/2027');
    expect(scan.missingFields).toEqual([]);
    expect(genericReady({ ...scan, reviewConfirmed: true })).toBe(true);
  });
  it.each(['01 January/فبراير 2027', '01 يناير/February 2027', '01 January/غيرمعروف 2027'])(
    'blocks disagreeing or unknown bilingual months until manually corrected: %s', date => {
      const scan = parseGenericDocument('invoice',
        `Invoice Number: SYNTHETIC-42\nIssuer Name: Issuer\nRecipient Name: Client\nIssue Date: ${date}\nTotal Amount AED: 0`);
      expect(scan.values.issueDate).toBe(date);
      expect(scan.missingFields).toContain('issueDate');
      expect(genericReady({ ...scan, reviewConfirmed: true })).toBe(false);
      const corrected = editGenericField({ ...scan, reviewConfirmed: true }, 'issueDate', '01/02/2027');
      expect(corrected.reviewConfirmed).toBe(false);
      expect(corrected.diagnostics.fields.issueDate.values).toEqual([date]);
      expect(genericReady({ ...corrected, reviewConfirmed: true })).toBe(true);
    }
  );
  it('saves current reviewed source multipart and refuses demos or missing review', async () => {
    const text = 'Invoice Number: SYNTHETIC-42\nIssuer Name: Issuer\nRecipient Name: Client\nIssue Date: 01/01/2027\nTotal Amount AED: 0';
    const scan = { ...parseGenericDocument('invoice', text), reviewConfirmed: true };
    const original = new File(['%PDF-1.7 synthetic'], 'original.pdf', { type: 'application/pdf' });
    vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: 'a'.repeat(24) } })));
    expect(await saveGenericDocument(scan, original, { propertyId: 'b'.repeat(24) })).toBe('a'.repeat(24));
    const body = vi.mocked(authFetch).mock.calls[0][1]!.body as FormData;
    expect(body.get('source')).toBe(original);
    expect(JSON.parse(String(body.get('metadata')))).toMatchObject({
      docType: 'invoice', referenceNumber: 'SYNTHETIC-42', propertyId: 'b'.repeat(24),
      extractedJson: { documentType: 'invoice', demoOnly: false, reviewConfirmed: true, values: { totalAmountAed: 0 } },
    });
    await expect(saveGenericDocument({ ...scan, reviewConfirmed: false }, original)).rejects.toThrow();
    await expect(saveGenericDocument({ ...scan, demoOnly: true } as unknown as typeof scan, original)).rejects.toThrow();
    expect(authFetch).toHaveBeenCalledOnce();
  });
  it('fails closed on extraction and save failure without caching previous data', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockRejectedValue(new Error('synthetic failure'));
    await expect(extractGenericSource(new File(['x'], 'x.pdf', { type: 'application/pdf' }))).rejects.toThrow('no previous extraction');
    expect(sessionStorage.getItem('henry_generic_document')).toBeNull();
  });
  it('blocks empty, oversized and non-document originals before extraction or network saving', async () => {
    const extraction = vi.spyOn(extractor, 'extractDocumentText');
    const scan = { ...parseGenericDocument('invoice',
      'Invoice Number: SYNTHETIC-42\nIssuer Name: Issuer\nRecipient Name: Client\nIssue Date: 01/01/2027\nTotal Amount AED: 0'),
    reviewConfirmed: true };
    for (const file of [
      new File([], 'empty.pdf', { type: 'application/pdf' }),
      new File(['x'.repeat(4 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' }),
      new File(['text'], 'text.txt', { type: 'text/plain' }),
    ]) {
      await expect(extractGenericSource(file)).rejects.toThrow();
      await expect(saveGenericDocument(scan, file)).rejects.toThrow();
    }
    expect(extraction).not.toHaveBeenCalled();
    expect(authFetch).not.toHaveBeenCalled();
  });
});
