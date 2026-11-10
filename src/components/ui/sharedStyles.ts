/**
 * sharedStyles.ts — Canonical Reusable Styled Components
 * Standard: AEGIS V5.0 Unified Design System (Dept 02 UI/UX Primitives)
 * Single Purpose File Law: < 350 lines
 *
 * Consolidates duplicated MetricCards, Grids, StatusBadges, and Action Buttons
 * with full Dark/Light theme, Context Triad, and White Caves Luxury Palette support.
 */

import styled, { css } from 'styled-components';

export const LuxuryPalette = {
  red: '#EF4444',
  white: '#FFFFFF',
  slateDark: '#0F172A',
  slateMedium: '#1E293B',
  slateLight: '#334155',
  slateBorder: '#334155',
  goldAccent: '#C9A84C',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};

// ── Metrics Grid Layout ──────────────────────────────────────────
export const SharedMetricsGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 'auto-fit'}, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// ── Metric Card Primitive ────────────────────────────────────────
export const SharedMetricCard = styled.div<{ $accent?: string; $interactive?: boolean }>`
  background: var(--color-surface, ${LuxuryPalette.slateMedium});
  border: 1px solid var(--color-border, ${LuxuryPalette.slateLight});
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  ${props =>
    props.$accent &&
    css`
      border-left: 4px solid ${props.$accent};
    `}

  ${props =>
    props.$interactive &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        border-color: var(--color-primary, ${LuxuryPalette.red});
      }
    `}
`;

export const SharedMetricValue = styled.div<{ $color?: string }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.$color || 'var(--color-text, ' + LuxuryPalette.textPrimary + ')'};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const SharedMetricLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary, ${LuxuryPalette.textSecondary});
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

// ── Status & Role Badges ─────────────────────────────────────────
export type SharedStatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'critical';

export const SharedStatusBadge = styled.span<{ $variant?: SharedStatusVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return css`
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'warning':
        return css`
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'error':
      case 'critical':
        return css`
          background: rgba(239, 68, 68, 0.15);
          color: ${LuxuryPalette.red};
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'info':
        return css`
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        `;
      default:
        return css`
          background: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
        `;
    }
  }}
`;

// ── Action Buttons ───────────────────────────────────────────────
export const SharedActionBtn = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;

  ${props => {
    switch (props.$variant) {
      case 'danger':
        return css`
          background: ${LuxuryPalette.red};
          color: #ffffff;
          &:hover {
            background: #dc2626;
          }
        `;
      case 'secondary':
        return css`
          background: transparent;
          border-color: var(--color-border, ${LuxuryPalette.slateLight});
          color: var(--color-text, ${LuxuryPalette.textPrimary});
          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        `;
      default:
        return css`
          background: ${LuxuryPalette.red};
          color: #ffffff;
          &:hover {
            background: #dc2626;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
