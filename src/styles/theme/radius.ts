/**
 * Border Radius System
 * All border radius values for consistent rounded corners
 */

export const radius = {
  // Base increments
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  xxl: '16px',
  full: '9999px',

  // Component sizes
  card: '8px',
  button: '6px',
  input: '6px',
  modal: '12px',
  avatar: '50%',
  pill: '9999px',
};

export type Radius = typeof radius;
