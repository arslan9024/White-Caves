import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FXCurrencyConverter } from './FXCurrencyConverter';

describe('FXCurrencyConverter Component', () => {
  it('renders the title and default values', () => {
    render(<FXCurrencyConverter />);
    expect(screen.getByText(/Live FX Converter/i)).toBeInTheDocument();
    
    // AED input should be default 1000000
    const aedInput = screen.getByDisplayValue('1000000');
    expect(aedInput).toBeInTheDocument();
    
    // Check for USD conversion (1000000 * 0.27)
    expect(screen.getByDisplayValue('270,000')).toBeInTheDocument();
  });

  it('updates the converted value when input changes', () => {
    render(<FXCurrencyConverter />);
    const aedInput = screen.getByDisplayValue('1000000');
    
    fireEvent.change(aedInput, { target: { value: '2000000' } });
    
    // USD conversion for 2000000 is 540,000
    expect(screen.getByDisplayValue('540,000')).toBeInTheDocument();
  });

  it('changes target currency and recalculates', () => {
    render(<FXCurrencyConverter />);
    
    // Click EUR
    fireEvent.click(screen.getByText('EUR / AED').parentElement!);
    
    // 1000000 * 0.25 (EUR rate) = 250,000
    expect(screen.getByDisplayValue('250,000')).toBeInTheDocument();
  });
});
