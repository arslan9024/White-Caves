# 📋 Sidebar Builder Quick Reference

## 1️⃣ Create Feature Component (5 mins)

```typescript
// src/components/features/YourFeature/YourFeature.tsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
`;

export const YourFeature: React.FC = () => {
  return (
    <Container>
      <h1>Your Feature</h1>
      <p>Content goes here</p>
    </Container>
  );
};
```

## 2️⃣ Register Feature (2 mins)

```typescript
// src/config/featureRegistration.ts
import { YourFeature } from '../components/features/YourFeature/YourFeature';

export const maryInventoryFeatures: Feature[] = [
  {
    id: 'your-feature-id', // Must be unique
    name: 'Your Feature Name',
    label: 'Your Feature',
    category: 'inventory',
    component: YourFeature,
    icon: '📦',
    permissions: ['view:inventory'],
  },
];
```

## 3️⃣ Add to Sidebar (1 min)

```typescript
// src/components/sidebars/MaryInventorySidebar/MaryInventorySidebar.tsx
const sidebarStructure = [
  {
    id: 'inventory-main',
    title: 'Inventory Management',
    items: [
      {
        id: 'your-feature-id', // Must match registration
        label: 'Your Feature',
        icon: '📦',
      },
    ],
  },
];
```

**Total Time: ~8 minutes!** ⚡

---

## Cheat Sheet: Feature Structure

```typescript
{
  id: 'unique-id',                    // Used to identify feature
  name: 'Display Name',               // Long form
  label: 'Short Label',               // Short form for sidebar
  category: 'inventory',              // inventory|crm|analytics|whatsapp|admin
  component: YourComponent,           // React component to render
  icon: '📦',                        // Emoji or icon
  badge: 'NEW',                       // Optional badge
  description: 'What this does',     // Optional tooltip
  permissions: ['view:inventory'],    // Access control
  disabled: false,                    // Optional disable
}
```

---

## Common Theme Colors

```typescript
// Access in styled-components:
${props => props.theme.colors.background}    // Main bg
${props => props.theme.colors.primary}       // Primary brand
${props => props.theme.colors.secondary}     // Secondary
${props => props.theme.colors.text}          // Main text
${props => props.theme.colors.textSecondary} // Secondary text
${props => props.theme.colors.border}        // Borders
${props => props.theme.colors.cardBg}        // Card background
${props => props.theme.colors.sidebarBg}     // Sidebar background
```

---

## Redux Integration

```typescript
// Get active feature
const activeFeature = useSelector((state: RootState) => state.sidebarUI.activeFeature);

// Set active feature
const dispatch = useDispatch();
dispatch({ type: 'sidebarUI/setActiveFeature', payload: 'feature-id' });

// Or use hook:
const { setActiveFeature } = useSidebarState();
setActiveFeature('feature-id');
```

---

## Sidebar Item Properties

```typescript
{
  id: 'feature-id',              // Links to feature registration
  label: 'Display Text',         // What user sees
  icon: '📦',                   // Emoji or icon
  badge: 'NEW',                 // Optional badge
  description: 'Tooltip text',  // Optional hover tooltip
  disabled: false,              // Optional disable
}
```

---

## File Organization Pattern

```
src/
├── components/
│   ├── sidebars/
│   │   ├── YourSidebar/
│   │   │   └── YourSidebar.tsx
│   │   └── examples/
│   │       └── YourSidebarExample.tsx
│   └── features/
│       ├── Feature1/
│       │   └── Feature1.tsx
│       ├── Feature2/
│       │   └── Feature2.tsx
│       └── Feature3/
│           └── Feature3.tsx
├── config/
│   └── featureRegistration.ts
└── styles/
    └── theme.ts
```

---

## Testing Your Sidebar

1. **View in Example:**

```typescript
import { MaryInventorySidebarExample } from './components/sidebars/examples/MaryInventorySidebarExample';

// In your app or test
<MaryInventorySidebarExample />
```

2. **Check Console:**
   - Click items and verify Redux actions
   - Check component renders correctly
   - Verify no console errors

3. **Verify IDs Match:**
   - Feature ID in registry
   - Sidebar item ID
   - Must be identical!

---

## Common Mistakes & Fixes

| Issue                 | Fix                                                |
| --------------------- | -------------------------------------------------- |
| Clicking doesn't work | Check IDs match between sidebar and registry       |
| Styling wrong         | Verify theme provider wraps app                    |
| Component not loading | Check feature registered in featureRegistration.ts |
| Redux not updating    | Ensure Redux store initialized                     |
| Icons not showing     | Use emoji or import icon component                 |

---

## Styling Tips

```typescript
const StyledDiv = styled.div`
  /* Use theme variables */
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.fonts.family};

  /* Responsive */
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;
```

---

## Component Template

```typescript
import React from 'react';
import styled from 'styled-components';
import { FeatureComponentProps } from '../../layout/DashboardWorkspace/FeatureRegistry';

const Container = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  overflow-y: auto;
  height: 100%;
`;

export const YourFeature: React.FC<FeatureComponentProps> = (props) => {
  const { featureId, featureData, isActive, onClose } = props;

  return (
    <Container>
      <h1>Welcome to {featureId}</h1>
      {featureData && <p>Data: {JSON.stringify(featureData)}</p>}
    </Container>
  );
};
```

---

## Next Features to Build

1. **Linda WhatsApp Sidebar**
2. **Admin Dashboard Sidebar**
3. **Analytics Sidebar**
4. **User Management Sidebar**
5. **Settings Sidebar**

Each follows the same 3-step pattern!

---

## Commands You'll Need

```bash
# Start your app
npm start

# Build for production
npm build

# Run tests
npm test

# Check for errors
npm run lint
```

---

## Still Stuck?

1. Check the example: `MaryInventorySidebarExample.tsx`
2. Review theme: `src/styles/theme.ts`
3. Check Redux: `src/store/slices/sidebarUISlice.ts`
4. Read full guide: `BUILDING_YOUR_FIRST_SIDEBAR.md`

---

**You've got this!** 🚀 Build amazing sidebars!
