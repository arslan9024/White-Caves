/**
 * Market Common Helpers
 * Parsing & string/number normalization utilities for market endpoints.
 */

export const parsePositiveInt = (value: unknown, fallback: number, max: number): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(max, parsed);
};

export const normalizeOptionalText = (value: unknown, maxLength = 100): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().slice(0, maxLength);
  return normalized.length > 0 ? normalized : undefined;
};

export const toStringField = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  return null;
};

export const toNumberField = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

