// src/components/shared/sidebars/styled/SidebarStyledComponents.tsx
import styled, { css } from 'styled-components';
import { MEDIA_QUERIES, SPACING, COLORS, TYPOGRAPHY } from '../../../../styles/theme';

// ============================================================================
// SIDEBAR CONTAINER
// ============================================================================

export const SidebarContainer = styled.div<{
  isCollapsed?: boolean;
  position?: 'left' | 'right';
  isMobile?: boolean;
}>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${COLORS.sidebar.background};
  border-right: 1px solid ${COLORS.border.light};
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 100;

  ${props =>
    props.isCollapsed &&
    css`
      width: 60px;

      & [data-sidebar-label] {
        display: none;
      }

      & [data-sidebar-icon] {
        margin-right: 0;
      }
    `}

  ${props =>
    props.position === 'right' &&
    css`
      border-right: none;
      border-left: 1px solid ${COLORS.border.light};
    `}

  ${props =>
    props.isMobile &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 320px;
      height: 100vh;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    `}

  @media ${MEDIA_QUERIES.tablet} {
    width: ${props => (props.isCollapsed ? '60px' : '240px')};
  }

  @media ${MEDIA_QUERIES.mobile} {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    max-width: 100%;
  }
`;

// ============================================================================
// SIDEBAR HEADER
// ============================================================================

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.md};
  border-bottom: 1px solid ${COLORS.border.light};
  background: ${COLORS.sidebar.headerBackground};
  flex-shrink: 0;
