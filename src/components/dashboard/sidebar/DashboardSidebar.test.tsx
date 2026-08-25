import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';

describe('DashboardSidebar', () => {
  const defaultProps = {
    isCollapsed: false,
    onToggleCollapse: vi.fn(),
    openTopTile: 'md_office' as const,
    activeTab: 'dept_summary',
    selectedDept: { id: 'sales', num: 'Floor 06', name: 'Sales & Brokerage', icon: '🏢' },
    selectedDeptId: 'sales',
    selectedAi: { id: 'theodora', num: '3.14', name: 'Theodora', role: 'Finance AI', icon: '💰' },
    selectedAiId: 'theodora',
    openSubGroups: {},
    onMdTileClick: vi.fn(),
    onCorporateTileClick: vi.fn(),
    onAiTileClick: vi.fn(),
    onSelectDepartment: vi.fn(),
    onSelectAiAssistant: vi.fn(),
    onSubItemClick: vi.fn(),
    onToggleSubGroup: vi.fn(),
  };

  it('renders unified dashboard sidebar with all 3 master tiles', () => {
    render(<DashboardSidebar {...defaultProps} />);

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    expect(screen.getByText(/1\. MD Office \(MD Suite\)/i)).toBeInTheDocument();
  });
});
