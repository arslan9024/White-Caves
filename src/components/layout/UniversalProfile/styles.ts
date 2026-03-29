import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { theme } from '../../../styles/theme';

/* ===============================================
   UNIVERSAL PROFILE CONTAINER
   =============================================== */

export const UniversalProfileContainer = styled.div<{ $compact?: boolean }>`
  position: relative;
`;

/* ===============================================
   SIGN IN BUTTON (FOR UNAUTHENTICATED USERS)
   =============================================== */

export const ProfileSignInBtn = styled(RouterLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #FFCA28 0%, #D4AF37 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }
`;

/* ===============================================
   PROFILE TRIGGER BUTTON
   =============================================== */

export const ProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.compact {
    padding: 2px;
  }
`;

/* ===============================================
   PROFILE AVATAR
   =============================================== */

export const ProfileAvatar = styled.div<{ $large?: boolean }>`
  width: ${props => (props.$large ? '50px' : '42px')};
  height: ${props => (props.$large ? '50px' : '42px')};
  border-radius: 50%;
  background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${ProfileTrigger}:hover & {
    border-color: #D4AF37;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    ${props =>
      props.$large
        ? `
      width: 44px;
      height: 44px;
    `
        : ''}
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarInitials = styled.span<{ $large?: boolean }>`
  color: #ffffff;
  font-size: ${props => (props.$large ? '1.2rem' : '1rem')};
  font-weight: 600;
`;

/* ===============================================
   PROFILE ARROW (DROPDOWN INDICATOR)
   =============================================== */

export const ProfileArrow = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
`;

/* ===============================================
   PROFILE DROPDOWN MENU
   =============================================== */

export const ProfileDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: var(--bg-card, #1a1a2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: profileDropdownFade 0.2s ease;
  z-index: var(--z-dropdown, 100);

  @keyframes profileDropdownFade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-color-scheme: light) {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    min-width: 260px;
    right: -10px;
  }
`;

export const ProfileDropdownHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(212, 175, 55, 0.1);

  @media (prefers-color-scheme: light) {
    background: rgba(212, 175, 55, 0.05);
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const ProfileName = styled.span`
  font-weight: 600;
  color: var(--text-primary, #ffffff);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: light) {
    color: #1f2937;
  }
`;

export const ProfileEmail = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: light) {
    color: #6b7280;
  }
`;

export const ProfileRole = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 2px;
`;

/* ===============================================
   PROFILE DROPDOWN DIVIDER
   =============================================== */

export const ProfileDropdownDivider = styled.div`
  height: 1px;
  background: var(--border-color, rgba(255, 255, 255, 0.1));
  margin: 4px 0;

  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.1);
  }
`;

/* ===============================================
   PROFILE DROPDOWN ITEMS
   =============================================== */

export const ProfileDropdownItem = styled.button<{ $logout?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${props =>
    props.$logout
      ? '#ef4444'
      : 'var(--text-primary, rgba(255, 255, 255, 0.9))'};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;

  &:hover {
    background: ${props =>
      props.$logout
        ? 'rgba(239, 68, 68, 0.15)'
        : 'rgba(212, 175, 55, 0.15)'};
    color: ${props =>
      props.$logout ? '#ef4444' : 'var(--text-primary, #ffffff)'};
  }

  @media (prefers-color-scheme: light) {
    color: ${props => (props.$logout ? '#ef4444' : '#374151')};

    &:hover {
      background: ${props =>
        props.$logout
          ? 'rgba(239, 68, 68, 0.2)'
          : 'rgba(212, 175, 55, 0.1)'};
      color: ${props => (props.$logout ? '#ef4444' : '#1f2937')};
    }
  }
`;

export const ProfileDropdownItemLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary, rgba(255, 255, 255, 0.9));
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(212, 175, 55, 0.15);
    color: var(--text-primary, #ffffff);
  }

  @media (prefers-color-scheme: light) {
    color: #374151;

    &:hover {
      background: rgba(212, 175, 55, 0.1);
      color: #1f2937;
    }
  }
`;

/* ===============================================
   DROPDOWN ICON
   =============================================== */

export const DropdownIcon = styled.span`
  font-size: 1rem;
  width: 24px;
  text-align: center;
`;

/* ===============================================
   THEME MODE INDICATOR
   =============================================== */

export const ProfileArrowDark = styled.span`
  color: rgba(255, 255, 255, 0.7);

  @media (prefers-color-scheme: light) {
    color: rgba(0, 0, 0, 0.5);
  }
`;
