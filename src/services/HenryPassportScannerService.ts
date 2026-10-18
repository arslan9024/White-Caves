/**
 * HenryPassportScannerService.ts — International Passport ICAO 9303 TD3 OCR & MRZ Engine
 *
 * Provides comprehensive algorithmic parsing of International Passports:
 * 1. ICAO 9303 TD3 2-line (44-character) Machine Readable Zone (MRZ) decoder.
 * 2. Visual bio-data field extractor (Father Name, CNIC / National ID, Booklet No, Tracking No, Place of Birth).
 * 3. 16+ structured field extraction payload.
 * 4. 1-Click variable mapping for Tenancy Contracts, Ejari, Form B, and goAML KYC screening.
 */

import { ContractParty, ViewingFormPayload } from './HenryPdfEngineService';
import { ScanReview, canUseScan, saveReviewedScan, scanExpiry, validScanDate, VaultSaveOptions } from './henryScanReview';
import henryEmiratesIdScannerService from './HenryEmiratesIdScannerService';
import { readDocumentFields, normalizeDocumentDate, normalizeDocumentText, refreshCoverage, flagDocumentConflicts } from './henryDocumentParsing';
import logger from '../utils/logger';

export interface InternationalPassportExtractedData extends ScanReview {
  // Document Identity
  passportNumber: string; // e.g. "DR0760143"
  passportType: string; // "P" (Standard Passport)
  issuingCountry: string; // "Islamic Republic of Pakistan"
  issuingCountryCode: string; // "PAK"
  bookletNumber: string; // "R7587163"
  trackingNumber: string; // "99992498902"
  issuingAuthority: string; // "PAKISTAN"
  documentFormat?: string;

  // Personal Identity
  surname: string; // "MALIK"
  givenNames: string; // "ARSLAN"
  fullName: string; // "Arslan Malik"
  fatherName: string; // "Bashir Ahmad"
  nationalIdentityNumber: string; // "32303-4339014-9" (CNIC)
  dateOfBirth: string; // "10/02/1993"
  gender: 'M' | 'F' | '';
  placeOfBirth: string; // "MUZAFFARGARH, PAK"
  nationality: string; // "PAKISTANI"
  nationalityCode: string; // "PAK"

  // Validity Lifespan
  dateOfIssue: string; // "22/02/2024"
  dateOfExpiry: string; // "21/02/2034"
  isExpired: boolean;
  validityYears: number; // 10

  // 2-Line ICAO 9303 TD3 MRZ Lines
  mrz: {
    line1: string; // "P<PAKMALIK<<ARSLAN<<<<<<<<<<<<<<<<<<<<<<<<<<"
    line2: string; // "DR07601431PAK9302109M34022143230343390149<20"
  };

  // Telemetry
  confidenceScore: number; // 0.999
  scannedAt: string; // ISO timestamp
}

export const ARSLAN_MALIK_SAMPLE_PASSPORT: InternationalPassportExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  passportNumber: 'DR0760143',
  passportType: 'P',
  issuingCountry: 'Islamic Republic of Pakistan',
  issuingCountryCode: 'PAK',
  bookletNumber: 'R7587163',
  trackingNumber: '99992498902',
  issuingAuthority: 'PAKISTAN',

  surname: 'MALIK',
  givenNames: 'ARSLAN',
  fullName: 'Arslan Malik',
  fatherName: 'Bashir Ahmad',
  nationalIdentityNumber: '32303-4339014-9',
  dateOfBirth: '10/02/1993',
  gender: 'M',
  placeOfBirth: 'MUZAFFARGARH, PAK',
  nationality: 'PAKISTANI',
  nationalityCode: 'PAK',

  dateOfIssue: '22/02/2024',
  dateOfExpiry: '21/02/2034',
  isExpired: false,
  validityYears: 10,

  mrz: {
    line1: 'P<PAKMALIK<<ARSLAN<<<<<<<<<<<<<<<<<<<<<<<<<<',
    line2: 'DR07601431PAK9302109M34022143230343390149<20',
  },

  confidenceScore: 0.999,
  scannedAt: new Date().toISOString(),
};

class HenryPassportScannerService {
  private inMemoryCache: InternationalPassportExtractedData | null = null;
  private listeners: Set<(data: InternationalPassportExtractedData | null) => void> = new Set();

  /**
   * Keeps extracted Passport data in session memory only
   */
  setCachedPassport(data: InternationalPassportExtractedData): void {
    if (!canUseScan(data)) return;
    this.inMemoryCache = structuredClone(data);
    this.notifyListeners(this.inMemoryCache);
  }

  /**
   * Retrieves active Passport from temporary session cache
   */
  getCachedPassport(): InternationalPassportExtractedData | null {
    if (this.inMemoryCache && canUseScan(this.inMemoryCache)) return this.refreshValidity(structuredClone(this.inMemoryCache));
    return null;
  }

