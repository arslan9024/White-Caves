import { describe, expect, it } from 'vitest';

import {
  exportTo,
  getSupportedExportFormats,
  isExportFormat,
  isFinanceExportRecord,
  isValidOccurredAt,
  validateFinanceExportRecord,
  type FinanceExportRecord,
} from './financeEngineExportTo.types';

const baseRecord: FinanceExportRecord = {
  id: 'rec-1',
  category: 'invoice',
  amount: 12345,
  currency: 'AED',
  occurredAt: '2024-01-15T10:30:00.000Z',
};

const recordWithMetadata: FinanceExportRecord = {
  ...baseRecord,
  id: 'rec-2',
  metadata: { source: 'stripe', retried: true, attempts: 2 },
};

describe('getSupportedExportFormats', () => {
  it('returns exactly json and csv, no other formats', () => {
    expect(getSupportedExportFormats()).toEqual(['json', 'csv']);
  });
});

describe('isExportFormat', () => {
  it('accepts json and csv', () => {
    expect(isExportFormat('json')).toBe(true);
    expect(isExportFormat('csv')).toBe(true);
  });

  it('rejects unsupported or non-string values', () => {
    expect(isExportFormat('xml')).toBe(false);
    expect(isExportFormat('')).toBe(false);
    expect(isExportFormat(undefined)).toBe(false);
    expect(isExportFormat(42)).toBe(false);
  });
});

describe('isValidOccurredAt', () => {
  it('accepts well-formed ISO 8601 timestamps with Z or offset', () => {
    expect(isValidOccurredAt('2024-01-15T10:30:00.000Z')).toBe(true);
    expect(isValidOccurredAt('2024-01-15T10:30:00+04:00')).toBe(true);
  });

  it('rejects malformed or non-ISO timestamps', () => {
    expect(isValidOccurredAt('2024-01-15')).toBe(false);
    expect(isValidOccurredAt('not-a-date')).toBe(false);
    expect(isValidOccurredAt('2024-13-40T10:30:00Z')).toBe(false);
  });
});

describe('isFinanceExportRecord', () => {
  it('accepts a well-formed record without metadata', () => {
    expect(isFinanceExportRecord(baseRecord)).toBe(true);
  });

  it('accepts a well-formed record with valid metadata', () => {
    expect(isFinanceExportRecord(recordWithMetadata)).toBe(true);
  });

  it('rejects non-object and null values', () => {
    expect(isFinanceExportRecord(null)).toBe(false);
    expect(isFinanceExportRecord('record')).toBe(false);
    expect(isFinanceExportRecord(42)).toBe(false);
  });

  it('rejects records missing required fields', () => {
    expect(isFinanceExportRecord({ ...baseRecord, id: '' })).toBe(false);
    expect(isFinanceExportRecord({ ...baseRecord, amount: Number.NaN })).toBe(false);
    expect(isFinanceExportRecord({ ...baseRecord, currency: '' })).toBe(false);
  });

  it('rejects metadata with non-primitive values', () => {
    expect(isFinanceExportRecord({ ...baseRecord, metadata: { nested: { bad: true } } })).toBe(
      false
    );
  });
});

describe('validateFinanceExportRecord', () => {
  it('returns no errors for a fully valid record', () => {
    expect(validateFinanceExportRecord(baseRecord, 0)).toEqual([]);
  });

  it('reports an invalid occurredAt timestamp', () => {
    const errors = validateFinanceExportRecord({ ...baseRecord, occurredAt: 'garbage' }, 3);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('index 3');
    expect(errors[0]).toContain('occurredAt');
  });

  it('reports a non-finite amount', () => {
    const errors = validateFinanceExportRecord(
      { ...baseRecord, amount: Number.POSITIVE_INFINITY },
      0
    );
    expect(errors.some(message => message.includes('amount'))).toBe(true);
  });
});

