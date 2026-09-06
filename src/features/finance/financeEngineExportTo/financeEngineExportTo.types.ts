/**
 * financeEngineExportTo.types.ts
 *
 * Types and pure runtime helpers implementing the public `exportTo` contract
 * for the Finance Engine's export capability, as documented in
 * `financeEngineExportTo.contract.md`. This module serializes normalized
 * finance records (ledger snapshots, computed valuations, reconciliation
 * reports) into consumer-facing formats (JSON, CSV) without exposing
 * internal engine state.
 *
 * Design decisions:
 * - The contract is the source of truth for shapes/invariants; where this
 *   directory's other modules diverge, this file follows the contract.
 * - `exportTo` is intentionally pure and I/O-free: no filesystem, no
 *   network, no ambient clock/env reliance, so output is deterministic and
 *   reusable in any runtime (browser or Node).
 * - Metadata is fully omitted (not merely emptied) from the serialized
 *   payload whenever `includeMetadata` is falsy, per invariant #5.
 * - Any malformed record aborts the whole export with `ok: false` and a
 *   populated `errors` array; no partially-corrupt `payload` is ever
 *   returned, per invariant #3.
 * - Empty `records` input is valid: JSON yields `"[]"`, CSV yields a
 *   header-only row (documented choice per the contract's README note).
 */

/** Supported export target formats. No other literal values are valid. */
export type ExportFormat = 'json' | 'csv';

/** A single normalized finance record ready for export. */
export interface FinanceExportRecord {
  readonly id: string;
  readonly category: string;
  /** Amount in the smallest denomination consistent with `currency` (e.g. cents for USD). */
  readonly amount: number;
  readonly currency: string;
  /** ISO 8601 timestamp string. */
  readonly occurredAt: string;
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
}

/** Options controlling how an export is produced. */
export interface FinanceExportOptions {
  readonly format: ExportFormat;
  /** When falsy/omitted, `metadata` is entirely excluded from the payload. Defaults to false. */
  readonly includeMetadata?: boolean;
  /** CSV-only delimiter. Defaults to ','. Ignored for JSON. */
  readonly delimiter?: string;
}

/** Result of an export attempt. */
export interface FinanceExportResult {
  readonly ok: boolean;
  readonly format: ExportFormat;
  readonly payload?: string;
  readonly recordCount: number;
  readonly errors?: ReadonlyArray<string>;
}

const SUPPORTED_EXPORT_FORMATS: readonly ExportFormat[] = ['json', 'csv'];

const DEFAULT_CSV_DELIMITER = ',';

/** Matches ISO 8601 date-time strings with an explicit offset or 'Z'. */
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/** Type guard confirming a value is one of the supported {@link ExportFormat} literals. */
export function isExportFormat(value: unknown): value is ExportFormat {
  return (
    typeof value === 'string' && (SUPPORTED_EXPORT_FORMATS as readonly string[]).includes(value)
  );
}

function isPlainMetadataValue(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

/** Type guard for a well-formed {@link FinanceExportRecord} shape (structural only). */
export function isFinanceExportRecord(value: unknown): value is FinanceExportRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;

  if (typeof candidate.id !== 'string' || candidate.id.trim().length === 0) {
    return false;
  }
  if (typeof candidate.category !== 'string' || candidate.category.trim().length === 0) {
    return false;
  }
  if (typeof candidate.amount !== 'number' || !Number.isFinite(candidate.amount)) {
    return false;
  }
  if (typeof candidate.currency !== 'string' || candidate.currency.trim().length === 0) {
    return false;
  }
  if (typeof candidate.occurredAt !== 'string') {
    return false;
  }
  if (candidate.metadata !== undefined) {
    if (
      typeof candidate.metadata !== 'object' ||
      candidate.metadata === null ||
      Array.isArray(candidate.metadata)
    ) {
      return false;
    }
    for (const metadataValue of Object.values(candidate.metadata as Record<string, unknown>)) {
      if (!isPlainMetadataValue(metadataValue)) {
        return false;
      }
    }
  }
  return true;
}

