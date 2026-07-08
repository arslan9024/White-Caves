// ─────────────────────────────────────────────────────────────
// COLORS — Single source of truth for all brand colors
// ─────────────────────────────────────────────────────────────

// PRIMARY BRAND COLORS
export const colors = {
  // Brand Colors (formerly 6 different reds)
  primary: {
    50: '#FDF2F2', // Lightest
    100: '#FCE4E4',
    200: '#F8C8C8',
    300: '#F5ADAD',
    400: '#E88B8B',
    500: '#C41E3A', // Brand Red (canonical)
    600: '#A01729',
    700: '#7A101E',
    800: '#540B15',
    900: '#2D060C', // Darkest
  },

  // SEMANTIC COLORS
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Use this (not multiple greens)
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#0F2919',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Use this (not #E74C3C or others)
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // TEXT COLORS
  text: {
    primary: '#171717', // neutral-900
    secondary: '#525252', // neutral-600
    tertiary: '#A3A3A3', // neutral-400
    inverse: '#FAFAFA', // For dark backgrounds
  },

  // BACKGROUND COLORS
  background: {
    default: '#FFFFFF',
    surface: '#F5F5F5',
    hover: '#E5E5E5',
    active: '#D4D4D4',
  },

  // BORDER COLORS
  border: {
    light: '#E5E5E5',
    default: '#D4D4D4',
    dark: '#A3A3A3',
  },

  // STATUS SPECIFIC (used in badges, alerts)
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

// SEMANTIC ALIASES (use these for maintainability)
export const semanticColors = {
  brand: colors.primary[500], // #C41E3A
  success: colors.success[500], // #22C55E
  warning: colors.warning[500], // #F59E0B
  error: colors.error[500], // #EF4444
  info: colors.error[500], // #3B82F6

  // UI-specific
  buttonPrimary: colors.primary[500],
  buttonHover: colors.primary[600],
  buttonActive: colors.primary[700],
  buttonDisabled: colors.neutral[200],

  // Text
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,

  // Background
  bgDefault: colors.background.default,
  bgSurface: colors.background.surface,
};
