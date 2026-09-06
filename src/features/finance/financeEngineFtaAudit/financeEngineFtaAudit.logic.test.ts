import { describe, expect, it } from 'vitest';
import {
  STANDARD_UAE_VAT_RATE,
  VAT_AMOUNT_TOLERANCE,
  auditTransaction,
  auditTransactions,
  isVatAmountValid,
  reconcileTaxPeriods,
  validateVatRegistrationNumber,
  type FtaAuditTransaction,
} from './financeEngineFtaAudit.logic';

const baseTransaction: FtaAuditTransaction = {
  id: 'txn-1',
  invoiceNumber: 'INV-1001',
  vatRegistrationNumber: '123456789012345',
  taxableAmount: 1000,
  vatAmount: 50,
  currency: 'AED',
  transactionDate: '2026-01-15T00:00:00.000Z',
  taxPeriod: '2026-Q1',
};

describe('validateVatRegistrationNumber', () => {
  it('accepts a 15-digit numeric TRN', () => {
    expect(validateVatRegistrationNumber('123456789012345')).toBe(true);
  });

  it('rejects a TRN with fewer than 15 digits', () => {
    expect(validateVatRegistrationNumber('12345')).toBe(false);
  });

  it('rejects a TRN with non-numeric characters', () => {
    expect(validateVatRegistrationNumber('12345678901234A')).toBe(false);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(validateVatRegistrationNumber('  123456789012345  ')).toBe(true);
  });
});

describe('isVatAmountValid', () => {
  it('returns true when VAT matches the standard 5% rate', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      taxableAmount: 1000,
      vatAmount: 50,
    };
    expect(isVatAmountValid(transaction)).toBe(true);
  });

  it('returns false when VAT amount does not match the expected calculation', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      taxableAmount: 1000,
      vatAmount: 75,
    };
    expect(isVatAmountValid(transaction)).toBe(false);
  });

  it('respects a custom vatRate override', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      taxableAmount: 1000,
      vatAmount: 0,
      vatRate: 0,
    };
    expect(isVatAmountValid(transaction)).toBe(true);
  });

  it('tolerates rounding differences within VAT_AMOUNT_TOLERANCE', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      taxableAmount: 1000,
      vatAmount: 50 + VAT_AMOUNT_TOLERANCE / 2,
    };
    expect(isVatAmountValid(transaction)).toBe(true);
  });
});

describe('auditTransaction', () => {
  it('produces no findings for a fully compliant transaction', () => {
    const now = new Date('2026-06-01T00:00:00.000Z');
    expect(auditTransaction(baseTransaction, now)).toEqual([]);
  });

  it('flags a missing TRN as critical', () => {
    const transaction: FtaAuditTransaction = { ...baseTransaction, vatRegistrationNumber: '' };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(
      expect.objectContaining({ code: 'MISSING_TRN', severity: 'critical', transactionId: 'txn-1' })
    );
  });

  it('flags an invalid TRN format as critical', () => {
    const transaction: FtaAuditTransaction = { ...baseTransaction, vatRegistrationNumber: 'abc' };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(
      expect.objectContaining({ code: 'INVALID_TRN_FORMAT', severity: 'critical' })
    );
  });

  it('flags a missing invoice number as critical', () => {
    const transaction: FtaAuditTransaction = { ...baseTransaction, invoiceNumber: '   ' };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(expect.objectContaining({ code: 'MISSING_INVOICE_NUMBER' }));
  });

  it('flags negative taxable amounts as critical', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      taxableAmount: -100,
      vatAmount: -5,
    };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(expect.objectContaining({ code: 'NEGATIVE_TAXABLE_AMOUNT' }));
    expect(findings).toContainEqual(expect.objectContaining({ code: 'NEGATIVE_VAT_AMOUNT' }));
  });

  it('flags a VAT amount mismatch as a warning', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      taxableAmount: 1000,
      vatAmount: 999,
    };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(
      expect.objectContaining({ code: 'VAT_AMOUNT_MISMATCH', severity: 'warning' })
    );
  });

  it('flags unsupported currencies as a warning', () => {
    const transaction: FtaAuditTransaction = { ...baseTransaction, currency: 'EUR' };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(
      expect.objectContaining({ code: 'UNSUPPORTED_CURRENCY', severity: 'warning' })
    );
  });

  it('flags a missing tax period as critical', () => {
    const transaction: FtaAuditTransaction = { ...baseTransaction, taxPeriod: '' };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(
      expect.objectContaining({ code: 'MISSING_TAX_PERIOD', severity: 'critical' })
    );
  });

  it('flags future-dated transactions as a warning', () => {
    const transaction: FtaAuditTransaction = {
      ...baseTransaction,
      transactionDate: '2099-01-01T00:00:00.000Z',
    };
    const findings = auditTransaction(transaction, new Date('2026-06-01T00:00:00.000Z'));
    expect(findings).toContainEqual(
      expect.objectContaining({ code: 'FUTURE_DATED_TRANSACTION', severity: 'warning' })
    );
  });
});

