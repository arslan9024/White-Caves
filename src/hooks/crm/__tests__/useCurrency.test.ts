/**
 * useCurrency — Unit tests
 * Phase 2E: Multi-Currency Support
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCurrency } from '../useCurrency';

const mockDispatch = vi.fn();
const mockUnwrap = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    fetchExchangeRatesAPI: vi.fn(() => ({ type: 'mock/fetchExchangeRates' })),
    fetchSupportedCurrenciesAPI: vi.fn(() => ({ type: 'mock/fetchSupportedCurrencies' })),
    convertCurrencyAPI: vi.fn((p) => ({ type: 'mock/convertCurrency', payload: p })),
  };
});

describe('useCurrency', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue({});
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });
  });

  describe('initial state', () => {
    it('starts with null rates', () => {
      const { result } = renderHook(() => useCurrency());
      expect(result.current.rates).toBeNull();
      expect(result.current.currencies).toBeNull();
    });

    it('starts with no loading/error', () => {
      const { result } = renderHook(() => useCurrency());
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchRates', () => {
    it('dispatches fetchExchangeRatesAPI', async () => {
      mockUnwrap.mockResolvedValue({
        base: 'AED',
        rates: { AED: 1, USD: 3.6725 },
        updatedAt: '2026-01-20',
        source: 'static',
      });

      const { result } = renderHook(() => useCurrency());

      await act(async () => {
        await result.current.fetchRates();
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(result.current.rates).toBeTruthy();
      expect(result.current.rates?.base).toBe('AED');
    });
  });

  describe('fetchCurrencies', () => {
    it('dispatches fetchSupportedCurrenciesAPI', async () => {
      mockUnwrap.mockResolvedValue([
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
      ]);

      const { result } = renderHook(() => useCurrency());

      await act(async () => {
        await result.current.fetchCurrencies();
      });

      expect(result.current.currencies).toHaveLength(2);
    });
  });

  describe('local conversion', () => {
    it('converts same currency (AED → AED)', () => {
      const { result } = renderHook(() => useCurrency());
      expect(result.current.convert(1000, 'AED', 'AED')).toBe(1000);
    });

    it('converts zero', () => {
      const { result } = renderHook(() => useCurrency());
      expect(result.current.convert(0, 'USD', 'AED')).toBe(0);
    });

    it('converts USD to AED using static rates', () => {
      const { result } = renderHook(() => useCurrency());
      const aed = result.current.convert(100, 'USD', 'AED');
      // 100 * 3.6725 = 367.25
      expect(aed).toBe(367.25);
    });

    it('converts AED to USD using static rates', () => {
      const { result } = renderHook(() => useCurrency());
      const usd = result.current.convert(367.25, 'AED', 'USD');
      // 367.25 * 0.2723 = ~100.01
      expect(usd).toBeCloseTo(100, 0);
    });

    it('convertToAED shortcut works', () => {
      const { result } = renderHook(() => useCurrency());
      const aed = result.current.convertToAED(1000, 'GBP');
      // 1000 * 4.6189 = 4618.9
      expect(aed).toBe(4618.9);
    });
  });

  describe('formatting', () => {
    it('formatAmount in AED', () => {
      const { result } = renderHook(() => useCurrency());
      const formatted = result.current.formatAmount(500000, 'AED');
      expect(formatted).toContain('500,000');
    });

    it('formatAmount in USD', () => {
      const { result } = renderHook(() => useCurrency());
      const formatted = result.current.formatAmount(500000, 'USD');
      expect(formatted).toContain('500,000');
    });

    it('formatWithAedEquivalent for AED returns just AED', () => {
      const { result } = renderHook(() => useCurrency());
      const formatted = result.current.formatWithAedEquivalent(500000, 'AED');
      expect(formatted).not.toContain('≈');
    });

    it('formatWithAedEquivalent for USD shows equivalent', () => {
      const { result } = renderHook(() => useCurrency());
      const formatted = result.current.formatWithAedEquivalent(500000, 'USD');
      expect(formatted).toContain('≈');
      expect(formatted).toContain('AED');
    });
  });

  describe('handler exposure', () => {
    it('exposes all functions', () => {
      const { result } = renderHook(() => useCurrency());
      expect(typeof result.current.fetchRates).toBe('function');
      expect(typeof result.current.fetchCurrencies).toBe('function');
      expect(typeof result.current.convert).toBe('function');
      expect(typeof result.current.convertToAED).toBe('function');
      expect(typeof result.current.convertViaAPI).toBe('function');
      expect(typeof result.current.formatWithAedEquivalent).toBe('function');
      expect(typeof result.current.formatAmount).toBe('function');
    });

    it('exposes all data fields', () => {
      const { result } = renderHook(() => useCurrency());
      expect(result.current).toHaveProperty('rates');
      expect(result.current).toHaveProperty('currencies');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
    });
  });
});
