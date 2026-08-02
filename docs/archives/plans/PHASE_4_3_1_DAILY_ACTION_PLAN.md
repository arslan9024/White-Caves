# Phase 4.3.1: Tab-Based Lazy Loading - Action Plan

**Phase**: 4.3.1 (Weeks 1-2 of Phase 4.3)  
**Start Date**: March 8, 2026  
**Target Completion**: March 22, 2026  
**Focus**: MaryInventoryCRM Tab Refactoring  
**Expected Savings**: 40-60 kB per CRM  

---

## 📋 Day-by-Day Execution Plan

### **WEEK 1: MaryInventoryCRM Refactoring**

#### **Day 1 (Mar 8): Analysis & Planning**
- [ ] Analyze MaryInventoryCRM.jsx structure (124 kB)
  - [ ] Identify all tabs/sections
  - [ ] Map dependencies between tabs
  - [ ] List shared state/hooks
  - [ ] Record current import sizes
- [ ] Create folder structure for tabs
- [ ] Document all features per tab

**Deliverable**: Analysis report showing tab breakdown

#### **Day 2 (Mar 9): Extract Tab 1 - Inventory**
- [ ] Create `src/components/crm/MaryInventoryCRM/tabs/MaryInventoryTab.jsx`
- [ ] Move inventory grid component
- [ ] Move inventory-specific state
- [ ] Create `useInventoryData` custom hook
- [ ] Verify imports resolve
- [ ] Test component renders in isolation

**Deliverable**: Working MaryInventoryTab component

#### **Day 3 (Mar 10): Extract Tab 2 - Analytics**
- [ ] Create analytics tab component
- [ ] Extract analytics-specific hooks
- [ ] Move any chart/visualization imports
- [ ] Test with lazy loading
- [ ] Measure file size reduction

**Deliverable**: Working MaryAnalyticsTab component

#### **Day 4 (Mar 11): Extract Tabs 3-5**
- [ ] Create pricing tab
- [ ] Create reports tab
- [ ] Create settings tab
- [ ] Extract tab-specific utilities

**Deliverable**: All 5 tabs extracted and working

#### **Day 5 (Mar 12): Main Component Wrapper & Testing**
- [ ] Create new `src/components/crm/MaryInventoryCRM/index.jsx` wrapper
- [ ] Implement lazy loading for all tabs
- [ ] Add Suspense boundaries
- [ ] Test tab switching
- [ ] Test first load performance
- [ ] Verify no regressions

**Deliverable**: Working tab-based MaryInventoryCRM with lazy loading

#### **Day 6-7 (Mar 13-14): Cleanup & Optimization**
- [ ] Remove old MaryInventoryCRM.jsx
- [ ] Update all imports across project
- [ ] Extract shared utilities (usePaginatedList, etc.)
- [ ] Add performance monitoring
- [ ] Create comprehensive test coverage
- [ ] Document changes

**Deliverable**: 
- Clean MaryInventoryCRM refactor (60 kB → 40 kB base)
- All tests passing
- Documentation updated

---

### **WEEK 2: Additional CRMs + Consolidation**

#### **Day 8-9 (Mar 15-16): ClaraLeadsCRM (65 kB)**
- [ ] Analyze structure
- [ ] Extract 4 tabs (Overview, Leads, Analytics, Settings)
- [ ] Apply Mary pattern
- [ ] Test thoroughly
- [ ] Target: 65 kB → 30 kB base

#### **Day 10-11 (Mar 17-18): Theodora & Olivia**
- [ ] TheodoraFinanceCRM (35 kB → 18 kB)
- [ ] OliviaMarketingCRM (56 kB → 28 kB)
- [ ] Apply consistent pattern

#### **Day 12-14 (Mar 19-21): Shared Utilities & Testing**
- [ ] Create shared hooks:
  - [ ] `useCRMData.js`
  - [ ] `usePaginatedList.js`
  - [ ] `useModalState.js`
