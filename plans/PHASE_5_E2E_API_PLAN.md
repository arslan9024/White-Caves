---
title: "Phase 5 - E2E Testing & Real API Integration Plan"
author: Development Team
date: 2026-01-21
version: 1.0
---

# Phase 5: E2E Testing & Real API Integration

**Status:** 🚀 **READY TO START**
**Target Completion:** 1-2 weeks
**Priority Level:** HIGH

---

## 📋 Phase 5 Overview

Phase 5 focuses on:
1. ✅ End-to-End testing with Cypress
2. ✅ Real API integration (replacing mock data)
3. ✅ Integration testing for Redux + API
4. ✅ Performance optimization
5. ✅ Production readiness

---

## 🎯 Phase 5 Objectives

### Objective 1: E2E Testing Suite
```
Status: ⏳ PENDING
Priority: HIGH
Effort: 3-4 days
Deliverables: 20+ E2E tests, test documentation
```

**Tasks:**
- [ ] Set up Cypress test environment
- [ ] Create login/authentication tests
- [ ] Test sidebar navigation
- [ ] Test department view rendering
- [ ] Test KPI card interactions
- [ ] Test chart rendering and responsiveness
- [ ] Test date range filters
- [ ] Test data export functionality
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test accessibility (keyboard navigation, ARIA labels)
- [ ] Test error states and loading states
- [ ] Test API failure scenarios

**Expected Tests:** 20-30 test cases

### Objective 2: Real API Integration
```
Status: ⏳ PENDING
Priority: HIGH
Effort: 4-5 days
Deliverables: API integration, real data hookups
```

**Tasks:**
- [ ] Document current API endpoints
- [ ] Create API service layer (replace mock)
- [ ] Implement authentication/token management
- [ ] Implement error handling
- [ ] Implement retry logic
- [ ] Implement caching strategy
- [ ] Implement loading states
- [ ] Create API configuration
- [ ] Test with real data
- [ ] Monitor API performance

### Objective 3: Integration Testing
```
Status: ⏳ PENDING
Priority: MEDIUM
Effort: 3-4 days
Deliverables: Integration tests, documentation
```

**Tasks:**
- [ ] Write Redux + API integration tests
- [ ] Test component + Redux binding
- [ ] Test async operations
- [ ] Test error scenarios
- [ ] Test data transformation
- [ ] Test state management
- [ ] Create integration test guide

---

## 🏗️ Architecture - Phase 5

### Current Architecture (Phase 4)
```
App
├── Redux Store (Mock Data)
│   ├── departmentSlice
│   ├── sidebarSlice
│   └── uiSlice
├── Components (UI Layer)
│   ├── KPICard
│   ├── Charts
│   ├── Filters
│   └── Department Views
└── Mock API (Test Data)
    ├── departmentData.ts
    └── apiHandler.ts
```

### Target Architecture (Phase 5)
```
App
├── Redux Store (Real Data)
│   ├── departmentSlice
│   ├── sidebarSlice
│   └── apiSlice (RTK Query) ← NEW
├── API Layer (Service) ← NEW
│   ├── API client (axios/fetch)
│   ├── Authentication
│   ├── Error handling
│   └── Caching
├── Components (UI Layer)
│   ├── KPICard
│   ├── Charts
│   ├── Filters
│   └── Department Views
└── Mock API (Fallback for testing)
```

---

## 📊 E2E Testing Plan

### Part 1: Test Infrastructure Setup

**File:** `cypress/support/index.js`
```typescript
// Custom commands
cy.login(username, password)
cy.navigateToDepartment(dept)
cy.selectDateRange(from, to)
cy.exportData(format)
cy.checkKPIValue(label, expectedValue)
```

**File:** `cypress/fixtures/test-data.json`
```json
{
  "users": {
    "admin": { "email": "admin@test.com", "password": "test123" },
    "user": { "email": "user@test.com", "password": "test123" }
  },
  "departments": ["SALES", "FINANCE", "HR", "OPERATIONS"]
}
```

### Part 2: E2E Test Suites

#### Test Suite 1: Authentication Tests
**File:** `cypress/e2e/01-auth.cy.ts`

