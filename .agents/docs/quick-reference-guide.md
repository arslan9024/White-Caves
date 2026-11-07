# Quick Reference Guide - White Caves Dashboard

**Last Updated:** January 21, 2026  
**Current Status:** Phase 3 Complete ✅ | Phase 4 In Progress 🚀 (40% overall)

---

## 🚀 Quick Start

### Start Development Server

```bash
npm run dev
# Server runs at http://localhost:5000/
```

### Build for Production

```bash
npm run build
# Output: dist/
```

### Run Tests

```bash
npm run test
# Vitest test runner
```

### Run E2E Tests

```bash
npm run test:e2e
# Cypress test runner
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard layouts
│   ├── departmentViews/    # 10 department view components
│   ├── sidebars/           # 8 sidebar variants
│   └── shared/             # 12 reusable components
├── mocks/                  # Mock API data & handler
│   ├── departmentData.ts   # 10 departments data
│   └── apiHandler.ts       # 7 API endpoints
├── hooks/
│   └── useApi.ts           # 6 custom hooks
├── config/
│   ├── departmentMetadata.ts  # Department icons/colors
│   └── departmentViewConfigs.ts
├── redux/
│   └── slices/
│       └── relationalSidebarSlice.js  # Main Redux slice
└── pages/
    └── DashboardPage.tsx   # Main page

plans/                       # Documentation
├── PHASE_3_MOCK_API_SUMMARY.md
├── PHASE_4_SIDEBAR_CONTENT_GUIDE.md
├── IMPLEMENTATION_STATUS_JAN_21_2026.md
└── SESSION_SUMMARY_JAN_21_2026.md
```

---

## 🔑 Key Technologies

| Stack             | Version | Purpose          |
| ----------------- | ------- | ---------------- |
| React             | 18+     | UI Framework     |
| TypeScript        | 5+      | Type Safety      |
| Redux Toolkit     | Latest  | State Management |
| Vite              | 7+      | Build Tool       |
| styled-components | Latest  | Styling          |
| Vitest            | Latest  | Unit Testing     |
| Cypress           | Latest  | E2E Testing      |

---

## 📚 Key Files

### Mock API

- **Data:** `src/mocks/departmentData.ts` (1000+ LOC)
- **Handler:** `src/mocks/apiHandler.ts` (500+ LOC)
- **Endpoints:** 7 total (fetch, search, export, etc.)

### React Hooks

- **File:** `src/hooks/useApi.ts`
- **Hooks:** 6 total (all data fetching)
- **Usage:** `const { data, loading, error } = useFetchDepartmentData('SALES')`

### Components

- **Sidebars:** `src/components/sidebars/` (8 variants)
- **Views:** `src/components/departmentViews/` (10 views, all use BaseDepartmentView)
- **Shared:** `src/components/shared/` (12 components)
- **Main Layout:** `src/components/dashboard/RelationalDashboardLayout.tsx`

### Redux

- **Slice:** `src/redux/slices/relationalSidebarSlice.js` (348 LOC)
- **Thunk:** `fetchDepartmentData` - Uses mock API handler
- **State:** department, assistant, context, notifications, history

### Configuration

- **Metadata:** `src/config/departmentMetadata.ts` (icons, colors, services)
- **View Config:** `src/config/departmentViewConfigs.ts` (department configs)

---

## 🔄 Data Flow

```
User Action (Click Department)
    ↓
Redux Action (setSelectedDepartment)
    ↓
Component subscribes to Redux state
    ↓
useSelector gets data from Redux
    ↓
Mock API Handler called
    ↓
Mock Data returned (with 300-500ms delay)
    ↓
Redux state updated
    ↓
Component renders with new data
```

### Real API Flow (Future)

```
Just replace apiHandler.ts with real fetch() calls
No component changes needed
All Redux/hooks remain same
```

---

## 🎯 Department Overview

### 10 Departments (Complete)

1. **SALES** (📈) - Sales pipeline, leads, contracts
2. **FINANCE** (💰) - Revenue, expenses, budgets
3. **EXECUTIVE** (👔) - Strategy, board reports
4. **OPERATIONS** (⚙️) - Tasks, logistics, efficiency
5. **PROPERTY_MANAGEMENT** (🏢) - Properties, tenants, maintenance
6. **COMPLIANCE** (✅) - Audit, KYC, regulations
7. **ANALYTICS** (📊) - Reports, dashboards, insights
8. **TECHNOLOGY** (💻) - Infrastructure, systems, security
9. **MARKETING** (📢) - Campaigns, leads, engagement
10. **HR** (👥) - Employees, payroll, recruitment

### KPI Example

```typescript
{
  label: 'Total Leads',
  value: 342,
  change: 12,
  unit: '+12% vs last week'
}
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
# Test suite: test/mocks/api.test.ts (60+ tests)
```

### E2E Tests

```bash
npm run test:e2e
# Tests: test/e2e/*.cy.ts (Cypress)
```

### Available Test Cases

- API handler tests
- Data consistency tests
- Performance tests
- Error handling tests
- Component integration tests

---

## 🛠️ Common Tasks

### Add New Department View

1. Create component in `src/components/departmentViews/`
2. Use `BaseDepartmentView` as base
3. Provide config object:

```typescript
const config = {
  departmentCode: 'SALES',
  departmentName: 'Sales & Leasing',
  apiBasePath: '/api/sales',
  defaultService: 'lead-pipeline',
};
```

