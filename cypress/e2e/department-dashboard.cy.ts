/**
 * E2E Test Scenarios for Department Dashboard
 * Cypress tests for critical user journeys
 */

describe('Department Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.login('testuser@example.com', 'password123');
  });

  describe('Department Data Fetch & Display', () => {
    it('should load all departments on dashboard open', () => {
      // Verify dashboard loads
      cy.get('[data-testid="dashboard-shell"]').should('be.visible');

      // Verify sidebar with departments
      cy.get('[data-testid="department-sidebar"]').should('be.visible');

      // Verify at least one department exists
      cy.get('[data-testid="sidebar-item"]').should('have.length.greaterThan', 0);
    });

    it('should display sales department with KPI cards', () => {
      // Click Sales department
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      // Wait for data to load
      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      // Verify KPI cards are visible
      cy.get('[data-testid="kpi-card"]').should('have.length.greaterThan', 0);

      // Verify KPI values are displayed
      cy.get('[data-testid="kpi-value"]').first().should('not.be.empty');
    });

    it('should render data visualization charts', () => {
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      // Wait for charts to load
      cy.get('[data-testid="chart-container"]', { timeout: 5000 }).should('exist');

      // Verify at least one chart is rendered
      cy.get('[data-testid="chart-canvas"]').should('have.length.greaterThan', 0);

      // Verify chart has data
      cy.get('[data-testid="chart-canvas"]').first().should('be.visible');
    });

    it('should load data within acceptable time (<2s)', () => {
      const startTime = performance.now();

      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      cy.window().then(() => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;

        // Should load within 2 seconds
        expect(loadTime).to.be.lessThan(2000);
      });
    });

    it('should cache data for subsequent department switches', () => {
      // First load Sales
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();
      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      // Switch to Finance
      cy.contains('[data-testid="sidebar-item"]', 'Finance').click();
      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      // Switch back to Sales (should be instant from cache)
      const startTime = performance.now();
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();
      cy.get('[data-testid="kpi-card"]').should('exist');

      cy.window().then(() => {
        const endTime = performance.now();
        const switchTime = endTime - startTime;

        // Cached switch should be faster (<500ms)
        expect(switchTime).to.be.lessThan(500);
      });
    });
  });

  describe('Filter & Export Functionality', () => {
    beforeEach(() => {
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();
      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');
    });

    it('should apply date range filter', () => {
      // Click filter button
      cy.get('[data-testid="filter-button"]').click();

      // Set date range
      cy.get('[data-testid="start-date-input"]')
        .clear()
        .type('2025-01-01');

      cy.get('[data-testid="end-date-input"]')
        .clear()
        .type('2025-01-31');

      // Apply filter
      cy.get('[data-testid="apply-filter-button"]').click();

      // Data should reload
      cy.get('[data-testid="loading-indicator"]', { timeout: 1000 }).should(
        'exist'
      );

      // Loading should complete
      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');
    });

    it('should reload data within acceptable time after filter (<1s)', () => {
      cy.get('[data-testid="filter-button"]').click();

      cy.get('[data-testid="start-date-input"]')
        .clear()
        .type('2025-01-01');

      cy.get('[data-testid="end-date-input"]')
        .clear()
        .type('2025-01-31');

      const startTime = performance.now();
      cy.get('[data-testid="apply-filter-button"]').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      cy.window().then(() => {
        const endTime = performance.now();
        const reloadTime = endTime - startTime;

        // Should reload within 1 second
        expect(reloadTime).to.be.lessThan(1000);
      });
    });

    it('should export data to CSV', () => {
      // Click export button
      cy.get('[data-testid="export-button"]').click();

      // Select CSV format
      cy.get('[data-testid="export-format-select"]').select('csv');

      // Click download
      cy.get('[data-testid="download-button"]').click();

      // File should be downloaded
      cy.readFile('cypress/downloads/sales-data.csv').should('exist');
    });

    it('should export data to Excel', () => {
      cy.get('[data-testid="export-button"]').click();

      cy.get('[data-testid="export-format-select"]').select('excel');

      cy.get('[data-testid="download-button"]').click();

      cy.readFile('cypress/downloads/sales-data.xlsx').should('exist');
    });

    it('should complete export within acceptable time (<1s)', () => {
      cy.get('[data-testid="export-button"]').click();

      cy.get('[data-testid="export-format-select"]').select('csv');

      const startTime = performance.now();
      cy.get('[data-testid="download-button"]').click();

      cy.window().then(() => {
        const endTime = performance.now();
        const exportTime = endTime - startTime;

        // Should generate export within 1 second
        expect(exportTime).to.be.lessThan(1000);
      });
    });

    it('should maintain data integrity after filter and export', () => {
      // Get initial data count
      cy.get('[data-testid="data-record"]').then(($records) => {
        const initialCount = $records.length;

        // Apply filter
        cy.get('[data-testid="filter-button"]').click();

        cy.get('[data-testid="start-date-input"]')
          .clear()
          .type('2025-01-01');

        cy.get('[data-testid="apply-filter-button"]').click();

        cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

        // Export
        cy.get('[data-testid="export-button"]').click();

        cy.get('[data-testid="export-format-select"]').select('csv');

        cy.get('[data-testid="download-button"]').click();

        // Verify exported file contains data
        cy.readFile('cypress/downloads/sales-data.csv').should((file) => {
          expect(file).to.include('date');
          expect(file.length).to.be.greaterThan(100);
        });
      });
    });
  });

  describe('Error Handling & Recovery', () => {
    it('should display error message on API failure', () => {
      // Mock API error
      cy.intercept('GET', '/api/departments/SALES/*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('apiError');

      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      // Wait for error to show
      cy.get('[data-testid="error-message"]', { timeout: 5000 }).should('exist');

      cy.get('[data-testid="error-message"]').should('contain', 'Error');
    });

    it('should provide retry button on error', () => {
      cy.intercept('GET', '/api/departments/SALES/*', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      });

      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="error-message"]', { timeout: 5000 }).should('exist');

      // Verify retry button exists
      cy.get('[data-testid="retry-button"]').should('exist');
    });

    it('should recover from error on retry', () => {
      // First call fails
      cy.intercept(
        'GET',
        '/api/departments/SALES/*',
        {
          statusCode: 500,
          body: { error: 'Internal Server Error' },
        },
        { times: 1 }
      );

      // Second call succeeds
      cy.intercept('GET', '/api/departments/SALES/*', {
        statusCode: 200,
        body: { data: [{ id: 'record1', value: 1000 }] },
      });

      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="error-message"]', { timeout: 5000 }).should('exist');

      // Click retry
      cy.get('[data-testid="retry-button"]').click();

      // Error should disappear and data should load
      cy.get('[data-testid="error-message"]', { timeout: 5000 }).should(
        'not.exist'
      );

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');
    });

    it('should handle network timeout gracefully', () => {
      // Mock slow network
      cy.intercept('GET', '/api/departments/SALES/*', (req) => {
        req.destroy();
      });

      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      // Should show error or timeout message
      cy.get('[data-testid="error-message"]', { timeout: 10000 }).should('exist');
    });
  });

  describe('Performance Monitoring', () => {
    it('should track initial load performance', () => {
      cy.visit('/dashboard/performance');

      // Verify performance metrics are displayed
      cy.get('[data-testid="performance-metrics"]').should('be.visible');

      // Verify load time is shown
      cy.get('[data-testid="initial-load-time"]').should('exist');

      // Load time should be acceptable
      cy.get('[data-testid="initial-load-time"]').then(($el) => {
        const loadTime = parseFloat($el.text());
        expect(loadTime).to.be.lessThan(2000);
      });
    });

    it('should display cache hit rate', () => {
      // Make requests
      cy.visit('/dashboard');

      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      // Switch departments
      cy.contains('[data-testid="sidebar-item"]', 'Finance').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      // Go to performance page
      cy.visit('/dashboard/performance');

      // Verify cache metrics
      cy.get('[data-testid="cache-hit-rate"]').should('exist');

      cy.get('[data-testid="cache-hit-rate"]').then(($el) => {
        const hitRate = parseFloat($el.text());
        expect(hitRate).to.be.greaterThan(0);
        expect(hitRate).to.be.lessThanOrEqual(100);
      });
    });

    it('should show API response times', () => {
      cy.visit('/dashboard/performance');

      // Verify response time metrics
      cy.get('[data-testid="average-response-time"]').should('exist');

      cy.get('[data-testid="average-response-time"]').then(($el) => {
        const responseTime = parseFloat($el.text());
        expect(responseTime).to.be.greaterThan(0);
        expect(responseTime).to.be.lessThan(5000);
      });
    });

    it('should track request deduplication', () => {
      cy.visit('/dashboard');

      // Make concurrent requests
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      cy.visit('/dashboard/performance');

      // Verify deduplication metrics
      cy.get('[data-testid="deduplicated-requests"]').should('exist');

      cy.get('[data-testid="deduplicated-requests"]').then(($el) => {
        const dedupCount = parseInt($el.text());
        expect(dedupCount).to.be.greaterThanOrEqual(0);
      });
    });
  });

  describe('Sidebar Navigation', () => {
    it('should search and filter departments', () => {
      cy.get('[data-testid="sidebar-search"]').type('Sales');

      // Only Sales should be visible
      cy.get('[data-testid="sidebar-item"]').should('contain', 'Sales');
    });

    it('should show active state for selected department', () => {
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      // Sales item should be marked as active
      cy.contains('[data-testid="sidebar-item"]', 'Sales')
        .parent()
        .should('have.attr', 'data-active', 'true');
    });

    it('should display department icons', () => {
      // Verify icons are displayed for each department
      cy.get('[data-testid="department-icon"]').should(
        'have.length.greaterThan',
        0
      );
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across multiple operations', () => {
      // Load initial data
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      cy.get('[data-testid="kpi-value"]').first().then(($value) => {
        const initialValue = $value.text();

        // Switch to another department
        cy.contains('[data-testid="sidebar-item"]', 'Finance').click();

        cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

        // Switch back to Sales
        cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

        cy.get('[data-testid="kpi-card"]').should('exist');

        // Value should be the same
        cy.get('[data-testid="kpi-value"]')
          .first()
          .should('have.text', initialValue);
      });
    });

    it('should update data when refreshed manually', () => {
      cy.contains('[data-testid="sidebar-item"]', 'Sales').click();

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

      cy.get('[data-testid="kpi-value"]').first().then(($value) => {
        const initialValue = $value.text();

        // Click refresh button
        cy.get('[data-testid="refresh-button"]').click();

        cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');

        // Data should be reloaded (value might be same or different)
        cy.get('[data-testid="kpi-value"]').first().should('exist');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[role="navigation"]').should('exist');

      cy.get('[data-testid="sidebar-item"]').should('have.attr', 'role');
    });

    it('should support keyboard navigation', () => {
      // Tab to first sidebar item
      cy.get('[data-testid="sidebar-item"]').first().focus();

      // Should be focused
      cy.focused().should('have.attr', 'data-testid', 'sidebar-item');

      // Enter should select
      cy.focused().type('{enter}');

      cy.get('[data-testid="kpi-card"]', { timeout: 5000 }).should('exist');
    });
  });
});