```typescript
describe('Authentication', () => {
  it('should login successfully with valid credentials', () => {
    cy.login('admin@test.com', 'password');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.login('invalid@test.com', 'wrong');
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login('admin@test.com', 'password');
    cy.findByRole('button', { name: /logout/i }).click();
    cy.url().should('include', '/login');
  });

  it('should redirect to login when not authenticated', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});
```

#### Test Suite 2: Navigation Tests
**File:** `cypress/e2e/02-navigation.cy.ts`

```typescript
describe('Navigation', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
  });

  it('should render left sidebar with departments', () => {
    cy.get('[data-testid="left-sidebar"]').should('exist');
    cy.get('[data-testid="sidebar-section-Departments"]').should('exist');
    cy.contains('Sales').should('be.visible');
    cy.contains('Finance').should('be.visible');
    cy.contains('HR').should('be.visible');
  });

  it('should navigate to department when clicked', () => {
    cy.contains('Sales').click();
    cy.url().should('include', '/departments/sales');
    cy.contains('Sales Department').should('be.visible');
  });

  it('should highlight active department', () => {
    cy.contains('Finance').click();
    cy.get('[data-testid="sidebar-item-FINANCE"]')
      .should('have.attr', 'data-active', 'true');
  });

  it('should maintain sidebar state on refresh', () => {
    cy.contains('HR').click();
    cy.reload();
    cy.get('[data-testid="sidebar-item-HR"]')
      .should('have.attr', 'data-active', 'true');
  });
});
```

#### Test Suite 3: Department View Tests
**File:** `cypress/e2e/03-department-views.cy.ts`

```typescript
describe('Department Views', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
    cy.contains('Sales').click();
  });

  it('should render KPI cards', () => {
    cy.get('[data-testid="kpi-card"]').should('have.length.at.least', 4);
  });

  it('should display KPI values correctly', () => {
    cy.get('[data-testid="kpi-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="kpi-label"]').should('be.visible');
        cy.get('[data-testid="kpi-value"]').should('be.visible');
        cy.get('[data-testid="kpi-change"]').should('be.visible');
      });
  });

  it('should render charts', () => {
    cy.get('[data-testid="chart"]').should('have.length.at.least', 2);
  });

  it('should respond to KPI card clicks', () => {
    cy.get('[data-testid="kpi-card"]').first().click();
    // Should show detail or navigate to details view
  });

  it('should load data from API', () => {
    // Intercept API call
    cy.intercept('GET', '/api/departments/SALES/data*', {
      statusCode: 200,
      body: { /* mock data */ }
    });
    cy.contains('Sales').click();
    // Verify data is displayed
  });
});
```

#### Test Suite 4: Filter & Export Tests
**File:** `cypress/e2e/04-filters-export.cy.ts`

```typescript
describe('Filters & Export', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
    cy.contains('Sales').click();
  });

  it('should filter data by date range', () => {
    cy.get('[data-testid="date-range-filter"]').should('exist');
    cy.contains('button', 'Today').click();
    // Verify data is filtered
  });

  it('should support custom date range', () => {
    cy.get('[data-testid="custom-date-start"]').type('2024-01-01');
    cy.get('[data-testid="custom-date-end"]').type('2024-01-31');
    cy.contains('button', 'Apply').click();
    // Verify data is filtered
  });

  it('should export data to CSV', () => {
    cy.get('[data-testid="export-button"]').click();
    cy.contains('CSV').click();
    // Verify file download
  });

  it('should export data to Excel', () => {
    cy.get('[data-testid="export-button"]').click();
    cy.contains('Excel').click();
    // Verify file download
  });

  it('should export data to PDF', () => {
    cy.get('[data-testid="export-button"]').click();
    cy.contains('PDF').click();
    // Verify file download
  });
});
```

#### Test Suite 5: Responsive Design Tests
**File:** `cypress/e2e/05-responsive.cy.ts`

```typescript
describe('Responsive Design', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
  });

  // Mobile (320px)
  it('should render correctly on mobile', () => {
    cy.viewport('iphone-12');
    cy.contains('Sales').click();
    cy.get('[data-testid="kpi-card"]').should('be.visible');
    // Verify stacked layout
  });

  // Tablet (768px)
  it('should render correctly on tablet', () => {
    cy.viewport('ipad-2');
    cy.contains('Sales').click();
    cy.get('[data-testid="kpi-card"]').should('be.visible');
    // Verify 2-column layout
  });

  // Desktop (1200px+)
  it('should render correctly on desktop', () => {
    cy.viewport('macbook-15');
    cy.contains('Sales').click();
    cy.get('[data-testid="kpi-card"]').should('be.visible');
    // Verify full layout
  });

  it('should hide sidebar on mobile', () => {
    cy.viewport('iphone-12');
    cy.get('[data-testid="left-sidebar"]').should('not.be.visible');
  });
});
```

