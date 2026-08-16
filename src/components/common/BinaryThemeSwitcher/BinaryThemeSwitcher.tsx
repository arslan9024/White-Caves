/**
 * BinaryThemeSwitcher — Wave 60 FE-GOAL-041
 * Strict binary theme switcher enforcing Light Mode (#FFFFFF + #EF4444) vs Dark Luxury Mode (#0F172A + #EF4444)
 * White Caves Real Estate LLC — Theme & UI/UX Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${p => p.$isDark ? '#1E293B' : '#F1F5F9'};
  border: 1px solid ${p => p.$isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(100, 116, 139, 0.3)'};
  color: ${p => p.$isDark ? '#FFF' : '#0F172A'};
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; }
`;

export const BinaryThemeSwitcher: FC<{ onToggle?: (theme: 'dark' | 'light') => void }> = ({ onToggle }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    onToggle?.(next);
  };

  return (
    <SwitchContainer $isDark={theme === 'dark'} onClick={toggle} data-testid="binary-theme-switcher" aria-label="Toggle Theme">
      <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span>{theme === 'dark' ? 'Dark Luxury' : 'Light Mode'}</span>
    </SwitchContainer>
  );
};

export default BinaryThemeSwitcher;
