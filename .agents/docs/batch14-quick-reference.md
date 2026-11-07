# Batch 14 - Quick Reference Guide
## Notification & Status Components

### 📋 Import All Components
```typescript
import { 
  Notification,
  Alert, 
  SkeletonLoader,
  StatusIndicator,
  Spinner,
  Empty,
  Tooltip,
  Divider
} from '@/components/common';
```

---

## 🔔 Notification Components

### Notification
```tsx
<Notification
  type="warning"        // 'success' | 'error' | 'info' | 'warning'
  title="Alert Title"
  message="Alert message"
  icon={<CustomIcon />} // optional custom icon
  closeable={true}
  onClose={() => {}}
  action={<button>Action</button>}
/>
```

### Alert
```tsx
<Alert
  severity="error"      // 'success' | 'error' | 'info' | 'warning'
  variant="filled"      // 'filled' | 'outlined' | 'standard'
  title="Error"
  description="Description text"
  closeable={true}
  onClose={() => {}}
  action={<button>Action</button>}
/>
```

---

## ⏳ Loading Components

### Spinner
```tsx
// Ring spinner (default)
<Spinner 
  size="medium"         // 'small' | 'medium' | 'large'
  variant="ring"        // 'ring' | 'dots' | 'bars' | 'pulse'
  color="#3b82f6"
  label="Loading..."
/>

// Dots spinner
<Spinner variant="dots" />

// Bars spinner
<Spinner variant="bars" />

// Pulse spinner
<Spinner variant="pulse" />

// Loading overlay
<LoadingOverlay 
  isLoading={true}
  spinnerVariant="ring"
  label="Processing..."
/>
```

### SkeletonLoader
```tsx
// Text skeleton
<SkeletonLoader variant="text" count={3} />

// Card skeleton
<SkeletonLoader variant="card" />

// Image skeleton
<SkeletonLoader variant="image" />

// Grid skeleton
<SkeletonLoader variant="grid" count={4} />

// Custom skeleton
<SkeletonLoader variant="custom">
  <Skeleton variant="circular" width={48} height={48} />
  <Skeleton variant="text" width="100%" />
</SkeletonLoader>

// Skeleton variants
<Skeleton variant="text" width="80%" height="20px" />
<Skeleton variant="circular" width={40} />
<Skeleton variant="rectangular" width="100%" height={200} />
<Skeleton variant="rounded" width="100%" height={60} />
```

---

## 📊 Status Components

### StatusIndicator
```tsx
<StatusIndicator
  status="active"        // 'active' | 'inactive' | 'pending' | 'error' | 'warning' | 'success'
  label="Online"
  size="medium"          // 'small' | 'medium' | 'large'
  variant="dot"          // 'dot' | 'ring' | 'pulse'
  title="Status info"
/>

// Status badge variant
<StatusBadge
  status="success"
  label="Success"
/>
```

---

## 📭 Empty State

### Empty
```tsx
<Empty
  title="No data found"
  description="Try adjusting your filters"
  icon={<CustomIcon />}
  action={<button>Reset Filters</button>}
  fullHeight={false}
/>

// With EmptyList utility
<EmptyList
  itemCount={items.length}
  emptyText="No items"
  renderEmpty={() => <Custom />}
>
  {/* list items */}
</EmptyList>
```

---

## 💡 Tooltip

### Tooltip
```tsx
<Tooltip
  content="Click to continue"
  placement="top"         // 'top' | 'bottom' | 'left' | 'right'
  delayShow={200}
  delayHide={0}
>
  <button>Hover me</button>
</Tooltip>

// With title
<Tooltip
  title="Title"
  content="Detailed explanation"
  placement="top"
>
  <button>Help</button>
</Tooltip>

// Simple version
<TooltipSimple text="Click to save" placement="top">
  <button>Save</button>
</TooltipSimple>
```

---

## 📏 Divider

