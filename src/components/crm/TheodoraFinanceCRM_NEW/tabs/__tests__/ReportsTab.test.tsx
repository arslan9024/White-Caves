import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  BarChart3: (props: any) => <svg data-testid="icon-barchart" {...props} />,
  PieChart: (props: any) => <svg data-testid="icon-piechart" {...props} />,
  Download: (props: any) => <svg data-testid="icon-download" {...props} />,
  Calendar: (props: any) => <svg data-testid="icon-calendar" {...props} />,
}));

import ReportsTab from '../ReportsTab';

const createInvoices = (overrides: any[] = []) => [
  { id: 'inv-1', amount: 50000, status: 'paid' },
  { id: 'inv-2', amount: 30000, status: 'paid' },
  { id: 'inv-3', amount: 20000, status: 'pending' },
  ...overrides,
];

const createExpenses = (overrides: any[] = []) => [
  { id: 'exp-1', amount: 15000, status: 'approved' },
  { id: 'exp-2', amount: 10000, status: 'pending' },
  { id: 'exp-3', amount: 5000, status: 'approved' },
  ...overrides,
];

// Helper: get the report preview section
const getReportPreview = (container: HTMLElement) =>
  container.querySelector('.report-preview')!;

describe('ReportsTab', () => {
  describe('Revenue Report (default)', () => {
    it('should render financial reports heading', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      expect(screen.getByText('Financial Reports')).toBeInTheDocument();
    });

    it('should show revenue report section by default', () => {
      const { container } = render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const preview = getReportPreview(container);
      // The h4 heading in the report-section should contain "Revenue Report"
      expect(within(preview as HTMLElement).getByText(/Revenue Report/)).toBeInTheDocument();
    });

    it('should display total paid invoices', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      // 50000 + 30000 = 80000
      expect(screen.getByText('Total Paid Invoices:')).toBeInTheDocument();
      expect(screen.getByText(/80,000/)).toBeInTheDocument();
    });

    it('should display number of paid invoices', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      expect(screen.getByText('Number of Invoices:')).toBeInTheDocument();
    });

    it('should calculate average invoice value', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      expect(screen.getByText('Average Invoice Value:')).toBeInTheDocument();
      // 80000 / 2 = 40000
      expect(screen.getByText(/40,000/)).toBeInTheDocument();
    });

    it('should show revenue report option in dropdown', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Expense Report', () => {
    it('should switch to expense report', () => {
      const { container } = render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'expenses' } });

      const preview = getReportPreview(container);
      expect(within(preview as HTMLElement).getByText(/Expense Report/)).toBeInTheDocument();
    });

    it('should display total expenses', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'expenses' } });

      // 15000 + 10000 + 5000 = 30000
      expect(screen.getByText('Total Expenses:')).toBeInTheDocument();
      expect(screen.getByText(/30,000/)).toBeInTheDocument();
    });

    it('should display number of expenses', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'expenses' } });

      expect(screen.getByText('Number of Expenses:')).toBeInTheDocument();
    });

    it('should display pending approvals count', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'expenses' } });

      expect(screen.getByText('Pending Approvals:')).toBeInTheDocument();
    });
  });

  describe('Profit & Loss Report', () => {
    it('should switch to profit report', () => {
      const { container } = render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'profit' } });

      const preview = getReportPreview(container);
      expect(within(preview as HTMLElement).getByText(/Profit & Loss Report/)).toBeInTheDocument();
    });

    it('should display net profit', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'profit' } });

      // 80000 - 30000 = 50000
      expect(screen.getByText('Net Profit:')).toBeInTheDocument();
      expect(screen.getByText(/50,000/)).toBeInTheDocument();
    });

    it('should show green color for positive net profit', () => {
      const { container } = render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'profit' } });

      // Find the highlight row's strong element
      const highlightRow = container.querySelector('.data-row.highlight strong');
      expect(highlightRow).toHaveStyle({ color: '#10B981' });
    });

    it('should show red color for negative net profit', () => {
      const expensiveExpenses = [
        { id: 'exp-1', amount: 100000, status: 'approved' },
      ];
      const { container } = render(<ReportsTab invoices={createInvoices()} expenses={expensiveExpenses} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'profit' } });

      // Net profit = 80000 - 100000 = -20000 → red
      const highlightRow = container.querySelector('.data-row.highlight strong');
      expect(highlightRow).toHaveStyle({ color: '#EF4444' });
    });

    it('should calculate profit margin percentage', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'profit' } });

      // (50000 / 80000) * 100 = 62.5%
      expect(screen.getByText('Profit Margin:')).toBeInTheDocument();
      expect(screen.getByText(/62\.5/)).toBeInTheDocument();
    });

    it('should handle zero revenue for profit margin', () => {
      render(<ReportsTab invoices={[]} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'profit' } });

      expect(screen.getByText('Profit Margin:')).toBeInTheDocument();
      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });
  });

  describe('Cash Flow Report', () => {
    it('should switch to cash flow report', () => {
      const { container } = render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'cash-flow' } });

      const preview = getReportPreview(container);
      expect(within(preview as HTMLElement).getByText(/Cash Flow Report/)).toBeInTheDocument();
    });

    it('should display cash inflow (paid invoices)', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'cash-flow' } });

      expect(screen.getByText('Cash Inflow (Paid):')).toBeInTheDocument();
    });

    it('should display pending inflow (unpaid invoices)', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'cash-flow' } });

      expect(screen.getByText('Pending Inflow:')).toBeInTheDocument();
      // 20000 (pending)
      expect(screen.getByText(/20,000/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty invoices array', () => {
      render(<ReportsTab invoices={[]} expenses={createExpenses()} />);
      // Total paid invoices = 0 and average = 0, both show "AED 0"
      const zeroElements = screen.getAllByText(/AED\s+0$/);
      expect(zeroElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty expenses array', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={[]} />);
      const select = screen.getByDisplayValue('Revenue Report');
      fireEvent.change(select, { target: { value: 'expenses' } });

      expect(screen.getByText('Total Expenses:')).toBeInTheDocument();
      const zeroElements = screen.getAllByText(/AED\s+0$/);
      expect(zeroElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should avoid division by zero for average invoice', () => {
      // When 0 paid invoices, uses || 1 guard
      const unpaidOnly = [{ id: 'inv-1', amount: 1000, status: 'pending' }];
      render(<ReportsTab invoices={unpaidOnly} expenses={createExpenses()} />);

      // Total paid = 0, avg = 0 / 1 = 0
      expect(screen.getByText('Average Invoice Value:')).toBeInTheDocument();
      const zeroElements = screen.getAllByText(/AED\s+0$/);
      expect(zeroElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render generate report button', () => {
      render(<ReportsTab invoices={createInvoices()} expenses={createExpenses()} />);
      expect(screen.getByText('Generate Report')).toBeInTheDocument();
    });
  });
});
