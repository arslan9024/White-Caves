import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../context/ThemeContext';
import * as S from './ThemeToggle.styles';

interface ThemeModeOption {
  mode: ThemeMode;
  icon: React.ReactNode;
  title: string;
}

const MODES: ThemeModeOption[] = [
  { mode: 'light', icon: <Sun size={14} aria-hidden="true" />, title: 'Light mode' },
  { mode: 'system', icon: <Monitor size={14} aria-hidden="true" />, title: 'System (auto)' },
  { mode: 'dark', icon: <Moon size={14} aria-hidden="true" />, title: 'Dark mode' },
];

interface ThemeToggleProps {
  className?: string;
  /** Compact single-icon mode: cycles through light → system → dark */
  compact?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', compact = false }) => {
  const { themeMode, setThemeMode, isDark } = useTheme();

  if (compact) {
    // Legacy single-button mode: click cycles through modes
    const cycleOrder: ThemeMode[] = ['light', 'system', 'dark'];
    const nextMode = cycleOrder[(cycleOrder.indexOf(themeMode) + 1) % cycleOrder.length];
    const currentOption = MODES.find(m => m.mode === themeMode) ?? MODES[1];

    return (
      <S.ThemeToggleButton
        className={className}
        onClick={() => setThemeMode(nextMode)}
        aria-label={`Theme: ${themeMode}. Click to switch to ${nextMode} mode`}
        title={currentOption.title}
      >
        <S.ToggleTrack $isDark={isDark}>
          <S.ToggleIcons>
            <S.IconSun $isDark={isDark}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            </S.IconSun>
            <S.IconMoon $isDark={isDark}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z" />
              </svg>
            </S.IconMoon>
          </S.ToggleIcons>
          <S.ToggleThumb $isDark={isDark} />
        </S.ToggleTrack>
      </S.ThemeToggleButton>
    );
  }

  // 3-way pill mode
  return (
    <div
      className={`wc-theme-pill ${className}`.trim()}
      role="group"
      aria-label="Theme mode"
      style={{
        display: 'inline-flex',
        gap: '2px',
        padding: '3px',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '999px',
      }}
    >
      {MODES.map(({ mode, icon, title }) => {
        const active = themeMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setThemeMode(mode)}
            aria-pressed={active}
            aria-label={title}
            title={title}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: active ? '#C41E3A' : 'transparent',
              color: active ? '#ffffff' : isDark ? 'rgba(250,250,250,0.5)' : '#6b7280',
              boxShadow: active ? '0 2px 8px rgba(196,30,58,0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
