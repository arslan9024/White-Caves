import { describe, expect, it } from 'vitest';
import { screenAML } from '../amlAdapter';

describe('AML adapter baseline provider', () => {
  it('returns low risk for normal profile', async () => {
    const result = await screenAML({
      leadId: 'lead-low',
      amount: 10000,
      currency: 'AED',
      transactionType: 'lease',
      nationality: 'UAE',
      sourceOfFunds: 'salary',
    });

    expect(result.provider).toBe('internal_aml_baseline');
    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBeLessThan(40);
    expect(Array.isArray(result.flags)).toBe(true);
    expect(result.providerReference).toMatch(/^AML-/);
  });

  it('returns low risk when only high-value trigger is present', async () => {
    const result = await screenAML({
      leadId: 'lead-medium',
      amount: 500000,
      currency: 'AED',
      transactionType: 'lease',
      nationality: 'UAE',
      sourceOfFunds: 'salary',
    });

    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBe(35);
    expect(result.flags).toContain('high_value_transaction');
    expect(result.flags).not.toContain('very_high_value_transaction');
  });

  it('returns high risk for compounded high-risk factors', async () => {
    const result = await screenAML({
      leadId: 'lead-high',
      amount: 1000000,
      currency: 'AED',
      transactionType: 'sale',
      nationality: 'Iran',
      sourceOfFunds: 'unknown cash source',
    });

    expect(result.riskLevel).toBe('high');
    expect(result.riskScore).toBe(100);
    expect(result.flags).toEqual(
      expect.arrayContaining([
        'high_value_transaction',
        'very_high_value_transaction',
        'high_risk_nationality',
        'source_of_funds_review_required',
      ])
    );
  });

  it('caps risk score at 100', async () => {
    const result = await screenAML({
      leadId: 'lead-cap',
      amount: 5000000,
      transactionType: 'sale',
      nationality: 'North Korea',
      sourceOfFunds: 'unverified cash',
    });

    expect(result.riskScore).toBe(100);
    expect(result.riskLevel).toBe('high');
  });
});
