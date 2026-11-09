/**
 * ErmsRbacSecurityLedger.test.tsx
 * Targeted Vitest test suite for ErmsRbacSecurityLedger
 * Verifies RBAC data masking, authorized unmasking, and SHA-256 ledger rendering
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsRbacSecurityLedger } from './ErmsRbacSecurityLedger';

describe('ErmsRbacSecurityLedger (Pillar 10 Verification)', () => {
  it('renders PII attributes in masked format for standard brokers (L2)', () => {
    render(<ErmsRbacSecurityLedger currentRole="L2_SENIOR_BROKER" />);

    expect(screen.getByText('Granular RBAC Clearance & SHA-256 Ledger')).toBeInTheDocument();
    expect(screen.getByText('Sensitive Entity Attributes (PII Redaction)')).toBeInTheDocument();

    // Verify phone is masked
    const maskedPhone = screen.getByText(/\+97••••••••4567/);
    expect(maskedPhone).toBeInTheDocument();

    // L2 cannot see the reveal button
    expect(screen.queryByRole('button', { name: /Reveal/ })).toBeNull();
  });

  it('allows authorized Managing Directors (L5) to reveal unmasked PII', () => {
    render(<ErmsRbacSecurityLedger currentRole="L5_MANAGING_DIRECTOR" />);

    const revealBtn = screen.getByRole('button', { name: /Reveal/ });
    expect(revealBtn).toBeInTheDocument();

    fireEvent.click(revealBtn);

    expect(screen.getByText('+971 50 123 4567')).toBeInTheDocument();
    expect(screen.getByText('N98214710')).toBeInTheDocument();
  });

  it('renders cryptographic SHA-256 hashes for all mutation ledger entries', () => {
    render(<ErmsRbacSecurityLedger />);

    expect(screen.getByText(/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855/)).toBeInTheDocument();
    expect(screen.getByText(/8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4/)).toBeInTheDocument();
  });
});
