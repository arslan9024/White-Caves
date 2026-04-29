# Relational Sidebar System - Implementation Guide

**Status**: Phase 1 Complete - Core Architecture Built  
**Date**: January 19, 2026  
**Version**: 1.0

---

## 📋 What's Been Built

### ✅ 1. Redux State Management
**File**: `src/redux/slices/relationalSidebarSlice.js`

- **State Structure**:
  - Left sidebar: `selectedDepartment`, `selectedService`, `filteredServices`, `departmentData`
  - Right sidebar: `selectedAssistant`, `filteredAssistants`, `assistantNotifications`
  - Context: `activeContext`, `contextData`, `showFeatureSidebar`
  - Relationships: `relationshipMap`, `selectionHistory`

- **Key Thunks**:
  - `fetchDepartmentData()` - Load department info from API
  - `fetchAssistantData()` - Load assistant profiles
  - `fetchContextualData()` - Load context-specific data (e.g., inventory for Mary)

- **Actions**:
  - `setSelectedDepartment()`, `setSelectedService()`
  - `setSelectedAssistant()`, `setFilteredAssistants()`
  - `setActiveContext()`, `clearActiveContext()`
  - `addNotification()`, `clearNotifications()`
  - `setRelationshipMap()` - Initialize all relationships
  - `clearSelectionHistory()`, `resetRelationalSidebar()`

- **Selectors**:
  - All data exposed via Redux selectors for component consumption
  - Example: `selectSelectedDepartment()`, `selectAssistantNotifications()`

---

### ✅ 2. Relational Filtering Logic
**File**: `src/utils/relationalSidebarUtils.js`

**Core Functions**:

1. **`filterAssistantsByDepartment(departmentId, userPermissions)`**
   - Returns all assistants that work in a department
   - Respects user permission gates
   - Used when department is selected

2. **`filterAssistantsByService(serviceId, userPermissions)`**
   - Returns all assistants that support a service
   - Filters based on user permissions
   - Used when service is selected

3. **`filterServicesByAssistant(assistantId)`**
   - Returns all services this assistant can access
   - One-way filtering (assistant → services)

4. **`filterDepartmentsByAssistant(assistantId)`**
   - Returns all departments this assistant works in
   - One-way filtering (assistant → departments)

5. **`getDefaultAssistant(departmentId, selectionHistory, userPermissions)`**
   - Smart default selection:
     1. Check user's selection history for recently used assistant in this dept
     2. Fall back to first accessible assistant
   - Prevents empty selection

6. **`getDefaultDepartment(selectionHistory)`**
   - Smart default dept selection based on history
   - Falls back to first department

7. **`getContextsForAssistant(assistantId)`**
   - Returns available context tools for an assistant
   - Example: Mary → `['inventory', 'property-management']`
   - Used to populate context buttons in right sidebar

8. **`isValidAssistantContext(assistantId, context)`**
   - Validates if assistant+context combination is valid
   - Guards against rendering invalid feature sidebars

9. **`buildRelationshipMap(userPermissions)`**
   - Creates complete bidirectional relationship map:
     - `departmentAssistants`: { dept → [assistants] }
     - `assistantDepartments`: { assistant → [depts] }
     - `assistantServices`: { assistant → [services] }
     - `serviceAssistants`: { service → [assistants] }
   - Called on app init to populate Redux state

10. **`getSidebarRenderConfig(selectedAssistant, selectedDepartment, activeContext)`**
    - Determines which sidebars to show
    - Returns:
      ```js
      {
        showLeftSidebar: true,
        showRightSidebar: true,
        showFeatureSidebar: boolean,
        featureSidebarType: string | null,
        breadcrumb: { department, service, assistant, context }
      }
      ```

**Data Structure** (ASSISTANTS object):
```javascript
{
  assistantId: {
    name: string,
    description: string,
    color: hex,
    departments: [string],      // Which departments work with this assistant
    services: [string],          // Which services this assistant supports
    contexts: [string],          // Available context tools (inventory, leasing, etc.)
    icon: string                 // Icon component name
  }
}
```

