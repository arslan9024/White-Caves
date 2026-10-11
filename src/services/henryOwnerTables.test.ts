import { describe, expect, it } from 'vitest';
import deed from './HenryTitleDeedScannerService';

describe('owner header mapping and conservative multiline cells', () => {
  it('maps reordered columns and joins bilingual name-only continuations', () => {
    const result = deed.parseDocumentText(`Ownership Share | Owner Name | Owned Area | Owner Number
60 | Alice Example | 60 | 123
 | أليس مثال | |
40 | Bob Example | 40 | 456
 | بوب مثال | |`);
    expect(result.owners).toEqual([
      { dldNumber: '123', nameEn: 'Alice Example', nameAr: 'أليس مثال', sharePercent: 60, ownedAreaSqM: 60 },
      { dldNumber: '456', nameEn: 'Bob Example', nameAr: 'بوب مثال', sharePercent: 40, ownedAreaSqM: 40 },
    ]);
    expect(result.ownerNameEn).toBe('');
    expect(result.diagnostics?.fields.ownerName?.state).toBe('conflict');
  });
  it('flags incomplete or impossible share totals, never inferring 100%', () => {
    const result = deed.parseDocumentText(`Owner Name | Owner Number | Ownership Share
Alice Example | 123 | 60
Bob Example | 456 | 60`);
    expect(result.diagnostics?.warnings.join(' ')).toMatch(/do not total 100/);
    expect(result.diagnostics?.fields.ownerSharePercent?.state).toBe('conflict');
    const absent = deed.parseDocumentText('Owner Name | Owner Number\nAlice Example | 123');
    expect(absent.owners?.[0]?.sharePercent).toBeUndefined();
  });
  it('flags ambiguous identifiers rather than attaching names to an owner', () => {
    const result = deed.parseDocumentText(`Owner Name | Owner Number | Ownership Share
Alice Example | 123 / 456 | 100`);
    expect(result.diagnostics?.fields.ownerDldNumber?.state).toBe('conflict');
    expect(result.owners).toEqual([]);
  });
});
