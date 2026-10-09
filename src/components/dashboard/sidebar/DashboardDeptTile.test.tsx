import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DashboardDeptTile } from './DashboardDeptTile';

describe('DashboardDeptTile', () => {
  const defaultProps = {
    isOpen: true,
    isCollapsed: false,
    activeTab: 'overview',
    selectedDept: { id: 'sales', num: 'Floor 06', name: 'Sales & Brokerage', icon: '🏢' },
    selectedDeptId: 'sales',
    openSubGroups: {},
    onTileClick: vi.fn(),
    onSelectDepartment: vi.fn(),
    onSubItemClick: vi.fn(),
    onToggleSubGroup: vi.fn(),
  };

  it('renders Corporate Departments tile with department options', () => {
    render(<DashboardDeptTile {...defaultProps} />);

    expect(screen.getByText(/2\. Corporate Departments \(12 Depts\)/i)).toBeInTheDocument();
    expect(screen.getByText('Floor 06')).toBeInTheDocument();
  });

  it('exposes department subgroup controls as expandable buttons', () => {
    const onToggleSubGroup = vi.fn();
    const selectedDept = {
      ...defaultProps.selectedDept,
      subGroups: [{ name: 'Inventory', items: [{ id: 'properties', label: 'Properties', icon: '🏠' }] }],
    };
    render(
      <DashboardDeptTile
        {...defaultProps}
        selectedDept={selectedDept}
        onToggleSubGroup={onToggleSubGroup}
      />
    );

    const subgroup = screen.getByRole('button', { name: /Inventory/ });
    expect(subgroup).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(subgroup);

    expect(onToggleSubGroup).toHaveBeenCalledWith('sales-Inventory');
  });
});
