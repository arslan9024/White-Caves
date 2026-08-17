import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage, LANGUAGES } from './LanguageContext';
import { safeStorage } from '../utils/safeStorage';

const TestComponent = () => {
  const { language, setLanguage, isRTL, t, formatNumber, formatCurrency } = useLanguage();

  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="is-rtl">{String(isRTL)}</span>
      <span data-testid="t-home">{t('common.home')}</span>
      <span data-testid="t-properties">{t('common.properties')}</span>
      <span data-testid="t-chatbot-match">{t('chatbot.foundProperties', { count: 12 })}</span>
      <span data-testid="formatted-num">{formatNumber(1250000)}</span>
      <span data-testid="formatted-curr">{formatCurrency(5000000)}</span>

      <button data-testid="btn-set-ar" onClick={() => setLanguage(LANGUAGES.AR)}>
        Set Arabic
      </button>
      <button data-testid="btn-set-es" onClick={() => setLanguage(LANGUAGES.ES)}>
        Set Spanish
      </button>
      <button data-testid="btn-set-ru" onClick={() => setLanguage(LANGUAGES.RU)}>
        Set Russian
      </button>
      <button data-testid="btn-set-en" onClick={() => setLanguage(LANGUAGES.EN)}>
        Set English
      </button>
    </div>
  );
};

describe('LanguageContext and Universal Translation Engine', () => {
  beforeEach(() => {
    safeStorage.remove('whitecaves_language');
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
  });

  it('initializes with English by default and renders English translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByTestId('is-rtl').textContent).toBe('false');
    expect(screen.getByTestId('t-home').textContent).toBe('Home');
    expect(screen.getByTestId('t-properties').textContent).toBe('Properties');
    expect(screen.getByTestId('t-chatbot-match').textContent).toBe('I found 12 properties matching your requirements');
  });

  it('switches to Arabic, enables RTL layout, and updates translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('btn-set-ar'));

    expect(screen.getByTestId('current-lang').textContent).toBe('ar');
    expect(screen.getByTestId('is-rtl').textContent).toBe('true');
    expect(screen.getByTestId('t-home').textContent).toBe('الرئيسية');
    expect(screen.getByTestId('t-properties').textContent).toBe('العقارات');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('ar');
  });

  it('switches to Spanish and renders Spanish translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('btn-set-es'));

    expect(screen.getByTestId('current-lang').textContent).toBe('es');
    expect(screen.getByTestId('is-rtl').textContent).toBe('false');
    expect(screen.getByTestId('t-home').textContent).toBe('Inicio');
    expect(screen.getByTestId('t-properties').textContent).toBe('Propiedades');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    expect(document.documentElement.getAttribute('lang')).toBe('es');
  });

  it('switches to Russian and renders Russian translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('btn-set-ru'));

    expect(screen.getByTestId('current-lang').textContent).toBe('ru');
    expect(screen.getByTestId('is-rtl').textContent).toBe('false');
    expect(screen.getByTestId('t-home').textContent).toBe('Главная');
    expect(screen.getByTestId('t-properties').textContent).toBe('Недвижимость');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    expect(document.documentElement.getAttribute('lang')).toBe('ru');
  });
});
