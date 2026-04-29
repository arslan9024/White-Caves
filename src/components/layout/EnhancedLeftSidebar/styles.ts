/**
 * EnhancedLeftSidebar Styled Components
 *
 * Unified sidebar (280px expanded / 64px collapsed) with hierarchical navigation.
 * Works on both desktop (1024px+) and tablet (768-1023px).
 * Hidden on mobile (<768px) — replaced by MobileBottomNav.
 */

import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors } = theme;

// ─── Container ───────────────────────────────────────────────────────

export const SidebarContainer = styled.aside<{ $collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => (props.$collapsed ? '64px' : '280px')};
  height: 100%;
  background: ${colors.background.secondary};
  border-right: 1px solid ${colors.borderLight};
  overflow-y: ${props => (props.$collapsed ? 'hidden' : 'auto')};
  overflow-x: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: relative;

  /* Smooth scrolling */
  scrollbar-width: thin;
  scrollbar-color: ${colors.border} transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 4px;

    &:hover {
      background: ${colors.borderDark};
    }
  }

  /* Hide on mobile */
  @media (max-width: 767px) {
    display: none;
  }
`;

// ─── Header ──────────────────────────────────────────────────────────

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  height: 56px;
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.background.secondary};
  flex-shrink: 0;
  overflow: hidden;
`;

export const SidebarLogo = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const SidebarTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
`;

export const CollapseToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: auto;
  background: transparent;
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  color: ${colors.text.secondary};
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: ${colors.hover};
    color: ${colors.text.primary};
    border-color: ${colors.border};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// ─── Sections & Groups ───────────────────────────────────────────────

export const SidebarSection = styled.section<{ $hidden?: boolean }>`
  display: ${props => (props.$hidden ? 'none' : 'flex')};
  flex-direction: column;
  padding: 6px 0;
  flex-shrink: 0;
`;

export const SidebarDivider = styled.hr`
  margin: 0;
  padding: 0;
  height: 1px;
  background: ${colors.borderLight};
  border: none;
`;

export const SidebarSectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 14px;
  height: 26px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${colors.text.secondary};
  user-select: none;
`;

// ─── Navigation Items ────────────────────────────────────────────────

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 6px;
`;

export const NavItemContainer = styled.div<{ $depth?: number }>`
  padding-left: ${props => `${(props.$depth || 0) * 14 + 6}px`};
`;

export const NavItemButton = styled.button<{
  $active?: boolean;
  $color?: string;
  $depth?: number;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 7px;
  background: ${props => (props.$active ? `${props.$color || colors.primary}18` : 'transparent')};
  color: ${props => (props.$active ? props.$color || colors.primary : colors.text.secondary)};
  font-size: 13px;
  font-weight: ${props => (props.$active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover:not(:disabled) {
    background: ${colors.hover};
    color: ${colors.text.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.primary}40;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Left accent bar for active items */
  ${props =>
    props.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: ${props.$color || colors.primary};
      border-radius: 0 3px 3px 0;
    }
  `}

  /* Icon styling */
  svg {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
  }
`;

export const NavItemLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

export const NavItemBadge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: ${props => props.$color || colors.primary};
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
  flex-shrink: 0;
  margin-left: auto;
  letter-spacing: 0;
`;

export const NavItemCaret = styled.div<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  ${props => props.$expanded && 'transform: rotate(90deg);'}

  svg {
    width: 12px;
    height: 12px;
  }
`;

// ─── Nested Tree ─────────────────────────────────────────────────────

export const TreeNode = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const TreeNodeHeader = styled(NavItemButton)``;

export const TreeNodeChildren = styled.div<{ $expanded?: boolean }>`
  display: ${props => (props.$expanded ? 'flex' : 'none')};
  flex-direction: column;
  gap: 0;
`;

// ─── Collapsed (Icon-Only) Rail Items ───────────────────────────────

export const CollapsedNavItem = styled.button<{ $active?: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 40px;
  margin: 1px auto;
  border: none;
  border-radius: 8px;
  background: ${props => (props.$active ? `${props.$color || colors.primary}18` : 'transparent')};
  color: ${props => (props.$active ? props.$color || colors.primary : colors.text.secondary)};
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: ${colors.hover};
    color: ${colors.text.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }

  /* Dot indicator for active */
  ${props =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: ${props.$color || colors.primary};
      border-radius: 2px;
    }
  `}
`;

export const CollapsedBadge = styled.span<{ $color?: string }>`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: ${props => props.$color || colors.primary};
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ─── AI Command Center ───────────────────────────────────────────────

export const AISearchContainer = styled.div`
  padding: 6px 6px;
  margin-bottom: 2px;
`;

export const AISearchInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid ${colors.borderLight};
  border-radius: 7px;
  background: ${colors.background.primary};
  color: ${colors.text.primary};
  font-size: 12px;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }

  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

export const AIAssistantItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 7px;
  background: ${props => (props.$selected ? `${colors.primary}14` : 'transparent')};
  color: ${colors.text.primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${colors.hover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.primary}40;
  }
`;

export const AIAssistantAvatar = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: ${props => props.$color || colors.primary}22;
  color: ${props => props.$color || colors.primary};
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid ${props => props.$color || colors.primary}30;
`;

export const AIAssistantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  overflow: hidden;
`;

export const AIAssistantName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AIAssistantTitle = styled.span`
  font-size: 10px;
  color: ${colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ─── Spacer & Footer ─────────────────────────────────────────────────

export const SidebarSpacer = styled.div`
  flex: 1;
  min-height: 12px;
`;

export const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 6px 6px;
  border-top: 1px solid ${colors.borderLight};
  background: ${colors.background.secondary};
  flex-shrink: 0;
`;

export const SidebarStatus = styled.div`
  padding: 6px 12px;
  font-size: 10px;
  color: ${colors.text.tertiary};
  text-align: center;
`;

// ─── Dept Group Header ──────────────────────────────────────────────

export const DeptGroupHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: ${colors.text.secondary};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: ${colors.text.primary};
  }

  svg {
    width: 10px;
    height: 10px;
    margin-left: auto;
    transition: transform 0.2s ease;
  }
`;
