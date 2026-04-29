// src/components/sidebars/MaryInventorySidebar/MaryInventorySidebar.tsx
import React, { useMemo } from 'react';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';
import { useSidebarState } from '../../../hooks/useSidebarState';
import styled from 'styled-components';

/**
 * Mary Inventory Sidebar Component
 * Provides navigation for property inventory management features
 */

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.sidebarBg};
`;

export interface MaryInventorySidebarProps {
  onFeatureSelect?: (featureId: string) => void;
  activeFeature?: string;
  className?: string;
}

export const MaryInventorySidebar: React.FC<MaryInventorySidebarProps> = ({
  onFeatureSelect,
  activeFeature,
  className,
}) => {
  const { setActive, toggleExpanded, isExpanded } = useSidebarState('mary-inventory');

  // Define sidebar structure with categories and items
  const sidebarStructure = useMemo(
    () => [
      {
        id: 'inventory-main',
        title: 'Inventory Management',
        items: [
          {
            id: 'inventory-dashboard',
            label: 'Dashboard',
            icon: '📊',
            badge: 'NEW',
            description: 'Overview of all properties',
          },
          {
            id: 'inventory-search',
            label: 'Search Properties',
            icon: '🔍',
            description: 'Find and filter properties',
          },
          {
            id: 'inventory-list',
            label: 'Property List',
            icon: '📋',
            description: 'View all properties in a list',
          },
        ],
      },
      {
        id: 'inventory-data',
        title: 'Data Management',
        items: [
          {
            id: 'smart-import',
            label: 'Smart Import',
            icon: '📥',
            description: 'Import properties from Excel',
          },
          {
            id: 'import-history',
            label: 'Import History',
            icon: '📜',
            description: 'View past import sessions',
          },
          {
            id: 'data-validation',
            label: 'Data Validation',
            icon: '✓',
            description: 'Check data quality',
          },
        ],
      },
      {
        id: 'inventory-analytics',
        title: 'Analytics & Reports',
        items: [
          {
            id: 'inventory-stats',
            label: 'Statistics',
            icon: '📈',
            description: 'View property statistics',
          },
          {
            id: 'inventory-reports',
            label: 'Reports',
            icon: '📑',
            description: 'Generate custom reports',
          },
          {
            id: 'inventory-trends',
            label: 'Market Trends',
            icon: '💹',
            description: 'Analyze market trends',
          },
        ],
      },
      {
        id: 'inventory-settings',
        title: 'Configuration',
        items: [
          {
            id: 'inventory-preferences',
            label: 'Preferences',
            icon: '⚙️',
            description: 'Customize your settings',
          },
          {
            id: 'inventory-api-keys',
            label: 'API Keys',
            icon: '🔑',
            description: 'Manage API integrations',
          },
        ],
      },
    ],
    []
  );

  const handleItemClick = (featureId: string) => {
    setActive(featureId);
    if (onFeatureSelect) {
      onFeatureSelect(featureId);
    }
  };

  return (
    <SidebarContainer className={className}>
      <BaseSidebar title="Mary Inventory" icon="🏠" name="mary-inventory">
        {sidebarStructure.map(section => (
          <SidebarSection
            key={section.id}
            id={section.id}
            title={section.title}
            sidebarName="mary-inventory"
            defaultExpanded={isExpanded(section.id)}
            onToggle={() => toggleExpanded(section.id)}
          >
            {section.items.map(item => (
              <SidebarItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                badge={item.badge ? { text: item.badge, variant: 'primary' } : undefined}
                isSelected={activeFeature === item.id}
                sidebarName="mary-inventory"
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </SidebarSection>
        ))}
      </BaseSidebar>
    </SidebarContainer>
  );
};

export default MaryInventorySidebar;
