/**
 * FreshnessBadge — W18.1-P0-012
 * Shows listing freshness based on lastRefreshedAt or createdAt.
 */

import React from 'react';
import { Clock } from 'lucide-react';

export interface FreshnessBadgeProps {
  lastRefreshedAt?: string | Date | null;
  createdAt: string | Date;
  size?: 'sm' | 'md';
}

function daysSince(d: string | Date): number {
  const date = typeof d === 'string' ? new Date(d) : d;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

type FreshnessTier = 'Fresh' | 'Recent' | 'Aging' | 'Stale';

function getTier(days: number): FreshnessTier {
  if (days <= 7) return 'Fresh';
  if (days <= 30) return 'Recent';
  if (days <= 90) return 'Aging';
  return 'Stale';
}

const TIER_COLORS: Record<FreshnessTier, { color: string; bg: string }> = {
  Fresh: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  Recent: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Aging: { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  Stale: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  lastRefreshedAt,
  createdAt,
  size = 'md',
}) => {
  const refDate = lastRefreshedAt ?? createdAt;
  const days = daysSince(refDate);
  const tier = getTier(days);
  const { color, bg } = TIER_COLORS[tier];
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      role="img"
      aria-label={`Listing freshness: ${tier}, last updated ${days} days ago`}
      data-testid="freshness-badge"
      data-tier={tier}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '2px 6px' : '4px 10px',
        borderRadius: 20,
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        color,
        backgroundColor: bg,
        border: `1px solid ${color}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Clock size={iconSize} aria-hidden="true" />
      {tier}
    </span>
  );
};

export default FreshnessBadge;
