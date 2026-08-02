# 🎨 Dashboard & Sidebar Architecture - Complete Implementation Guide

## Overview

The new dashboard and sidebar architecture provides a modern, scalable, and component-based system for managing the White Caves application UI. This guide covers all the new systems, components, and patterns you need to understand.

## 📁 File Structure

```
src/
├── components/
│   ├── shared/
│   │   └── sidebars/
│   │       ├── BaseSidebar.tsx              # Base sidebar container
│   │       ├── SidebarItem.tsx              # Reusable sidebar item
│   │       ├── SidebarSection.tsx           # Collapsible section
│   │       ├── styled/
│   │       │   └── SidebarStyledComponents.tsx  # All styled components
│   │       └── index.ts                     # Public exports
│   └── layout/
│       └── DashboardWorkspace/
│           ├── DynamicContentRouter.tsx     # Feature content renderer
│           ├── FeatureRegistry.ts           # Feature registry system
│           └── index.ts
├── hooks/
│   └── useSidebarState.ts                   # Sidebar state hooks
├── store/
│   └── slices/
│       └── sidebarUISlice.ts               # Redux sidebar state
└── styles/
    ├── theme.ts                            # Theme system (colors, spacing, etc.)
    └── globalStyles.ts                     # Global styles
```

## 🎯 Key Systems

### 1. Theme System (`src/styles/theme.ts`)

Provides a centralized design token system with light/dark mode support:

```typescript
// Access theme in styled-components
const MyComponent = styled.div`
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
`;

// Theme includes:
- colors (primary, secondary, success, danger, etc.)
- spacing (xs, sm, md, lg, xl, 2xl)
- typography (heading, body, caption)
- borderRadius (sm, md, lg, full)
- shadows
- breakpoints (mobile, tablet, desktop)
```

### 2. Redux Sidebar State (`src/store/slices/sidebarUISlice.ts`)

Centralized state management for all sidebar UI:

```typescript
// State structure per sidebar:
{
  activeSidebarItem: string | null;
  searchQuery: string;
  expandedSections: Set<string>;
  favorites: Set<string>;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  viewMode: 'grid' | 'list' | 'table' | 'map' | 'timeline';
  sortBy: string;
  currentPage: number;
  itemsPerPage: number;
  filters: Record<string, any>;
}

// Usage:
const sidebarState = useSelector(selectSidebarConfig('left'));
dispatch(setActiveSidebarItem({ sidebar: 'left', itemId: 'properties' }));
dispatch(setSearchQuery({ sidebar: 'left', query: 'search term' }));
```

### 3. Sidebar State Hook (`src/hooks/useSidebarState.ts`)

Main hook for managing sidebar state and actions:

```typescript
const {
  // State
  activeSidebarItem,
  searchQuery,
  favorites,
  isCollapsed,
  viewMode,
  filters,
  currentPage,
  isMobileOpen,
  sortBy,
  itemsPerPage,

  // Item management
  setActive,

  // Search
  setSearch,
  clearSearch,

  // Sections
  toggleExpanded,
  isExpanded,

  // Favorites
  toggleFav,
  addFav,
  removeFav,
  isFavorited,

  // UI
  toggleCollapse,
  setCollapsed,
  setMobileOpen,
  setView,

  // Sorting & Pagination
  setSort,
  setPage,
  setPageSize,

  // Filters
  addFilter,
  removeFilterKey,
  clearAllFilters,

  // Reset
  reset,
} = useSidebarState('left');
```

### 4. Sidebar Filtering Hook (`useSidebarFiltering`)

Automatically filters and sorts items based on search/filters:

```typescript
const items = [
  { id: '1', name: 'Property A' },
  { id: '2', name: 'Property B' },
];

const filtered = useSidebarFiltering(items, 'left', (item, filters, search) => {
  // Custom filter logic
  return item.name.includes(search);
});
```

### 5. Sidebar Pagination Hook (`useSidebarPagination`)

Handles pagination for sidebar items:

```typescript
const {
  paginatedItems,
  currentPage,
  totalPages,
  itemsPerPage,
  setPage,
  setPageSize,
  hasNextPage,
  hasPrevPage,
} = useSidebarPagination(items, 'left');
```

## 🧩 Component Architecture

### BaseSidebar Component

Root container for all sidebars:

