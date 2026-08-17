/**
 * BinaryThemeSwitcher / ThemeTriadSwitcher
 * Full Triad theme switcher enforcing Light Mode (#FFFFFF), Dark Luxury Mode (#0F172A), and System (Auto)
 * White Caves Real Estate LLC — Theme & UI/UX Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';
import { useTheme, type ThemeMode } from '../../../context/ThemeContext';

const SwitchContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(100, 116, 139, 0.25);
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  border: none;
  background: ${p => (p.$active ? '#EF4444' : 'transparent')};
  color: ${p => (p.$active ? '#FFFFFF' : '#94A3B8')};
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: #FFFFFF;
    background: ${p => (p.$active ? '#EF4444' : 'rgba(255, 255, 255, 0.08)')};
  }
`;

export interface BinaryThemeSwitcherProps {
  onToggle?: (theme: 'dark' | 'light' | 'system') => void;
  className?: string;
}

export const BinaryThemeSwitcher: FC<BinaryThemeSwitcherProps> = ({
  onToggle,
  className,
}) => {
  const { themeMode, setThemeMode, isDark } = useTheme();

  const handleSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    onToggle?.(mode as any);
  };

  return (
    <SwitchContainer className={className} data-testid="binary-theme-switcher" aria-label="Select Theme Mode">
      <ModeBtn
        $active={themeMode === 'light'}
        onClick={() => handleSelect('light')}
        data-testid="theme-btn-light"
        title="Light Mode"
        aria-pressed={themeMode === 'light'}
      >
        <span>☀️</span>
        <span>Light</span>
      </ModeBtn>
      <ModeBtn
        $active={themeMode === 'dark'}
        onClick={() => handleSelect('dark')}
        data-testid="theme-btn-dark"
        title="Dark Luxury Mode"
        aria-pressed={themeMode === 'dark'}
      >
        <span>🌙</span>
        <span>Dark</span>
      </ModeBtn>
      <ModeBtn
        $active={themeMode === 'system'}
        onClick={() => handleSelect('system')}
        data-testid="theme-btn-system"
        title="System Preference"
        aria-pressed={themeMode === 'system'}
      >
        <span>💻</span>
        <span>System</span>
      </ModeBtn>
    </SwitchContainer>
  );
};

export default BinaryThemeSwitcher;
