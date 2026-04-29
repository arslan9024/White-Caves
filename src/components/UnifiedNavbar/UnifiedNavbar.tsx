/**
 * Unified Navbar Component
 * Single source of truth for top-level navigation
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import NotificationCenter from './NotificationCenter';
import UserProfileMenu from './UserProfileMenu';
import AdminControls from './AdminControls';

export type UnifiedNavbarProps = {
  title?: string;
  logoSrc?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    initials?: string;
    role?: 'admin' | 'super_user' | 'agent' | 'client';
  };
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  systemStatus?: 'online' | 'offline' | 'warning';
  onNotificationViewAll?: () => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onUserManagement?: () => void;
  className?: string;
};

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${theme.colors.background.primary};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.lg};
  gap: ${theme.spacing.lg};
  z-index: ${theme.zIndex.navbar};
  box-shadow: ${theme.shadows.sm};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  min-width: 0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-shrink: 0;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.span`
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const DashboardTitle = styled.h1`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const CenterSection = styled.div`
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  flex-shrink: 0;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${theme.colors.border};
`;

export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({
  title = 'Dashboard',
  logoSrc,
  user,
  notifications = [],
  systemStatus = 'online',
  onNotificationViewAll,
  onMarkNotificationAsRead,
  onProfileClick,
  onSettingsClick,
  onLogout,
  onUserManagement,
  className = '',
}) => {
  const isAdmin = user?.role === 'admin' || user?.role === 'super_user';

  return (
    <NavbarContainer className={className} role="navigation" aria-label="Main navigation">
      <LeftSection>
        <LogoSection>
          {logoSrc && <Logo src={logoSrc} alt="Company logo" />}
          <LogoText>White Caves</LogoText>
        </LogoSection>
        {title && <DashboardTitle>{title}</DashboardTitle>}
      </LeftSection>

      <CenterSection aria-hidden="true" />

      <RightSection>
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={onMarkNotificationAsRead}
          onViewAll={onNotificationViewAll}
          aria-label="Notifications"
        />

        {isAdmin && (
          <>
            <Divider aria-hidden="true" />
            <AdminControls
              visible={isAdmin}
              systemStatus={systemStatus}
              onUserManagement={onUserManagement}
              onSettings={onSettingsClick}
              aria-label="Admin controls"
            />
          </>
        )}

        {!isAdmin && <Divider aria-hidden="true" />}

        <UserProfileMenu
          user={user}
          onProfile={onProfileClick}
          onSettings={onSettingsClick}
          onLogout={onLogout}
          aria-label="User menu"
        />
      </RightSection>
    </NavbarContainer>
  );
};

UnifiedNavbar.displayName = 'UnifiedNavbar';

export default UnifiedNavbar;
