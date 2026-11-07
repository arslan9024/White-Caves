# Phase 4.3.2 Ready-to-Execute Handover

**Date**: Feb 2026  
**Status**: READY FOR IMMEDIATE EXECUTION  
**Duration**: 3.5 hours  
**Priority**: HIGH  

---

## Executive Summary

Phase 4.3.1 successfully **refactored MaryInventoryCRM** from a 385-line monolith into a **modular, lazy-loaded tab structure**. Phase 4.3.2 will **populate each of the 4 tabs** with real inventory management functionality, completing the transition and unlocking 75% bundle reduction on tab content.

**Current State**: 8 files created, lazy loading framework in place, dev server running ✅  
**Next Step**: Populate tabs with real functionality  
**Success Metric**: All 4 tabs functional, CRUD operations working, no TypeScript errors  

---

## File Structure Ready for Phase 4.3.2

```
src/components/crm/MaryInventoryCRM_NEW/
├── MaryInventoryCRM.jsx          ✅ Refactored (lazy loading framework)
├── index.jsx                      ✅ Wrapper export
├── MaryInventoryCRM.css           ✅ Tab styles (enhanced)
├── hooks/
│   └── useInventoryData.js        ✅ Custom hook (placeholder)
├── tabs/
│   ├── MaryInventoryTab.jsx       🚀 TO POPULATE
│   ├── MaryDataToolsTab.jsx       🚀 TO POPULATE
│   ├── MaryFeaturesTab.jsx        🚀 TO POPULATE
│   └── MaryDetailsTab.jsx         🚀 TO POPULATE
└── data/
    └── [future shared data exports]
```

---

## Tab Population Guide (4 Tabs = 3.5 Hours)

### Tab 1: MaryInventoryTab.jsx ⏱️ 45 minutes
**Primary inventory management tab**

```javascript
// Expected Structure
export default function MaryInventoryTab() {
  return (
    <div className="mary-inventory-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>Inventory</h3>
          <p className="header-subtitle">Manage inventory items</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">+ Add Item</button>
        </div>
      </div>
      
      <div className="tab-body">
        {/* Inventory Table/Grid */}
        {/* Search & Filter */}
        {/* Pagination */}
      </div>
    </div>
  );
}
```

**Key Responsibilities**:
- Display inventory items (table or grid)
- Search & filter functionality
- Add/edit/delete operations
- Sorting and pagination

**Source Code**: Extract from original `src/components/crm/MaryInventoryCRM.jsx` lines 1-150 (main table logic)

**Redux Integration**:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectInventoryItems, 
  selectInventoryLoading,
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem 
} from '../../slices/inventorySlice';

// Dispatch on mount
useEffect(() => {
  dispatch(getInventoryItems());
}, [dispatch]);
```

---

### Tab 2: MaryDataToolsTab.jsx ⏱️ 40 minutes
**Data operations and bulk management**

```javascript
// Expected Structure
export default function MaryDataToolsTab() {
  return (
    <div className="mary-data-tools-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>Data Tools</h3>
          <p className="header-subtitle">Import, export, and manage inventory data</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">Import</button>
          <button className="action-btn primary">Export</button>
        </div>
      </div>
      
      <div className="tab-body">
        {/* Import/Export Section */}
        {/* Bulk Actions Section */}
        {/* Data Validation Section */}
        {/* Generate Report Section */}
      </div>
    </div>
  );
}
```

**Key Responsibilities**:
- CSV/Excel import functionality
- CSV/Excel export functionality
- Bulk update selected items
- Data validation and cleanup
- Report generation

**Source Code**: Extract from original MaryInventoryCRM.jsx lines 150-230 (data tools section)

**Redux Integration**:
```javascript
dispatch(importInventoryFromFile(file));
dispatch(exportInventoryToFile(format));
dispatch(bulkUpdateInventoryItems(selectedIds, updates));
dispatch(validateInventoryData());
dispatch(generateInventoryReport(reportType));
```

---

### Tab 3: MaryFeaturesTab.jsx ⏱️ 35 minutes
**Features, settings, and analytics**

```javascript
// Expected Structure
export default function MaryFeaturesTab() {
  return (
    <div className="mary-features-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>Features</h3>
          <p className="header-subtitle">Configure inventory features and settings</p>
        </div>
      </div>
      
      <div className="tab-body">
        {/* Feature Toggles */}
        {/* Category Management */}
        {/* Threshold Alerts */}
        {/* Analytics Dashboard */}
      </div>
    </div>
  );
}
```

**Key Responsibilities**:
- Feature toggle switches
- Category management (CRUD)
- Low stock alert thresholds
- Inventory analytics (charts, stats)
- Integration settings

**Source Code**: Extract from original MaryInventoryCRM.jsx lines 230-320 (features section)

**Redux Integration**:
```javascript
dispatch(toggleInventoryFeature(featureName));
dispatch(addCategory(categoryName));
dispatch(updateCategory(categoryId, updates));
dispatch(deleteCategory(categoryId));
dispatch(setLowStockThreshold(quantity));
dispatch(getInventoryAnalytics());
```

---

### Tab 4: MaryDetailsTab.jsx ⏱️ 30 minutes
**Item details and change history** (lowest priority, can defer if needed)

```javascript
// Expected Structure
export default function MaryDetailsTab() {
  return (
    <div className="mary-details-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>Details</h3>
          <p className="header-subtitle">View item details and change history</p>
        </div>
      </div>
      
      <div className="tab-body">
        {/* Item Details Panel */}
        {/* Change History Timeline */}
        {/* Notes Section */}
        {/* Attachments Section */}
      </div>
    </div>
  );
}
```

**Key Responsibilities**:
- Display full item details
- Show change history/audit trail
- Add/view item notes
- Manage file attachments
- Print item details

**Source Code**: Extract from original MaryInventoryCRM.jsx lines 320-385 (details section)

**Redux Integration**:
```javascript
dispatch(getInventoryItemDetails(itemId));
dispatch(getItemChangeHistory(itemId));
dispatch(addItemNote(itemId, noteText));
dispatch(attachFileToItem(itemId, file));
```

---

## Custom Hook: useInventoryData.js Enhancement ⏱️ 30 minutes

Currently a placeholder, enhance with:

```javascript
/**
 * useInventoryData - Shared state hook for MaryInventoryCRM
 * 
 * Provides:
 * - Inventory items and loading state
 * - Filter and search utilities
 * - CRUD dispatchers
 * - Analytics data
 */
