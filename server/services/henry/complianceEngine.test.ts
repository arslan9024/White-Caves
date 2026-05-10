/**
 * Henry compliance engine unit tests
 *
 * Tests each rule group with passing and failing fixtures.
 */

import { describe, it, expect } from 'vitest';
import { evaluateCompliance, getRulesForTemplate, getComplianceSummary } from './complianceEngine';

// ─── tenancy_contract ───────────────────────────────────────────────────────

describe('complianceEngine - tenancy_contract', () => {
  const valid = {
    landlordName: 'Ahmed Al-Rashid',
    tenantName: 'John Smith',
    propertyAddress: 'Villa 12, DAMAC Hills 2',
    annualRent: 120000,
    securityDeposit: 6000,
    leaseStartDate: '2026-01-01',
    leaseEndDate: '2026-12-31',
    ejariAcknowledged: true,
    numberOfCheques: 4,
  };

  it('passes all rules for a fully valid tenancy contract', () => {
    const report = evaluateCompliance('tenancy_contract', valid);
    expect(report.errorCount).toBe(0);
    expect(report.isCompliant).toBe(true);
  });

  it('flags TC-001 when leaseStartDate is missing', () => {
    const data = { ...valid, leaseStartDate: undefined };
    const report = evaluateCompliance('tenancy_contract', data);
    const r = report.results.find(r => r.ruleId === 'TC-001');
    expect(r?.passed).toBe(false);
    expect(r?.severity).toBe('error');
  });

  it('flags TC-005 when ejari acknowledgement is false', () => {
    const data = { ...valid, ejariAcknowledged: false };
    const report = evaluateCompliance('tenancy_contract', data);
    const r = report.results.find(r => r.ruleId === 'TC-005');
    expect(r?.passed).toBe(false);
  });

  it('passes TC-005 when ejariNumber is provided instead of ejariAcknowledged', () => {
    const data = { ...valid, ejariAcknowledged: undefined, ejariNumber: 'EJARI-12345' };
    const report = evaluateCompliance('tenancy_contract', data);
    const r = report.results.find(r => r.ruleId === 'TC-005');
    expect(r?.passed).toBe(true);
  });
});

// ─── addendum ───────────────────────────────────────────────────────────────

describe('complianceEngine - addendum', () => {
  it('flags AD-002 when rent increase exceeds 20%', () => {
    const data = {
      landlordName: 'Ahmed', tenantName: 'John', propertyAddress: 'Villa 1',
      originalContractRef: 'TC-001', documentDate: '2026-01-01', rentIncreasePercent: 25,
    };
    const report = evaluateCompliance('addendum', data);
    const r = report.results.find(r => r.ruleId === 'AD-002');
    expect(r?.passed).toBe(false);
    expect(r?.severity).toBe('warning');
  });

  it('passes AD-002 when rent increase is exactly 20%', () => {
    const data = {
      landlordName: 'Ahmed', tenantName: 'John', propertyAddress: 'Villa 1',
      originalContractRef: 'TC-001', documentDate: '2026-01-01', rentIncreasePercent: 20,
    };
    const report = evaluateCompliance('addendum', data);
    const r = report.results.find(r => r.ruleId === 'AD-002');
    expect(r?.passed).toBe(true);
  });

  it('flags AD-003 when notice is less than 90 days before lease end', () => {
    const data = {
      landlordName: 'Ahmed', tenantName: 'John', propertyAddress: 'Villa 1',
      originalContractRef: 'TC-001', documentDate: '2026-01-01',
      noticeDate: '2026-11-01', leaseEndDate: '2026-12-31', // 60 days gap — less than 90
    };
    const report = evaluateCompliance('addendum', data);
    const r = report.results.find(r => r.ruleId === 'AD-003');
    expect(r?.passed).toBe(false);
  });

  it('passes AD-003 when notice is at least 90 days before lease end', () => {
    const data = {
      landlordName: 'Ahmed', tenantName: 'John', propertyAddress: 'Villa 1',
      originalContractRef: 'TC-001', documentDate: '2026-01-01',
      noticeDate: '2026-09-01', leaseEndDate: '2026-12-31', // 121 days gap
    };
    const report = evaluateCompliance('addendum', data);
    const r = report.results.find(r => r.ruleId === 'AD-003');
    expect(r?.passed).toBe(true);
  });
});

// ─── booking_form ────────────────────────────────────────────────────────────

describe('complianceEngine - booking_form', () => {
  it('requires purchase price', () => {
    const data = {
      sellerName: 'Ahmed', buyerName: 'John', propertyAddress: 'Villa 1',
      buyerPhone: '+971501234567', agreementDate: '2026-01-01',
    };
    const report = evaluateCompliance('booking_form', data);
    const r = report.results.find(r => r.ruleId === 'BF-001');
    expect(r?.passed).toBe(false);
    expect(r?.severity).toBe('error');
  });

  it('passes with a valid Emirates ID', () => {
    const data = {
      sellerName: 'Ahmed', buyerName: 'John', propertyAddress: 'Villa 1',
      purchasePrice: 1500000, buyerPhone: '0501234567', agreementDate: '2026-01-01',
      buyerEmiratesId: '784-1990-1234567-1',
    };
    const report = evaluateCompliance('booking_form', data);
    const r = report.results.find(r => r.ruleId === 'BF-003');
    expect(r?.passed).toBe(true);
  });
});

// ─── invoice ─────────────────────────────────────────────────────────────────

describe('complianceEngine - invoice', () => {
  it('requires TRN number when VAT is applicable', () => {
    const data = {
      landlordName: 'White Caves LLC', tenantName: 'Client Co.',
      propertyAddress: 'Unit 101', amount: 5000, documentDate: '2026-01-01',
      vatApplicable: true, // No TRN
    };
    const report = evaluateCompliance('invoice', data);
    const r = report.results.find(r => r.ruleId === 'INV-002');
    expect(r?.passed).toBe(false);
  });

  it('passes INV-002 when VAT is not applicable', () => {
    const data = {
      landlordName: 'White Caves LLC', tenantName: 'Client Co.',
      propertyAddress: 'Unit 101', amount: 5000, documentDate: '2026-01-01',
      vatApplicable: false,
    };
    const report = evaluateCompliance('invoice', data);
    const r = report.results.find(r => r.ruleId === 'INV-002');
    expect(r?.passed).toBe(true);
  });
});

// ─── Utilities ────────────────────────────────────────────────────────────────

describe('complianceEngine utilities', () => {
  it('getRulesForTemplate returns only applicable rules', () => {
    const rules = getRulesForTemplate('key_handover');
    const ruleIds = rules.map(r => r.ruleId);
    expect(ruleIds).toContain('UC-001'); // Universal
    expect(ruleIds).toContain('KH-001'); // Key handover specific
    expect(ruleIds).not.toContain('TC-001'); // Tenancy only
  });

  it('getComplianceSummary returns all 9 templates', () => {
    const summary = getComplianceSummary();
    const keys = Object.keys(summary);
    expect(keys).toContain('tenancy_contract');
    expect(keys).toContain('booking_form');
    expect(keys).toContain('invoice');
    expect(keys).toHaveLength(9);
  });
});
