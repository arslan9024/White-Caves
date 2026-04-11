/**
 * Dashboard Sub-Tab Shared Styles & Utilities
 * ─────────────────────────────────────────────
 * Common inline style objects and helpers used across all role dashboard tabs.
 * Keeps components DRY and visually consistent.
 */

import React from 'react';
import { formatDate, formatCurrency as formatCurrencyBase } from '../../utils';

// ─── Common Layout Styles ────────────────────────────────────────────

export const tabContainer: React.CSSProperties = {
  padding: '1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
};

export const pageHeader: React.CSSProperties = {
  marginBottom: '1.5rem',
};

export const headerTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 700,
  margin: 0,
  color: 'var(--color-text, #111827)',
};

export const headerSubtitle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--color-text-secondary, #6b7280)',
  marginTop: '0.25rem',
};

export const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  marginBottom: '1.5rem',
};

export const statCard: React.CSSProperties = {
  background: 'var(--color-surface, #fff)',
  border: '1px solid var(--color-border, #e5e7eb)',
  borderRadius: '12px',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

export const statValue: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'var(--color-text, #111827)',
};

export const statLabel: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--color-text-secondary, #6b7280)',
};

export const card: React.CSSProperties = {
  background: 'var(--color-surface, #fff)',
  border: '1px solid var(--color-border, #e5e7eb)',
  borderRadius: '12px',
  padding: '1.25rem',
  marginBottom: '1rem',
};

export const cardTitle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 600,
  margin: '0 0 0.75rem 0',
};

export const listGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '1rem',
};

export const tableWrapper: React.CSSProperties = {
  overflowX: 'auto',
  borderRadius: '12px',
  border: '1px solid var(--color-border, #e5e7eb)',
  background: 'var(--color-surface, #fff)',
};

export const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
};

export const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-secondary, #6b7280)',
  borderBottom: '1px solid var(--color-border, #e5e7eb)',
  background: 'var(--color-surface-hover, #f9fafb)',
};

export const td: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid var(--color-border, #f3f4f6)',
};

export const badge = (color: string, bg: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 500,
  color,
  background: bg,
});

export const btnPrimary: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  background: 'var(--color-primary, #D4AF37)',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
};

export const btnSecondary: React.CSSProperties = {
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  border: '1px solid var(--color-border, #e5e7eb)',
  background: 'var(--color-surface, #fff)',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

export const emptyState = (icon: string, title: string, subtitle: string): React.ReactNode => (
  <div
    style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'var(--color-surface, #f9fafb)',
      borderRadius: '12px',
      border: '2px dashed var(--color-border, #e5e7eb)',
    }}
  >
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text, #111827)' }}>{title}</h3>
    <p style={{ color: 'var(--color-text-secondary, #6b7280)', maxWidth: '420px', margin: '0 auto' }}>
      {subtitle}
    </p>
  </div>
);

export const loadingState: React.ReactNode = (
  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-secondary, #6b7280)' }}>
    Loading…
  </div>
);

export const errorState = (message: string, onRetry?: () => void): React.ReactNode => (
  <div
    style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      background: '#fef2f2',
      borderRadius: '12px',
      border: '1px solid #fecaca',
    }}
  >
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
    <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} style={btnPrimary}>
        Retry
      </button>
    )}
  </div>
);

// ─── Date/Currency Formatting ────────────────────────────────────────
// formatDate is re-exported directly from utils (identical behavior)
export { formatDate };

/** Dashboard-specific formatCurrency: returns '—' for null (vs 'AED 0' in utils) */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return formatCurrencyBase(amount);
}

export function formatStatus(status: string): string {
  return status.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
