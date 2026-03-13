export const colorTokens = {
  primary: {
    main: '#DC2626',
    hover: '#B91C1C',
    light: 'rgba(220, 38, 38, 0.1)',
    dark: '#991B1B'
  },
  secondary: {
    main: '#6B7280',
    hover: '#4B5563',
    light: 'rgba(107, 114, 128, 0.1)'
  },
  success: {
    main: '#10B981',
    hover: '#059669',
    light: 'rgba(16, 185, 129, 0.1)'
  },
  warning: {
    main: '#F59E0B',
    hover: '#D97706',
    light: 'rgba(245, 158, 11, 0.1)'
  },
  error: {
    main: '#EF4444',
    hover: '#DC2626',
    light: 'rgba(239, 68, 68, 0.1)'
  },
  info: {
    main: '#3B82F6',
    hover: '#2563EB',
    light: 'rgba(59, 130, 246, 0.1)'
  }
};

export const motionTokens = {
  duration: {
    fastest: '75ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slowest: '500ms'
  },
  easing: {
    linear: 'linear',
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

export const layoutTokens = {
  header: {
    height: '72px',
    mobileHeight: '64px',
    zIndex: 90
  },
  sidebar: {
    width: '280px',
    collapsedWidth: '72px',
    mobileWidth: '100%'
  },
  container: {
    maxWidth: '1280px',
    padding: {
      desktop: '0 2rem',
      tablet: '0 1.5rem',
      mobile: '0 1rem'
    }
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export const componentTokens = {
  button: {
    minWidth: {
      xs: '64px',
      sm: '80px',
      md: '96px',
      lg: '120px'
    },
    height: {
      xs: '28px',
      sm: '32px',
      md: '40px',
      lg: '48px'
    },
    padding: {
      xs: '0 8px',
      sm: '0 12px',
      md: '0 16px',
      lg: '0 24px'
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      md: '14px',
      lg: '16px'
    },
    borderRadius: '8px',
    iconSpacing: '8px'
  },
  card: {
    padding: {
      compact: '12px',
      normal: '16px',
      relaxed: '24px'
    },
    borderRadius: '12px',
    border: {
      width: '1px',
      color: 'var(--color-border)'
    }
  },
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px'
    },
    padding: {
      sm: '0 10px',
      md: '0 14px',
      lg: '0 18px'
    },
    borderRadius: '8px',
    fontSize: {
      sm: '13px',
      md: '14px',
      lg: '16px'
    }
  },
  badge: {
    height: {
      xs: '18px',
      sm: '22px',
      md: '26px',
      lg: '32px'
    },
    padding: {
      xs: '0 6px',
      sm: '0 8px',
      md: '0 10px',
      lg: '0 14px'
    },
    fontSize: {
      xs: '10px',
      sm: '11px',
      md: '12px',
      lg: '14px'
    },
    borderRadius: '9999px'
  }
};

export const spacingTokens = {
  unit: 4,
  values: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px'
  }
};

export const typographyTokens = {
  fontFamily: {
    sans: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    body: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    mono: "'Fira Code', 'Consolas', 'Monaco', monospace"
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625
  }
};

export const shadowTokens = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
};

export const gradientTokens = {
  primary: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  purple: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  pink: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  cyan: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
  dark: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
};

export const zIndexTokens = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
};

export const departmentColors = {
  communications: '#25D366',
  operations: '#3B82F6',
  sales: '#8B5CF6',
  finance: '#F59E0B',
  marketing: '#EC4899',
  executive: '#10B981',
  compliance: '#6366F1',
  technology: '#0EA5E9',
  legal: '#DC2626',
  records: '#7C3AED',
  intelligence: '#0D9488'
};

export const designTokens = {
  colors: colorTokens,
  motion: motionTokens,
  layout: layoutTokens,
  components: componentTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  shadows: shadowTokens,
  gradients: gradientTokens,
  zIndex: zIndexTokens,
  departments: departmentColors
};

export default designTokens;