```typescript
<BaseSidebar
  name="left"
  title="Properties"
  icon={<PropertiesIcon />}
  position="left"
  hasSearch={true}
  onSearch={(query) => console.log(query)}
  headerActions={<button>Settings</button>}
  footer={<FooterComponent />}
>
  {/* Content goes here */}
</BaseSidebar>
```

**Features:**

- Header with title and icon
- Search input
- Collapsible
- Mobile responsive
- Footer area
- Automatic escape key handling

### SidebarSection Component

Collapsible section within sidebars:

```typescript
<SidebarSection
  id="favorites"
  title="Favorites"
  icon={<StarIcon />}
  sidebarName="left"
  isCollapsible={true}
  defaultExpanded={true}
  itemCount={5}
  onToggle={(isExpanded) => console.log(isExpanded)}
>
  {/* Items go here */}
</SidebarSection>
```

**Features:**

- Collapsible with state management
- Header with optional item count
- Empty state support
- Icons
- Redux-backed state

### SidebarItem Component

Individual item in a sidebar:

```typescript
<SidebarItem
  id="property-123"
  label="123 Main St"
  icon={<HomeIcon />}
  sidebarName="left"
  isSelected={activeSidebarItem === 'property-123'}
  isFavoriteable={true}
  badge={{
    text: '5',
    variant: 'primary',
    size: 'md',
  }}
  status="online"
  statusColor="#4CAF50"
  onClick={(itemId) => handlePropertyClick(itemId)}
  onDoubleClick={(itemId) => handlePropertyEdit(itemId)}
  onContextMenu={(e, itemId) => handleContextMenu(e, itemId)}
/>
```

**Features:**

- Icon support
- Badge support (with variants)
- Status indicators
- Favorite toggle (with persistent state)
- Click/double-click/context menu handlers
- Responsive
- Accessibility (ARIA labels)

## 🎨 Styled Components

All sidebar styling is in `src/components/shared/sidebars/styled/SidebarStyledComponents.tsx`:

```typescript
// Containers
<SidebarContainer isCollapsed={true} position="left" />
<SidebarHeader />
<SidebarContent />
<SidebarFooter />

// Sections
<SidebarSection isDivider={false} />
<SidebarSectionHeader isExpanded={true} />
<SidebarSectionContent isVisible={true} />

// Items
<SidebarItemWrapper isActive={true} isDragging={false} />
<SidebarItemIcon color="#FF5722" />
<SidebarItemLabel />
<SidebarItemBadge variant="primary" size="md" />
<SidebarItemMeta />

// Search
<SidebarSearchContainer />
<SidebarSearchInput />

// Special
<SidebarFavoriteButton isFavorited={true} />
<StatusIndicator status="online" size="md" pulsing={true} />
<SidebarEmptyState />
<SidebarDivider />
```

## 🔄 Feature Registry System

Register and dynamically render features:

```typescript
// src/components/layout/DashboardWorkspace/FeatureRegistry.ts

// Register a feature
featureRegistry.registerFeature({
  id: 'properties-inventory',
  name: 'Properties Inventory',
  label: 'Properties',
  icon: <PropertiesIcon />,
  category: 'inventory',
  component: PropertiesInventoryComponent,
  permissions: ['manage_properties'],
  badge: 'New',
  metadata: {
    description: 'Manage property listings',
  },
});

// Get all features
const features = featureRegistry.getAllFeatures();

// Get features by category
const crmFeatures = featureRegistry.getFeaturesByCategory('crm');

// Get feature component
const Component = featureRegistry.getFeatureComponent('properties-inventory');
```

## 🎬 Dynamic Content Router

Renders feature components dynamically based on sidebar selection:

```typescript
<DynamicContentRouter
  activeFeatureId={activeSidebarItem}
  featureData={{ someData: 'value' }}
  onClose={() => setActiveSidebarItem(null)}
  isLoading={false}
  fallback={<LoadingSpinner />}
  errorFallback={(error) => <ErrorComponent error={error} />}
/>
```

**Features:**

- Lazy loading with Suspense
- Error boundary with recovery
- Loading fallback support
- Empty state when no feature selected
- Disabled feature handling
- Responsive layout

## 💾 Redux Integration

Register the sidebar reducer in your store:

```typescript
// src/store/index.ts
import sidebarUIReducer from './slices/sidebarUISlice';

const store = configureStore({
  reducer: {
    // ... other reducers
    sidebarUI: sidebarUIReducer,
  },
});
```

## 📱 Responsive Design

All components are fully responsive:

```typescript
// Breakpoints available in theme
@media ${MEDIA_QUERIES.mobile}    // 0-640px
@media ${MEDIA_QUERIES.tablet}    // 640px-1024px
@media ${MEDIA_QUERIES.desktop}   // 1024px+

// Components adapt:
- Sidebar width changes on tablet/mobile
- Search input hidden on mobile when collapsed
- Mobile sliding sidebar drawer
- Touch-friendly hit targets
```

## ♿ Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation (Tab, Enter, Escape)
- Focus management
- Screen reader support
- Semantic HTML
- Color contrast compliance
- Status indicators with text alternatives

## 🎯 Usage Examples

### Basic Sidebar Setup

```typescript
import {
  BaseSidebar,
  SidebarSection,
  SidebarItem,
} from '@/components/shared/sidebars';
import { useSidebarState } from '@/hooks/useSidebarState';

function PropertiesSidebar() {
  const {
    activeSidebarItem,
    searchQuery,
    setActive,
    isFavorited,
    toggleFav,
  } = useSidebarState('left');

  const properties = [
    { id: '1', name: 'Property A' },
    { id: '2', name: 'Property B' },
  ];

  return (
    <BaseSidebar
      name="left"
      title="Properties"
      icon={<HomeIcon />}
      position="left"
    >
      <SidebarSection
        id="active"
        title="Active Listings"
        sidebarName="left"
        itemCount={properties.length}
      >
        {properties.map(prop => (
          <SidebarItem
            key={prop.id}
            id={prop.id}
            label={prop.name}
            icon={<HomeIcon />}
            isSelected={activeSidebarItem === prop.id}
            isFavoriteable={true}
            sidebarName="left"
            onClick={() => setActive(prop.id)}
          />
        ))}
      </SidebarSection>
    </BaseSidebar>
  );
}
```

### Dashboard with Dynamic Content

```typescript
import { DynamicContentRouter } from '@/components/layout/DashboardWorkspace';
import { useSidebarState } from '@/hooks/useSidebarState';

function Dashboard() {
  const { activeSidebarItem } = useSidebarState('left');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <PropertiesSidebar />
      <DynamicContentRouter
        activeFeatureId={activeSidebarItem}
        onClose={() => setActiveSidebarItem(null)}
      />
    </div>
  );
}
```

### Registering Features

```typescript
import { featureRegistry } from '@/components/layout/DashboardWorkspace';

// Register when your component mounts
useEffect(() => {
  featureRegistry.registerFeature({
    id: 'my-feature',
    name: 'My Feature',
    label: 'My Feature',
    category: 'tools',
    component: MyFeatureComponent,
  });
}, []);
```

## 🎨 Styling & Theming

The theme system provides everything you need for consistent styling:

```typescript
import styled from 'styled-components';

const CustomComponent = styled.div`
  color: ${props => props.theme.colors.text.primary};
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};

  @media ${props => props.theme.breakpoints.tablet} {
    padding: ${props => props.theme.spacing.sm};
  }
`;
```

## 🚀 Performance Optimizations

1. **Lazy Loading**: Features load only when selected
2. **Virtualization Ready**: Use react-window for large lists
3. **Memoization**: Components optimized with React.memo
4. **Efficient Redux**: Selectors use reselect for memoization
5. **CSS-in-JS**: Styled-components handle dynamic styles efficiently

## 🧪 Testing

Components are designed to be testable:

```typescript
// testId examples
data-testid="sidebar-left"
data-testid="sidebar-item-property-123"
data-testid="sidebar-section-header-favorites"
data-testid="sidebar-search-left"

// Easy to query in tests
screen.getByTestId('sidebar-left');
screen.getByRole('button', { name: /search/i });
```

## 📚 Next Steps

1. Install styled-components: `npm install styled-components`
2. Add `sidebarUIReducer` to Redux store
3. Update your sidebar components to use the new architecture
4. Register features using `featureRegistry`
5. Integrate `DynamicContentRouter` in your dashboard

## 🤝 Contributing

When adding new sidebar features:

1. Use `BaseSidebar` as the container
2. Use `SidebarSection` for grouping items
3. Use `SidebarItem` for individual items
4. Store state in Redux via `useSidebarState`
5. Export from `src/components/shared/sidebars/index.ts`
6. Add TypeScript interfaces for props
7. Include ARIA labels for accessibility
8. Test on mobile and tablet breakpoints