describe('auditTransactions', () => {
  it('aggregates totals and marks the report compliant with no critical findings', () => {
    const now = new Date('2026-06-01T00:00:00.000Z');
    const second: FtaAuditTransaction = {
      ...baseTransaction,
      id: 'txn-2',
      invoiceNumber: 'INV-1002',
      taxableAmount: 2000,
      vatAmount: 100,
    };
    const report = auditTransactions([baseTransaction, second], now);

    expect(report.totalTransactions).toBe(2);
    expect(report.totalTaxableAmount).toBe(3000);
    expect(report.totalVatAmount).toBe(150);
    expect(report.findings).toEqual([]);
    expect(report.isCompliant).toBe(true);
    expect(report.generatedAt).toBe(now.toISOString());
  });

  it('marks the report non-compliant when any transaction has a critical finding', () => {
    const now = new Date('2026-06-01T00:00:00.000Z');
    const invalid: FtaAuditTransaction = {
      ...baseTransaction,
      id: 'txn-3',
      vatRegistrationNumber: '',
    };
    const report = auditTransactions([baseTransaction, invalid], now);

    expect(report.isCompliant).toBe(false);
    expect(report.findings.some(finding => finding.code === 'MISSING_TRN')).toBe(true);
  });

  it('returns an empty, compliant report for an empty transaction list', () => {
    const report = auditTransactions([]);
    expect(report.totalTransactions).toBe(0);
    expect(report.totalTaxableAmount).toBe(0);
    expect(report.totalVatAmount).toBe(0);
    expect(report.isCompliant).toBe(true);
  });
});

describe('reconcileTaxPeriods', () => {
  it('groups transactions by tax period and computes expected VAT totals', () => {
    const q1TransactionA: FtaAuditTransaction = {
      ...baseTransaction,
      id: 'txn-a',
      taxPeriod: '2026-Q1',
    };
    const q1TransactionB: FtaAuditTransaction = {
      ...baseTransaction,
      id: 'txn-b',
      taxPeriod: '2026-Q1',
      taxableAmount: 500,
      vatAmount: 25,
    };
    const q2Transaction: FtaAuditTransaction = {
      ...baseTransaction,
      id: 'txn-c',
      taxPeriod: '2026-Q2',
      taxableAmount: 200,
      vatAmount: 10,
    };

    const reconciliations = reconcileTaxPeriods([q1TransactionA, q1TransactionB, q2Transaction]);

    expect(reconciliations).toHaveLength(2);

    const q1 = reconciliations.find(entry => entry.taxPeriod === '2026-Q1');
    expect(q1).toBeDefined();
    expect(q1?.transactionCount).toBe(2);
    expect(q1?.totalTaxableAmount).toBe(1500);
    expect(q1?.totalVatAmount).toBe(75);
    expect(q1?.expectedVatAmount).toBe(1500 * STANDARD_UAE_VAT_RATE);
    expect(q1?.isReconciled).toBe(true);

    const q2 = reconciliations.find(entry => entry.taxPeriod === '2026-Q2');
    expect(q2).toBeDefined();
    expect(q2?.transactionCount).toBe(1);
    expect(q2?.isReconciled).toBe(true);
  });

  it('flags a period as not reconciled when VAT totals diverge from expectations', () => {
    const mismatched: FtaAuditTransaction = {
      ...baseTransaction,
      id: 'txn-mismatch',
      taxPeriod: '2026-Q3',
      taxableAmount: 1000,
      vatAmount: 500,
    };

    const [reconciliation] = reconcileTaxPeriods([mismatched]);

    expect(reconciliation.isReconciled).toBe(false);
    expect(reconciliation.variance).toBeCloseTo(450, 2);
  });

  it('returns an empty array when given no transactions', () => {
    expect(reconcileTaxPeriods([])).toEqual([]);
  });
});
