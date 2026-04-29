---
title: "Phase 5 Quick Reference - Commands & Templates"
author: Development Team
date: 2026-01-21
version: 1.0
---

# Phase 5 Quick Reference Guide

**Fast-access guide for Phase 5 implementation**
**Includes: Commands, Templates, Code Snippets, Troubleshooting**

---

## 🚀 Quick Start Commands

### E2E Testing Setup
```bash
# Install Cypress
npm install cypress --save-dev

# Initialize Cypress
npx cypress open

# Run E2E tests
npm run test:e2e

# Run tests headless (CI/CD)
npm run test:e2e:headless

# Run specific test file
npx cypress run --spec "cypress/e2e/01-auth.cy.ts"
```

### API Integration Setup
```bash
# Install axios (if not installed)
npm install axios

# Create necessary directories
mkdir -p src/services src/config

# Build project
npm run build

# Run integration tests
npm run test:integration
```

### Build & Deploy
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Check build errors
npm run build 2>&1 | grep "error"
```

---

## 📝 Code Templates

### Template 1: Cypress Test File

```typescript
// cypress/e2e/[name].cy.ts

import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.login('email@test.com', 'password');
    cy.visit('/dashboard');
  });

  it('should test something', () => {
    // Arrange - Set up test data
    cy.get('[data-testid="button"]').should('exist');

    // Act - Perform action
    cy.get('[data-testid="button"]').click();

    // Assert - Check results
    cy.contains('Success').should('be.visible');
  });

  it('should handle error state', () => {
    // Intercept API to return error
    cy.intercept('GET', '/api/**', {
      statusCode: 500,
      body: { message: 'Server error' }
    });

    cy.get('[data-testid="button"]').click();
    cy.contains('Error occurred').should('be.visible');
  });
});
```

### Template 2: API Service Class

```typescript
// src/services/[feature]Service.ts

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

class [Feature]Service {
  async getAll() {
    try {
      const data = await apiClient.get(API_ENDPOINTS.[feature].list);
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.[feature].get(id));
      return data;
    } catch (error) {
      console.error(`Error fetching item ${id}:`, error);
      throw error;
    }
  }

  async create(item: any) {
    try {
      const data = await apiClient.post(API_ENDPOINTS.[feature].create, item);
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }
}

export const [feature]Service = new [Feature]Service();
```

### Template 3: Redux Slice with API

```typescript
// src/store/slices/[feature]Slice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { [feature]Service } from '../../services/[feature]Service';

export const fetchAll = createAsyncThunk(
  '[feature]/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await [feature]Service.getAll();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const [feature]Slice = createSlice({
  name: '[feature]',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = [feature]Slice.actions;
export default [feature]Slice.reducer;
```

### Template 4: Custom Hook

```typescript
// src/hooks/use[Feature].ts

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAll } from '../store/slices/[feature]Slice';
import { RootState } from '../store';

export const use[Feature] = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => ({
      data: state.[feature].data,
      loading: state.[feature].loading,
      error: state.[feature].error,
    })
  );

  useEffect(() => {
    if (data.length === 0) {
      dispatch(fetchAll() as any);
    }
  }, [dispatch, data.length]);

  return { data, loading, error };
};
```

### Template 5: Component Using Real API

```typescript
// src/components/[Feature].tsx

import React from 'react';
import { use[Feature] } from '../hooks/use[Feature]';
import { LoadingState, ErrorState, EmptyState } from './states';

export const [Feature]: React.FC = () => {
  const { data, loading, error } = use[Feature]();

  if (loading) {
    return <LoadingState message="Loading data..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState message="No data available" />;
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default [Feature];
```

---

## 🧪 Testing Templates

### Test 1: Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Test 2: API Mock Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { departmentService } from '../../services/departmentService';

vi.mock('../../services/apiClient', () => ({
  apiClient: {
    get: vi.fn(() => Promise.resolve({ departments: [] })),
  },
}));

describe('Department Service', () => {
  it('should fetch departments', async () => {
    const departments = await departmentService.getAllDepartments();
    expect(Array.isArray(departments)).toBe(true);
  });
});
```

### Test 3: Redux Integration Test

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import departmentReducer, { fetchAll } from '../../store/slices/[feature]Slice';

describe('Redux Integration', () => {
  it('should handle async action', async () => {
    const store = configureStore({
      reducer: { [feature]: departmentReducer },
    });

    await store.dispatch(fetchAll() as any);
    const state = store.getState();
    expect(state.[feature].loading).toBe(false);
  });
});
```

---

## 🔧 Configuration Templates

### API Config Template

```typescript
// src/config/apiConfig.ts

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  TIMEOUT: 30000,
  RETRY: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },
  CACHE: {
    enabled: true,
    ttl: 5 * 60 * 1000,
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  // Add more endpoints
};
```

### Environment Variables Template

```
# .env

# API Configuration
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_USE_REAL_API=true
REACT_APP_USE_MOCK_API=false

# Logging
REACT_APP_LOG_LEVEL=debug

# Firebase (if using)
REACT_APP_FIREBASE_API_KEY=...
```

---

## ⚡ Common Operations

### Debug API Call

```typescript
// In any component or service
console.log('[API] Calling:', endpoint);
console.log('[API] Payload:', data);

// Use DevTools Network tab
// Set breakpoint in browser DevTools
debugger; // Code pauses here
```

### Intercept API in Tests

```typescript
// Cypress
cy.intercept('GET', '/api/departments', {
  statusCode: 200,
  body: { departments: [] }
});

// Mock in unit tests
vi.mock('../../services/apiClient');
```

### Handle Loading State

```typescript
if (loading) {
  return <LoadingState message="Loading..." />;
}
```

### Handle Error State

```typescript
if (error) {
  return <ErrorState error={error} retry={retry} />;
}
```

### Handle Empty State

```typescript
if (!data || data.length === 0) {
  return <EmptyState message="No data available" />;
}
```

---

## 🐛 Troubleshooting

### Problem 1: API Call Fails with 401

**Cause:** Authentication token expired or missing

**Solution:**
```typescript
// In API client interceptor
if (error.response?.status === 401) {
  // Refresh token
  const newToken = await refreshAuthToken();
  // Retry request with new token
}
```

### Problem 2: CORS Error

**Cause:** API doesn't allow requests from frontend

**Solution:**
```typescript
// 1. Update API to accept CORS
// 2. Or proxy in development
// In vite.config.js:
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
      }
    }
  }
}
```

### Problem 3: Tests Timeout

**Cause:** API call takes too long

**Solution:**
```typescript
// Increase timeout
cy.intercept('GET', '/api/**', { delay: 5000 });

