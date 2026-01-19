# Relational Sidebar System - Quick Start & Integration Guide

**Date**: January 19, 2026  
**Target**: Integrate new sidebar system into main dashboard  
**Estimated Time**: 2-3 hours

---

## 🚀 Quick Start

### Step 1: Update Main Dashboard Route

**File**: Your main dashboard route file (e.g., `src/pages/Dashboard.jsx` or `src/routes/index.ts`)

```javascript
// Before:
import OldAssistantNavSidebar from '@/components/dashboard/AssistantNavSidebar';
import OldCompanyDepartmentSidebar from '@/components/sidebars/CompanyDepartmentSidebar';

function Dashboard() {
  return (
    <div className="dashboard">
      <OldCompanyDepartmentSidebar />
      {/* Content */}
      <OldAssistantNavSidebar />
    </div>
  );
}

// After:
import RelationalDashboardLayout from '@/components/dashboard/RelationalDashboardLayout';
import { useSelector } from 'react-redux';

function Dashboard() {
  const userPermissions = useSelector(state => state.auth.userPermissions);
  
  return <RelationalDashboardLayout userPermissions={userPermissions} />;
}
```

### Step 2: Ensure Redux Store is Updated

**File**: `src/store/store.js` (already updated)

Check that `relationalSidebarReducer` is included:
```javascript
import relationalSidebarReducer from '../redux/slices/relationalSidebarSlice';

// In configureStore:
reducer: {
  // ... other reducers
  relationalSidebar: relationalSidebarReducer
}
```

### Step 3: Initialize Relationship Map on App Load

**File**: `src/App.jsx` or `src/pages/Dashboard.jsx`

```javascript
import { useDispatch } from 'react-redux';
import { setRelationshipMap } from '@/redux/slices/relationalSidebarSlice';
import { buildRelationshipMap } from '@/utils/relationalSidebarUtils';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Build relationship map once on app load
    try {
      const userPermissions = {
        // Get from auth state or API
        'linda_001': true,
        'mary_001': true,
        'zoe_001': false, // User doesn't have access
        // ... etc
      };
      
      const relationshipMap = buildRelationshipMap(userPermissions);
      dispatch(setRelationshipMap(relationshipMap));
    } catch (error) {
      console.error('Failed to initialize relationship map:', error);
    }
  }, [dispatch]);

  return (
    // App content
  );
}
```

### Step 4: Verify Theme Integration

**File**: Your theme provider (e.g., `src/theme/index.js`)

Ensure these theme colors exist:
```javascript
const theme = {
  colors: {
    sidebar: {
      background: '#1a1a1a',
      activeBackground: '#2a2a2a',
      hoverBackground: '#252525',
      itemBackground: '#2a2a2a'
    },
    border: '#333',
    text: '#fff',
    textSecondary: '#999',
    textTertiary: '#666',
    primary: '#007bff',
    primaryHover: '#0056b3',
    scrollbar: '#555',
    scrollbarHover: '#777'
  }
};
```

---

## 📡 Backend API Requirements

The system expects these endpoints. Create them if not already present:

### 1. Get All Departments
```
GET /api/departments
Response:
{
  data: [
    {
      id: 'OPERATIONS',
      label: 'Operations',
      description: 'Operations team',
      services: [
        { id: 'inventory', label: 'Inventory Management' },
        { id: 'properties', label: 'Property Management' },
        ...
      ]
    },
    ...
  ]
}
```

### 2. Get Department Details
```
GET /api/departments/{id}
Response:
{
  id: 'OPERATIONS',
  label: 'Operations',
  description: 'Operations department',
  head: { id: '...', name: 'John Doe', title: 'Head' },
  services: [...],
  team: [...]
}
```

### 3. Get All Assistants
```
GET /api/assistants
Response:
{
  data: [
    {
      id: 'mary_001',
      name: 'Mary',
      description: 'Inventory Manager',
      color: '#3B82F6',
      icon: 'Package',
      departments: ['OPERATIONS'],
      services: ['inventory', 'properties'],
      contexts: ['inventory', 'property-management'],
      profile: { ... }
    },
    ...
  ]
}
```

### 4. Get Assistant Details
```
GET /api/assistants/{id}
Response:
{
  id: 'mary_001',
  name: 'Mary',
  description: 'Inventory Manager',
  profile: {
    bio: '...',
    capabilities: [...],
    recentActivity: [...]
  },
  contexts: [
    { id: 'inventory', label: 'Inventory Tools' },
    { id: 'property-management', label: 'Property Management' }
  ]
}
```

