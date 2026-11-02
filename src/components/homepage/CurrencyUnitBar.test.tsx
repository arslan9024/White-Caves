import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyUnitBar from './CurrencyUnitBar';

describe('CurrencyUnitBar Component', () => {
  it('renders currencies and units', () => {
    render(<CurrencyUnitBar />);
    expect(screen.getByText('AED')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('GBP')).toBeInTheDocument();
    expect(screen.getByText('SqFt')).toBeInTheDocument();
    expect(screen.getByText('SqM')).toBeInTheDocument();
  });

  it('triggers onCurrencyChange when a currency is selected', () => {
    const handleCurrency = vi.fn();
    render(<CurrencyUnitBar onCurrencyChange={handleCurrency} />);

    const usdBtn = screen.getByText('USD');
    fireEvent.click(usdBtn);

    expect(handleCurrency).toHaveBeenCalledWith('USD');
  });

  it('triggers onUnitChange when a unit is selected', () => {
    const handleUnit = vi.fn();
    render(<CurrencyUnitBar onUnitChange={handleUnit} />);

    const sqmBtn = screen.getByText('SqM');
    fireEvent.click(sqmBtn);

    expect(handleUnit).toHaveBeenCalledWith('SqM');
  });
});
