import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CredentialCountdownBadge } from './CredentialCountdownBadge';

describe('CredentialCountdownBadge Component', () => {
  it('renders governing credentials renewal countdown badge and license timers', () => {
    render(<CredentialCountdownBadge />);
    expect(screen.getByTestId('credential-countdown-badge')).toBeDefined();
    expect(screen.getByText(/Governing Credentials Renewal Countdown/i)).toBeDefined();
    expect(screen.getByText(/DET License/i)).toBeDefined();
    expect(screen.getByText(/RERA ORN/i)).toBeDefined();
    expect(screen.getByText(/HQ Ejari/i)).toBeDefined();
    expect(screen.getByText(/ICP Card/i)).toBeDefined();
    expect(screen.getByText(/All Active/i)).toBeDefined();
  });
});
