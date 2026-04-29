/**
 * White Caves Design Tokens - Color System
 * Red & White Premium Luxury Brand Identity
 * Created: January 14, 2026
 */

export const COLOR_TOKENS = {
  // Primary Brand Colors
  primary: {
    red: '#C41E3A',           // White Caves Red - Main brand color
    redLight: '#E74C3C',      // Red highlight/hover
    redDark: '#A01729',       // Red darkened for depth
    redVeryLight: '#F8DCDC',  // Red tinted background
  },

  // Secondary Colors
  secondary: {
    white: '#FFFFFF',         // Pure white
    offWhite: '#F9F9F9',      // Off-white backgrounds
    lightGray: '#F5F5F5',     // Light gray backgrounds
    mediumGray: '#E0E0E0',    // Medium gray for borders
    darkGray: '#757575',      // Dark gray for secondary text
  },

  // Accent Colors
  accent: {
    gold: '#D4AF37',          // Luxury gold accent
    blackGold: '#1A1A1A',     // Deep black for elegance
    platinum: '#E8E8E8',      // Platinum gray
  },

  // Department Colors (Maintained with Red Accent Borders)
  departments: {
    communications: { 
      primary: '#25D366',
      red: '#C41E3A',
      light: '#E8F5E9',
    },
    operations: { 
      primary: '#3B82F6',
      red: '#C41E3A',
      light: '#E3F2FD',
    },
    sales: { 
      primary: '#8B5CF6',
      red: '#C41E3A',
      light: '#F3E5F5',
    },
    finance: { 
      primary: '#F59E0B',
      red: '#C41E3A',
      light: '#FFF8E1',
    },
    marketing: { 
      primary: '#EC4899',
      red: '#C41E3A',
      light: '#FCE4EC',
    },
    executive: { 
      primary: '#10B981',
      red: '#C41E3A',
      light: '#E8F5E9',
    },
    compliance: { 
      primary: '#6366F1',
      red: '#C41E3A',
      light: '#EEF2FF',
    },
    technology: { 
      primary: '#0EA5E9',
      red: '#C41E3A',
      light: '#E0F2FE',
    },
    legal: {
      primary: '#DC2626',
      red: '#C41E3A',
      light: '#FEE2E2',
    },
    intelligence: {
      primary: '#0D9488',
      red: '#C41E3A',
      light: '#CCFBF1',
    },
    humanResources: {
      primary: '#F97316',
      red: '#C41E3A',
      light: '#FFEDD5',
    },
    projectManagement: {
      primary: '#A855F7',
      red: '#C41E3A',
      light: '#F5F3FF',
    },
    clientSuccess: {
      primary: '#06B6D4',
      red: '#C41E3A',
      light: '#CFFAFE',
    },
    dataAnalytics: {
      primary: '#14B8A6',
      red: '#C41E3A',
      light: '#CCFBF1',
    },
    regulatory: {
      primary: '#D97706',
      red: '#C41E3A',
      light: '#FEF3C7',
    },
    commercial: {
      primary: '#6366F1',
      red: '#C41E3A',
      light: '#EEF2FF',
    },
    riskManagement: {
      primary: '#EF4444',
      red: '#C41E3A',
      light: '#FEE2E2',
    },
    qualityTraining: {
      primary: '#3B82F6',
      red: '#C41E3A',
      light: '#EFF6FF',
    },
    realEstate: {
      primary: '#E11D48',
      red: '#C41E3A',
      light: '#FFE4E6',
    },
    investorRelations: {
      primary: '#0891B2',
      red: '#C41E3A',
      light: '#CFFAFE',
    },
  },

  // Status Colors
  status: {
    success: '#10B981',       // Green for success
    warning: '#F59E0B',       // Orange for warning
    error: '#EF4444',         // Red for errors
    info: '#3B82F6',          // Blue for info
    pending: '#F59E0B',       // Orange for pending
    active: '#C41E3A',        // Red for active/online
    inactive: '#9CA3AF',      // Gray for inactive
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',       // Near black for main text
    secondary: '#666666',     // Gray for secondary text
    tertiary: '#999999',      // Light gray for tertiary text
    onRed: '#FFFFFF',         // White text on red background
    onWhite: '#1A1A1A',       // Black text on white background
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',       // Main background
    secondary: '#F9F9F9',     // Secondary background
    tertiary: '#F5F5F5',      // Tertiary background
    redTint: '#FCE4E6',       // Red tinted background for highlights
    whiteTint: '#FAFAFA',     // Almost white
  },

  // Border Colors
  border: {
    light: '#E5E5E5',         // Light borders
    medium: '#D0D0D0',        // Medium borders
    dark: '#A0A0A0',          // Dark borders
    red: '#C41E3A',           // Red accent borders
    redLight: '#F8DCDC',      // Light red borders
  },

  // Shadow Colors (for depth)
  shadow: {
    red: 'rgba(196, 30, 58, 0.15)',    // Red-tinted shadow
    dark: 'rgba(26, 26, 26, 0.1)',     // Dark shadow
    light: 'rgba(0, 0, 0, 0.05)',      // Light shadow
  },

  // Gradient System
  gradients: {
    redGold: 'linear-gradient(135deg, #C41E3A 0%, #D4AF37 100%)',
    redWhite: 'linear-gradient(135deg, #C41E3A 0%, #FFFFFF 100%)',
    whiteRed: 'linear-gradient(135deg, #FFFFFF 0%, #C41E3A 100%)',
    redBlack: 'linear-gradient(135deg, #C41E3A 0%, #1A1A1A 100%)',
    luxuryDark: 'linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%)',
    luxuryLight: 'linear-gradient(135deg, #F9F9F9 0%, #FFFFFF 100%)',
  },

  // Overlay Colors
  overlay: {
    red: 'rgba(196, 30, 58, 0.8)',     // 80% opacity red
    dark: 'rgba(26, 26, 26, 0.9)',     // 90% opacity dark
    light: 'rgba(255, 255, 255, 0.95)', // 95% opacity white
  },
};

// Export convenience functions
export const getColorByDepartment = (departmentId) => {
  return COLOR_TOKENS.departments[departmentId] || COLOR_TOKENS.departments.executive;
};

export const getRGBA = (color, opacity) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default COLOR_TOKENS;
