import { describe, it, expect } from 'vitest';
import henryPassportScannerService, {
  ARSLAN_MALIK_SAMPLE_PASSPORT,
} from './HenryPassportScannerService';

describe('HenryPassportScannerService — International Passport ICAO 9303 TD3 Engine', () => {
  it('correctly parses 2-line ICAO 9303 TD3 MRZ zone', () => {
    const line1 = 'P<PAKMALIK<<ARSLAN<<<<<<<<<<<<<<<<<<<<<<<<<<';
    const line2 = 'DR07601431PAK9302109M34022143230343390149<20';

    const parsed = henryPassportScannerService.parseTD3Mrz(line1, line2);

    expect(parsed.passportType).toBe('P');
    expect(parsed.issuingCountryCode).toBe('PAK');
    expect(parsed.surname).toBe('MALIK');
    expect(parsed.givenNames).toBe('ARSLAN');
    expect(parsed.fullName).toBe('ARSLAN MALIK');
    expect(parsed.passportNumber).toBe('DR0760143');
    expect(parsed.nationalityCode).toBe('PAK');
    expect(parsed.dateOfBirth).toBe('10/02/1993');
    expect(parsed.gender).toBe('M');
    expect(parsed.dateOfExpiry).toBe('21/02/2034');
    expect(parsed.nationalIdentityNumber).toBe('32303-4339014-9');
  });

  it('scans Passport and returns full 16-field extracted payload', async () => {
    const data = await henryPassportScannerService.scanPassport('sample');

    expect(data.passportNumber).toBe('DR0760143');
    expect(data.bookletNumber).toBe('R7587163');
    expect(data.trackingNumber).toBe('99992498902');
    expect(data.fullName).toBe('Arslan Malik');
    expect(data.fatherName).toBe('Bashir Ahmad');
    expect(data.nationalIdentityNumber).toBe('32303-4339014-9');
    expect(data.placeOfBirth).toBe('MUZAFFARGARH, PAK');
    expect(data.validityYears).toBe(10);
    expect(data.confidenceScore).toBeGreaterThanOrEqual(0.99);
  });

  it('exports extracted data directly to Tenancy Contract party object', () => {
    const party = henryPassportScannerService.toContractParty(
      ARSLAN_MALIK_SAMPLE_PASSPORT,
      '+971 56 361 6136',
      'admin@whitecaves.com'
    );

    expect(party.name).toBe('Arslan Malik');
    expect(party.emiratesIdOrPassport).toBe('Passport: DR0760143 (PAK)');
    expect(party.phone).toBe('+971 56 361 6136');
  });

  it('exports extracted data directly to Form B viewing payload', () => {
    const viewing = henryPassportScannerService.toViewingClientPayload(
      ARSLAN_MALIK_SAMPLE_PASSPORT,
      { formId: 'VIEW-TEST-PASS' }
    );

    expect(viewing.clientName).toBe('Arslan Malik');
    expect(viewing.clientPassportOrEid).toBe('Passport: DR0760143');
  });

  it('exports extracted data as formatted JSON string', () => {
    const jsonStr = henryPassportScannerService.exportToJsonString(
      ARSLAN_MALIK_SAMPLE_PASSPORT
    );
    expect(jsonStr).toContain('DR0760143');
    expect(jsonStr).toContain('32303-4339014-9');
    expect(jsonStr).toContain('R7587163');
  });
});
