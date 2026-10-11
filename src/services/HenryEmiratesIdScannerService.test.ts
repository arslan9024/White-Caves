import { describe, it, expect, vi } from 'vitest';
import henryEmiratesIdScannerService, {
  ARSLAN_MALIK_SAMPLE_EID,
  MANSOOR_ALMARZOOQI_SAMPLE_EID,
} from './HenryEmiratesIdScannerService';

describe('HenryEmiratesIdScannerService — Emirates ID OCR & MRZ Engine', () => {
  it('rejects incomplete MRZ instead of inventing missing fields', () => {
    expect(henryEmiratesIdScannerService.parseTD1Mrz('INVALID', 'INVALID', 'INVALID')).toEqual({});
  });

  it('formats raw 15-digit Emirates ID string with hyphens', () => {
    const formatted = henryEmiratesIdScannerService.formatEmiratesId('784199318057330');
    expect(formatted).toBe('784-1993-1805733-0');
  });

  it('scans Emirates ID and returns full 18-field bilingual extracted payload', async () => {
    const data = await henryEmiratesIdScannerService.scanEmiratesId('sample');

    expect(data.idNumber).toBe('784-1993-1805733-0');
    expect(data.fullNameEn).toBe('Arslan Malik Bashir Ahmad');
    expect(data.fullNameAr).toBe('ارسلان مالك بشير احمد');
    expect(data.occupationEn).toBe('Managing Director');
    expect(data.employerEn).toBe('White Caves Real Estate L.L.C');
    expect(data.issuingPlaceEn).toBe('Dubai');
    expect(data.chipNumber).toBe('2500069345');
    expect(data.confidenceScore).toBeGreaterThanOrEqual(0.99);
  });

  it('scans and accurately extracts Khalif Mohamednur Ibrahim Emirates ID with TD1 MRZ', async () => {
    const data = await henryEmiratesIdScannerService.scanEmiratesId('sample_khalif' as any);

    expect(data.idNumber).toBe('784-1984-5852080-0');
    expect(data.cardNumber).toBe('146532347');
    expect(data.fullNameEn).toBe('Khalif Mohamednur Ibrahim');
    expect(data.fullNameAr).toBe('خليف محمدنور ابراهيم');
    expect(data.nationalityEn).toBe('Kenya');
    expect(data.nationalityAr).toBe('جمهورية كينيا');
    expect(data.dateOfBirth).toBe('12/07/1984');
    expect(data.occupationEn).toBe('Sales Officer');
    expect(data.employerEn).toBe('Jayeeco General Trading L.L.C');
    expect(data.mrz?.line1).toBe('ILARE1465323471784198458520800');
    expect(data.mrz?.line2).toBe('8407122M2706155KEN<<<<<<<<<<<1');
    expect(data.mrz?.line3).toBe('IBRAHIM<<KHALIF<MOHAMEDNUR<<<<');
  });

  it('detects document side (Front, Back, or Both)', () => {
    expect(henryEmiratesIdScannerService.detectDocumentSide('Resident Identity Card United Arab Emirates 784-1993-1805733-0')).toBe('front');
    expect(henryEmiratesIdScannerService.detectDocumentSide('ILARE1445975719784199318057330 9302109M2611228PAK')).toBe('back');
    expect(henryEmiratesIdScannerService.detectDocumentSide('Front Card 784-1993-1805733-0 with Back ILARE1445975719784199318057330')).toBe('both');
  });

  it('manages temporary session cache and dispatches listener updates', () => {
    const listener = vi.fn();
    const unsubscribe = henryEmiratesIdScannerService.onEmiratesIdUpdated(listener);

    henryEmiratesIdScannerService.setCachedEmiratesId({ ...MANSOOR_ALMARZOOQI_SAMPLE_EID, demoOnly: false, reviewConfirmed: true });
    expect(henryEmiratesIdScannerService.getCachedEmiratesId()?.idNumber).toBe('784-1990-7528093-5');
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ idNumber: '784-1990-7528093-5' }));

    henryEmiratesIdScannerService.clearCachedEmiratesId();
    expect(henryEmiratesIdScannerService.getCachedEmiratesId()).toBeNull();
    expect(listener).toHaveBeenCalledWith(null);

    unsubscribe();
  });

  it('scans dual sides from actual OCR content without publishing candidates', async () => {
    const ocr = vi.spyOn(henryEmiratesIdScannerService, 'extractDocumentText').mockResolvedValue({ ocrText: 'ID Number: 784-1993-1805733-0\nName: TEST PERSON\nExpiry Date: 22/11/2026', streamText: '' });
    const frontFile = new File(['front'], 'Front.png', { type: 'image/png' });
    const backFile = new File(['back'], 'Back.jpg', { type: 'image/jpeg' });
    const merged = await henryEmiratesIdScannerService.scanDualSide(frontFile, backFile);
    expect(merged.idNumber).toBe('784-1993-1805733-0');
    expect(merged.scannedSide).toBe('both');
    expect(merged.reviewConfirmed).toBe(false);
    ocr.mockRestore();
  });

  it('exports extracted data directly to Tenancy Contract party object', () => {
    const party = henryEmiratesIdScannerService.toContractParty(
      { ...ARSLAN_MALIK_SAMPLE_EID, demoOnly: false, reviewConfirmed: true },
      '+971 56 361 6136',
      'admin@whitecaves.com'
    );

    expect(party.name).toBe('Arslan Malik Bashir Ahmad');
    expect(party.emiratesIdOrPassport).toBe('784-1993-1805733-0');
    expect(party.phone).toBe('+971 56 361 6136');
  });

  it('exports extracted data directly to Form B viewing payload', () => {
    const viewing = henryEmiratesIdScannerService.toViewingClientPayload({ ...ARSLAN_MALIK_SAMPLE_EID, demoOnly: false, reviewConfirmed: true }, {
      formId: 'VIEW-TEST-1',
    });

    expect(viewing.clientName).toBe('Arslan Malik Bashir Ahmad');
    expect(viewing.clientPassportOrEid).toBe('784-1993-1805733-0');
  });
});
