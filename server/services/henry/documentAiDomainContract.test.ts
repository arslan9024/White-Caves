import { describe, expect, it } from 'vitest';
import {
  isDocumentAiExtractionContract,
  validateDocumentAiExtractionContract,
} from './documentAiDomainContract';

describe('documentAiDomainContract', () => {
  it('accepts a valid passport extraction contract', () => {
    const payload = {
      documentType: 'passport',
      extractedAt: '2026-09-06T00:00:00.000Z',
      confidenceScore: 0.99,
      fields: {
        passportNumber: 'DR0760143',
        fullName: 'Arslan Malik',
      },
    };

    expect(validateDocumentAiExtractionContract(payload)).toEqual([]);
    expect(isDocumentAiExtractionContract(payload)).toBe(true);
  });

  it('accepts a valid title deed extraction contract', () => {
    const payload = {
      documentType: 'title_deed',
      extractedAt: '2026-09-06T00:00:00.000Z',
      confidenceScore: 0.95,
      fields: {
        certificateNumber: '140764/2023',
        ownerName: 'AKRAM DIB NEHME',
      },
    };

    expect(validateDocumentAiExtractionContract(payload)).toEqual([]);
  });

  it('accepts a valid contract extraction contract', () => {
    const payload = {
      documentType: 'contract',
      extractedAt: '2026-09-06T00:00:00.000Z',
      confidenceScore: 0.93,
      fields: {
        contractDate: '2026-07-10',
        landlordName: 'SANIT SINGH NAGPAL',
        tenantName: 'KESHIVANI MAYADEVAN',
      },
    };

    expect(validateDocumentAiExtractionContract(payload)).toEqual([]);
  });

  it('returns issues for invalid document type and metadata', () => {
    const issues = validateDocumentAiExtractionContract({
      documentType: 'visa',
      extractedAt: 'not-a-date',
      confidenceScore: 2,
      fields: {},
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'documentType' }),
        expect.objectContaining({ path: 'extractedAt' }),
        expect.objectContaining({ path: 'confidenceScore' }),
      ])
    );
  });

  it('returns issues when required fields for a document type are missing', () => {
    const issues = validateDocumentAiExtractionContract({
      documentType: 'passport',
      extractedAt: '2026-09-06T00:00:00.000Z',
      confidenceScore: 0.8,
      fields: {
        passportNumber: ' ',
      },
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'fields.passportNumber' }),
        expect.objectContaining({ path: 'fields.fullName' }),
      ])
    );
    expect(
      isDocumentAiExtractionContract({
        documentType: 'passport',
        extractedAt: '2026-09-06T00:00:00.000Z',
        confidenceScore: 0.8,
        fields: {
          passportNumber: ' ',
        },
      })
    ).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(validateDocumentAiExtractionContract(null)).toEqual([
      { path: 'input', message: 'must be an object' },
    ]);
  });
});