export const useInventoryData = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const items = useSelector(selectInventoryItems);
  const loading = useSelector(selectInventoryLoading);
  const filter = useSelector(selectInventoryFilter);
  const categories = useSelector(selectInventoryCategories);
  const stats = useSelector(selectInventoryStats);
  
  // CRUD dispatchers
  const addItem = (item) => dispatch(addInventoryItem(item));
  const updateItem = (id, updates) => dispatch(updateInventoryItem(id, updates));
  const deleteItem = (id) => dispatch(deleteInventoryItem(id));
  
  // Bulk operations
  const importFromFile = (file) => dispatch(importInventoryFromFile(file));
  const exportToFile = (format) => dispatch(exportInventoryToFile(format));
  const bulkUpdate = (ids, updates) => dispatch(bulkUpdateInventoryItems(ids, updates));
  
  // Utilities
  const validateData = () => dispatch(validateInventoryData());
  const generateReport = (type) => dispatch(generateInventoryReport(type));
  
  return {
    items,
    loading,
    filter,
    categories,
    stats,
    addItem,
    updateItem,
    deleteItem,
    importFromFile,
    exportToFile,
    bulkUpdate,
    validateData,
    generateReport,
  };
};
```

---

## Redux Checklist

✅ **Ensure these selectors exist**:
- `selectInventoryItems`
- `selectInventoryLoading`
- `selectInventoryFilter`
- `selectInventoryCategories`
- `selectInventoryStats`
- `selectInventorySelectedId`

✅ **Ensure these thunks exist**:
- `getInventoryItems`
- `addInventoryItem`
- `updateInventoryItem`
- `deleteInventoryItem`
- `importInventoryFromFile`
- `exportInventoryToFile`
- `bulkUpdateInventoryItems`
- `validateInventoryData`
- `generateInventoryReport`

**If missing**: Create in `src/slices/inventorySlice.ts` (use existing Redux patterns)

---

## Build & Test Commands

### Build Verification
```bash
npm run build
# Expected: 0 errors, build successful
```

### Dev Server
```bash
npm run dev
# Expected: Running at http://localhost:5000/
```

### Check Lazy Loading in DevTools
1. Open Chrome DevTools
2. Go to Network tab
3. Navigate to OwnerDashboardPage
4. Click each tab in MaryInventoryCRM
5. Should see new .js chunks loading (lazy chunks)

### Run Tests
```bash
npm run test
# Expected: all tests passing
```

---

## Success Criteria Checklist

Phase 4.3.2 is **COMPLETE** when:

- [ ] ✅ MaryInventoryTab.jsx populated and rendering
- [ ] ✅ MaryDataToolsTab.jsx populated and rendering
- [ ] ✅ MaryFeaturesTab.jsx populated and rendering
- [ ] ✅ MaryDetailsTab.jsx populated and rendering
- [ ] ✅ useInventoryData.js hook fully implemented
- [ ] ✅ All Redux integration working (selectors, thunks)
- [ ] ✅ No TypeScript errors
- [ ] ✅ Build successful (npm run build)
- [ ] ✅ Dev server runs without warnings
- [ ] ✅ Tab navigation working smoothly
- [ ] ✅ Lazy loading visible in Network tab
- [ ] ✅ All CRUD operations functional
- [ ] ✅ Search/filter working correctly
- [ ] ✅ Responsive design verified (desktop + mobile)
- [ ] ✅ Documentation updated
- [ ] ✅ Ready for Phase 4.3.3 integration

---

## Execution Timeline

| Task | Duration | Breakpoint | Status |
|------|----------|---------|--------|
| MaryInventoryTab | 45 min | 0:45 | 🚀 Ready |
| useInventoryData hook | 30 min | 1:15 | 🚀 Ready |
| MaryDataToolsTab | 40 min | 1:55 | 🚀 Ready |
| MaryFeaturesTab | 35 min | 2:30 | 🚀 Ready |
| MaryDetailsTab | 30 min | 3:00 | 🚀 Ready |
| Testing & polish | 30 min | 3:30 | 🚀 Ready |
| **TOTAL** | **3.5 hours** | | |

---

## Quick Reference: File Locations

| File | Purpose | Path |
|------|---------|------|
| Original component | Source code for extraction | `src/components/crm/MaryInventoryCRM.jsx` |
| Tab wrapper | Lazy loading framework | `src/components/crm/MaryInventoryCRM_NEW/MaryInventoryCRM.jsx` |
| Tab 1 | Inventory CRUD | `src/components/crm/MaryInventoryCRM_NEW/tabs/MaryInventoryTab.jsx` |
| Tab 2 | Data tools | `src/components/crm/MaryInventoryCRM_NEW/tabs/MaryDataToolsTab.jsx` |
| Tab 3 | Features | `src/components/crm/MaryInventoryCRM_NEW/tabs/MaryFeaturesTab.jsx` |
| Tab 4 | Details | `src/components/crm/MaryInventoryCRM_NEW/tabs/MaryDetailsTab.jsx` |
| Custom hook | Shared state | `src/components/crm/MaryInventoryCRM_NEW/hooks/useInventoryData.js` |
| Redux slice | State management | `src/slices/inventorySlice.ts` |
| CSS | Styles | `src/components/crm/MaryInventoryCRM_NEW/MaryInventoryCRM.css` |

---

## Common Patterns & Code Templates

### Pattern 1: Basic Tab Component
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInventoryData } from '../hooks/useInventoryData';
import '../MaryInventoryCRM.css';

export default function [TabName]Tab() {
  const dispatch = useDispatch();
  const { items, loading } = useInventoryData();
  
  useEffect(() => {
    // Load tab-specific data
  }, [dispatch]);
  
  return (
    <div className="[tab-name]-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>[Tab Title]</h3>
          <p className="header-subtitle">[Description]</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">[Action]</button>
        </div>
      </div>
      
      <div className="tab-body">
        {loading ? <div>Loading...</div> : (
          // Tab content
        )}
      </div>
    </div>
  );
}

[TabName]Tab.displayName = '[TabName]Tab';
```

