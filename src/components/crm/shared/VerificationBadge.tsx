/**
 * VerificationBadge — W18.1-P0-012
 * Shows verified / unverified status for a property listing.
 */

import React from 'react';
import { ShieldCheck, ShieldOff } from 'lucide-react';

export interface VerificationBadgeProps {
  verifiedAt?: string | Date | null;
  verifiedBy?: string | null;
  verificationNotes?: string | null;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

function formatDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verifiedAt,
  verifiedBy,
  verificationNotes,
  size = 'md',
  showTooltip = false,
}) => {
  const isVerified = !!verifiedAt;
  const iconSize = size === 'sm' ? 14 : 16;

  const label = isVerified ? 'Verified' : 'Unverified';
  const color = isVerified ? '#22c55e' : '#6b7280';
  const bgColor = isVerified ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)';

  let tooltipText = '';
  if (showTooltip && isVerified) {
    tooltipText = `Verified on ${formatDate(verifiedAt!)}`;
    if (verifiedBy) tooltipText += ` by ${verifiedBy}`;
    if (verificationNotes) tooltipText += ` — ${verificationNotes}`;
  }

  const ariaLabel = isVerified
    ? `Listing verified on ${formatDate(verifiedAt!)}${verifiedBy ? ` by ${verifiedBy}` : ''}`
    : 'Listing not yet verified';

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      title={tooltipText || undefined}
      data-testid="verification-badge"
      data-verified={isVerified}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '2px 6px' : '4px 10px',
        borderRadius: 20,
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        color,
        backgroundColor: bgColor,
        border: `1px solid ${color}`,
        whiteSpace: 'nowrap',
      }}
    >
      {isVerified ? (
        <ShieldCheck size={iconSize} aria-hidden="true" />
      ) : (
        <ShieldOff size={iconSize} aria-hidden="true" />
      )}
      {label}
    </span>
  );
};

export default VerificationBadge;
