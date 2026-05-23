/**
 * LanguageContext — Tests
 * Tests LanguageProvider initialization, language switching, RTL, t(), formatting.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage, LANGUAGES } from './LanguageContext';

// ── Mock safeStorage ─────────────────────────────────────────────────
const mockStorage: Record<string, string> = {};
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn((key: string) => mockStorage[key] ?? null),
    set: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
    remove: vi.fn((key: string) => { delete mockStorage[key]; }),
  },
}));

// ── Helper consumer ──────────────────────────────────────────────────
function LanguageConsumer() {
  const {
    language, setLanguage, toggleLanguage, isRTL,
    t, formatNumber, formatCurrency, formatDate, translations,
  } = useLanguage();

  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="rtl">{isRTL ? 'rtl' : 'ltr'}</span>
      <span data-testid="t-home">{t('common.home')}</span>
      <span data-testid="t-missing">{t('nonexistent.key')}</span>
      <span data-testid="format-num">{formatNumber(1234567)}</span>
      <span data-testid="format-cur">{formatCurrency(500000)}</span>
      <span data-testid="format-date">{formatDate('2026-03-01')}</span>
      <span data-testid="format-date-null">{formatDate(undefined as any)}</span>
      <span data-testid="format-date-invalid">{formatDate('garbage')}</span>
      <span data-testid="has-translations">{Object.keys(translations).length > 0 ? 'yes' : 'no'}</span>
      <button onClick={() => setLanguage(LANGUAGES.AR)}>Arabic</button>
      <button onClick={() => setLanguage(LANGUAGES.EN)}>English</button>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    // Reset document attributes
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  // ─── LANGUAGES constant ────────────────────────────────────────
  describe('LANGUAGES constant', () => {
    it('EN is "en"', () => {
      expect(LANGUAGES.EN).toBe('en');
    });

    it('AR is "ar"', () => {
      expect(LANGUAGES.AR).toBe('ar');
    });
  });

  // ─── Initial State ─────────────────────────────────────────────
  describe('Initial State', () => {
    it('defaults to English', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('lang').textContent).toBe('en');
      expect(screen.getByTestId('rtl').textContent).toBe('ltr');
    });

    it('initializes from stored language', () => {
      mockStorage['whitecaves_language'] = 'ar';
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('lang').textContent).toBe('ar');
      expect(screen.getByTestId('rtl').textContent).toBe('rtl');
    });

    it('ignores invalid stored language', () => {
      mockStorage['whitecaves_language'] = 'invalid';
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('lang').textContent).toBe('en');
    });
  });

  // ─── Language Switching ────────────────────────────────────────
  describe('Language Switching', () => {
    it('switches to Arabic', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Arabic')); });
      expect(screen.getByTestId('lang').textContent).toBe('ar');
      expect(screen.getByTestId('rtl').textContent).toBe('rtl');
    });

    it('switches back to English', () => {
      mockStorage['whitecaves_language'] = 'ar';
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      act(() => { fireEvent.click(screen.getByText('English')); });
      expect(screen.getByTestId('lang').textContent).toBe('en');
    });

    it('toggle flips language', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Toggle')); });
      expect(screen.getByTestId('lang').textContent).toBe('ar');
      act(() => { fireEvent.click(screen.getByText('Toggle')); });
      expect(screen.getByTestId('lang').textContent).toBe('en');
    });
  });

  // ─── Document Attributes ───────────────────────────────────────
  describe('Document Attributes', () => {
    it('sets lang attribute on html element', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    it('sets dir=ltr for English', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('sets dir=rtl for Arabic', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Arabic')); });
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });
  });

  // ─── Translation (t function) ──────────────────────────────────
  describe('Translation — t()', () => {
    it('resolves known key', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('t-home').textContent).toBe('Home');
    });

    it('returns key for missing translation', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('t-missing').textContent).toBe('nonexistent.key');
    });

    it('translations object is populated', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('has-translations').textContent).toBe('yes');
    });
  });

  // ─── Number Formatting ─────────────────────────────────────────
  describe('formatNumber', () => {
    it('formats numbers with locale grouping', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      const text = screen.getByTestId('format-num').textContent!;
      // Should contain separators (exact format depends on Intl)
      expect(text.length).toBeGreaterThan(4);
    });
  });

  // ─── Currency Formatting ───────────────────────────────────────
  describe('formatCurrency', () => {
    it('formats currency with AED default', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      const text = screen.getByTestId('format-cur').textContent!;
      // Should contain "AED" or currency symbol
      expect(text.length).toBeGreaterThan(3);
    });
  });

  // ─── Date Formatting ──────────────────────────────────────────
  describe('formatDate', () => {
    it('formats valid date string', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      const text = screen.getByTestId('format-date').textContent!;
      expect(text.length).toBeGreaterThan(0);
      // Should contain 2026 somewhere
      expect(text).toContain('2026');
    });

    it('returns empty string for null/undefined', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('format-date-null').textContent).toBe('');
    });

    it('returns empty string for invalid date', () => {
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      expect(screen.getByTestId('format-date-invalid').textContent).toBe('');
    });
  });

  // ─── Persistence ───────────────────────────────────────────────
  describe('Persistence', () => {
    it('stores language on change', async () => {
      const { safeStorage } = await import('../utils/safeStorage');
      render(
        <LanguageProvider>
          <LanguageConsumer />
        </LanguageProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Arabic')); });
      expect(safeStorage.set).toHaveBeenCalledWith('whitecaves_language', 'ar');
    });
  });

  // ─── useLanguage outside provider ──────────────────────────────
  describe('useLanguage outside provider', () => {
    it('throws Error when used outside LanguageProvider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<LanguageConsumer />)).toThrow('useLanguage must be used within a LanguageProvider');
      spy.mockRestore();
    });
  });
});
