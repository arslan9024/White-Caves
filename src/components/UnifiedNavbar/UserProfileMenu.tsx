/**
 * User Profile Menu Component
 * User avatar with dropdown menu
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Avatar } from '../design-system';

export type UserProfileMenuProps = {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    initials?: string;
  };
  onSettings?: () => void;
  onProfile?: () => void;
  onLogout?: () => void;
  className?: string;
};

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: 50%;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};

  &:hover {
    background: ${theme.colors.background.secondary};
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.spacing.sm};
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.lg};
  min-width: 240px;
  z-index: ${theme.zIndex.dropdown};
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  overflow: hidden;
`;

const UserInfo = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  text-align: center;
`;

const UserName = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.sm};
`;

const UserEmail = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.xs};
  margin-top: ${theme.spacing.xs};
  word-break: break-word;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  text-align: left;
  width: 100%;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};

  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.primary};
  }

  &:active {
    background: ${theme.colors.background.secondary};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
  margin: ${theme.spacing.sm} 0;
`;

const LogoutButton = styled(MenuItem)`
  color: ${theme.colors.error};

  &:hover {
    color: ${theme.colors.error};
    background: ${theme.colors.background.secondary};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${theme.zIndex.dropdown - 1};
`;

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  onSettings,
  onProfile,
  onLogout,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const handleSettings = () => {
    setIsOpen(false);
    onSettings?.();
  };

  const handleProfile = () => {
    setIsOpen(false);
    onProfile?.();
  };

  return (
    <ProfileContainer className={className}>
      <ProfileButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Avatar
          initials={user?.initials || user?.name?.charAt(0).toUpperCase()}
          src={user?.avatar}
          size="md"
        />
      </ProfileButton>

      <DropdownMenu $isOpen={isOpen}>
        {user && (
          <>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>
            <MenuList>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleSettings}>Settings</MenuItem>
              <Divider />
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </MenuList>
          </>
        )}
      </DropdownMenu>

      {isOpen && (
        <Backdrop
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </ProfileContainer>
  );
};

UserProfileMenu.displayName = 'UserProfileMenu';

export default UserProfileMenu;
