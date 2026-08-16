import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DepartmentAssignmentBadge } from './DepartmentAssignmentBadge';

describe('DepartmentAssignmentBadge Component', () => {
  it('renders department assignment badge matrix and superuser access pill', () => {
    render(<DepartmentAssignmentBadge />);
    expect(screen.getByTestId('department-assignment-badge')).toBeDefined();
    expect(screen.getByText(/ALL DEPARTMENTS \(SUPERUSER\)/i)).toBeDefined();
    expect(screen.getByText(/Executive Council/i)).toBeDefined();
    expect(screen.getByText(/Conveyancing & RERA Legal/i)).toBeDefined();
    expect(screen.getByText(/VIP UHNW Concierge/i)).toBeDefined();
    expect(screen.getByText(/Commercial Advisory/i)).toBeDefined();
  });
});
