/**
 * Color Palette - White Caves Brand Colors
 * All colors used throughout the application, organized by purpose
 */

export const colors = {
  // Primary Brand Colors
  primary: '#D32F2F',
  primaryDark: '#B71C1C',
  primaryLight: '#EF5350',
  primaryVeryLight: '#FFEBEE',

  // Secondary Colors
  secondary: '#1976D2',
  secondaryDark: '#1565C0',
  secondaryLight: '#42A5F5',

  // Semantic Colors
  success: '#388E3C',
  successLight: '#81C784',
  warning: '#F57F17',
  warningLight: '#FFB74D',
  error: '#C62828',
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
  danger: '#C62828',
  dangerDark: '#B71C1C',
  dangerLight: 'rgba(198, 40, 40, 0.15)',
  accentGold: '#F57F17',
};

export type Colors = typeof colors;
