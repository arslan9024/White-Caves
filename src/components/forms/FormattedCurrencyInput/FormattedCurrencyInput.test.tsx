import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormattedCurrencyInput } from './FormattedCurrencyInput';

describe('FormattedCurrencyInput Component', () => {
  it('renders formatted currency input and formats numeric value', () => {
    render(<FormattedCurrencyInput />);
    expect(screen.getByTestId('formatted-currency-input')).toBeDefined();
    expect(screen.getByText('AED')).toBeDefined();

    const input = screen.getByDisplayValue('1,500,000') as HTMLInputElement;
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: '3500000' } });
    expect(input.value).toBe('3,500,000');
  });
});
