# QUICK REFERENCE: Enhanced Sidebar System

## 📍 Key Files Location

### Configuration
- `src/config/departmentContentMap.js` - All departments, services, subitems, permissions

### Components
- `src/components/sidebars/EnhancedLeftSidebar/` - Department dropdown + top 3 services
- `src/components/sidebars/EnhancedRightSidebar/` - Assistants + services + subitems
- `src/components/shared/DashboardBreadcrumb.tsx` - Navigation breadcrumb
- `src/components/layout/DynamicContentRouter.tsx` - View routing
- `src/components/shared/dashboard/` - DashboardShell, DataCard, utilities

### Redux
- `src/redux/slices/relationalSidebarSlice.js` - State management (extended)

### Utilities & Hooks
- `src/utils/sidebarUtils.js` - 30+ helper functions
- `src/hooks/useServiceState.js` - State persistence hook

---

## 🎯 How It Works - Quick Flow

### 1. Department Selection
```tsx
// User selects department from dropdown
<EnhancedLeftSidebar userPermissions={userPermissions} />
  ↓
dispatch(setSelectedDepartment(deptId))
  ↓
Redux updates → Right sidebar re-renders
```

### 2. Service Selection
```tsx
// User clicks service in left or right sidebar
dispatch(setSelectedService(serviceId))
dispatch(setSelectedSubitem(subitemId))
dispatch(addToSelectionHistory({...}))
  ↓
Redux updates → Content router activates
```

### 3. View Rendering
```tsx
// Content router maps to correct component
<DynamicContentRouter userPermissions={userPermissions} />
  ↓
Looks up component: viewComponentRegistry[dept][service]
  ↓
Renders correct view or error/empty state
```

---

## 🔧 Using the Sidebar System

### Import Sidebars
```tsx
import EnhancedLeftSidebar from '@/components/sidebars/EnhancedLeftSidebar';
import EnhancedRightSidebar from '@/components/sidebars/EnhancedRightSidebar';
import DashboardBreadcrumb from '@/components/shared/DashboardBreadcrumb';

// In your layout component
<Layout>
  <EnhancedLeftSidebar userPermissions={userPermissions} />
  <MainContent>
    <DashboardBreadcrumb />
    <DynamicContentRouter userPermissions={userPermissions} />
  </MainContent>
  <EnhancedRightSidebar userPermissions={userPermissions} />
</Layout>
```

### Access Redux State
```tsx
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedSubitem,
  selectSelectionHistory,
} from '@/redux/slices/relationalSidebarSlice';

const MyComponent = () => {
  const dept = useSelector(selectSelectedDepartment);
  const service = useSelector(selectSelectedService);
  const subitem = useSelector(selectSelectedSubitem);
  const history = useSelector(selectSelectionHistory);

  // Use in component...
};
```

### Use Service State Hook
```tsx
import useServiceState from '@/hooks/useServiceState';

const MyView = () => {
  const { cacheState, restoreState, getState } = useServiceState();

  // When user changes filters
  const handleFilterChange = (filters) => {
    cacheState({ filters, scrollPos: window.scrollY });
  };

  // When component mounts
  useEffect(() => {
    const saved = restoreState();
    applyFilters(saved.filters);
    window.scrollTo(0, saved.scrollPos);
  }, []);
};
```

### Use Sidebar Utilities
```tsx
import {
  getDefaultDepartment,
  getTopServices,
  generateBreadcrumbs,
  hasPermissionForDepartment,
} from '@/utils/sidebarUtils';

// Get default dept for user
const defaultDept = getDefaultDepartment(userRole, selectionHistory);

// Get top 3 services
const topServices = getTopServices(deptId, selectionHistory, 3);

// Generate breadcrumbs
const breadcrumbs = generateBreadcrumbs(dept, service, subitem);

// Check permissions
if (hasPermissionForDepartment(deptId, userPermissions)) {
  // Show department
}
```

### Use Dashboard Components
```tsx
import DashboardShell from '@/components/shared/dashboard/DashboardShell';
import DataCard from '@/components/shared/dashboard/DataCard';
import DataCardGrid from '@/components/shared/dashboard/DataCardGrid';
import { KPICard, DataTable, Badge } from '@/components/shared/dashboard';

// DashboardShell provides structure
<DashboardShell
  title="Sales Dashboard"
  breadcrumbs={[
    { label: 'Sales', active: false },
    { label: 'Pipeline', active: true },
  ]}
  filters={[
    { type: 'text', label: 'Search', key: 'search', placeholder: 'Search...' }
  ]}
  onFilterChange={handleFilter}
  loading={loading}
>
  <DataCardGrid minWidth="300px">
    <DataCard title="Total Leads" loading={loading} skeleton="grid-4">
      {/* Content */}
    </DataCard>
    <KPICard label="Monthly Revenue" value="$45K" change="+12%" positive />
  </DataCardGrid>

  <DataTable columns={columns} data={data} />
</DashboardShell>
```

---

## 🎨 Styling & Customization

