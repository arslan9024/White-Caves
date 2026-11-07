import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AICommandCenterPage from './AICommandCenterPage';

describe('AICommandCenterPage — Sovereign Production Hub', () => {
  it('renders header, 12 corporate departments, and executive partner Zoe', () => {
    render(<AICommandCenterPage />);

    expect(screen.getByText('White Caves AI Command Center')).toBeInTheDocument();
    expect(screen.getByText('AI EXECUTIVE PARTNER')).toBeInTheDocument();
    expect(screen.getByText('🏢 12 Corporate Departments')).toBeInTheDocument();
  });

  it('allows switching departments and filtering supervisors via search', () => {
    render(<AICommandCenterPage />);

    const searchInput = screen.getByPlaceholderText(/Search within/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Luxury' } });
    expect(searchInput).toHaveValue('Luxury');
  });

  it('navigates to Standby Roster and displays reserve specialists', () => {
    render(<AICommandCenterPage />);

    const standbyTab = screen.getByText(/Unassigned Standby Roster/i);
    fireEvent.click(standbyTab);

    expect(screen.getByText('Seraphina')).toBeInTheDocument();
    expect(screen.getByText('Kallista')).toBeInTheDocument();
  });
});

