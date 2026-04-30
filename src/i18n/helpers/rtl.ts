import type { CSSProperties } from 'react';

interface LogicalSpacing {
  inlineStart?: string;
  inlineEnd?: string;
  blockStart?: string;
  blockEnd?: string;
}

/** Convert logical spacing to physical properties with RTL awareness. */
export const toPhysicalSpacing = (
  spacing: LogicalSpacing,
  isRTL: boolean
): CSSProperties => ({
  marginLeft: isRTL ? spacing.inlineEnd : spacing.inlineStart,
  marginRight: isRTL ? spacing.inlineStart : spacing.inlineEnd,
  marginTop: spacing.blockStart,
  marginBottom: spacing.blockEnd,
});

export const flipFlexDirection = (
  direction: 'row' | 'row-reverse',
  isRTL: boolean
): CSSProperties['flexDirection'] =>
  isRTL ? (direction === 'row' ? 'row-reverse' : 'row') : direction;

export const textAlignStart = (isRTL: boolean): CSSProperties['textAlign'] =>
  isRTL ? 'right' : 'left';
