import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UhnwPrivateVault } from './UhnwPrivateVault';

describe('UhnwPrivateVault Component', () => {
  it('renders biometric security gate before authentication', () => {
    render(<UhnwPrivateVault />);
    expect(screen.getByTestId('uhnw-private-vault')).toBeDefined();
    expect(screen.getByText(/UHNW Private Listing Vault/i)).toBeDefined();
    expect(screen.getByText(/Authenticate Access/i)).toBeDefined();
  });

  it('authenticates and unmasks off-market penthouses and private islands on scan', () => {
    render(<UhnwPrivateVault />);
    const authBtn = screen.getByRole('button', { name: /Authenticate Access/i });
    fireEvent.click(authBtn);
    const verifyBtn = screen.getByRole('button', { name: /Verify Identity/i });
    fireEvent.click(verifyBtn);
    expect(screen.getByText(/Sky Penthouse, Burj Khalifa/i)).toBeDefined();
    expect(screen.getByText(/Private Island Villa, World Islands/i)).toBeDefined();
  });
});
