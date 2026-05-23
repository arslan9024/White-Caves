/**
 * Skeleton — Animated placeholder for loading states
 *
 * Prevents CLS by reserving exact space for content that hasn't loaded yet.
 * Uses a shimmer animation to indicate loading state.
 *
 * Usage:
 *   <Skeleton width={300} height={200} />                   // Fixed size
 *   <Skeleton width="100%" height={48} borderRadius="8px" /> // Fluid width
 *   <Skeleton variant="text" />                              // Text line
 *   <Skeleton variant="circle" width={48} />                 // Avatar
 *   <Skeleton variant="card" />                              // Card shape
 *
 * @module components/ui/Skeleton
 */

import React, { memo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { spacing } from '../../../styles/theme/spacing';

/* ──────────────────────────── Types ───────────────────────────── */

export interface SkeletonProps {
  /** Width in px or CSS string (default: '100%') */
  width?: number | string;
  /** Height in px or CSS string (default: based on variant) */
  height?: number | string;
  /** Border radius (default: based on variant) */
  borderRadius?: string;
  /** Preset shape variant */
  variant?: 'rect' | 'text' | 'circle' | 'card';
  /** Whether to animate (default: true) */
  animated?: boolean;
  /** Number of skeleton lines for variant="text" (default: 1) */
  lines?: number;
  /** Additional className */
  className?: string;
  /** aria-label for screen readers */
  'aria-label'?: string;
}

/* ──────────────────────────── Animation ───────────────────────── */

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* ──────────────────────────── Variants ────────────────────────── */

const VARIANT_DEFAULTS: Record<string, { width: string; height: string; borderRadius: string }> = {
  rect: { width: '100%', height: '200px', borderRadius: '8px' },
  text: { width: '100%', height: '16px', borderRadius: '4px' },
  circle: { width: '48px', height: '48px', borderRadius: '50%' },
  card: { width: '100%', height: '200px', borderRadius: '12px' },
};

/* ──────────────────────────── Styled ──────────────────────────── */

const SkeletonBlock = styled.div<{
  $w: string;
  $h: string;
  $br: string;
  $animated: boolean;
}>`
  display: block;
  background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  width: ${({ $w }) => $w};
  height: ${({ $h }) => $h};
  border-radius: ${({ $br }) => $br};

  ${({ $animated }) =>
    $animated
      ? css`
          animation: ${shimmer} 1.5s ease-in-out infinite;
        `
      : css`
          animation: none;
        `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  width: 100%;
`;

/* ──────────────────────────── Component ───────────────────────── */

function formatDimension(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Skeleton — Animated shimmer placeholder to prevent CLS.
 * Respects prefers-reduced-motion for accessibility.
 */
export const Skeleton: React.FC<SkeletonProps> = memo(function Skeleton({
  width,
  height,
  borderRadius,
  variant = 'rect',
  animated = true,
  lines = 1,
  className,
  'aria-label': ariaLabel,
}) {
  const defaults = VARIANT_DEFAULTS[variant] || VARIANT_DEFAULTS.rect;

  const w = width ? formatDimension(width) : defaults.width;
  const h = height ? formatDimension(height) : defaults.height;
  const br = borderRadius ?? defaults.borderRadius;

  // Multi-line text skeleton
  if (variant === 'text' && lines > 1) {
    return (
      <TextGroup
        role="status"
        aria-label={ariaLabel || 'Loading content'}
        aria-busy="true"
        className={className}
        data-testid="skeleton"
      >
        {Array.from({ length: lines }, (_, i) => (
          <SkeletonBlock
            key={i}
            $w={i === lines - 1 ? '60%' : '100%'}
            $h={h}
            $br={br}
            $animated={animated}
          />
        ))}
      </TextGroup>
    );
  }

  return (
    <SkeletonBlock
      role="status"
      aria-label={ariaLabel || 'Loading content'}
      aria-busy="true"
      className={className}
      data-testid="skeleton"
      $w={w}
      $h={h}
      $br={br}
      $animated={animated}
    />
  );
});

export default Skeleton;
