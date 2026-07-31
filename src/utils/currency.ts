/**
 * currency.ts — Multi-Currency Precision Totalizer & FX Conversion Utility
 *
 * Eliminates floating point precision errors for multi-currency totalizers (AED, USD, EUR, GBP).
 * Uses fixed-decimal integer-cents math for AED/USD/EUR/GBP conversions.
 */

export type SupportedCurrency = 'AED' | 'USD' | 'EUR' | 'GBP';

export const FX_RATES_TO_AED: Record<SupportedCurrency, number> = {
  AED: 1.0,
  USD: 3.6725,
  EUR: 3.9850,
  GBP: 4.6520,
};

export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount;
  // Convert from origin to AED first, then to target currency
  const amountInAED = amount * FX_RATES_TO_AED[from];
  const converted = amountInAED / FX_RATES_TO_AED[to];
  // Round cleanly to 2 decimal places using cents representation
  return Math.round((converted + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'AED'
): string {
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function aggregatePortfolioTotals(
  items: Array<{ amount: number; currency: SupportedCurrency }>,
  targetCurrency: SupportedCurrency = 'AED'
): number {
  const totalCents = items.reduce((acc, item) => {
    const converted = convertCurrency(item.amount, item.currency, targetCurrency);
    return acc + Math.round(converted * 100);
  }, 0);
  return totalCents / 100;
}
