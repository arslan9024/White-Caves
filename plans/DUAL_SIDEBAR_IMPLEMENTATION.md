# Dual Sidebar Architecture Implementation Guide

## Overview

The White Caves dashboard has been restructured with a professional dual-sidebar design:

- **Left Sidebar**: Company Departments & Management (Hierarchical Organization)
- **Center**: Dynamic Content Area (Feature Rendering)
- **Right Sidebar**: AI Assistants & Tools (Smart Helpers)

## Architecture Components

### 1. Registry Files

#### `departmentsRegistry.ts`
- Defines all 10+ company departments
- Organizes by hierarchy: C-Suite (Level 1), Directors (Level 2), Managers (Level 3)
- Includes department heads, services, teams, and AI assistants
- Provides helper functions:
  - `getDepartmentsByHierarchy(level)` - Get departments by organizational level
  - `getDepartment(id)` - Get specific department
  - `getDepartmentsByAssistant(assistantId)` - Find departments using an AI assistant
  - `getDepartmentAssistants(departmentId)` - Get AI assistants for a department

#### `aiAssistantsRegistry.ts`
- Defines 12+ AI assistants across all domains
- Groups by role: WhatsApp Agent, CRM Agent, Data Management, Analytics & Reporting
- Tracks department assignments and capabilities
- Provides helper functions:
  - `getAssistantsByRole(role)` - Get assistants by functional role
  - `getAssistantsByDepartment(departmentId)` - Get assistants for a department
  - `getAssistantsByCategory(category)` - Get assistants by category
  - `getActiveAssistants()` - Get active assistants only
  - `getAssistantsByAccessLevel(level)` - Get assistants by access level

### 2. Sidebar Components

#### CompanyDepartmentSidebar
**Location**: `src/components/sidebars/CompanyDepartmentSidebar/`

Features:
- Hierarchical display of departments by organizational level
- Collapsible sections for each department
- Shows department head and contact info
- Lists department services
- Links to team directories
- Uses `useSidebarState` hook for state management
- Professional color-coded departments

Props:
```typescript
interface CompanyDepartmentSidebarProps {
  onFeatureSelect?: (featureId: string, context?: { department: string }) => void;
  activeFeature?: string;
  activeDepartment?: string;
  className?: string;
}
```

#### AIAssistantsSidebar
**Location**: `src/components/sidebars/AIAssistantsSidebar/`

Features:
- Groups AI assistants by functional role
- Status indicators (active/inactive/training)
- Quick access to WhatsApp management features
- Data management and analytics grouping
- Quick actions (settings, performance, training mode)
- Interactive status badges

Props:
```typescript
interface AIAssistantsSidebarProps {
  onAssistantSelect?: (assistantId: string, context?: { role?: string; department?: string }) => void;
  activeAssistant?: string;
  className?: string;
}
```

### 3. Main Layout Component

#### DualSidebarLayout
**Location**: `src/components/layout/DashboardLayout/DualSidebarLayout.tsx`

Features:
- Manages dual-sidebar state and interactions
- Contains breadcrumb navigation showing current feature
- Shows system status indicator
- Routes features to `DynamicContentRouter`
- Professional layout with proper spacing and shadows
- Smooth content transitions

Layout Structure:
```
┌─────────────────────────────────────────────────────────┐
│        [Status Bar with Breadcrumb & System Status]    │
├──────────────┬──────────────────────┬──────────────────┤
│   Left Dept  │   Dynamic Content    │   Right AI       │
│   Sidebar    │   Area (Router)      │   Sidebar        │
│ (280px)      │   (Flexible)         │   (280px)        │
│              │                      │                  │
│              │                      │                  │
│              │                      │                  │
└──────────────┴──────────────────────┴──────────────────┘
```

### 4. Related Components

#### DynamicContentRouter
- Maps feature IDs to components
- Renders appropriate UI based on selection
- Passes context data to features

#### BaseSidebar, SidebarSection, SidebarItem
- Shared UI components for sidebar structure
- Consistent styling and interaction patterns
- Reusable across all sidebar types

## Integration Steps

