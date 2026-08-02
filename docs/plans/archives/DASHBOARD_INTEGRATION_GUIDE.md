# Dashboard Integration Guide - UI Component Library

## Overview

Complete guide for integrating the 12-component advanced UI library into the White Caves dashboard pages. Includes best practices, code examples, and integration patterns.

---

## 📋 Quick Integration Checklist

| Component       | Primary Use           | Status           | Example                |
| --------------- | --------------------- | ---------------- | ---------------------- |
| **Pagination**  | List/table paging     | ✅ Integrated    | AIAssistantCRUDManager |
| **Tooltip**     | Help/context tips     | 🔄 Ready         | Dashboard metrics      |
| **Tabs**        | Multi-view navigation | 🔄 Ready         | View mode switching    |
| **Modal**       | Dialogs/forms         | ✅ In use        | CRUD operations        |
| **Badge**       | Status indicators     | ✅ In use        | Status display         |
| **Alert**       | Notifications         | ✅ In use        | Error/success messages |
| **Spinner**     | Loading states        | ✅ In use        | Data loading           |
| **Toast**       | Temporary messages    | ✅ Context ready | Global messaging       |
| **Popover**     | Context menus         | 🔄 Ready         | Quick actions          |
| **ProgressBar** | Progress tracking     | 🔄 Ready         | Task progress          |

---

## 🚀 Implementation Examples

### 1. Pagination Integration (COMPLETED)

**Location**: `AIAssistantCRUDManager.tsx`

**Before**:

```typescript
{displayedAssistants.map((assistant) => (
  <TableRow key={assistant.id}>
    {/* Row content */}
  </TableRow>
))}
```

**After**:

```typescript
import { Pagination } from '@/components/ui';

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const paginatedAssistants = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return displayedAssistants.slice(startIndex, startIndex + itemsPerPage);
}, [displayedAssistants, currentPage]);

{paginatedAssistants.map((assistant) => (
  <TableRow key={assistant.id}>
    {/* Row content */}
  </TableRow>
))}

<Pagination
  currentPage={currentPage}
  totalItems={displayedAssistants.length}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}
/>
```

**Benefits**: Lists now support 10+ items, improves UX and performance.

---

### 2. Toast Context Integration (Ready)

**Location**: Any component that needs notifications

**Setup** (in root App.tsx):

```typescript
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui';

function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      {/* Your app */}
    </ToastProvider>
  );
}
```

**Usage** (in any component):

```typescript
import { useSuccessToast, useErrorToast } from '@/context/useToast';

const MyComponent = () => {
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();

  const handleSave = async () => {
    try {
      await api.save(data);
      showSuccess('Saved successfully!');
    } catch (error) {
      showError('Failed to save');
    }
  };

  return <button onClick={handleSave}>Save</button>;
};
```

**Benefits**: Global toast system replaces multiple alert APIs, consistent messaging.

---

### 3. Tooltip Integration (Ready)

**Location**: Dashboard pages with metrics

```typescript
import { Tooltip } from '@/components/ui';

<div>
  <Tooltip
    content="Total active AI assistants managing departments"
    placement="top"
  >
    <span>Active Assistants: {count}</span>
  </Tooltip>
</div>
```

**Best for**: Improving UX on metrics, help text, abbreviations.

---

### 4. Tabs Integration (Ready)

**Location**: Pages with multiple views (UsersTab, ClaraLeadsCRM, etc.)

```typescript
import { Tabs } from '@/components/ui';

const [activeView, setActiveView] = useState('grid');

<Tabs
  tabs={[
    {
      id: 'grid',
      label: 'Grid View',
      icon: <Grid size={16} />,
      content: <GridView data={users} />
    },
    {
      id: 'table',
      label: 'Table View',
      icon: <List size={16} />,
      content: <TableView data={users} />
    },
    {
      id: 'cards',
      label: 'Card View',
      icon: <Layout size={16} />,
      content: <CardView data={users} />
    },
  ]}
  variant="underline"
  onChange={setActiveView}
/>
```

**Best for**: View mode switching, multi-section dashboards, tabbed navigation.

---

### 5. Modal Integration (Ready)

**Location**: CRUD operations, quick actions

