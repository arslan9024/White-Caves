// src/components/examples/DashboardExamples.tsx
/**
 * Complete Examples for Dashboard & Sidebar Architecture
 * 
 * This file contains real-world examples of how to use the new
 * dashboard, sidebar, and feature registry systems.
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';

// ============================================================================
// EXAMPLE 1: Basic Sidebar with Items
// ============================================================================

import {
  BaseSidebar,
  SidebarItem,
  SidebarSection,
} from '../shared/sidebars';
import { useSidebarState } from '../../hooks/useSidebarState';

const BasicSidebarExample = () => {
  const { activeSidebarItem, setActive } = useSidebarState('left');

  const items = [
    { id: 'properties', label: 'Properties', count: 24 },
    { id: 'agents', label: 'Agents', count: 8 },
    { id: 'deals', label: 'Deals', count: 12 },
  ];

  return (
    <BaseSidebar
      name="left"
      title="Navigation"
      position="left"
      hasSearch={true}
    >
      <SidebarSection
        id="main"
        title="Main"
        sidebarName="left"
        itemCount={items.length}
      >
        {items.map(item => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            badge={{
              text: item.count,
              variant: 'primary',
              size: 'md',
            }}
            isSelected={activeSidebarItem === item.id}
            sidebarName="left"
            onClick={() => setActive(item.id)}
          />
        ))}
      </SidebarSection>
    </BaseSidebar>
  );
};

// ============================================================================
// EXAMPLE 2: Advanced Sidebar with Favorites & Status
// ============================================================================

const AdvancedSidebarExample = () => {
  const {
    activeSidebarItem,
    favorites,
    isFavorited,
    toggleFav,
    setActive,
    searchQuery,
  } = useSidebarState('left');

  const properties = [
    {
      id: 'prop-1',
      label: '123 Main Street',
      status: 'online' as const,
      icon: '🏠',
    },
    {
      id: 'prop-2',
      label: '456 Oak Avenue',
      status: 'offline' as const,
      icon: '🏡',
    },
    {
      id: 'prop-3',
      label: '789 Pine Road',
      status: 'idle' as const,
      icon: '🏢',
    },
  ];

  // Filter by search
  const filtered = properties.filter(p =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BaseSidebar
      name="left"
      title="Properties"
      position="left"
      hasSearch={true}
    >
      <SidebarSection
        id="active"
        title="Active Properties"
        sidebarName="left"
        itemCount={filtered.length}
        isEmpty={filtered.length === 0}
        emptyMessage="No properties match your search"
      >
        {filtered.map(prop => (
          <SidebarItem
            key={prop.id}
            id={prop.id}
            label={prop.label}
            icon={prop.icon}
            status={prop.status}
            isFavoriteable={true}
            isSelected={activeSidebarItem === prop.id}
            sidebarName="left"
            onClick={() => setActive(prop.id)}
          />
        ))}
      </SidebarSection>

      {/* Favorites Section */}
      {favorites.size > 0 && (
        <SidebarSection
          id="favorites"
          title="Favorites"
          icon="⭐"
          sidebarName="left"
          itemCount={favorites.size}
          isDivider={true}
        >
          {properties
            .filter(p => isFavorited(p.id))
            .map(prop => (
              <SidebarItem
                key={prop.id}
                id={prop.id}
                label={prop.label}
                icon={prop.icon}
                status={prop.status}
                isFavoriteable={true}
                isSelected={activeSidebarItem === prop.id}
                sidebarName="left"
                onClick={() => setActive(prop.id)}
              />
            ))}
        </SidebarSection>
      )}
    </BaseSidebar>
  );
};

// ============================================================================
// EXAMPLE 3: Feature Registration
// ============================================================================

import { featureRegistry } from '../../components/layout/DashboardWorkspace';

