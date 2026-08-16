/**
 * ExchangeRate Service — Wave 40 (REQ-RPT-003)
 *
 * Provides real-time currency conversion with 4-hour TTL caching for AED, USD, EUR, GBP, INR.
 */

import axios from 'axios';
import logger from '../utils/logger.js';
import { SupportedCurrency, CURRENCIES } from './currencyService.js';

export interface RateCache {
  rates: Record<SupportedCurrency, number>; // 1 AED = X target currency
  updatedAt: number;
  source: 'live' | 'fallback';
}

const STATIC_AED_RATES: Record<SupportedCurrency, number> = {
  AED: 1,
  USD: 1 / 3.6725,  // 0.2723 USD per AED
  EUR: 1 / 3.9841,  // 0.2510 EUR per AED
  GBP: 1 / 4.6189,  // 0.2165 GBP per AED
  INR: 1 / 0.04376, // 22.852 INR per AED
};

let rateCache: RateCache | null = null;
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 Hours TTL

/**
 * Fetch latest exchange rates with 4-hour TTL caching
 */
export async function getExchangeRates(forceRefresh = false): Promise<RateCache> {
  const now = Date.now();

  if (!forceRefresh && rateCache && now - rateCache.updatedAt < CACHE_TTL_MS) {
    return rateCache;
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (apiKey) {
    try {
      const response = await axios.get<{ conversion_rates?: Record<string, number> }>(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/AED`,
        { timeout: 5000 }
      );

      if (response.data?.conversion_rates) {
        const liveRates: Record<SupportedCurrency, number> = {
          AED: 1,
          USD: response.data.conversion_rates.USD || STATIC_AED_RATES.USD,
          EUR: response.data.conversion_rates.EUR || STATIC_AED_RATES.EUR,
          GBP: response.data.conversion_rates.GBP || STATIC_AED_RATES.GBP,
          INR: response.data.conversion_rates.INR || STATIC_AED_RATES.INR,
        };

        rateCache = {
          rates: liveRates,
          updatedAt: now,
          source: 'live',
        };

        logger.info('[ExchangeRateService] Refreshed live exchange rates from API', {
          source: 'live',
          updatedAt: new Date(now).toISOString(),
        });

        return rateCache;
      }
    } catch (error) {
      logger.warn('[ExchangeRateService] Failed to fetch live exchange rates, falling back to static rates', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  rateCache = {
    rates: STATIC_AED_RATES,
    updatedAt: now,
    source: 'fallback',
  };

  return rateCache;
}

/**
 * Convert amount between supported currencies
 */
export async function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): Promise<{ convertedAmount: number; rate: number; source: 'live' | 'fallback' }> {
  if (from === to) {
    return { convertedAmount: amount, rate: 1, source: 'fallback' };
  }

  const { rates, source } = await getExchangeRates();

  // Convert from `from` currency to base AED, then AED to `to` currency
  const fromRateInAED = rates[from]; // 1 AED = X `from`
  const toRateInAED = rates[to];     // 1 AED = Y `to`

  const amountInAED = amount / fromRateInAED;
  const convertedAmount = amountInAED * toRateInAED;
  const effectiveRate = toRateInAED / fromRateInAED;

  return {
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    rate: effectiveRate,
    source,
  };
}

/**
 * Clear in-memory rate cache
 */
export function clearRateCache(): void {
  rateCache = null;
}
