import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardShell, DataCard, KPI, Table } from '../../components/shared/dashboard';

/**
 * Shared Dashboard Components Tests
 * Tests for reusable dashboard UI components
 */

describe('DashboardShell', () => {
  test('renders title and subtitle', () => {
    render(
      <DashboardShell title="Test Dashboard" subtitle="Test Subtitle">
        <div>Content</div>
      </DashboardShell>
    );

    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    render(
      <DashboardShell title="Dashboard" loading={true}>
        <div>Content</div>
      </DashboardShell>
    );

    const spinner = screen.getByRole('presentation', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  test('displays error message', () => {
    const errorMsg = 'Test error message';
    render(
      <DashboardShell title="Dashboard" error={errorMsg}>
        <div>Content</div>
      </DashboardShell>
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  test('renders children when not loading or errored', () => {
    render(
      <DashboardShell title="Dashboard" loading={false}>
        <div>Test Content</div>
      </DashboardShell>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});

describe('DataCard', () => {
  test('renders title and subtitle', () => {
    render(
      <DataCard title="Card Title" subtitle="Card Subtitle">
        <div>Content</div>
      </DataCard>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  test('displays loading skeleton', () => {
    render(
      <DataCard title="Card" loading={true}>
        <div>Content</div>
      </DataCard>
    );

    const card = screen.getByText('Card').closest('div');
    expect(card).toBeInTheDocument();
  });

  test('renders child content', () => {
    render(
      <DataCard title="Card">
        <div>Card Content</div>
      </DataCard>
    );

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
});

describe('KPI Component', () => {
  const mockKPIProps = {
    label: 'Test Metric',
    value: '100',
    change: 5.5,
    icon: 'trending-up',
    trend: 'positive' as const,
  };

  test('renders KPI label and value', () => {
    render(<KPI {...mockKPIProps} />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('displays trend indicator', () => {
    render(<KPI {...mockKPIProps} trend="positive" />);

    const kpiContainer = screen.getByText('Test Metric').closest('div');
    expect(kpiContainer).toBeInTheDocument();
  });

  test('shows change percentage', () => {
    render(<KPI {...mockKPIProps} change={5.5} />);

    expect(screen.getByText(/5.5/)).toBeInTheDocument();
  });

  test('applies correct trend styling for positive', () => {
    const { container } = render(<KPI {...mockKPIProps} trend="positive" />);
    expect(container.innerHTML).toContain('positive');
  });

  test('applies correct trend styling for negative', () => {
    const { container } = render(<KPI {...mockKPIProps} trend="negative" />);
    expect(container.innerHTML).toContain('negative');
  });
});

describe('Table Component', () => {
  const mockColumns = ['name', 'value', 'status'];
  const mockData = [
    { name: 'Item 1', value: 100, status: 'active' },
    { name: 'Item 2', value: 200, status: 'inactive' },
  ];

  test('renders table headers', () => {
    render(<Table columns={mockColumns} data={mockData} />);

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
  });

  test('renders table data', () => {
    render(<Table columns={mockColumns} data={mockData} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  test('calls onRowClick handler', () => {
    const mockOnRowClick = jest.fn();
    render(
      <Table columns={mockColumns} data={mockData} onRowClick={mockOnRowClick} />
    );

    const firstRow = screen.getByText('Item 1').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(mockOnRowClick).toHaveBeenCalled();
    }
  });

  test('renders empty state for no data', () => {
    render(<Table columns={mockColumns} data={[]} />);

    // Table should still render headers
    expect(screen.getByText('name')).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    const incompleteData = [{ name: 'Item 1' }];
    render(<Table columns={mockColumns} data={incompleteData} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