4. Provider `kpiRenderer` and `contentRenderer` functions

### Fetch Department Data

```typescript
// In component
const { data, loading, error, refetch } = useFetchDepartmentData('SALES');

// Render
{loading && <LoadingState />}
{error && <ErrorState error={error} onRetry={refetch} />}
{data && <DataCardGrid>{renderKPIs(data)}</DataCardGrid>}
```

### Search Sidebar

```typescript
<SidebarSearch
  onSearch={(query) => setSearchQuery(query)}
  onClear={() => setSearchQuery('')}
/>
```

### Get Department Metadata

```typescript
import { getDepartmentMetadata } from '@/config/departmentMetadata';

const metadata = getDepartmentMetadata('SALES');
// Returns: { code, name, icon, emoji, color, services }
```

---

## 📊 Current Metrics

| Metric               | Value      |
| -------------------- | ---------- |
| **Components**       | 42         |
| **Departments**      | 10         |
| **Sidebars**         | 8 variants |
| **API Endpoints**    | 7          |
| **Custom Hooks**     | 6          |
| **State Components** | 4          |
| **Test Cases**       | 60+        |
| **Build Time**       | 10.69s     |
| **Bundle Size**      | 287 KB     |
| **Lines of Code**    | 8,500+     |

---

## 🔍 Debugging

### Redux DevTools

```typescript
// Open Redux DevTools in browser
// Action history, time travel, state inspection
```

### Vite Dev Tools

```
Press: h + enter (in terminal)
Shows: HMR status, server info
```

### Console Logging

```typescript
// Redux state
store.getState();

// Dispatch action
store.dispatch(setSelectedDepartment('SALES'));

// Mock data
getMockDepartmentData('SALES');
```

---

## 📝 Documentation Files

### Phase Documentation

- **Phase 1:** Core Architecture (Complete)
- **Phase 2:** Sidebar System (Complete)
- **Phase 3:** Mock API & State (Complete) → `PHASE_3_MOCK_API_SUMMARY.md`
- **Phase 4:** Sidebar Enhancements (In Progress) → `PHASE_4_SIDEBAR_CONTENT_GUIDE.md`
- **Phase 5:** Real API Integration (Planned)
- **Phase 6:** Production & Deploy (Planned)

### Reference Documents

- `IMPLEMENTATION_STATUS_JAN_21_2026.md` - Current status
- `SESSION_SUMMARY_JAN_21_2026.md` - This session's work
- `README.md` - Project overview

---

## 🚀 Next Steps (Priority Order)

### Immediate (0-2 hours)

- [ ] Run test suite: `npm run test`
- [ ] Fix any failing tests
- [ ] Review test coverage

### Short-term (2-6 hours)

- [ ] Add department icons to sidebars
- [ ] Implement active state styling
- [ ] Create KPI card renderers
- [ ] Populate views with mock data

### Medium-term (6-12 hours)

- [ ] Add responsive design
- [ ] Implement dark mode
- [ ] Create E2E tests
- [ ] Add data visualizations

### Long-term (1-3 days)

- [ ] Real API integration
- [ ] Authentication improvements
- [ ] Performance optimization
- [ ] Production deployment

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Cypress)
npm run test:ui          # Vitest UI

# Git
git log --oneline -10    # View recent commits
git status               # Check status
git add .                # Stage changes
git commit -m "..."      # Commit
git push origin main     # Push to GitHub

# Utilities
npm run type-check       # TypeScript check
npm list                 # Dependencies
npm outdated             # Check outdated packages
```

---

## 🆘 Troubleshooting

### Issue: Port 5000 already in use

```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors

```bash
# Check types
npx tsc --noEmit

# Generate declaration files
npx tsc --declaration
```

### Issue: Build fails

```bash
# Clear node_modules
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Issue: Tests not running

```bash
# Install test dependencies
npm install vitest cypress --save-dev

# Run with verbose output
npm run test -- --reporter=verbose
```

---

## 📞 Support Resources

**GitHub:** https://github.com/arslan9024/White-Caves  
**Dev Server:** http://localhost:5000/  
**Dashboard:** http://localhost:5000/dashboard

**Key Contacts:**

- Project Owner: [Name]
- Lead Developer: [Name]
- Tech Lead: [Name]

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] No console errors
- [ ] Build successful
- [ ] Performance acceptable
- [ ] Accessibility audit passed
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Git history clean
- [ ] Environment variables configured
- [ ] Monitoring setup

---

## 🎓 Learning Resources

### Project-Specific

- `plans/PHASE_3_MOCK_API_SUMMARY.md` - API system explanation
- `plans/PHASE_4_SIDEBAR_CONTENT_GUIDE.md` - Frontend patterns
- Component files with JSDoc comments

### External

- [React Docs](https://react.dev/)
- [Redux Docs](https://redux.js.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)

---

## ✅ Checklist for New Developer

Getting started:

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Read `README.md`
- [ ] Review `plans/IMPLEMENTATION_STATUS_JAN_21_2026.md`
- [ ] Read this quick reference guide
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:5000/dashboard
- [ ] Review mock data in `src/mocks/`
- [ ] Explore Redux state with DevTools
- [ ] Run tests: `npm run test`

---

**Quick Reference Created:** January 21, 2026  
**Last Updated:** January 21, 2026  
**Next Update:** As new features are added
