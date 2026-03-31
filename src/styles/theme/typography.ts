/**
 * Typography System
 * Font sizes, weights, and line heights for different text elements
 */

export const typography = {
  fontFamily: {
    primary: '"Inter", "Segoe UI", "Roboto", sans-serif',
    heading: '"Poppins", "Inter", "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    serif: '"Georgia", "Times New Roman", serif',
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  sizes: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '28px',
    display: '32px',
    hero: '48px',
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Predefined text styles
  styles: {
    h1: {
      size: '32px',
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      size: '28px',
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      size: '24px',
      weight: 600,
      lineHeight: 1.3,
      letterSpacing: '0',
    },
    h4: {
      size: '20px',
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    h5: {
      size: '18px',
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    h6: {
      size: '16px',
      weight: 600,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    body: {
      size: '14px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    bodySmall: {
      size: '13px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    label: {
      size: '12px',
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.5px',
    },
    caption: {
      size: '12px',
      weight: 400,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    button: {
      size: '14px',
      weight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
  },
};

export type Typography = typeof typography;
