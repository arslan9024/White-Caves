# Phase 2B: Frontend Redux Integration - Implementation Guide

**Status:** IN PROGRESS  
**Date Started:** December 2024  
**Objective:** Integrate frontend Redux state management with backend API using async thunks and update UI components for live data, loading states, and error handling.

---

## Overview

Phase 2B connects the frontend components to the backend API through Redux. This involves:
1. Updating sidebar components to dispatch async thunks
2. Wiring up live API data to Redux state
3. Adding loading and error states to the UI
4. Testing end-to-end integration
5. Documenting changes and committing to git

---

## Architecture Review

### Current Stack
- **Frontend State:** Redux with relationalSidebarSlice.js
- **API Service:** src/services/relationalSidebarAPI.js (6 endpoints)
- **Async Thunks:** src/store/thunks/relationalSidebarThunks.js (6 thunks)
- **Components:** RelationalLeftSidebar.tsx, RelationalRightSidebar.tsx, MaryInventorySidebar.tsx
- **Backend API:** /api/relational-sidebar (Express server at server/index.js)

### Redux Flow
```
Component (UI) → Dispatch Thunk → API Service → Backend API
                      ↓
                Redux Reducer
                      ↓
                Update State
                      ↓
                Component Re-renders with Data
```

---

## Implementation Tasks

### Task 1: Update RelationalLeftSidebar Component
**File:** `src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx`

#### Changes:
1. Import `fetchDepartments` thunk from relationalSidebarThunks
2. On mount, dispatch `fetchDepartments` instead of using static DEPARTMENTS
3. Add loading state UI with skeleton loaders
4. Add error state handling with retry button
5. Update to use Redux state for departments list
6. Keep existing filtering logic but enhance with API data

#### Pseudo-code:
```jsx
useEffect(() => {
  dispatch(fetchDepartments());
}, [dispatch]);

// Show loading state
if (departmentsLoading) return <Skeleton />;
if (departmentsError) return <ErrorState onRetry={...} />;

// Render departments from Redux state
```

---

### Task 2: Update RelationalRightSidebar Component
**File:** `src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx`

#### Changes:
1. Import `fetchAssistants` and `fetchAssistantById` thunks
2. When department or service changes, dispatch `fetchAssistants` with filters
3. When an assistant is selected, optionally fetch detailed data
4. Add loading and error states for assistant list
5. Handle notification display (already structured)
6. Add loading spinner while fetching assistants

---

### Task 3: Add Loading/Error States to Redux Slice
**File:** `src/redux/slices/relationalSidebarSlice.js`

#### Verify Existing State:
- ✅ `departmentLoading`, `departmentError`
- ✅ `assistantLoading`, `assistantError`
- ✅ `contextLoading`, `contextError`

#### Add Extra Reducers (if missing):
- Handle pending/fulfilled/rejected for all thunks
- Ensure all async states are properly tracked

---

### Task 4: Create Loading/Error UI Components
**Files:** Create new styled components or update existing ones

#### Components to Add:
1. **DepartmentSkeleton** - Show placeholder while loading departments
2. **AssistantSkeleton** - Show placeholder while loading assistants
3. **ErrorState** - Display error with retry button
4. **LoadingSpinner** - Inline loading indicator

#### Example:
```jsx
const DepartmentSkeleton = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #333 25%, #2a2a2a 50%, #333 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
`;
```

---

### Task 5: Wire Up Sidebar to API Data
**Components to Update:**

#### RelationalLeftSidebar:
- Remove hardcoded DEPARTMENTS array
- Use Redux state: `selectDepartments` (need to create this selector)
- Dispatch `fetchDepartments` on mount
- Show loading/error states

#### RelationalRightSidebar:
- Remove hardcoded filtering logic (or keep as fallback)
- Use Redux state: `selectFilteredAssistants`
- Dispatch `fetchAssistants(filters)` when filters change
- Show loading/error states

#### MaryInventorySidebar:
- Similar approach for context-specific data
- Use `fetchContextualData` thunk

---

### Task 6: Add Extra Reducers to Handle All Thunks
**File:** `src/redux/slices/relationalSidebarSlice.js`

#### Verify all 6 thunks have reducers:
1. `fetchDepartments` ✓
2. `fetchDepartmentById` ✓
3. `fetchAssistants` ✓
4. `fetchAssistantById` ✓
5. `fetchContextualData` ✓
6. `sendNotification` ✓

#### Add if missing:
```javascript
builder
  .addCase(fetchDepartments.pending, (state) => {
    state.departmentsLoading = true;
  })
  .addCase(fetchDepartments.fulfilled, (state, action) => {
    state.departmentsLoading = false;
    state.departments = action.payload;
  })
  .addCase(fetchDepartments.rejected, (state, action) => {
    state.departmentsLoading = false;
    state.departmentsError = action.payload;
  });