/** Validates that a string is a well-formed, parseable ISO 8601 timestamp. */
export function isValidOccurredAt(value: string): boolean {
  return ISO_8601_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * Validates business rules for a single {@link FinanceExportRecord} beyond
 * structural shape checks, returning human-readable error messages
 * (empty array when the record is valid).
 */
export function validateFinanceExportRecord(record: FinanceExportRecord, index: number): string[] {
  const errors: string[] = [];

  if (!record.id || record.id.trim().length === 0) {
    errors.push(`Record at index ${index} is missing a non-empty "id".`);
  }
  if (!record.category || record.category.trim().length === 0) {
    errors.push(`Record at index ${index} is missing a non-empty "category".`);
  }
  if (!Number.isFinite(record.amount)) {
    errors.push(`Record at index ${index} has a non-finite "amount".`);
  }
  if (!record.currency || record.currency.trim().length === 0) {
    errors.push(`Record at index ${index} is missing a non-empty "currency".`);
  }
  if (!isValidOccurredAt(record.occurredAt)) {
    errors.push(
      `Record at index ${index} has an invalid "occurredAt" ISO 8601 timestamp: "${record.occurredAt}".`
    );
  }

  return errors;
}

/** Escapes a single CSV field per RFC 4180 (quotes delimiter/quote/newline occurrences). */
function escapeCsvField(value: string, delimiter: string): string {
  const needsQuoting =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r');
  if (!needsQuoting) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

function serializeMetadata(
  metadata: Readonly<Record<string, string | number | boolean>> | undefined
): string {
  if (!metadata) {
    return '';
  }
  return JSON.stringify(metadata);
}

function toCsvPayload(
  records: readonly FinanceExportRecord[],
  includeMetadata: boolean,
  delimiter: string
): string {
  const baseColumns = ['id', 'category', 'amount', 'currency', 'occurredAt'];
  const columns = includeMetadata ? [...baseColumns, 'metadata'] : baseColumns;

  const lines: string[] = [
    columns.map(column => escapeCsvField(column, delimiter)).join(delimiter),
  ];

  for (const record of records) {
    const row = [
      record.id,
      record.category,
      String(record.amount),
      record.currency,
      record.occurredAt,
    ];
    if (includeMetadata) {
      row.push(serializeMetadata(record.metadata));
    }
    lines.push(row.map(field => escapeCsvField(field, delimiter)).join(delimiter));
  }

  return lines.join('\r\n');
}

function toJsonPayload(records: readonly FinanceExportRecord[], includeMetadata: boolean): string {
  const sanitized = records.map(record => {
    if (includeMetadata) {
      return record;
    }
    const { metadata: _metadata, ...withoutMetadata } = record;
    return withoutMetadata;
  });
  return JSON.stringify(sanitized);
}

/**
 * Serializes finance export records per the financeEngineExportTo contract.
 *
 * Pure and deterministic: never mutates `records`, performs no I/O, and
 * given identical `records`/`options` always returns a byte-identical
 * `payload`. Returns `ok: false` with a populated `errors` array (and no
 * `payload`) if the format is unsupported, any record fails validation, or
 * options are malformed — never a partially-corrupt payload.
 */
export function exportTo(
  records: ReadonlyArray<FinanceExportRecord>,
  options: FinanceExportOptions
): FinanceExportResult {
  const format = options.format;

  if (!isExportFormat(format)) {
    return {
      ok: false,
      format: format as ExportFormat,
      recordCount: 0,
      errors: [
        `Unsupported export format "${String(format)}". Supported formats: ${SUPPORTED_EXPORT_FORMATS.join(', ')}.`,
      ],
    };
  }

  const errors: string[] = [];
  records.forEach((record, index) => {
    if (!isFinanceExportRecord(record)) {
      errors.push(`Record at index ${index} does not conform to the FinanceExportRecord shape.`);
      return;
    }
    errors.push(...validateFinanceExportRecord(record, index));
  });

  if (errors.length > 0) {
    return { ok: false, format, recordCount: records.length, errors };
  }

  const includeMetadata = options.includeMetadata ?? false;
  const delimiter = options.delimiter ?? DEFAULT_CSV_DELIMITER;

  if (typeof delimiter !== 'string' || delimiter.length === 0) {
    return {
      ok: false,
      format,
      recordCount: records.length,
      errors: ['CSV delimiter must be a non-empty string.'],
    };
  }

  const payload =
    format === 'csv'
      ? toCsvPayload(records, includeMetadata, delimiter)
      : toJsonPayload(records, includeMetadata);

  return { ok: true, format, payload, recordCount: records.length };
}

/** Returns the list of formats supported by {@link exportTo}. */
export function getSupportedExportFormats(): readonly ExportFormat[] {
  return SUPPORTED_EXPORT_FORMATS;
}
