import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HvacInspectionCalendar } from './HvacInspectionCalendar';

describe('HvacInspectionCalendar Component', () => {
  it('renders HVAC inspection calendar and logs service report', () => {
    render(<HvacInspectionCalendar />);
    expect(screen.getByTestId('hvac-inspection-calendar')).toBeDefined();
    expect(screen.getByText(/HVAC, Chiller & Elevator Statutory Servicing Schedule/i)).toBeDefined();
    expect(screen.getByText(/FACILITIES COMPLIANCE/i)).toBeDefined();
    expect(screen.getByText(/Central Chiller Plant A & B/i)).toBeDefined();
    expect(screen.getByText(/⚠️ OVERDUE \(CIVIL DEFENSE SLA\)/i)).toBeDefined();

    const logBtns = screen.getAllByRole('button', { name: /Log Service Report/i });
    expect(logBtns.length).toBeGreaterThan(0);
    fireEvent.click(logBtns[0]);
    expect(screen.getAllByText(/✓ COMPLETED/i).length).toBeGreaterThan(1);
  });
});
