import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const UniversalNavHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--nav-bg, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%));
  display: flex;
  align-items: center;
  z-index: var(--z-navbar, 500);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(220, 38, 38, 0.3);
`;

export const NavContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

export const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;

  img {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

export const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
`;

export const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 5px;
  padding: 8px;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: #ffffff;
    border-radius: 2px;
    transition: all 0.3s ease;

    &:nth-child(1) {
      transform: ${(props) =>
        props.$isOpen ? 'translateY(7px) rotate(45deg)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.$isOpen ? '0' : '1')};
    }

    &:nth-child(3) {
      transform: ${(props) =>
        props.$isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'};
    }
  }
`;

export const NavCenter = styled.nav<{ $mobileOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    position: ${(props) => (props.$mobileOpen ? 'fixed' : 'absolute')};
    left: 0;
    right: 0;
    top: 70px;
    flex-direction: column;
    background: rgba(26, 26, 46, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    display: ${(props) => (props.$mobileOpen ? 'flex' : 'none')};
  }
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: ${(props) =>
    props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: ${(props) =>
    props.$isActive ? 'rgba(220, 38, 38, 0.3)' : 'transparent'};

  &:hover {
    color: #ffffff;
    background: rgba(220, 38, 38, 0.2);
  }
`;

export const NavIcon = styled.span`
  font-size: 1rem;
`;

export const RoleDropdownContainer = styled.div`
  position: relative;
`;

export const RoleTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--role-color, #dc2626);
  }
`;

export const RoleIconSpan = styled.span`
  font-size: 1.1rem;
`;

export const RoleLabel = styled.span`
  display: inline;
`;

export const DropdownArrow = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  background: var(--bg-card, #1a1a2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: var(--z-dropdown, 100);
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

export const DropdownItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: var(--text-primary, #ffffff);
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$isActive ? 'rgba(220, 38, 38, 0.2)' : 'transparent'};
  color: ${(props) =>
    props.$isActive ? 'var(--color-primary, #dc2626)' : 'var(--text-primary, #ffffff)'};

  &:hover {
    background: rgba(220, 38, 38, 0.15);
  }
`;

export const ItemIcon = styled.span`
  font-size: 1rem;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

export const OnlineIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
`;

export const StatusDot = styled.span<{ $isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$isOnline ? '#10b981' : '#ef4444')};
  box-shadow: ${(props) =>
    props.$isOnline
      ? '0 0 8px rgba(16, 185, 129, 0.5)'
      : '0 0 8px rgba(239, 68, 68, 0.5)'};
  animation: ${(props) => (props.$isOnline ? 'pulse 2s infinite' : 'none')};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const StatusText = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

export const DateTimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

export const DateSpan = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const TimeSpan = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Montserrat', monospace;
`;

export const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;
