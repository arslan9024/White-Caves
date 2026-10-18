import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assessScanReadiness,
  canUseScan,
  hydrateVaultScan,
  saveReviewedScan,
  scanExpiry,
  validScanDate,
} from './henryScanReview';
import eid from './HenryEmiratesIdScannerService';
import deed from './HenryTitleDeedScannerService';
import passport from './HenryPassportScannerService';
import contract from './HenryTenancyContractScannerService';

vi.mock('../utils/authFetch', () => ({ authFetch: vi.fn() }));
import { authFetch } from '../utils/authFetch';
import { EMPTY_EMIRATES_ID } from './HenryEmiratesIdScannerService';

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
  const realId = () => ({
    ...EMPTY_EMIRATES_ID,
    idNumber: '784-2001-0000001-1',
    fullNameEn: 'TEST PERSON',
    expiryDate: '01/01/2030',
    missingFields: [],
    demoOnly: false,
    reviewConfirmed: true,
  });
  const archive = (fields = realId()) => ({
    id: 'a'.repeat(24),
    docType: 'emirates_id',
    extractedJson: fields,
  });

  it('computes readiness from actual fields, not stale missing-field or reviewed flags', () => {
    expect(assessScanReadiness(realId()).status).toBe('ready_to_use');
    expect(assessScanReadiness({ ...realId(), reviewConfirmed: false }).status).toBe(
      'needs_review'
    );
    for (const invalid of [
      { idNumber: '784-bad' },
      { fullNameEn: '' },
      { fullNameEn: 'unknown' },
      { fullNameEn: '1234' },
      { expiryDate: '31/02/2030' },
      { dateOfBirth: 'impossible' },
      { issueDate: '01/01/2040' },
      { dateOfBirth: '01/01/2099' },
    ])
      expect(assessScanReadiness({ ...realId(), ...invalid }).status).toBe('needs_rescan');
  });

  it('requires date-specific expired ID acknowledgment and rechecks expiry on cache reads', () => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2030, 0, 2));
    const expired = realId();
    expect(assessScanReadiness(expired).status).toBe('needs_review');
    expect(canUseScan({ ...expired, expiryAcknowledgedFor: '01/01/2029' })).toBe(false);
    expect(canUseScan({ ...expired, expiryAcknowledgedFor: expired.expiryDate })).toBe(true);
    eid.setCachedEmiratesId(expired);
    expect(eid.getCachedEmiratesId()).toBeNull();
    eid.setCachedEmiratesId({ ...expired, expiryAcknowledgedFor: expired.expiryDate });
    expect(eid.getCachedEmiratesId()?.isExpired).toBe(true);
    expect(eid.getCachedEmiratesId()?.daysUntilExpiry).toBe(-1);
  });

  it('hydrates actual schema, recomputes expiry and drops old review and acknowledgment', () => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2030, 0, 2));
    const stored = archive({ ...realId(), expiryAcknowledgedFor: '01/01/2030' } as ReturnType<
      typeof realId
    >);
    const loaded = hydrateVaultScan(stored, 'emirates_id', EMPTY_EMIRATES_ID);
    expect(loaded).toMatchObject({
      demoOnly: false,
      reviewConfirmed: false,
      isExpired: true,
      daysUntilExpiry: -1,
      vaultSource: { documentId: 'a'.repeat(24), docType: 'emirates_id' },
    });
    expect(loaded.expiryAcknowledgedFor).toBeUndefined();
    loaded.fullNameEn = 'MUTATED';
    expect(stored.extractedJson.fullNameEn).toBe('TEST PERSON');
    expect(eid.getCachedEmiratesId()).toBeNull();
  });
  it('invalidates a previously current reviewed cache once its expiry passes', () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2029, 11, 31));
    eid.setCachedEmiratesId(realId());
    expect(eid.getCachedEmiratesId()).not.toBeNull();
    clock.mockReturnValue(Date.UTC(2030, 0, 2));
    expect(eid.getCachedEmiratesId()).toBeNull();
  });
  it('preserves archived conflict evidence and refuses cache publication even with new confirmation', () => {
    const fields = {
      ...realId(),
      diagnostics: {
        coverage: 0,
        warnings: ['Conflicting source IDs'],
        fields: {
          idNumber: {
            state: 'conflict' as const,
            source: 'text' as const,
            values: ['784-2001-0000001-1', '784-2001-0000002-2'],
          },
        },
      },
    };
    const loaded = hydrateVaultScan(
      { ...archive(), extractedJson: fields },
      'emirates_id',
      EMPTY_EMIRATES_ID
    );
    eid.setCachedEmiratesId({ ...loaded, reviewConfirmed: true });
    expect(eid.getCachedEmiratesId()).toBeNull();
    expect(loaded.diagnostics?.fields.idNumber?.values).toEqual(
      fields.diagnostics.fields.idNumber.values
    );
  });

  it.each([
    { docType: 'title_deed' },
    { id: 'bad' },
    { replacedById: 'b'.repeat(24) },
    { extractedJson: { ...realId(), idNumber: null } },
    { extractedJson: { ...realId(), expiryDate: '31/02/2030' } },
    { extractedJson: { ...realId(), fullNameEn: {} } },
    { extractedJson: { ...realId(), diagnostics: { fields: null } } },
    { extractedJson: { ...realId(), demoOnly: true } },
    { extractedJson: { ...realId(), rawIdNumber: '784200100000022' } },
    { extractedJson: { ...realId(), cardNumber: 'invalid' } },
    { extractedJson: { ...realId(), owners: [{ nameEn: 'UNVALIDATED' }] } },
  ])('rejects malformed or wrong-type archived record %j', patch => {
    expect(() =>
      hydrateVaultScan({ ...archive(), ...patch }, 'emirates_id', EMPTY_EMIRATES_ID)
    ).toThrow();
    expect(eid.getCachedEmiratesId()).toBeNull();
  });

  it('preserves confirmed multiowner selection and original evidence through repeated immutable reuse', () => {
    const fields = {
      ...deed.getDemoExtractedData(),
      demoOnly: false,
      reviewConfirmed: true,
      owners: [
        { dldNumber: '1', nameEn: 'TEST OWNER ONE', nameAr: '', sharePercent: 60 },
        { dldNumber: '2', nameEn: 'TEST OWNER TWO', nameAr: '', sharePercent: 40 },
      ],
      ownerNameEn: 'TEST OWNER TWO',
      diagnostics: {
        coverage: 1,
        warnings: ['Multiple owners: authorization requires source review.'],
        fields: {
          ownerName: {
            state: 'extracted' as const,
            source: 'review' as const,
            values: ['TEST OWNER ONE', 'TEST OWNER TWO'],
          },
        },
      },
    };
    const loaded = hydrateVaultScan(
      { id: 'b'.repeat(24), docType: 'title_deed', extractedJson: fields },
      'title_deed',
      deed.getDemoExtractedData()
    );
    expect(loaded.owners).toEqual(fields.owners);
    expect(loaded.ownerNameEn).toBe('TEST OWNER TWO');
    expect(canUseScan(loaded)).toBe(false);
    deed.setCachedTitleDeed({ ...loaded, reviewConfirmed: true });
    loaded.owners![0]!.nameEn = 'MUTATED';
    const copy = deed.getCachedTitleDeed()!;
    copy.diagnostics!.warnings.push('MUTATED');
    expect(deed.getCachedTitleDeed()?.owners?.[0]?.nameEn).toBe('TEST OWNER ONE');
    expect(deed.getCachedTitleDeed()?.diagnostics?.warnings).not.toContain('MUTATED');
  });

  it('does not map unknown numeric or mortgage observations into CRM as known zeros', () => {
    const parsed = deed.parseDocumentText(
      'Certificate Number: 12/2026\nOwner Name: TEST OWNER\nUnit Number: 5'
    );
    const listing = deed.toCrmPropertyListing({ ...parsed, reviewConfirmed: true });
    expect(listing.sizeSqM).toBeUndefined();
    expect(listing.sizeSqFt).toBeUndefined();
    expect(listing.lastPurchasePriceAed).toBeUndefined();
    expect(listing.mortgageStatus).toBeUndefined();
    const visibleZero = deed.parseDocumentText(
      'Certificate Number: 12/2026\nOwner Name: TEST OWNER\nUnit Number: 5\nPurchase Price: 0 AED'
    );
    expect(
      deed.toCrmPropertyListing({ ...visibleZero, reviewConfirmed: true }).lastPurchasePriceAed
    ).toBe(0);
  });
  it.each(['', '31/02/2027', '29/02/2027', '00/01/2030', '01/13/2030', '2030-01-01', 'invalid'])(
    'keeps invalid expiry %s explicitly unknown',
    value => {
      expect(scanExpiry(value)).toEqual({ isExpired: false, daysUntilExpiry: NaN });
    }
  );
  it('keeps valid expired, current and leap-day expiry calculations', () => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2028, 1, 28, 15, 30));
    expect(scanExpiry('29/02/2028')).toEqual({ isExpired: false, daysUntilExpiry: 1 });
    expect(scanExpiry('28/02/2028')).toEqual({ isExpired: false, daysUntilExpiry: 0 });
    expect(scanExpiry('27/02/2028')).toEqual({ isExpired: true, daysUntilExpiry: -1 });
  });
  it('leaves legacy persisted scan assets untouched and never reads unsafe defaults', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem');
    const set = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    eid.clearCachedEmiratesId();
    deed.clearCachedTitleDeed();
    passport.clearCachedPassport();
    contract.clearCachedContract();
    expect(eid.getCachedEmiratesId()).toBeNull();
    expect(deed.getCachedTitleDeed()).toBeNull();
    expect(passport.getCachedPassport()).toBeNull();
    expect(contract.getCachedContract()).toBeNull();
    eid.setCachedEmiratesId({
      ...eid.getDemoExtractedData(),
      demoOnly: false,
      reviewConfirmed: true,
    });
    deed.setCachedTitleDeed({
      ...deed.getDemoExtractedData(),
      demoOnly: false,
      reviewConfirmed: true,
    });
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
    vi.mocked(authFetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { id: 'saved' } }))
    );
    const file = new File(['%PDF-1.7'], 'source.pdf', { type: 'application/pdf' });
    expect(
      (
        await saveReviewedScan('passport', { reviewConfirmed: true }, '123', 'TEST', {
          sources: [file],
          propertyId: 'property',
          tenancyId: '123456789012345678901234',
          transactionId: '223456789012345678901234',
        })
      ).success
    ).toBe(true);
    const init = vi.mocked(authFetch).mock.calls.at(-1)?.[1];
    expect(init?.body).toBeInstanceOf(FormData);
    expect((init?.body as FormData).get('source')).toBeInstanceOf(File);
    expect(JSON.parse(String((init?.body as FormData).get('metadata')))).toMatchObject({
      propertyId: 'property', tenancyId: '123456789012345678901234',
      transactionId: '223456789012345678901234',
    });
    expect(init?.headers).toBeUndefined();
  });
  it('legacy benchmark callers fail honestly rather than claiming saved/autofilled', async () => {
    expect((await passport.saveToDatabase()).success).toBe(false);
    expect((await contract.saveToDatabase()).success).toBe(false);
    expect(() => passport.toContractParty(passport.getDemoExtractedData())).toThrow(
      'review required'
    );
    expect(() => contract.toCrmTenantProfile(contract.getDemoExtractedData())).toThrow('review');
  });
});
