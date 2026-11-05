import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExecutiveVSCodeSidebar from './ExecutiveVSCodeSidebar';

describe('ExecutiveVSCodeSidebar Component (7-Category Co-Location Spec)', () => {
  it('renders Explorer drawer and corporate activity bar', () => {
    render(<ExecutiveVSCodeSidebar />);
    expect(screen.getByText(/White Caves Explorer/i)).toBeInTheDocument();
  });

  it('renders 5th Activity Bar icon for Corporate Departments and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const deptBtn = screen.getByTestId('activity-btn-departments');
    expect(deptBtn).toBeInTheDocument();

    fireEvent.click(deptBtn);
    expect(onSelectTab).toHaveBeenCalledWith('departments');
    expect(screen.getByText(/Departments Hub/i)).toBeInTheDocument();
  }, 15000);

  it('renders 6th Activity Bar icon for Employees and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const empBtn = screen.getByTestId('activity-btn-employees');
    expect(empBtn).toBeInTheDocument();

    fireEvent.click(empBtn);
    expect(onSelectTab).toHaveBeenCalledWith('employees');
    expect(screen.getByText(/Employees Hub/i)).toBeInTheDocument();
  }, 15000);

  it('renders 7th Activity Bar icon for Tasks and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const taskBtn = screen.getByTestId('activity-btn-tasks');
    expect(taskBtn).toBeInTheDocument();

    fireEvent.click(taskBtn);
    expect(onSelectTab).toHaveBeenCalledWith('tasks');
    expect(screen.getByText(/200\+ Tasks Catalog/i)).toBeInTheDocument();
  }, 15000);

  it('renders 8th Activity Bar icon for Leaderboard and switches tabs', () => {
    const onSelectTab = vi.fn();
    render(<ExecutiveVSCodeSidebar onSelectTab={onSelectTab} />);

    const leadBtn = screen.getByTestId('activity-btn-leaderboard');
    expect(leadBtn).toBeInTheDocument();

    fireEvent.click(leadBtn);
    expect(onSelectTab).toHaveBeenCalledWith('leaderboard');
    expect(screen.getByText(/Merit Leaderboard & Tiers/i)).toBeInTheDocument();
  }, 15000);
});
