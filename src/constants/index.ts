/**
 * Constants barrel export
 *
 * Re-exports every public symbol from the constants modules so
 * consumers can import from `@/constants` directly:
 *
 *   import { TIMING, ERROR_MESSAGES, getErrorMessage } from '@/constants';
 */

// App-wide timing, limits, and dimension constants
export { TIMING, LIMITS, DIMENSIONS } from './app';
export type { TimingKey, LimitsKey, DimensionsKey } from './app';

// Error messages, domain groups, and extraction helpers
export { ERROR_MESSAGES, getErrorMessage, getHttpErrorMessage } from './errors';
