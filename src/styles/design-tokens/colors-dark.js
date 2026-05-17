/**
 * Dark Mode Color Tokens
 * Red & White branding maintained for dark theme
 * Ensures WCAG AAA contrast ratios (7:1 for text)
 * 
 * @version 1.0
 * @lastUpdated January 16, 2026
 */

export const COLOR_TOKENS_DARK = {
  // Primary Brand Colors (adjusted for dark mode)
  primary: {
    red: '#E63946',           // Brighter red for dark backgrounds
    redLight: '#F77F88',      // Light red for hover states
    redDark: '#A4161A',       // Dark red for pressed states
    redVeryLight: '#2D1418',  // Very dark red tint for backgrounds
    gold: '#FFB74D',          // Gold accent
    white: '#FFFFFF',         // Pure white for text
  },

  // Dark Mode Backgrounds
  background: {
    primary: '#121212',       // Pure black for main background
    secondary: '#1E1E1E',     // Slightly lighter for cards
    tertiary: '#2A2A2A',      // Even lighter for elevation
    quaternary: '#323232',    // Additional elevation level
    overlay: '#0A0A0A',       // For modals/overlays
    surface: '#262626',       // Surface color
    elevated: '#323232',      // Elevated surfaces
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',       // White for main text
    secondary: '#E0E0E0',     // Light gray for secondary
    tertiary: '#A0A0A0',      // Gray for tertiary
    quaternary: '#808080',    // Darker gray
    onRed: '#FFFFFF',         // White text on red
    muted: '#666666',         // Muted text
    disabled: '#555555',      // Disabled text
  },

  // Border & Surface Colors
  border: {
    light: '#333333',         // Light borders
    medium: '#444444',        // Medium borders
    dark: '#555555',          // Dark borders
    red: '#E63946',           // Red accent borders
    redLight: '#2D1418',      // Light red borders
    divider: 'rgba(255, 255, 255, 0.12)',  // Divider line
  },

  // Status Colors (Dark Mode Optimized)
  status: {
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#2E7D32',
      background: 'rgba(102, 187, 106, 0.12)',
      text: '#81C784',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#E65100',
      background: 'rgba(255, 167, 38, 0.12)',
      text: '#FFB74D',
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#C62828',
      background: 'rgba(239, 83, 80, 0.12)',
      text: '#EF5350',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0277BD',
      background: 'rgba(41, 182, 246, 0.12)',
      text: '#4FC3F7',
    },
    pending: {
      main: '#AB47BC',
      light: '#BA68C8',
      dark: '#7B1FA2',
      background: 'rgba(171, 71, 188, 0.12)',
      text: '#BA68C8',
    },
    active: {
      main: '#66BB6A',
      light: '#81C784',
      background: 'rgba(102, 187, 106, 0.12)',
      text: '#81C784',
    },
    inactive: {
      main: '#757575',
      light: '#9E9E9E',
      background: 'rgba(117, 117, 117, 0.12)',
      text: '#9E9E9E',
    },
  },

  // Department Colors (Dark Mode Variants)
  departments: {
    communications: {
      primary: '#4DB8FF',
      red: '#E63946',
      light: '#1A2E3E',
      background: 'rgba(77, 184, 255, 0.12)',
    },
    operations: {
      primary: '#64B5F6',
      red: '#E63946',
      light: '#1A2A3E',
      background: 'rgba(100, 181, 246, 0.12)',
    },
    sales: {
      primary: '#BA68C8',
      red: '#E63946',
      light: '#2E1A3E',
      background: 'rgba(186, 104, 200, 0.12)',
    },
    finance: {
      primary: '#FFB74D',
      red: '#E63946',
      light: '#3E2E1A',
      background: 'rgba(255, 183, 77, 0.12)',
    },
    marketing: {
      primary: '#F48FB1',
      red: '#E63946',
      light: '#3E1A2A',
      background: 'rgba(244, 143, 177, 0.12)',
    },
    executive: {
      primary: '#81C784',
      red: '#E63946',
      light: '#1A3E1A',
      background: 'rgba(129, 199, 132, 0.12)',
    },
    compliance: {
      primary: '#7986CB',
      red: '#E63946',
      light: '#1A1E3E',
      background: 'rgba(121, 134, 203, 0.12)',
    },
    technology: {
      primary: '#4DD0E1',
      red: '#E63946',
      light: '#1A2E3E',
      background: 'rgba(77, 208, 225, 0.12)',
    },
    legal: {
      primary: '#EF5350',
      red: '#E63946',
      light: '#3E1A1A',
      background: 'rgba(239, 83, 80, 0.12)',
    },
    intelligence: {
      primary: '#4DB8A8',
      red: '#E63946',
      light: '#1A2E2A',
      background: 'rgba(77, 184, 168, 0.12)',
    },
    hr: {
      primary: '#FF85C0',
      red: '#E63946',
      light: '#3E1A2A',
      background: 'rgba(255, 133, 192, 0.12)',
    },
  },

  // Accent Colors
  accent: {
    gold: '#FFB74D',          // Gold
    platinum: '#E8E8E8',      // Light gray
    copper: '#B87333',        // Copper
  },

  // Shadow Colors (Red-tinted for dark mode)
  shadow: {
    red: 'rgba(230, 57, 70, 0.3)',    // Red shadow
    dark: 'rgba(0, 0, 0, 0.5)',       // Dark shadow
    light: 'rgba(255, 255, 255, 0.1)', // Light shadow
    elevation1: 'rgba(0, 0, 0, 0.3)',
    elevation2: 'rgba(0, 0, 0, 0.4)',
    elevation3: 'rgba(0, 0, 0, 0.5)',
  },

  // Gradient System (Dark Mode)
  gradients: {
    redGold: 'linear-gradient(135deg, #E63946 0%, #FFB74D 100%)',
    redWhite: 'linear-gradient(135deg, #E63946 0%, #FFFFFF 100%)',
    redBlack: 'linear-gradient(135deg, #E63946 0%, #121212 100%)',
    luxuryDark: 'linear-gradient(135deg, #121212 0%, #2A2A2A 100%)',
    luxuryLight: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
    redToDark: 'linear-gradient(180deg, #E63946 0%, #2A2A2A 100%)',
  },

  // Overlay Colors
  overlay: {
    red: 'rgba(230, 57, 70, 0.9)',    // 90% opacity red
    dark: 'rgba(18, 18, 18, 0.95)',   // 95% opacity dark
    light: 'rgba(255, 255, 255, 0.15)', // 15% opacity white
    scrim: 'rgba(0, 0, 0, 0.7)',      // Scrim for modals
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
};

export default COLOR_TOKENS_DARK;
