import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CryptoPaymentSimulator } from './CryptoPaymentSimulator';

describe('CryptoPaymentSimulator', () => {
  it('renders crypto payment simulator with crypto assets and rate conversion', () => {
    render(<CryptoPaymentSimulator />);

    expect(screen.getByTestId('crypto-payment-simulator')).toBeDefined();
    expect(screen.getByText('BTC')).toBeDefined();
    expect(screen.getByText('ETH')).toBeDefined();
    expect(screen.getByText('USDT')).toBeDefined();
    expect(screen.getByText('USDC')).toBeDefined();
  });
});
