/**
 * VerificationBadge tests — W18.1-P0-012
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { VerificationBadge } from './VerificationBadge';

const VERIFIED_DATE = new Date('2025-03-15T10:00:00Z');

describe('VerificationBadge', () => {
  it('renders "Verified" when verifiedAt is set', () => {
    render(<VerificationBadge verifiedAt={VERIFIED_DATE} />);
    expect(screen.getByTestId('verification-badge')).toHaveTextContent('Verified');
  });

  it('renders "Unverified" when verifiedAt is null', () => {
    render(<VerificationBadge verifiedAt={null} />);
    expect(screen.getByTestId('verification-badge')).toHaveTextContent('Unverified');
  });

  it('renders "Unverified" when verifiedAt is undefined', () => {
    render(<VerificationBadge />);
    expect(screen.getByTestId('verification-badge')).toHaveTextContent('Unverified');
  });

  it('has role=img for accessibility', () => {
    render(<VerificationBadge verifiedAt={VERIFIED_DATE} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('has accessible aria-label when verified', () => {
    render(<VerificationBadge verifiedAt={VERIFIED_DATE} verifiedBy="Ahmed Al Rashid" />);
    const badge = screen.getByTestId('verification-badge');
    expect(badge).toHaveAttribute('aria-label');
    expect(badge.getAttribute('aria-label')).toMatch(/verified/i);
    expect(badge.getAttribute('aria-label')).toMatch(/Ahmed Al Rashid/);
  });

  it('has accessible aria-label when unverified', () => {
    render(<VerificationBadge verifiedAt={null} />);
    const badge = screen.getByTestId('verification-badge');
    expect(badge.getAttribute('aria-label')).toMatch(/not yet verified/i);
  });

  it('shows tooltip with date and agent when showTooltip=true', () => {
    render(<VerificationBadge verifiedAt={VERIFIED_DATE} verifiedBy="Sara Mohammed" showTooltip />);
    const badge = screen.getByTestId('verification-badge');
    expect(badge.getAttribute('title')).toMatch(/Verified on/);
    expect(badge.getAttribute('title')).toMatch(/Sara Mohammed/);
  });

  it('includes verificationNotes in tooltip', () => {
    render(
      <VerificationBadge
        verifiedAt={VERIFIED_DATE}
        verifiedBy="Sara"
        verificationNotes="Title deed checked"
        showTooltip
      />,
    );
    const badge = screen.getByTestId('verification-badge');
    expect(badge.getAttribute('title')).toMatch(/Title deed checked/);
  });

  it('no tooltip title when showTooltip is false', () => {
    render(<VerificationBadge verifiedAt={VERIFIED_DATE} verifiedBy="Sara" showTooltip={false} />);
    const badge = screen.getByTestId('verification-badge');
    expect(badge.getAttribute('title')).toBeFalsy();
  });

  it('data-verified attribute reflects verified state', () => {
    render(<VerificationBadge verifiedAt={VERIFIED_DATE} />);
    expect(screen.getByTestId('verification-badge').dataset.verified).toBe('true');
  });

  it('data-verified attribute is false when unverified', () => {
    render(<VerificationBadge verifiedAt={null} />);
    expect(screen.getByTestId('verification-badge').dataset.verified).toBe('false');
  });
});
