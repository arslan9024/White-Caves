/**
 * Shadow Elevations
 * Material Design inspired shadow system for depth
 * Luxury collection uses gold-tinted glows for premium feel
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',

  // Interactive shadows
  hover: '0 8px 12px rgba(0, 0, 0, 0.15)',
  active: '0 2px 4px rgba(0, 0, 0, 0.1)',
  focus: '0 0 0 3px rgba(16, 185, 129, 0.2), 0 0 0 0.25rem rgba(16, 185, 129, 0.4)',

  // Component-specific
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  modal: '0 20px 25px rgba(0, 0, 0, 0.15)',
  dropdown: '0 10px 15px rgba(0, 0, 0, 0.12)',
  navbar: '0 1px 3px rgba(0, 0, 0, 0.12)',
  sidebar: '1px 0 3px rgba(0, 0, 0, 0.08)',

  // Brand gold/emerald tinted shadows
  luxuryCard: '0 4px 16px rgba(201, 168, 76, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)',
  luxuryHover: '0 8px 24px rgba(201, 168, 76, 0.18), 0 4px 8px rgba(0, 0, 0, 0.08)',
  luxuryGlow: '0 0 20px rgba(201, 168, 76, 0.25)',
  luxuryFocus: '0 0 0 3px rgba(16, 185, 129, 0.3)',
  luxuryElevated: '0 12px 32px rgba(201, 168, 76, 0.15), 0 4px 12px rgba(16, 185, 129, 0.08)',
};

export type Shadows = typeof shadows;
