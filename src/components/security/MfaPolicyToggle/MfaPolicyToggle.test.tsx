import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MfaPolicyToggle } from './MfaPolicyToggle';

describe('MfaPolicyToggle Component', () => {
  it('renders MFA enterprise policy toggle and role tier policies', () => {
    render(<MfaPolicyToggle />);
    expect(screen.getByTestId('mfa-policy-toggle')).toBeDefined();
    expect(screen.getByText(/Enterprise MFA & TOTP Authentication Policy/i)).toBeDefined();
    expect(screen.getByText(/ZERO-TRUST ACCESS/i)).toBeDefined();
    expect(screen.getByText(/Level 5 Managing Director & Superuser \(Strict TOTP \/ Hardware Key\)/i)).toBeDefined();
  });
});
