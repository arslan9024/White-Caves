/**
 * MDCommandStrip.tsx
 *
 * L5 executive chip strip for Managing Director sovereign landing.
 * Visible only when isManagingDirector is true (founder email / MD role).
 */

import React, { FC } from 'react';

export interface MDCommandStripProps {
  mdName?: string;
  mdEmail?: string | null;
  onOpenModule?: (moduleId: string) => void;
  /** @deprecated use onOpenModule */
  onLaunch?: (moduleId: string) => void;
}

const CHIPS: { id: string; label: string; icon: string; tone: string }[] = [
  { id: 'theodora', label: 'Treasury', icon: '\ud83d\udcb0', tone: '#10B981' },
  { id: 'compliance', label: 'Compliance', icon: '\u2696\ufe0f', tone: '#6366F1' },
  { id: 'overview', label: 'Override Desk', icon: '\u26a1', tone: '#EF4444' },
];

export const MDCommandStrip: FC<MDCommandStripProps> = ({
  mdName = 'Managing Director',
  mdEmail,
  onOpenModule,
  onLaunch,
}) => {
  const launch = onOpenModule || onLaunch;

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
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: '0.5rem' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#EF4444',
          }}
        >
          \ud83d\udc51 MD L5
        </span>
        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
          {mdName}
          {mdEmail ? ` \u00b7 ${mdEmail}` : ''}
        </span>
      </div>
      {CHIPS.map(chip => (
        <button
          key={chip.id}
          type="button"
          onClick={() => launch?.(chip.id)}
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
