# PHASE 2: TEST COVERAGE - ACTION PLAN

## Overview
Phase 2 focuses on implementing comprehensive test coverage for all UI components, dashboard pages, and user workflows. This ensures the platform is production-hardened and ready for user acceptance testing.

## Phase 2 Objectives

### 1. Unit Tests (3-4 hours)
**Goal**: Test all UI components and utility functions in isolation

**Components to Test**:
```
src/components/ui/
├─ Badge.tsx              ← Test all variants (success, warning, error, etc.)
├─ Alert.tsx              ← Test alert types and dismiss behavior
├─ Pagination.tsx         ← Test page navigation, total pages calc
├─ Dropdown.tsx           ← Test open/close, selection, keyboard nav
├─ Modal.tsx              ← Test open/close, buttons, backdrop click
├─ Tooltip.tsx            ← Test positioning, hover, arrow
├─ Tabs.tsx               ← Test tab switching, content rendering
├─ Toast.tsx              ← Test message display, auto-dismiss
├─ Spinner.tsx            ← Test sizes, colors
├─ ProgressBar.tsx        ← Test progress value, colors
└─ Popover.tsx            ← Test content, position, close
```

**Hooks to Test**:
```
src/context/
├─ useToast.tsx           ← Test toast dispatch, queuing
└─ ToastContext.tsx       ← Test context provider
```

**Testing Framework**: Vitest
**Assertion Library**: @testing-library/react

### 2. Integration Tests (3-4 hours)
**Goal**: Test components working together in dashboard pages

**Pages to Test**:
```
src/pages/
└─ UnifiedDashboardPage.tsx
   ├─ Test tab switching
   ├─ Test role-based rendering
   ├─ Test component interaction
   └─ Test state management

src/components/owner/tabs/
├─ PropertiesTab.tsx
│  ├─ Test pagination functionality
│  ├─ Test badge rendering
│  ├─ Test filter + pagination reset
│  └─ Test table interaction
├─ LeadsTab.tsx
│  ├─ Test multi-filter support
│  ├─ Test pagination with filters
│  └─ Test action callbacks
└─ ContractsTab.tsx
   ├─ Test contract filtering
   ├─ Test pagination
   └─ Test action callbacks

src/components/admin/
└─ AdminDashboard.tsx
   ├─ Test alert display
   ├─ Test pagination
   └─ Test form interactions

src/components/crm/
└─ ClaraLeadsCRM_NEW/
   ├─ Test tab navigation
   └─ Test lead management
```

### 3. E2E Tests (4-5 hours)
**Goal**: Test complete user workflows and journeys

**Critical User Flows**:
```
1. Dashboard Navigation
   ├─ User logs in
   ├─ Navigates to different dashboard sections
   ├─ Switches tabs
   └─ Views different pages

2. Property Management
   ├─ View property list
   ├─ Filter properties
   ├─ Paginate through results
   └─ View property details

3. Lead Management
   ├─ View leads list
   ├─ Filter by source/status/priority
   ├─ Paginate through leads
   ├─ Assign lead to agent
   └─ Call/WhatsApp lead

4. Contract Management
   ├─ View contracts
   ├─ Filter by type/status
   ├─ Paginate through contracts
   ├─ View contract details
   └─ Download contract PDF

5. User Management
   ├─ View users
   ├─ Paginate through users
   ├─ View user details
   └─ Manage permissions

6. Toast Notifications
   ├─ Trigger success toast
   ├─ Trigger error toast
   ├─ Auto-dismiss behavior
   └─ Multiple toasts stacking
```

**Testing Framework**: Playwright
**Test Files**:
```
e2e/
├─ dashboard.spec.ts
├─ properties.spec.ts
├─ leads.spec.ts
├─ contracts.spec.ts
├─ users.spec.ts
└─ notifications.spec.ts
```

### 4. Accessibility Tests (2-3 hours)
**Goal**: Ensure platform is WCAG 2.1 AA compliant

**Components to Audit**:
- All UI components
- Dashboard pages
- Form inputs
- Modal dialogs
- Dropdown menus
- Pagination controls

**Testing Tools**: 
- axe DevTools
- Lighthouse
- WAVE

**Key Areas**:
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast ratios
- ✅ ARIA labels
- ✅ Semantic HTML

## Phase 2 Execution Timeline

### Day 1: Unit Tests (4 hours)
```
Morning (2 hours):
├─ Set up test infrastructure
├─ Configure Vitest settings
├─ Create test utilities
└─ Write first component test

Afternoon (2 hours):
├─ Write tests for all UI components
├─ Test badge variants
├─ Test pagination logic
└─ Test toast context
```