- [ ] Create shared components:
  - [ ] `CRMTable.jsx`
  - [ ] `CRMCard.jsx`
- [ ] Test all 4 CRMs together
- [ ] Full build verification

#### **Day 15 (Mar 22): Documentation & Sign-off**
- [ ] Complete performance analysis
- [ ] Document all changes
- [ ] Create migration guide for remaining CRMs
- [ ] Performance report
- [ ] Sign-off checklist

**Deliverable**: Phase 4.3.1 Complete
- 4 CRMs refactored (100-150 kB savings)
- Shared utilities extracted
- All tests passing
- Full documentation

---

## 🔧 Detailed Implementation Guide

### Step 1: Analyze MaryInventoryCRM Structure

**Run Analysis**:
```bash
# Get file size
ls -lh src/components/crm/MaryInventoryCRM.jsx

# Count lines
wc -l src/components/crm/MaryInventoryCRM.jsx

# Analyze imports
grep "^import" src/components/crm/MaryInventoryCRM.jsx | wc -l
```

**Expected Output**: ~124 kB, ~3,500+ lines, 40+ imports

### Step 2: Create Folder Structure

```bash
mkdir -p src/components/crm/MaryInventoryCRM/{tabs,components,hooks,data}
```

**Structure**:
```
src/components/crm/MaryInventoryCRM/
├── index.jsx                      (NEW - wrapper)
├── MaryInventoryCRM.css           (keep)
├── tabs/
│   ├── MaryInventoryTab.jsx       (NEW)
│   ├── MaryAnalyticsTab.jsx       (NEW)
│   ├── MaryPricingTab.jsx         (NEW)
│   ├── MaryReportsTab.jsx         (NEW)
│   └── MarySettingsTab.jsx        (NEW)
├── components/
│   ├── InventoryGrid.jsx          (MOVE)
│   ├── PricingTable.jsx           (MOVE)
│   └── ExportPanel.jsx            (MOVE)
├── hooks/
│   ├── useInventoryData.js        (EXTRACT)
│   └── usePricingData.js          (EXTRACT)
└── data/
    └── maryFeatures.js            (MOVE/lazy-load)
```

### Step 3: Create Index Wrapper

**File**: `src/components/crm/MaryInventoryCRM/index.jsx`

```javascript
import React, { Suspense, lazy, useState } from 'react';
import SuspenseLoader from '../../../shared/components/ui/SuspenseLoader';
import './MaryInventoryCRM.css';

// Lazy-load all tabs
const InventoryTab = lazy(() => import('./tabs/MaryInventoryTab'));
const AnalyticsTab = lazy(() => import('./tabs/MaryAnalyticsTab'));
const PricingTab = lazy(() => import('./tabs/MaryPricingTab'));
const ReportsTab = lazy(() => import('./tabs/MaryReportsTab'));
const SettingsTab = lazy(() => import('./tabs/MarySettingsTab'));

export default function MaryInventoryCRM({ initialTab = 'inventory' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: 'Package', component: InventoryTab },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp', component: AnalyticsTab },
    { id: 'pricing', label: 'Pricing', icon: 'DollarSign', component: PricingTab },
    { id: 'reports', label: 'Reports', icon: 'FileText', component: ReportsTab },
    { id: 'settings', label: 'Settings', icon: 'Settings', component: SettingsTab },
  ];

  const ActiveTabComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="mary-inventory-crm">
      <MaryInvTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mary-inv-content">
        <Suspense fallback={<SuspenseLoader />}>
          {ActiveTabComponent && <ActiveTabComponent />}
        </Suspense>
      </div>
    </div>
  );
}

// Keep existing tab UI component (minimal)
function MaryInvTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="mary-inv-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

### Step 4: Extract Tab Components

**Example**: `src/components/crm/MaryInventoryCRM/tabs/MaryInventoryTab.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';

