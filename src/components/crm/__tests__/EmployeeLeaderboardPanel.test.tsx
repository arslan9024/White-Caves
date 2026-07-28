import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeLeaderboardPanel } from '../EmployeeLeaderboardPanel';

vi.mock('../../../context/WorkspaceContext', () => ({
  useWorkspace: () => ({
    activeUser: { name: 'Arslan Malik', roleTitle: 'Managing Director', id: 'md-001' },
    effectiveAccessLevel: 5,
    isMaster: true,
  }),
}));

describe('EmployeeLeaderboardPanel Component', () => {
  it('renders leaderboard title and sales pool by default', () => {
    render(<EmployeeLeaderboardPanel />);
    expect(screen.getByText(/Employee of the Year Competitions/i)).toBeInTheDocument();
    expect(screen.getByText(/Sales Pool/i)).toBeInTheDocument();
    expect(screen.getByText(/Leasing Pool/i)).toBeInTheDocument();
  });

  it('switches between sales and leasing competition pools when toggled', () => {
    render(<EmployeeLeaderboardPanel />);
    const leasingButton = screen.getByText(/Leasing Pool/i);
    fireEvent.click(leasingButton);
    expect(screen.getAllByText(/Ejari Deals/i).length).toBeGreaterThan(0);

    const salesButton = screen.getByText(/Sales Pool/i);
    fireEvent.click(salesButton);
    expect(screen.getAllByText(/YTD Revenue \/ Commission/i).length).toBeGreaterThan(0);
  });
});