### Day 2: Integration Tests (4 hours)
```
Morning (2 hours):
├─ Test UnifiedDashboardPage
├─ Test PropertiesTab functionality
└─ Test pagination + filtering

Afternoon (2 hours):
├─ Test LeadsTab workflows
├─ Test ContractsTab workflows
├─ Test AdminDashboard
└─ Verify all integrations
```

### Day 3: E2E Tests (5 hours)
```
Morning (2 hours):
├─ Set up Playwright
├─ Create test utilities
└─ Write dashboard navigation tests

Midday (1.5 hours):
├─ Write property management E2E
├─ Write lead management E2E
└─ Write contract management E2E

Afternoon (1.5 hours):
├─ Write user management E2E
├─ Write toast notification E2E
├─ Run full test suite
└─ Fix any failures
```

### Day 4: Accessibility + Final Validation (3-4 hours)
```
Morning (2 hours):
├─ Run accessibility audits
├─ Fix keyboard navigation issues
├─ Verify ARIA labels
└─ Test screen reader

Afternoon (1-2 hours):
├─ Run Lighthouse audits
├─ Optimize performance
├─ Create accessibility report
└─ Final build verification
```

## Phase 2 Deliverables

### Test Files (What to Create)
```
__tests__/
├─ components/
│  └─ ui/
│     ├─ Badge.test.tsx
│     ├─ Alert.test.tsx
│     ├─ Pagination.test.tsx
│     ├─ Modal.test.tsx
│     ├─ Tabs.test.tsx
│     ├─ Toast.test.tsx
│     └─ [other components].test.tsx
├─ hooks/
│  └─ useToast.test.ts
└─ pages/
   ├─ UnifiedDashboardPage.test.tsx
   └─ [other pages].test.tsx

e2e/
├─ dashboard.spec.ts
├─ properties.spec.ts
├─ leads.spec.ts
├─ contracts.spec.ts
├─ users.spec.ts
└─ notifications.spec.ts
```

### Documentation Files (What to Create)
```
docs/
├─ TESTING_GUIDE.md
├─ TEST_PATTERNS.md
├─ E2E_WORKFLOW_GUIDE.md
├─ ACCESSIBILITY_AUDIT_REPORT.md
└─ TEST_COVERAGE_SUMMARY.md
```

### Configuration Updates
```
vitest.config.js         ← Unit test configuration
playwright.config.ts     ← E2E test configuration
.github/workflows/       ← CI/CD test automation
```

## Test Coverage Goals

### Target Metrics
```
Overall Coverage:    80%+ ✅
Components:          90%+ ✅
Pages:              75%+ ✅
Hooks:              95%+ ✅
Critical Flows:     100% ✅
```

## Quick Start Commands

### After Phase 2 Implementation
```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y

# Generate coverage report
npm run test:coverage
```

## Phase 2 Success Criteria

### Must Have ✅
- [ ] All UI components have unit tests (>90% coverage)
- [ ] All dashboard pages have integration tests
- [ ] Critical user flows are E2E tested
- [ ] No TypeScript errors in tests
- [ ] All tests passing

### Should Have ✅
- [ ] Accessibility audit completed (WCAG 2.1 AA)
- [ ] Performance tests showing good metrics
- [ ] Test documentation for team
- [ ] CI/CD pipeline with automated tests

### Nice to Have ✅
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Load testing
- [ ] Security audit

## Phase 2 Dependencies

**Already Installed**:
- ✅ Vitest
- ✅ Playwright
- ✅ @testing-library/react
- ✅ @testing-library/user-event

**May Need to Install**:
```bash
npm install --save-dev axe-core axe-playwright @axe-core/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/react-hooks
```

## Phase 2 Resource Links

### Testing Documentation
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library Docs](https://testing-library.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Test Examples
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Playwright Test Patterns](https://playwright.dev/docs/best-practices)
- [Accessibility Testing Guide](https://www.deque.com/blog/automated-accessibility-features-in-axe/)

## Phase 2 Transition Notes

**When Phase 1 is Complete:**
1. ✅ Create /tests directory structure
2. ✅ Set up test configuration files
3. ✅ Write first batch of unit tests
4. ✅ Document testing patterns
5. ✅ Train team on testing approach

**Success Indicators:**
- ✅ Build passes with all tests
- ✅ Test coverage above 80%
- ✅ All critical flows covered
- ✅ Accessibility audit passed
- ✅ Zero test flakiness

## Phase 3 Preview: Commission Tracking

After Phase 2, Phase 3 will implement:
- ✅ Commission calculation engine
- ✅ Commission tracking dashboard
- ✅ Commission payment workflows
- ✅ Commission reporting
- ✅ Financial integration

---
*Phase 2: Test Coverage - Ready to Execute*
*Estimated Duration: 3-4 days*
*Production Impact: High (ensures platform stability)*
