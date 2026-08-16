import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Totp2faSetupCard } from './Totp2faSetupCard';

describe('Totp2faSetupCard Component', () => {
  it('renders TOTP 2FA setup card and verifies valid 6-digit code', () => {
    render(<Totp2faSetupCard />);
    expect(screen.getByTestId('totp-2fa-setup-card')).toBeDefined();
    expect(screen.getByText(/Two-Factor Authentication/i)).toBeDefined();
    expect(screen.getByText(/PENDING SETUP/i)).toBeDefined();

    // Enter 6 digit token
    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '123456' } });

    const verifyBtn = screen.getByText('Verify Token');
    fireEvent.click(verifyBtn);

    expect(screen.getByText(/✓ ACTIVE/i)).toBeDefined();
    expect(screen.getByText(/2FA Security Enforced/i)).toBeDefined();
  });
});