### Step 1: Install Dependencies
All required packages should already be installed. Verify:
```bash
npm list styled-components redux react-redux
```

### Step 2: Update Theme Configuration
Ensure your theme includes all necessary colors:
```typescript
// src/styles/theme.ts
const theme = {
  colors: {
    sidebarBg: '#ffffff',
    border: '#e5e7eb',
    textSecondary: '#6b7280',
    primary: '#3b82f6',
    background: '#f9fafb',
  },
  // ... other theme properties
};
```

### Step 3: Use the Layout
```typescript
// In your main App or Dashboard component
import { DualSidebarLayout } from '@/components/layout/DashboardLayout/DualSidebarLayout';

export const Dashboard = () => {
  return <DualSidebarLayout />;
};
```

### Step 4: Verify File Structure
```
src/
├── config/
│   ├── departmentsRegistry.ts    ✓
│   └── aiAssistantsRegistry.ts   ✓
├── components/
│   ├── sidebars/
│   │   ├── CompanyDepartmentSidebar/
│   │   │   └── CompanyDepartmentSidebar.tsx   ✓
│   │   ├── AIAssistantsSidebar/
│   │   │   └── AIAssistantsSidebar.tsx        ✓
│   │   ├── shared/
│   │   │   ├── BaseSidebar.tsx
│   │   │   ├── SidebarSection.tsx
│   │   │   ├── SidebarItem.tsx
│   │   │   └── index.ts
│   │   └── index.ts                           ✓
│   └── layout/
│       └── DashboardLayout/
│           ├── DualSidebarLayout.tsx          ✓
│           └── DynamicContentRouter.tsx
└── styles/
    └── theme.ts
```

## Department Hierarchy

### Level 1 - C-Suite
- Executive Office (👔)
- Technology & Infrastructure (💻)

### Level 2 - Directors/Operational Units
- Sales & Leasing (💼)
- Property Management (🏢)
- Finance & Administration (💰)
- Legal & Compliance (⚖️)

### Level 3 - Managers/Support Functions
- Human Resources (👥)
- Marketing & Communications (📣)
- Quality Assurance (✓)
- Customer Service (💬)

## AI Assistant Roles

### WhatsApp Agents
- **Nina**: Automated bot for 24/7 conversations
- **Linda**: Agent-facing CRM for live chats

### CRM Agents
- **Clara**: Sales Pipeline Management
- **Diana**: Property Management
- **Eva**: Lease & Compliance Monitoring

### Data Management
- **Mary**: Property Inventory Management
- **Aurora**: Data Architecture
- **Cipher**: Backend Operations

### Analytics & Reporting
- **Zoe**: Executive Analytics
- **Beacon**: Performance Analysis
- **Harmony**: HR Coordination

## Customization Guide

### Adding New Departments
1. Edit `src/config/departmentsRegistry.ts`
2. Add new department entry to `DEPARTMENTS` object
3. Set hierarchy level (1-3)
4. Assign AI assistants and services
5. The sidebar will automatically include it

```typescript
DEPARTMENTS.newDept = {
  id: 'newdept',
  name: 'New Department',
  fullName: 'New Department Full Name',
  icon: '📊',
  color: '#your-color',
  head: 'Department Head',
  headTitle: 'Title',
  email: 'email@whitecaves.ae',
  phone: 'ext',
  description: 'Description',
  purpose: 'Purpose',
  aiAssistants: ['ai-id-1', 'ai-id-2'],
  services: ['service-1', 'service-2'],
  teams: ['team-1'],
  hierarchy: 2,
};
```

### Adding New AI Assistants
1. Edit `src/config/aiAssistantsRegistry.ts`
2. Add new assistant entry to `AI_ASSISTANTS` object
3. Set role, department, and category
4. Define capabilities and data flows
5. The sidebar will automatically include it

