/**
 * Department Views E2E Tests
 * Cypress tests for department-specific view workflows
 */

describe('Department Views', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.login({ role: 'executive', permissions: ['executive', 'md'] });
  });

  describe('Executive View', () => {
    it('should display executive KPIs', () => {
      cy.get('[data-testid="kpi-card"]').should('have.length', 4);
      cy.contains('Revenue YTD').should('be.visible');
      cy.contains('Active Projects').should('be.visible');
      cy.contains('Team Performance').should('be.visible');
      cy.contains('Market Share').should('be.visible');
    });

    it('should show announcements table', () => {
      cy.get('[data-testid="announcements-table"]').should('be.visible');
      cy.get('[data-testid="table-row"]').should('have.length.greaterThan', 0);
    });

    it('should navigate to sub-items', () => {
      cy.get('[data-testid="service-expand"]').click();
      cy.contains('KPI Dashboard').click();
      cy.contains('KPI Dashboard').should('be.visible');
    });
  });

  describe('Sales View', () => {
    beforeEach(() => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Sales & Leasing').click();
    });

    it('should display sales KPIs', () => {
      cy.get('[data-testid="kpi-card"]').should('have.length', 4);
      cy.contains('Total Pipeline Value').should('be.visible');
      cy.contains('Active Deals').should('be.visible');
    });

    it('should show pipeline board', () => {
      cy.get('[data-testid="pipeline-table"]').should('be.visible');
    });

    it('should handle deal selection', () => {
      cy.get('[data-testid="pipeline-table"]')
        .find('[data-testid="table-row"]')
        .first()
        .click();
      cy.get('[data-testid="detail-panel"]').should('be.visible');
    });
  });

  describe('Operations View', () => {
    beforeEach(() => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Operations').click();
    });

    it('should display operations metrics', () => {
      cy.contains('Team Utilization').should('be.visible');
      cy.contains('Tasks Completed').should('be.visible');
    });

    it('should show task board', () => {
      cy.get('[data-testid="task-table"]').should('be.visible');
    });
  });

  describe('Finance View', () => {
    beforeEach(() => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('Finance').click();
    });

    it('should display financial metrics', () => {
      cy.contains('Total Revenue').should('be.visible');
      cy.contains('Total Expenses').should('be.visible');
      cy.contains('Net Profit').should('be.visible');
    });

    it('should show budget tracking', () => {
      cy.get('[data-testid="budget-table"]').should('be.visible');
    });
  });

  describe('HR View', () => {
    beforeEach(() => {
      cy.get('[data-testid="department-dropdown"]').click();
      cy.contains('HR').click();
    });

    it('should display employee metrics', () => {
      cy.contains('Total Employees').should('be.visible');
      cy.contains('Attrition Rate').should('be.visible');
    });

    it('should show employee directory', () => {
      cy.get('[data-testid="employee-table"]').should('be.visible');
    });
  });

  describe('KPI Cards', () => {
    it('should display KPI values correctly', () => {
      cy.get('[data-testid="kpi-card"]').first().within(() => {
        cy.get('[data-testid="kpi-value"]').should('not.be.empty');
        cy.get('[data-testid="kpi-label"]').should('not.be.empty');
        cy.get('[data-testid="kpi-trend"]').should('be.visible');
      });
    });

    it('should show trend indicators', () => {
      cy.get('[data-testid="kpi-card"]').each(($card) => {
        cy.wrap($card)
          .find('[data-testid="trend-indicator"]')
          .should('be.visible');
      });
    });

    it('should display change percentage', () => {
      cy.get('[data-testid="kpi-card"]')
        .first()
        .within(() => {
          cy.get('[data-testid="change-value"]').should('contain', '%');
        });
    });
  });

  describe('Data Tables', () => {
    it('should display table headers', () => {
      cy.get('[data-testid="data-table"]').within(() => {
        cy.get('[data-testid="table-header"]').should('have.length.greaterThan', 0);
      });
    });

    it('should display table data', () => {
      cy.get('[data-testid="data-table"]').within(() => {
        cy.get('[data-testid="table-row"]').should('have.length.greaterThan', 0);
      });
    });

    it('should handle row click', () => {
      cy.get('[data-testid="table-row"]').first().click();
      cy.get('[data-testid="detail-panel"]').should('be.visible');
    });

    it('should sort by column', () => {
      cy.get('[data-testid="table-header"]').first().click();
      cy.get('[data-testid="sort-indicator"]').should('be.visible');
    });
  });
});
