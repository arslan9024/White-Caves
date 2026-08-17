import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../../../context/LanguageContext';
import { LanguageSwitcherPill } from './LanguageSwitcherPill';

describe('LanguageSwitcherPill Component', () => {
  it('renders all 4 language options (EN, AR, ES, RU)', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcherPill />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang-btn-en')).toBeTruthy();
    expect(screen.getByTestId('lang-btn-ar')).toBeTruthy();
    expect(screen.getByTestId('lang-btn-es')).toBeTruthy();
    expect(screen.getByTestId('lang-btn-ru')).toBeTruthy();
  });

  it('switches active language on click and invokes callback', () => {
    const handleLanguageChange = vi.fn();

    render(
      <LanguageProvider>
        <LanguageSwitcherPill onLanguageChange={handleLanguageChange} />
      </LanguageProvider>
    );

    const arBtn = screen.getByTestId('lang-btn-ar');
    fireEvent.click(arBtn);

    expect(handleLanguageChange).toHaveBeenCalledWith('ar');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });

  it('switches to Spanish and Russian with LTR direction', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcherPill />
      </LanguageProvider>
    );

    const esBtn = screen.getByTestId('lang-btn-es');
    fireEvent.click(esBtn);
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    expect(document.documentElement.getAttribute('lang')).toBe('es');

    const ruBtn = screen.getByTestId('lang-btn-ru');
    fireEvent.click(ruBtn);
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    expect(document.documentElement.getAttribute('lang')).toBe('ru');
  });
});
