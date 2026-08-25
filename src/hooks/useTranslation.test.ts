import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import * as LanguageContextModule from '../context/LanguageContext';

describe('useTranslation', () => {
  it('delegates translation and formatting helpers to LanguageContext', () => {
    vi.spyOn(LanguageContextModule, 'useLanguage').mockReturnValue({
      t: (key: string) => `translated:${key}`,
      language: 'en',
      setLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
      isRTL: false,
      formatNumber: (n: number) => n.toString(),
      formatCurrency: (n: number) => `AED ${n}`,
      formatDate: (d: any) => new Date(d).toISOString(),
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('nav.home')).toBe('translated:nav.home');
    expect(result.current.language).toBe('en');
    expect(result.current.isRTL).toBe(false);
    expect(result.current.formatCurrency(5000)).toBe('AED 5000');
  });
});