#### Test Suite 6: Accessibility Tests
**File:** `cypress/e2e/06-accessibility.cy.ts`

```typescript
describe('Accessibility', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
  });

  it('should navigate with keyboard', () => {
    cy.get('body').tab(); // Focus first interactive element
    // Tab through sidebar items
    cy.focused().should('have.attr', 'role', 'button');
  });

  it('should have proper ARIA labels', () => {
    cy.get('[data-testid="kpi-card"]')
      .should('have.attr', 'role');
    cy.get('[data-testid="export-button"]')
      .should('have.attr', 'aria-label');
  });

  it('should have proper heading hierarchy', () => {
    cy.get('h1').should('have.length.at.least', 1);
    cy.get('h2').should('have.length.at.least', 1);
  });

  it('should have sufficient color contrast', () => {
    // Check color contrast ratios
    cy.checkA11y();
  });
});
```

#### Test Suite 7: Error Handling Tests
**File:** `cypress/e2e/07-error-handling.cy.ts`

```typescript
describe('Error Handling', () => {
  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '/api/departments/*', {
      statusCode: 500,
      body: { message: 'Server error' }
    });
    cy.login('admin@test.com', 'password');
    cy.contains('Sales').click();
    cy.contains('Error loading data').should('be.visible');
  });

  it('should show loading state', () => {
    cy.intercept('GET', '/api/departments/*', (req) => {
      req.reply((res) => {
        res.delay(2000); // Delay response
      });
    });
    cy.login('admin@test.com', 'password');
    cy.contains('Sales').click();
    cy.contains('Loading').should('be.visible');
  });

  it('should handle network timeout', () => {
    cy.intercept('GET', '/api/departments/*', (req) => {
      req.reply((res) => {
        res.delay(10000); // Long delay
        res.error('timeout');
      });
    });
    cy.login('admin@test.com', 'password');
    cy.contains('Sales').click();
    cy.contains('Request timeout').should('be.visible');
  });

  it('should handle no data', () => {
    cy.intercept('GET', '/api/departments/*', {
      statusCode: 200,
      body: { data: null }
    });
    cy.login('admin@test.com', 'password');
    cy.contains('Sales').click();
    cy.contains('No data available').should('be.visible');
  });
});
```

---

## 🔌 Real API Integration Plan

### Step 1: Create API Service Layer

**File:** `src/services/apiClient.ts`
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 2: Create API Endpoints

**File:** `src/services/departmentAPI.ts`
```typescript
import apiClient from './apiClient';

export const departmentAPI = {
  // Get all departments
  getAllDepartments: async () => {
    const response = await apiClient.get('/departments');
    return response.data;
  },

  // Get department data
  getDepartmentData: async (code: string) => {
    const response = await apiClient.get(`/departments/${code}/data`);
    return response.data;
  },

  // Get department KPIs
  getDepartmentKPIs: async (code: string, dateRange?: { from: string; to: string }) => {
    const response = await apiClient.get(`/departments/${code}/kpis`, {
      params: dateRange,
    });
    return response.data;
  },

  // Get department trends
  getDepartmentTrends: async (code: string, timeframe: string) => {
    const response = await apiClient.get(`/departments/${code}/trends`, {
      params: { timeframe },
    });
    return response.data;
  },

  // Export department data
  exportDepartmentData: async (code: string, format: 'csv' | 'excel' | 'pdf') => {
    const response = await apiClient.get(`/departments/${code}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};
```

### Step 3: Update Redux Slices with RTK Query

**File:** `src/store/slices/departmentSlice.ts` (updated with RTK Query)
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { departmentAPI } from '../../services/departmentAPI';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await departmentAPI.getAllDepartments();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentData = createAsyncThunk(
  'departments/fetchData',
  async (code: string, { rejectWithValue }) => {
    try {
      const data = await departmentAPI.getDepartmentData(code);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departmentSlice.reducer;
```