describe('exportTo — invariants', () => {
  it('rejects unsupported formats with ok: false and no payload', () => {
    const result = exportTo([baseRecord], { format: 'xml' as unknown as 'json' });
    expect(result.ok).toBe(false);
    expect(result.payload).toBeUndefined();
    expect(result.errors && result.errors.length).toBeGreaterThan(0);
  });

  it('does not mutate the input records array or its elements', () => {
    const records = [baseRecord, recordWithMetadata];
    const snapshot = JSON.parse(JSON.stringify(records));
    exportTo(records, { format: 'json', includeMetadata: true });
    expect(records).toEqual(snapshot);
  });

  it('is deterministic: identical input yields byte-identical payload', () => {
    const first = exportTo([baseRecord, recordWithMetadata], {
      format: 'csv',
      includeMetadata: true,
    });
    const second = exportTo([baseRecord, recordWithMetadata], {
      format: 'csv',
      includeMetadata: true,
    });
    expect(first.payload).toBe(second.payload);
  });

  it('fails the whole export (no partial payload) when any record is invalid', () => {
    const result = exportTo([baseRecord, { ...baseRecord, id: 'bad', occurredAt: 'not-a-date' }], {
      format: 'json',
    });
    expect(result.ok).toBe(false);
    expect(result.payload).toBeUndefined();
    expect(result.errors).toBeDefined();
    expect(result.errors!.some(message => message.includes('occurredAt'))).toBe(true);
  });

  it('produces a well-formed empty JSON payload for empty input', () => {
    const result = exportTo([], { format: 'json' });
    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(0);
    expect(result.payload).toBe('[]');
    expect(JSON.parse(result.payload as string)).toEqual([]);
  });

  it('produces a header-only CSV payload for empty input', () => {
    const result = exportTo([], { format: 'csv' });
    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(0);
    expect(result.payload).toBe('id,category,amount,currency,occurredAt');
  });
});

describe('exportTo — JSON format', () => {
  it('serializes records to valid, parseable JSON excluding metadata by default', () => {
    const result = exportTo([recordWithMetadata], { format: 'json' });
    expect(result.ok).toBe(true);
    const parsed = JSON.parse(result.payload as string) as Array<Record<string, unknown>>;
    expect(parsed).toHaveLength(1);
    expect(parsed[0].metadata).toBeUndefined();
    expect(parsed[0].id).toBe('rec-2');
  });

  it('includes metadata when includeMetadata is true', () => {
    const result = exportTo([recordWithMetadata], { format: 'json', includeMetadata: true });
    const parsed = JSON.parse(result.payload as string) as Array<Record<string, unknown>>;
    expect(parsed[0].metadata).toEqual({ source: 'stripe', retried: true, attempts: 2 });
  });
});

describe('exportTo — CSV format', () => {
  it('produces a header row plus one row per record', () => {
    const result = exportTo([baseRecord], { format: 'csv' });
    expect(result.ok).toBe(true);
    const lines = (result.payload as string).split('\r\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe('id,category,amount,currency,occurredAt');
    expect(lines[1]).toBe('rec-1,invoice,12345,AED,2024-01-15T10:30:00.000Z');
  });

  it('escapes fields containing the delimiter, quotes, or newlines per RFC 4180', () => {
    const tricky: FinanceExportRecord = {
      ...baseRecord,
      category: 'rent, "urgent"\nfollow-up',
    };
    const result = exportTo([tricky], { format: 'csv' });
    const lines = (result.payload as string).split('\r\n');
    expect(lines[1]).toContain('"rent, ""urgent""\nfollow-up"');
  });

  it('respects a custom delimiter', () => {
    const result = exportTo([baseRecord], { format: 'csv', delimiter: ';' });
    const lines = (result.payload as string).split('\r\n');
    expect(lines[0]).toBe('id;category;amount;currency;occurredAt');
    expect(lines[1]).toBe('rec-1;invoice;12345;AED;2024-01-15T10:30:00.000Z');
  });

  it('rejects an empty delimiter string', () => {
    const result = exportTo([baseRecord], { format: 'csv', delimiter: '' });
    expect(result.ok).toBe(false);
    expect(result.errors && result.errors.length).toBeGreaterThan(0);
  });

  it('appends a metadata column only when includeMetadata is true', () => {
    const withMeta = exportTo([recordWithMetadata], { format: 'csv', includeMetadata: true });
    const withoutMeta = exportTo([recordWithMetadata], { format: 'csv' });

    const withMetaLines = (withMeta.payload as string).split('\r\n');
    const withoutMetaLines = (withoutMeta.payload as string).split('\r\n');

    expect(withMetaLines[0]).toBe('id,category,amount,currency,occurredAt,metadata');
    expect(withMetaLines[1]).toContain('"{""source"":""stripe"",""retried"":true,""attempts"":2}"');
    expect(withoutMetaLines[0]).toBe('id,category,amount,currency,occurredAt');
    expect(withoutMetaLines[1]).not.toContain('stripe');
  });
});
