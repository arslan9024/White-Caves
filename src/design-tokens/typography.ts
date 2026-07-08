// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY — Standardized type scale (8px base)
// ─────────────────────────────────────────────────────────────

export const typography = {
  // Font Families
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Courier New", monospace',
  },

  // Type Scale (all in pixels for consistency)
  fontSize: {
    xs: '12px', // Small labels, captions
    sm: '14px', // Small text, secondary
    base: '16px', // Body text (canonical)
    lg: '18px', // Large body
    xl: '20px', // Section headers
    '2xl': '24px', // Page headers
    '3xl': '32px', // Large headings
    '4xl': '40px', // Hero text
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500, // For emphasis
    semibold: 600, // For headers
    bold: 700, // For strong emphasis
  },

  // Line Height (for readability)
  lineHeight: {
    tight: '1.2', // Headings
    normal: '1.5', // Body text (canonical)
    relaxed: '1.75', // Large blocks
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0em',
    wide: '0.025em',
  },

  // PRESET COMBINATIONS (use these in components)
  presets: {
    // Headings
    heading1: {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
    },
    heading2: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
    },
    heading3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
    },
    heading4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '1.2',
      letterSpacing: 'normal',
    },

    // Body
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: 'normal',
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: 'normal',
    },

    // UI
    label: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '1.2',
      letterSpacing: 'normal',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
  },
};

// Export for styled-components
export const typographyCSS = {
  heading1: `
    font-size: 40px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  `,
  heading2: `
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  `,
  body: `
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
  `,
  caption: `
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
  `,
};