```typescript
import { Modal } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create New Assistant"
  size="medium"
>
  <AIAssistantCRUDForm />
</Modal>

<button onClick={() => setIsOpen(true)}>Create</button>
```

**Best for**: Forms, confirmations, detailed views.

---

### 6. Popover Integration (Ready)

**Location**: Bulk actions, context menus

```typescript
import { Popover } from '@/components/ui';

<Popover
  content={
    <div>
      <button onClick={handleArchive}>Archive</button>
      <button onClick={handleDuplicate}>Duplicate</button>
    </div>
  }
  placement="bottom-right"
  trigger="click"
>
  <button>⋮ Actions</button>
</Popover>
```

**Best for**: Context menus, bulk operations, quick actions.

---

### 7. ProgressBar Integration (Ready)

**Location**: Long-running operations, pipelines

```typescript
import { ProgressBar } from '@/components/ui';

<ProgressBar
  value={dealProgress}
  variant="success"
  size="medium"
  ariaLabel="Deal progress: 65%"
/>
```

**Best for**: Task completion, pipeline stages, data loading progress.

---

### 8. Badge Integration (Already in use)

**Enhancement example**:

```typescript
import { Badge } from '@/components/ui';

// Enhanced status display
<Badge
  variant={isActive ? 'success' : 'warning'}
  shape="pill"
>
  {isActive ? 'Active' : 'Inactive'}
</Badge>
```

---

### 9. Alert Integration (Already in use)

**Enhancement example**:

```typescript
import { Alert } from '@/components/ui';

<Alert
  type="warning"
  title="Warning"
  dismissible
  onClose={handleDismiss}
>
  This action cannot be reversed.
</Alert>
```

---

### 10. Spinner Integration (Already in use)

**Enhancement example**:

```typescript
import { Spinner } from '@/components/ui';

{isLoading ? (
  <Spinner size="large" variant="pulse" />
) : (
  <Content />
)}
```

---

## 📊 Integration Priority Matrix

### High Impact (Do First)

1. **Pagination** - Solves major UX problem in AIAssistantCRUDManager ✅ DONE
2. **Toast System** - Replaces scattered alert APIs
3. **Tabs** - Improves navigation in multi-view pages

### Medium Impact (Next Wave)

4. **Tooltip** - Improves discoverability of metrics
5. **Popover** - Enables better context menus
6. **ProgressBar** - Shows task progress visually

### Low Impact (Polish)

7. **Badge** - Already implemented, minor enhancements
8. **Alert** - Already used, consistency updates
9. **Modal** - Already in CRUD operations
10. **Spinner** - Already implemented

---

## 🔄 Redux Integration Pattern

All components work with Redux state:

```typescript
// Selector
const users = useAppSelector(state => state.users.data);

// Dispatch with pagination
const [currentPage, setCurrentPage] = useState(1);

const paginatedUsers = useMemo(() => {
  const start = (currentPage - 1) * 10;
  return users.slice(start, start + 10);
}, [users, currentPage]);

// Binding
<Pagination
  currentPage={currentPage}
  totalItems={users.length}
  itemsPerPage={10}
  onPageChange={setCurrentPage}
/>
```

---

## 🎯 Page-by-Page Integration Plan

### Priority 1: AIAssistantCRUDManager

- ✅ **Pagination** (COMPLETED)
- Status: Ready for immediate use
- Time: Already done

### Priority 2: UsersTab

- **Pagination**: Needed for >100 users
- **Tabs**: Grid/table/card view switching
- **Badge**: Role/status indicators
- Time: 1-2 hours
- Effort: High impact, moderate complexity

### Priority 3: UnifiedDashboardPage

- **Badge**: Tab counts
- **Tooltip**: Metric help text
- **Alert**: System notifications
- Time: 1-2 hours
- Effort: Medium impact, low complexity

### Priority 4: AdminDashboard

- **Alert**: Replace custom alerts
- **Pagination**: Alerts list
- **Badge**: Severity levels
- Time: 30-45 minutes
- Effort: High impact, low complexity

### Priority 5: ClaraLeadsCRM

- **Pagination**: Prospects/deals lists
- **Tabs**: View modes
- **ProgressBar**: Deal pipeline stage
- **Badge**: Lead stage
- Time: 2-3 hours
- Effort: High impact, medium complexity

