/**
 * EnhancedLeftSidebar Styled Components
 *
 * Desktop-only sidebar (280px width) with hierarchical navigation.
 * Responsive: Hidden on tablet/mobile (replaced by rail + flyout)
 */

import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors } = theme;

// ─── Container ───────────────────────────────────────────────────────

export const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100%;
  background: ${colors.background.secondary};
  border-right: 1px solid ${colors.borderLight};
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  /* Smooth scrolling */
  scrollbar-width: thin;
  scrollbar-color: ${colors.border} transparent;

  &::-webkit-scrollbar {
    width: 8px;
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

  /* Hide on tablet/mobile */
  @media (max-width: 1023px) {
    display: none;
  }
`;

// ─── Header ──────────────────────────────────────────────────────────

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  height: 56px;
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.background.secondary};
  flex-shrink: 0;
`;

export const SidebarLogo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 4px;
`;

export const SidebarTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ─── Sections & Groups ───────────────────────────────────────────────

export const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  flex-shrink: 0;

  &:first-of-type {
    padding-top: 8px;
  }
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
  padding: 6px 12px;
  height: 28px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${colors.text.secondary};
  user-select: none;

  &:hover {
    background: ${colors.hover};
  }
`;

// ─── Navigation Items ────────────────────────────────────────────────

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const NavItemContainer = styled.div<{ $depth?: number }>`
  padding-left: ${props => `${(props.$depth || 0) * 16 + 8}px`};
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
  padding: 8px 8px;
  margin: 0 8px;
  border: none;
  border-radius: 4px;
  background: ${props => (props.$active ? colors.primaryVeryLight : 'transparent')};
  color: ${props => (props.$active ? colors.text.primary : colors.text.secondary)};
  font-size: 13px;
  font-weight: ${props => (props.$active ? 500 : 400)};
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover:not(:disabled) {
    background: ${colors.hover};
    color: ${colors.text.primary};
  }

  &:focus {
    outline: none;
    background: ${colors.hover};
    box-shadow: inset 0 0 0 2px ${colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Left accent bar for active items */
  ${props =>
    props.$active &&
    `
    border-left: 3px solid ${props.$color || colors.primary};
    padding-left: calc(8px - 3px);
  `}

  /* Icon styling */
  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    ${props => props.$color && `color: ${props.$color};`}
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
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  background: ${props => props.$color || colors.primary};
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  flex-shrink: 0;
  margin-left: auto;
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
    width: 14px;
    height: 14px;
  }
`;

// ─── Nested Tree ─────────────────────────────────────────────────────

export const TreeNode = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const TreeNodeHeader = styled(NavItemButton)`
  margin-right: 0;
`;

export const TreeNodeChildren = styled.div<{ $expanded?: boolean }>`
  display: ${props => (props.$expanded ? 'flex' : 'none')};
  flex-direction: column;
  gap: 0;
  max-height: ${props => (props.$expanded ? '1000px' : '0')};
  transition: max-height 0.2s ease;
`;

// ─── AI Command Center ───────────────────────────────────────────────

export const AISearchContainer = styled.div`
  padding: 8px 8px;
  margin: 0 8px;
  margin-bottom: 4px;
`;

export const AISearchInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${colors.borderLight};
  border-radius: 4px;
  background: ${colors.background.secondary};
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
  padding: 8px 8px;
  margin: 0 8px;
  border: none;
  border-radius: 4px;
  background: ${props => (props.$selected ? colors.primaryVeryLight : 'transparent')};
  color: ${colors.text.primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${colors.hover};
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${colors.primary};
  }
`;

export const AIAssistantAvatar = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${props => props.$color || colors.primary}20;
  color: ${props => props.$color || colors.primary};
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const AIAssistantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow: hidden;
`;

export const AIAssistantName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AIAssistantTitle = styled.span`
  font-size: 11px;
  color: ${colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ─── Spacer & Footer ─────────────────────────────────────────────────

export const SidebarSpacer = styled.div`
  flex: 1;
  min-height: 16px;
`;

export const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 0;
  border-top: 1px solid ${colors.borderLight};
  background: ${colors.background.secondary};
  flex-shrink: 0;
`;

export const SidebarStatus = styled.div`
  padding: 8px 12px;
  font-size: 11px;
  color: ${colors.text.tertiary};
  text-align: center;
`;