### 5. Get Contextual Data
```
GET /api/assistants/{id}/contexts/{context}
Example: GET /api/assistants/mary_001/contexts/inventory

Response:
{
  context: 'inventory',
  data: {
    totalProperties: 150,
    recentImports: [...],
    stats: {...},
    // Whatever data the feature sidebar needs
  }
}
```

### 6. Send Notification
```
POST /api/assistants/{id}/notifications
Body:
{
  message: 'New inventory update',
  type: 'info' | 'warning' | 'error'
}

Response:
{ success: true, notificationId: '...' }
```

---

## 🔌 Integration Points

### With Authentication
```javascript
// In auth reducer or context
const userPermissions = {
  // Map of assistantId -> boolean
  'linda_001': true,
  'mary_001': true,
  'zoe_001': false, // Admin-only
  // ... fetch from user.role or user.permissions
};
```

### With Existing Data
Map your existing assistant data structure to the expected format:

**Old format** (example):
```javascript
{
  assistantId: 'linda',
  name: 'Linda',
  avatar: '...'
}
```

**New format**:
```javascript
{
  id: 'linda_001',
  name: 'Linda',
  description: 'WhatsApp CRM Agent',
  color: '#25D366',
  departments: ['COMMUNICATIONS', 'SALES'],
  services: ['whatsapp', 'crm'],
  contexts: ['crm', 'messaging'],
  icon: 'MessageCircle'
}
```

### With WebSocket Notifications
```javascript
// In your WebSocket handler
useEffect(() => {
  socket.on('assistant-notification', (data) => {
    dispatch(addNotification({
      assistantId: data.assistantId,
      message: data.message
    }));
  });
}, [dispatch]);
```

---

## 🧪 Testing Integration

### Manual Testing Checklist

1. **Department Selection**
   - [ ] Click each department in left sidebar
   - [ ] Verify right sidebar filters to show correct assistants
   - [ ] Verify breadcrumb updates

2. **Service Selection**
   - [ ] Select a service under department
   - [ ] Verify assistants further filtered
   - [ ] Verify service deselection resets

3. **Assistant Selection**
   - [ ] Click assistant in right sidebar
   - [ ] Verify context buttons appear
   - [ ] Verify previous context clears

4. **Context Selection (Inventory)**
   - [ ] Select Mary from right sidebar
   - [ ] Click "Inventory" button
   - [ ] Verify MaryInventorySidebar renders on right
   - [ ] Verify all 11 inventory items visible
   - [ ] Switch to different assistant and back to Mary
   - [ ] Verify inventory state preserved

5. **Notifications**
   - [ ] Verify notification badge appears
   - [ ] Click badge to dismiss
   - [ ] Verify count updates

6. **Responsive**
   - [ ] Test on mobile (sidebars should stack or hide)
   - [ ] Test sidebar collapse/expand
   - [ ] Test scrollbar functionality

### API Testing
```bash
# Test department endpoint
curl http://localhost:3000/api/departments

# Test assistant endpoint
curl http://localhost:3000/api/assistants

# Test specific assistant
curl http://localhost:3000/api/assistants/mary_001

# Test contextual data
curl http://localhost:3000/api/assistants/mary_001/contexts/inventory
```

---

## 🐛 Troubleshooting

### Issue: Assistants not filtering
**Check**:
1. Is `selectedDepartment` being set in Redux?
2. Is `filterAssistantsByDepartment()` being called?
3. Are user permissions allowing access?
4. Check Redux DevTools for state changes

**Fix**:
```javascript
// Add logging to RelationalRightSidebar.tsx
useEffect(() => {
  console.log('Department:', selectedDepartment);
  console.log('Permissions:', userPermissions);
  console.log('Filtered:', filteredAssistants);
}, [selectedDepartment, userPermissions, filteredAssistants]);
```

### Issue: Feature sidebar not rendering
**Check**:
1. Is assistant selected?
2. Is context valid for assistant?
3. Does feature sidebar component exist in map?
4. Is `showFeatureSidebar` true?

**Fix**:
```javascript
// In RelationalDashboardLayout.tsx
console.log('Selected assistant:', selectedAssistant);
console.log('Active context:', activeContext);
console.log('Show feature sidebar:', showFeatureSidebar);
console.log('Valid context?', isValidAssistantContext(selectedAssistant, activeContext));
```

### Issue: Notifications not showing
**Check**:
1. Are notifications being added to Redux?
2. Does right sidebar have notification badge?
3. Is notification count > 0?

