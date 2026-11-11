import { describe, it, expect } from 'vitest';
import {
  calculateSecurityDeposit,
  validateEjariCompliance,
  calculateOverdueRentFee,
} from './tenancyComplianceEngine';

describe('Tenancy & Ejari Compliance Engine — calculateSecurityDeposit', () => {
  it('calculates 5% security deposit for unfurnished property', () => {
    const result = calculateSecurityDeposit(120000, 'UNFURNISHED');
    expect(result.statutoryDepositRatePct).toBe(5);
    expect(result.standardDepositAED).toBe(6000);
  });

  it('calculates 10% security deposit for furnished property', () => {
    const result = calculateSecurityDeposit(120000, 'FURNISHED');
    expect(result.statutoryDepositRatePct).toBe(10);
    expect(result.standardDepositAED).toBe(12000);
  });
});

describe('Tenancy & Ejari Compliance Engine — validateEjariCompliance', () => {
  it('blocks compliance when Ejari contract number is missing', () => {
    const result = validateEjariCompliance(undefined);
    expect(result.isEjariMandatorySatisfied).toBe(false);
  });

  it('passes compliance with valid Ejari contract number', () => {
    const result = validateEjariCompliance('EJR-2026-981245');
    expect(result.isEjariMandatorySatisfied).toBe(true);
  });

  it('flags warning when Ejari contract expires within 30 days', () => {
    const now = new Date('2026-06-01');
    const expiry = new Date('2026-06-20'); // 19 days away
    const result = validateEjariCompliance('EJR-2026-981245', expiry, now);

    expect(result.isEjariExpiringSoon).toBe(true);
    expect(result.daysUntilEjariExpiry).toBe(19);
  });
});

describe('Tenancy & Ejari Compliance Engine — calculateOverdueRentFee', () => {
  it('triggers first reminder on Day 5 without charging fee', () => {
    const result = calculateOverdueRentFee(10000, 6);
    expect(result.escalationLevel).toBe('REMINDER_1');
    expect(result.lateFeeAED).toBe(0);
  });

  it('assesses 5% late fee on Day 15 overdue', () => {
    const result = calculateOverdueRentFee(10000, 16);
    expect(result.escalationLevel).toBe('LATE_FEE_ASSESSED');
    expect(result.lateFeeAED).toBe(500); // 5% of 10,000
    expect(result.lateFeePct).toBe(5);
  });

  it('triggers legal escalation on Day 25 overdue', () => {
    const result = calculateOverdueRentFee(10000, 26);
    expect(result.escalationLevel).toBe('LEGAL_ESCALATION');
    expect(result.lateFeeAED).toBe(500);
  });
});
