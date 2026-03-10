/**
 * Shadow Elevations
 * Material Design inspired shadow system for depth
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
  focus: '0 0 0 3px rgba(99, 102, 241, 0.1), 0 0 0 0.25rem rgba(99, 102, 241, 0.5)',
  
  // Component-specific
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  modal: '0 20px 25px rgba(0, 0, 0, 0.15)',
  dropdown: '0 10px 15px rgba(0, 0, 0, 0.12)',
  navbar: '0 1px 3px rgba(0, 0, 0, 0.12)',
  sidebar: '1px 0 3px rgba(0, 0, 0, 0.08)',
};

export type Shadows = typeof shadows;
