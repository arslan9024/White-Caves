import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useLanguageSwitcherPillLogic } from './LanguageSwitcherPill.logic';
import { LanguageProvider } from '../../../../context/LanguageContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  React.createElement(LanguageProvider, null, children)
);

describe('LanguageSwitcherPill.logic', () => {
  it('returns active language, supported languages list, and handles selection', () => {
    const onLanguageChange = vi.fn();
    const { result } = renderHook(() => useLanguageSwitcherPillLogic({ onLanguageChange }), { wrapper });

    expect(result.current.language).toBeDefined();
    expect(result.current.languagesList.length).toBeGreaterThan(0);

    act(() => {
      result.current.handleSelect('ar');
    });

    expect(result.current.language).toBe('ar');
    expect(onLanguageChange).toHaveBeenCalledWith('ar');
  });
});
