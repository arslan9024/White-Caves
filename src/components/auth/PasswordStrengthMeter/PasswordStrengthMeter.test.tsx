import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

describe('PasswordStrengthMeter Component', () => {
  it('renders password strength meter and calculates entropy score', () => {
    const { rerender } = render(<PasswordStrengthMeter password="weak" />);
    expect(screen.getByTestId('password-strength-meter')).toBeDefined();
    expect(screen.getByText(/Too Weak/i)).toBeDefined();

    rerender(<PasswordStrengthMeter password="WhiteCaves#2026!" />);
    expect(screen.getByText(/Enterprise Grade \(AES Ready\)/i)).toBeDefined();
  });
});
