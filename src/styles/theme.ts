// src/styles/theme.ts
// Complete Theme System with Light/Dark Modes & Design Tokens

export const lightTheme = {
  colors: {
    // Primary & Secondary
    primary: '#C41E3A', // Red/Crimson
    secondary: '#0EA5E9', // Sky Blue
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundAlt: '#F9FAFB',
    cardBg: '#FFFFFF',
    
    // Text
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Borders & Dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#E5E7EB',
    
    // States
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Status Indicators
    statusOnline: '#10B981',
    statusBusy: '#F59E0B',
    statusOffline: '#9CA3AF',
    
    // Interactive
    hover: '#F3F4F6',
    active: '#EEF2FF',
    disabled: '#D1D5DB',
    focus: '#3B82F6',
    
    // Semantic
    activeBg: '#FCE4E6',
    hoverBg: '#F9FAFB',
  },
  
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  
  typography: {
    h1: {
      size: '32px',
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
    },
    h2: {
      size: '28px',
      weight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.3px',
    },
    h3: {
      size: '24px',
      weight: 700,
      lineHeight: 1.4,
      letterSpacing: '-0.2px',
    },
    h4: {
      size: '20px',
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    h5: {
      size: '16px',
      weight: 600,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    body: {
      size: '14px',
      weight: 400,
      lineHeight: 1.6,
      letterSpacing: '0px',
    },
    bodySmall: {
      size: '13px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    caption: {
      size: '12px',
      weight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.3px',
    },
    button: {
      size: '14px',
      weight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
  },
  
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    elevated: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    standard: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  easing: {
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1440px',
    widescreen: '1920px',
  },
  
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0F172A',
    backgroundAlt: '#1E293B',
    cardBg: '#1E293B',
    textPrimary: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    border: '#334155',
    borderLight: '#1E293B',
    divider: '#334155',
    hover: '#1E293B',
    active: '#3D0A1A',
    hoverBg: '#1E293B',
    activeBg: '#3D0A1A',
  },
};

export type Theme = typeof lightTheme;

// Media Queries for Responsive Design
export const MEDIA_QUERIES = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1280px)',
};

// Typography Styles (extracted from theme)
export const TYPOGRAPHY = {
  h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  bodySmall: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 },
};

// Extract individual color/spacing objects for backward compatibility
export const COLORS = lightTheme.colors;
export const SPACING = lightTheme.spacing;
