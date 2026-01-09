export const brand = {
  colors: {
    primary: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#D32F2F',
      600: '#C62828',
      700: '#B71C1C',
      800: '#8E1414',
      900: '#6B0F0F',
    },
    neutrals: {
      white: '#FFFFFF',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      surfaceAlt: '#F5F5F5',
      border: '#E0E0E0',
      borderLight: '#EEEEEE',
      divider: '#E8E8E8',
      textPrimary: '#212121',
      textSecondary: '#757575',
      textTertiary: '#9E9E9E',
      textDisabled: '#BDBDBD',
      dark: '#1A1A2E',
      darkSurface: '#0F0F1A',
    },
    semantics: {
      success: '#2E7D32',
      successLight: '#E8F5E9',
      warning: '#F57C00',
      warningLight: '#FFF3E0',
      error: '#C62828',
      errorLight: '#FFEBEE',
      info: '#1565C0',
      infoLight: '#E3F2FD',
    },
    departments: {
      communications: '#25D366',
      operations: '#3B82F6',
      sales: '#8B5CF6',
      finance: '#F59E0B',
      marketing: '#EC4899',
      executive: '#10B981',
      compliance: '#6366F1',
      legal: '#DC2626',
      technology: '#0EA5E9',
      intelligence: '#0D9488',
    },
  },

  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      heading: "'Montserrat', 'Inter', -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    scale: {
      display: '3rem',
      h1: '2.25rem',
      h2: '1.875rem',
      h3: '1.5rem',
      h4: '1.25rem',
      bodyLg: '1.125rem',
      body: '1rem',
      bodySm: '0.875rem',
      caption: '0.75rem',
      tiny: '0.625rem',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  spacing: {
    unit: 8,
    get: (multiplier) => `${multiplier * 8}px`,
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  layout: {
    navbarHeight: '64px',
    sidebarWidth: '280px',
    sidebarCollapsed: '72px',
    contentMaxWidth: '1400px',
    contextBarHeight: '56px',
  },

  elevation: {
    none: 'none',
    low: '0 2px 4px rgba(211, 47, 47, 0.08)',
    medium: '0 4px 12px rgba(211, 47, 47, 0.12)',
    high: '0 8px 24px rgba(211, 47, 47, 0.16)',
    overlay: '0 16px 48px rgba(0, 0, 0, 0.2)',
    card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    cardHover: '0 4px 12px rgba(0, 0, 0, 0.12)',
    dropdown: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },

  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
    pill: '999px',
    circle: '50%',
  },

  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    overlay: 400,
    tooltip: 500,
    toast: 600,
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1536px',
  },
};

export const getCSSVariables = () => `
  :root {
    /* Primary Colors */
    --brand-primary-50: ${brand.colors.primary[50]};
    --brand-primary-100: ${brand.colors.primary[100]};
    --brand-primary-500: ${brand.colors.primary[500]};
    --brand-primary-600: ${brand.colors.primary[600]};
    --brand-primary-700: ${brand.colors.primary[700]};
    
    /* Neutrals */
    --brand-white: ${brand.colors.neutrals.white};
    --brand-background: ${brand.colors.neutrals.background};
    --brand-surface: ${brand.colors.neutrals.surface};
    --brand-surface-alt: ${brand.colors.neutrals.surfaceAlt};
    --brand-border: ${brand.colors.neutrals.border};
    --brand-border-light: ${brand.colors.neutrals.borderLight};
    --brand-text-primary: ${brand.colors.neutrals.textPrimary};
    --brand-text-secondary: ${brand.colors.neutrals.textSecondary};
    --brand-text-tertiary: ${brand.colors.neutrals.textTertiary};
    
    /* Semantics */
    --brand-success: ${brand.colors.semantics.success};
    --brand-warning: ${brand.colors.semantics.warning};
    --brand-error: ${brand.colors.semantics.error};
    --brand-info: ${brand.colors.semantics.info};
    
    /* Layout */
    --navbar-height: ${brand.layout.navbarHeight};
    --sidebar-width: ${brand.layout.sidebarWidth};
    --sidebar-collapsed: ${brand.layout.sidebarCollapsed};
    --context-bar-height: ${brand.layout.contextBarHeight};
    
    /* Typography */
    --font-primary: ${brand.typography.fontFamily.primary};
    --font-heading: ${brand.typography.fontFamily.heading};
    
    /* Transitions */
    --transition-fast: ${brand.transitions.duration.fast};
    --transition-normal: ${brand.transitions.duration.normal};
    --transition-easing: ${brand.transitions.easing.default};
    
    /* Elevation */
    --shadow-low: ${brand.elevation.low};
    --shadow-medium: ${brand.elevation.medium};
    --shadow-high: ${brand.elevation.high};
    --shadow-card: ${brand.elevation.card};
    --shadow-dropdown: ${brand.elevation.dropdown};
    
    /* Border Radius */
    --radius-sm: ${brand.borderRadius.sm};
    --radius-md: ${brand.borderRadius.md};
    --radius-lg: ${brand.borderRadius.lg};
    --radius-pill: ${brand.borderRadius.pill};
  }
`;

export default brand;
