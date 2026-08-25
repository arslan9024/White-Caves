import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    items: [
      { id: 'item-1', name: 'Primary Sales Off-Plan', icon: '🏗️' },
    ],
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
});
