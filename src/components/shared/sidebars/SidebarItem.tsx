// src/components/shared/sidebars/SidebarItem.tsx
import React, { useState, useCallback } from 'react';
import {
  SidebarItemWrapper,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarItemMeta,
  SidebarItemBadge,
  SidebarFavoriteButton,
  StatusIndicator,
} from './styled/SidebarStyledComponents';
import { useSidebarState } from '../../../hooks/useSidebarState';

interface SidebarItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: {
    text: string | number;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md';
  };
  status?: 'online' | 'offline' | 'idle' | 'busy' | 'custom';
  statusColor?: string;
  isFavoriteable?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  onClick?: (itemId: string) => void;
  onDoubleClick?: (itemId: string) => void;
  onContextMenu?: (e: React.MouseEvent, itemId: string) => void;
  metadata?: Record<string, any>;
  sidebarName: string;
  iconColor?: string;
}

/**
 * Reusable Sidebar Item Component
 * Supports icons, badges, favorites, status indicators, and click handlers
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  icon,
  badge,
  status,
  statusColor,
  isFavoriteable = false,
  isSelected = false,
  isDragging = false,
  onClick,
  onDoubleClick,
  onContextMenu,
  sidebarName,
  iconColor,
}) => {
  const { setActive, isFavorited, toggleFav } = useSidebarState(sidebarName);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setActive(id);
      onClick?.(id);
    },
    [id, setActive, onClick]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onDoubleClick?.(id);
    },
    [id, onDoubleClick]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onContextMenu?.(e, id);
    },
    [id, onContextMenu]
  );

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFav(id);
    },
    [id, toggleFav]
  );

  const isFav = isFavorited(id);

  return (
    <SidebarItemWrapper
      $isActive={isSelected}
      $isDragging={isDragging}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      data-testid={`sidebar-item-${id}`}
    >
      {status && (
        <StatusIndicator
          status={status}
          color={statusColor}
          $size="md"
          pulsing={status === 'online'}
        />
      )}

      {icon && (
        <SidebarItemIcon color={iconColor} data-sidebar-icon>
          {icon}
        </SidebarItemIcon>
      )}

      <SidebarItemLabel data-sidebar-label>{label}</SidebarItemLabel>

      <SidebarItemMeta>
        {badge && (
          <SidebarItemBadge
            variant={badge.variant || 'primary'}
            $size={badge.size || 'md'}
          >
            {badge.text}
          </SidebarItemBadge>
        )}

        {isFavoriteable && (isHovering || isFav) && (
          <SidebarFavoriteButton
            $isFavorited={isFav}
            onClick={handleFavoriteClick}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </SidebarFavoriteButton>
        )}
      </SidebarItemMeta>
    </SidebarItemWrapper>
  );
};

export default SidebarItem;
