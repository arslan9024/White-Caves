import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TranslationProvider, useTranslation } from './TranslationContext';

const TestComponent = () => {
  const { t, setLanguage, language } = useTranslation();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="title">{t('hero.title')}</span>
      <button onClick={() => setLanguage('ar')}>Switch AR</button>
    </div>
  );
};

describe('TranslationContext Component', () => {
  it('renders default English translation correctly', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('title')).toHaveTextContent('Luxury Dubai Real Estate Redefined');
  });

  it('switches language dynamically to Arabic', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Switch AR/i }));
    expect(screen.getByTestId('lang')).toHaveTextContent('ar');
    expect(screen.getByTestId('title')).toHaveTextContent('إعادة تعريف العقارات الفاخرة في دبي');
  });
});
