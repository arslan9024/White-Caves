import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiCurrencyEscrowVault } from './MultiCurrencyEscrowVault';

describe('MultiCurrencyEscrowVault Component', () => {
  it('renders default AED escrow balance and currency selection pills', () => {
    render(<MultiCurrencyEscrowVault />);
    expect(screen.getByTestId('multi-currency-escrow-vault')).toBeDefined();
    expect(screen.getByText(/Multi-Currency Escrow Vault/i)).toBeDefined();
    expect(screen.getAllByText(/5,500,000/i).length).toBeGreaterThan(0);
  });

  it('switches currency dynamically to USD on click', () => {
    render(<MultiCurrencyEscrowVault />);
    const usdBtn = screen.getByText('USD');
    fireEvent.click(usdBtn);
    expect(screen.getAllByText(/USD 1,497,650/i).length).toBeGreaterThan(0);
  });
});
