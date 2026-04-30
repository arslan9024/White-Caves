/**
 * LanguageSwitcher — Tests
 */

/* eslint-disable security/detect-object-injection */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, LANGUAGES } from '../../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

// Mock safeStorage
const mockStorage: Record<string, string> = {};
vi.mock('../../../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn((key: string) => mockStorage[key] ?? null),
    set: vi.fn((key: string, value: string) => {
      mockStorage[key] = value;
    }),
    remove: vi.fn((key: string) => {
      delete mockStorage[key];
    }),
  },
}));

function renderSwitcher(initialLang?: 'en' | 'ar') {
  if (initialLang) mockStorage['whitecaves_language'] = initialLang;
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  it('renders a button', () => {
    renderSwitcher();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows "العربية" (Arabic label) when language is English', () => {
    renderSwitcher('en');
    expect(screen.getByRole('button')).toHaveTextContent('العربية');
  });

  it('shows "English" when language is Arabic', () => {
    renderSwitcher('ar');
    expect(screen.getByRole('button')).toHaveTextContent('English');
  });

  it('toggles from English to Arabic on click', () => {
    renderSwitcher('en');
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(document.documentElement.getAttribute('lang')).toBe(LANGUAGES.AR);
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });

  it('toggles from Arabic back to English on click', () => {
    renderSwitcher('ar');
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(document.documentElement.getAttribute('lang')).toBe(LANGUAGES.EN);
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('has correct aria-label for English → Arabic', () => {
    renderSwitcher('en');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'التبديل إلى العربية');
  });

  it('has correct aria-label for Arabic → English', () => {
    renderSwitcher('ar');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to English');
  });

  it('applies lang-switcher--ar class when Arabic is active', () => {
    renderSwitcher('ar');
    expect(screen.getByRole('button')).toHaveClass('lang-switcher--ar');
  });

  it('does not apply lang-switcher--ar class when English is active', () => {
    renderSwitcher('en');
    expect(screen.getByRole('button')).not.toHaveClass('lang-switcher--ar');
  });

  it('accepts optional className prop', () => {
    if (mockStorage['whitecaves_language']) delete mockStorage['whitecaves_language'];
    render(
      <LanguageProvider>
        <LanguageSwitcher className="custom-class" />
      </LanguageProvider>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
