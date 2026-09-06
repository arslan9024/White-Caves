import { describe, expect, it } from 'vitest';
import {
  isPassportExtractionFailure,
  isPassportExtractionSuccess,
  toConfidenceLevel,
  type ExtractedField,
  type PassportExtractedData,
  type PassportExtractionResult,
} from './documentExtractDataPassports.types';

const highConfidenceField = <TValue>(value: TValue): ExtractedField<TValue> => ({
  value,
  confidence: 0.95,
  confidenceLevel: 'HIGH',
});

const buildExtractedData = (): PassportExtractedData => ({
  documentNumber: highConfidenceField('P1234567'),
  surname: highConfidenceField('DOE'),
  givenNames: highConfidenceField('JANE'),
  nationality: highConfidenceField('ARE'),
  issuingCountry: highConfidenceField('ARE'),
  dateOfBirth: highConfidenceField('1990-01-01'),
  dateOfExpiry: highConfidenceField('2030-01-01'),
  dateOfIssue: highConfidenceField('2020-01-01'),
  sex: highConfidenceField('F'),
  mrzLines: highConfidenceField([
    'P<AREDOE<<JANE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
    'P1234567<0ARE9001014F3001010<<<<<<<<<<<<<<06',
  ]),
  mrzFormat: highConfidenceField('TD3'),
});

describe('toConfidenceLevel', () => {
  it('returns HIGH for scores at or above 0.85', () => {
    expect(toConfidenceLevel(0.85)).toBe('HIGH');
    expect(toConfidenceLevel(1)).toBe('HIGH');
  });

  it('returns MEDIUM for scores between 0.5 (inclusive) and 0.85 (exclusive)', () => {
    expect(toConfidenceLevel(0.5)).toBe('MEDIUM');
    expect(toConfidenceLevel(0.84)).toBe('MEDIUM');
  });

  it('returns LOW for scores below 0.5', () => {
    expect(toConfidenceLevel(0.49)).toBe('LOW');
    expect(toConfidenceLevel(0)).toBe('LOW');
  });

  it('clamps out-of-range scores instead of throwing', () => {
    expect(toConfidenceLevel(-5)).toBe('LOW');
    expect(toConfidenceLevel(5)).toBe('HIGH');
  });
});

describe('isPassportExtractionSuccess / isPassportExtractionFailure', () => {
  it('narrows a SUCCESS result and exposes the extracted data', () => {
    const result: PassportExtractionResult = {
      status: 'SUCCESS',
      documentId: 'doc-1',
      data: buildExtractedData(),
      completedAt: '2024-01-01T00:00:00.000Z',
    };

    expect(isPassportExtractionSuccess(result)).toBe(true);
    expect(isPassportExtractionFailure(result)).toBe(false);

    if (isPassportExtractionSuccess(result)) {
      expect(result.data.documentNumber.value).toBe('P1234567');
      expect(result.data.mrzFormat.value).toBe('TD3');
    }
  });

  it('narrows a FAILED result and exposes the error details', () => {
    const result: PassportExtractionResult = {
      status: 'FAILED',
      documentId: 'doc-2',
      error: { code: 'MRZ_NOT_FOUND', message: 'Unable to locate MRZ region' },
      completedAt: '2024-01-01T00:00:00.000Z',
    };

    expect(isPassportExtractionFailure(result)).toBe(true);
    expect(isPassportExtractionSuccess(result)).toBe(false);

    if (isPassportExtractionFailure(result)) {
      expect(result.error.code).toBe('MRZ_NOT_FOUND');
      expect(result.error.message).toContain('MRZ');
    }
  });

  it('treats null-valued fields as a valid unreadable-field representation', () => {
    const data = buildExtractedData();
    const unreadable: PassportExtractedData = {
      ...data,
      documentNumber: { value: null, confidence: 0, confidenceLevel: 'LOW' },
    };

    expect(unreadable.documentNumber.value).toBeNull();
    expect(unreadable.documentNumber.confidenceLevel).toBe('LOW');
  });
});
