import React from 'react';

export type SignatureStatus = 'pending' | 'sent' | 'opened' | 'signed' | 'rejected' | 'expired';

interface SigningStatusBadgeProps {
  status?: SignatureStatus;
}

const STATUS_STYLE: Record<SignatureStatus, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: 'signature-badge--pending', color: '' },
  sent: { label: 'Sent', bg: 'signature-badge--sent', color: '' },
  opened: { label: 'Opened', bg: 'signature-badge--opened', color: '' },
  signed: { label: 'Signed', bg: 'signature-badge--signed', color: '' },
  rejected: { label: 'Rejected', bg: 'signature-badge--rejected', color: '' },
  expired: { label: 'Expired', bg: 'signature-badge--expired', color: '' },
};

const SigningStatusBadge: React.FC<SigningStatusBadgeProps> = ({ status = 'pending' }) => {
  const style = STATUS_STYLE[status];

  return (
    <span
      className={`signature-badge ${style.bg}`}
      aria-label={`Signature status: ${style.label}`}
      title={`Signature status: ${style.label}`}
    >
      {style.label}
    </span>
  );
};

export default SigningStatusBadge;
