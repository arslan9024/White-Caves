# MaryInventoryCRM Tabs - Testing Guide

## Quick Start
- **Dev Server**: Running at `http://localhost:5000/`
- **Component Location**: `/modern-dashboard` → CRM Assistants → Mary Inventory CRM
- **Tabs Available**: Inventory, Data Tools, Features, Property Details

---

## Tab Testing Checklist

### 1. Inventory Tab ✅
**Location**: First tab in MaryInventoryCRM

#### Visual Verification
- [ ] Tab renders without errors
- [ ] Property cards display in grid layout
- [ ] Property matrix shows clusters
- [ ] Stats cards show correct counts
- [ ] Search box appears and is functional

#### Data Verification
- [ ] Properties load from Redux inventory slice
- [ ] Property count matches Redux state
- [ ] Cluster grouping works correctly
- [ ] Owner counts display accurately
- [ ] Status badges show correct status

#### Interaction Testing
- [ ] Click on property opens detail modal
- [ ] Filters apply correctly
- [ ] Search filters properties
- [ ] Sort options change order
- [ ] Multi-owner properties display correctly
- [ ] Owner lookup shows all owners
- [ ] Add property opens form
- [ ] Edit/Delete buttons functional

---

### 2. Data Tools Tab ✅
**Location**: Second tab in MaryInventoryCRM

#### Visual Verification
- [ ] Data Tools tab renders
- [ ] Tool tabs display: Export, Validate, Statistics, Tools
- [ ] Each tool tab has correct icon and color
- [ ] Content area below tabs loads properly

#### Sub-Feature Testing

**Export Tool**
- [ ] "Export to CSV" button appears
- [ ] Click button initiates download
- [ ] CSV file downloads to default location
- [ ] File name includes date: `inventory-export-YYYY-MM-DD.csv`
- [ ] CSV contains correct columns: P-Number, Project, Cluster, Area, Building, Unit, Floor, Owners Count, Status
- [ ] Export status message appears (success/error)
- [ ] Message disappears after 3 seconds
- [ ] Button disables when no properties present

**Validation Tool**
- [ ] "Run Validation" button appears
- [ ] Click button runs validation check
- [ ] Results show total count of issues (or "All data valid!")
- [ ] Issues breakdown shows specific problems:
  - Missing P-Numbers
  - Missing Clusters
  - Missing Projects
  - Missing Owners
  - Invalid Owner References
- [ ] Issue samples display (first 5 items)
- [ ] Shows count of remaining issues
- [ ] Color changes based on validation result (green=valid, red=issues)

**Statistics Tool**
- [ ] Statistics grid displays with 6 cards:
  1. Total Properties
  2. Total Owners
  3. Multi-Owner Properties
  4. Unique Clusters
  5. Unique Projects
  6. Multi-Owner Percentage
- [ ] Numbers update based on current data
- [ ] All numbers are accurate comparatively
- [ ] Status breakdown section shows properties by status
- [ ] Status counts add up to total properties

**Tools Section**
- [ ] Three coming-soon placeholders appear:
  1. DAMAC Assets
  2. Image Scanner
  3. Web Harvester
- [ ] "Coming Soon" buttons are disabled
- [ ] Tool descriptions display

---

### 3. Features Tab ✅
**Location**: Third tab in MaryInventoryCRM

#### Visual Verification
- [ ] Features tab renders without errors
- [ ] Title says "Mary's Capabilities"
- [ ] Summary cards display:
  - Active Features (with ⚡ icon)
  - Coming Soon (with ⚠️ icon)
  - Completion % (with ✅ icon)
- [ ] Card numbers show correct counts

#### Feature Coverage Testing
- [ ] Feature list organized into categories:
  1. Inventory Management
  2. Owner Management
  3. Data Analysis
  4. Advanced Features
- [ ] Each feature shows:
  - Feature name
  - Capability description
  - Status icon (✅ = enabled, ⚠️ = coming soon)
  - Status badge for coming soon items
- [ ] Enabled features count: 13
- [ ] Coming soon count: 3
- [ ] Completion percentage: ~81%

#### Feature Details
- [ ] Inventory Management section (4 items):
  - [ ] View Properties (enabled)
  - [ ] Add Properties (enabled)
  - [ ] Edit Properties (enabled)
  - [ ] Delete Properties (enabled)
- [ ] Owner Management section (3 items):
  - [ ] Multi-Owner Support (enabled)
  - [ ] Owner Lookup (enabled)
  - [ ] Owner Relationships (enabled)
- [ ] Data Analysis section (4 items):
  - [ ] Export Data (enabled)
  - [ ] Validate Data (enabled)
  - [ ] View Statistics (enabled)
  - [ ] Search Properties (enabled)
- [ ] Advanced Features section (4 items):
  - [ ] Cluster Analysis (enabled)
  - [ ] Project Grouping (enabled)
  - [ ] Bulk Operations (coming soon)
  - [ ] Custom Reporting (coming soon)

#### Data Types Section
- [ ] Shows counts:
  - Properties: [should match actual count]
  - Clusters: [should match unique clusters]
  - Projects: [should match unique projects]
  - Owners: [should match total owners]

#### Performance Metrics
- [ ] Performance metrics display:
  - Average Load Time: ~150ms
  - Query Optimization: Indexed
  - Cache Status: Active
  - Data Integrity: Validated

---

### 4. Property Details Tab ✅
**Location**: Fourth tab in MaryInventoryCRM

#### View Tabs Verification
- [ ] Three view tab buttons appear:
  1. Getting Started
  2. Selected Property
  3. Property Matrix

