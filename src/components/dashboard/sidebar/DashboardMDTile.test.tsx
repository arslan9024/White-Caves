import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DashboardMDTile } from './DashboardMDTile';

describe('DashboardMDTile', () => {
  const defaultProps = {
    isOpen: true,
    isCollapsed: false,
    activeTab: 'dept_summary',
    onTileClick: vi.fn(),
    onSubItemClick: vi.fn(),
  };

  it('renders Tile 1 MD Office Sovereign Suite with executive overview', () => {
    render(<DashboardMDTile {...defaultProps} />);

    expect(screen.getByText(/1\. MD Office \(MD Suite\)/i)).toBeInTheDocument();
    expect(screen.getByText('MD Suite')).toBeInTheDocument();
    expect(screen.getByText(/1\.1 Executive Overview & Live Audit/i)).toBeInTheDocument();
  });
});
