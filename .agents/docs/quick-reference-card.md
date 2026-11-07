# 🚀 Dashboard & Sidebar - Quick Reference Card

## 📌 TL;DR

A complete, production-ready dashboard and sidebar system with:

- Redux state management
- Styled-components theming
- Reusable components
- Feature registry
- Dynamic routing

**Status**: ✅ Complete & Ready for Phase 2

---

## 🎯 What You Get

| Item              | File                                                 | Description                              |
| ----------------- | ---------------------------------------------------- | ---------------------------------------- |
| Theme System      | `src/styles/theme.ts`                                | Colors, spacing, typography, breakpoints |
| Global Styles     | `src/styles/globalStyles.ts`                         | CSS resets, base styles                  |
| Redux State       | `src/store/slices/sidebarUISlice.ts`                 | Sidebar UI state management              |
| Main Hook         | `src/hooks/useSidebarState.ts`                       | Access & manipulate sidebar state        |
| Styled Lib        | `src/components/shared/sidebars/styled/...`          | 20+ styled components                    |
| Base Component    | `src/components/shared/sidebars/BaseSidebar.tsx`     | Sidebar container                        |
| Section Component | `src/components/shared/sidebars/SidebarSection.tsx`  | Collapsible sections                     |
| Item Component    | `src/components/shared/sidebars/SidebarItem.tsx`     | Individual items                         |
| Feature Registry  | `src/components/layout/.../FeatureRegistry.ts`       | Feature management                       |
| Content Router    | `src/components/layout/.../DynamicContentRouter.tsx` | Dynamic rendering                        |

---

## 💾 Install

```bash
npm install styled-components
npm install --save-dev @types/styled-components
```

---

## 🔧 Setup

```typescript
// 1. Add Redux reducer
import sidebarUIReducer from './slices/sidebarUISlice';
// reducer: { ..., sidebarUI: sidebarUIReducer }

// 2. Wrap with ThemeProvider
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 🧩 Build a Sidebar

```typescript
import { BaseSidebar, SidebarSection, SidebarItem } from '@/components/shared/sidebars';
import { useSidebarState } from '@/hooks/useSidebarState';

const MySidebar = () => {
  const { activeSidebarItem, setActive } = useSidebarState('left');

  return (
    <BaseSidebar name="left" title="Menu" position="left">
      <SidebarSection id="items" title="Items" sidebarName="left">
        <SidebarItem
          id="item-1"
          label="Item 1"
          isSelected={activeSidebarItem === 'item-1'}
          sidebarName="left"
          onClick={() => setActive('item-1')}
        />
      </SidebarSection>
    </BaseSidebar>
  );
};
```

---

## 🎨 Use Theme

```typescript
import styled from 'styled-components';

const MyComponent = styled.div`
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
`;
```

---

## 🎛️ useS idebarState Hook

```typescript
const {
  activeSidebarItem, // Currently selected item
  searchQuery, // Search input value
  favorites, // Set of favorited item IDs
  isCollapsed, // Sidebar collapsed state

  setActive, // Set active item
  setSearch, // Update search
  toggleFav, // Toggle favorite
  toggleCollapse, // Toggle collapse

  // ... and more
} = useSidebarState('left');
```

---

## 🔍 Filter & Paginate

```typescript
// Filtering
const filtered = useSidebarFiltering(items, 'left');

// Pagination
const { paginatedItems, currentPage, setPage } = useSidebarPagination(items, 'left');
```

---

## 📝 Register Features

```typescript
import { featureRegistry } from '@/components/layout/DashboardWorkspace';

featureRegistry.registerFeature({
  id: 'my-feature',
  name: 'My Feature',
  label: 'Display Name',
  category: 'crm',
  component: MyComponent,
  permissions: ['can_view'],
});
```

---

## 🎬 Render Features

```typescript
import { DynamicContentRouter } from '@/components/layout/DashboardWorkspace';

<DynamicContentRouter
  activeFeatureId={activeSidebarItem}
  onClose={() => setActiveSidebarItem(null)}
/>
```

---

## 📱 Responsive Breakpoints

```typescript
@media ${props => props.theme.breakpoints.mobile}     // 0-640px
@media ${props => props.theme.breakpoints.tablet}     // 640px-1024px
@media ${props => props.theme.breakpoints.desktop}    // 1024px+
```

---

## 🎯 Key Components

### BaseSidebar

```typescript
<BaseSidebar
  name="left"               // Unique name
  title="Sidebar"           // Display title
  position="left"           // 'left' or 'right'
  hasSearch={true}          // Show search input
  onSearch={handleSearch}   // Search callback
  headerActions={<button>} // Header buttons
  footer={<Footer />}       // Footer content
>
  {/* Content */}
</BaseSidebar>
```

### SidebarSection

```typescript
<SidebarSection
  id="section-id"          // Unique ID
  title="Section"          // Display title
  sidebarName="left"       // Which sidebar
  isCollapsible={true}     // Can collapse
  defaultExpanded={true}   // Start expanded
  itemCount={5}            // Badge count
  isDivider={false}        // Show divider above
  isEmpty={false}          // Show empty state
  emptyMessage="No items"
>
  {/* Items */}
