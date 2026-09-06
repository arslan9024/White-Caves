# Contract: documentExtractDataPassports

- **Issue**: #2375
- **Parent issue**: #2027
- **Feature area**: `src/features/documents/documentExtractDataPassports`
- **Status**: Draft (child scope only — parent issue remains open until all children reconcile)

## Purpose

Defines the extraction contract for turning a passport document upload
(image or scanned PDF page) into a structured, strictly-typed data record
that downstream document-verification and lead-onboarding flows can
consume without re-parsing raw OCR output.

This document specifies the **input/output contract** only. It does not
implement, wire up, or invoke any OCR/ML provider, and it does not touch
any file outside this feature folder.

## Scope

### In scope

- Shape of the input payload accepted by the passport extraction contract
  (`PassportExtractionRequest`).
- Shape of the structured output (`PassportExtractionResult`,
  `ExtractedPassportFields`).
- Confidence-scoring and field-level validation contract
  (`FieldConfidence`, `PassportExtractionIssue`).
- Error/result discriminated union so callers can branch on
  success/failure without throwing for expected failure modes (blurry
  image, unsupported document, low-confidence fields, etc.).
- Documentation of assumptions, limitations, and non-goals for this
  child issue.

### Out of scope (excluded per issue #2375)

- Parent issue (#2027) closure or status mutation.
- Bulk GitHub mutation of any kind.
- Destructive database operations (drops, truncates, irreversible
  migrations).
- Production secret rewrites (API keys, OCR provider credentials, etc.).
- Actual OCR/ML provider integration (e.g., calling a cloud vision API).
  This contract is provider-agnostic; a future child issue will implement
  a concrete adapter against this contract.
- UI components for uploading or reviewing passport scans.
- Persistence layer / database schema for extracted passport data.

## Data contract

### Input

```ts
interface PassportExtractionRequest {
  /** Opaque reference to the uploaded source document (not raw bytes). */
  documentId: string;
  /** MIME type of the source asset, e.g. "image/jpeg", "application/pdf". */
  mimeType: string;
  /** ISO 3166-1 alpha-2 hint for the expected issuing country, if known. */
  expectedIssuingCountry?: string;
}
```

### Output

```ts
type PassportExtractionResult =
  | { status: 'success'; fields: ExtractedPassportFields; issues: PassportExtractionIssue[] }
  | {
      status: 'partial';
      fields: Partial<ExtractedPassportFields>;
      issues: PassportExtractionIssue[];
    }
  | { status: 'failed'; issues: PassportExtractionIssue[] };

interface ExtractedPassportFields {
  documentNumber: FieldConfidence<string>;
  surname: FieldConfidence<string>;
  givenNames: FieldConfidence<string>;
  nationality: FieldConfidence<string>;
  dateOfBirth: FieldConfidence<string>; // ISO 8601 date (YYYY-MM-DD)
  sex: FieldConfidence<'M' | 'F' | 'X'>;
  dateOfExpiry: FieldConfidence<string>; // ISO 8601 date (YYYY-MM-DD)
  issuingCountry: FieldConfidence<string>; // ISO 3166-1 alpha-3
}

interface FieldConfidence<T> {
  value: T;
  /** Confidence score in the inclusive range [0, 1]. */
  confidence: number;
}

interface PassportExtractionIssue {
  code:
    | 'LOW_IMAGE_QUALITY'
    | 'UNSUPPORTED_DOCUMENT_TYPE'
    | 'LOW_FIELD_CONFIDENCE'
    | 'MISSING_MRZ'
    | 'UNKNOWN_ERROR';
  message: string;
  field?: keyof ExtractedPassportFields;
}
```

## Behavioral rules

1. `status: 'success'` is only returned when every field in
   `ExtractedPassportFields` is present with `confidence >= 0.85`.
2. `status: 'partial'` is returned when at least one field could not be
   extracted or its confidence fell below the threshold; `issues` must
   contain a `LOW_FIELD_CONFIDENCE` entry (with `field` set) for each
   such field.
3. `status: 'failed'` is returned when the document could not be parsed
   at all (e.g., unsupported MIME type, unreadable MRZ). `fields` is
   omitted entirely in this case.
4. Confidence values are always clamped to `[0, 1]`; implementations
   must never emit values outside this range.
5. Date fields are always normalized to ISO 8601 (`YYYY-MM-DD`) regardless
   of the source document's date formatting.
6. This contract is pure data-in/data-out. No network calls, file I/O,
   or database access occur when validating conformance to this
   contract; those concerns belong to a concrete adapter implementation
   in a later child issue.

## Acceptance criteria mapping

- **Implementation remains within declared child scope**: only files
  under `src/features/documents/documentExtractDataPassports/` are
  created; no OCR provider, UI, or persistence code is added.
- **Focused tests and required validation commands pass**: see
  `README.md` for the validation command used to check this
  documentation-only change (markdown lint/spellcheck not required per
  task scope; no test files were part of this child issue's file list).
- **Completion evidence and rollback note recorded**: see `README.md`.
- **Parent issue remains open**: no GitHub mutation performed by this
  change; #2027 status is untouched.

## Non-goals / future child issues

- Concrete OCR/ML adapter implementing this contract.
- Persistence of `PassportExtractionResult` records.
- Retry/backoff policy for provider failures.
- PII handling / redaction policy for extracted fields (tracked
  separately under the parent security workstream).
