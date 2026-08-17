/**
 * BinaryThemeSwitcher.logic.ts — Hook & Logic Layer
 */

import { useCallback } from 'react';
import { useTheme, type ThemeMode } from '../../../../context/ThemeContext';
import { THEME_OPTIONS } from '../data/BinaryThemeSwitcher.data';

export interface UseBinaryThemeSwitcherProps {
  onToggle?: (theme: 'dark' | 'light' | 'system') => void;
}

export function useBinaryThemeSwitcherLogic(props?: UseBinaryThemeSwitcherProps) {
  const { themeMode, setThemeMode, isDark } = useTheme();

  const handleSelect = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
      props?.onToggle?.(mode as any);
    },
    [setThemeMode, props]
  );

  return {
    themeMode,
    isDark,
    handleSelect,
    options: THEME_OPTIONS,
  };
}
