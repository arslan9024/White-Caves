import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { theme } from '../../../styles/theme';

/* ===============================================
   TOP NAV BAR CONTAINER
   =============================================== */

export const TopNavBarHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  z-index: ${theme.zIndex.navbar};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(220, 38, 38, 0.3);
  gap: ${theme.spacing.xl};

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};
    height: 60px;
  }
`;

/* ===============================================
   LEFT SECTION (LOGO + LINKS)
   =============================================== */

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
`;

export const NavLogo = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  text-decoration: none;

  img {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    object-fit: cover;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    font-family: 'Montserrat', sans-serif;

    @media (max-width: 1024px) {
      display: none;
    }
  }
`;

export const NavLinks = styled.nav`
  display: flex;
  gap: ${theme.spacing.sm};

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const NavLink = styled(RouterLink)<{ active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${props => (props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)')};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: ${props =>
    props.active ? 'rgba(220, 38, 38, 0.3)' : 'transparent'};

  &:hover {
    color: #ffffff;
    background: rgba(220, 38, 38, 0.2);
  }
`;

/* ===============================================
   CENTER SECTION (MENUS)
   =============================================== */

export const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ===============================================
   ROLE DROPDOWN
   =============================================== */

export const RoleDropdown = styled.div`
  position: relative;
`;

export const RoleTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 25px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  --role-color: #ffffff;
`;

export const RoleIcon = styled.span`
  font-size: 1.1rem;
`;

export const RoleLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

export const DropdownArrow = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
`;

export const DropdownMenuRole = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: dropdownFade 0.2s ease;
  z-index: ${theme.zIndex.navbar + 10};

  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled(RouterLink)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  color: ${props => (props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)')};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: ${props => (props.active ? 'rgba(220, 38, 38, 0.3)' : 'transparent')};
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(220, 38, 38, 0.2);
    color: #ffffff;
  }

  .item-icon {
    font-size: 1rem;
    width: 24px;
    text-align: center;
  }

  &.browse-item {
    padding-left: ${theme.spacing.lg};
    font-size: 0.85rem;
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: ${theme.spacing.sm} 0;
`;

export const DropdownSectionLabel = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md} 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
`;

/* ===============================================
   WHATSAPP DROPDOWN
   =============================================== */

export const WhatsappDropdown = styled.div`
  position: relative;
`;

export const WhatsappTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 25px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(37, 211, 102, 0.4);
  background: rgba(37, 211, 102, 0.2);

  &:hover {
    background: rgba(37, 211, 102, 0.3);
  }
`;

export const WaIcon = styled.span`
  font-size: 1.1rem;
  color: #25d366;
  flex-shrink: 0;
`;

export const DropdownMenuWhatsapp = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: dropdownFade 0.2s ease;
  z-index: ${theme.zIndex.navbar + 10};

  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ===============================================
   RIGHT SECTION (CONTROLS)
   =============================================== */

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

export const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #ffffff;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(15deg) scale(1.05);
  }
`;

export const OnlineIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const StatusDot = styled.div<{ online?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props =>
    props.online ? '#22c55e' : '#ef4444'};
  box-shadow: ${props =>
    props.online
      ? '0 0 8px rgba(34, 197, 94, 0.6)'
      : '0 0 8px rgba(239, 68, 68, 0.6)'};
  ${props =>
    props.online ? 'animation: pulse 2s infinite;' : 'animation: none;'}

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const StatusText = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
`;

export const DatetimeDisplay = styled.div`
  text-align: right;
  color: rgba(255, 255, 255, 0.9);
`;

export const DateDisplay = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`;

export const TimeDisplay = styled.div`
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Montserrat', monospace;
  color: #dc2626;
`;

/* ===============================================
   LEGACY EXPORTS (FOR COMPATIBILITY)
   =============================================== */

export const DropdownTrigger = RoleTrigger;
export const TriggerIcon = RoleIcon;
export const WHAIcon = WaIcon;
export const DropdownMenu = DropdownMenuRole;
export const ItemIcon = styled.span`
  font-size: 1rem;
  width: 24px;
  text-align: center;
`;

export const NavRightSection = NavRight;

export const ProfileTrigger = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const ProfileCircle = styled.div<{ $large?: boolean }>`
  width: ${props => (props.$large ? '50px' : '45px')};
  height: ${props => (props.$large ? '50px' : '45px')};
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #dc2626;
    transform: scale(1.05);
  }
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProfileInitials = styled.span`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
`;

export const ProfileMenu = styled.div`
  min-width: 280px;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ProfileName = styled.span`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
`;

export const ProfileEmail = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

export const ProfileRole = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.7);
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const BrowseItem = DropdownItem;
export const NavLeftSection = NavLeft;
export const NavCenterSection = NavCenter;

