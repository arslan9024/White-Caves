/**
 * Dropdown Component
 * =================
 * Professional dropdown menu with keyboard navigation and accessibility
 */

import React, { FC, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown, Search } from 'lucide-react';
import { DropdownProps, DropdownItem, DropdownAlignment } from './advancedUI.types';
import Badge from './Badge';

// ============================================================================
// STYLES
// ============================================================================

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled.div`
  cursor: pointer;
  user-select: none;
`;

const DropdownContent = styled.div<{
  $isOpen: boolean;
  $alignment: DropdownAlignment;
  $maxHeight?: number;
}>`
  position: absolute;
  top: 100%;
  ${(props) => {
    switch (props.$alignment) {
      case 'right':
        return 'right: 0;';
      case 'center':
        return 'left: 50%; transform: translateX(-50%);';
      default:
        return 'left: 0;';
    }
  }}
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: var(--z-dropdown, 100);
  min-width: 200px;
  max-height: ${(props) => (props.$maxHeight ? `${props.$maxHeight}px` : '400px')};
  overflow-y: auto;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transform-origin: top;
  transform: ${(props) => (props.$isOpen ? 'scaleY(1)' : 'scaleY(0.95)')};
  transition: all 0.2s ease;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;

    &:hover {
      background: #ccc;
    }
  }
`;

const SearchInput = styled.input`
  width: calc(100% - 24px);
  padding: 8px 12px;
  margin: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const DropdownMenu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px 0;
`;

const DropdownMenuItem = styled.li<{ $disabled?: boolean; $isHovered?: boolean }>`
  padding: 0;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  background-color: ${(props) => (props.$isHovered ? '#f5f5f5' : 'transparent')};
  transition: background-color 0.2s ease;
`;

const MenuItemContent = styled.div<{ $withSubmenu?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const ItemLabel = styled.span`
  flex: 1;
`;

const ItemBadge = styled.div`
  margin-left: auto;
`;

const DividerItem = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

const SubmenuIndicator = styled(ChevronDown)`
  margin-left: auto;
  transform: rotate(-90deg);
  transition: transform 0.2s ease;
`;

// ============================================================================
// COMPONENT
// ============================================================================

const Dropdown: FC<DropdownProps> = ({
  trigger,
  items,
  triggerType = 'click',
  alignment = 'left',
  maxHeight,
  width,
  className = '',
  onItemSelect,
  onOpenChange,
  searchable = false,
  filterable = false,
  closeOnSelect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search
  const filteredItems = searchable || filterable
    ? items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Handle open/close
  const handleToggle = () => {
    setIsOpen(!isOpen);
    onOpenChange?.(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
    setSearchQuery('');
  };

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      onItemSelect?.(item);
      item.onClick?.();
      if (closeOnSelect) {
        handleClose();
      }
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current
        && !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined;
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setHoveredIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHoveredIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          if (hoveredIndex >= 0 && filteredItems[hoveredIndex]) {
            handleItemClick(filteredItems[hoveredIndex]);
          }
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [isOpen, filteredItems, hoveredIndex]);

  return (
    <DropdownContainer ref={containerRef} className={className}>
      <DropdownTrigger
        onClick={handleToggle}
        onMouseEnter={() => triggerType === 'hover' && !isOpen && handleToggle()}
        onMouseLeave={() => triggerType === 'hover' && isOpen && handleClose()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle();
          }
        }}
        aria-expanded={isOpen}
      >
        {trigger}
      </DropdownTrigger>

      <DropdownContent
        $isOpen={isOpen}
        $alignment={alignment}
        $maxHeight={maxHeight}
        style={{ width: width ? `${width}px` : 'auto' }}
        role="menu"
      >
        {(searchable || filterable) && (
          <div style={{ padding: '4px' }}>
            <SearchInput
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              aria-label="Search dropdown options"
            />
          </div>
        )}

        <DropdownMenu>
          {filteredItems.map((item, index) => {
            if (item.divider) {
              return <DividerItem key={`divider-${item.id || index}`} />;
            }

            return (
              <DropdownMenuItem
                key={item.id}
                $disabled={item.disabled}
                $isHovered={hoveredIndex === index}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(-1)}
                role="menuitem"
                aria-disabled={item.disabled}
              >
                <MenuItemContent $withSubmenu={!!item.submenu}>
                  {item.icon && <span>{item.icon}</span>}
                  <ItemLabel>{item.label}</ItemLabel>
                  {item.badge && (
                    <ItemBadge>
                      <Badge variant={item.badge.variant || 'secondary'}>
                        {item.badge.label}
                      </Badge>
                    </ItemBadge>
                  )}
                  {item.submenu && <SubmenuIndicator />}
                </MenuItemContent>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenu>
      </DropdownContent>
    </DropdownContainer>
  );
};

export default Dropdown;
