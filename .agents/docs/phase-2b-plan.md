# 🚀 Phase 2B: Frontend Redux Integration

**Status:** Starting  
**Timeline:** 3-4 days  
**Target:** Full end-to-end integration of frontend + backend API

---

## 📊 Overview

This phase connects the Relational Sidebar React components to the backend API, replacing mock data with real API calls through Redux async thunks.

### What's Already Done
✅ Phase 1: Frontend UI components  
✅ Phase 2: Backend API endpoints  

### What We'll Do Now (Phase 2B)
⏳ Redux async thunks  
⏳ API service layer  
⏳ Loading/error states  
⏳ Real data integration  
⏳ End-to-end testing  

---

## 📁 Phase 2B Deliverables

### 1. Redux Thunks (3 files)
- `src/store/thunks/departmentThunks.js` - Fetch departments
- `src/store/thunks/assistantThunks.js` - Fetch assistants
- `src/store/thunks/notificationThunks.js` - Send notifications

### 2. API Service Layer (1 file)
- `src/services/relationalSidebarAPI.js` - Centralized API calls

### 3. Redux Slices Updates (1 file)
- `src/store/relationalSidebarSlice.js` - Add loading/error states

### 4. Component Updates (5 files)
- `src/components/RelationalLeftSidebar.tsx` - Connect to Redux
- `src/components/RelationalRightSidebar.tsx` - Connect to Redux
- `src/components/RelationalDashboardLayout.tsx` - Orchestrate loading
- `src/components/MaryInventorySidebar.tsx` - Conditional loading
- `src/components/SidebarLoadingState.tsx` - Loading UI

### 5. Testing (3 files)
- `src/__tests__/integration/sidebarAPI.integration.test.ts`
- `src/__tests__/integration/sidebarWithAPI.test.ts`
- `src/__tests__/e2e/sidebar.e2e.test.ts`

### 6. Documentation (3 files)
- `PHASE_2B_INTEGRATION_GUIDE.md`
- `PHASE_2B_API_THUNKS_REFERENCE.md`
- `PHASE_2B_COMPLETION_CHECKLIST.md`

---

## 🎯 Implementation Plan

### Step 1: API Service Layer (30 min)
Create centralized API service that wraps fetch calls:
```javascript
// src/services/relationalSidebarAPI.js
export const relationalSidebarAPI = {
  async getDepartments() { ... },
  async getAssistants(filters) { ... },
  async sendNotification(assistantId, message) { ... },
  // etc
}
```

### Step 2: Redux Thunks (1 hour)
Create async thunks for each major operation:
```javascript
// src/store/thunks/departmentThunks.js
export const fetchDepartments = createAsyncThunk(
  'relationalSidebar/fetchDepartments',
  async () => { ... }
)
```

### Step 3: Redux Slice Updates (30 min)
Add loading/error states:
```javascript
// Update relationalSidebarSlice.js
- Add loading states
- Add error messages
- Handle pending/fulfilled/rejected
```

### Step 4: Component Integration (2 hours)
Connect components to Redux:
```javascript
// src/components/RelationalDashboardLayout.tsx
- useEffect(() => dispatch(fetchDepartments()), [])
- Show loading spinner while fetching
- Display error messages if fails
```

### Step 5: Testing (1.5 hours)
Create test cases:
- API service tests
- Thunk tests  
- Component integration tests
- E2E flow tests

### Step 6: Documentation (1 hour)
Create comprehensive guides

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────┐
│         React Component (Dashboard)                  │
└────────────────┬────────────────────────────────────┘
                 │ dispatch action
                 ▼
┌─────────────────────────────────────────────────────┐
│    Redux Thunk (fetchDepartments)                   │
│    - Sets loading = true                            │
│    - Calls API service                              │
└────────────────┬────────────────────────────────────┘
                 │ API call
                 ▼
┌─────────────────────────────────────────────────────┐
│    API Service (relationalSidebarAPI)               │
│    - fetch() to backend                             │
│    - Error handling                                 │
└────────────────┬────────────────────────────────────┘
                 │ HTTP request
                 ▼
┌─────────────────────────────────────────────────────┐
│    Backend API (Express)                            │
│    GET /api/relational-sidebar/departments          │
└────────────────┬────────────────────────────────────┘
                 │ JSON response
                 ▼
