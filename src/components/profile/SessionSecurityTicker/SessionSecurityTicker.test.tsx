import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SessionSecurityTicker } from './SessionSecurityTicker';

describe('SessionSecurityTicker Component', () => {
  it('renders session security ticker and active cryptographic telemetry', () => {
    render(<SessionSecurityTicker />);
    expect(screen.getByTestId('session-security-ticker')).toBeDefined();
    expect(screen.getByText(/SECURE AES-256 SESSION/i)).toBeDefined();
    expect(screen.getByText(/194\.187\.168\.42 \(Dubai, UAE\)/i)).toBeDefined();
    expect(screen.getByText(/Chrome\/Blink Engine/i)).toBeDefined();
  });
});
