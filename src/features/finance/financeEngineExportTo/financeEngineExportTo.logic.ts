/**
 * financeEngineExportTo.logic.ts
 *
 * Pure, dependency-free logic for exporting finance engine records to
 * common interchange formats (CSV, JSON, NDJSON). This module intentionally
 * has no I/O side effects (no filesystem, no network) so it can be reused
 * both in browser and Node contexts; callers are responsible for writing
 * the returned string/bytes wherever they need to go.
 */

/** A single finance record that can be exported. Keys map to column names. */
export interface FinanceExportRecord {
  [key: string]: string | number | boolean | null | undefined;
}

/** Supported export target formats. */
export type FinanceExportFormat = 'csv' | 'json' | 'ndjson';

/** Options controlling how the export is produced. */
export interface FinanceExportOptions {
  /** Target format. Defaults to 'json'. */
  format?: FinanceExportFormat;
  /**
   * Explicit column order for CSV/NDJSON-with-header style outputs.
   * When omitted, columns are derived from the union of keys across
   * all records, in first-seen order.
   */
  columns?: readonly string[];
  /** CSV delimiter. Defaults to ','. Ignored for non-CSV formats. */
  delimiter?: string;
  /** Whether to include a header row for CSV. Defaults to true. */
  includeHeader?: boolean;
  /** Pretty-print JSON output. Defaults to false (compact). Ignored for CSV/NDJSON. */
  pretty?: boolean;
}

/** Result of a successful export. */
export interface FinanceExportResult {
  format: FinanceExportFormat;
  /** The serialized export content. */
  content: string;
  /** Number of records that were exported. */
  recordCount: number;
  /** Suggested file extension (without the leading dot). */
  fileExtension: string;
  /** Suggested MIME type for the produced content. */
  mimeType: string;
}

/** Raised when export input or options are invalid. */
export class FinanceExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FinanceExportError';
  }
}

const SUPPORTED_FORMATS: readonly FinanceExportFormat[] = ['csv', 'json', 'ndjson'];

const MIME_TYPES: Record<FinanceExportFormat, string> = {
  csv: 'text/csv',
  json: 'application/json',
  ndjson: 'application/x-ndjson',
};

const FILE_EXTENSIONS: Record<FinanceExportFormat, string> = {
  csv: 'csv',
  json: 'json',
  ndjson: 'ndjson',
};

function isFinanceExportFormat(value: string): value is FinanceExportFormat {
  return (SUPPORTED_FORMATS as readonly string[]).includes(value);
}

function assertValidRecords(records: readonly FinanceExportRecord[]): void {
  if (!Array.isArray(records)) {
    throw new FinanceExportError('Export input must be an array of records.');
  }
  records.forEach((record, index) => {
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      throw new FinanceExportError(`Record at index ${index} must be a plain object.`);
    }
  });
}

/**
 * Derives an ordered, de-duplicated list of column names from a set of
 * records, preserving first-seen order.
 */
export function deriveColumns(records: readonly FinanceExportRecord[]): string[] {
  const seen = new Set<string>();
  const columns: string[] = [];
  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }
  return columns;
}

function formatCsvCell(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  const needsQuoting =
    stringValue.includes(delimiter) ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r');
  if (!needsQuoting) {
    return stringValue;
  }
  return `"${stringValue.replace(/"/g, '""')}"`;
}

/** Serializes records to a CSV string using the given columns/delimiter. */
export function toCsv(
  records: readonly FinanceExportRecord[],
  columns: readonly string[],
  delimiter: string,
  includeHeader: boolean
): string {
  const lines: string[] = [];
  if (includeHeader) {
    lines.push(columns.map(col => formatCsvCell(col, delimiter)).join(delimiter));
  }
  for (const record of records) {
    const row = columns.map(col => formatCsvCell(record[col], delimiter));
    lines.push(row.join(delimiter));
  }
  return lines.join('\r\n');
}

/** Serializes records to newline-delimited JSON. */
export function toNdjson(records: readonly FinanceExportRecord[]): string {
  return records.map(record => JSON.stringify(record)).join('\n');
}

/** Serializes records to a JSON array string. */
export function toJson(records: readonly FinanceExportRecord[], pretty: boolean): string {
  return pretty ? JSON.stringify(records, null, 2) : JSON.stringify(records);
}

const DEFAULT_OPTIONS: Required<Omit<FinanceExportOptions, 'columns'>> = {
  format: 'json',
  delimiter: ',',
  includeHeader: true,
  pretty: false,
};

/**
 * Exports an array of finance records into the requested format.
 *
 * Throws {@link FinanceExportError} when the input is malformed or the
 * requested format/options are invalid. Never mutates the input records.
 */
export function exportFinanceEngineTo(
  records: readonly FinanceExportRecord[],
  options: FinanceExportOptions = {}
): FinanceExportResult {
  assertValidRecords(records);

  const format = options.format ?? DEFAULT_OPTIONS.format;
  if (!isFinanceExportFormat(format)) {
    throw new FinanceExportError(
      `Unsupported export format "${format}". Supported formats: ${SUPPORTED_FORMATS.join(', ')}.`
    );
  }

  const delimiter = options.delimiter ?? DEFAULT_OPTIONS.delimiter;
  if (typeof delimiter !== 'string' || delimiter.length === 0) {
    throw new FinanceExportError('CSV delimiter must be a non-empty string.');
  }

  const includeHeader = options.includeHeader ?? DEFAULT_OPTIONS.includeHeader;
  const pretty = options.pretty ?? DEFAULT_OPTIONS.pretty;

  const columns = options.columns ? [...options.columns] : deriveColumns(records);
  if (options.columns && options.columns.length === 0) {
    throw new FinanceExportError('Explicit columns array must not be empty.');
  }

  let content: string;
  switch (format) {
    case 'csv':
      content = toCsv(records, columns, delimiter, includeHeader);
      break;
    case 'ndjson':
      content = toNdjson(records);
      break;
    case 'json':
    default:
      content = toJson(records, pretty);
      break;
  }

  return {
    format,
    content,
    recordCount: records.length,
    fileExtension: FILE_EXTENSIONS[format],
    mimeType: MIME_TYPES[format],
  };
}

/** Returns the list of formats supported by {@link exportFinanceEngineTo}. */
export function getSupportedFinanceExportFormats(): readonly FinanceExportFormat[] {
  return SUPPORTED_FORMATS;
}
