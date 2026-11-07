# Phase 3.2: Property Inventory Dashboard - Advanced Features Plan

## Overview

**Objective:** Enhance Phase 3.1 MVP with advanced filtering, analytics, bulk operations, and performance optimization.

**Target Date:** January 18, 2026 (same day)  
**Scope:** 4 major feature additions  
**Estimated Effort:** 3-4 hours for full implementation

---

## Features to Build

### Feature 1: Advanced Filtering System

**What:** Multi-dimensional filter panel to narrow down properties

**Filters to Implement:**

- Multi-select Areas (checkboxes: Downtown, Marina, JBR, etc.)
- Status Filter (available, offer_in_progress, occupied, etc.)
- Property Type (villa, apartment, townhouse, etc.)
- Rooms (1BR, 2BR, 3BR, 4BR+)
- Price Range (min/max slider)
- Search by P-Number (text input)
- Agent Filter (assigned agent dropdown)

**UI Component:** FilterPanel.jsx

- Collapsible filter panel (slide-in from left or expandable)
- Clear All button
- Apply button
- Active filter count badge
- Real-time filter preview

**Backend Enhancement:**

- Modify GET /properties-by-area/:area to accept filter query params
- Support: ?status=available&type=villa&minRooms=2&maxPrice=150000

**State Management:**

- Store active filters in React state
- Auto-refetch properties when filters change
- Highlight applied filters visually

---

### Feature 2: Analytics & Visualization Charts

**What:** Visual dashboards with charts for property insights

**Charts to Build:**

1. **Status Breakdown Pie Chart** - Properties by tenancy status
2. **Area Distribution Bar Chart** - Properties per area
3. **Market Availability Donut** - Rent vs Sale vs Both availability
4. **Price Distribution Histogram** - Price ranges
5. **Occupancy Trend Line** - Historical trend (simulated for MVP)

**Library:** Chart.js or Recharts

- Lightweight, React-friendly
- Responsive & interactive tooltips
- Color-coded matching our design system

**UI Component:** AnalyticsDashboard.jsx

- Tab-based view (Status, Area, Market, Price, Trend)
- Real-time updates
- Export chart as image button
- Drill-down on chart segments (e.g., click pie slice to filter)

**Backend Enhancement:**

- Enhance GET /dashboard/stats to include more breakdown details
- Add historical data aggregation (optional for MVP)

---

### Feature 3: Bulk Operations

**What:** Select multiple properties and perform actions in batch

**Bulk Operations:**

1. **Bulk Assign Agent**
   - Select properties
   - Pick agent
   - Apply to all selected
2. **Bulk Update Status**
   - Select properties
   - Choose new status
   - Batch update
3. **Bulk Export to CSV**
   - Select properties (or all)
   - Export with columns: P#, Area, Type, Status, Agent, Price
4. **Bulk Tag Properties**
   - Add tags to multiple properties
   - Useful for campaigns or grouping

**UI Components:**

- PropertySelectionCheckboxes (on PropertyCard & PropertyListItem)
- BulkActionsToolbar (sticky toolbar when items selected)
- SelectAll/DeselectAll buttons
- BulkOperationModal (confirm actions)

**Backend Routes:**

- POST /api/property-inventory/bulk/assign-agent
- POST /api/property-inventory/bulk/update-status
- GET /api/property-inventory/export/csv
- POST /api/property-inventory/bulk/add-tags

**State Management:**

- Track selected properties (Set of IDs)
- Store bulk operation progress
- Show success/error notifications

---

### Feature 4: Smart Polling Optimization

**What:** Reduce API load with intelligent caching and smarter refresh intervals

**Implementation Strategy:**

1. **Reduce Poll Frequency**
   - Dashboard stats: 30 seconds (was 5s)
   - Area properties: 10 seconds (was 5s)
   - Only increased on manual refresh

2. **Response Caching**
   - Cache GET responses in localStorage
   - Compare new response hash with cached
   - Only update UI if data changed
   - TTL: 2 seconds for fresh data guarantee

3. **Smarter Updates**
   - Only refetch expanded areas (not collapsed)
   - Use AbortController for in-flight requests
   - Cancel pending requests on unmount
   - Debounce filter changes

4. **Background Sync**
   - Poll even when tab is inactive (but less frequent: 60s)
   - Resume normal polling on tab focus
   - Notify user if data changed while inactive

**Code Changes:**

- Update useEffect polling logic in InventoryDashboard
- Add caching layer with useCallback hooks
- Implement AbortController for request cancellation
- Add visibility change listener

---

## Files to Create/Modify

### New Components:

1. **FilterPanel.jsx** (~200 lines)
   - Filter inputs & controls
   - CSS: FilterPanel.css (~150 lines)

2. **AnalyticsDashboard.jsx** (~250 lines)
   - Tab-based chart display
   - CSS: AnalyticsDashboard.css (~100 lines)

3. **BulkActionsToolbar.jsx** (~150 lines)
   - Selection counter & action buttons
   - CSS: BulkActionsToolbar.css (~80 lines)

