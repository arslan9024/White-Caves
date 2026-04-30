// src/components/shared/sidebars/SidebarSection.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  SidebarSection as StyledSection,
  SidebarSectionHeader,
  SidebarSectionContent,
  EmptySidebarState,
} from './styled/SidebarStyledComponents';
import { useSidebarState } from '../../../hooks/useSidebarState';

export interface SidebarSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isDivider?: boolean;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  itemCount?: number;
  isEmpty?: boolean;
  emptyMessage?: string;
  sidebarName: string;
}

/**
 * Reusable Sidebar Section Component
 * Manages collapsible sections with expand/collapse functionality
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({
  id,
  title,
  icon,
  children,
  isDivider: _isDivider = false,
  isCollapsible = true,
  defaultExpanded = true,
  onToggle,
  itemCount,
  isEmpty = false,
  emptyMessage = 'No items',
  sidebarName,
}) => {
  const { isExpanded, toggleExpanded } = useSidebarState(sidebarName);
  const [mounted, setMounted] = useState(false);

  // Initialize expanded state on mount
  useEffect(() => {
    const init = async () => {
      setMounted(true);
    };
    init();
  }, []);

  const expanded = isExpanded(id);
  const shouldShowExpanded = mounted ? expanded : defaultExpanded;

  const handleToggle = useCallback(() => {
    toggleExpanded(id);
    onToggle?.(!shouldShowExpanded);
  }, [id, toggleExpanded, shouldShowExpanded, onToggle]);

  return (
    <StyledSection>
      {isCollapsible && (
        <SidebarSectionHeader
          onClick={handleToggle}
          isExpanded={shouldShowExpanded}
          role="button"
          aria-expanded={shouldShowExpanded}
          aria-controls={`section-content-${id}`}
          data-testid={`sidebar-section-header-${id}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            <span>{title}</span>
            {itemCount !== undefined && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  opacity: 0.7,
                }}
              >
                {itemCount}
              </span>
            )}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </SidebarSectionHeader>
      )}

      <SidebarSectionContent
        id={`section-content-${id}`}
        role="region"
        aria-labelledby={`section-header-${id}`}
        data-testid={`sidebar-section-content-${id}`}
        style={{ display: shouldShowExpanded && !isEmpty ? 'flex' : 'none' }}
      >
        {isEmpty ? (
          <EmptySidebarState>
            <p>{emptyMessage}</p>
          </EmptySidebarState>
        ) : (
          children
        )}
      </SidebarSectionContent>
    </StyledSection>
  );
};

export default SidebarSection;
