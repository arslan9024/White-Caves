# Phase 4.3.2: Tab Content Implementation - Action Plan

**Date**: Feb 2026  
**Phase**: 4.3.2  
**Objective**: Populate all 4 tabs in MaryInventoryCRM with real functionality  
**Estimated Duration**: 2-3 hours  
**Priority**: HIGH (unblocks OwnerDashboardPage integration)  

---

## Overview

Phase 4.3.1 created the **tab structure and lazy loading** framework. Phase 4.3.2 will **populate each tab** with real inventory management functionality, migrating code from the original `MaryInventoryCRM.jsx` (385 lines) into modular, reusable tab components.

---

## Phase 4.3.2 Breakdown

### Tab 1: MaryInventoryTab.jsx (Primary Tab)
**Purpose**: Main inventory management interface  
**Scope**: Manage inventory items, add/edit/delete, search/filter  
**Estimated Lines**: 120-150  

#### Responsibilities
- ✅ Display inventory table or grid
- ✅ Search and filter by property, category, status
- ✅ Add new inventory item button
- ✅ Edit existing inventory item
- ✅ Delete inventory item (with confirmation)
- ✅ Sort by columns (name, quantity, value, date)
- ✅ Pagination or infinite scroll

#### Key Components
```javascript
// Expected structure
- TableHeader (column labels, sort icons)
- InventoryRow (individual item display)
- SearchBar (search & filter controls)
- ActionButtons (Add, Edit, Delete)
- Pagination/LoadMore
```

#### Redux Integration
```javascript
// Dispatch examples
dispatch(getInventoryItems(filterOptions));
dispatch(addInventoryItem(newItem));
dispatch(updateInventoryItem(id, updatedItem));
dispatch(deleteInventoryItem(id));
```

---

### Tab 2: MaryDataToolsTab.jsx (Data Operations Tab)
**Purpose**: Bulk operations, import/export, data management  
**Scope**: CSV import/export, bulk edit, calculations, data validation  
**Estimated Lines**: 80-100  

#### Responsibilities
- ✅ Export inventory to CSV/Excel
- ✅ Import inventory from CSV/Excel
- ✅ Bulk edit selected items
- ✅ Data validation and cleanup
- ✅ Generate inventory reports (summary, value, by category)
- ✅ Archive old inventory items
- ✅ Undo/Redo last actions

#### Key Components
```javascript
// Expected structure
- ImportExportSection
  - FileUpload component
  - DownloadButton component
- BulkActionSection
  - SelectAllCheckbox
  - BulkEditModal
- DataValidationSection
  - RunValidationButton
  - ValidationResultsDisplay
- GenerateReportSection
  - ReportTypeSelector
  - DownloadReportButton
```

#### Redux Integration
```javascript
// Dispatch examples
dispatch(importInventoryFromFile(file));
dispatch(exportInventoryToFile(format));
dispatch(bulkUpdateInventoryItems(selectedIds, updates));
dispatch(validateInventoryData());
dispatch(generateInventoryReport(reportType));
```

---

### Tab 3: MaryFeaturesTab.jsx (Features & Settings Tab)
**Purpose**: Toggle features, configure settings, view analytics  
**Scope**: Feature toggles, category management, threshold alerts  
**Estimated Lines**: 100-120  

#### Responsibilities
- ✅ Toggle inventory features (notifications, grouping, etc.)
- ✅ Manage inventory categories (add, edit, delete)
- ✅ Set low stock alerts/thresholds
- ✅ Configure recurring inventory checks
- ✅ View inventory analytics (top items, most used, etc.)
- ✅ Manage tags and custom fields
- ✅ Integration settings

#### Key Components
```javascript
// Expected structure
- FeatureToggleSection
  - ToggleSwitch components
  - FeatureDescription
- CategoryManagementSection
  - CategoryList
  - AddCategoryModal
  - EditCategoryModal
- ThresholdAlertsSection
  - ThresholdInput
  - AlertRulesList
- AnalyticsSection
  - StatsCards
  - Charts/Graphs
```

#### Redux Integration
```javascript
// Dispatch examples
dispatch(toggleInventoryFeature(featureName));
dispatch(addCategory(categoryName));
dispatch(updateCategory(categoryId, updates));
dispatch(deleteCategory(categoryId));
dispatch(setLowStockThreshold(quantity));
dispatch(getInventoryAnalytics());
```

---

### Tab 4: MaryDetailsTab.jsx (Metadata & History Tab)
**Purpose**: Item details, change history, audit trail  
**Scope**: View detailed item info, change log, notes, attachments  
**Estimated Lines**: 90-110  

#### Responsibilities
- ✅ View selected item details (full profile)
- ✅ Display change history (who changed what, when)
- ✅ View audit trail (timestamps, user actions)
- ✅ Manage item notes and comments
- ✅ Attach files/images to items
- ✅ View item relationships (linked properties, deals)
- ✅ Print item details

