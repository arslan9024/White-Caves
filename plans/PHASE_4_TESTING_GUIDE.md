---
title: Phase 4 Component Testing Guide
author: Development Team
date: 2026-01-21
version: 1.0
---

# Phase 4: Component Testing Guide

## Overview

This guide outlines testing strategies for Phase 4 components:
- KPICard component
- DataVisualization components (BarChart, LineChart, PieChart, ProgressRing)
- DepartmentKPIRenderer utility
- Sample EnhancedSalesDepartmentView

---

## Testing Levels

### 1. Unit Tests

#### KPICard Component Tests

**File:** `src/components/cards/__tests__/KPICard.test.tsx`

```typescript
describe('KPICard Component', () => {
  
  test('renders with required props', () => {
    render(
      <KPICard
        label="Total Sales"
        value="₹2,450,000"
        icon="📊"
      />
    );
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('₹2,450,000')).toBeInTheDocument();
  });

  test('displays change indicator with positive trend', () => {
    render(
      <KPICard
        label="Growth"
        value={100}
        change={12}
        trend="up"
      />
    );
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  test('displays change indicator with negative trend', () => {
    render(
      <KPICard
        label="Costs"
        value={50000}
        change={5}
        trend="down"
      />
    );
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  test('renders progress bar when showProgress is true', () => {
    const { container } = render(
      <KPICard
        label="Capacity"
        value={75}
        showProgress={true}
        progressMax={100}
      />
    );
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
  });

  test('applies custom colors', () => {
    const { container } = render(
      <KPICard
        label="Custom"
        value="100"
        backgroundColor="#ff0000"
        accentColor="#00ff00"
      />
    );
    expect(container.firstChild).toHaveStyle('background: #ff0000');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <KPICard
        label="Clickable"
        value="100"
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('formats unit display', () => {
    render(
      <KPICard
        label="Temperature"
        value="25"
        unit="°C"
      />
    );
    expect(screen.getByText('°C')).toBeInTheDocument();
  });
});
```

#### BarChart Component Tests

```typescript
describe('BarChart Component', () => {
  const mockData = [
    { label: 'Jan', value: 100, color: '#3498db' },
    { label: 'Feb', value: 150, color: '#2ecc71' },
    { label: 'Mar', value: 120, color: '#e74c3c' },
  ];

  test('renders all bars for data points', () => {
    const { container } = render(<BarChart data={mockData} />);
    const bars = container.querySelectorAll('div[style*="height"]');
    expect(bars.length).toBe(mockData.length);
  });

  test('calculates correct bar heights', () => {
    const { container } = render(
      <BarChart data={mockData} maxValue={200} />
    );
    const bars = container.querySelectorAll('div[style*="height"]');
    // Jan: 100/200 = 50%
    expect(bars[0]).toHaveStyle('height: 50%');
    // Feb: 150/200 = 75%
    expect(bars[1]).toHaveStyle('height: 75%');
  });

  test('applies custom max value', () => {
    const { container } = render(
      <BarChart data={mockData} maxValue={100} />
    );
    const bars = container.querySelectorAll('div[style*="height"]');
    // Feb: 150/100 = 100% (capped)
    expect(bars[1]).toHaveStyle('height: 100%');
  });

  test('displays labels for each bar', () => {
    render(<BarChart data={mockData} />);
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  test('handles empty data gracefully', () => {
    const { container } = render(<BarChart data={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
```

#### LineChart Component Tests

```typescript
describe('LineChart Component', () => {
  const mockData = [
    { label: 'Q1', value: 1000 },
    { label: 'Q2', value: 1500 },
    { label: 'Q3', value: 1200 },
    { label: 'Q4', value: 2000 },
  ];

  test('renders SVG element', () => {
    const { container } = render(<LineChart data={mockData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('renders path for line', () => {
    const { container } = render(<LineChart data={mockData} />);
    expect(container.querySelector('path')).toBeInTheDocument();
  });

  test('renders data point circles', () => {
    const { container } = render(<LineChart data={mockData} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(mockData.length);
  });

  test('applies custom color to line', () => {
    const { container } = render(
      <LineChart data={mockData} color="#ff0000" />
    );
    const line = container.querySelector('path');
    expect(line).toHaveAttribute('stroke', '#ff0000');
  });

  test('renders grid lines', () => {
    const { container } = render(<LineChart data={mockData} />);
    const gridLines = container.querySelectorAll(
      'line[stroke="rgba(255, 255, 255, 0.1)"]'
    );
    expect(gridLines.length).toBeGreaterThan(0);
  });
});
```

### 2. Integration Tests

