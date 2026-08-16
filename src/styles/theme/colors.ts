/**
 * Color Palette - White Caves Brand System
 * ═══════════════════════════════════════════════════
 * AEGIS 2.0 COLOR LOCKDOWN (STRICTLY ENFORCED):
 *   ✅ White Caves Red  : #EF4444  — primary, headings, CTAs
 *   ✅ Brilliant White  : #FFFFFF  — backgrounds
 *   ✅ Deep Slate Gray  : #1E293B  — text, surfaces
 *   ❌ FORBIDDEN: Metallic Gold (#C9A84C), Emerald Green (#10B981 as primary), Obsidian Black
 * ═══════════════════════════════════════════════════
 */

export const colors = {
  // Primary Brand Colors — WHITE CAVES RED (AEGIS 2.0)
  primary: '#EF4444',
  primaryDark: '#B91C1C',
  primaryLight: '#F87171',
  primaryVeryLight: 'rgba(239, 68, 68, 0.08)',

  // Secondary Colors — Slate
  secondary: '#1E293B',
  secondaryDark: '#0F172A',
  secondaryLight: '#334155',

  // Red Palette (50→900) — White Caves Red brand scale
  red: {
    50: 'rgba(239, 68, 68, 0.05)',
    100: 'rgba(239, 68, 68, 0.1)',
    200: 'rgba(239, 68, 68, 0.2)',
    300: 'rgba(239, 68, 68, 0.35)',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Slate Palette (50→900) — Deep Slate brand scale
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Brand Gradients — Red/White/Slate palette
  luxury: {
    redShimmer: 'linear-gradient(135deg, #EF4444 0%, #F87171 50%, #EF4444 100%)',
    redToSlate: 'linear-gradient(135deg, #EF4444 0%, #1E293B 100%)',
    slateDeep: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    redDark: 'linear-gradient(180deg, #EF4444, #B91C1C)',
    warmWhite: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
    premiumLight: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
  },

  // Semantic Colors
  success: '#10B981',
  successLight: '#34d399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#64748B',
  infoLight: '#94A3B8',

  // Text Colors (White/Slate)
  text: {
    primary: '#1E293B',
    secondary: 'rgba(30, 41, 59, 0.7)',
    tertiary: 'rgba(30, 41, 59, 0.45)',
    disabled: 'rgba(30, 41, 59, 0.25)',
    inverse: '#FFFFFF',
  },

  // Background Colors (White/Slate)
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    overlay: 'rgba(30, 41, 59, 0.7)',
    dark: '#1E293B',
    darkSecondary: '#0F172A',
  },

  // Border Colors
  border: '#E2E8F0',
  borderLight: 'rgba(239, 68, 68, 0.15)',
  borderDark: '#EF4444',

  // Shadow & Effects
  shadow: 'rgba(30, 41, 59, 0.1)',
  shadowLight: 'rgba(30, 41, 59, 0.05)',
  shadowDark: 'rgba(30, 41, 59, 0.3)',

  // Departmental / Categorical Colors (functional only — not brand)
  departments: {
    operations: '#3B82F6',
    finance: '#F59E0B',
    sales: '#EF4444',
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

  // Role category colours
  roles: {
    red: '#EF4444',
    navyBlue: '#1E40AF',
    violet: '#7C3AED',
    crimson: '#B91C1C',
    royalBlue: '#2563EB',
    deepPurple: '#7C3AED',
    emerald: '#059669',
    orange: '#EA580C',
    teal: '#0D9488',
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

  // Light Mode Colors
  dark: {
    bg: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    bgTertiary: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#475569',
    border: '#E2E8F0',
    shadow: 'rgba(30, 41, 59, 0.1)',
  },

  // Utility Aliases for Component Compatibility
  surface: '#F8FAFC',
  surfaceAlt: '#F1F5F9',
  hover: '#FEF2F2',
  cardBg: '#FFFFFF',
  textColor: '#1E293B',
  textPrimary: '#1E293B',
  textSecondary: 'rgba(30, 41, 59, 0.7)',
  textMuted: 'rgba(30, 41, 59, 0.45)',
  borderColor: '#E2E8F0',
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F8FAFC',
  bgTertiary: '#F1F5F9',
  danger: '#EF4444',
  dangerDark: '#B91C1C',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  accentRed: '#EF4444',
  accentSlate: '#1E293B',
  accentWhite: '#FFFFFF',
  glassBackground: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(239, 68, 68, 0.15)',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusSm: '6px',

  // Brand primary — always Red
  brandRed: '#EF4444',

  // ═══════════════════════════════════════════════════════════════
  // WCAG AA CONTRAST-SAFE VARIANTS
  // ═══════════════════════════════════════════════════════════════
  a11y: {
    /** Brand red for text on light backgrounds. */
    redText: '#B91C1C',
    /** Brand red for large text. */
    redLargeText: '#EF4444',
    /** Brand red for UI elements (non-text). */
    redUI: '#EF4444',
    /** Focus ring — red visible on light backgrounds. */
    focusRing: '#EF4444',
    /** Error text — semantic red. */
    errorText: '#EF4444',
    /** Warning text — amber on light. */
    warningText: '#D97706',
    /** Success text — emerald green. */
    successText: '#059669',
    /** Info text — slate on light. */
    infoText: '#1E293B',
  },
};

export type Colors = typeof colors;
