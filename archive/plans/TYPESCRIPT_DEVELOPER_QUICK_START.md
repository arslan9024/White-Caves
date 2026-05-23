# 📚 TYPESCRIPT DEVELOPER QUICK START GUIDE
## White Caves CRM Platform - Post-Migration

**Created:** March 12, 2026  
**Audience:** Development Team  
**Purpose:** Quick reference for working with the new TypeScript codebase

---

## ⚡ Quick Facts

| Item | Details |
|------|---------|
| **TypeScript Version** | 5.x (strict mode enabled) |
| **React Version** | 18.x |
| **File Extension** | All .tsx (React components) and .ts (utilities) |
| **IDE** | Full autocomplete & type checking support |
| **Build** | `npm run build` (7.33s) |
| **Development** | `npm run dev` (localhost:5000) |
| **Testing** | `npm run test` (181 tests) |

---

## 🗂️ Project Structure

```
src/
├── pages/                          # Application pages (all .tsx)
│   ├── HomePage.tsx               # Home page
│   ├── PropertiesPage.tsx         # Properties listing
│   ├── AboutPage.tsx              # About page
│   └── buyer/                     # Buyer role dashboards
│   ├── seller/                    # Seller role dashboards
│   ├── owner/                     # Owner role dashboards
│   └── ...                        # Other role dashboards
│
├── components/                    # Reusable components (all .tsx)
│   ├── layout/                   # Layout components
│   │   ├── AppLayout.tsx         # Main layout (imported by all pages)
│   │   ├── TopNavBar.tsx
│   │   ├── UnifiedDashboardLayout.tsx
│   │   └── ...
│   │
│   ├── common/                   # Common UI components
│   │   ├── DataCard.tsx
│   │   ├── LeadCard.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── index.tsx            # Barrel export
│   │   └── ...
│   │
│   ├── homepage/                # Homepage sections
│   │   ├── Hero/
│   │   ├── Features/
│   │   ├── Locations/
│   │   └── ...
│   │
│   ├── crm/                     # CRM modules
│   │   ├── AuroraCTODashboard_NEW/
│   │   ├── HazelFrontendCRM_NEW/
│   │   └── ...
│   │
│   └── ...
│
├── store/                        # Redux state management (all .tsx)
│   ├── store.tsx                # Store configuration
│   ├── authSlice.tsx           # Authentication state
│   ├── dashboardSlice.tsx      # Dashboard state
│   ├── propertySlice.tsx       # Property state
│   ├── freelancerSlice.tsx     # Freelancer state
│   ├── clientSlice.tsx         # Client state
│   ├── commissionSlice.tsx     # Commission state
│   ├── notificationSlice.tsx   # Notification state
│   ├── middleware/
│   │   └── eventBusMiddleware.tsx
│   └── ...                     # Other slices
│
├── styles/                      # Global styles
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── tokens.ts
│   │   └── ...
│   └── globals.css
│
└── utils/                       # Utility functions (types: .ts)
    ├── helpers.ts
    ├── formatters.ts
    └── ...
```

---

## 🎯 Common Tasks

### Creating a New Page

```typescript
// src/pages/MyNewPage.tsx

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';

// Define props interface for clarity
interface MyNewPageProps {
  // Add any page-specific props here (usually empty for pages)
}

// Use React.FC for type safety
const MyNewPage: FC<MyNewPageProps> = () => {
  // All hooks are properly typed
  const someData = useSelector((state: RootState) => state.someSlice.data);

  return (
    <AppLayout>
      <div>
        {/* Your page content */}
      </div>
    </AppLayout>
  );
};

export default MyNewPage;
```

**Key practices:**
- ✅ Always define `Props` interface
- ✅ Use `React.FC<Props>`
- ✅ Use `useSelector` with explicit state type
- ✅ Import `AppLayout` for consistent layout

### Creating a New Component

```typescript
// src/components/MyComponent.tsx

import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

// Define props interface first
interface MyComponentProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

// Typed styled component
const StyledContainer = styled.div<{ disabled: boolean }>`
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

// Component with full type safety
const MyComponent: FC<MyComponentProps> = ({
  title,
  children,
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <StyledContainer
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      className={className}
    >
      <h2>{title}</h2>
      {children}
    </StyledContainer>
  );
};

export default MyComponent;
```

**Key practices:**
- ✅ Props interface **before** component
- ✅ Use `FC` for function components
- ✅ Type styled-components with generics
- ✅ Use optional chaining for optional props

### Adding to Redux Store

```typescript
// src/store/mySlice.tsx

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define state interface
interface MySliceState {
  items: string[];
  loading: boolean;
  error: string | null;
}

// Initial state (typed)
const initialState: MySliceState = {
  items: [],
  loading: false,
  error: null,
};

