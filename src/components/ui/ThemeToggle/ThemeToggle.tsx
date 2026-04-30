/**
 * @component ThemeToggle
 * @agent @Una (Luxury UI/UX Specialist)
 *
 * Three-way theme toggle: Light / Dark / System
 * Uses Red/White design system tokens
 * Accessible — keyboard nav + ARIA roles
 */

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../../../context/ThemeContext';
import './ThemeToggle.css';

interface ThemeModeOption {
  mode: ThemeMode;
  icon: React.ReactNode;
  label: string;
  title: string;
}

const MODES: ThemeModeOption[] = [
  {
    mode: 'light',
    icon: <Sun size={15} aria-hidden="true" />,
    label: 'Light',
    title: 'Switch to light mode',
  },
  {
    mode: 'system',
    icon: <Monitor size={15} aria-hidden="true" />,
    label: 'Auto',
    title: 'Follow system preference',
  },
  {
    mode: 'dark',
    icon: <Moon size={15} aria-hidden="true" />,
    label: 'Dark',
    title: 'Switch to dark mode',
  },
];

export interface ThemeToggleProps {
  /** Show text labels next to icons */
  showLabels?: boolean;
  /** Visual variant */
  variant?: 'pill' | 'icon-only';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabels = false,
  variant = 'pill',
  className = '',
}) => {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <div
      className={`theme-toggle theme-toggle--${variant} ${className}`.trim()}
      role="group"
      aria-label="Theme mode selector"
    >
      {MODES.map(({ mode, icon, label, title }) => (
        <button
          key={mode}
          className={`theme-toggle__btn${themeMode === mode ? ' theme-toggle__btn--active' : ''}`}
          onClick={() => setThemeMode(mode)}
          title={title}
          aria-pressed={themeMode === mode}
          aria-label={title}
          type="button"
        >
          {icon}
          {showLabels && (
            <span className="theme-toggle__label">{label}</span>
          )}
        </button>
      ))}
    </div>
  );
};
