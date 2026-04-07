import styled from 'styled-components';
import { theme } from '../../../styles/theme';

/* ===============================================
   NAVBAR CONTAINER
   =============================================== */

export const NavBarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${theme.colors.background.secondary};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  z-index: ${theme.zIndex.navbar};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  gap: ${theme.spacing.lg};

  @media (prefers-color-scheme: dark) {
    background: #1a1a2e;
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }
`;

/* ===============================================
   LEFT SECTION (LOGO + SIDEBAR TOGGLE)
   =============================================== */

export const NavLeftSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const LogoButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.md};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
  }
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogoLetter = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: white;
  font-family: ${theme.typography.fontFamily.heading};
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LogoTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.2;
  font-family: ${theme.typography.fontFamily.heading};

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

export const LogoSubtitle = styled.span`
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

/* ===============================================
   CENTER SECTION (SEARCH + QUICK STATS)
   =============================================== */

export const NavCenterSection = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: 1024px) {
    max-width: 400px;
    margin: 0 ${theme.spacing.md};
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    display: none;
  }
`;

/* ===============================================
   QUICK STATS BAR
   =============================================== */

export const QuickStatsBar = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.sm};
  align-items: center;
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background.tertiary};
  border-radius: 8px;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: 12px;
  color: ${theme.colors.text.secondary};

  svg {
    color: ${theme.colors.primary};
    flex-shrink: 0;
  }
`;

export const StatLabel = styled.span`
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const StatValue = styled.span<{ $status?: 'good' | 'warning' | 'critical' }>`
  font-weight: 600;
  color: ${props => {
    switch (props.$status) {
      case 'good':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'critical':
        return '#f44336';
      default:
        return theme.colors.text.primary;
    }
  }};
`;

/* ===============================================
   SEARCH BAR
   =============================================== */

export const SearchContainer = styled.div<{ $focused?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: ${theme.colors.background.tertiary};
  border: 1px solid transparent;
  border-radius: 8px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.08);
  }

  ${props => props.$focused && `
    background: ${theme.colors.background.secondary};
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.12);
      border-color: ${theme.colors.primary};
    }
  `}
`;

export const SearchIcon = styled.div`
  color: ${theme.colors.text.secondary};
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  outline: none;
  min-width: 200px;

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }

  @media (prefers-color-scheme: dark) {
    color: #ffffff;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const SearchShortcut = styled.div`
  display: flex;
  gap: 4px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ShortcutKey = styled.kbd`
  font-size: 11px;
  font-family: ${theme.typography.fontFamily.primary};
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 2px 6px;
  color: ${theme.colors.text.secondary};

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
  }
`;

/* ===============================================
   RIGHT SECTION (ICONS + DROPDOWNS)
   =============================================== */

export const NavRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

/* ===============================================
   NAV ICON BUTTON
   =============================================== */

export const NavIconButton = styled.button<{ $hasUnread?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${theme.colors.background.tertiary};
    color: ${theme.colors.text.primary};

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  ${props => props.$hasUnread && `
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: ${theme.colors.primary};
      border-radius: 50%;
      border: 2px solid ${theme.colors.background.secondary};
    }
  `}
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: ${theme.colors.primary};
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${theme.colors.background.secondary};
`;

/* ===============================================
   DROPDOWN CONTAINER & MENUS
   =============================================== */

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 280px;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
  z-index: ${theme.zIndex.navbar + 10};

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-color-scheme: dark) {
    background: #2a2a3e;
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

/* ===============================================
   DROPDOWN HEADER
   =============================================== */

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
  }
`;

export const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

/* ===============================================
   DROPDOWN CONTENT & ITEMS
   =============================================== */

export const DropdownContent = styled.div`
  max-height: 320px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.secondary};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  color: ${theme.colors.text.tertiary};
  gap: ${theme.spacing.md};

  p {
    margin: 0;
    font-size: 13px;
  }
`;

export const NotificationItem = styled.div<{ $unread?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: background 0.15s ease;
  background: ${props => (props.$unread ? '#ffebee' : 'transparent')};

  &:hover {
    background: ${props => (props.$unread ? '#ffcdd2' : theme.colors.background.tertiary)};
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => (props.$unread ? 'rgba(211, 47, 47, 0.1)' : 'transparent')};

    &:hover {
      background: ${props =>
        props.$unread ? 'rgba(211, 47, 47, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
    }
  }
`;

export const NotifIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  background: ${props => props.$color || theme.colors.primary};
`;

export const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifTitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  line-height: 1.4;
`;

export const NotifTime = styled.span`
  font-size: 11px;
  color: ${theme.colors.text.tertiary};
`;

/* ===============================================
   PROFILE TRIGGER & DROPDOWN
   =============================================== */

export const ProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 6px 12px 6px 6px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.background.tertiary};

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  @media (max-width: 768px) {
    padding: 6px;
  }
`;

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const SuperUserBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  background: #ffd700;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  line-height: 1.2;
`;

export const UserRole = styled.span<{ $isSuperUser?: boolean }>`
  font-size: 11px;
  color: ${props => (props.$isSuperUser ? theme.colors.primary : theme.colors.text.secondary)};
  font-weight: 500;
`;

export const ChevronIcon = styled.div<{ $open?: boolean }>`
  color: ${theme.colors.text.secondary};
  transition: transform 0.2s ease;
  ${props => props.$open && 'transform: rotate(180deg);'}
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ===============================================
   DROPDOWN ITEMS & STRUCTURE
   =============================================== */

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
  margin: 4px 0;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const DropdownItem = styled.button<{ $isLogout?: boolean; $isAdmin?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  font-size: 13px;
  color: ${props => (props.$isLogout ? '#B8960C' : theme.colors.text.primary)};
  cursor: pointer;
  transition: background 0.15s ease;
  text-align: left;

  svg {
    color: ${props => (props.$isLogout ? '#B8960C' : theme.colors.text.secondary)};
    flex-shrink: 0;
  }

  &:hover {
    background: ${theme.colors.background.tertiary};

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  ${props => props.$isAdmin && `color: ${theme.colors.primary};`}
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.tertiary};

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const ProfileAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const ProfileEmail = styled.span`
  font-size: 12px;
  color: ${theme.colors.text.secondary};
`;

export const DropdownFooter = styled.div`
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  text-align: center;

  button {
    background: none;
    border: none;
    font-size: 13px;
    color: ${theme.colors.primary};
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/* ===============================================
   SIDEBAR TOGGLE BUTTON
   =============================================== */

export const SidebarToggleButton = styled(NavIconButton)`
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;
