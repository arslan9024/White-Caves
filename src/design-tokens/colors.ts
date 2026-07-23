// ─────────────────────────────────────────────────────────────
// COLORS — Single source of truth for all brand colors
// ─────────────────────────────────────────────────────────────

// PRIMARY BRAND COLORS
export const colors = {
  // Brand Colors — METALLIC GOLD (White Caves Brand Color Law)
  primary: {
    50: 'rgba(201, 168, 76, 0.05)',
    100: 'rgba(201, 168, 76, 0.1)',
    200: 'rgba(201, 168, 76, 0.2)',
    300: 'rgba(201, 168, 76, 0.35)',
    400: '#e4b75e',
    500: '#C9A84C', // Metallic Gold (canonical brand primary)
    600: '#a8883a',
    700: '#8a6e2e',
    800: '#6b5422',
    900: '#4a3a17',
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

  // TEXT COLORS (Obsidian Dark mode)
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.45)',
    inverse: '#0f0f0f',
  },

  // BACKGROUND COLORS (Obsidian Dark palette)
  background: {
    default: '#0f0f0f',
    surface: '#1a1a1a',
    hover: '#1f1f1f',
    active: '#2c2c2c',
  },

  // BORDER COLORS (Obsidian Dark palette)
  border: {
    light: '#2c2c2c',
    default: 'rgba(201, 168, 76, 0.3)',
    dark: '#C9A84C',
  },

  // STATUS SPECIFIC (used in badges, alerts)
  status: {
    success: '#10B981',
    warning: '#C9A84C',
    error: '#EF4444',
    info: '#C9A84C',
  },
};

// SEMANTIC ALIASES (use these for maintainability)
export const semanticColors = {
  brand: colors.primary[500], // #C9A84C — Metallic Gold
  success: colors.success[500], // #22C55E
  warning: colors.warning[500], // #F59E0B
  error: colors.error[500], // #EF4444
  info: '#C9A84C', // Metallic Gold (no blue allowed per Brand Color Law)

  // UI-specific
  buttonPrimary: colors.primary[500],
  buttonHover: colors.primary[400],
  buttonActive: colors.primary[600],
  buttonDisabled: colors.neutral[700],

  // Text
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,

  // Background
  bgDefault: colors.background.default,
  bgSurface: colors.background.surface,
};