// Create slice with type safety
const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    // Typed reducer
    setItems: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
    },
    // Another reducer
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Export actions
export const { setItems, setLoading } = mySlice.actions;

// Export reducer
export default mySlice.reducer;

// Export typed selector
export const selectItems = (state: RootState) => state.mySlice.items;
export const selectLoading = (state: RootState) => state.mySlice.loading;
```

**Key practices:**
- ✅ Define `State` interface
- ✅ Use `PayloadAction<T>` for action types
- ✅ Create typed selectors
- ✅ Export both actions and reducer

### Using Redux in Components

```typescript
// Inside a component

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setItems, selectItems } from '../store/mySlice';

const MyComponent: FC = () => {
  // Typed selector
  const items = useSelector(selectItems);
  
  // Typed dispatch
  const dispatch = useDispatch<AppDispatch>();
  
  const handleAddItem = (item: string) => {
    dispatch(setItems([...items, item]));
  };
  
  return (
    <div>
      {items.map(item => <div key={item}>{item}</div>)}
    </div>
  );
};
```

**Best practices:**
- ✅ Use selectors (not inline selectors)
- ✅ Type dispatch with `AppDispatch`
- ✅ Clear action dispatches

---

## 🔍 Working with Types

### Type Inference (Let TypeScript Figure It Out)

```typescript
// ✅ Good - TypeScript infers types
const numbers = [1, 2, 3];  // Type: number[]
const name = "John";        // Type: string
const active = true;        // Type: boolean

// Function return type inferred
const add = (a: number, b: number) => {
  return a + b;  // Return type: number (inferred)
};
```

### Explicit Types (When Needed)

```typescript
// ✅ Good - Explicit when helpful
const users: User[] = [];
const status: 'active' | 'inactive' | 'pending' = 'active';
const config: Record<string, string> = {};
```

### Avoid `any` Type

```typescript
// ❌ Bad - Any type loses safety
const item: any = getData();
item.unknownProperty.nested.value;  // No type checking!

// ✅ Good - Define proper type
interface Item {
  id: string;
  name: string;
}
const item: Item = getData();
item.name;  // ✓ Type-safe
```

### Union Types

```typescript
// ✅ Good - Union types for multiple options
type Status = 'pending' | 'success' | 'error';
type Response = UserData | ErrorData;

const handleStatus = (status: Status) => {
  if (status === 'pending') {
    // ...
  } else if (status === 'success') {
    // ...
  }
};
```

### Generic Types

```typescript
// ✅ Good - Generics for reusable types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: string;
  name: string;
}

// Usage
const userResponse: ApiResponse<User> = {
  data: { id: '1', name: 'John' },
  status: 200,
  message: 'Success',
};
```

---

## 🐛 Debugging TypeScript Errors

### Common Error: "Type X is not assignable to type Y"

```typescript
// ❌ Error
const user: User = {
  id: '1',
  name: 'John',
  email: 'john@example.com'  // Error if User doesn't have email
};

// ✅ Fix - Check interface
interface User {
  id: string;
  name: string;
  email: string;  // Add missing property
}
```

### Common Error: "Property X does not exist on type Y"

```typescript
// ❌ Error
const handleClick = () => {
  const value = inputRef.current.value;  // Error if not typed
};

// ✅ Fix - Type the ref
const inputRef = useRef<HTMLInputElement>(null);
const value = inputRef.current?.value;  // Optional chaining
```

### Common Error: "Cannot redeclare block-scoped variable"

```typescript
// ❌ Error - File has both .js and .tsx versions
// src/components/MyComponent.js
// src/components/MyComponent.tsx  ← DELETE THIS

// ✅ Fix - Keep only .tsx version
// src/components/MyComponent.tsx  ← ONLY THIS
```

---

## 📦 Import Patterns

### Barrel Exports (Index Files)

```typescript
// src/components/common/index.tsx
// This file re-exports from other files

export { default as DataCard } from './DataCard';
export { default as PropertyCard } from './PropertyCard';
export type { DataCardProps } from './DataCard';