### Pattern 2: Using useInventoryData Hook
```javascript
const {
  items,
  loading,
  categories,
  stats,
  addItem,
  updateItem,
  deleteItem,
  importFromFile,
  exportToFile,
  bulkUpdate,
} = useInventoryData();
```

### Pattern 3: Handling Async Operations
```javascript
const handleDelete = async (itemId) => {
  try {
    await deleteItem(itemId);
    // Show success toast
  } catch (error) {
    // Show error toast
  }
};
```

---

## Resources & Documentation

### Phase 4.3.1 Reference
- `PHASE_4_3_1_COMPLETION_SUMMARY.md` - What was completed
- `PHASE_4_3_1_DAY_1_ANALYSIS_REPORT.md` - Technical deep-dive

### Phase 4.3 Overview
- `PHASE_4_3_ASSISTANT_OPTIMIZATION_STRATEGY.md` - Strategy and approach
- `PHASE_4_3_PLANNING_COMPLETE_HANDOVER.md` - Planning details
- `PHASE_4_COMPREHENSIVE_STATUS_REPORT.md` - Full Phase 4 status

### Design System
- CSS Classes: See `MaryInventoryCRM.css` for tab styles
- Design Tokens: `src/styles/design-tokens.css`
- Theme: `src/styles/theme.css`

---

## Next Phase: 4.3.3

After Phase 4.3.2 completion, Phase 4.3.3 will:

1. Update OwnerDashboardPage.jsx to use `MaryInventoryCRM_NEW`
2. Verify lazy loading in Chrome DevTools (Network tab)
3. Run E2E tests for all MaryInventoryCRM functionality
4. Performance benchmark: Compare bundle sizes
5. Apply same pattern to ClaraLeadsCRM, OliviaMarketingCRM, other CRMs

---

## Status & Sign-Off

**Phase 4.3.2: Tab Content Implementation**  
**Status**: ✅ READY FOR IMMEDIATE EXECUTION  
**Priority**: HIGH  
**Next Trigger**: User says "Continue", "Go", or "Please continue"  

---

**Need help?** Refer to:
1. This document for overview
2. `PHASE_4_3_2_ACTION_PLAN.md` for detailed breakdown
3. `PHASE_4_3_1_COMPLETION_SUMMARY.md` for context
4. Original `src/components/crm/MaryInventoryCRM.jsx` for source code
