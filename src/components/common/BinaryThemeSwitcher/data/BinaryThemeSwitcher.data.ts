/**
 * BinaryThemeSwitcher.data.ts — Content & Data Variables
 */

import { ThemeMode } from '../../../../context/ThemeContext';

export interface ThemeOption {
  mode: ThemeMode;
  label: string;
  icon: string;
  ariaLabel: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { mode: 'light', label: 'Light', icon: '☀️', ariaLabel: 'Switch to Light Mode' },
  { mode: 'dark', label: 'Dark', icon: '🌙', ariaLabel: 'Switch to Dark Luxury Mode' },
  { mode: 'system', label: 'Auto', icon: '💻', ariaLabel: 'Switch to System Default Theme' },
];
