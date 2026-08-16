import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LicenseCountdownBadges } from './LicenseCountdownBadges';

describe('LicenseCountdownBadges Component', () => {
  it('renders regulatory licenses and countdown badges', () => {
    render(<LicenseCountdownBadges />);
    expect(screen.getByTestId('license-countdown-badges')).toBeDefined();
    expect(screen.getByText(/Statutory Regulatory Licenses & DET\/RERA Validity Badges/i)).toBeDefined();
    expect(screen.getByText(/ALL CREDENTIALS ACTIVE/i)).toBeDefined();
    expect(screen.getByText(/DET Commercial License/i)).toBeDefined();
    expect(screen.getByText(/#1388443/i)).toBeDefined();
    expect(screen.getByText(/RERA Brokerage ORN/i)).toBeDefined();
    expect(screen.getByText(/#44483/i)).toBeDefined();
  });
});
