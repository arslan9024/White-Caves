import React, { FC } from 'react';
import { ConflictResolution } from '../../utils/offlineCRDT';

const GOLD = '#D4AF37';
const DARK_SLATE = '#1E293B';
const WHITE = '#FFFFFF';
const AMBER_BG = 'rgba(212, 175, 55, 0.12)';

interface ConflictNotificationToastProps {
  conflicts: ConflictResolution[];
  onDismiss: () => void;
}

export const ConflictNotificationToast: FC<ConflictNotificationToastProps> = ({
  conflicts,
  onDismiss,
}) => {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '420px',
        width: '100%',
        background: DARK_SLATE,
        color: WHITE,
        borderRadius: '12px',
        border: `2px solid ${GOLD}`,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        padding: '16px',
        zIndex: 9999,
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem', color: GOLD }}>⚡</span>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: GOLD, letterSpacing: '0.5px' }}>
            CRDT Offline Conflict Resolved
          </h4>
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0 4px',
          }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--color-cbd5e1, #CBD5E1)', margin: '0 0 12px 0' }}>
        {conflicts.length} field conflict{conflicts.length > 1 ? 's' : ''} auto-merged using Vector Timestamps (LWW).
      </p>

      <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {conflicts.map((c, idx) => (
          <div
            key={idx}
            style={{
              background: AMBER_BG,
              borderRadius: '8px',
              padding: '8px 12px',
              border: `1px solid ${GOLD}44`,
              fontSize: '0.75rem',
            }}
          >
            <div style={{ fontWeight: 700, color: GOLD, marginBottom: '2px' }}>Field: {c.key}</div>
            <div style={{ color: 'var(--color-e2e8f0, #E2E8F0)' }}>
              <strong>Winning Value:</strong>{' '}
              {typeof c.winningValue === 'object' ? JSON.stringify(c.winningValue) : String(c.winningValue)}
            </div>
            <div style={{ color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.7rem', marginTop: '2px' }}>
              Winner: {c.winningClient} · {new Date(c.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onDismiss}
          style={{
            background: GOLD,
            color: DARK_SLATE,
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Acknowledge Resolution
        </button>
      </div>
    </div>
  );
};