---

## 🧪 Testing Patterns

### Pagination Testing

```typescript
it('should display paginated results', () => {
  render(<Component initialPage={1} />);
  expect(screen.getByText('Page 1').toHaveClass('active'));

  fireEvent.click(screen.getByText('2'));
  expect(screen.getByText('Page 2').toHaveClass('active'));
});
```

### Toast Testing

```typescript
it('should show success toast', async () => {
  const { show } = useToast();
  show({ message: 'Success!', type: 'success' });

  await waitFor(() => {
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
});
```

### Tabs Testing

```typescript
it('should switch tabs', () => {
  const tabs = [
    { id: '1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: '2', label: 'Tab 2', content: <div>Content 2</div> },
  ];

  render(<Tabs tabs={tabs} />);
  fireEvent.click(screen.getByText('Tab 2'));

  expect(screen.getByText('Content 2')).toBeInTheDocument();
});
```

---

## 📚 Component API Quick Reference

### Pagination

```typescript
<Pagination
  currentPage={1}              // Current page (1-indexed)
  totalItems={100}             // Total items in list
  itemsPerPage={10}            // Items per page
  onPageChange={(page) => {}}  // Page change handler
  maxPages={7}                 // Max visible pages
  showFirstLast={true}         // Show first/last buttons
  showPrevNext={true}          // Show prev/next buttons
/>
```

### Tabs

```typescript
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div/>, icon?: <Icon />, disabled?: false }
  ]}
  defaultTab="tab1"            // Default selected tab
  variant="default"            // 'default' | 'underline' | 'box'
  onChange={(id) => {}}        // Tab change handler
  fullWidth={false}            // Full width tabs
/>
```

### Toast

```typescript
const { show, dismiss, dismissAll } = useToast();

show({
  message: 'Success!', // Toast message
  type: 'success', // 'info' | 'success' | 'warning' | 'error'
  position: 'top-right', // 8 position options
  duration: 3000, // Auto-dismiss ms (0 = persist)
  action: {
    // Optional action button
    label: 'Undo',
    onClick: () => {},
  },
});
```

### Modal

```typescript
<Modal
  isOpen={true}                // Modal open state
  onClose={() => {}}           // Close handler
  title="Modal Title"          // Modal title
  size="medium"                // 'small' | 'medium' | 'large'
  showHeader={true}            // Show/hide header
  showFooter={false}           // Show/hide footer
  closeOnBackdrop={true}       // Close on backdrop click
  closeOnEscape={true}         // Close on ESC key
  footerContent={<>Actions</>} // Footer content
>
  {/* Modal content */}
</Modal>
```

---

## ✅ Integration Checklist Template

Use this for each page integration:

- [ ] Import component from `@/components/ui`
- [ ] Add state management (if needed)
- [ ] Add event handlers
- [ ] Integrate with Redux selectors
- [ ] Test in dev server (npm run dev)
- [ ] Verify build (npm run build)
- [ ] Test on mobile
- [ ] Test accessibility
- [ ] Code review
- [ ] Deploy to staging

---

## 🚀 Next Steps

1. **Immediate** (This session)
   - ✅ Pagination in AIAssistantCRUDManager (DONE)
   - [ ] Toast context setup in App root
   - [ ] Example integration docs (this file)

2. **Short-term** (Next 2-3 sessions)
   - [ ] Pagination in UsersTab
   - [ ] Tabs in ClaraLeadsCRM
   - [ ] Alert replacement in AdminDashboard

3. **Medium-term** (Next 4-6 sessions)
   - [ ] Full page integrations
   - [ ] Test coverage
   - [ ] Performance optimization
   - [ ] E2E test suite

---

## 📞 Questions?

All components are fully typed with JSDoc comments. Check:

- Component files: `src/components/ui/[ComponentName].tsx`
- Type definitions: `src/components/ui/advancedUI.types.ts`
- Context types: `src/context/ToastContext.tsx`

**Build Status**: ✅ PASSING (0 errors)  
**Components Ready**: 12/12 ✅  
**Integration**: In Progress

---

**Document Version**: 1.0  
**Last Updated**: This session  
**Next Review**: After Priority 2 implementation