┌─────────────────────────────────────────────────────┐
│    Redux Slice                                      │
│    - Sets loading = false                           │
│    - Sets data = response                           │
│    - Re-renders component                           │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Detailed Tasks

### Task 1: Create API Service Layer
**File:** `src/services/relationalSidebarAPI.js`
**Lines:** ~100
**Methods:**
- `getDepartments()`
- `getDepartmentById(id)`
- `getAssistants(filters)`
- `getAssistantById(id)`
- `getAssistantContext(assistantId, context)`
- `sendNotification(assistantId, message, type)`
- `getHealth()` - Health check

### Task 2: Create Redux Thunks
**Files:** 
- `src/store/thunks/departmentThunks.js` (~50 lines)
- `src/store/thunks/assistantThunks.js` (~50 lines)
- `src/store/thunks/notificationThunks.js` (~30 lines)

**Thunks:**
```
- fetchDepartments()
- fetchDepartmentById(id)
- fetchAssistants(filters)
- fetchAssistantById(id)
- fetchAssistantContext(assistantId, context)
- sendNotificationAsync(assistantId, message, type)
```

### Task 3: Update Redux Slice
**File:** `src/store/relationalSidebarSlice.js`
**Changes:**
- Add `loading` state
- Add `error` state
- Add `extraReducers` for thunk handling
- Maintain existing state structure

### Task 4: Update Components
**Files:**
- `RelationalDashboardLayout.tsx` - Main orchestrator
- `RelationalLeftSidebar.tsx` - Departments display
- `RelationalRightSidebar.tsx` - Assistants display
- `MaryInventorySidebar.tsx` - Conditional sidebar
- `SidebarLoadingState.tsx` - New loading skeleton

**Changes:**
```typescript
// In component:
const dispatch = useDispatch();
const { departments, loading, error } = useSelector(state => state.relationalSidebar);

useEffect(() => {
  dispatch(fetchDepartments());
}, [dispatch]);

if (loading) return <SidebarLoadingState />;
if (error) return <ErrorMessage error={error} />;
```

### Task 5: Create Tests
**Integration Tests:**
- API service integration
- Thunk dispatch & fulfillment
- Redux state updates

**E2E Tests:**
- Full user flow (select dept → load assistants → send notification)
- Error scenarios
- Loading states

### Task 6: Documentation
- Phase 2B Integration Guide
- Thunks reference
- Troubleshooting guide

---

## ⏱️ Timeline

| Task | Duration | Status |
|------|----------|--------|
| 1. API Service | 30 min | ⏳ |
| 2. Redux Thunks | 1 hour | ⏳ |
| 3. Slice Updates | 30 min | ⏳ |
| 4. Components | 2 hours | ⏳ |
| 5. Testing | 1.5 hours | ⏳ |
| 6. Documentation | 1 hour | ⏳ |
| **Total** | **~6 hours** | ⏳ |

---

## 🎯 Success Criteria

✅ All API calls working in components  
✅ Loading states display correctly  
✅ Error handling implemented  
✅ Departments load on mount  
✅ Assistants load when dept selected  
✅ Notifications send successfully  
✅ All tests passing  
✅ Zero console errors  
✅ Complete documentation  

---

## 📚 Resources

**Backend API Docs:**
→ `plans/RELATIONAL_SIDEBAR_API_INTEGRATION_REPORT.md`

**Frontend Architecture:**
→ `plans/RELATIONAL_SIDEBAR_IMPLEMENTATION_GUIDE.md`

**Redux Setup:**
→ `src/store/relationalSidebarSlice.js`

**Components:**
→ `src/components/Relational*.tsx`

---

## 🚀 Ready to Start?

Confirm to begin Phase 2B:
```bash
# When ready:
node phase-2b-setup.js  # Script to scaffold files
```

Or manual start:
```bash
# Step 1: Create API service
touch src/services/relationalSidebarAPI.js

# Step 2: Create thunks
mkdir -p src/store/thunks
touch src/store/thunks/{departmentThunks,assistantThunks,notificationThunks}.js
```

---

**Status:** Ready to begin  
**Estimated Completion:** 3-4 hours of focused work  
**Quality Level:** Production-grade with tests  
**Next Phase After:** Phase 3 - Production Deployment & Final Testing