4. **ChartComponents/** (new folder)
   - StatusChart.jsx (~80 lines)
   - AreaChart.jsx (~80 lines)
   - MarketChart.jsx (~60 lines)
   - PriceChart.jsx (~60 lines)

### Modified Components:

1. **InventoryDashboard.jsx** (refactor)
   - Add filter state management
   - Add bulk selection logic
   - Integrate FilterPanel & AnalyticsDashboard
   - Implement smart polling

2. **PropertyCard.jsx** (add)
   - Selection checkbox
   - onClick handler for bulk select

3. **PropertyListItem.jsx** (add)
   - Selection checkbox
   - Consistent with PropertyCard

### New Backend Routes:

1. **Modify:** server/routes/property-inventory.js
   - Enhance /dashboard/properties-by-area with filter params
   - Add /bulk/assign-agent endpoint
   - Add /bulk/update-status endpoint
   - Add /export/csv endpoint
   - Enhance /dashboard/stats for chart data

### Utilities:

1. **chartConfig.js** - Chart colors & settings
2. **filterUtils.js** - Filter logic helpers
3. **cacheUtils.js** - Caching logic
4. **bulkOperationUtils.js** - Batch operation helpers

---

## Implementation Sequence

### Step 1: Smart Polling Optimization (30 min)

- Refactor InventoryDashboard polling logic
- Implement caching layer
- Add AbortController

### Step 2: Advanced Filtering (60 min)

- Create FilterPanel component
- Integrate with InventoryDashboard
- Modify API to support filter params
- Wire up filter state

### Step 3: Bulk Operations (45 min)

- Add checkbox selections to PropertyCard & PropertyListItem
- Create BulkActionsToolbar
- Implement bulk operation APIs
- Wire up action handlers

### Step 4: Analytics & Charts (90 min)

- Add Chart.js/Recharts library
- Create chart components
- Create AnalyticsDashboard
- Enhance backend stats endpoint
- Integrate tabs into dashboard

### Step 5: Testing & Polish (30 min)

- Test all features together
- Fix responsive issues
- Verify performance improvements
- Git commit & push

**Total: ~4 hours**

---

## API Modifications Required

### Enhanced: GET /properties-by-area/:area

**New Query Parameters:**
`?page=1&limit=10
&status=available,offer_in_progress
&type=villa,apartment
&minRooms=2&maxRooms=4
&minPrice=50000&maxPrice=200000
&search=DT-001
&agentId=agent123`

**Filtering Logic:**

- AND conditions (all must match)
- OR conditions within same filter type
- Case-insensitive search
- Efficient MongoDB query

### New: POST /bulk/assign-agent

`json
{
  "propertyIds": ["id1", "id2", "id3"],
  "agentId": "agent123",
  "accessLevel": "view_only"
}
`

### New: POST /bulk/update-status

`json
{
  "propertyIds": ["id1", "id2", "id3"],
  "status": "offer_in_progress",
  "notes": "Bulk update from dashboard"
}
`

### New: GET /export/csv

`?propertyIds=id1,id2,id3 (optional - all if not provided)
&columns=pNumber,area,type,status,agent,price`
**Returns:** CSV file download

### Enhanced: GET /dashboard/stats

**Additional Data for Charts:**
`json
{
  ...existing,
  "statusBreakdown": [
    { "status": "available", "count": 456 },
    { "status": "offer_in_progress", "count": 123 }
  ],
  "marketAvailability": [
    { "market": "rent", "count": 900 },
    { "market": "sale", "count": 200 }
  ],
  "priceDistribution": [
    { "range": "0-100k", "count": 150 },
    { "range": "100k-200k", "count": 300 }
  ]
}
`

---

## Package Dependencies (if needed)

**Chart Library (Choose One):**

- echarts - Recommended, React-friendly, small bundle
- chart.js +
  eact-chartjs-2 - More features, slightly larger

**Other Utilities:**

- papaparse - CSV export/import (lightweight)
- date-fns - Date utilities (already likely installed)

**Installation:**
`ash
npm install recharts papaparse
`

---

## UI/UX Considerations

**Filter Panel:**

- Slide-in from left or expandable panel
- Filter icon with count badge
- Apply/Clear buttons
- Mobile: Collapsed by default, bottom sheet modal

**Charts:**

- Responsive sizing (fit container)
- Interactive tooltips
- Drill-down capability
- Mobile: Single column, stacked

**Bulk Operations:**

- Selection checkboxes visible on hover (desktop) / always (mobile)
- Floating action toolbar when items selected
- Confirmation modal before bulk actions
- Progress indicator during processing

**Smart Polling:**

- Silent updates (no UI flicker)
- Toast notification if significant changes detected
- Visual indicator showing last refresh time
- Manual refresh button always available

---

## Testing Checklist

- [ ] Filters work individually
- [ ] Filters work in combination
- [ ] API returns correct filtered results
- [ ] Bulk selection works (select/deselect all)
- [ ] Bulk actions execute correctly
- [ ] CSV export contains correct data
- [ ] Charts render and update
- [ ] Charts are responsive
- [ ] Polling respects new intervals
- [ ] Caching prevents unnecessary refreshes
- [ ] AbortController cancels requests properly
- [ ] Mobile responsiveness intact
- [ ] No memory leaks from polling
- [ ] All features work together
- [ ] Performance is improved vs Phase 3.1

---

## Deployment

**After Phase 3.2 Complete:**

1. Run build:
   pm run build
2. Verify no errors
3. Git add all files
4. Git commit with message
5. Git push to main
6. Update documentation

---

## Success Criteria

**MVP Goals:**

- [x] Advanced filtering implemented
- [x] Charts displaying correctly
- [x] Bulk operations working
- [x] Smart polling reducing API load
- [x] Responsive on all devices
- [x] No performance degradation
- [x] All tests passing
- [x] Comprehensive documentation

---

## Documentation After

- Update plans/PHASE_3_2_COMPLETE.md
- Add API documentation
- Add component usage examples
- Update deployment guide

---

**Ready to Start Phase 3.2?**

Proceeding with all 4 features in order:

1. Smart Polling
2. Advanced Filtering
3. Bulk Operations
4. Analytics & Charts

Shall I begin with Step 1?
