import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeLeaderboardPanel } from './EmployeeLeaderboardPanel';

describe('EmployeeLeaderboardPanel Component', () => {
  it('renders hierarchy leaderboard with department selector and view toggle', () => {
    render(<EmployeeLeaderboardPanel />);

    expect(screen.getByTestId('employee-leaderboard-panel')).toBeDefined();
    expect(screen.getByText(/1-12-108 Hierarchy Leaderboard/i)).toBeDefined();
    expect(screen.getByTestId('toggle-by-dept')).toBeDefined();
    expect(screen.getByTestId('toggle-by-global')).toBeDefined();

    // Switch to global managers view
    fireEvent.click(screen.getByTestId('toggle-by-global'));
    expect(screen.getByTestId('global-managers-grid')).toBeDefined();

    // Switch back to department view
    fireEvent.click(screen.getByTestId('toggle-by-dept'));
  });
});
