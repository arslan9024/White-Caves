/**
 * useCurrency — Multi-Currency Hook for White Caves
 *
 * Provides:
 * - Exchange rates fetching & caching
 * - Currency conversion (client-side)
 * - Format with AED equivalent
 * - Supported currencies list
 *
 * Phase 2E: Multi-Currency Support
 */

import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchExchangeRatesAPI,
  fetchSupportedCurrenciesAPI,
  convertCurrencyAPI,
} from '../../store/crmDataSlice';
import type { AppDispatch } from '../../store/store';

// ─── TYPES ──────────────────────────────────────────────────────────────

export type SupportedCurrency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
  source: 'static' | 'live';
}

export interface ConversionResult {
  original: { amount: number; currency: string };
  converted: { amount: number; currency: string };
}

// ─── STATIC RATES (client-side fallback) ────────────────────────────────

const STATIC_RATES_TO_AED: Record<SupportedCurrency, number> = {
  AED: 1,
  USD: 3.6725,
  EUR: 3.9841,
  GBP: 4.6189,
  INR: 0.04376,
};

const STATIC_RATES_FROM_AED: Record<SupportedCurrency, number> = {
  AED: 1,
  USD: 0.2723,
  EUR: 0.2510,
  GBP: 0.2165,
  INR: 22.85,
};

const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  AED: 'en-AE',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  INR: 'en-IN',
};

// ─── HOOK ───────────────────────────────────────────────────────────────

export function useCurrency() {
  const dispatch = useDispatch<AppDispatch>();

  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyInfo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache rates in a ref for immediate sync conversions
  const ratesRef = useRef<Record<string, number>>(STATIC_RATES_TO_AED);

  /**
   * Fetch exchange rates from the API
   */
  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchExchangeRatesAPI()).unwrap();
      setRates(result as ExchangeRates);
      if (result.rates) {
        ratesRef.current = result.rates as Record<string, number>;
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Fetch supported currencies
   */
  const fetchCurrencies = useCallback(async () => {
    try {
      const result = await dispatch(fetchSupportedCurrenciesAPI()).unwrap();
      setCurrencies(result as CurrencyInfo[]);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch currencies');
    }
  }, [dispatch]);

  /**
   * Convert via API (most accurate, uses server-side rates)
   */
  const convertViaAPI = useCallback(async (
    amount: number,
    from: string,
    to: string,
  ): Promise<ConversionResult | null> => {
    try {
      const result = await dispatch(convertCurrencyAPI({ amount, from, to })).unwrap();
      return result as ConversionResult;
    } catch {
      return null;
    }
  }, [dispatch]);

  /**
   * Convert locally using cached/static rates (instant, no API call)
   */
  const convert = useCallback((
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency,
  ): number => {
    if (from === to) return amount;
    if (amount === 0) return 0;

    const currentRates = ratesRef.current;

    // Convert from → AED → to
    const amountInAED = from === 'AED'
      ? amount
      : amount * (currentRates[from] || STATIC_RATES_TO_AED[from] || 1);

    if (to === 'AED') return Math.round(amountInAED * 100) / 100;

    const fromAedRate = STATIC_RATES_FROM_AED[to] || 1;
    return Math.round(amountInAED * fromAedRate * 100) / 100;
  }, []);

  /**
   * Convert any amount to AED (shortcut)
   */
  const convertToAED = useCallback((
    amount: number,
    currency: SupportedCurrency,
  ): number => {
    return convert(amount, currency, 'AED');
  }, [convert]);

  /**
   * Format amount with AED equivalent
   * e.g. "USD 500,000 (≈ AED 1,836,250)"
   */
  const formatWithAedEquivalent = useCallback((
    amount: number,
    currency: SupportedCurrency,
  ): string => {
    const locale = CURRENCY_LOCALES[currency] || 'en-AE';
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

    if (currency === 'AED') return formatted;

    const aedAmount = convertToAED(amount, currency);
    const formattedAED = new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(aedAmount);

    return `${formatted} (≈ ${formattedAED})`;
  }, [convertToAED]);

  /**
   * Format a single amount in any currency
   */
  const formatAmount = useCallback((
    amount: number,
    currency: SupportedCurrency = 'AED',
  ): string => {
    const locale = CURRENCY_LOCALES[currency] || 'en-AE';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  return {
    // State
    rates,
    currencies,
    loading,
    error,

    // Actions
    fetchRates,
    fetchCurrencies,

    // Conversion
    convert,
    convertToAED,
    convertViaAPI,

    // Formatting
    formatWithAedEquivalent,
    formatAmount,
  };
}
