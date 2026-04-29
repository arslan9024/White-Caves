/**
 * UnifiedSidebar Styled Components
 *
 * Single sidebar (280px expanded / 64px collapsed) with:
 * - Global unified search (departments + services + AI assistants)
 * - Hierarchical department tree navigation
 * - AI Command Center section
 * - WCAG 2.1 AA accessibility
 * - Responsive: visible on tablet (768px+) and desktop, hidden on mobile
 */

import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors } = theme;

// ─── Container ──────────────────────────────────────────────────────────

export const SidebarWrapper = styled.aside<{ $collapsed?: boolean }>`
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

  /* Hidden on mobile — MobileMenuDrawer handles it */
  @media (max-width: 767px) {
    display: none;
  }
`;

// ─── Header ─────────────────────────────────────────────────────────────

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
  flex: 1;
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

// ─── Global Search ───────────────────────────────────────────────────────

export const GlobalSearchBar = styled.div`
  padding: 8px 8px 6px;
  border-bottom: 1px solid ${colors.borderLight};
  flex-shrink: 0;
  background: ${colors.background.secondary};
`;

export const GlobalSearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const GlobalSearchIcon = styled.span`
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
  color: ${colors.text.tertiary};
  pointer-events: none;

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const GlobalSearchInput = styled.input`
  width: 100%;
  padding: 6px 28px 6px 28px;
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

export const GlobalSearchClear = styled.button`
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: ${colors.text.tertiary}30;
  border: none;
  border-radius: 50%;
  color: ${colors.text.secondary};
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  padding: 0;
  transition: all 0.1s ease;

  &:hover {
    background: ${colors.text.secondary}40;
  }

  svg {
    width: 9px;
    height: 9px;
  }
`;

// ─── Search Results ──────────────────────────────────────────────────────

export const SearchResultsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
`;

export const SearchResultsSection = styled.div`
  margin-bottom: 4px;
`;

export const SearchResultsSectionTitle = styled.div`
  padding: 4px 14px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${colors.text.secondary};
  user-select: none;
`;

export const SearchResultItem = styled.button<{ $active?: boolean; $color?: string }>`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 6px 14px;
  border: none;
  background: ${props => (props.$active ? `${props.$color || colors.primary}14` : 'transparent')};
  color: ${props => (props.$active ? props.$color || colors.primary : colors.text.primary)};
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: ${colors.hover};
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${colors.primary}40;
  }
`;

export const SearchResultIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${props => `${props.$color || colors.primary}18`};
  color: ${props => props.$color || colors.primary};
  flex-shrink: 0;

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const SearchResultText = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const SearchResultLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SearchResultSubLabel = styled.div`
  font-size: 10px;
  color: ${colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SearchResultBadge = styled.span`
  font-size: 9px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  background: ${colors.text.secondary}20;
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  flex-shrink: 0;
`;

export const SearchEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 16px;
  color: ${colors.text.tertiary};
  font-size: 12px;
  text-align: center;

  svg {
    width: 28px;
    height: 28px;
    opacity: 0.4;
  }
`;

// ─── Sections & Groups ───────────────────────────────────────────────────

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

// ─── Navigation Items ─────────────────────────────────────────────────────

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 6px;
`;

// ─── AI Assistant Search ──────────────────────────────────────────────────

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
  background: ${props => `${props.$color || colors.primary}22`};
  color: ${props => props.$color || colors.primary};
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid ${props => `${props.$color || colors.primary}30`};
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

// ─── Collapsed (Icon-Rail) Items ──────────────────────────────────────────

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

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.primary}40;
  }

  svg {
    width: 18px;
    height: 18px;
  }

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

// ─── Spacer & Footer ──────────────────────────────────────────────────────

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
