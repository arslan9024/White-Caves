import styled from 'styled-components';

export const NavHeaderContainer = styled.header<{ $isDark?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem; /* 64px fixed navbar frame */
  background: ${({ $isDark }) => ($isDark ? '#0F172A' : '#FFFFFF')};
  border-bottom: 2px solid #EF4444;
  color: ${({ $isDark }) => ($isDark ? '#F8FAFC' : '#1E293B')};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  transition: background 0.3s ease, border-color 0.3s ease;
`;

export const OverhangingLogoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const OverhangingLogoBadge = styled.div<{ $isDark?: boolean }>`
  position: absolute;
  top: 0;
  transform: translateY(33.33%);
  width: 4rem; /* 64px x 64px doubled size */
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.4rem;
  letter-spacing: -0.02em;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4), 0 0 0 3px ${({ $isDark }) => ($isDark ? '#0F172A' : '#FFFFFF')};
  z-index: 1010;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(40%) scale(1.05);
    box-shadow: 0 12px 30px rgba(239, 68, 68, 0.55), 0 0 0 3px #EF4444;
  }
`;

export const ThemeToggleButton = styled.button<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)')};
  border: 1.5px solid ${({ $isDark }) => ($isDark ? '#EF4444' : 'rgba(239, 68, 68, 0.3)')};
  color: ${({ $isDark }) => ($isDark ? '#F8FAFC' : '#1E293B')};
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #EF4444;
    color: #FFFFFF;
    border-color: #EF4444;
  }
`;

export const DropdownWrapper = styled.div<{ $isOpen?: boolean; $isLocked?: boolean; $isDark?: boolean }>`
  position: relative;

  &:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    min-width: 220px;
    background: ${({ $isDark }) => ($isDark ? '#1E293B' : '#FFFFFF')};
    border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')};
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(16px);
    padding: 8px;
    z-index: 1005;
    opacity: ${({ $isLocked }) => ($isLocked ? 1 : 0)};
    visibility: ${({ $isLocked }) => ($isLocked ? 'visible' : 'hidden')};
    transform: ${({ $isLocked }) => ($isLocked ? 'translateY(0)' : 'translateY(-8px)')};
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;