// Extract from original file
import InventoryGrid from '../components/InventoryGrid';
import { useInventoryData } from '../hooks/useInventoryData';
import { selectAllInventory } from '../../../../store/maryCRMSlice';

export default function MaryInventoryTab() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const { data, loading, error } = useInventoryData();
  const allItems = useSelector(selectAllInventory);

  useEffect(() => {
    // Load data when tab becomes active
    // (data is already in Redux from route load, but can refresh if needed)
  }, [dispatch]);

  return (
    <div className="mary-inventory-tab">
      {/* Tab toolbar */}
      <div className="tab-toolbar">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button><Filter size={18} /> Filter</button>
        <button><Download size={18} /> Export</button>
        <button><Upload size={18} /> Import</button>
        <button className="btn-primary"><Plus size={18} /> Add Item</button>
      </div>

      {/* Grid/list view */}
      <InventoryGrid data={allItems} loading={loading} searchQuery={searchQuery} />
    </div>
  );
}
```

### Step 5: Create Custom Hook

**File**: `src/components/crm/MaryInventoryCRM/hooks/useInventoryData.js`

```javascript
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllInventory } from '../../../../store/maryCRMSlice';

export function useInventoryData() {
  const dispatch = useDispatch();
  const data = useSelector(selectAllInventory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Optionally fetch fresh data when hook mounts
    // But data is already loaded at route level
    setLoading(false);
  }, [dispatch]);

  return { data, loading, error };
}
```

---

## 📊 Metrics to Capture

### Before Phase 4.3.1
```
MaryInventoryCRM.jsx:    124 kB
├── Tab components:      40 kB
├── Utility functions:   20 kB
├── Redux integration:   15 kB  
├── Modals:              20 kB
├── Data structures:     15 kB
└── Styles:              14 kB
```

### After Phase 4.3.1
```
MaryInventoryCRM/index.jsx:        40 kB (wrapper + base)
├── MaryInventoryTab.jsx:          20 kB (lazy)
├── MaryAnalyticsTab.jsx:          18 kB (lazy)
├── MaryPricingTab.jsx:            17 kB (lazy)
├── MaryReportsTab.jsx:            15 kB (lazy)
├── MarySettingsTab.jsx:           14 kB (lazy)
├── shared/*.js hooks:             -5 kB (shared)
└── MaryInventoryCRM.css:          14 kB (same)
```

**Expected Savings**: ~60 KiB (48% at initial load)

---

## ✅ Sign-Off Checklist

- [ ] All 4 CRMs (Mary, Clara, Theodora, Olivia) refactored
- [ ] All tabs load lazily on click
- [ ] Suspense fallback shows correctly
- [ ] Tab switching is smooth (< 200ms)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All imports resolved
- [ ] Tests passing (53+)
- [ ] Build succeeds
- [ ] Bundle size reduced by 100-150 kB
- [ ] Performance metrics captured
- [ ] Documentation complete
- [ ] Migration guide created for remaining CRMs
- [ ] Sign-off from QA

---

## 🔗 Related Files

- Strategy: `PHASE_4_3_ASSISTANT_OPTIMIZATION_STRATEGY.md`
- Current OwnerDashboardPage: `src/pages/owner/OwnerDashboardPage.jsx`
- MaryInventoryCRM (to refactor): `src/components/crm/MaryInventoryCRM.jsx`
- ClaraLeadsCRM (to refactor): `src/components/crm/ClaraLeadsCRM.jsx`
- SuspenseLoader: `src/shared/components/ui/SuspenseLoader.jsx`

---

## 📌 Next Pending

1. **Day 1 Deliverable**: Detailed analysis of MaryInventoryCRM
2. **Week 1 Goal**: MaryInventoryCRM fully refactored
3. **Week 2 Goal**: All 4 CRMs refactored + shared utilities
4. **Phase 4.3 Complete**: 250 kB savings documented

**Ready to begin Day 1 execution?** Awaiting confirmation to proceed.
