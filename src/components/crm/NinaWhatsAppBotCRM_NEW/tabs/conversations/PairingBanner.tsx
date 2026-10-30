import React from 'react';

export interface PairingBannerProps {
  pairingCode: string;
}

export const PairingBanner: React.FC<PairingBannerProps> = ({ pairingCode }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '1.5px dashed #F59E0B',
        borderRadius: '14px',
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h5 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-b45309, #B45309)' }}>
          📱 Link Your WhatsApp Account (+971 50 576 0056) To Start Real Conversation Sync
        </h5>
        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-92400e, #92400E)', lineHeight: 1.45 }}>
          Open WhatsApp on your phone ➔ <strong>Settings ➔ Linked Devices ➔ Link a Device</strong>. Enter pairing code <strong style={{ fontFamily: 'monospace', background: 'var(--white, #FFFFFF)', padding: '2px 6px', borderRadius: '4px' }}>{pairingCode}</strong> or scan QR in the <em>QR & Pairing Portal</em> tab.
        </p>
      </div>
    </div>
  );
};

