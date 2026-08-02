# Session 12 - Quick Reference: 9 Remaining Failing Routes

**Total Tests Remaining**: 864/1,210 (863 failures across 9 routes)  
**Session 11 Outcome**: 346/1,210 PASSING (Cycles 1-11 complete)  
**Target for Session 12**: 1,210/1,210 PASSING (100%)

---

## Priority 1: CRITICAL BLOCKERS (Fix First)

### 1. Compliance Routes (54 FAILURES - ALL 404)

**File**: `server/routes/compliance.test.ts`  
**Status**: All endpoints return 404 (router not populating)

**Mocks Already Applied**:

- ✅ mockPrisma (property, lead, user, activity)
- ✅ mockLogger (dual-interface)
- ✅ requirePermission + requireMinRole
- ✅ complianceService
- ✅ permitAlertScheduler

**What to Debug**:

1. Check if router is even loading (may have silent error during route definition)
2. Add console.log to first route handler to verify it's executing
3. Check if requirePermission middleware is blocking all requests
4. Verify Prisma collection mocks are being used correctly

**Quick Fix Template**:

```typescript
// Add this test first to verify router loads:
it('router should load without errors', () => {
  const res = request(createApp('owner')).get('/api/compliance');
  // Should return 200 or 403, NOT 404
});

// If still 404, add console.log to route handler:
router.get(
  '/api/compliance/status',
  requirePermission('view_analytics'),
  asyncHandler(async (req, res) => {
    console.log('Route handler executing'); // Debug line
    // ... rest of handler
  })
);
```

---

### 2. Contracts Routes (IMPORT ERROR)

**File**: `server/routes/contracts.test.ts`  
**Status**: Import fails during test collection

**Error**:

```
Error: Failed to resolve import "../lib/googleDrive.js" from "server/routes/contracts.js"
```

**Root Cause**: Legacy code path to non-existent file

**Quick Fix**:

1. Check `server/routes/contracts.ts` line 4
2. Identify current Google Drive integration module (likely in `server/services/` or `server/integrations/`)
3. Update import path in contracts.ts
4. Add corresponding mock to contracts.test.ts

**Files to Check**:

- `server/lib/googleDrive.js` - Does this exist? If not, find where it moved to
- `server/services/` - Look for GoogleDriveService or similar
- `server/integrations/` - Check for Google integration

---

## Priority 2: EASY FIXES (Minor Issues)

### 3. Viewings Routes (3 FAILURES)

**File**: `server/routes/viewings.test.ts`  
**Status**: Route loads, but validation too strict

**Failures**:

1. POST /api/viewings (valid data) - Expecting 201, got 400
   - Test sends: `{propertyId: 'prop-1', scheduledAt: '2026-06-15T10:00:00Z'}`
   - Route validation might require additional fields
2. POST /api/viewings (no leadId) - Expecting 201, got 400
   - Test expects auto-lead creation, route requires different logic
3. POST /api/viewings (non-existent property) - Expecting 404, got 400
   - Route checking property existence with wrong status code

**Quick Fix**:

1. Check POST handler in `server/routes/viewings.ts`
2. Add any required fields to test data (e.g., durationMinutes, type)
3. Fix property existence check to return 404 instead of 400
4. Mock mockPrisma.property.findUnique to return null for non-existent

---

## Priority 3: ANALYZE & FIX (Unknown Issues)

### Routes 4-9 (7 files, 6 total failures)

**Files to Run & Debug**:

```bash
npm run test:run -- server/routes/assistants.test.ts
npm run test:run -- server/routes/media.test.ts
npm run test:run -- server/routes/nadia.test.ts
npm run test:run -- server/routes/henry.routes.test.ts
npm run test:run -- server/routes/linda.routes.test.ts
npm run test:run -- server/routes/transactions.test.ts
```

**When Running Each**:

1. Note exact error messages
2. Check if it's a 404 (router not loading) or specific validation error
3. Apply appropriate fix pattern:
   - **404**: Same as compliance → debug route loading
   - **Validation error**: Same as viewings → update test data
   - **Import error**: Same as contracts → fix legacy paths
   - **Mock missing**: Copy mock pattern from leases/properties