---

### ✅ 3. Left Sidebar Component
**File**: `src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx`

**Purpose**: Display departments and their associated services  
**Features**:
- Lists all 9+ departments (EXECUTIVE, OPERATIONS, SALES, FINANCE, MARKETING, LEASING, COMPLIANCE, LEGAL, TECHNOLOGY, HR, ANALYTICS, COMMUNICATIONS)
- Expandable department sections
- Service listings under each department
- Department selection filters right sidebar
- Service selection further narrows assistant options
- Styled with theme colors and scrollbar customization

**Component Props**:
```typescript
interface RelationalLeftSidebarProps {
  userPermissions?: Record<string, boolean>;  // Controls which items are visible
}
```

**State Integration**:
- Reads: `selectedDepartment`, `filteredServices`
- Writes: `setSelectedDepartment`, `setSelectedService`
- Syncs with right sidebar through Redux

---

### ✅ 4. Right Sidebar Component
**File**: `src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx`

**Purpose**: Display filtered AI assistants with notification badges and context tools  
**Features**:
- Shows 12+ AI assistants filtered by selected department or service
- Color-coded assistant dots (department color coding)
- Notification badges (red, dismissible on click)
- Context buttons below selected assistant (e.g., "Inventory", "Leasing")
- Auto-selects default assistant when department changes
- Clears context when switching assistants
- Notification count tracking and clearing

**Component Props**:
```typescript
interface RelationalRightSidebarProps {
  selectedDepartment?: string;
  selectedService?: string;
  userPermissions?: Record<string, boolean>;
}
```

**State Integration**:
- Reads: `selectedAssistant`, `filteredAssistants`, `assistantNotifications`
- Writes: `setSelectedAssistant`, `setFilteredAssistants`, `setActiveContext`, `clearNotifications`
- Auto-fetches data when dept/service changes

**Notification System**:
```javascript
assistantNotifications = {
  assistantId: {
    count: number,
    messages: [string]
  }
}
```

---

### ✅ 5. Main Dashboard Layout
**File**: `src/components/dashboard/RelationalDashboardLayout.tsx`

**Purpose**: Orchestrate all sidebars and conditional rendering  
**Architecture**:
```
┌─────────────────────────────────────────────────────────────────┐
│ RelationalDashboardLayout                                        │
├──────────────────┬──────────────────────┬──────────────────────┤
│ Left Sidebar     │ Main Content Area    │ Right Sidebar        │
│ (280px fixed)    │ ┌──────────────────┤ (280px fixed)         │
│                  │ │ Breadcrumb Nav   │                        │
│ Departments      │ │ Department /     │ AI Assistants         │
│ ├─ OPERATIONS    │ │ Service / Asst   │ ├─ Linda (💬 2)       │
│ ├─ SALES         │ │                  │ ├─ Nina               │
│ ├─ FINANCE       │ │ Main Content     │ ├─ Mary ⭐ Selected  │
│ └─ Services      │ │ (dynamically     │ ├─ Daisy             │
│   ├─ Inventory   │ │  rendered)       │ └─ ...                │
│   └─ Properties  │ │                  │                        │
│                  │ │ Feature Sidebar  │ Context Tools:        │
│                  │ │ (slides in →)    │ [Inventory] [Leasing]│
│                  │ │ When Mary +      │                        │
│                  │ │ Inventory        │ Notifications: 2      │
│                  │ │ selected         │                        │
│                  └──────────────────┤                          │
└──────────────────┴──────────────────┴──────────────────────────┘
```

**Features**:
- 3-column layout: Left sidebar (departments) → Main content → Right sidebar (assistants)
- Breadcrumb navigation shows current selection path
- Conditional feature sidebar rendering (right side, slides in)
- Main content area shows:
  - Empty state when no assistant selected
  - Context info when context selected (feature sidebar shown)
  - Placeholder for actual dashboard content