#### Getting Started View
- [ ] Info card with instructions displays
- [ ] Title: "How to View Property Details"
- [ ] Instructions explain how to view details
- [ ] Guide list shows available information:
  - Property Number (P-Number)
  - Project & Cluster
  - Area & Building
  - Unit & Floor
  - Status
  - Owners
  - Multi-Owner Details
- [ ] Tips section displays helpful instructions

#### Selected Property View
- [ ] Empty state shows when no property selected
- [ ] Shows message: "No Property Selected"
- [ ] Suggests using Property Matrix tab
- [ ] When property selected:
  - [ ] All property fields display:
    - Property Number
    - Project
    - Cluster
    - Area
    - Building
    - Unit & Floor
    - Status (as badge)
    - Owners (as list)
  - [ ] Data formats correctly
  - [ ] Status shows with proper styling

#### Property Matrix View
- [ ] Properties organized by cluster
- [ ] Cluster name shows with property count
- [ ] Property cards display in grid
- [ ] Each card shows:
  - [ ] Property number
  - [ ] Status badge
  - [ ] Project name
  - [ ] Area
  - [ ] Unit number (if applicable)
  - [ ] Owner count
- [ ] Cards are clickable
- [ ] Selected card highlights with primary color
- [ ] Clicking card updates detail view
- [ ] "No properties" message shows when empty

---

## Integration Testing

### Redux Integration
- [ ] Properties load from Redux on tab mount
- [ ] Filters from Redux apply correctly
- [ ] Owner data from Redux displays
- [ ] Stat calculations use Redux state
- [ ] Data updates when Redux state changes

### Data Flow
- [ ] useInventoryData hook provides correct data
- [ ] All selectors work properly
- [ ] Utilities (export, validate, search) function
- [ ] No circular dependencies
- [ ] No missing data references

### Error Handling
- [ ] No console errors when rendering
- [ ] No TypeScript errors
- [ ] Graceful handling of empty states
- [ ] Export errors show proper messages
- [ ] Validation errors display correctly

---

## Performance Testing

### Loading Performance
- [ ] Tab switches load quickly (< 500ms)
- [ ] No jank during interactions
- [ ] Smooth animations
- [ ] Suspense loader appears briefly

### Bundle Size
- [ ] Each tab lazy loads (check Network tab)
- [ ] Tab JS chunks load on demand
- [ ] No duplicate code across chunks

### Memory Usage
- [ ] No memory leaks when switching tabs
- [ ] Redux subscriptions clean up properly
- [ ] Suspense boundaries working correctly

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome/Edge: All features working
- [ ] Firefox: All features working
- [ ] Safari: All features working

### Responsive Design
- [ ] Desktop (1920px+): Full layout
- [ ] Laptop (1366px): All content visible
- [ ] Tablet (768px-1024px): Layout adjusts
- [ ] Mobile (< 768px): Single column, scrollable
- [ ] No horizontal overflow
- [ ] Touch-friendly on mobile

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key navigates between elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Tab order is logical
- [ ] No keyboard traps

### Screen Reader
- [ ] Buttons have accessible names
- [ ] Icons have alt text or aria-labels
- [ ] Tables have proper headers
- [ ] Lists are semantic
- [ ] Status messages announced

### Color Contrast
- [ ] Text meets WCAG AA standard
- [ ] Status indicators not color-only
- [ ] Icons have sufficient contrast

---

## Edge Cases & Error Scenarios

### Empty Data
- [ ] Handle no properties gracefully
- [ ] Show appropriate empty states
- [ ] Export/Validate handle empty data
- [ ] Statistics show 0 or N/A

### Invalid Data
- [ ] Missing owner references handled
- [ ] Null/undefined values not crash
- [ ] Validation identifies issues
- [ ] Malformed data doesn't break UI

### Large Datasets
- [ ] Performance with 1000+ properties
- [ ] Virtualization working if implemented
- [ ] Scrolling smooth in matrix
- [ ] Search filters quickly

---

## Sign-Off Checklist

When all tests pass, confirm:

```
Phase 4.3.2 - MaryInventoryCRM Tabs Testing Complete

✅ All 4 tabs render and display correctly
✅ All data bindings working with Redux
✅ All interactions functional
✅ All utilities working (export, validate, search)
✅ CSS responsive and complete
✅ No console errors
✅ No TypeScript errors
✅ Build passing
✅ Performance acceptable
✅ Accessibility baseline met
✅ Ready for Phase 4.3.3 (Clara Leads CRM)

Date: _______________
Tester: _______________
Status: APPROVED FOR NEXT PHASE
```

---

## Quick Test Sequence

For a quick validation (15 minutes):

1. **Load Component**
   - Navigate to `/modern-dashboard` → Mary Inventory CRM
   - Verify all 4 tabs visible
   - Check console - no errors

2. **Test Each Tab (minutes 1-12)**
   - **Inventory Tab** (2 min): View properties, verify count
   - **Data Tools** (3 min): Try export, validation, stats
   - **Features Tab** (2 min): Review feature list
   - **Details Tab** (3 min): View matrix, click properties, see details
   - **Tab Switching** (2 min): Verify smooth transitions

3. **Check Integration (minutes 13-15)**
   - Verify data matches across tabs
   - Check Redux DevTools (properties in state)
   - Test one filter interaction

4. **Confirm Ready** (minute 15+)
   - No errors in console
   - All tabs working
   - Build status: PASSED

**Total Time**: ~15-20 minutes for quick validation

---

## Reporting Issues

If you find issues during testing, note:
- **Tab**: Which tab (Inventory, Data Tools, Features, Details)
- **Step**: What action caused the issue
- **Expected**: What should happen
- **Actual**: What actually happened
- **Console Error**: Any error messages (screenshot if possible)
- **Screenshot**: Visual of the problem

Report in: Session summary or code comments

---

*Ready to test? Start the dev server and navigate to `/modern-dashboard`*
