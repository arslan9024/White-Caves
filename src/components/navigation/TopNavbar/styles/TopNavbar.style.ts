/**
 * TopNavbar.style.ts — Hardware-Accelerated Styled-Components (Fixed Header & Overhanging Logo)
 */

import styled from 'styled-components';

export const NavHeaderContainer = styled.header<{ $isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ $isDark }) =>
    $isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.96)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 2px solid #EF4444;
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.05)'};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

export const OverhangingLogoWrapper = styled.div`
  position: relative;
  width: 76px;
  height: 64px;
  display: flex;
  align-items: center;
`;

export const OverhangingCircularLogo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(22%);
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.6rem;
  border: 3.5px solid #EF4444;
  box-shadow: 0 10px 28px rgba(239, 68, 68, 0.5);
  z-index: 1010;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(22%) scale(1.05);
    box-shadow: 0 14px 34px rgba(239, 68, 68, 0.65);
  }
`;

export const NavSearchBox = styled.form<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 9999px;
  background: ${({ $isDark }) => ($isDark ? '#1E293B' : '#F1F5F9')};
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : '#E2E8F0')};
  width: 100%;
  max-width: 420px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const ThemeToggleButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ $isDark }) => ($isDark ? '#1E293B' : '#F1F5F9')};
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : '#E2E8F0')};
  color: ${({ $isDark }) => ($isDark ? '#F59E0B' : '#0F172A')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #EF4444;
    transform: scale(1.05);
  }
`;
