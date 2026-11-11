import { describe, it, expect } from 'vitest';
import { calculateBouncedChequePenalties, checkChequeValidity } from './pdcComplianceEngine';

describe('PDC Compliance Engine — calculateBouncedChequePenalties', () => {
  it('applies min AED 200 late fee for small cheques (e.g. 2,000 AED)', () => {
    // 5% of 2,000 = 100 AED, so min 200 applies
    const result = calculateBouncedChequePenalties(2000, 150);
    expect(result.lateFeeAED).toBe(200);
    expect(result.bankReturnFeeAED).toBe(150);
    expect(result.totalRecoveryDemandAED).toBe(2000 + 200 + 150);
    expect(result.replacementDeadlineBusinessDays).toBe(5);
  });

  it('applies 5% late fee for large cheques (e.g. 50,000 AED)', () => {
    // 5% of 50,000 = 2,500 AED
    const result = calculateBouncedChequePenalties(50000, 150);
    expect(result.lateFeeAED).toBe(2500);
    expect(result.totalRecoveryDemandAED).toBe(50000 + 2500 + 150);
  });
});

describe('PDC Compliance Engine — checkChequeValidity', () => {
  it('flags cheques older than 180 days as EXPIRED_STALE', () => {
    const chequeDate = new Date('2026-01-01');
    const currentDate = new Date('2026-08-01'); // ~212 days later

    const result = checkChequeValidity(chequeDate, currentDate);
    expect(result.isStale).toBe(true);
    expect(result.legalStatus).toBe('EXPIRED_STALE');
    expect(result.daysRemainingBeforeStale).toBe(0);
  });

  it('flags cheques between 150 and 180 days with NEAR_EXPIRY_WARNING', () => {
    const chequeDate = new Date('2026-01-01');
    const currentDate = new Date('2026-06-10'); // 160 days later

    const result = checkChequeValidity(chequeDate, currentDate);
    expect(result.isStale).toBe(false);
    expect(result.isNearExpiryWarning).toBe(true);
    expect(result.legalStatus).toBe('NEAR_EXPIRY_WARNING');
  });

  it('marks fresh cheques as VALID', () => {
    const chequeDate = new Date('2026-05-01');
    const currentDate = new Date('2026-06-01'); // 31 days later

    const result = checkChequeValidity(chequeDate, currentDate);
    expect(result.isStale).toBe(false);
    expect(result.isNearExpiryWarning).toBe(false);
    expect(result.legalStatus).toBe('VALID');
  });
});
