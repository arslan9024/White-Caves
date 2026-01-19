# Phase 2: Integration Checklist & Deployment Guide

## Pre-Integration Verification

### Backend API Endpoints ✅

- [x] GET /departments - Implemented
- [x] GET /departments/:id - Implemented
- [x] GET /assistants - Implemented (with filtering)
- [x] GET /assistants/:id - Implemented
- [x] GET /assistants/:id/contexts/:context - Implemented
- [x] POST /assistants/:id/notifications - Implemented

**Status**: All endpoints ready for testing

### Controllers ✅

- [x] departmentController.js - Implemented
- [x] assistantController.js - Implemented
- [x] contextController.js - Implemented
- [x] notificationController.js - Implemented

**Status**: All business logic implemented

### Middleware ✅

- [x] errorHandler.js - Implemented
- [x] validation.js - Implemented

**Status**: Error handling and validation ready

### Mock Data ✅

- [x] Departments (4 total)
- [x] Assistants (4 total)
- [x] Context Data (6 contexts)
- [x] Notifications (examples)

**Status**: Complete test data available

### Frontend Services ✅

- [x] relationalSidebarAPI.js - Implemented
- [x] All 6 endpoint functions
- [x] Batch operation helpers

**Status**: API service layer complete

### Redux Integration ✅

- [x] 9 Redux thunks
- [x] Error handling in thunks
- [x] Logging for debugging

**Status**: Redux integration code complete

---

## Testing Phase

### Unit Testing

#### Backend Endpoints

Run these curl commands to verify each endpoint:

```bash
# Test 1: GET /departments
curl http://localhost:3000/api/relational-sidebar/departments

# Test 2: GET /departments/:id
curl http://localhost:3000/api/relational-sidebar/departments/OPERATIONS

# Test 3: GET /assistants
curl http://localhost:3000/api/relational-sidebar/assistants

# Test 4: GET /assistants (with filter)
curl "http://localhost:3000/api/relational-sidebar/assistants?department=OPERATIONS"

# Test 5: GET /assistants/:id
curl http://localhost:3000/api/relational-sidebar/assistants/mary_001

# Test 6: GET /assistants/:id/contexts/:context
curl http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/inventory

# Test 7: POST /assistants/:id/notifications
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message":"Test","type":"info"}'
```

**Acceptance Criteria**:
- [ ] All endpoints return HTTP 200 or 201
- [ ] Response format matches documentation
- [ ] Data is correct and complete
- [ ] Error handling works for invalid input

### Integration Testing

#### Redux Connection

1. **Connect Redux Store**:
   - Update Redux slice to handle thunk actions
   - Add pending/fulfilled/rejected handlers
   - Test state updates

2. **Test Thunk Dispatch**:
   ```javascript
   // In a test component
   const dispatch = useDispatch();
   
   // Test dispatching thunk
   dispatch(fetchDepartments());
   // Verify departments appear in Redux store
   ```

3. **Verify Data Flow**:
   - API call is made
   - Redux state updates
   - Component re-renders with new data
   - No console errors

#### Component Integration

1. **Update Sidebar Components**:
   - Connect to Redux selectors
   - Dispatch thunks on mount
   - Display loading states
   - Handle errors

2. **Test User Interactions**:
   - Select department → filter assistants
   - Select assistant → load context
   - Notifications appear → badge updates
   - Click actions → API calls work

---

## Integration Steps

### Step 1: Connect Redux Slice (Est. 30 min)

**File**: `src/store/relationalSidebarSlice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit';
import * as thunks from './thunks/relationalSidebarThunks';
import { handlePendingState, handleFulfilledState, handleRejectedState } from './thunks/relationalSidebarThunks';

const initialState = {
  departments: [],
  assistants: [],
  selectedDepartment: null,
  selectedAssistant: null,
  contextData: {},
  notifications: [],
  loading: false,
  error: null,
};

const relationalSidebarSlice = createSlice({
  name: 'relationalSidebar',
  initialState,
  extraReducers: (builder) => {
    // fetchDepartments
    builder
      .addCase(thunks.fetchDepartments.pending, handlePendingState)
      .addCase(thunks.fetchDepartments.fulfilled, (state, action) => {
        handleFulfilledState(state);
        state.departments = action.payload;
      })
      .addCase(thunks.fetchDepartments.rejected, handleRejectedState);

    // fetchAssistants
    builder
      .addCase(thunks.fetchAssistants.pending, handlePendingState)
      .addCase(thunks.fetchAssistants.fulfilled, (state, action) => {
        handleFulfilledState(state);
        state.assistants = action.payload.assistants;
      })
      .addCase(thunks.fetchAssistants.rejected, handleRejectedState);

    // ... add more thunk handlers
  },
});

export default relationalSidebarSlice.reducer;
```

**Checklist**:
- [ ] All 9 thunks have pending/fulfilled/rejected handlers
- [ ] State updates correctly on fulfilled
- [ ] Error is set on rejected
- [ ] Loading state works

### Step 2: Update Sidebar Components (Est. 1 hour)

**Files**:
- `src/components/RelationalLeftSidebar.tsx`
- `src/components/RelationalRightSidebar.tsx`
- `src/components/RelationalDashboardLayout.tsx`

**Changes**:
1. Add Redux hooks (useDispatch, useSelector)
2. Dispatch thunks on component mount
3. Use Redux state instead of mock data
4. Show loading/error states
5. Handle real data updates

**Example**:
```javascript
function RelationalLeftSidebar() {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    state => state.relationalSidebar
  );

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  if (loading) return <div>Loading departments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sidebar">
      {departments.map(dept => (
        <DepartmentItem key={dept.id} department={dept} />
      ))}
    </div>
  );
}
```