#### Key Components
```javascript
// Expected structure
- ItemDetailsPanel
  - ItemHeader (name, status, value)
  - Metadata (created, updated, owner)
  - DescriptionText
- ChangeHistorySection
  - TimelineView
  - HistoryEntry (action, user, timestamp)
- NotesSection
  - NotesList
  - AddNoteForm
- AttachmentsSection
  - FileUpload
  - AttachmentsList
- RelationshipsSection
  - LinkedItems
```

#### Redux Integration
```javascript
// Dispatch examples
dispatch(getInventoryItemDetails(itemId));
dispatch(getItemChangeHistory(itemId));
dispatch(addItemNote(itemId, noteText));
dispatch(attachFileToItem(itemId, file));
dispatch(getLinkedItems(itemId));
```

---

## Implementation Order

### Step 1: MaryInventoryTab.jsx (Primary)
**Why First**: Most critical tab, drives other tabs  
**Time**: 45 minutes  

1. Copy existing inventory table from original MaryInventoryCRM.jsx
2. Extract into MaryInventoryTab.jsx
3. Update imports (hooks, Redux, styles)
4. Verify renders correctly
5. Test in browser

### Step 2: useInventoryData.js Hook (Shared State)
**Why Second**: Used by all tabs  
**Time**: 30 minutes  

1. Define Redux selectors and dispatchers
2. Create custom hook with data fetching logic
3. Add error handling and loading states
4. Export data transformation utilities
5. Document hook API

### Step 3: MaryDataToolsTab.jsx (Data Operations)
**Why Third**: Builds on data from Tab 1  
**Time**: 40 minutes  

1. Create import/export components
2. Implement bulk operation UI
3. Add data validation logic
4. Add report generation
5. Test file operations

### Step 4: MaryFeaturesTab.jsx (Settings)
**Why Fourth**: Independent of other tabs  
**Time**: 35 minutes  

1. Create feature toggle section
2. Build category management UI
3. Add threshold alert configuration
4. Integrate with Redux settings slice
5. Add analytics visualization

### Step 5: MaryDetailsTab.jsx (Metadata)
**Why Last**: Optional for MVP  
**Time**: 30 minutes  

1. Create item details display
2. Add change history timeline
3. Implement notes section
4. Add file attachment UI
5. Add print functionality

---

## Code Pattern: Tab Template

Here's the template to follow for each tab:

```javascript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInventoryData } from '../hooks/useInventoryData';
// Other imports...

/**
 * [TabName]Tab Component
 * 
 * Purpose: [Brief description]
 * Responsibilities:
 * - [Responsibility 1]
 * - [Responsibility 2]
 * 
 * Redux Integration:
 * - selectInventoryItems (selector)
 * - getInventoryItems (thunk)
 * 
 * @returns {JSX.Element} Rendered tab content
 */
const [TabName]Tab = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const inventoryItems = useSelector(selectInventoryItems);
  const loading = useSelector(selectInventoryLoading);
  
  // Custom hook
  const { [dataVar], [function1], [function2] } = useInventoryData();
  
  // Local state
  const [activeItem, setActiveItem] = useState(null);
  
  // Effects
  useEffect(() => {
    // Fetch data on mount
    dispatch(getInventoryItems());
  }, [dispatch]);
  
  // Handlers
  const handleAction = (itemId) => {
    // Implementation
  };
  
  // Render
  return (
    <div className="[tab-name]-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>[Tab Title]</h3>
          <p className="header-subtitle">[Subtitle]</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">Action 1</button>
          <button className="action-btn primary">Primary Action</button>
        </div>
      </div>
      
      <div className="tab-body">
        {loading ? <LoadingSpinner /> : (
          // Tab-specific content
        )}
      </div>
    </div>
  );
};

[TabName]Tab.displayName = '[TabName]Tab';
export default [TabName]Tab;
```

---

## Redux Integration Checklist

### Selectors to Use
```javascript
import {
  selectInventoryItems,        // All items
  selectInventoryLoading,      // Loading state
  selectInventoryError,        // Error state
  selectInventoryFilter,       // Current filters
  selectInventorySelectedId,   // Selected item ID
  selectInventoryStats,        // Summary stats
  selectInventoryCategories,   // Available categories
} from '../../slices/inventorySlice';
```

### Thunks to Dispatch
```javascript
import {
  getInventoryItems,              // Fetch all items
  getInventoryItemDetails,        // Fetch single item
  addInventoryItem,               // Create new item
  updateInventoryItem,            // Update item
  deleteInventoryItem,            // Delete item
  bulkUpdateInventoryItems,       // Bulk update
  importInventoryFromFile,        // Import CSV
  exportInventoryToFile,          // Export CSV
  validateInventoryData,          // Data validation
  generateInventoryReport,        // Generate report
  updateInventorySettings,        // Update settings
  getInventoryAnalytics,          // Fetch analytics
} from '../../slices/inventorySlice';
```

