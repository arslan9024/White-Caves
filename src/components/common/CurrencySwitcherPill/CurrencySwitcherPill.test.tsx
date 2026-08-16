import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencySwitcherPill } from './CurrencySwitcherPill';

describe('CurrencySwitcherPill Component', () => {
  it('renders currency switcher pill and handles currency switching', () => {
    const onCurrencyChange = vi.fn();
    render(<CurrencySwitcherPill onCurrencyChange={onCurrencyChange} />);
    expect(screen.getByTestId('currency-switcher-pill')).toBeDefined();
    expect(screen.getByText('AED')).toBeDefined();
    expect(screen.getByText('USD')).toBeDefined();

    const usdBtn = screen.getByText('USD');
    fireEvent.click(usdBtn);
    expect(onCurrencyChange).toHaveBeenCalledWith('USD');
  });
});
