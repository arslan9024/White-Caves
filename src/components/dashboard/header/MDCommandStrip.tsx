/**
 * MDCommandStrip.tsx
 *
 * L5 executive chip strip for Managing Director sovereign landing.
 * Visible only when isManagingDirector is true (founder email / MD role).
 */

import React, { FC } from 'react';

export interface MDCommandStripProps {
  onLaunch?: (moduleId: string) => void;
}

const CHIPS: { id: string; label: string; icon: string; tone: string }[] = [
  { id: 'theodora', label: 'Treasury', icon: '💰', tone: '#10B981' },
  { id: 'compliance', label: 'Compliance', icon: '⚖️', tone: '#6366F1' },
  { id: 'overview', label: 'Override Desk', icon: '⚡', tone: '#EF4444' },
];

export const MDCommandStrip: FC<MDCommandStripProps> = ({ onLaunch }) => {
  return (
    <div
      data-testid="md-command-strip"
      role="region"
      aria-label="Managing Director Command Strip"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        padding: '0.55rem 0.85rem',
        marginBottom: '0.75rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(15,23,42,0.06) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
      }}
    >
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#EF4444',
          marginRight: '0.35rem',
        }}
      >
        👑 MD L5
      </span>
      {CHIPS.map(chip => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onLaunch?.(chip.id)}
          title={chip.label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '999px',
            border: `1px solid ${chip.tone}55`,
            background: '#0F172A',
            color: '#F8FAFC',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(15,23,42,0.15)',
          }}
        >
          <span aria-hidden>{chip.icon}</span>
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default MDCommandStrip;