- Responsive to Redux state changes
- Handles async data loading for contexts

**Key Functions**:
- `renderFeatureSidebar()` - Maps assistant+context → component (Mary+Inventory → MaryInventorySidebar)
- `renderMainContent()` - Displays appropriate content based on selections
- `renderConfig` - Determines what to display

---

### ✅ 6. Redux Integration
**File**: `src/store/store.js` (Updated)

Added to Redux store:
```javascript
import relationalSidebarReducer from '../redux/slices/relationalSidebarSlice';

// In configureStore reducer:
{
  // ... existing reducers
  relationalSidebar: relationalSidebarReducer
}
```

---

## 🔄 Data Flow Diagram

```
User clicks department in Left Sidebar
  ↓
setSelectedDepartment(dept) dispatched
  ↓
Redux state updated: selectedDepartment = dept
  ↓
Right Sidebar effect triggered (selectedDepartment in deps)
  ↓
filterAssistantsByDepartment(dept, permissions) called
  ↓
setFilteredAssistants() dispatched
  ↓
Right Sidebar renders filtered assistants
  ↓
Auto-select default assistant if available
  ↓
Feature sidebar render config updated

---

User selects "inventory" context on Mary assistant
  ↓
setActiveContext({ context: 'inventory' }) dispatched
  ↓
isValidAssistantContext('mary_001', 'inventory') = true
  ↓
fetchContextualData({ assistantId: 'mary_001', context: 'inventory' })
  ↓
API call: GET /api/assistants/mary_001/contexts/inventory
  ↓
contextData stored in Redux
  ↓
showFeatureSidebar = true
  ↓
MaryInventorySidebar rendered in feature sidebar container
```

---

## 🚀 What's Next

### Phase 2: Integrate with Existing Components

1. **Update Dashboard Route**
   - Replace current dashboard component with `RelationalDashboardLayout`
   - Pass user permissions from auth context

2. **Connect to API**
   - Implement backend endpoints:
     - `GET /api/departments`
     - `GET /api/departments/{id}`
     - `GET /api/assistants`
     - `GET /api/assistants/{id}`
     - `GET /api/assistants/{id}/contexts/{context}`
   - Initialize relationship map on app load
   - Fetch real assistant data instead of hardcoded

3. **Update MaryInventorySidebar**
   - Confirm it works when rendered conditionally
   - Test data flow from context area to sidebar

4. **Permission System Integration**
   - Pull user permissions from auth state
   - Pass to filtering functions
   - Hide inaccessible items

5. **Notification Integration**
   - Connect to WebSocket or polling for real notifications
   - Update `assistantNotifications` state
   - Trigger `addNotification()` actions

### Phase 3: Testing & Polish

1. **Unit Tests**
   - Test all filtering functions
   - Test Redux reducers and thunks
   - Test component renders

2. **Integration Tests**
   - Test department → assistant filtering chain
   - Test context switching
   - Test feature sidebar rendering

3. **E2E Tests**
   - User selects department → assistants filter
   - User selects service → assistants further filter
   - User selects assistant → context buttons appear
   - User selects context → feature sidebar renders
   - User switches assistants → feature sidebar closes

4. **UX Polish**
   - Smooth transitions for feature sidebar
   - Loading states for async data
   - Error handling and recovery
   - Keyboard navigation support

---

## 🎯 Item Mapping: Old → New

### From AssistantNavSidebar.jsx (Primary Navigation)
✅ All 12 AI assistants mapped in ASSISTANTS object
✅ 9 departments mapped to assistant departments
✅ Notification system preserved in right sidebar
✅ Tabs (Overview, AI Command, AI Hub) → context buttons
✅ Management tabs (Users, Properties, etc.) → future pages
✅ Integrations → context tools

