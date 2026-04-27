import styled from 'styled-components';
import { spacing } from '../styles/theme/spacing';

export const ThemeToggleButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToggleTrack = styled.div<{ $isDark: boolean }>`
  width: 52px;
  height: 28px;
  background: ${props => props.$isDark 
    ? (props.theme?.colors?.primary || '#2196F3')
    : (props.theme?.colors?.borderColor || '#cccccc')
  };
  border-radius: 14px;
  position: relative;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (hover: hover) {
    &:hover {
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }
  }
`;

export const ToggleIcons = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 7px;
  box-sizing: border-box;
`;

export const IconSun = styled.span<{ $isDark: boolean }>`
  color: ${props => props.theme?.colors?.accentGold || '#FFC107'};
  opacity: ${props => props.$isDark ? 0.5 : 1};
  transition: opacity 0.3s ease;
`;

export const IconMoon = styled.span<{ $isDark: boolean }>`
  color: #ffffff;
  opacity: ${props => props.$isDark ? 1 : 0.5};
  transition: opacity 0.3s ease;
`;

export const ToggleThumb = styled.div<{ $isDark: boolean }>`
  width: 22px;
  height: 22px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  left: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$isDark ? 'translateX(24px)' : 'translateX(0)'};
`;
