import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MaintenanceTicketDispatch } from './MaintenanceTicketDispatch';

describe('MaintenanceTicketDispatch Component', () => {
  it('renders maintenance ticket dispatch cockpit and resolves tickets', () => {
    render(<MaintenanceTicketDispatch />);
    expect(screen.getByTestId('maintenance-ticket-dispatch')).toBeDefined();
    expect(screen.getByText(/IoT Maintenance & Contractor Dispatch SLA/i)).toBeDefined();
    expect(screen.getByText(/FACILITIES CONTROL/i)).toBeDefined();
    expect(screen.getByText(/Chiller & Central AC Total Breakdown/i)).toBeDefined();
    expect(screen.getByText(/CoolTech HVAC Specialists/i)).toBeDefined();

    const resolveBtns = screen.getAllByRole('button', { name: /Resolve Ticket/i });
    expect(resolveBtns.length).toBe(3);
    fireEvent.click(resolveBtns[0]);
    expect(screen.queryByText(/Chiller & Central AC Total Breakdown/i)).toBeNull();
  });
});