```

---

### Task 7: Update Selectors in Redux Slice
**File:** `src/redux/slices/relationalSidebarSlice.js`

#### Selectors to Add (if missing):
```javascript
export const selectDepartments = (state) => state.relationalSidebar.departments;
export const selectDepartmentsLoading = (state) => state.relationalSidebar.departmentsLoading;
export const selectDepartmentsError = (state) => state.relationalSidebar.departmentsError;
export const selectAssistants = (state) => state.relationalSidebar.filteredAssistants;
export const selectAssistantsLoading = (state) => state.relationalSidebar.assistantLoading;
export const selectAssistantsError = (state) => state.relationalSidebar.assistantError;
```

---

### Task 8: Test Components with Backend API
**Testing Checklist:**

1. **Start Backend Server:**
   ```bash
   npm run server
   ```

2. **Start Frontend Dev Server:**
   ```bash
   npm run dev
   ```

3. **Test Flows:**
   - [ ] Page loads → Departments fetched and displayed
   - [ ] Select department → Services filtered (if available)
   - [ ] Select service → Assistants filtered and displayed
   - [ ] Select assistant → Details loaded
   - [ ] Error state shown on API failure
   - [ ] Loading state shown while fetching
   - [ ] Retry button works on error

4. **Console Checks:**
   - [ ] No Redux errors
   - [ ] API calls logged ([API] prefix in console)
   - [ ] No CORS errors
   - [ ] No missing selector errors

---

### Task 9: End-to-End Testing
**Test File:** `test/phase-2b-integration.test.js`

#### Test Cases:
1. Departments load on app start
2. Selecting a department filters services
3. Selecting a service filters assistants
4. Error recovery works (retry on failed API call)
5. Loading states show and hide properly
6. Notifications display and clear correctly

---

### Task 10: Documentation & Commit
**Files to Create/Update:**

1. **PHASE_2B_COMPLETION_REPORT.md** - Summary of changes
2. **PHASE_2B_TESTING_RESULTS.md** - Test results and validations
3. **REDUX_INTEGRATION_CHECKLIST.md** - Component-by-component status

**Git Commit:**
```bash
git add -A
git commit -m "Phase 2B: Frontend Redux Integration with Backend API

- Updated RelationalLeftSidebar with fetchDepartments thunk
- Updated RelationalRightSidebar with fetchAssistants thunk
- Added loading and error states to components
- Added loading/error UI components
- Tested end-to-end integration with backend API
- All 6 API endpoints working with Redux flow
- Documented changes and testing results"
```

---

## Redux Slice State Structure

```javascript
{
  relationalSidebar: {
    // Left Sidebar State
    selectedDepartment: 'OPERATIONS',
    selectedService: 'inventory',
    departments: [],              // From API
    departmentsLoading: false,
    departmentsError: null,
    filteredServices: [],
    
    // Right Sidebar State
    selectedAssistant: 'LUCY',
    filteredAssistants: [],      // From API
    assistantLoading: false,
    assistantError: null,
    assistantNotifications: { LUCY: { count: 2, messages: [...] } },
    assistantData: null,
    
    // Context-Specific Sidebar State
    activeContext: 'inventory',
    contextData: null,
    contextLoading: false,
    contextError: null,
    
    // Relational State
    relationshipMap: {},
    selectionHistory: []
  }
}
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose | Redux Thunk |
|----------|--------|---------|-------------|
| `/api/relational-sidebar/departments` | GET | Get all departments | `fetchDepartments` |
| `/api/relational-sidebar/departments/:id` | GET | Get department details | `fetchDepartmentById` |
| `/api/relational-sidebar/assistants` | GET | Get assistants (with filters) | `fetchAssistants` |
| `/api/relational-sidebar/assistants/:id` | GET | Get assistant details | `fetchAssistantById` |
| `/api/relational-sidebar/assistants/:id/context/:context` | GET | Get contextual data | `fetchContextualData` |
| `/api/relational-sidebar/notifications` | POST | Send notification | `sendNotification` |

---

## Success Criteria

- ✅ All sidebar components use Redux thunks instead of hardcoded data
- ✅ Loading states display while fetching data
- ✅ Error states display on API failures with retry option
- ✅ End-to-end flow works: Department → Service → Assistant → Context
- ✅ Console shows [API] and [Thunk] logs confirming API calls
- ✅ No CORS errors or missing selector errors
- ✅ All tests passing
- ✅ Changes committed with descriptive messages

---

## Progress Tracking

| Task | Status | Date | Notes |
|------|--------|------|-------|
| 1. Review API/Thunks | ✅ DONE | Dec 2024 | Confirmed all pieces in place |
| 2. Update Left Sidebar | ⏳ PENDING | - | - |
| 3. Update Right Sidebar | ⏳ PENDING | - | - |
| 4. Add Loading/Error UI | ⏳ PENDING | - | - |
| 5. Test Integration | ⏳ PENDING | - | - |
| 6. Documentation | ⏳ PENDING | - | - |
| 7. Final Commit | ⏳ PENDING | - | - |

---

## Command Reference

```bash
# Start backend server
npm run server

# Start frontend dev server
npm run dev

# Run tests
npm test

# Run API tests
node test-api-endpoints.js

# Git operations
git status
git add .
git commit -m "message"
git push origin main
```

---

## Notes

- All API endpoints return `{ success: true/false, data, error }` format
- Redux thunks handle API errors and dispatch rejected actions
- Components should show loading/error states while data loads
- Use selectors (not direct state access) for best practices
- Keep filtering logic in utils, state in Redux, UI in components

---

**Next Phase:** Phase 3 - Testing, Optimization, and Deployment  
**Timeline:** After Phase 2B completion and validation
