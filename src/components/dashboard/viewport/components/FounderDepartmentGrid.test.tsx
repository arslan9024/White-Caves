import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FounderDepartmentGrid } from './FounderDepartmentGrid';

describe('FounderDepartmentGrid (DOM-02 / Target T-0104)', () => {
  it('renders all 12 corporate departments and opens 1-click detail expander modal', () => {
    const handleNavigate = vi.fn();
    render(<FounderDepartmentGrid onNavigateToModule={handleNavigate} />);

    expect(screen.getByText('🏛️ 12 Corporate Departments Operational Status')).toBeInTheDocument();
    expect(screen.getByText('Off-Plan & Primary Sales')).toBeInTheDocument();

    const offPlanCard = screen.getByTestId('dept-card-dept-02');
    fireEvent.click(offPlanCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Off-Plan & Primary Sales', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getAllByText(/👤 Tariq Al-Mansoor/i).length).toBeGreaterThan(0);

    const consoleBtn = screen.getByRole('button', { name: /Open Dedicated Department Console/i });
    fireEvent.click(consoleBtn);

    expect(handleNavigate).toHaveBeenCalledWith('off-plan-tracker');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
