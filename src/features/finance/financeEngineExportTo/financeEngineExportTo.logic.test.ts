import { describe, expect, it } from 'vitest';
import {
  FinanceExportError,
  deriveColumns,
  exportFinanceEngineTo,
  getSupportedFinanceExportFormats,
  toCsv,
  toJson,
  toNdjson,
  type FinanceExportRecord,
} from './financeEngineExportTo.logic';

const sampleRecords: FinanceExportRecord[] = [
  { id: 1, category: 'Rent', amount: 1200.5, notes: 'Monthly rent' },
  { id: 2, category: 'Utilities', amount: 85, notes: null },
  { id: 3, category: 'Payroll, Q1', amount: 4300, notes: 'Includes "bonus"' },
];

describe('deriveColumns', () => {
  it('derives a de-duplicated, first-seen-order column list', () => {
    const records: FinanceExportRecord[] = [
      { a: 1, b: 2 },
      { b: 3, c: 4 },
    ];
    expect(deriveColumns(records)).toEqual(['a', 'b', 'c']);
  });

  it('returns an empty array for empty input', () => {
    expect(deriveColumns([])).toEqual([]);
  });
});

describe('toJson', () => {
  it('serializes records to a compact JSON array by default', () => {
    const result = toJson(sampleRecords, false);
    expect(result).toBe(JSON.stringify(sampleRecords));
    expect(JSON.parse(result)).toHaveLength(3);
  });

  it('serializes records with indentation when pretty is true', () => {
    const result = toJson(sampleRecords, true);
    expect(result).toContain('\n');
    expect(JSON.parse(result)).toEqual(sampleRecords);
  });
});

describe('toNdjson', () => {
  it('produces one JSON object per line', () => {
    const result = toNdjson(sampleRecords);
    const lines = result.split('\n');
    expect(lines).toHaveLength(sampleRecords.length);
    lines.forEach((line, index) => {
      expect(JSON.parse(line)).toEqual(sampleRecords[index]);
    });
  });
});

describe('toCsv', () => {
  it('renders a header row and quotes cells containing the delimiter or quotes', () => {
    const columns = ['id', 'category', 'amount', 'notes'];
    const csv = toCsv(sampleRecords, columns, ',', true);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('id,category,amount,notes');
    expect(lines).toHaveLength(sampleRecords.length + 1);
    // Value containing a comma must be quoted.
    expect(lines[3]).toContain('"Payroll, Q1"');
    // Value containing double quotes must escape them by doubling.
    expect(lines[3]).toContain('"Includes ""bonus"""');
  });

  it('renders null/undefined as empty cells', () => {
    const csv = toCsv(sampleRecords, ['id', 'notes'], ',', true);
    const lines = csv.split('\r\n');
    expect(lines[2]).toBe('2,');
  });

  it('omits the header row when includeHeader is false', () => {
    const csv = toCsv(sampleRecords, ['id'], ',', false);
    expect(csv.split('\r\n')).toHaveLength(sampleRecords.length);
    expect(csv.startsWith('id')).toBe(false);
  });
});

describe('exportFinanceEngineTo', () => {
  it('defaults to JSON format when no options are given', () => {
    const result = exportFinanceEngineTo(sampleRecords);
    expect(result.format).toBe('json');
    expect(result.mimeType).toBe('application/json');
    expect(result.fileExtension).toBe('json');
    expect(result.recordCount).toBe(sampleRecords.length);
    expect(JSON.parse(result.content)).toEqual(sampleRecords);
  });

  it('exports to CSV using derived columns when none are provided', () => {
    const result = exportFinanceEngineTo(sampleRecords, { format: 'csv' });
    expect(result.format).toBe('csv');
    expect(result.mimeType).toBe('text/csv');
    const [header] = result.content.split('\r\n');
    expect(header.split(',')).toEqual(['id', 'category', 'amount', 'notes']);
  });

  it('exports to CSV using explicit column order and a custom delimiter', () => {
    const result = exportFinanceEngineTo(sampleRecords, {
      format: 'csv',
      columns: ['category', 'amount'],
      delimiter: ';',
    });
    const [header, firstRow] = result.content.split('\r\n');
    expect(header).toBe('category;amount');
    expect(firstRow).toBe('Rent;1200.5');
  });

  it('exports to NDJSON', () => {
    const result = exportFinanceEngineTo(sampleRecords, { format: 'ndjson' });
    expect(result.format).toBe('ndjson');
    expect(result.mimeType).toBe('application/x-ndjson');
    expect(result.content.split('\n')).toHaveLength(sampleRecords.length);
  });

  it('produces empty content for an empty record set without throwing', () => {
    const result = exportFinanceEngineTo([], { format: 'csv' });
    expect(result.recordCount).toBe(0);
    expect(result.content).toBe('');
  });

  it('throws FinanceExportError for an unsupported format', () => {
    expect(() =>
      exportFinanceEngineTo(sampleRecords, {
        format: 'xml' as unknown as 'csv' | 'json' | 'ndjson',
      })
    ).toThrow(FinanceExportError);
  });

  it('throws FinanceExportError when records is not an array', () => {
    expect(() => exportFinanceEngineTo(null as unknown as FinanceExportRecord[])).toThrow(
      FinanceExportError
    );
  });

  it('throws FinanceExportError when a record is not a plain object', () => {
    expect(() => exportFinanceEngineTo([42 as unknown as FinanceExportRecord])).toThrow(
      FinanceExportError
    );
  });

  it('throws FinanceExportError when an empty delimiter is supplied', () => {
    expect(() => exportFinanceEngineTo(sampleRecords, { format: 'csv', delimiter: '' })).toThrow(
      FinanceExportError
    );
  });

  it('throws FinanceExportError when explicit columns array is empty', () => {
    expect(() => exportFinanceEngineTo(sampleRecords, { format: 'csv', columns: [] })).toThrow(
      FinanceExportError
    );
  });

  it('does not mutate the input records array', () => {
    const original = [...sampleRecords];
    exportFinanceEngineTo(sampleRecords, { format: 'csv' });
    expect(sampleRecords).toEqual(original);
  });
});

describe('getSupportedFinanceExportFormats', () => {
  it('lists csv, json, and ndjson', () => {
    expect(getSupportedFinanceExportFormats()).toEqual(['csv', 'json', 'ndjson']);
  });
});
