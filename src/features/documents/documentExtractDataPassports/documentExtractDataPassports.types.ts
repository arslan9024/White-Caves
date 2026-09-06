/**
 * Types for the "documentExtractDataPassports" feature.
 *
 * This module defines the strict TypeScript contracts used to represent
 * the raw and normalized data extracted from a passport document (e.g.
 * via OCR / MRZ parsing), along with the extraction request/response
 * envelopes and error taxonomy used by the extraction pipeline.
 */

/** ISO 3166-1 alpha-3 country code, e.g. "ARE", "GBR", "USA". */
export type Iso3CountryCode = string;

/** Passport document sex/gender marker as printed on the document. */
export type PassportSex = 'M' | 'F' | 'X' | 'UNSPECIFIED';

/** Supported MRZ (Machine Readable Zone) formats for passports. */
export type MrzFormat = 'TD1' | 'TD2' | 'TD3';

/** Confidence level bucket derived from OCR/extraction engine scores. */
export type ExtractionConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * A single extracted field paired with the engine's confidence score.
 * `value` is `null` when the field could not be read at all.
 */
export interface ExtractedField<TValue> {
  readonly value: TValue | null;
  /** Normalized confidence score between 0 and 1 (inclusive). */
  readonly confidence: number;
  readonly confidenceLevel: ExtractionConfidenceLevel;
}

/** Structured biographical + document data extracted from a passport. */
export interface PassportExtractedData {
  readonly documentNumber: ExtractedField<string>;
  readonly surname: ExtractedField<string>;
  readonly givenNames: ExtractedField<string>;
  readonly nationality: ExtractedField<Iso3CountryCode>;
  readonly issuingCountry: ExtractedField<Iso3CountryCode>;
  readonly dateOfBirth: ExtractedField<string>;
  readonly dateOfExpiry: ExtractedField<string>;
  readonly dateOfIssue: ExtractedField<string>;
  readonly sex: ExtractedField<PassportSex>;
  readonly mrzLines: ExtractedField<readonly string[]>;
  readonly mrzFormat: ExtractedField<MrzFormat>;
}

/** Identifies the source of the raw document image/bytes being processed. */
export type PassportSourceType = 'UPLOAD' | 'SCAN' | 'CAMERA_CAPTURE' | 'API_INGEST';

/** Input payload requesting extraction of data from a passport document. */
export interface PassportExtractionRequest {
  readonly documentId: string;
  readonly sourceType: PassportSourceType;
  /** Base64-encoded or URI reference to the passport image; never raw binary. */
  readonly imageReference: string;
  readonly requestedAt: string;
}

/** Machine-readable error codes for passport extraction failures. */
export type PassportExtractionErrorCode =
  | 'IMAGE_UNREADABLE'
  | 'MRZ_NOT_FOUND'
  | 'MRZ_CHECKSUM_FAILED'
  | 'UNSUPPORTED_DOCUMENT_TYPE'
  | 'ENGINE_TIMEOUT'
  | 'UNKNOWN_ERROR';

export interface PassportExtractionError {
  readonly code: PassportExtractionErrorCode;
  readonly message: string;
}

/** Discriminated union result of a passport extraction attempt. */
export type PassportExtractionResult =
  | {
      readonly status: 'SUCCESS';
      readonly documentId: string;
      readonly data: PassportExtractedData;
      readonly completedAt: string;
    }
  | {
      readonly status: 'FAILED';
      readonly documentId: string;
      readonly error: PassportExtractionError;
      readonly completedAt: string;
    };

/** Type guard narrowing a {@link PassportExtractionResult} to its success variant. */
export function isPassportExtractionSuccess(
  result: PassportExtractionResult
): result is Extract<PassportExtractionResult, { status: 'SUCCESS' }> {
  return result.status === 'SUCCESS';
}

/** Type guard narrowing a {@link PassportExtractionResult} to its failure variant. */
export function isPassportExtractionFailure(
  result: PassportExtractionResult
): result is Extract<PassportExtractionResult, { status: 'FAILED' }> {
  return result.status === 'FAILED';
}

/**
 * Derives a coarse confidence level bucket from a raw numeric confidence
 * score in the [0, 1] range. Values outside the range are clamped.
 */
export function toConfidenceLevel(score: number): ExtractionConfidenceLevel {
  const clamped = Math.min(1, Math.max(0, score));
  if (clamped >= 0.85) {
    return 'HIGH';
  }
  if (clamped >= 0.5) {
    return 'MEDIUM';
  }
  return 'LOW';
}