---

## Testing Strategy

### Unit Tests for Each Tab
```javascript
// Example: MaryInventoryTab.test.jsx
describe('MaryInventoryTab', () => {
  it('should render inventory table', () => {});
  it('should handle add item action', () => {});
  it('should handle edit item action', () => {});
  it('should handle delete item action', () => {});
  it('should filter items by search term', () => {});
  it('should sort by column', () => {});
});
```

### Integration Tests
```javascript
// Example: MaryInventoryCRM.integration.test.jsx
describe('MaryInventoryCRM Integration', () => {
  it('should lazy load tabs on click', async () => {});
  it('should maintain state across tab switches', () => {});
  it('should handle large datasets', () => {});
});
```

### Manual QA Checklist
- [ ] Tab navigation works smoothly
- [ ] Lazy loading visible in Network tab (DevTools)
- [ ] No console errors
- [ ] Responsive design at 768px breakpoint
- [ ] All CRUD operations functional
- [ ] Search/filter working correctly
- [ ] Export/import files properly
- [ ] Mobile touchscreen navigation

---

## Files to Modify/Create

| File | Action | Status |
|------|--------|--------|
| `tabs/MaryInventoryTab.jsx` | Populate | ⏳ Phase 4.3.2 |
| `hooks/useInventoryData.js` | Enhance | ⏳ Phase 4.3.2 |
| `tabs/MaryDataToolsTab.jsx` | Populate | ⏳ Phase 4.3.2 |
| `tabs/MaryFeaturesTab.jsx` | Populate | ⏳ Phase 4.3.2 |
| `tabs/MaryDetailsTab.jsx` | Populate | ⏳ Phase 4.3.2 |
| `OwnerDashboardPage.jsx` | Update import | ⏳ Phase 4.3.3 |

---

## Success Criteria

Phase 4.3.2 will be **COMPLETE** when:

1. ✅ All 4 tabs are populated with real functionality
2. ✅ Redux integration working (selectors, thunks, state)
3. ✅ Lazy loading verified (DevTools Network tab shows chunks loading)
4. ✅ No TypeScript errors
5. ✅ No build errors
6. ✅ Dev server runs without warnings
7. ✅ All tabs render correctly with data
8. ✅ CRUD operations working in browser
9. ✅ Responsive design verified
10. ✅ Accessibility (WCAG) compliance
11. ✅ Documentation updated
12. ✅ Ready for Phase 4.3.3 (integration & testing)

---

## Estimated Timeline

| Task | Duration | Start | End |
|------|----------|-------|-----|
| MaryInventoryTab | 45 min | 0:00 | 0:45 |
| useInventoryData hook | 30 min | 0:45 | 1:15 |
| MaryDataToolsTab | 40 min | 1:15 | 1:55 |
| MaryFeaturesTab | 35 min | 1:55 | 2:30 |
| MaryDetailsTab | 30 min | 2:30 | 3:00 |
| Testing & polish | 30 min | 3:00 | 3:30 |
| **Total** | **3.5 hours** | | |

---

## Next Phase: 4.3.3

After Phase 4.3.2 completes:

1. **Update OwnerDashboardPage.jsx** to use MaryInventoryCRM_NEW
2. **Verify lazy loading** in Chrome DevTools (Network tab)
3. **Run E2E tests** for all MaryInventoryCRM functionality
4. **Performance benchmark**: Compare bundle sizes before/after
5. **Apply same pattern** to ClaraLeadsCRM, OliviaMarketingCRM, other CRM components

---

## Resources & References

- Original Component: `src/components/crm/MaryInventoryCRM.jsx` (385 lines)
- Redux Slice: `src/slices/inventorySlice.ts` (if exists, or create)
- Design System: `src/styles/design-system.css`
- Hook Pattern: `src/hooks/useInventoryData.js` (template provided in Phase 4.3.1)
- CSS Classes: `.mary-inventory-tab`, `.tab-header`, `.header-content`, `.header-actions`, `.action-btn`

---

## Sign-Off

**Phase 4.3.2: Tab Content Implementation**  
**Status**: Ready to Execute  
**Priority**: HIGH  
**Next Trigger**: "Continue to Phase 4.3.2" or "Please continue"  

---

**Questions?** Refer to:
- PHASE_4_3_PLANNING_COMPLETE_HANDOVER.md (detailed planning)
- PHASE_4_3_1_COMPLETION_SUMMARY.md (what was completed)
- PHASE_4_COMPREHENSIVE_STATUS_REPORT.md (full Phase 4 overview)