`;

export const SidebarTitle = styled.h2`
  font-size: ${TYPOGRAPHY.heading.sm.fontSize};
  font-weight: ${TYPOGRAPHY.heading.sm.fontWeight};
  line-height: ${TYPOGRAPHY.heading.sm.lineHeight};
  color: ${COLORS.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ============================================================================
// SIDEBAR SEARCH
// ============================================================================

export const SidebarSearchContainer = styled.div`
  padding: ${SPACING.md};
  border-bottom: 1px solid ${COLORS.border.light};
  flex-shrink: 0;
`;

export const SidebarSearchInput = styled.input`
  width: 100%;
  padding: ${SPACING.sm} ${SPACING.md};
  border: 1px solid ${COLORS.border.light};
  border-radius: 8px;
  background: ${COLORS.input.background};
  color: ${COLORS.text.primary};
  font-size: ${TYPOGRAPHY.body.fontSize};

  &::placeholder {
    color: ${COLORS.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    background: ${COLORS.input.backgroundFocus};
  }

  transition: all 0.2s ease;
`;

// ============================================================================
// SIDEBAR CONTENT
// ============================================================================

export const SidebarContent = styled.div<{ hasHeader?: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${COLORS.sidebar.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.border.medium};
    border-radius: 3px;

    &:hover {
      background: ${COLORS.border.dark};
    }
  }
`;

// ============================================================================
// SIDEBAR SECTION (Collapsible groups)
// ============================================================================

export const SidebarSection = styled.div`
  flex: 0 0 auto;

  &:not(:last-child) {
    border-top: 1px solid ${COLORS.border.light};
    margin-top: ${SPACING.md};
    padding-top: ${SPACING.md};
  }
`;

export const SidebarSectionHeader = styled.button<{
  isExpanded?: boolean;
}>`
  width: 100%;
  padding: ${SPACING.sm} ${SPACING.md};
  background: none;
  border: none;
  font-size: ${TYPOGRAPHY.body.fontSize};
  color: ${COLORS.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    background: ${COLORS.sidebar.hoverBackground};
    color: ${COLORS.text.primary};
  }

  ${props =>
    props.isExpanded &&
    css`
      background: ${COLORS.sidebar.activeBackground};
    `}
`;

export const SidebarSectionContent = styled.div`
  display: flex;
  flex-direction: column;
`;

// ============================================================================
// SIDEBAR ITEM (Individual list element)
// ============================================================================

export const SidebarItemWrapper = styled.div<{
  isSelected?: boolean;
  isDragging?: boolean;
  isRelated?: boolean;
}>`
  gap: ${SPACING.sm};
  padding: ${SPACING.sm} ${SPACING.md};

  background-color: ${props => {
    if (props.isSelected) {
      return COLORS.sidebar.activeBackground;
    }
    if (props.isDragging) {
      return COLORS.sidebar.dragBackground;
    }
    return props.isRelated ? COLORS.sidebar.background : 'transparent';
  }};

  color: ${props =>
    props.isSelected ? COLORS.primary : COLORS.sidebar.background};

  &:hover {
    background: ${props =>
      props.isSelected ? COLORS.sidebar.activeBackground : COLORS.sidebar.hoverBackground};
  }

  ${props =>
    props.isSelected &&
    css`
      background: ${COLORS.sidebar.activeBackground};
      box-shadow: inset 2px 0 0 ${COLORS.primary};
      background: ${COLORS.sidebar.selectedBackground};
    `}
`;

export const SidebarItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.md};
  cursor: pointer;
  flex: 1;
  min-width: 0;
`;

export const SidebarItemIcon = styled.span<{ size?: number; color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  flex-shrink: 0;
  font-size: 16px;
  color: ${props => props.color || COLORS.text.secondary};
`;

export const SidebarItemLabel = styled.span`
  font-size: ${TYPOGRAPHY.body.fontSize};
  color: ${COLORS.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

export const SidebarItemMeta = styled.span`
  font-size: 12px;
  color: ${COLORS.text.secondary};
  white-space: nowrap;
  margin-left: ${SPACING.sm};
`;

export const SidebarItemBadge = styled.span<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;

  ${props => {
    const variants = {
      primary: `background: ${COLORS.primary}; color: white;`,
      secondary: `background: ${COLORS.secondary}; color: white;`,
      success: `background: ${COLORS.success}; color: white;`,
      warning: `background: ${COLORS.warning}; color: white;`,
      danger: `background: ${COLORS.danger}; color: white;`,
    };
    return variants[props.variant || 'primary'];
  }}
`;

export const SidebarFavoriteButton = styled.button`
  background: none;
  border: none;
  padding: ${SPACING.sm};
  cursor: pointer;
  color: ${COLORS.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${COLORS.border.light};
    color: ${COLORS.primary};
  }

  &.active {
    color: ${COLORS.primary};
  }
`;

export const StatusIndicator = styled.span<{
  status: 'online' | 'offline' | 'idle' | 'busy' | 'custom';
  color?: string;
  pulsing?: boolean;
}>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  ${props => {
    const colors = {
      online: COLORS.success,
      offline: COLORS.border.medium,
      idle: COLORS.warning,
      busy: COLORS.danger,
      custom: props.color || COLORS.primary,
    };
    return `background-color: ${colors[props.status]};`;
  }}

  ${props =>
    props.pulsing &&
    css`
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}
`;

// ============================================================================
// SIDEBAR DIVIDER
// ============================================================================

export const SidebarDivider = styled.div`
  height: 1px;
  background: ${COLORS.border.light};
  margin: ${SPACING.sm} 0;
  flex-shrink: 0;
`;

// ============================================================================
// SIDEBAR FOOTER
// ============================================================================

export const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.md};
  border-top: 1px solid ${COLORS.border.light};
  background: ${COLORS.sidebar.background};
  flex-shrink: 0;
  gap: ${SPACING.sm};
`;

export const SidebarActionButton = styled.button`
  background: none;
  border: none;
  padding: ${SPACING.sm};
  cursor: pointer;
  color: ${COLORS.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${COLORS.sidebar.hoverBackground};
    color: ${COLORS.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ============================================================================
// SIDEBAR UTILITIES
// ============================================================================

export const EmptySidebarState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.lg};
  text-align: center;
  color: ${COLORS.text.tertiary};
  flex: 1;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: ${SPACING.md};
    opacity: 0.5;
  }
`;

export const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  padding: ${SPACING.md};

  & > div {
    height: 48px;
    background: linear-gradient(
      90deg,
      ${COLORS.border.light} 25%,
      ${COLORS.sidebar.background} 50%,
      ${COLORS.border.light} 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
