import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
