import { beforeEach, describe, expect, it, vi } from 'vitest';
import { canUseScan, saveReviewedScan, validScanDate } from './henryScanReview';
import eid from './HenryEmiratesIdScannerService';
import deed from './HenryTitleDeedScannerService';
import passport from './HenryPassportScannerService';
import contract from './HenryTenancyContractScannerService';

vi.mock('../utils/authFetch', () => ({ authFetch: vi.fn() }));
import { authFetch } from '../utils/authFetch';

describe('Henry reviewed extraction safety', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    eid.clearCachedEmiratesId();
    deed.clearCachedTitleDeed();
  });
  it('requires explicit review and rejects demos and missing fields', () => {
    expect(canUseScan({})).toBe(false);
    expect(canUseScan({ reviewConfirmed: true, demoOnly: true })).toBe(false);
    expect(canUseScan({ reviewConfirmed: true, missingFields: ['name'] })).toBe(false);
    expect(canUseScan({ reviewConfirmed: true, missingFields: [] })).toBe(true);
    expect(validScanDate('31/02/2027')).toBe(false);
  });
  it('leaves legacy persisted scan assets untouched and never reads unsafe defaults', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem');
    const set = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    eid.clearCachedEmiratesId(); deed.clearCachedTitleDeed();
    passport.clearCachedPassport(); contract.clearCachedContract();
    expect(eid.getCachedEmiratesId()).toBeNull();
    expect(deed.getCachedTitleDeed()).toBeNull();
    expect(passport.getCachedPassport()).toBeNull();
    expect(contract.getCachedContract()).toBeNull();
    eid.setCachedEmiratesId({ ...eid.getDemoExtractedData(), demoOnly: false, reviewConfirmed: true });
    deed.setCachedTitleDeed({ ...deed.getDemoExtractedData(), demoOnly: false, reviewConfirmed: true });
    passport.setCachedPassport(passport.getDemoExtractedData());
    const sample = contract.getDemoExtractedData();
    contract.setCachedContract(sample);
    contract.teachFromScannedContract(sample);
    contract.getTrainingReferenceContracts();
    expect(get).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
  it('cannot derive an identity from a filename or empty OCR', async () => {
    expect(eid.parseOcrText('', 'Arslan_784199318057330.png').idNumber).toBe('');
    expect(eid.parseOcrText('', '').nationalityEn).toBe('');
    vi.spyOn(eid, 'extractDocumentText').mockResolvedValue({ ocrText: '', streamText: '' });
    await expect(
      eid.scanEmiratesId(new File(['bytes'], 'Arslan.png', { type: 'image/png' }))
    ).rejects.toThrow('No readable text');
    expect(eid.getCachedEmiratesId()).toBeNull();
  });
  it('extracts labelled candidates without auto-publishing or fabricated fields', async () => {
    vi.spyOn(eid, 'extractDocumentText').mockResolvedValue({
      ocrText: 'ID Number: 784-1990-1234567-1\nName: TEST PERSON\nExpiry Date: 20/12/2030',
      streamText: '',
    });
    const result = await eid.scanEmiratesId(
      new File(['bytes'], 'unknown.png', { type: 'image/png' })
    );
    expect(result.fullNameEn).toBe('TEST PERSON');
    expect(result.cardNumber).toBe('');
    expect(result.confidenceScore).toBe(0);
    expect(result.reviewConfirmed).toBe(false);
    expect(result.missingFields).toEqual([]);
    expect(eid.getCachedEmiratesId()).toBeNull();
  });
  it('rejects invalid MRZ rather than fabricating fallback identity', () => {
    expect(eid.parseTD1Mrz('INVALID', 'INVALID', 'INVALID')).toEqual({});
  });
  it('extracts deed values from content, not named sample files', async () => {
    vi.spyOn(eid, 'extractDocumentText').mockResolvedValue({
      ocrText:
        'Certificate Number: 123/2026\nOwner Name: TEST OWNER\nPlot Number: 42\nTotal Area: 100',
      streamText: '',
    });
    const result = await deed.scanTitleDeed(
      new File(['bytes'], 'viridis_504.pdf', { type: 'application/pdf' })
    );
    expect(result.certificateNumber).toBe('123/2026');
    expect(result.ownerNameEn).toBe('TEST OWNER');
    expect(result.propertyNumber).toBe('');
    expect(result.isBlockchainVerified).toBe(false);
    expect(result.purchasePriceAed).toBe(0);
    expect(deed.getCachedTitleDeed()).toBeNull();
  });
  it('demo helpers cannot save or autofill', async () => {
    const demo = eid.getDemoExtractedData();
    expect(demo.demoOnly).toBe(true);
    expect((await eid.saveToDatabase(demo)).success).toBe(false);
    expect(() => eid.toContractParty(demo)).toThrow('Confirm review');
    expect((await deed.saveToDatabase(deed.getDemoExtractedData())).success).toBe(false);
    expect(authFetch).not.toHaveBeenCalled();
  });
  it('save failures never report local or fallback success', async () => {
    vi.mocked(authFetch).mockRejectedValue(new Error('Offline'));
    expect(await saveReviewedScan('passport', { reviewConfirmed: true }, '123', 'TEST')).toEqual({
      success: false,
      error: 'Vault unavailable. Nothing was saved.',
    });
  });
    it('submits actual originals in multipart data without plaintext storage', async () => {
      vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: 'saved' } })));
      const file = new File(['%PDF-1.7'], 'source.pdf', { type: 'application/pdf' });
      expect((await saveReviewedScan('passport', { reviewConfirmed: true }, '123', 'TEST', { sources: [file], propertyId: 'property' })).success).toBe(true);
      const init = vi.mocked(authFetch).mock.calls.at(-1)?.[1];
      expect(init?.body).toBeInstanceOf(FormData);
      expect((init?.body as FormData).get('source')).toBeInstanceOf(File);
      expect(init?.headers).toBeUndefined();
    });
    it('legacy benchmark callers fail honestly rather than claiming saved/autofilled', async () => {
      expect((await passport.saveToDatabase()).success).toBe(false);
      expect((await contract.saveToDatabase()).success).toBe(false);
      expect(() => passport.toContractParty(passport.getDemoExtractedData())).toThrow('review required');
      expect(() => contract.toCrmTenantProfile(contract.getDemoExtractedData())).toThrow('review');
  });
});