  /**
   * Clears the active Passport session cache
   */
  clearCachedPassport(): void {
    this.inMemoryCache = null;
    this.notifyListeners(null);
  }

  /**
   * Registers a subscriber listener to receive active Passport cache mutations
   */
  onPassportUpdated(listener: (data: InternationalPassportExtractedData | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(data: InternationalPassportExtractedData | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data ? structuredClone(data) : null);
      } catch (err) {
        logger.error('Henry passport cache listener failed', { errorName: err instanceof Error ? err.name : 'UnknownError' });
      }
    });
  }

  /**
   * Formats Pakistani CNIC / National Identity Number with hyphens (XXXXX-XXXXXXX-X)
   */
  formatCnicNumber(rawNumber: string): string {
    const cleaned = (rawNumber || '').replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
    }
    return rawNumber;
  }

  /**
   * Parses 2-Line ICAO 9303 TD3 (44-char) Machine Readable Zone
   */
  parseTD3Mrz(line1: string, line2: string): Partial<InternationalPassportExtractedData> {
    const l1 = (line1 || '').trim().toUpperCase();
    const l2 = (line2 || '').trim().toUpperCase();
    const check = (value: string, digit: string) =>
      /^\d$/.test(digit) && value.split('').reduce((sum, char, index) =>
        sum + (char === '<' ? 0 : parseInt(char, 36)) *
        [7, 3, 1][index % 3]!, 0) % 10 === Number(digit);
    if (!/^P[A-Z<][A-Z<]{42}$/.test(l1) || !/^[A-Z0-9<]{44}$/.test(l2) ||
      !/^[A-Z<]{3}$/.test(l2.slice(10, 13)) ||
      ![l2.slice(13, 19), l2.slice(21, 27)].every(raw => /^\d{6}$/.test(raw) &&
        validScanDate(`${raw.slice(4, 6)}/${raw.slice(2, 4)}/20${raw.slice(0, 2)}`)) ||
      !check(l2.slice(0, 9), l2[9]!) || !check(l2.slice(13, 19), l2[19]!) ||
      !check(l2.slice(21, 27), l2[27]!) ||
      !(l2[42] === '<' && /^<+$/.test(l2.slice(28, 42)) || check(l2.slice(28, 42), l2[42]!)) ||
      !check(l2.slice(0, 10) + l2.slice(13, 20) + l2.slice(21, 43), l2[43]!)) return {};

    // Line 1: P<PAKMALIK<<ARSLAN<<<<<<<<<<<<<<<<<<<<<<<<<<
    const passportType = l1.slice(0, 1);
    const issuingCountryCode = l1.slice(2, 5).replace(/</g, '');
    const nameSection = l1.slice(5);
    const nameParts = nameSection.split('<<').filter(Boolean);

    let surname = '';
    let givenNames = '';
    if (nameParts.length >= 2) {
      surname = nameParts[0].replace(/</g, ' ').trim();
      givenNames = nameParts[1].replace(/</g, ' ').trim();
    } else if (nameParts.length === 1) {
      givenNames = nameParts[0].replace(/</g, ' ').trim();
    }

    const fullName = `${givenNames} ${surname}`.trim();

    // Line 2: DR07601431PAK9302109M34022143230343390149<20
    const passportNumber = l2.slice(0, 9).replace(/</g, '');
    const nationalityCode = l2.slice(10, 13).replace(/</g, '');

    const gender = l2[20] === 'F' ? 'F' : l2[20] === 'M' ? 'M' : '';

    return {
      passportType,
      issuingCountryCode,
      surname,
      givenNames,
      fullName,
      passportNumber,
      nationalityCode,
      gender,
      mrz: { line1: l1, line2: l2 },
    };
  }

  /**
   * Scans an uploaded Passport bio-data page or preloaded reference sample
   */
  async scanPassport(fileOrPreset?: File | 'sample'): Promise<InternationalPassportExtractedData> {
    if (!fileOrPreset || fileOrPreset === 'sample') {
      this.clearCachedPassport();
      const demo = {
        ...structuredClone(ARSLAN_MALIK_SAMPLE_PASSPORT),
        demoOnly: true, reviewConfirmed: false,
        scannedAt: new Date().toISOString(),
      };
      return demo;
    }

    this.clearCachedPassport();
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(fileOrPreset.type) ||
      !fileOrPreset.size || fileOrPreset.size > 10 * 1024 * 1024)
      throw new Error('Upload a non-empty PDF, JPEG or PNG up to 10 MB.');
    const extraction = await henryEmiratesIdScannerService.extractDocumentText(fileOrPreset, undefined, text => {
      const parsed = this.parsePassportText(text);
      return [!!parsed.passportNumber, !!parsed.fullName, !!(parsed.issuingCountry || parsed.issuingCountryCode),
        validScanDate(parsed.dateOfBirth), validScanDate(parsed.dateOfExpiry)].filter(Boolean).length / 5;
    });
    const result = this.parsePassportText([extraction.ocrText, extraction.streamText].filter(Boolean).join('\n'));
    result.documentFormat = fileOrPreset.type;
    result.diagnostics!.ocrConfidence = extraction.ocrConfidence;
    result.diagnostics!.warnings.push(...(extraction.warnings || []));
    return result;
  }

  parsePassportText(text: string): InternationalPassportExtractedData {
    const { values, diagnostics } = readDocumentFields(text, {
      passportNumber: ['Passport Number', 'Passport No.', 'Passport No', 'رقم الجواز', 'رقم جواز السفر'],
      fullName: ['Full Name', 'Name', 'الاسم الكامل', 'الاسم'],
      surname: ['Surname', 'اسم العائلة', 'اللقب'], givenNames: ['Given Names', 'Given Name(s)', 'Given Name', 'الأسماء'],
      issuingCountry: ['Issuing Country', 'بلد الإصدار'], issuingCountryCode: ['Country Code', 'رمز الدولة'],
      nationality: ['Nationality', 'الجنسية'], nationalityCode: ['Nationality Code'],
      dateOfBirth: ['Date of Birth', 'Birth Date', 'تاريخ الميلاد'],
      dateOfExpiry: ['Date of Expiry', 'Expiry Date', 'تاريخ الانتهاء'],
      dateOfIssue: ['Date of Issue', 'Issue Date', 'تاريخ الإصدار'],
      gender: ['Sex', 'Gender', 'الجنس'], placeOfBirth: ['Place of Birth', 'مكان الميلاد'],
      fatherName: ['Father Name', 'اسم الأب'], nationalIdentityNumber: ['National ID', 'Identity Number', 'رقم الهوية'],
      issuingAuthority: ['Issuing Authority', 'سلطة الإصدار'], bookletNumber: ['Booklet Number'],
      trackingNumber: ['Tracking Number'], passportType: ['Passport Type'],
    });
    const value = (key: string) => values[key]?.[0] || '';
    flagDocumentConflicts(diagnostics);
    const lines = normalizeDocumentText(text).toUpperCase().split('\n').map(line => line.replace(/\s/g, ''));
    const pairs = lines.flatMap((line, index) => /^P[A-Z<][A-Z<]{42}$/.test(line)
      ? [{ line1: line, line2: lines[index + 1] || '' }] : []);
    const candidates = pairs.map(pair => this.parseTD3Mrz(pair.line1, pair.line2));
    const validCandidates = candidates.filter(candidate => !!candidate.passportNumber);
    const result: InternationalPassportExtractedData = {
      passportNumber: value('passportNumber'), passportType: value('passportType'),
      issuingCountry: value('issuingCountry'), issuingCountryCode: value('issuingCountryCode'),
      bookletNumber: value('bookletNumber'), trackingNumber: value('trackingNumber'),
      issuingAuthority: value('issuingAuthority'), surname: value('surname'), givenNames: value('givenNames'),
      fullName: value('fullName'), fatherName: value('fatherName'), nationalIdentityNumber: value('nationalIdentityNumber'),
      dateOfBirth: normalizeDocumentDate(value('dateOfBirth')), gender: /^(M|MALE|ذكر)$/i.test(value('gender')) ? 'M' : /^(F|FEMALE|أنثى)$/i.test(value('gender')) ? 'F' : '',
      placeOfBirth: value('placeOfBirth'), nationality: value('nationality'), nationalityCode: value('nationalityCode'),
      dateOfIssue: normalizeDocumentDate(value('dateOfIssue')), dateOfExpiry: normalizeDocumentDate(value('dateOfExpiry')),
      isExpired: false, validityYears: 0, mrz: validCandidates[0]?.mrz || pairs[0] || { line1: '', line2: '' },
      confidenceScore: 0, scannedAt: new Date().toISOString(), demoOnly: false, reviewConfirmed: false, diagnostics,
    };
    for (const [key, candidate] of validCandidates.flatMap(mrz => Object.entries(mrz))) {
      if (!candidate || typeof candidate !== 'string') continue;
      const current = result[key as keyof InternationalPassportExtractedData];
      const equivalent = (a: string, b: string) => a.toUpperCase().replace(/[^A-Z0-9]/g, '') === b.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const evidence = diagnostics.fields[key];
      if (evidence?.state === 'conflict' || current && typeof current === 'string' && !equivalent(current, candidate))
        diagnostics.fields[key] = { state: 'conflict', source: 'mrz',
          values: [...new Set([...(evidence?.values || []), ...(typeof current === 'string' && current ? [current] : []), candidate])] };
      else if (!current) {
        Object.assign(result, { [key]: candidate });
        diagnostics.fields[key] = { state: 'extracted', source: 'mrz', values: [candidate] };
      }
    }
    if (!result.fullName && (result.givenNames || result.surname)) {
      result.fullName = `${result.givenNames} ${result.surname}`.trim();
      diagnostics.fields.fullName = { state: 'derived', source: 'text', values: [result.fullName] };
    }
    for (const [key, start, end] of [['dateOfBirth', 13, 19], ['dateOfExpiry', 21, 27]] as const) {
      const readings = [...new Set(validCandidates.map(candidate => candidate.mrz!.line2.slice(start, end)))];
      const visible = result[key];
      const evidence = diagnostics.fields[key];
      if (readings.length > 1 || visible && readings.some(raw => visible.split('/').reverse().join('').slice(2) !== raw))
        diagnostics.fields[key] = { state: 'conflict', source: 'mrz',
          values: [...new Set([...(evidence?.values || []), ...readings])] };
    }
    if (validCandidates.length < pairs.length) diagnostics.warnings.push('TD3 MRZ failed format or check digits; review visible fields.');
    if (!result.dateOfBirth || !result.dateOfExpiry) diagnostics.warnings.push('Four-digit date years require visible source evidence or manual review; MRZ centuries are not guessed.');
    refreshCoverage(diagnostics);
    return this.refreshValidity(result);
  }

  refreshValidity(data: InternationalPassportExtractedData): InternationalPassportExtractedData {
    const validityYears = validScanDate(data.dateOfIssue) && validScanDate(data.dateOfExpiry)
      ? Math.max(0, Math.round((Date.parse(data.dateOfExpiry.split('/').reverse().join('-')) -
        Date.parse(data.dateOfIssue.split('/').reverse().join('-'))) / (365.25 * 86400000))) : 0;
    return { ...data, isExpired: scanExpiry(data.dateOfExpiry).isExpired, validityYears };
  }

  /**
   * Alias for scanPassport conforming to standard document ingestion interfaces
   */
  async scanDocument(
    fileOrPreset?: File | 'sample'
  ): Promise<InternationalPassportExtractedData> {
    return this.scanPassport(fileOrPreset);
  }

  /**
   * Returns demo scanned Passport data (Arslan Malik - DR0760143)
   */
  getDemoExtractedData(): InternationalPassportExtractedData {
    this.clearCachedPassport();
    const demo = { ...structuredClone(ARSLAN_MALIK_SAMPLE_PASSPORT), scannedAt: new Date().toISOString(), demoOnly: true, reviewConfirmed: false };
    return demo;
  }

  /**
   * Converts Extracted Passport data into a ContractParty object for Tenancy Contracts
   */
  toContractParty(
    extracted: InternationalPassportExtractedData,
    phone: string = '',
    email: string = ''
  ): ContractParty {
    if (!canUseScan(extracted)) throw new Error('Passport review required; benchmark extraction cannot autofill.');
    return {
      name: extracted.fullName,
      emiratesIdOrPassport: `Passport: ${extracted.passportNumber} (${extracted.issuingCountryCode})`,
      phone,
      email,
    };
  }

  /**
   * Converts Extracted Passport into a Form B Viewing Register client payload
   */
  toViewingClientPayload(
    extracted: InternationalPassportExtractedData,
    basePayload: Partial<ViewingFormPayload> = {}
  ): Partial<ViewingFormPayload> {
    if (!canUseScan(extracted)) throw new Error('Passport review required; benchmark extraction cannot autofill.');
    return {
      ...basePayload,
      clientName: extracted.fullName,
      clientPassportOrEid: `Passport: ${extracted.passportNumber}`,
    };
  }

  /**
   * Exports extracted data as a structured JSON object
   */
  exportToJson(extracted?: InternationalPassportExtractedData): Record<string, any> {
    const data = extracted || this.getCachedPassport() || ARSLAN_MALIK_SAMPLE_PASSPORT;
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Exports extracted data as a formatted JSON string
   */
  exportToJsonString(extracted?: InternationalPassportExtractedData): string {
    return JSON.stringify(this.exportToJson(extracted), null, 2);
  }

  /**
   * Persists extracted Passport record to backend database and session cache
   */
  async saveToDatabase(extracted?: InternationalPassportExtractedData, options: VaultSaveOptions = {}): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!extracted) return { success: false, error: 'Review required. Nothing was saved.' };
    return saveReviewedScan('passport', extracted, extracted.passportNumber, extracted.fullName, options);
  }
}

export const henryPassportScannerService = new HenryPassportScannerService();
export default henryPassportScannerService;