// Or set longer timeout
cy.get('[data-testid="button"]', { timeout: 10000 }).click();
```

### Problem 4: State Not Updating

**Cause:** Redux action not dispatching

**Solution:**
```typescript
// 1. Check dispatch is called
console.log('Dispatching:', action);

// 2. Check reducer is handling action
case 'ACTION_TYPE': 
  return { ...state, data: action.payload };

// 3. Check component is connected to Redux
export default connect(mapStateToProps)(Component);
```

### Problem 5: Build Fails

**Cause:** Type errors or missing imports

**Solution:**
```bash
# Check specific errors
npm run build 2>&1 | grep "error"

# Fix TypeScript errors
npm run build --fix

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Performance Tips

### Tip 1: Cache API Responses

```typescript
const cachedData = new Map();

function getCachedData(key: string) {
  return cachedData.get(key);
}

function setCachedData(key: string, data: any) {
  cachedData.set(key, data);
}
```

### Tip 2: Debounce API Calls

```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
  departmentService.search(query);
}, 300);
```

### Tip 3: Lazy Load Data

```typescript
const { data } = useDepartmentData(code);

useEffect(() => {
  if (data && data.details) {
    // Load details when needed
  }
}, [data]);
```

### Tip 4: Optimize Bundle

```typescript
// Use dynamic imports
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingState />}>
  <HeavyComponent />
</Suspense>
```

---

## 📋 File Checklist

### Phase 5A (E2E Testing)
- [ ] `cypress/cypress.config.ts` - Configuration
- [ ] `cypress/e2e/*.cy.ts` - Test files
- [ ] `cypress/fixtures/test-data.json` - Test data
- [ ] `cypress/support/commands.ts` - Custom commands
- [ ] `.gitignore` - Updated for cypress

### Phase 5B (API Integration)
- [ ] `src/config/apiConfig.ts` - API configuration
- [ ] `src/services/apiClient.ts` - HTTP client
- [ ] `src/services/departmentService.ts` - API service
- [ ] `src/store/slices/departmentSlice.ts` - Redux (updated)
- [ ] `src/hooks/useRealAPI.ts` - Custom hooks
- [ ] `.env` - Environment variables

### Testing & Documentation
- [ ] `src/integration/__tests__/*.test.ts` - Integration tests
- [ ] `plans/PHASE_5_E2E_API_PLAN.md` - Plan (✅ done)
- [ ] `plans/REAL_API_INTEGRATION_GUIDE.md` - Guide (✅ done)
- [ ] `README.md` - Updated documentation

---

## 🎯 Phase 5 Decision Tree

```
START
  │
  ├─ Want to start with E2E testing?
  │   YES → Go to E2E Testing Setup
  │   NO  → Continue
  │
  ├─ Want to start with API integration?
  │   YES → Go to API Integration Setup
  │   NO  → Continue
  │
  └─ Want to do both in parallel?
      YES → Do both setup sections
      NO  → Choose one and start
```

---

## 📞 Getting Help

### If test fails:
1. Check test file syntax
2. Verify element exists with correct selector
3. Check for async issues (missing await/cy.wait)
4. Use `cy.debug()` to inspect state
5. Check browser console for errors

### If API call fails:
1. Check endpoint URL is correct
2. Verify auth token is present
3. Check API server is running
4. Use browser DevTools Network tab
5. Check API response status/format

### If build fails:
1. Check TypeScript errors: `npm run build`
2. Check for missing imports
3. Clear cache: `rm -rf .next dist node_modules/.vite`
4. Reinstall: `npm install`
5. Check environment variables

---

## ✅ Success Checklist

### E2E Testing
- [ ] Cypress installed and configured
- [ ] Test files created with examples
- [ ] Custom commands implemented
- [ ] Tests running successfully
- [ ] CI/CD integration (optional)

### API Integration
- [ ] API client created with interceptors
- [ ] API service layer implemented
- [ ] Redux slices updated
- [ ] Custom hooks created
- [ ] Components updated to use real API
- [ ] Integration tests passing
- [ ] Real API data flowing through

### Ready for Deployment
- [ ] All tests passing
- [ ] Build succeeds with no errors
- [ ] No TypeScript warnings
- [ ] Environment variables configured
- [ ] API documentation updated
- [ ] Staging environment tested
- [ ] Production deployment ready

---

Report Generated: January 21, 2026
Type: Quick Reference Guide
Status: READY TO USE
