/**
 * Color Palette - White Caves Luxury Dubai Brand
 * All colors used throughout the application, organized by purpose
 * 2026 Brand: GOLD (#D4AF37) primary, DARK GREEN (#2E5A4F) secondary
 * Luxury Dubai aesthetic — gold accents, deep emerald tones, sand warmth
 */

export const colors = {
  // Primary Brand Colors (GOLD)
  primary: '#D4AF37',
  primaryDark: '#B8960C',
  primaryLight: '#E8CC6E',
  primaryVeryLight: '#FDF8E8',

  // Secondary Colors (DARK GREEN)
  secondary: '#2E5A4F',
  secondaryDark: '#1E3A32',
  secondaryLight: '#3D7A6B',

  // Gold Palette (50→900)
  gold: {
    50: '#FDF8E8',
    100: '#FAF0C8',
    200: '#F5E08E',
    300: '#E8CC6E',
    400: '#D4AF37',
    500: '#B8960C',
    600: '#9A7D0A',
    700: '#7C6408',
    800: '#5E4B06',
    900: '#403204',
  },

  // Green Palette (50→900)
  green: {
    50: '#E8F0EE',
    100: '#C5DAD5',
    200: '#9EBFB7',
    300: '#6FA396',
    400: '#4D8676',
    500: '#2E5A4F',
    600: '#264B42',
    700: '#1E3A32',
    800: '#162B25',
    900: '#0E1C18',
  },

  // Luxury Gradients
  luxury: {
    goldShimmer: 'linear-gradient(135deg, #D4AF37 0%, #E8CC6E 50%, #D4AF37 100%)',
    goldToGreen: 'linear-gradient(135deg, #D4AF37 0%, #2E5A4F 100%)',
    darkGreen: 'linear-gradient(135deg, #2E5A4F 0%, #1E3A32 100%)',
    goldDark: 'linear-gradient(180deg, #D4AF37, #B8960C)',
    warmSand: 'linear-gradient(135deg, #F5E6D3 0%, #FDF8E8 100%)',
    premiumDark: 'linear-gradient(135deg, #1A1A1A 0%, #2E5A4F 100%)',
  },

  // Semantic Colors
  success: '#388E3C',
  successLight: '#81C784',
  warning: '#F57F17',
  warningLight: '#FFB74D',
  error: '#D32F2F',
  errorLight: '#EF5350',
  info: '#0288D1',
  infoLight: '#4FC3F7',

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#F8F9FA',
    secondary: '#FFFFFF',
    tertiary: '#F5F5F5',
    overlay: 'rgba(0, 0, 0, 0.5)',
    dark: '#1A1A1A',
    darkSecondary: '#2A2A2A',
  },

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',

  // Shadow & Effects
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',

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
    gold: '#FFD700',
    navyBlue: '#1E40AF',
    violet: '#7C3AED',
    crimson: '#D4AF37',
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
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F5', 
  hover: '#F5F5F5',
  cardBg: '#FFFFFF',
  textColor: '#212121',
  textPrimary: '#212121',
  textSecondary: '#666666',
  textMuted: '#999999',
  borderColor: '#E0E0E0',
  bgPrimary: '#F8F9FA',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#F5F5F5',
  danger: '#D32F2F',
  dangerDark: '#B71C1C',
  dangerLight: 'rgba(211, 47, 47, 0.15)',
  accentGold: '#D4AF37',
  accentEmerald: '#2E5A4F',
  accentSand: '#F5E6D3',
  accentCharcoal: '#2C2C2C',
  glassBackground: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusSm: '6px',

  // Legacy compat — components referencing old red brand
  brandRed: '#E31E24',
};

export type Colors = typeof colors;
