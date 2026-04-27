/**
 * Currency Service — Multi-Currency Support for White Caves
 *
 * Supports: AED, USD, EUR, GBP, INR
 * Base currency: AED (UAE Dirham)
 *
 * Features:
 * - Static fallback exchange rates (updated manually)
 * - Optional live rate fetch (exchangerate-api.com or similar)
 * - convert(amount, from, to) — universal converter
 * - convertToAED(amount, currency) — shortcut for AED conversion
 * - formatWithEquivalent(amount, currency) — "USD 500,000 (≈ AED 1,836,500)"
 * - getSupportedCurrencies() — list of supported currencies
 */

export type SupportedCurrency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyInfo {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  locale: string;
  flag: string;
}

export interface ExchangeRates {
  base: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
  updatedAt: string;
  source: 'static' | 'live';
}

// ─── CURRENCY METADATA ──────────────────────────────────────────────────

export const CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'en-AE', flag: '🇦🇪' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', flag: '🇺🇸' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', flag: '🇪🇺' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', flag: '🇬🇧' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', flag: '🇮🇳' },
};

// ─── STATIC EXCHANGE RATES (base: AED) ──────────────────────────────────
// Last updated: 2026-01-20
// Source: xe.com approximate rates
// 1 AED = X foreign currency

const STATIC_RATES_FROM_AED: Record<SupportedCurrency, number> = {
  AED: 1,
  USD: 0.2723,   // 1 AED ≈ 0.2723 USD (pegged ~3.6725)
  EUR: 0.2510,   // 1 AED ≈ 0.2510 EUR
  GBP: 0.2165,   // 1 AED ≈ 0.2165 GBP
  INR: 22.85,    // 1 AED ≈ 22.85 INR
};

// Inverse: How many AED per 1 unit of foreign currency
const STATIC_RATES_TO_AED: Record<SupportedCurrency, number> = {
  AED: 1,
  USD: 3.6725,   // 1 USD ≈ 3.6725 AED (pegged)
  EUR: 3.9841,   // 1 EUR ≈ 3.9841 AED
  GBP: 4.6189,   // 1 GBP ≈ 4.6189 AED
  INR: 0.04376,  // 1 INR ≈ 0.04376 AED
};

// ─── CACHED LIVE RATES ──────────────────────────────────────────────────

let cachedRates: ExchangeRates | null = null;

function getStaticRates(): ExchangeRates {
  return {
    base: 'AED',
    rates: { ...STATIC_RATES_TO_AED },
    updatedAt: '2026-01-20T00:00:00Z',
    source: 'static',
  };
}

// ─── CORE FUNCTIONS ─────────────────────────────────────────────────────

/**
 * Get current exchange rates (cached live or static fallback)
 */
export function getExchangeRates(): ExchangeRates {
  return cachedRates ?? getStaticRates();
}

/**
 * Check if a currency code is supported
 */
export function isSupportedCurrency(code: string): code is SupportedCurrency {
  return code in CURRENCIES;
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES);
}

/**
 * Convert between any two supported currencies
 * @param amount - the amount to convert
 * @param from - source currency code
 * @param to - target currency code
 * @returns converted amount (rounded to 2 decimal places)
 */
export function convert(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
): number {
  if (from === to) return amount;
  if (amount === 0) return 0;

  const rates = getExchangeRates();

  // Convert from → AED → to
  const amountInAED = from === 'AED'
    ? amount
    : amount * (rates.rates[from] || STATIC_RATES_TO_AED[from]);

  if (to === 'AED') return Math.round(amountInAED * 100) / 100;

  // AED → target: divide by target's "to AED" rate = multiply by "from AED" rate
  const fromAedRate = STATIC_RATES_FROM_AED[to];
  const result = amountInAED * fromAedRate;
  return Math.round(result * 100) / 100;
}

/**
 * Convert any amount to AED
 */
export function convertToAED(amount: number, currency: SupportedCurrency): number {
  return convert(amount, currency, 'AED');
}

/**
 * Format amount with AED equivalent shown alongside
 * e.g. "USD 500,000 (≈ AED 1,836,250)"
 */
export function formatWithAedEquivalent(
  amount: number,
  currency: SupportedCurrency,
): string {
  const formattedOriginal = new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  if (currency === 'AED') return formattedOriginal;

  const aedAmount = convertToAED(amount, currency);
  const formattedAED = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(aedAmount);

  return `${formattedOriginal} (≈ ${formattedAED})`;
}

/**
 * Fetch live exchange rates from API
 * Designed for server-side use; frontend should use /api/currency/rates
 */
export async function fetchLiveRates(): Promise<ExchangeRates> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    console.log('[Currency] No EXCHANGE_RATE_API_KEY — using static rates');
    return getStaticRates();
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/AED`,
    );
    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data = await res.json();
    const rates: Partial<Record<SupportedCurrency, number>> = {};

    for (const code of Object.keys(CURRENCIES) as SupportedCurrency[]) {
      if (data.conversion_rates?.[code]) {
        // API returns: 1 AED = X foreign. We store: 1 foreign = X AED
        rates[code] = code === 'AED' ? 1 : 1 / data.conversion_rates[code];
      }
    }

    cachedRates = {
      base: 'AED',
      rates: { ...STATIC_RATES_TO_AED, ...rates } as Record<SupportedCurrency, number>,
      updatedAt: new Date().toISOString(),
      source: 'live',
    };

    console.log('[Currency] Live rates fetched successfully');
    return cachedRates;
  } catch (err) {
    console.warn('[Currency] Live rate fetch failed, using static rates:', err);
    return getStaticRates();
  }
}

/**
 * Refresh rates on a schedule (server-side)
 * Refreshes every 6 hours by default
 */
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startRateRefresh(intervalMs = 6 * 60 * 60 * 1000): void {
  if (refreshInterval) return;
  fetchLiveRates(); // immediate first fetch
  refreshInterval = setInterval(() => fetchLiveRates(), intervalMs);
  console.log('[Currency] Rate refresh started');
}

export function stopRateRefresh(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('[Currency] Rate refresh stopped');
  }
}
