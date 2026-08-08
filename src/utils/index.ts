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
 * Create a normalized registry by consolidating duplicate records under a stable identity key.
 * Records are merged so the first non-empty value wins and duplicates increment a priority score.
 */
export function createNormalizedRegistry<T extends Record<string, unknown>>(
  items: T[],
  identityKey: keyof T,
): Array<T & { normalizedKey: string; priority: number }> {
  const registry = new Map<string, T & { normalizedKey: string; priority: number }>();

  for (const item of items) {
    const rawValue = item[identityKey];
    const normalizedKey = typeof rawValue === 'string'
      ? rawValue.trim().toLowerCase()
      : String(rawValue ?? '').trim().toLowerCase();

    if (!normalizedKey) continue;

    const existing = registry.get(normalizedKey);

    if (!existing) {
      registry.set(normalizedKey, {
        ...item,
        normalizedKey,
        priority: 1,
      } as T & { normalizedKey: string; priority: number });
      continue;
    }

    existing.priority += 1;

    for (const [field, value] of Object.entries(item)) {
      if (field === String(identityKey) || field === 'normalizedKey' || field === 'priority') {
        continue;
      }

      const targetField = field as keyof typeof existing;
      const currentValue = existing[targetField];

      if (currentValue == null && value != null) {
        existing[targetField] = value as never;
      } else if (
        typeof currentValue === 'string' &&
        typeof value === 'string' &&
        currentValue.trim() === ''
      ) {
        existing[targetField] = value as never;
      } else if (
        typeof currentValue === 'number' &&
        typeof value === 'number' &&
        value > currentValue
      ) {
        existing[targetField] = value as never;
      }
    }
  }

  return Array.from(registry.values()).sort(
    (a, b) => b.priority - a.priority || a.normalizedKey.localeCompare(b.normalizedKey),
  );
}

/**
 * Validate email
 */
export { isValidEmail } from './validation';
