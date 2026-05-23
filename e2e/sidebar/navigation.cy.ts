/**
 * Sidebar Navigation E2E Tests
 * Cypress tests for complete user workflows
 */

describe('Sidebar Navigation Workflow', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.login({ role: 'executive', permissions: ['executive', 'md'] });
  });

  describe('Department Selection', () => {
    it('should display all departments in dropdown', () => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Executive').should('be.visible');
      cy.contains('Sales & Leasing').should('be.visible');
      cy.contains('Operations').should('be.visible');
      cy.contains('HR').should('be.visible');
      cy.contains('Finance').should('be.visible');
    });

    it('should select department and update content', () => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();
      cy.contains('Lead Pipeline').should('be.visible');
    });

    it('should show default department on load', () => {
      cy.get('[data-testid="department-dropdown"]').should(
        'contain',
        'Executive'
      );
    });

    it('should respect user role permissions', () => {
      cy.logout();
      cy.login({ role: 'agent', permissions: ['agent', 'sales'] });
      cy.visit('/dashboard');
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Executive').should('not.exist');
      cy.contains('Sales & Leasing').should('be.visible');
    });
  });

  describe('Service Selection', () => {
    it('should display services for selected department', () => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();
      cy.get('[data-testid="service-list"]').within(() => {
        cy.contains('Lead Pipeline').should('be.visible');
        cy.contains('Sales Contracts').should('be.visible');
      });
    });

    it('should filter services by search', () => {
      cy.get('[data-testid="service-search"]').type('kpi');
      cy.get('[data-testid="service-list"]').within(() => {
        cy.contains('KPI Dashboard').should('be.visible');
      });
    });

    it('should highlight default service', () => {
      cy.get('[data-testid="service-list"]').within(() => {
        cy.contains('Strategic Overview').should('have.class', 'active');
      });
    });

    it('should show quick-access services', () => {
      cy.get('[data-testid="quick-access-services"]').within(() => {
        cy.get('[data-testid="quick-access-item"]').should('have.length.at.most', 3);
      });
    });
  });

  describe('Content Rendering', () => {
    it('should render correct view for selected service', () => {
      cy.contains('Strategic Overview').should('be.visible');
      cy.get('[data-testid="kpi-card"]').should('have.length', 4);
    });

    it('should display loading state while fetching data', () => {
      cy.get('[data-testid="content-area"]').within(() => {
        cy.get('[data-testid="skeleton-loader"]').should('be.visible');
      });
      cy.get('[data-testid="skeleton-loader"]', { timeout: 5000 }).should(
        'not.exist'
      );
    });

    it('should display error message on failed load', () => {
      cy.intercept('GET', '/api/executive/*', { statusCode: 500 });
      cy.contains('Select a Service').click();
      cy.contains('Error').should('be.visible');
    });

    it('should display empty state when no data', () => {
      cy.intercept('GET', '/api/executive/*', { body: { data: null } });
      cy.get('[data-testid="content-area"]').within(() => {
        cy.contains('No data available').should('be.visible');
      });
    });
  });

  describe('Breadcrumb Navigation', () => {
    it('should display current path in breadcrumb', () => {
      cy.get('[data-testid="breadcrumb"]').within(() => {
        cy.contains('Executive').should('be.visible');
        cy.contains('Strategic Overview').should('be.visible');
      });
    });

    it('should navigate back via breadcrumb', () => {
      cy.get('[data-testid="breadcrumb"]').within(() => {
        cy.contains('Executive').click();
      });
      cy.get('[data-testid="service-list"]').should('be.visible');
    });

    it('should show navigation history', () => {
      cy.get('[data-testid="breadcrumb"]').within(() => {
        cy.get('[data-testid="breadcrumb-item"]').should('have.length.at.most', 5);
      });
    });
  });

  describe('Sub-item Navigation', () => {
    it('should display sub-items for service', () => {
      cy.get('[data-testid="service-expand"]').first().click();
      cy.get('[data-testid="subitem-list"]').within(() => {
        cy.get('[data-testid="subitem"]').should('have.length.greaterThan', 0);
      });
    });

    it('should load sub-item content on click', () => {
      cy.get('[data-testid="service-expand"]').first().click();
      cy.get('[data-testid="subitem"]').first().click();
      cy.get('[data-testid="content-area"]').should('be.visible');
    });

    it('should update breadcrumb for sub-item', () => {
      cy.get('[data-testid="service-expand"]').first().click();
      cy.get('[data-testid="subitem"]').first().click();
      cy.get('[data-testid="breadcrumb"]').should(
        'contain',
        'Executive'
      );
    });
  });

  describe('Selection History', () => {
    it('should track selection history', () => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();
      cy.get('[data-testid="history-list"]').within(() => {
        cy.contains('Sales & Leasing').should('be.visible');
      });
    });

    it('should limit history to 3 items', () => {
      // Make multiple selections
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();

      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Operations').click();

      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Finance').click();

      cy.get('[data-testid="history-list"]').within(() => {
        cy.get('[data-testid="history-item"]').should('have.length.at.most', 3);
      });
    });

    it('should navigate from history', () => {
      cy.get('[data-testid="history-list"]').within(() => {
        cy.get('[data-testid="history-item"]').first().click();
      });
      cy.get('[data-testid="content-area"]').should('be.visible');
    });
  });

  describe('Permission Enforcement', () => {
    it('should hide restricted departments', () => {
      cy.logout();
      cy.login({ role: 'agent', permissions: ['agent'] });
      cy.visit('/dashboard');

      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Executive').should('not.exist');
      cy.contains('Compliance').should('not.exist');
    });

    it('should show access denied message for restricted service', () => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Compliance').click();

      cy.contains('Access Denied').should('be.visible');
    });

    it('should handle permission checking gracefully', () => {
      cy.intercept('GET', '/api/permissions/check', {
        body: { allowed: false },
      });
      cy.get('[data-testid="restricted-service"]').click();
      cy.contains('Access Denied').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();
      cy.get('[data-testid="content-area"]').should('be.visible');
    });

    it('should work on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('[data-testid="sidebar"]').should('be.visible');
      cy.get('[data-testid="content-area"]').should('be.visible');
    });

    it('should work on desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('[data-testid="left-sidebar"]').should('be.visible');
      cy.get('[data-testid="right-sidebar"]').should('be.visible');
      cy.get('[data-testid="content-area"]').should('be.visible');
    });
  });

  describe('Data Persistence', () => {
    it('should remember last selection', () => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();

      cy.reload();

      cy.get('[data-testid="department-dropdown"]').should('contain', 'Sales');
    });

    it('should cache filter state', () => {
      cy.get('[data-testid="service-search"]').type('lead');
      cy.reload();
      cy.get('[data-testid="service-search"]').should('have.value', 'lead');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '/api/**', { forceNetworkError: true });
      cy.get('[data-testid="content-area"]').within(() => {
        cy.contains('Error').should('be.visible');
      });
    });

    it('should provide retry functionality', () => {
      cy.intercept('GET', '/api/executive/*', { statusCode: 500 }).as(
        'failedLoad'
      );
      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@failedLoad');
    });

    it('should handle timeout gracefully', () => {
      cy.intercept('GET', '/api/executive/*', (req) => {
        req.destroy();
      });
      cy.get('[data-testid="content-area"]').within(() => {
        cy.contains('Error loading data').should('be.visible');
      });
    });
  });
});
