import { describe, it, expect } from 'vitest';
import {
  THEODORA_67_REPORTS,
  THEODORA_REPORT_CATEGORIES,
} from './theodoraReportsRegistry';

describe('theodoraReportsRegistry', () => {
  it('contains exactly 67 enterprise reports with unique IDs', () => {
    expect(THEODORA_67_REPORTS).toHaveLength(67);

    const ids = THEODORA_67_REPORTS.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(67);
  });

  it('contains all 14 standardized reporting categories', () => {
    expect(THEODORA_REPORT_CATEGORIES.length).toBeGreaterThanOrEqual(14);

    const categoryKeys = new Set(THEODORA_REPORT_CATEGORIES.map(c => c.id));
    THEODORA_67_REPORTS.forEach(report => {
      expect(categoryKeys.has(report.categoryKey)).toBe(true);
      expect(report.name).toBeTruthy();
      expect(report.columns.length).toBeGreaterThan(0);
      expect(report.uaeRelevance).toBeTruthy();
    });
  });

  it('verifies core flagship reports exist with correct metadata', () => {
    const pnl = THEODORA_67_REPORTS.find(r => r.id === '3.14.R01');
    expect(pnl).toBeDefined();
    expect(pnl?.name).toBe('Profit and Loss');
    expect(pnl?.categoryKey).toBe('business-overview');

    const vatReport = THEODORA_67_REPORTS.find(r => r.id === '3.14.R40');
    expect(vatReport).toBeDefined();
    expect(vatReport?.name).toBe('VAT Audit Report');
    expect(vatReport?.categoryKey).toBe('taxes');

    const trialBalance = THEODORA_67_REPORTS.find(r => r.id === '3.14.R55');
    expect(trialBalance).toBeDefined();
    expect(trialBalance?.name).toBe('Trial Balance');
    expect(trialBalance?.categoryKey).toBe('accountant');
  });
});
