import type { CurrencyCode } from '../../../context/CurrencyContext';

export const GRID_CURRENCIES = ['AED', 'USD', 'GBP', 'EUR', 'INR', 'CNY'] as const satisfies readonly CurrencyCode[];