#### DepartmentKPIRenderer Tests

```typescript
describe('DepartmentKPIRenderer', () => {
  test('renders correct number of KPI cards', () => {
    const mockData = {
      totalLeads: 100,
      activeDeals: 10,
      conversionRate: 10,
      monthlyRevenue: 1000000,
    };

    const result = SalesKPIRenderer(mockData);
    const { container } = render(<>{result}</>);
    const cards = container.querySelectorAll('[class*="CardContainer"]');
    expect(cards.length).toBe(4);
  });

  test('formats currency values correctly', () => {
    const mockData = {
      monthlyRevenue: 2450000,
      totalLeads: 0,
      activeDeals: 0,
      conversionRate: 0,
    };

    render(
      <>{SalesKPIRenderer(mockData)}</>
    );
    expect(screen.getByText('₹2.5M')).toBeInTheDocument();
  });

  test('displays all department KPI renderers', () => {
    const testData = {
      totalLeads: 100,
      activeDeals: 10,
      conversionRate: 10,
      monthlyRevenue: 1000000,
      totalBudget: 5000000,
      spent: 2000000,
    };

    const salesKPIs = SalesKPIRenderer(testData);
    const financeKPIs = FinanceKPIRenderer(testData);

    render(
      <>
        {salesKPIs}
        {financeKPIs}
      </>
    );

    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('Total Budget')).toBeInTheDocument();
  });
});
```

#### EnhancedSalesDepartmentView Tests

```typescript
describe('EnhancedSalesDepartmentView', () => {
  const mockState = {
    relationalSidebar: {
      departments: [
        {
          code: 'SALES',
          data: {
            totalLeads: 245,
            activeDeals: 18,
            conversionRate: 7.35,
            monthlyRevenue: 2450000,
          },
        },
      ],
    },
  };

  test('renders with mock data', () => {
    render(
      <Provider store={createMockStore(mockState)}>
        <SalesDepartmentView />
      </Provider>
    );

    expect(screen.getByText('Sales & Leasing')).toBeInTheDocument();
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
  });

  test('renders KPI cards', () => {
    render(
      <Provider store={createMockStore(mockState)}>
        <SalesDepartmentView />
      </Provider>
    );

    expect(screen.getByText('245')).toBeInTheDocument(); // totalLeads
    expect(screen.getByText('18')).toBeInTheDocument(); // activeDeals
  });

  test('renders charts', () => {
    const { container } = render(
      <Provider store={createMockStore(mockState)}>
        <SalesDepartmentView />
      </Provider>
    );

    expect(screen.getByText('Leads by Source')).toBeInTheDocument();
    expect(screen.getByText('Monthly Sales Trend')).toBeInTheDocument();
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
  });

  test('handles missing Redux data gracefully', () => {
    const emptyState = {
      relationalSidebar: {
        departments: [],
      },
    };

    render(
      <Provider store={createMockStore(emptyState)}>
        <SalesDepartmentView />
      </Provider>
    );

    // Should still render with mock data
    expect(screen.getByText('Sales & Leasing')).toBeInTheDocument();
  });
});
```

### 3. Snapshot Tests

```typescript
describe('Snapshot Tests', () => {
  test('KPICard snapshot', () => {
    const { container } = render(
      <KPICard
        label="Total Sales"
        value="₹2,450,000"
        change={12}
        icon="📊"
        trend="up"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('BarChart snapshot', () => {
    const { container } = render(
      <BarChart
        data={[
          { label: 'Jan', value: 100, color: '#3498db' },
          { label: 'Feb', value: 150, color: '#2ecc71' },
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('SalesDepartmentView snapshot', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SalesDepartmentView />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
```

---

## E2E Tests

### Cypress Test Suite

**File:** `cypress/e2e/phase-4-kpi-dashboard.cy.ts`