### Divider
```tsx
// Horizontal divider
<Divider />
<Divider variant="dashed" margin={24} thickness={1} />

// Vertical divider
<Divider orientation="vertical" margin={16} />

// Divider with text
<Divider>or continue with</Divider>

// Divider group
<DividerGroup direction="column" gap={16}>
  <div>Section 1</div>
  <Divider />
  <div>Section 2</div>
</DividerGroup>
```

---

## 🎨 Theming & Styling

### Dark Theme Support
All components automatically support dark theme via CSS variables:
```css
[data-theme='dark'] {
  --bg-primary: #1f2937;
  --bg-secondary: #374151;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --border-color: #374151;
}
```

### Custom Theming
```tsx
// Add to your theme provider
<div data-theme="dark">
  <YourApp />
</div>
```

---

## 📱 Responsive Breakpoints

All components are optimized for:
- 📱 Mobile: ≤640px
- 📱 Tablet: 641px - 1023px  
- 🖥️ Desktop: 1024px+

---

## ✨ Animation Frames

### Built-in Animations
- **slideInRight** (Toast)
- **slideInDown** (Notification)
- **slideIn** (Alert)
- **shimmer** (SkeletonLoader)
- **pulse** (StatusIndicator, Spinner)
- **ring** (StatusIndicator)
- **spin** (Spinner)
- **bounce** (Spinner dots)
- **bars** (Spinner bars)
- **tooltipFadeIn** (Tooltip)

---

## 🔑 Key Features by Component

| Component | Types | Sizes | Variants | Animation | Dark |
|-----------|-------|-------|----------|-----------|------|
| Notification | 4 | 1 | 1 | ✓ | ✓ |
| Alert | 4 | 1 | 3 | ✓ | ✓ |
| Spinner | 1 | 3 | 4 | ✓ | ✓ |
| SkeletonLoader | 4 | Flex | 5 | ✓ | ✓ |
| StatusIndicator | 6 | 3 | 3 | ✓ | ✓ |
| Empty | 1 | 1 | 1 | - | ✓ |
| Tooltip | 1 | 1 | 4 | ✓ | ✓ |
| Divider | 2 | 1 | 3 | - | ✓ |

---

## 🎯 Common Use Cases

### Loading Data
```tsx
{isLoading ? (
  <Spinner size="large" variant="ring" label="Loading..." />
) : (
  <YourContent />
)}
```

### Empty List
```tsx
{items.length === 0 ? (
  <Empty
    title="No items"
    description="You haven't created any items yet"
    action={<button onClick={onCreate}>Create One</button>}
  />
) : (
  <ItemList items={items} />
)}
```

### Form Validation
```tsx
<Alert
  severity="error"
  title="Validation Failed"
  description={errors[0]}
  variant="outlined"
/>
```

### Status Display
```tsx
<div>
  <StatusIndicator status={user.status} label={user.statusText} />
  <span className="ml-2">{user.name}</span>
</div>
```

### Loading Skeleton
```tsx
<>
  {isLoading ? (
    <SkeletonLoader variant="card" />
  ) : (
    <Card data={data} />
  )}
</>
```

---

## 📦 Component Sizes

### Spinner Sizes
- small: 20px
- medium: 32px
- large: 48px

### StatusIndicator Sizes
- small: 8px dot / 16px ring
- medium: 12px dot / 20px ring
- large: 16px dot / 28px ring

### SkeletonLoader Variants
- text: Full width lines
- circular: Square circle (optional)
- rectangular: Rectangular box
- rounded: Rounded rectangle
- custom: Your layout

---

## 🚀 Production Ready

✅ TypeScript strict mode  
✅ Full WCAG accessibility  
✅ Dark theme compatibility  
✅ Responsive design  
✅ Zero dependencies (except React, styled-components)  
✅ Optimized bundle size  
✅ Smooth animations  
✅ Cross-browser compatible  

---

## 📚 Documentation Files

- **BATCH14_NOTIFICATIONS_STATUS_MIGRATION_COMPLETE.md** - Full technical report
- **BATCH14_QUICK_REFERENCE.md** - This file
- **src/components/common/index.js** - Export definitions

---

**Ready to use! Happy coding! 🎉**
