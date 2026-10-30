import { describe, it, expect } from 'vitest';
import {
  formatMrzDate,
  extractMrzLines,
  cleanMrzField,
  parseMrzPayload,
} from './mrzExtractorService';

describe('mrzExtractorService', () => {
  it('formats MRZ YYMMDD date with century heuristics', () => {
    // 901015 -> 1990-10-15 (birth date)
    expect(formatMrzDate('901015', false)).toBe('1990-10-15');
    // 301015 -> 2030-10-15 (expiry date)
    expect(formatMrzDate('301015', true)).toBe('2030-10-15');
  });

  it('extracts and parses TD1 MRZ lines (Emirates ID back)', () => {
    const rawLines = [
      'I<ARE123456789<784199012345671',
      '9010153M3010158ARE<<<<<<<<<<<4',
      'AL<MANSOORI<<AHMED<BIN<MOHAMED',
    ];

    const parsed = parseMrzPayload(rawLines);
    expect(parsed).not.toBeNull();
    expect(parsed?.documentType).toBe('TD1');
    expect(parsed?.issuingState).toBe('ARE');
    expect(parsed?.birthDate).toBe('1990-10-15');
    expect(parsed?.sex).toBe('M');
    expect(parsed?.expiryDate).toBe('2030-10-15');
    expect(parsed?.nationality).toBe('ARE');
    expect(parsed?.lastName).toBe('AL MANSOORI');
    expect(parsed?.firstName).toBe('AHMED BIN MOHAMED');
  });

  it('extracts and parses TD3 MRZ lines (Passports)', () => {
    const rawLines = [
      'P<AREAL<MANSOORI<<AHMED<<<<<<<<<<<<<<<<<<<<<',
      'N1234567<5ARE9010153M3010158<<<<<<<<<<<<<<02',
    ];

    const parsed = parseMrzPayload(rawLines);
    expect(parsed).not.toBeNull();
    expect(parsed?.documentType).toBe('TD3');
    expect(parsed?.documentNumber).toBe('N1234567');
    expect(parsed?.lastName).toBe('AL MANSOORI');
    expect(parsed?.firstName).toBe('AHMED');
  });
});

