import { describe, it, expect } from 'vitest';
import henryEmiratesIdScannerService, {
  ARSLAN_MALIK_SAMPLE_EID,
} from './HenryEmiratesIdScannerService';

describe('HenryEmiratesIdScannerService — Emirates ID OCR & MRZ Engine', () => {
  it('correctly parses ICAO 9303 TD1 3-line MRZ zone', () => {
    const line1 = 'ILARE1445975719784199318057330';
    const line2 = '9302109M2611228PAK<<<<<<<<<<<6';
    const line3 = 'BASHIR<AHMAD<<ARSLAN<MALIK<<<<';

    const parsed = henryEmiratesIdScannerService.parseTD1Mrz(line1, line2, line3);

    expect(parsed.idNumber).toBe('784-1993-1805733-0');
    expect(parsed.cardNumber).toBe('144597571');
    expect(parsed.dateOfBirth).toBe('10/02/1993');
    expect(parsed.gender).toBe('M');
    expect(parsed.expiryDate).toBe('22/11/2026');
    expect(parsed.nationalityCode).toBe('PAK');
    expect(parsed.fullNameEn).toBe('ARSLAN MALIK BASHIR AHMAD');
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

  it('exports extracted data directly to Tenancy Contract party object', () => {
    const party = henryEmiratesIdScannerService.toContractParty(
      ARSLAN_MALIK_SAMPLE_EID,
      '+971 56 361 6136',
      'admin@whitecaves.com'
    );

    expect(party.name).toBe('Arslan Malik Bashir Ahmad');
    expect(party.emiratesIdOrPassport).toBe('784-1993-1805733-0');
    expect(party.phone).toBe('+971 56 361 6136');
  });

  it('exports extracted data directly to Form B viewing payload', () => {
    const viewing = henryEmiratesIdScannerService.toViewingClientPayload(ARSLAN_MALIK_SAMPLE_EID, {
      formId: 'VIEW-TEST-1',
    });

    expect(viewing.clientName).toBe('Arslan Malik Bashir Ahmad');
    expect(viewing.clientPassportOrEid).toBe('784-1993-1805733-0');
  });
});
