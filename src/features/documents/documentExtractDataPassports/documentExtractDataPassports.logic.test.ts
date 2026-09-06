import { describe, expect, it } from 'vitest';
import {
  computeCheckDigit,
  extractPassportDataFromOcrText,
  findMrzLines,
  isPassportExpired,
  parseTd3Mrz,
  type ExtractedPassportData,
} from './documentExtractDataPassports.logic';

// Canonical TD3 MRZ example from ICAO Doc 9303 Part 4.
const VALID_LINE_1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
const VALID_LINE_2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
const VALID_OCR_TEXT = `
  PASSPORT
  Republic of Utopia
  ${VALID_LINE_1}
  ${VALID_LINE_2}
`;

describe('computeCheckDigit', () => {
  it('computes the documented check digit for the ICAO example passport number', () => {
    expect(computeCheckDigit('L898902C3')).toBe(6);
  });

  it('computes the documented check digit for the ICAO example date of birth', () => {
    expect(computeCheckDigit('740812')).toBe(2);
  });

  it('treats filler characters as zero value', () => {
    expect(computeCheckDigit('<<<')).toBe(0);
  });

  it('throws on invalid characters', () => {
    expect(() => computeCheckDigit('abc')).toThrow();
  });
});

describe('findMrzLines', () => {
  it('locates the two MRZ lines within noisy OCR text', () => {
    const lines = findMrzLines(VALID_OCR_TEXT);
    expect(lines).not.toBeNull();
    expect(lines).toEqual([VALID_LINE_1, VALID_LINE_2]);
  });

  it('returns null when fewer than two MRZ-shaped lines are present', () => {
    const lines = findMrzLines(`Some random document\n${VALID_LINE_1}\nNo second MRZ line here`);
    expect(lines).toBeNull();
  });

  it('returns null for empty text', () => {
    expect(findMrzLines('')).toBeNull();
  });

  it('is case-insensitive and tolerant of surrounding whitespace', () => {
    const lowerCaseText = `${VALID_LINE_1.toLowerCase()}\n  ${VALID_LINE_2.toLowerCase()}  `;
    expect(findMrzLines(lowerCaseText)).toEqual([VALID_LINE_1, VALID_LINE_2]);
  });
});

