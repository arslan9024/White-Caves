# Phase 4.4.1: NancyHRCRM Tab Refactoring Plan

**Date**: March 8, 2026  
**Priority**: HIGH (31.79 KB, largest CRM component)  
**Duration**: ~2-3 hours  
**Build Status**: Currently ✅ PASSING

## Current State
- **File**: `src/components/crm/NancyHRCRM.jsx`
- **Size**: 31.79 KB (~852 lines)
- **Tabs**: 7 major sections
- **Data**: DUMMY_EMPLOYEES, DUMMY_JOBS, DUMMY_APPLICANTS

## Refactoring Architecture

### Current Monolithic Structure
```
NancyHRCRM.jsx (852 lines)
├── Imports & Lucide Icons
├── DUMMY_EMPLOYEES (5 records)
├── DUMMY_JOBS (3 records)
├── DUMMY_APPLICANTS (3 records)
├── Component State (10+ useState)
├── Helper Functions (3 functions)
├── Tab 1: Employees (search, filter, table, CRUD buttons)
├── Tab 2: Careers/Job Board (job cards, status badges)
├── Tab 3: Applicants (applicant cards, filters)
├── Tab 4: Attendance (attendance table, charts)
├── Tab 5: Performance (performance reviews, score visualization)
├── Tab 6: Post Job (JobPostComposer component)
└── Tab 7: Features (NANCY_FEATURES list)
```

### Target Structure: NancyHRCRM_NEW
```
NancyHRCRM_NEW/
├── index.jsx                          (120 lines) → Tab Router
├── hooks/
│   └── useHRData.js                   (~200 lines) → State Management
├── data/
│   ├── employees.js                   (~80 lines) → DUMMY_EMPLOYEES
│   ├── jobs.js                        (~60 lines) → DUMMY_JOBS
│   ├── applicants.js                  (~60 lines) → DUMMY_APPLICANTS
│   └── features.js                    (~80 lines) → NANCY_FEATURES
├── tabs/
│   ├── EmployeesTab.jsx               (~180 lines) → Employee management
│   ├── JobBoardTab.jsx                (~150 lines) → Job postings
│   ├── ApplicantsTab.jsx              (~140 lines) → Applicant tracking
│   ├── AttendanceTab.jsx              (~120 lines) → Attendance tracking
│   ├── PerformanceTab.jsx             (~150 lines) → Performance reviews
│   ├── PostJobTab.jsx                 (~80 lines) → Job posting composer
│   └── FeaturesTab.jsx                (~100 lines) → Features matrix
├── NancyHRCRM.css                     (copied & organized)
└── archive/
    └── NancyHRCRM.backup.jsx          (original)
```

## Implementation Plan

### Stage 1: Setup (15 min)
- [x] Create `NancyHRCRM_NEW/` directory structure
- [x] Create subdirectories: `hooks/`, `data/`, `tabs/`, `archive/`
- [x] Backup original `NancyHRCRM.jsx`

### Stage 2: Extract Data & Hooks (45 min)
- [ ] Create `data/employees.js` - DUMMY_EMPLOYEES
- [ ] Create `data/jobs.js` - DUMMY_JOBS
- [ ] Create `data/applicants.js` - DUMMY_APPLICANTS
- [ ] Create `data/features.js` - NANCY_FEATURES
- [ ] Create `hooks/useHRData.js` - State management (employees, jobs, applicants, search, filters)

### Stage 3: Create Tab Components (90 min)
- [ ] Create `tabs/EmployeesTab.jsx` - Employee table, search, filter, CRUD buttons
- [ ] Create `tabs/JobBoardTab.jsx` - Job cards, status badges, actions
- [ ] Create `tabs/ApplicantsTab.jsx` - Applicant tracking, status progression
- [ ] Create `tabs/AttendanceTab.jsx` - Attendance table, charts, reports
- [ ] Create `tabs/PerformanceTab.jsx` - Performance cards, score visualization, ratings
- [ ] Create `tabs/PostJobTab.jsx` - JobPostComposer wrapper with submit handler
- [ ] Create `tabs/FeaturesTab.jsx` - Feature matrix display

### Stage 4: Create Index Router (15 min)
- [ ] Create `index.jsx` - Tab routing, state management wrapper, header/stats
- [ ] Include Nancy header with activation toggle
- [ ] Include stats display (total employees, active, on leave, positions, applicants)
- [ ] Tab navigation buttons
- [ ] Tab content rendering

### Stage 5: CSS & Styling (15 min)
- [ ] Copy `NancyHRCRM.css` to new structure
- [ ] Verify all class names are correct
- [ ] Test responsive design

### Stage 6: Integration (30 min)
- [ ] Backup old `NancyHRCRM.jsx`
- [ ] Update imports in `AICommandCenter.jsx`
- [ ] Update imports in any other referencing files
- [ ] Delete old `NancyHRCRM.jsx` and `NancyHRCRM.css`
- [ ] Run build verification

### Stage 7: Testing (15 min)
- [ ] Dev server starts without errors
- [ ] All 7 tabs render correctly
- [ ] Employee search/filter works
- [ ] Job board displays correctly
- [ ] Applicants CRUD functions work
- [ ] Performance visualization renders
- [ ] No console errors
- [ ] Build completes successfully

## Expected Outcomes
- **Bundle Size Reduction**: ~15% (1 large file → 7 lazy-loadable tabs)
- **Maintainability**: Each tab isolated, easier to modify
- **Performance**: Lazy-loading on tab switch
- **Code Quality**: Separated concerns, improved testability
- **Build Time**: ~27 seconds (same as other refactors)

## Files to Modify
1. `src/components/crm/AICommandCenter.jsx` → Update lazy import
2. `src/components/crm/data/assistantFeatures.jsx` → Keep NANCY_FEATURES
3. `src/components/crm/shared/JobPostComposer.jsx` → Keep as-is

## Key Decisions
- Lazy-loading via React.lazy() in index.jsx wrapper
- localStorage for employee, job, applicant data persistence
- Keep NANCY_FEATURES in data/features.js (similar to other CRMs)
- Responsive grid/table layout maintained
- All Lucide icons imported as needed

## Success Metrics
- ✅ Build passes with 0 errors
- ✅ All 7 tabs function correctly
- ✅ Data persistence works (localStorage)
- ✅ Responsive design maintained
- ✅ No TypeScript or import errors
- ✅ Dev server runs at localhost:5000

## Risk Mitigation
- Backup original file before starting
- Test each tab component individually before integration
- Verify imports after refactoring
- Keep CSS organized and namespaced