---

## Proven Solution Patterns

### Pattern A: Logger Import-Time Fix

**When**: Module fails to load because logger isn't mocked  
**Solution**:

```typescript
vi.mock('../utils/logger.js', () => ({
  default: mockLogger,
  createLogger: mockLogger.createLogger,
  logger: mockLogger,
}));
```

### Pattern B: RBAC Middleware Fix

**When**: All requests returning 403/401  
**Solution**:

```typescript
requirePermission: permission => (req, res, next) => {
  if (!req.user) return res.status(403).json({ success: false, error: 'Unauthorized' });
  // ... rest of permission check
};
```

### Pattern C: Import Path Fix

**When**: Test collection fails with "Cannot find module"  
**Solution**:

1. Find current module location
2. Update import path in route file
3. Add vi.mock() in test file referencing new path

### Pattern D: Validation Error Fix

**When**: Route returns 400 instead of expected status  
**Solution**:

1. Check route validation logic
2. Update test data to match requirements
3. Or update route to return correct status code

---

## Session 12 Execution Checklist

### Phase 1: Triage (30 min)

- [ ] Run all 9 failing route tests individually
- [ ] Categorize each by error type (404, validation, import, mock)
- [ ] Prioritize by blocker impact

### Phase 2: Fix Priority 1 - Compliance (60 min)

- [ ] Debug why router endpoints aren't populating
- [ ] Add console.log to trace execution
- [ ] Identify and fix root cause
- [ ] Verify all 54 tests pass
- [ ] Commit: compliance.test.ts

### Phase 3: Fix Priority 2 - Contracts (30 min)

- [ ] Find and update correct import paths
- [ ] Add mock for new Google integration module
- [ ] Verify collection succeeds
- [ ] Run tests (should pass or show new failure pattern)
- [ ] Commit: contracts.test.ts

### Phase 4: Fix Priority 2 - Viewings (30 min)

- [ ] Update test data with all required fields
- [ ] Fix property existence check status codes
- [ ] Verify 15/15 tests pass
- [ ] Commit: viewings.test.ts

### Phase 5: Fix Routes 4-9 (2-3 hours)

- [ ] Run each individually
- [ ] Apply appropriate fix pattern
- [ ] Verify all pass
- [ ] Commit each in sequence

### Phase 6: Final Validation (30 min)

- [ ] Run: `npm run test:run -- server/routes/`
- [ ] Verify: 1,210/1,210 PASSING
- [ ] Run: `npm run build`
- [ ] Verify: 10-13s, 0 errors
- [ ] Final commit: "All routes: 1,210/1,210 tests PASSING (100%)"

---

## Commands Reference

### Run Specific Route

```bash
npm run test:run -- server/routes/ROUTENAME.test.ts
```

### Run All Routes

```bash
npm run test:run -- server/routes/
```

### Check Build

```bash
npm run build
```

### Git Commit Format

```bash
git add server/routes/ROUTENAME.test.ts
git commit -m "ROUTENAME: X/X tests PASSING - [description]"
```

---

## Estimated Timeline

- **Compliance (54 failures)**: 60-90 min (hardest, needs debugging)
- **Contracts (import error)**: 20-30 min (straightforward path fix)
- **Viewings (3 failures)**: 20-30 min (minor adjustments)
- **Routes 4-9 (6 failures)**: 30-60 min (once patterns known)
- **Final validation**: 30 min
- **Total**: 3-4 hours → 1,210/1,210 PASSING (100%)

---

## Success Criteria

✅ All 1,210 tests PASSING  
✅ Build: 10-13s, 0 errors  
✅ 15/15 route test files committed  
✅ Production Ready: 100%  
✅ Zero technical debt in test infrastructure

---

**Target Completion**: End of Session 12  
**Current Progress**: 346/1,210 (28.5%) ✅ COMMITTED