```typescript
AI_ASSISTANTS.newAI = {
  id: 'newai',
  name: 'New Assistant',
  title: 'Descriptive Title',
  avatar: '🤖',
  icon: 'Icon',
  color: '#color',
  status: 'active',
  role: 'Existing Role or New Role',
  assignedTo: ['DEPT_ID'],
  department: 'DEPT_ID',
  category: 'communication|inventory|analytics|operations|support',
  description: 'Description',
  capabilities: ['cap1', 'cap2'],
  reportsTo: 'Manager Name',
  dashboardPath: '/path',
  accessLevel: 'P1 - High',
  features: 0,
  dataFlows: {
    inputs: [],
    outputs: [],
  },
};
```

### Styling Customization
All components use styled-components. Modify:
- `src/styles/theme.ts` - Global theme
- Component-level styled declarations - Specific styling

### Dynamic Content Router Configuration
Edit `DynamicContentRouter.tsx` to map features to components:
```typescript
const featureMap: Record<string, React.ComponentType<any>> = {
  'dept-sales': SalesDashboard,
  'ai-nina': NinaWhatsAppDashboard,
  // ... add more mappings
};
```

## Usage Examples

### Select a Department
Clicking a department in the left sidebar:
1. Updates `activeFeature` state
2. Updates `activeDepartment` state
3. Triggers `onFeatureSelect` callback
4. Routes to department dashboard via `DynamicContentRouter`

### Select an AI Assistant
Clicking an assistant in the right sidebar:
1. Updates `activeAssistant` state
2. Updates `activeFeature` state
3. Triggers `onAssistantSelect` callback
4. Routes to assistant dashboard via `DynamicContentRouter`

## Styling System

### Colors
- Primary Brand: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)
- Background: `#f9fafb` (Light Gray)

### Spacing
- Compact: 8px
- Standard: 16px
- Large: 24px
- Extra Large: 32px

### Responsive Design
All sidebar components are optimized for:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (320px+)

Note: Sidebars may need responsive adjustments for screens < 1200px

## Performance Optimization

### Memoization
- `useMemo` for department/assistant grouping
- Components are lightweight and fast-rendering

### Scrolling
- Custom scrollbar styling for better aesthetics
- Overflow handling for long lists
- Efficient re-rendering on state changes

### Bundle Size
- Tree-shakeable registry imports
- Only load necessary helper functions
- Styled-components efficient code splitting

## Troubleshooting

### Sidebar Not Showing
1. Verify `DualSidebarLayout` is imported and rendered
2. Check theme colors in `src/styles/theme.ts`
3. Ensure styled-components is properly configured

### Registry Functions Not Working
1. Verify imports: `import { getDepartmentsByHierarchy } from '@/config/departmentsRegistry'`
2. Check registry object structure
3. Ensure helper functions are exported

### Dynamic Content Not Rendering
1. Verify `DynamicContentRouter` has feature mappings
2. Check feature ID naming conventions
3. Ensure components export properly

## Best Practices

1. **Keep Registries Updated**: Always update registries when adding departments/assistants
2. **Use Helper Functions**: Leverage provided functions for data queries
3. **Semantic HTML**: Sidebar items use proper button/link semantics
4. **Accessibility**: All interactive elements are keyboard accessible
5. **Performance**: Use `useMemo` for expensive operations
6. **Theming**: Leverage theme system for consistent styling
7. **Responsive**: Test on multiple screen sizes

## Next Steps

1. ✅ Integrate `DualSidebarLayout` into main app
2. ⏳ Populate `DynamicContentRouter` with feature components
3. ⏳ Add WhatsApp-specific features (Linda/Nina integration)
4. ⏳ Implement department-specific dashboards
5. ⏳ Add real-time status updates
6. ⏳ Performance testing and optimization

## Support & Maintenance

- All components are fully typed with TypeScript
- JSDoc comments provided throughout
- Follows React best practices
- Uses modern hooks (useState, useCallback, useMemo)
- Styled-components for encapsulated styling
- Redux integration ready

## File References

- Component logic: `CompanyDepartmentSidebar.tsx`, `AIAssistantsSidebar.tsx`
- Layout structure: `DualSidebarLayout.tsx`
- Data configuration: `departmentsRegistry.ts`, `aiAssistantsRegistry.ts`
- Shared UI: `src/components/shared/sidebars/`
- Styling: `src/styles/theme.ts`
