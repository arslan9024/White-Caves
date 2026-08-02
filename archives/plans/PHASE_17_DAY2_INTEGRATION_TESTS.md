# Phase 17 Day 2: Integration Tests & Component Tests Plan

**Status**: 🚀 **READY TO EXECUTE**  
**Date**: Session 11 - Immediate Next Phase  
**Target**: +25 new integration & component tests (84 → ~109 tests total)  
**Pass Rate Target**: 100% (109/109)

---

## Part 1: Integration Tests (12–15 tests)

### 1.1 API Service Integration Tests (`src/__tests__/api/client.integration.test.ts`)
Tests for HttpClient service with real axios calls (using msw or fetch mocks).

**Tests to Create** (5 tests):
1. ✅ `should fetch clients with filters` - Client list with pagination
2. ✅ `should create client with validation` - Client creation with server-side validation
3. ✅ `should update client data` - Client update with partial data
4. ✅ `should delete client` - Client deletion with cascade handling
5. ✅ `should handle API errors gracefully` - Error response handling

**File**: `src/__tests__/api/client.integration.test.ts` (~300 lines)

---

### 1.2 Redux + API Integration Tests (`src/__tests__/integration/commissions.integration.test.ts`)
Tests Redux thunks with mocked API responses.

**Tests to Create** (5 tests):
1. ✅ `should dispatch fetchCommissions thunk` - Redux async thunk
2. ✅ `should update redux state on success` - State mutation validation
3. ✅ `should handle thunk rejection` - Error state management
4. ✅ `should dispatch multiple thunks in sequence` - Async action chaining
5. ✅ `should prevent concurrent fetches` - Loading state protection

**File**: `src/__tests__/integration/commissions.integration.test.ts` (~350 lines)

---

### 1.3 Storage + API Integration Tests (`src/__tests__/integration/persistence.integration.test.ts`)
Tests localStorage/sessionStorage with API synchronization.

**Tests to Create** (4 tests):
1. ✅ `should persist commission data to localStorage` - Storage write
2. ✅ `should restore commission data from localStorage` - Storage read
3. ✅ `should sync localStorage with API changes` - Bidirectional sync
4. ✅ `should clear storage on logout` - Cleanup on auth state change

**File**: `src/__tests__/integration/persistence.integration.test.ts` (~250 lines)

---

## Part 2: Component Tests (10–12 tests)

### 2.1 CommissionCard Component Tests (`src/components/modules/__tests__/CommissionCard.test.tsx`)
Tests rendering, interactions, and state management.

**Tests to Create** (4 tests):
1. ✅ `should render commission data` - Props rendering
2. ✅ `should open detail modal on click` - Navigation/modal trigger
3. ✅ `should dispatch delete action` - Redux integration
4. ✅ `should show loading state` - Async state handling

**File**: `src/components/modules/__tests__/CommissionCard.test.tsx` (~300 lines)

---

### 2.2 CommissionForm Component Tests (`src/components/modules/__tests__/CommissionForm.test.tsx`)
Tests form submission, validation, and field management.

**Tests to Create** (4 tests):
1. ✅ `should render all form fields` - Form structure
2. ✅ `should validate required fields` - Validation rules
3. ✅ `should submit form with valid data` - Form submission
4. ✅ `should show validation errors` - Error display

**File**: `src/components/modules/__tests__/CommissionForm.test.tsx` (~350 lines)

---

### 2.3 ClientEditModal Component Tests (`src/components/modules/__tests__/ClientEditModal.test.tsx`)
Tests modal interactions, form submission, and Redux dispatch.

**Tests to Create** (3 tests):
1. ✅ `should render modal with client data` - Data population
2. ✅ `should dispatch update action on submit` - Redux dispatch
3. ✅ `should call onClose callback` - Modal closure

**File**: `src/components/modules/__tests__/ClientEditModal.test.tsx` (~250 lines)

---

## Execution Order

```
Day 2 Timeline:
├─ 09:00-10:00 → Create API integration tests (client.integration.test.ts)
├─ 10:00-11:00 → Create Redux integration tests (commissions.integration.test.ts)
├─ 11:00-12:00 → Create storage integration tests (persistence.integration.test.ts)
├─ 12:00-13:00 → LUNCH/BREAK
├─ 13:00-14:00 → Create CommissionCard component tests
├─ 14:00-15:00 → Create CommissionForm component tests
├─ 15:00-16:00 → Create ClientEditModal component tests
└─ 16:00-17:00 → Fix any failing tests + documentation
```

---

## Test Files to Create

| File | Lines | Tests | Type |
|------|-------|-------|------|
| `src/__tests__/api/client.integration.test.ts` | 300 | 5 | API Integration |
| `src/__tests__/integration/commissions.integration.test.ts` | 350 | 5 | Redux Integration |
| `src/__tests__/integration/persistence.integration.test.ts` | 250 | 4 | Storage Integration |
| `src/components/modules/__tests__/CommissionCard.test.tsx` | 300 | 4 | Component |
| `src/components/modules/__tests__/CommissionForm.test.tsx` | 350 | 4 | Component |
| `src/components/modules/__tests__/ClientEditModal.test.tsx` | 250 | 3 | Component |
| **TOTAL** | **1,800** | **25** | **Mixed** |

---

## Expected Outcomes

✅ **84 → 109 tests** (+25 new tests, 30% growth)  
✅ **All passing** (100% pass rate target)  
✅ **Coverage increase** to ~3.5% of codebase  
✅ **Full component-to-redux integration** verified  
✅ **API layer** fully tested with mocks  
✅ **Storage persistence** verified

---

## Success Criteria

- [ ] All 25 new tests created
- [ ] All 109 tests passing
- [ ] 0 TypeScript errors
- [ ] 0 import errors
- [ ] Covered: API → Redux → Storage → UI flow
- [ ] Component interactions fully tested

---

## Next Steps (Day 3)

After Day 2 completion:
- **Day 3**: E2E tests with Playwright (target: +20 tests)
  - Homepage flows
  - Commission tracking flows
  - Client management flows
  - Auth flows

Total by end of Phase 17: **~129 tests** (284% growth from baseline of 22)

---

**Ready to proceed?** → Execute when user confirms.