```typescript
describe('Phase 4: KPI Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard/sales');
  });

  describe('KPI Cards', () => {
    it('should display all sales KPI cards', () => {
      cy.contains('Total Leads').should('be.visible');
      cy.contains('Active Deals').should('be.visible');
      cy.contains('Conversion Rate').should('be.visible');
      cy.contains('Monthly Revenue').should('be.visible');
    });

    it('should display KPI values correctly', () => {
      cy.contains('Total Leads')
        .parent()
        .contains(/\d+/)
        .should('be.visible');
    });

    it('should display trend indicators', () => {
      cy.get('[class*="CardChange"]').should('exist');
    });

    it('should show progress bars', () => {
      cy.get('[class*="ProgressFill"]').should('exist');
    });

    it('should respond to hover interactions', () => {
      cy.contains('Total Leads')
        .parent()
        .parent()
        .trigger('mouseenter')
        .should('have.css', 'transform');
    });
  });

  describe('Charts', () => {
    it('should display bar chart', () => {
      cy.contains('Leads by Source').should('be.visible');
      cy.get('svg').should('exist');
    });

    it('should display line chart', () => {
      cy.contains('Monthly Sales Trend').should('be.visible');
      cy.get('svg').should('have.length.greaterThan', 1);
    });

    it('should show data point circles on line chart', () => {
      cy.get('circle').should('exist');
    });

    it('should have chart labels', () => {
      cy.contains('Jan').should('be.visible');
      cy.contains('Feb').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout on mobile', () => {
      cy.viewport('iphone-12');
      cy.get('[class*="KPIGridContainer"]').should('be.visible');
    });

    it('should adapt layout on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('[class*="SalesContentWrapper"]').should('be.visible');
    });

    it('should work on desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('[class*="SalesContentWrapper"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.contains('h1', 'Sales & Leasing').should('exist');
    });

    it('should have alt text for icons', () => {
      cy.get('svg').should('have.attr', 'role');
    });

    it('should be keyboard navigable', () => {
      cy.get('body').tab();
      cy.focused().should('exist');
    });
  });

  describe('Data Interactions', () => {
    it('should handle KPI card clicks', () => {
      cy.contains('Total Leads')
        .parent()
        .parent()
        .click()
        .should('exist');
    });

    it('should update on data refresh', () => {
      cy.contains('Refresh').click();
      cy.contains('Total Leads').should('be.visible');
    });

    it('should handle missing data gracefully', () => {
      cy.intercept('/api/sales', { body: [] });
      cy.visit('/dashboard/sales');
      cy.contains('No Data Available').should('be.visible');
    });
  });
});
```

---

## Manual Testing Checklist

### KPICard Manual Tests
- [ ] Render with all prop combinations
- [ ] Hover effects work smoothly
- [ ] Trend arrows display correctly (up/down/neutral)
- [ ] Progress bars animate
- [ ] Colors apply correctly
- [ ] Click handlers fire
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible with keyboard navigation
- [ ] Icons display properly

### Chart Manual Tests
- [ ] BarChart renders all bars
- [ ] LineChart draws smooth curves
- [ ] PieChart slices are proportional
- [ ] ProgressRing animates percentage
- [ ] Charts responsive to data changes
- [ ] Hover tooltips appear
- [ ] No console errors
- [ ] Performance acceptable with large datasets

### Department View Manual Tests
- [ ] KPI cards render for each department
- [ ] Charts display relevant data
- [ ] Loading states work
- [ ] Error states display
- [ ] Empty states show when appropriate
- [ ] Data updates on Redux changes
- [ ] Responsive layout adapts
- [ ] Navigation works between departments

---

## Test Execution

### Run Unit Tests
```bash
npm run test:unit
# or
npm run test -- src/components/cards/KPICard.test.tsx
```

### Run Integration Tests
```bash
npm run test:integration
```

### Run E2E Tests
```bash
npm run test:e2e
# or for headed mode
npm run test:e2e:headed
```

### Run All Tests
```bash
npm run test
```

### Coverage Report
```bash
npm run test:coverage
```

---

## Performance Benchmarks

### Target Metrics
- KPICard render time: < 10ms
- BarChart with 20 data points: < 50ms
- LineChart with 50 data points: < 100ms
- Department view full render: < 500ms
- Charts should update on data change: < 200ms

### Profiling
Use React DevTools Profiler:
1. Open React DevTools
2. Go to Profiler tab
3. Record performance session
4. Analyze component render times
5. Identify bottlenecks

---

## Debugging Tips

### Common Issues

**Issue: Charts not rendering**
- Check SVG viewBox dimensions
- Verify data array is not empty
- Ensure max value is greater than data values

**Issue: KPI cards misaligned**
- Check grid layout columns
- Verify responsive breakpoints
- Inspect styled-components CSS

**Issue: Performance degradation**
- Use React.memo for chart components
- Implement useMemo for data calculations
- Check for unnecessary re-renders

### Debugging Tools
- React DevTools
- Redux DevTools
- Chrome DevTools Performance tab
- Network tab for API calls

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Phase 4 Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - run: npm run build
      - run: npm run test:e2e
```

---

## Conclusion

This testing strategy ensures comprehensive coverage of Phase 4 components across unit, integration, and E2E levels. Follow the manual testing checklist and run automated tests before deployment.

---
**Document Version:** 1.0
**Last Updated:** 2026-01-21
**Status:** In Progress
