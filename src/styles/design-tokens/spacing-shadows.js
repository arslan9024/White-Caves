/**
 * White Caves Design Tokens - Spacing & Shadows
 * 8px grid system for consistency
 * Red-tinted shadows for brand cohesion
 */

export const SPACING_TOKENS = {
  // 8px Grid System
  space: {
    xs: '4px', // 0.25rem - Micro spacing
    sm: '8px', // 0.5rem - Small spacing
    md: '16px', // 1rem - Standard spacing
    lg: '24px', // 1.5rem - Large spacing
    xl: '32px', // 2rem - Extra large
    '2xl': '48px', // 3rem - 2x extra large
    '3xl': '64px', // 4rem - 3x extra large
    '4xl': '80px', // 5rem - 4x extra large
  },

  // Padding Presets
  padding: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    button: '12px 24px', // Button padding
    card: '24px', // Card padding
    section: '32px', // Section padding
    page: '40px', // Page padding
    modal: '24px', // Modal padding
  },

  // Margin Presets
  margin: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    section: '48px', // Section gap
    component: '16px', // Component gap
  },

  // Gap (for flex/grid)
  gap: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    section: '48px',
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
    card: '12px',
    button: '8px',
    modal: '16px',
    input: '8px',
  },
};

export const SHADOW_TOKENS = {
  // Elevation System (Z-depth with red tint)
  shadow: {
    // Subtle shadows for cards and light elevation
    sm: '0 1px 2px rgba(196, 30, 58, 0.08)',

    // Standard shadow for medium elevation
    md: '0 4px 6px rgba(196, 30, 58, 0.1), 0 2px 4px rgba(26, 26, 26, 0.06)',

    // Strong shadow for card elevation
    lg: '0 10px 25px rgba(196, 30, 58, 0.12), 0 5px 10px rgba(26, 26, 26, 0.08)',

    // Very strong shadow for modals and overlays
    xl: '0 20px 40px rgba(196, 30, 58, 0.15), 0 10px 20px rgba(26, 26, 26, 0.1)',

    // Extra large shadow for floating elements
    '2xl': '0 25px 50px rgba(196, 30, 58, 0.2), 0 15px 30px rgba(26, 26, 26, 0.12)',

    // No shadow
    none: 'none',

    // Inner shadow for depth
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  // Hover/Focus Shadows
  interaction: {
    hover: '0 8px 16px rgba(196, 30, 58, 0.12)',
    focus: '0 0 0 3px rgba(196, 30, 58, 0.1), 0 4px 6px rgba(196, 30, 58, 0.1)',
    active: '0 2px 4px rgba(26, 26, 26, 0.1)',
  },

  // Specific Component Shadows
  button: {
    default: '0 1px 3px rgba(26, 26, 26, 0.1)',
    hover: '0 4px 12px rgba(196, 30, 58, 0.15)',
    active: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  card: {
    default: '0 2px 8px rgba(196, 30, 58, 0.08)',
    hover: '0 8px 24px rgba(196, 30, 58, 0.12)',
    elevated: '0 12px 32px rgba(196, 30, 58, 0.15)',
  },

  modal: {
    backdrop: 'rgba(26, 26, 26, 0.5)',
    dialog: '0 20px 40px rgba(196, 30, 58, 0.15)',
  },

  navigation: {
    default: '0 2px 8px rgba(196, 30, 58, 0.08)',
    hover: '0 4px 12px rgba(196, 30, 58, 0.1)',
  },

  // Luxury/Premium Shadows
  luxury: {
    subtle: '0 1px 3px rgba(196, 30, 58, 0.05)',
    prominent: '0 15px 35px rgba(196, 30, 58, 0.15), 0 5px 15px rgba(26, 26, 26, 0.1)',
    brand: '0 10px 30px rgba(227, 30, 36, 0.15)',
  },
};

// Transitions & Animations
export const TRANSITION_TOKENS = {
  // Animation Durations
  duration: {
    fast: '150ms', // Quick interactions
    base: '200ms', // Standard animations
    slow: '300ms', // Smooth transitions
    slower: '400ms', // Deliberate animations
    slowest: '500ms', // Page transitions
  },

  // Easing Functions (Cubic Bezier)
  easing: {
    linear: 'cubic-bezier(0, 0, 1, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Preset Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    all: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default {
  ...SPACING_TOKENS,
  ...SHADOW_TOKENS,
  ...TRANSITION_TOKENS,
};
