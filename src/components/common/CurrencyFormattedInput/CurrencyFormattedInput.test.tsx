import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyFormattedInput } from './CurrencyFormattedInput';

describe('CurrencyFormattedInput Component', () => {
  it('renders currency formatted input and automatically formats numerical input with commas', () => {
    const onChange = vi.fn();
    render(<CurrencyFormattedInput value={1500000} currencyPrefix="AED" onChange={onChange} />);
    expect(screen.getByTestId('currency-formatted-input')).toBeDefined();
    expect(screen.getByText('AED')).toBeDefined();

    const input = screen.getByDisplayValue('1,500,000') as HTMLInputElement;
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: '25000000' } });
    expect(onChange).toHaveBeenCalledWith(25000000);
  });
});
