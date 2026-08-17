import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyProvider, useGlobalCurrency } from './CurrencyContext';
import { safeStorage } from '../utils/safeStorage';

const TestCurrencyComponent = () => {
  const { currency, setCurrency, formatPrice } = useGlobalCurrency();

  return (
    <div>
      <span data-testid="active-currency">{currency}</span>
      <span data-testid="formatted-price">{formatPrice(3672500)}</span>
      <button data-testid="btn-set-usd" onClick={() => setCurrency('USD')}>Set USD</button>
      <button data-testid="btn-set-eur" onClick={() => setCurrency('EUR')}>Set EUR</button>
      <button data-testid="btn-set-gbp" onClick={() => setCurrency('GBP')}>Set GBP</button>
      <button data-testid="btn-set-aed" onClick={() => setCurrency('AED')}>Set AED</button>
    </div>
  );
};

describe('CurrencyContext & Global Multi-Currency Engine', () => {
  beforeEach(() => {
    safeStorage.remove('whitecaves_currency');
  });

  it('initializes with AED by default', () => {
    render(
      <CurrencyProvider>
        <TestCurrencyComponent />
      </CurrencyProvider>
    );

    expect(screen.getByTestId('active-currency').textContent).toBe('AED');
    expect(screen.getByTestId('formatted-price').textContent).toContain('AED');
  });

  it('switches currency to USD and formats accurately', () => {
    render(
      <CurrencyProvider>
        <TestCurrencyComponent />
      </CurrencyProvider>
    );

    fireEvent.click(screen.getByTestId('btn-set-usd'));
    expect(screen.getByTestId('active-currency').textContent).toBe('USD');
    expect(screen.getByTestId('formatted-price').textContent).toContain('$');
  });

  it('switches currency to EUR and GBP', () => {
    render(
      <CurrencyProvider>
        <TestCurrencyComponent />
      </CurrencyProvider>
    );

    fireEvent.click(screen.getByTestId('btn-set-eur'));
    expect(screen.getByTestId('active-currency').textContent).toBe('EUR');
    expect(screen.getByTestId('formatted-price').textContent).toContain('€');

    fireEvent.click(screen.getByTestId('btn-set-gbp'));
    expect(screen.getByTestId('active-currency').textContent).toBe('GBP');
    expect(screen.getByTestId('formatted-price').textContent).toContain('£');
  });
});
