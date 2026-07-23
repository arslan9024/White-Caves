/**
 * Multi-Currency Client Reduction Engine
 * Normalizes global currencies to AED for consistent pricing display
 */

export const CURRENCY_RATES: Record<string, number> = {
  AED: 1,
  USD: 3.6725, // Fixed peg
  EUR: 3.95,
  GBP: 4.65,
  SAR: 0.98,
  RUB: 0.041,
  INR: 0.044
};

export const reduceToAED = (amount: number, fromCurrency: string = 'AED'): number => {
  const rate = CURRENCY_RATES[fromCurrency.toUpperCase()];
  if (!rate) {
    console.warn(`[Currency Engine] Unknown currency ${fromCurrency}. Defaulting to 1:1.`);
    return amount;
  }
  return amount * rate;
};

export const formatCurrency = (amount: number, currency: string = 'AED'): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const MultiCurrencyEngine = {
  reduceToAED,
  formatCurrency,
  rates: CURRENCY_RATES
};