### Step 4: Create API Hooks

**File:** `src/hooks/useDepartmentAPI.ts`
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDepartments, fetchDepartmentData } from '../store/slices/departmentSlice';

export const useDepartments = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return { data, loading, error };
};

export const useDepartmentData = (code: string) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.departments);

  useEffect(() => {
    if (code) {
      dispatch(fetchDepartmentData(code));
    }
  }, [code, dispatch]);

  return { data: data[code], loading, error };
};
```

---

## 🧪 Integration Testing Strategy

### Test File: `src/integration/__tests__/redux-api.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'redux';
import departmentReducer from '../../store/slices/departmentSlice';
import { fetchDepartments, fetchDepartmentData } from '../../store/slices/departmentSlice';

describe('Redux + API Integration', () => {
  let store;

  beforeEach(() => {
    // Mock API calls
    vi.mock('../../services/departmentAPI', () => ({
      departmentAPI: {
        getAllDepartments: vi.fn(() => Promise.resolve([
          { code: 'SALES', name: 'Sales' },
        ])),
        getDepartmentData: vi.fn((code) => Promise.resolve({
          code,
          kpis: [],
        })),
      },
    }));
  });

  it('should fetch departments and update state', async () => {
    await store.dispatch(fetchDepartments());
    const state = store.getState();
    expect(state.departments.data).toBeDefined();
  });

  it('should handle API errors', async () => {
    // Mock API error
    vi.mocked(departmentAPI.getAllDepartments).mockRejectedValue(
      new Error('API Error')
    );
    
    await store.dispatch(fetchDepartments());
    const state = store.getState();
    expect(state.departments.error).toBeDefined();
  });

  it('should show loading state while fetching', async () => {
    const promise = store.dispatch(fetchDepartments());
    let state = store.getState();
    expect(state.departments.loading).toBe(true);
    
    await promise;
    state = store.getState();
    expect(state.departments.loading).toBe(false);
  });
});
```

---

## 📋 Implementation Checklist

### Week 1: E2E Testing
- [ ] Set up Cypress
- [ ] Create test fixtures
- [ ] Write 7 test suites (20+ tests)
- [ ] Configure CI/CD for E2E tests
- [ ] Document test procedures

### Week 2: API Integration
- [ ] Create API service layer
- [ ] Implement API endpoints
- [ ] Add error handling
- [ ] Update Redux slices
- [ ] Create API hooks
- [ ] Test with real API
- [ ] Performance monitoring

### Week 3: Final Testing & Optimization
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Deploy to staging

---

## 🚀 Expected Outcomes

### After Phase 5
```
✅ 20+ E2E test cases
✅ 100% API integration
✅ Real data flowing through Redux
✅ Error handling in place
✅ Loading states implemented
✅ Production-ready application
✅ Comprehensive test coverage
✅ Performance optimized
✅ Staging deployment ready
```

---

## 📊 Success Metrics

```
Build Time:           < 5 seconds
E2E Test Duration:    < 2 minutes
API Response Time:    < 500ms
Error Rate:          < 0.1%
Test Coverage:       > 80%
Accessibility Score: > 90
Performance Score:   > 85
```

---

## 🔗 Phase 5 Next Steps

### Immediate (Today)
1. ✅ Fix all build errors
2. ⏳ Set up Cypress environment
3. ⏳ Create test infrastructure

### Short Term (This Week)
1. ⏳ Write E2E test suites
2. ⏳ Create API service layer
3. ⏳ Implement error handling

### Medium Term (Next Week)
1. ⏳ Run all E2E tests
2. ⏳ Full API integration
3. ⏳ Integration testing

### Long Term (Deployment)
1. ⏳ Staging environment
2. ⏳ Production deployment
3. ⏳ Monitoring setup

---

## 📞 Summary

**Phase 5 is the critical bridge between development and production.**

This phase ensures:
- ✅ All features work end-to-end
- ✅ Real data integrates seamlessly
- ✅ Error handling is robust
- ✅ Performance is optimized
- ✅ Application is production-ready

**Ready to begin E2E Testing & API Integration!** 🚀

---

Report Generated: January 21, 2026
Status: READY TO START
Difficulty: MEDIUM
Est. Duration: 2 weeks