describe('parseTd3Mrz', () => {
  it('parses a valid MRZ pair into structured passport data', () => {
    const result = parseTd3Mrz(VALID_LINE_1, VALID_LINE_2);
    expect(result.success).toBe(true);
    expect(result.issues).toHaveLength(0);
    const data = result.data as ExtractedPassportData;
    expect(data.documentType).toBe('P<');
    expect(data.issuingCountry).toBe('UTO');
    expect(data.surname).toBe('ERIKSSON');
    expect(data.givenNames).toBe('ANNA MARIA');
    expect(data.passportNumber).toBe('L898902C3');
    expect(data.nationality).toBe('UTO');
    expect(data.dateOfBirth).toBe('1974-08-12');
    expect(data.sex).toBe('F');
    expect(data.expiryDate).toBe('2012-04-15');
    expect(data.personalNumber).toBe('ZE184226B');
  });

  it('rejects lines with an incorrect length', () => {
    const result = parseTd3Mrz('TOO_SHORT', VALID_LINE_2);
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.issues.some(issue => issue.field === 'line1')).toBe(true);
  });

  it('rejects lines containing illegal characters', () => {
    const invalidLine1 = VALID_LINE_1.slice(0, -1) + '!';
    const result = parseTd3Mrz(invalidLine1, VALID_LINE_2);
    expect(result.success).toBe(false);
    expect(result.issues.some(issue => issue.field === 'line1')).toBe(true);
  });

  it('detects a corrupted passport number check digit', () => {
    // Flip the passport number check digit (position 9 of line 2) from '6' to '1'.
    const corruptedLine2 = `${VALID_LINE_2.slice(0, 9)}1${VALID_LINE_2.slice(10)}`;
    const result = parseTd3Mrz(VALID_LINE_1, corruptedLine2);
    expect(result.success).toBe(false);
    expect(result.issues.some(issue => issue.field === 'passportNumber')).toBe(true);
  });

  it('detects a corrupted composite check digit', () => {
    const corruptedLine2 = `${VALID_LINE_2.slice(0, 43)}9`;
    const result = parseTd3Mrz(VALID_LINE_1, corruptedLine2);
    expect(result.success).toBe(false);
    expect(result.issues.some(issue => issue.field === 'composite')).toBe(true);
  });

  it('reports an invalid date of birth as an issue and fails extraction', () => {
    // Replace date-of-birth digits (positions 13-19 of line 2) with an invalid month "13".
    const corruptedLine2 = `${VALID_LINE_2.slice(0, 13)}740813${VALID_LINE_2.slice(19)}`;
    const result = parseTd3Mrz(VALID_LINE_1, corruptedLine2);
    expect(result.success).toBe(false);
    expect(result.issues.some(issue => issue.field === 'dateOfBirth')).toBe(true);
  });

  it('is case-insensitive with respect to input casing', () => {
    const result = parseTd3Mrz(VALID_LINE_1.toLowerCase(), VALID_LINE_2.toLowerCase());
    expect(result.success).toBe(true);
  });

  it('returns null personalNumber when the field is entirely filler', () => {
    // Rebuild a valid MRZ line 2 with an empty personal number field, recomputing
    // every affected check digit (personal number and composite) so the fixture
    // remains internally consistent per ICAO 9303.
    const passportNumberRaw = VALID_LINE_2.slice(0, 9);
    const passportCheck = String(computeCheckDigit(passportNumberRaw));
    const dob = VALID_LINE_2.slice(13, 19);
    const dobCheck = String(computeCheckDigit(dob));
    const expiry = VALID_LINE_2.slice(21, 27);
    const expiryCheck = String(computeCheckDigit(expiry));
    const personalNumberRaw = '<'.repeat(14);
    const personalCheck = String(computeCheckDigit(personalNumberRaw));
    const composite =
      passportNumberRaw +
      passportCheck +
      dob +
      dobCheck +
      expiry +
      expiryCheck +
      personalNumberRaw +
      personalCheck;
    const compositeCheck = String(computeCheckDigit(composite));
    const rebuiltLine2 =
      passportNumberRaw +
      passportCheck +
      VALID_LINE_2.slice(10, 13) +
      dob +
      dobCheck +
      VALID_LINE_2.slice(20, 21) +
      expiry +
      expiryCheck +
      personalNumberRaw +
      personalCheck +
      compositeCheck;
    expect(rebuiltLine2).toHaveLength(44);
    const result = parseTd3Mrz(VALID_LINE_1, rebuiltLine2);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.personalNumber).toBeNull();
    }
  });
});

describe('extractPassportDataFromOcrText', () => {
  it('extracts passport data end-to-end from raw OCR text', () => {
    const result = extractPassportDataFromOcrText(VALID_OCR_TEXT);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.passportNumber).toBe('L898902C3');
      expect(result.data.surname).toBe('ERIKSSON');
    }
  });

  it('fails with an "mrz" issue when no MRZ can be located', () => {
    const result = extractPassportDataFromOcrText(
      'This document has no machine readable zone at all.'
    );
    expect(result.success).toBe(false);
    expect(result.issues).toEqual([
      {
        field: 'mrz',
        message: 'Could not locate two 44-character MRZ lines in the provided OCR text',
      },
    ]);
  });
});

describe('isPassportExpired', () => {
  const baseData: ExtractedPassportData = {
    documentType: 'P<',
    issuingCountry: 'UTO',
    surname: 'ERIKSSON',
    givenNames: 'ANNA MARIA',
    passportNumber: 'L898902C3',
    nationality: 'UTO',
    dateOfBirth: '1974-08-12',
    sex: 'F',
    expiryDate: '2012-04-15',
    personalNumber: 'ZE184226B',
  };

  it('returns true when the reference date is after the expiry date', () => {
    expect(isPassportExpired(baseData, new Date('2020-01-01T00:00:00.000Z'))).toBe(true);
  });

  it('returns false when the reference date is before the expiry date', () => {
    expect(isPassportExpired(baseData, new Date('2000-01-01T00:00:00.000Z'))).toBe(false);
  });
});
