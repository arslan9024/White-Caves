/**
 * currency.ts — Multi-Currency Precision Totalizer & Unified FX Conversion Utility
 * Standard: AEGIS V5.0 Unified Core (AEG-003/041 Context Triad & Single Source of Truth)
 * Single Purpose File Law: < 350 lines
 *
 * Eliminates floating point precision errors for multi-currency totalizers (AED, USD, EUR, GBP, SAR, RUB, INR).
 * Normalizes multi-currency conversions and provides consistent formatting across CRM & dashboards.
 */

export type SupportedCurrency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'RUB' | 'INR';

export const FX_RATES_TO_AED: Record<SupportedCurrency, number> = {
  AED: 1.0,
  USD: 3.6725, // Fixed peg
  EUR: 3.9850,
  GBP: 4.6520,
  SAR: 0.98,
  RUB: 0.041,
  INR: 0.044,
};

export const CURRENCY_RATES = FX_RATES_TO_AED;

/**
 * Normalizes amount from source currency to AED
 */
export function reduceToAED(amount: number, fromCurrency: string = 'AED'): number {
  const upper = fromCurrency.toUpperCase() as SupportedCurrency;
  const rate = FX_RATES_TO_AED[upper];
  if (!rate) {
    return amount;
  }
  return Math.round((amount * rate + Number.EPSILON) * 100) / 100;
}

/**
 * Converts currency using high-precision 2-decimal rounded cents math
 */
export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount;
  const amountInAED = amount * (FX_RATES_TO_AED[from] || 1.0);
  const targetRate = FX_RATES_TO_AED[to] || 1.0;
  const converted = amountInAED / targetRate;
  return Math.round((converted + Number.EPSILON) * 100) / 100;
}

/**
 * Formats currency using en-AE locale
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: SupportedCurrency | string = 'AED'
): string {
  if (amount == null || isNaN(amount)) return `${currency} 0`;
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(rounded);
}

/**
 * Aggregates portfolio items across multi-currencies into target currency
 */
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

export const MultiCurrencyEngine = {
  reduceToAED,
  convertCurrency,
  formatCurrency,
  rates: FX_RATES_TO_AED,
  aggregatePortfolioTotals,
};
