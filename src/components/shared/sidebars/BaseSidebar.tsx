// src/components/shared/sidebars/BaseSidebar.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  SidebarContainer,
  SidebarHeader,
  SidebarTitle,
  SidebarSearchContainer,
  SidebarSearchInput,
  SidebarContent,
  SidebarFooter,
  SidebarDivider,
} from './styled/SidebarStyledComponents';
import { useSidebarState } from '../../../hooks/useSidebarState';

export interface BaseSidebarProps {
  name: string;
  title: string;
  icon?: React.ReactNode;
  position?: 'left' | 'right';
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  hasSearch?: boolean;
  onSearch?: (query: string) => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
  className?: string;
  testId?: string;
}

/**
 * Base Sidebar Component
 * Provides container, header, search, content area, and footer
 * All other sidebar components should use this as their base
 */
export const BaseSidebar: React.FC<BaseSidebarProps> = ({
  name,
  title,
  icon,
  position = 'left',
  children,
  headerActions,
  footer,
  hasSearch = true,
  onSearch,
  isMobile = false,
  onMobileClose,
  className,
  testId,
}) => {
  const { isCollapsed, searchQuery, setSearch, clearSearch, isMobileOpen, setMobileOpen } =
    useSidebarState(name);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync local search state with redux
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search input
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearchQuery(value);
      setSearch(value);
      onSearch?.(value);
    },
    [setSearch, onSearch]
  );

  const _handleSearchClear = useCallback(() => {
    setLocalSearchQuery('');
    clearSearch();
    onSearch?.('');
  }, [clearSearch, onSearch]);

  // Handle mobile sidebar close
  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
    onMobileClose?.();
  }, [setMobileOpen, onMobileClose]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && isMobileOpen) {
        handleMobileClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobile, isMobileOpen, handleMobileClose]);

  return (
    <SidebarContainer
      isCollapsed={isCollapsed}
      position={position}
      isMobile={isMobile && isMobileOpen}
      className={className}
      data-testid={testId || `sidebar-${name}`}
      role="complementary"
      aria-label={`${title} sidebar`}
    >
      {/* Header */}
      <SidebarHeader>
        <SidebarTitle>
          {icon}
          {!isCollapsed && <span>{title}</span>}
        </SidebarTitle>
        {headerActions}
      </SidebarHeader>

      {/* Search */}
      {hasSearch && !isCollapsed && (
        <SidebarSearchContainer>
          <SidebarSearchInput
            type="text"
            placeholder="Search..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            aria-label={`Search ${title}`}
            data-testid={`sidebar-search-${name}`}
          />
        </SidebarSearchContainer>
      )}

      {/* Content */}
      <SidebarContent hasHeader={true} role="main">
        {children}
      </SidebarContent>

      {/* Footer */}
      {footer && (
        <>
          <SidebarDivider />
          <SidebarFooter>{footer}</SidebarFooter>
        </>
      )}
    </SidebarContainer>
  );
};

export default BaseSidebar;
