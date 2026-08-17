/**
 * Utility Functions
 * Common utility functions for formatting, validation, and calculations
 */

/**
 * Format date for display
 * Accepts Date, string, null, or undefined — returns fallback for invalid input
 */
export const formatDate = (
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-AE'
): string => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(locale, options ?? {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Format currency — handles null/undefined, configurable locale & fractions
 */
export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = 'AED',
  options?: { locale?: string; maximumFractionDigits?: number }
): string => {
  if (amount == null || isNaN(amount)) return `${currency} 0`;
  const locale = options?.locale ?? 'en-AE';
  const maxFrac = options?.maximumFractionDigits ?? 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: maxFrac,
  }).format(amount);
};

/**
 * Format currency abbreviated (e.g., "AED 2.5M")
 */
export const formatCurrencyAbbreviated = (amount: number, currency: string = 'AED'): string => {
  if (amount >= 1_000_000_000) return `${currency} ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${currency} ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${currency} ${(amount / 1_000).toFixed(0)}K`;
  return `${currency} ${amount.toLocaleString()}`;
};

/**
 * Format price — unified function for all property/service price display.
 *
 * - Abbreviated by default: "AED 2.5M", "AED 450K", "AED 1,200"
 * - With priceType: "AED 120,000/year", "AED 8,000/month"
 * - Handles null/undefined → "Price on Request"
 * - Supports multi-currency via currency param (Phase 2E)
 */
export const formatPrice = (
  price?: number | null,
  options?: { priceType?: string; unit?: string; fallback?: string; currency?: string }
): string => {
  if (price == null || isNaN(price)) return options?.fallback ?? 'Price on Request';

  const currency = options?.currency ?? 'AED';

  // If a priceType or unit suffix is specified, use full locale format
  if (options?.priceType || options?.unit) {
    const formatted = new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
    const suffix = options.priceType
      ? `/${options.priceType}`
      : options.unit
        ? ` ${options.unit}`
        : '';
    return `${formatted}${suffix}`;
  }

  // Default: abbreviated
  return formatCurrencyAbbreviated(price, currency);
};

/**
 * Validate email
 */
export { isValidEmail } from './validation';

/**
 * PII Masking & Data Redaction (UAE PDPL Compliant)
 */
export * from './piiMasker';

/**
 * Intelligent Route Prefetcher
 */
export * from './routePrefetcher';

/**
 * Universal Data Export Engine (CSV / Excel XML)
 */
export * from './exportUtils';

/**
 * Offline-First IndexedDB Chat Store
 */
export * from './indexedChatStore';