// Usage in other files
import { DataCard, PropertyCard, type DataCardProps } from '../common';
```

### Relative vs Absolute Imports

```typescript
// ✅ Good - Relative imports within same feature
import { useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import { DataCard } from './index';

// ✅ Good - Absolute imports from node_modules
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
```

---

## 🧪 Testing TypeScript Code

### Unit Test Template

```typescript
// src/store/mySlice.test.ts

import { configureStore } from '@reduxjs/toolkit';
import myReducer, { setItems, selectItems } from './mySlice';

describe('mySlice', () => {
  it('should set items', () => {
    const store = configureStore({
      reducer: { mySlice: myReducer },
    });
    
    store.dispatch(setItems(['item1', 'item2']));
    expect(selectItems(store.getState())).toEqual(['item1', 'item2']);
  });
});
```

### Component Test Template

```typescript
// src/components/MyComponent.test.tsx

import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render with title', () => {
    render(<MyComponent title="Test Title">Content</MyComponent>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

---

## 🚀 IDE Features You Can Use Now

### Go to Definition
- **VS Code:** Ctrl+Click or F12
- **PyCharm:** Ctrl+Click or Cmd+Click
- Instantly navigate to type definitions

### Rename Symbol Safely
- **VS Code:** F2 or right-click > Rename Symbol
- All references updated automatically
- Zero risk with TypeScript!

### Quick Info
- **VS Code:** Hover over any variable/function
- Shows: Type, docs, usage
- Complete inline documentation

### Auto-Import
- **VS Code:** Ctrl+Space (autocomplete)
- Imports are auto-added
- No manual import management needed

### Find All References
- **VS Code:** Shift+F12 or right-click > Find All References
- See everywhere a symbol is used
- Perfect for refactoring

### Inline Type Hints
- **VS Code:** Enable Settings > Editor > Inlay Hints
- Types shown inline in code
- Super helpful for learning

---

## 📋 Checklist Before Committing Code

- [ ] All TypeScript errors resolved (`npm run build` passes)
- [ ] Component props properly typed (Props interface)
- [ ] No `any` types used
- [ ] Selectors defined for Redux state
- [ ] Imports use barrel exports (index.tsx)
- [ ] Tests pass (`npm run test -- --run`)
- [ ] No console errors/warnings
- [ ] Component properly exported
- [ ] Styled-components properly typed
- [ ] Logic follows existing patterns

---

## 🆘 Quick Help

### I'm Getting a Type Error

1. **Read the error message carefully** - It usually tells you exactly what's wrong
2. **Hover over the error** - IDE shows the expected type
3. **Check the interface** - Make sure property names match
4. **Use type inference** - Let TypeScript figure out types when possible
5. **Ask in #dev-team Slack** - Link the error, someone will help

### I Need to Create a New Module

1. **Create the component/store file** (.tsx or .ts)
2. **Define the Props/State interface** at the top
3. **Add component with React.FC<Props>**
4. **Export from barrel export** (index.tsx)
5. **Test it** (`npm run test`)
6. **Commit with clear message**

### I Want to Check Types Without Building

```bash
# Check TypeScript without building
npx tsc --noEmit

# This is faster than full build for development
```

### I Accidentally Left .js File

```bash
# Find duplicate files
find src -name "*.js" -o -name "*.jsx" | grep -v node_modules

# Delete the old files (keep .tsx)
rm src/path/to/OldFile.jsx
```

---

## 💡 Pro Tips

### 1. Use Const Assertions for Literal Types
```typescript
// Without assertion - could change at runtime
const status = 'active';  // Type: string

// With assertion - guaranteed literal
const status = 'active' as const;  // Type: 'active'

// Great for enums and fixed values
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];  // Type: 'admin' | 'user' | 'guest'
```

### 2. Use Optional Chaining to Prevent Errors
```typescript
// ❌ Could throw error if user is null
const email = user.profile.contact.email;

// ✅ Safe - returns undefined if any step is null
const email = user?.profile?.contact?.email;
```

### 3. Use Nullish Coalescing for Defaults
```typescript
// ❌ Uses default if value is falsy (0, '', false)
const count = userCount || 0;

// ✅ Uses default only if undefined or null
const count = userCount ?? 0;
```

### 4. Type Guard Functions
```typescript
// Define type guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && 'id' in data && 'name' in data;
}

// Use it
if (isUser(data)) {
  console.log(data.name);  // ✓ Type-safe
}
```

---

## 📞 Getting Help

| Question | Resource |
|----------|----------|
| **TypeScript Syntax** | [TypeScript Docs](https://www.typescriptlang.org/docs/) |
| **React Patterns** | [React Docs](https://react.dev/) |
| **Redux Setup** | Code in `src/store/` + Redux Docs |
| **Component Examples** | Look at `src/components/` files |
| **Team Questions** | #dev-team Slack channel |
| **Code Review** | GitHub PR comments |

---

## ✅ Success Criteria

You're ready to develop when:
- ✅ You can open a .tsx file and understand the types
- ✅ You know where components vs pages vs store live
- ✅ You can create a simple component with typed props
- ✅ You understand Redux slices and how to use them
- ✅ Your IDE shows type errors (that's good!)
- ✅ You can run `npm run build` with no errors

---

**Welcome to enterprise-grade TypeScript development! 🎉**

*If you have questions, check the code in `src/` - all files are examples of proper TypeScript patterns.*