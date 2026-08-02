/**
 * Color Palette - White Caves Brand System
 * ═══════════════════════════════════════════════════
 * BRAND COLOR LAW (STRICTLY ENFORCED):
 *   Emerald Green : #10B981  — success, accents, focus
 *   Metallic Gold : #C9A84C  — primary, headings, CTAs
 *   Obsidian Dark : #0f0f0f  — backgrounds, surfaces
 * ═══════════════════════════════════════════════════
 */

export const colors = {
  // Primary Brand Colors — METALLIC GOLD
  primary: '#C9A84C',
  primaryDark: '#a8883a',
  primaryLight: '#e4b75e',
  primaryVeryLight: 'rgba(201, 168, 76, 0.08)',

  // Secondary Colors — EMERALD GREEN
  secondary: '#10B981',
  secondaryDark: '#064e3b',
  secondaryLight: '#34d399',

  // Gold Palette (50→900) — Metallic Gold brand scale
  gold: {
    50: 'rgba(201, 168, 76, 0.05)',
    100: 'rgba(201, 168, 76, 0.1)',
    200: 'rgba(201, 168, 76, 0.2)',
    300: 'rgba(201, 168, 76, 0.35)',
    400: '#e4b75e',
    500: '#C9A84C',
    600: '#a8883a',
    700: '#8a6e2e',
    800: '#6b5422',
    900: '#4a3a17',
  },

  // Green Palette (50→900)
  green: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Luxury Gradients — Gold/Emerald/Obsidian brand palette
  luxury: {
    goldShimmer: 'linear-gradient(135deg, #C9A84C 0%, #e4b75e 50%, #C9A84C 100%)',
    goldToGreen: 'linear-gradient(135deg, #C9A84C 0%, #10B981 100%)',
    darkGreen: 'linear-gradient(135deg, #10B981 0%, #064e3b 100%)',
    goldDark: 'linear-gradient(180deg, #C9A84C, #a8883a)',
    warmSand: 'linear-gradient(135deg, #1f1f1f 0%, #2c2c2c 100%)',
    premiumDark: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  },

  // Semantic Colors
  success: '#10B981',
  successLight: '#34d399',
  warning: '#C9A84C',
  warningLight: '#e4b75e',
  error: '#EF4444',
  errorLight: '#f87171',
  info: '#C9A84C',
  infoLight: '#e4b75e',

  // Text Colors (Obsidian Dark)
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.45)',
    disabled: 'rgba(255, 255, 255, 0.25)',
    inverse: '#0f0f0f',
  },

  // Background Colors (Obsidian Dark)
  background: {
    primary: '#0f0f0f',
    secondary: '#1a1a1a',
    tertiary: '#1f1f1f',
    overlay: 'rgba(0, 0, 0, 0.7)',
    dark: '#0f0f0f',
    darkSecondary: '#1a1a1a',
  },

  // Border Colors
  border: '#2c2c2c',
  borderLight: 'rgba(201, 168, 76, 0.15)',
  borderDark: '#C9A84C',

  // Shadow & Effects
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',

  // Departmental / Categorical Colors
  departments: {
    operations: '#3B82F6',
    finance: '#F59E0B',
    sales: '#10B981',
    marketing: '#EC4899',
    communications: '#6366F1',
    hr: '#8B5CF6',
    technology: '#06B6D4',
    legal: '#7C3AED',
  },

  // Status Colors
  status: {
    active: '#10B981',
    inactive: '#9CA3AF',
    pending: '#F59E0B',
    completed: '#10B981',
    failed: '#EF4444',
    draft: '#6B7280',
  },

  // Badge / StatusConfig Colors
  // Used by statusConfig.ts for badge color overrides across all entity types.
  badges: {
    blue: '#3B82F6',
    cyan: '#06B6D4',
    green: '#22C55E',
    greenDark: '#16A34A',
    purple: '#8B5CF6',
    amber: '#F59E0B',
    red: '#EF4444',
    gray: '#6B7280',
    grayLight: '#9CA3AF',
  },

  // Role category colours (used by roles.ts REAL_ESTATE_ROLES)
  roles: {
    gold: '#E31E24',
    navyBlue: '#1E40AF',
    violet: '#7C3AED',
    crimson: '#D32F2F',
    royalBlue: '#2563EB',
    deepPurple: '#7C3AED',
    emerald: '#059669',
    orange: '#EA580C',
    teal: '#10B981',
    indigo: '#6366F1',
    cyan: '#0891B2',
    mintTeal: '#0D9488',
    amethyst: '#A855F7',
    deepIndigo: '#4338CA',
    blueIndigo: '#4F46E5',
    kellyGreen: '#16A34A',
    hotPink: '#DB2777',
    periwinkle: '#6366F1',
    stone: '#78716C',
    skyBlue: '#0369A1',
    lavender: '#8B5CF6',
    oceanBlue: '#0EA5E9',
    aqua: '#14B8A6',
    tangerine: '#F97316',
  },

  // Dark Mode Colors
  dark: {
    bg: '#1A1A1A',
    bgSecondary: '#2A2A2A',
    bgTertiary: '#3A3A3A',
    text: '#FFFFFF',
    textSecondary: '#D1D5DB',
    border: '#404040',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  // Utility Aliases for Component Compatibility
  surface: '#1a1a1a',
  surfaceAlt: '#1f1f1f',
  hover: '#2c2c2c',
  cardBg: '#0f0f0f',
  textColor: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  borderColor: '#2c2c2c',
  bgPrimary: '#0f0f0f',
  bgSecondary: '#1a1a1a',
  bgTertiary: '#1f1f1f',
  danger: '#EF4444',
  dangerDark: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  accentGold: '#C9A84C',
  accentEmerald: '#10B981',
  accentSand: '#2c2c2c',
  accentCharcoal: '#1a1a1a',
  glassBackground: 'rgba(15, 15, 15, 0.85)',
  glassBorder: 'rgba(201, 168, 76, 0.15)',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusSm: '6px',

  // Legacy compat — brand primary now Gold
  brandRed: '#C9A84C',

  // ═══════════════════════════════════════════════════════════════
  // WCAG AA CONTRAST-SAFE VARIANTS
  // Gold on dark backgrounds easily meets AA contrast thresholds.
  // ═══════════════════════════════════════════════════════════════
  a11y: {
    /** Brand gold for text on dark backgrounds. */
    goldText: '#C9A84C',
    /** Brand gold for large text. */
    goldLargeText: '#e4b75e',
    /** Brand gold for UI elements (non-text). */
    goldUI: '#C9A84C',
    /** Focus ring — emerald green visible on dark backgrounds. */
    focusRing: '#10B981',
    /** Error text — semantic red exception. */
    errorText: '#EF4444',
    /** Warning text — gold on dark. */
    warningText: '#C9A84C',
    /** Success text — emerald green on dark. */
    successText: '#10B981',
    /** Info text — gold on dark. */
    infoText: '#C9A84C',
  },
};

export type Colors = typeof colors;
