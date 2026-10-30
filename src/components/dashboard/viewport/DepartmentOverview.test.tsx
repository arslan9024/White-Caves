import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { DepartmentOverview } from './DepartmentOverview';

describe('DepartmentOverview', () => {
  const department = {
    id: 'sales',
    num: 'Floor 06',
    name: 'Sales & Brokerage',
    icon: '🏢',
    locationTag: 'White Caves HQ',
    accessLevel: 'Level 4 Access',
    summary: 'Executive Department Overview & Operations Directory',
    scope: ['Primary Sales Off-Plan', 'Secondary Market Brokerage'],
    items: [{ id: 'item-1', label: 'Primary Sales Off-Plan', icon: '🏗️' }],
  };

  it('renders Department Overview with department title and location tag', () => {
    render(
      <DepartmentOverview
        department={department}
        onLaunchSubItem={vi.fn()}
      />
    );

    expect(screen.getByText(/Floor 06: Sales & Brokerage/i)).toBeInTheDocument();
    expect(screen.getByText(/📍 White Caves HQ/i)).toBeInTheDocument();
  });

  it('renders a keyboard-focusable launch action and opens the selected module', () => {
    const onLaunchSubItem = vi.fn();
    render(<DepartmentOverview department={department} onLaunchSubItem={onLaunchSubItem} />);

    const launchAction = screen.getByRole('button', { name: /Launch Primary Sales Off-Plan/i });
    expect(launchAction).toHaveAttribute('type', 'button');
    expect(launchAction).toHaveStyle({ minHeight: '44px' });

    fireEvent.click(launchAction);
    expect(onLaunchSubItem).toHaveBeenCalledWith('item-1');
  });

  it('shows an empty state when the department has no operational modules', () => {
    render(
      <DepartmentOverview
        department={{ ...department, items: [] }}
        onLaunchSubItem={vi.fn()}
      />
    );

    expect(
      screen.getByText('No operational modules are available for this department.')
    ).toHaveAttribute('role', 'status');
  });
});