### From CompanyDepartmentSidebar.tsx (Organization)
✅ All 9+ departments in DEPARTMENTS array
✅ Services per department mapped to assistant services
✅ Team access → future feature (navigate to team context)
✅ Hierarchical grouping preserved in component

### From AIAssistantsSidebar.tsx (Right Sidebar Replacement)
✅ All assistants shown with colors and descriptions
✅ WhatsApp management → context tools
✅ CRM agents → Linda assistant
✅ Data management → service filtering
✅ Analytics → context tools
✅ Quick actions → context buttons

### From MaryInventorySidebar.tsx (Feature-Specific)
✅ Renders conditionally when Mary + inventory selected
✅ Maintains all original features:
   - Dashboard, Search, List
   - Smart Import, Import History, Data Validation
   - Statistics, Reports, Market Trends
   - Preferences, API Keys

### From RoleNavigation.jsx (Legacy)
⏳ Can be deprecated or migrated to permission system
⏳ Role-based content might become permission-based visibility

---

## 🔐 Security & Permissions

**Permission Gates**:
1. User permissions passed to filtering functions
2. Assistants with `permissions[id] === false` are filtered out
3. Services/departments check user access before display
4. Feature sidebars only show if user has permission

**Example Permission Object**:
```javascript
{
  'linda_001': true,    // Can access Linda
  'mary_001': true,     // Can access Mary
  'zoe_001': false,     // Cannot access Zoe (executive only)
  // ... more
}
```

---

## 📊 State Structure Reference

### Left Sidebar State
```javascript
{
  selectedDepartment: 'OPERATIONS',      // Current dept selection
  selectedService: 'inventory',          // Current service selection
  departments: [],                       // All departments
  filteredServices: [],                  // Services in selected dept
  departmentData: { /* ... */ },        // Full dept object from API
  departmentLoading: false,
  departmentError: null
}
```

### Right Sidebar State
```javascript
{
  selectedAssistant: 'mary_001',         // Current assistant
  filteredAssistants: [                  // Assistants matching dept/service
    { id, name, color, description, ... }
  ],
  assistantData: { /* ... */ },         // Full assistant profile
  assistantNotifications: {
    'linda_001': { count: 2, messages: [...] },
    'mary_001': { count: 0, messages: [] }
  },
  assistantLoading: false,
  assistantError: null
}
```

### Context State
```javascript
{
  activeContext: 'inventory',            // Selected context tool
  contextData: { /* inventory data */ }, // Data for the context
  contextLoading: false,
  contextError: null,
  showFeatureSidebar: true               // Whether to show feature sidebar
}
```

### Relationship State
```javascript
{
  relationshipMap: {
    departmentAssistants: {
      'OPERATIONS': ['mary_001', 'daisy_001', 'sentinel_001', ...]
    },
    assistantDepartments: {
      'mary_001': ['OPERATIONS']
    },
    assistantServices: {
      'mary_001': ['inventory', 'properties']
    },
    serviceAssistants: {
      'inventory': ['mary_001']
    }
  },
  selectionHistory: [
    { type: 'department', id: 'OPERATIONS', timestamp: '...' },
    { type: 'assistant', id: 'mary_001', timestamp: '...' }
  ]
}
```

---

## 🛠️ Integration Checklist

- [ ] Update main dashboard route to use `RelationalDashboardLayout`
- [ ] Implement backend API endpoints for departments and assistants
- [ ] Test filtering: department → service → assistant chain
- [ ] Test context switching and feature sidebar rendering
- [ ] Connect real notification system
- [ ] Implement user permission fetching
- [ ] Migrate RoleNavigation features or deprecate
- [ ] Add unit tests for all utility functions
- [ ] Add integration tests for component chains
- [ ] Performance test with 50+ assistants/departments
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Document custom hooks for common patterns
- [ ] Create reusable feature-sidebar pattern documentation

---

**Next Steps**: Review integration points and begin Phase 2 API implementation.