**Fix**:
```javascript
// Manually add notification for testing
dispatch(addNotification({
  assistantId: 'linda_001',
  message: 'Test notification'
}));
```

### Issue: Theme colors not applying
**Check**:
1. Is styled-components provider wrapping app?
2. Are theme colors defined?
3. Is ThemeProvider passing theme prop?

**Fix**:
```javascript
import { ThemeProvider } from 'styled-components';
import theme from '@/theme';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 📦 Files Modified/Created

### New Files Created
- ✅ `src/redux/slices/relationalSidebarSlice.js` - Redux state management
- ✅ `src/utils/relationalSidebarUtils.js` - Filtering logic & utilities
- ✅ `src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx` - Left sidebar
- ✅ `src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx` - Right sidebar
- ✅ `src/components/dashboard/RelationalDashboardLayout.tsx` - Main layout

### Files Modified
- ✅ `src/store/store.js` - Added relationalSidebarReducer

### Documentation Created
- ✅ `plans/RELATIONAL_SIDEBAR_IMPLEMENTATION_GUIDE.md` - Full implementation guide
- ✅ `plans/SIDEBAR_ITEMS_COMPLETE_MAPPING.md` - Item-by-item mapping
- ✅ `plans/RELATIONAL_SIDEBAR_QUICK_START.md` - This file

---

## 🎯 Next Steps After Integration

### Immediate (Today)
1. Update dashboard route
2. Test basic filtering
3. Verify Redux integration
4. Test with mock data

### Short-term (This Week)
1. Implement API endpoints
2. Connect to real assistant data
3. Test context switching
4. Test feature sidebar rendering

### Medium-term (This Sprint)
1. Create additional feature sidebars (Leasing, Finance, etc.)
2. Implement notification integration
3. Add permission system
4. Performance testing with large datasets

### Long-term
1. Create reusable feature sidebar pattern
2. Document for other teams
3. Build feature sidebar scaffold/template
4. Deprecate old sidebar components

---

## 📊 Component Dependency Tree

```
RelationalDashboardLayout
├── RelationalLeftSidebar
│   ├── BaseSidebar (from shared)
│   ├── SidebarSection (from shared)
│   └── SidebarItem (from shared)
├── RelationalRightSidebar
│   ├── BaseSidebar (from shared)
│   ├── SidebarSection (from shared)
│   └── SidebarItem (from shared)
├── MaryInventorySidebar (conditional)
│   └── ... (existing inventory UI)
└── [Future Feature Sidebars]
    ├── LeaseManagerSidebar
    ├── AnalyticsSidebar
    ├── FinanceSidebar
    └── ...

Redux State
├── relationalSidebar
│   ├── selectedDepartment
│   ├── selectedService
│   ├── selectedAssistant
│   ├── activeContext
│   ├── filteredAssistants
│   ├── assistantNotifications
│   ├── contextData
│   └── relationshipMap

Utils
├── relationalSidebarUtils.js
│   ├── filterAssistantsByDepartment()
│   ├── filterAssistantsByService()
│   ├── getDefaultAssistant()
│   ├── getContextsForAssistant()
│   ├── buildRelationshipMap()
│   └── ... (8 more functions)
```

---

## 🔑 Key Redux Actions Cheat Sheet

```javascript
// Department actions
dispatch(setSelectedDepartment('OPERATIONS'));
dispatch(setSelectedService('inventory'));

// Assistant actions
dispatch(setSelectedAssistant('mary_001'));
dispatch(setFilteredAssistants([...]);

// Context actions
dispatch(setActiveContext({ context: 'inventory' }));
dispatch(clearActiveContext());

// Notification actions
dispatch(addNotification({ 
  assistantId: 'linda_001', 
  message: 'New message' 
}));
dispatch(clearNotifications('linda_001'));

// Relationship setup
dispatch(setRelationshipMap(relationshipMapData));

// Reset everything
dispatch(resetRelationalSidebar());
```

---

## ✅ Success Criteria

After integration, you should be able to:

- [ ] See left sidebar with all departments
- [ ] Click department → right sidebar shows filtered assistants
- [ ] Click service → further filters assistants
- [ ] Click assistant → context buttons appear
- [ ] Click "Inventory" for Mary → MaryInventorySidebar renders
- [ ] Switch assistants → feature sidebar disappears
- [ ] Send notification to assistant → badge appears
- [ ] Click notification badge → count clears
- [ ] Breadcrumb shows current path
- [ ] All responsive and performant
- [ ] No console errors

---

**Ready to integrate? Start with Step 1!**
