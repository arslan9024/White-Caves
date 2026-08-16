import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TwoFactorAuthSetupCard } from './TwoFactorAuthSetupCard';

describe('TwoFactorAuthSetupCard Component', () => {
  it('renders 2FA setup card and enables two-factor authentication', () => {
    render(<TwoFactorAuthSetupCard />);
    expect(screen.getByTestId('two-factor-auth-setup-card')).toBeDefined();
    expect(screen.getByText(/Two-Factor Authentication \(2FA \/ TOTP\) Hardening/i)).toBeDefined();
    expect(screen.getByText(/SETUP REQUIRED/i)).toBeDefined();
    expect(screen.getByText(/Scan QR Code with your Authenticator App/i)).toBeDefined();
    expect(screen.getByText(/WC7X-99K2-M39A-8843/i)).toBeDefined();

    const enableBtn = screen.getByRole('button', { name: /Enable 2FA/i });
    fireEvent.click(enableBtn);
    expect(screen.getByText(/2FA ENFORCED/i)).toBeDefined();
    expect(screen.getByText(/✓ Verified/i)).toBeDefined();
  });
});