</SidebarSection>
```

### SidebarItem

```typescript
<SidebarItem
  id="item-id"             // Unique ID
  label="Item Label"       // Display text
  icon={<Icon />}          // Icon element
  badge={{                 // Optional badge
    text: '5',
    variant: 'primary',
    size: 'md',
  }}
  status="online"          // Status indicator
  isFavoriteable={true}    // Can favorite
  isSelected={true}        // Active state
  sidebarName="left"       // Which sidebar
  onClick={handler}        // Click handler
  onDoubleClick={handler}  // Double-click handler
  onContextMenu={handler}  // Right-click handler
/>
```

---

## 🎨 Styled Components Available

```typescript
// Container
<SidebarContainer isCollapsed={true} position="left" />
<SidebarHeader />
<SidebarContent />
<SidebarFooter />

// Search
<SidebarSearchContainer />
<SidebarSearchInput />

// Sections
<SidebarSection />
<SidebarSectionHeader isExpanded={true} />
<SidebarSectionContent isVisible={true} />

// Items
<SidebarItemWrapper isActive={true} />
<SidebarItemIcon color="#FF5722" />
<SidebarItemLabel />
<SidebarItemBadge variant="primary" />
<SidebarItemMeta />

// Special
<SidebarFavoriteButton isFavorited={true} />
<StatusIndicator status="online" pulsing={true} />
<SidebarEmptyState />
<SidebarDivider />
<SidebarActionButton variant="primary" />
```

---

## 🎯 Redux Actions

```typescript
dispatch(setActiveSidebarItem({ sidebar: 'left', itemId: '123' }));
dispatch(setSearchQuery({ sidebar: 'left', query: 'search' }));
dispatch(toggleSection({ sidebar: 'left', sectionId: 'fav' }));
dispatch(toggleFavorite({ sidebar: 'left', itemId: '123' }));
dispatch(toggleCollapseSidebar('left'));
dispatch(setViewMode({ sidebar: 'left', viewMode: 'list' }));
dispatch(setFilter({ sidebar: 'left', filterKey: 'status', filterValue: 'active' }));
dispatch(setCurrentPage({ sidebar: 'left', page: 2 }));
dispatch(resetSidebar('left'));
```

---

## 📊 Redux State Structure

```typescript
{
  sidebarUI: {
    left: {
      activeSidebarItem: 'item-id' | null,
      searchQuery: '',
      expandedSections: Set<string>,
      favorites: Set<string>,
      isCollapsed: false,
      isMobileOpen: false,
      viewMode: 'grid',
      sortBy: 'newest',
      currentPage: 1,
      itemsPerPage: 12,
      filters: {},
    },
    right: { /* same structure */ },
  }
}
```

---

## ⚡ Performance Tips

1. ✅ Use hooks for state management
2. ✅ Lazy load feature components
3. ✅ Paginate large lists
4. ✅ Memoize filter functions
5. ✅ Use Redux selectors

---

## 🐛 Common Issues

| Issue                        | Solution                           |
| ---------------------------- | ---------------------------------- |
| Theme not applying           | Check `ThemeProvider` wraps app    |
| Redux not updating           | Verify reducer registered in store |
| Search not working           | Use `useSidebarFiltering` hook     |
| Features not rendering       | Check feature is registered        |
| Sidebar collapsed by default | Check `isCollapsed` state          |

---

## 📚 Documentation Files

| File                                            | Purpose               |
| ----------------------------------------------- | --------------------- |
| `DASHBOARD_SIDEBAR_INDEX.md`                    | Navigation & overview |
| `DASHBOARD_ARCHITECTURE_COMPLETE.md`            | Complete summary      |
| `SIDEBAR_DASHBOARD_ARCHITECTURE.md`             | Full technical guide  |
| `DASHBOARD_IMPLEMENTATION_CHECKLIST.md`         | Implementation plan   |
| `PACKAGE_INSTALLATION_GUIDE.md`                 | Installation steps    |
| `src/components/examples/DashboardExamples.tsx` | Code examples         |

---

## 📞 Next Steps

1. Read `DASHBOARD_SIDEBAR_INDEX.md`
2. Follow `PACKAGE_INSTALLATION_GUIDE.md`
3. Check examples in `DashboardExamples.tsx`
4. Start building!

---

## ✨ What's Included

- ✅ Theme system (light/dark mode ready)
- ✅ Redux state management
- ✅ 3 custom hooks
- ✅ 20+ styled components
- ✅ 3 reusable components
- ✅ Feature registry system
- ✅ Dynamic content routing
- ✅ 7 complete examples
- ✅ 4 comprehensive guides
- ✅ Full TypeScript support
- ✅ WCAG accessibility
- ✅ Mobile responsive

**Status**: Complete & Ready to Use! 🎉

---

**Quick Links**:

- 📖 [Full Architecture Guide](./SIDEBAR_DASHBOARD_ARCHITECTURE.md)
- 📋 [Implementation Checklist](./DASHBOARD_IMPLEMENTATION_CHECKLIST.md)
- 💻 [Code Examples](./src/components/examples/DashboardExamples.tsx)
- 📦 [Installation Guide](./PACKAGE_INSTALLATION_GUIDE.md)
- 🗺️ [Navigation Index](./DASHBOARD_SIDEBAR_INDEX.md)