**Checklist**:
- [ ] Components dispatch thunks on mount
- [ ] Redux state used instead of mock data
- [ ] Loading states displayed
- [ ] Error states handled
- [ ] No console errors

### Step 3: Test Complete Flow (Est. 1 hour)

1. **Start Application**:
   ```bash
   npm start
   ```

2. **Verify Initial Load**:
   - [ ] Departments load in left sidebar
   - [ ] Assistants load in right sidebar
   - [ ] No console errors
   - [ ] Data is correct

3. **Test Interactions**:
   - [ ] Click department → filters assistants
   - [ ] Click assistant → loads context data
   - [ ] Send notification → badge updates
   - [ ] All transitions are smooth

4. **Check Network**:
   - [ ] DevTools Network tab shows API calls
   - [ ] Requests have correct URL and method
   - [ ] Responses have correct status codes
   - [ ] No CORS errors

5. **Verify Error Handling**:
   - [ ] Invalid department → error displayed
   - [ ] Missing assistant → error displayed
   - [ ] Network error → handled gracefully

---

## Pre-Deployment Checklist

### Code Quality

- [x] All functions have proper error handling
- [x] Validation middleware in place
- [x] Logging for debugging
- [x] JSDoc comments on all functions
- [ ] Unit tests written (TODO)
- [ ] Integration tests written (TODO)

### Security

- [ ] Input validation on all endpoints
- [ ] No sensitive data in logs
- [ ] CORS configured for security
- [ ] Rate limiting configured
- [ ] Authentication prepared

### Performance

- [ ] Response times < 200ms
- [ ] No N+1 queries
- [ ] Caching strategy planned
- [ ] Database indexes planned

### Documentation

- [x] API endpoints documented
- [x] Test cases documented
- [x] Integration guide provided
- [x] Deployment guide (this document)

---

## Deployment Steps

### 1. Local Testing (Current)

```bash
# Start backend
npm run dev

# In another terminal, start frontend
npm start

# Run manual tests from PHASE_2_QUICK_REFERENCE.md
```

### 2. Staging Deployment

```bash
# Build frontend
npm run build

# Start backend with production settings
NODE_ENV=production npm start

# Run performance tests
ab -n 1000 -c 10 http://localhost:3000/api/relational-sidebar/departments
```

### 3. Production Deployment

```bash
# Update environment variables
export REACT_APP_API_URL=https://api.whitecaves.com
export NODE_ENV=production
export DATABASE_URL=mongodb://...

# Deploy to production
npm run deploy
```

---

## Rollback Plan

If issues occur in production:

1. **Quick Rollback**: 
   ```bash
   git revert <commit-hash>
   npm start
   ```

2. **Data Issues**: 
   - Check database logs
   - Verify backup
   - Restore if needed

3. **Performance Issues**:
   - Check server logs
   - Review database queries
   - Increase server resources if needed

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check API health
curl http://localhost:3000/api/relational-sidebar/health

# Monitor logs
tail -f logs/api.log

# Check error rate
grep ERROR logs/api.log | wc -l
```

### Performance Monitoring

- Response time tracking
- Error rate monitoring
- Database query performance
- Memory usage tracking
- API call frequency

### Alerts

Set up alerts for:
- API down (HTTP 500 errors)
- Response time > 500ms
- Error rate > 1%
- Database connection failures

---

## Post-Deployment Validation

### Day 1
- [ ] All endpoints responding correctly
- [ ] No 500 errors in logs
- [ ] Performance metrics normal
- [ ] Users can access features
- [ ] No database issues

### Week 1
- [ ] Stability maintained
- [ ] No memory leaks
- [ ] All features working
- [ ] User feedback collected
- [ ] Performance baseline established

---

## Success Criteria

### Phase 2 Complete When:

✅ All 6 API endpoints tested and working
✅ Redux integration complete and tested
✅ Frontend components updated and working
✅ Error handling verified
✅ Performance acceptable
✅ Code committed and documented
✅ Deployment checklist complete

---

## Timeline Estimate

| Task | Duration | Status |
|------|----------|--------|
| API Endpoint Testing | 2-3 hours | ⏳ Next |
| Redux Integration | 1-2 hours | ⏳ Next |
| Component Updates | 1-2 hours | ⏳ Next |
| Integration Testing | 1-2 hours | ⏳ Next |
| Deployment Prep | 1 hour | ⏳ Next |
| **Total** | **6-10 hours** | - |

---

## Support & Contacts

### For Issues
1. Check `plans/PHASE_2_API_TESTING_GUIDE.md` - Debugging section
2. Review logs: `tail -f logs/api.log`
3. Check GitHub issues
4. Contact development team

### Documentation
- [Phase 2 Quick Reference](PHASE_2_QUICK_REFERENCE.md)
- [Phase 2 API Testing Guide](PHASE_2_API_TESTING_GUIDE.md)
- [Phase 2 Progress Report](PHASE_2_PROGRESS_REPORT.md)
- [Phase 2 Implementation Summary](PHASE_2_IMPLEMENTATION_SUMMARY.md)

---

## Document Info

- **Created**: 2024-01-20
- **Type**: Integration & Deployment Guide
- **Phase**: 2 (Backend API Integration)
- **Status**: Ready for Integration
- **Next**: Execute integration steps

---

## Sign-off

- [ ] Backend API Implementation: ✅ Complete
- [ ] Testing Plan: ✅ Complete
- [ ] Integration Guide: ✅ Complete
- [ ] Deployment Guide: ✅ Complete

**Ready to proceed with integration testing.**
