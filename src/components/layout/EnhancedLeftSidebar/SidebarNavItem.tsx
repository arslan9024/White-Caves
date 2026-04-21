/**
 * SidebarNavItem — Reusable navigation item (department, service, or link)
 *
 * Features:
 *  - Icon + label + optional badge
 *  - Active state styling
 *  - Optional collapse/expand caret
 *  - Keyboard focus support (from useKeyboardNavigation)
 */

import React, { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { FocusProps } from '../../../hooks/navigation/useKeyboardNavigation';
import {
  NavItemContainer,
  NavItemButton,
  NavItemLabel,
  NavItemBadge,
  NavItemCaret,
} from './styles';

export interface SidebarNavItemProps {
  id?: string;
  icon?: LucideIcon;
  label: string;
  active?: boolean;
  color?: string;
  badge?: number;
  badgeColor?: string;
  depth?: number;
  expandable?: boolean;
  expanded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onExpand?: (shouldExpand: boolean) => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  children?: ReactNode;
  /** Focus props from useKeyboardNavigation */
  focusProps?: FocusProps;
}

const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  ({
    id,
    icon: Icon,
    label,
    active = false,
    color,
    badge,
    badgeColor,
    depth = 0,
    expandable = false,
    expanded = false,
    onClick,
    onKeyDown,
    onExpand,
    disabled = false,
    className,
    title,
    focusProps,
    children,
  }, ref) => {
    const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (expandable) {
        e.stopPropagation();
        onExpand?.(!expanded);
      }
    };

    return (
      <NavItemContainer depth={depth}>
        <NavItemButton
          id={id}
          active={active}
          $color={color}
          depth={depth}
          onClick={(e) => {
            handleExpandClick(e);
            onClick?.(e);
          }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className={className}
          title={title || label}
          ref={ref}
          {...focusProps}
        >
          {Icon && <Icon size={18} />}
          <NavItemLabel>{label}</NavItemLabel>

          {badge && badge > 0 && (
            <NavItemBadge $color={badgeColor}>{badge > 99 ? '99+' : badge}</NavItemBadge>
          )}

          {expandable && (
            <NavItemCaret expanded={expanded}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </NavItemCaret>
          )}
        </NavItemButton>

        {children}
      </NavItemContainer>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';

export default SidebarNavItem;
