import { describe, it, expect } from 'vitest';
import { convertCurrency, formatCurrency, aggregatePortfolioTotals } from '../utils/currency';

describe('Multi-Currency Precision Utility (currency.ts)', () => {
  it('correctly converts AED to USD without floating point precision errors', () => {
    const usd = convertCurrency(100, 'AED', 'USD');
    expect(usd).toBe(27.23);
  });

  it('correctly converts USD to AED', () => {
    const aed = convertCurrency(100, 'USD', 'AED');
    expect(aed).toBe(367.25);
  });

  it('returns same amount when converting to same currency', () => {
    const amount = convertCurrency(500, 'AED', 'AED');
    expect(amount).toBe(500);
  });

  it('formats currency cleanly in AED format', () => {
    const formatted = formatCurrency(1250.5, 'AED');
    expect(formatted).toContain('1,250.50');
  });

  it('aggregates multi-currency portfolio items accurately', () => {
    const items = [
      { amount: 100, currency: 'USD' as const }, // 367.25 AED
      { amount: 200, currency: 'AED' as const }, // 200.00 AED
    ];
    const totalAED = aggregatePortfolioTotals(items, 'AED');
    expect(totalAED).toBe(567.25);
  });
});
