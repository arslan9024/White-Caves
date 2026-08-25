import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { DashboardGlobalHeader } from './DashboardGlobalHeader';

describe('DashboardGlobalHeader', () => {
  const defaultProps = {
    isHeaderCollapsed: false,
    onToggleCollapse: vi.fn(),
    openTopTile: 'md_office' as const,
    selectedDept: { id: 'sales', num: 'Floor 06', name: 'Sales & Brokerage', icon: '🏢' },
    selectedAi: { id: 'theodora', num: '3.14', name: 'Theodora', role: 'Finance AI', icon: '💰' },
    activeLocationTag: 'White Caves HQ',
  };

  it('renders ERP Command Core title and active location meta-tag', () => {
    render(
      <MemoryRouter>
        <DashboardGlobalHeader {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText(/White Caves Real Estate LLC — ERP Command Core/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Meta-Tag:/i)).toBeInTheDocument();
    expect(screen.getByText('White Caves HQ')).toBeInTheDocument();
  });
});