// Create feature components
const PropertiesFeatureComponent: React.FC<any> = ({ featureId }) => (
  <div style={{ padding: '2rem' }}>
    <h1>Properties Inventory</h1>
    <p>Feature ID: {featureId}</p>
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Address</th>
          <th>Type</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>123 Main Street</td>
          <td>Single Family</td>
          <td>$450,000</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const AgentsFeatureComponent: React.FC<any> = ({ featureId }) => (
  <div style={{ padding: '2rem' }}>
    <h1>Agents</h1>
    <p>Feature ID: {featureId}</p>
    {/* Agent list content */}
  </div>
);

// Use this in a useEffect to register features
const useFeatureRegistration = () => {
  useEffect(() => {
    featureRegistry.registerFeatures([
      {
        id: 'properties-inventory',
        name: 'Properties Inventory',
        label: 'Properties',
        category: 'inventory',
        component: PropertiesFeatureComponent,
        permissions: ['view_properties'],
        metadata: {
          description: 'Manage property listings',
        },
      },
      {
        id: 'agents',
        name: 'Agents',
        label: 'Agents',
        category: 'crm',
        component: AgentsFeatureComponent,
        permissions: ['view_agents'],
        metadata: {
          description: 'Manage real estate agents',
        },
      },
    ]);
  }, []);
};

// ============================================================================
// EXAMPLE 4: Complete Dashboard Layout
// ============================================================================

const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  gap: ${props => props.theme.spacing.md};

  @media ${props => props.theme.breakpoints.tablet} {
    grid-template-columns: 1fr;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
`;

const DashboardExample = () => {
  const { activeSidebarItem } = useSidebarState('left');

  useFeatureRegistration();

  return (
    <DashboardLayout>
      <BasicSidebarExample />

      <ContentArea>
        {/* Dynamic content router would go here */}
        <div style={{ padding: '2rem' }}>
          <h2>Active Feature: {activeSidebarItem || 'None selected'}</h2>
        </div>
      </ContentArea>
    </DashboardLayout>
  );
};

// ============================================================================
// EXAMPLE 5: Using Hooks for Filtering and Pagination
// ============================================================================

import {
  useSidebarFiltering,
  useSidebarPagination,
} from '../../hooks/useSidebarState';

const PropertyListWithPagination = () => {
  const allProperties = [
    { id: '1', name: 'Property 1', type: 'House', createdAt: '2024-01-01' },
    { id: '2', name: 'Property 2', type: 'Apartment', createdAt: '2024-01-02' },
    { id: '3', name: 'Property 3', type: 'House', createdAt: '2024-01-03' },
    { id: '4', name: 'Property 4', type: 'Commercial', createdAt: '2024-01-04' },
    { id: '5', name: 'Property 5', type: 'House', createdAt: '2024-01-05' },
    { id: '6', name: 'Property 6', type: 'Apartment', createdAt: '2024-01-06' },
  ];

  // Filter by search query
  const filtered = useSidebarFiltering(
    allProperties,
    'left',
    (item, filters, search) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (!filters.type || item.type === filters.type)
      );
    }
  );

  // Paginate filtered results
  const {
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    hasNextPage,
    hasPrevPage,
  } = useSidebarPagination(filtered, 'left');

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map(prop => (
            <tr key={prop.id}>
              <td>{prop.name}</td>
              <td>{prop.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button
          disabled={!hasPrevPage}
          onClick={() => setPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={!hasNextPage}
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Custom Styled Component with Theme
// ============================================================================

const CustomCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media ${props => props.theme.breakpoints.tablet} {
    padding: ${props => props.theme.spacing.md};
  }
`;

const CustomComponentExample = () => (
  <CustomCard>
    <h3>Styled with Theme</h3>
    <p>This component uses the centralized theme system.</p>
  </CustomCard>
);

// ============================================================================
// EXAMPLE 7: Sidebar with Context Menu
// ============================================================================

const SidebarWithContextMenu = () => {
  const { activeSidebarItem, setActive } = useSidebarState('left');
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const items = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];

  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    setContextMenu({ x: e.clientX, y: e.clientY });
    setSelectedId(itemId);
  };

  return (
    <>
      <BaseSidebar name="left" title="Items" position="left">
        <SidebarSection id="items" title="Items" sidebarName="left">
          {items.map(item => (
            <SidebarItem
              key={item.id}
              id={item.id}
              label={item.label}
              isSelected={activeSidebarItem === item.id}
              sidebarName="left"
              onClick={() => setActive(item.id)}
              onContextMenu={handleContextMenu}
            />
          ))}
        </SidebarSection>
      </BaseSidebar>

      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'white',
            border: '1px solid #ccc',
            zIndex: 1000,
          }}
        >
          <button onClick={() => setContextMenu(null)}>Edit</button>
          <button onClick={() => setContextMenu(null)}>Delete</button>
          <button onClick={() => setContextMenu(null)}>Cancel</button>
        </div>
      )}
    </>
  );
};

// ============================================================================
// Exports
// ============================================================================

export {
  BasicSidebarExample,
  AdvancedSidebarExample,
  DashboardExample,
  PropertyListWithPagination,
  CustomComponentExample,
  SidebarWithContextMenu,
  useFeatureRegistration,
};