### Theme Integration
All components use styled-components and are theme-aware. Current colors:
- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Emerald)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Gray: `#6b7280` (Dark gray)

### DataCard Skeleton Variants
```tsx
<DataCard skeleton="content" />    // 3 lines of text
<DataCard skeleton="grid" />       // 3x3 grid
<DataCard skeleton="grid-4" />     // 4-column grid
<DataCard skeleton="table" />      // 5 rows, 4 columns
<DataCard skeleton="table-3" />    // 5 rows, 3 columns
<DataCard skeleton="custom" />     // Use children as skeleton
```

---

## ⚙️ Configuration

### Adding New Department
1. Edit `src/config/departmentContentMap.js`
2. Add new department object with services and subitems
3. Add to view component registry in DynamicContentRouter

### Adding New Service
1. Add to `departmentContentMap[DEPT].services`
2. Define subitems array
3. Add permissions array
4. Add component to registry

### Adding New Permission Level
1. Update user permissions array in Redux store
2. Update permission checks in components
3. Update `sidebarUtils.js` permission functions

---

## 🐛 Troubleshooting

### Sidebar Not Showing
- Check `userPermissions` array passed to components
- Verify `departmentContentMap` has correct structure
- Check Redux store initialization

### Services Not Filtering
- Verify `selectedDepartment` is set in Redux
- Check service permissions in `departmentContentMap`
- Verify `userPermissions` includes service permission

### History Not Working
- Check Redux `selectionHistory` state
- Verify `addToSelectionHistory` dispatched correctly
- Check max 3 limit isn't preventing updates

### Components Not Rendering
- Check view component registry in DynamicContentRouter
- Verify component exists and is imported
- Check permission checks allowing access

---

## 📊 Data Structure Reference

### Department Structure
```javascript
{
  id: 'SALES',
  label: 'Sales & Leasing',
  icon: 'trending-up',
  color: '#3B82F6',
  defaultService: 'lead-pipeline',
  permissions: ['sales', 'agent', 'manager'],
  services: {
    'lead-pipeline': {
      id: 'lead-pipeline',
      label: 'Lead Pipeline',
      description: '...',
      component: 'SalesView',
      dataSource: '/api/sales/pipeline',
      permissions: ['sales', 'agent'],
      subitems: [
        {
          id: 'pipeline-board',
          label: 'Pipeline Board',
          description: '...',
          dataSource: '/api/sales/pipeline/board',
          columns: ['stage', 'lead_name', 'value'],
          permissions: ['sales', 'agent'],
        },
        // more subitems...
      ]
    },
    // more services...
  }
}
```

### Redux State Structure
```javascript
{
  relationalSidebar: {
    selectedDepartment: 'SALES',
    selectedService: 'lead-pipeline',
    selectedSubitem: 'pipeline-board',
    selectionHistory: [
      { dept, service, subitem, filters, scrollPos, timestamp },
      // max 3 entries
    ],
    serviceStateCache: {
      'SALES_lead-pipeline': { filters: {...}, scrollPos: 100 },
      // per-service state
    },
    mainContentLoading: false,
    mainContentError: null,
    // ... other state
  }
}
```

---

## 🔐 Permission Levels

### Department Level
```javascript
dept.permissions = ['sales', 'agent', 'manager', 'md']
// User must have ANY of these permissions
```

### Service Level
```javascript
service.permissions = ['sales', 'agent', 'manager']
// User must have ANY of these permissions
```

### Subitem Level
```javascript
subitem.permissions = ['agent', 'manager']
// User must have ANY of these permissions
```

---

## 📚 Documentation Files

- `SIDEBAR_PHASE_1_SUMMARY.md` - Infrastructure details
- `SIDEBAR_PHASE_2_SUMMARY.md` - Sidebars & routing details
- `SIDEBAR_IMPLEMENTATION_STATUS.md` - Overall project status

---

## 🚀 Next Steps (Phase 3)

Create view components:
1. ExecutiveView.tsx
2. SalesView.tsx
3. OperationsView.tsx
4. PropertyManagementView.tsx
5. FinanceView.tsx
6. ComplianceView.tsx
7. AnalyticsView.tsx
8. TechnologyView.tsx
9. MarketingView.tsx
10. HRView.tsx

Each view should:
- Use DashboardShell + DataCard components
- Fetch data from API based on subitem
- Handle filters and state persistence
- Display data in DataCardGrid or DataTable

---

## ✅ Testing Checklist

- [ ] Department dropdown changes right sidebar
- [ ] Services filter by selected department
- [ ] Top 3 services appear in left sidebar
- [ ] Sub-items expand/collapse properly
- [ ] Breadcrumb shows correct path
- [ ] Back button navigates to previous state
- [ ] Selection history updates (max 3)
- [ ] Service state caches on change
- [ ] Service state restores on return
- [ ] Permissions block unauthorized access
- [ ] Loading states show correctly
- [ ] Error states appear on failures
- [ ] Empty states guide users
- [ ] Mobile responsive works
- [ ] Keyboard navigation works

---

**Happy coding!** 🎉
