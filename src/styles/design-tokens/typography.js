/**
 * White Caves Design Tokens - Typography System
 * Premium luxury web app typography
 * Playfair Display (serif) + Inter (sans-serif)
 */

export const TYPOGRAPHY_TOKENS = {
  // Font Families
  fonts: {
    serif: "'Playfair Display', serif",           // Headlines, luxury feel
    sansSerif: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",  // Body, UI
    mono: "'Courier New', monospace",              // Code, technical text
  },

  // Font Sizes (px)
  fontSize: {
    xs: '12px',       // Small labels, badges
    sm: '14px',       // Small text, secondary info
    base: '16px',     // Default body text
    lg: '18px',       // Larger body text
    xl: '20px',       // Section text
    '2xl': '24px',    // Subheadings
    '3xl': '32px',    // Card titles
    '4xl': '40px',    // Section titles
    '5xl': '48px',    // Large headlines
    '6xl': '60px',    // Extra large titles
  },

  // Font Weights
  fontWeight: {
    light: 300,       // Elegant, minimal
    normal: 400,      // Default weight
    medium: 500,      // Slightly bold
    semibold: 600,    // Bold for emphasis
    bold: 700,        // Strong emphasis
    extrabold: 800,   // Very strong emphasis
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,       // Compact lines (titles)
    snug: 1.375,      // Slightly compact
    normal: 1.5,      // Standard readability
    relaxed: 1.625,   // Generous spacing
    loose: 1.75,      // Very relaxed (captions)
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.5px',  // Condensed (headlines)
    normal: '0px',    // Default
    wide: '0.5px',    // Slightly spread
    wider: '1px',     // Spread (uppercase)
    widest: '2px',    // Very spread
  },

  // Heading Styles
  heading: {
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '60px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
      margin: '0 0 24px 0',
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
      margin: '0 0 20px 0',
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
      margin: '0 0 16px 0',
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.25px',
      margin: '0 0 12px 0',
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '0px',
      margin: '0 0 8px 0',
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0px',
      margin: '0 0 8px 0',
    },
  },

  // Body Text Styles
  body: {
    large: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0px',
    },
    normal: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    small: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
  },

  // Label & Button Styles
  label: {
    large: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
    normal: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    small: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.5px',
    },
  },

  // Utility Text Styles
  caption: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0px',
    color: '#999999',
  },

  overline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },

  // Special Styles
  luxury: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.25px',
  },

  emphasis: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0px',
  },

  code: {
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0px',
  },
};

export default TYPOGRAPHY_TOKENS;
