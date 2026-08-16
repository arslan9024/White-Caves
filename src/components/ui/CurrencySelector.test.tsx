import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CurrencySelector } from './CurrencySelector.js';

describe('CurrencySelector Component — Wave 40 (W40-006)', () => {
  it('renders dropdown with default currency selected', () => {
    render(<CurrencySelector currentCurrency="AED" />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('AED');
  });

  it('triggers onCurrencyChange when new currency selected', () => {
    const handleCurrencyChange = vi.fn();
    render(<CurrencySelector currentCurrency="AED" onCurrencyChange={handleCurrencyChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'USD' } });

    expect(handleCurrencyChange).toHaveBeenCalledWith('USD');
  });
});
