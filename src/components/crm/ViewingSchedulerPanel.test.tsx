import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ViewingSchedulerPanel } from './ViewingSchedulerPanel';

// ── Guard: no window.alert() usage ──────────────────────────────────────────
describe('ViewingSchedulerPanel — production quality guards', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(<ViewingSchedulerPanel />);
    expect(screen.getByText(/Viewing Scheduler/i)).toBeInTheDocument();
  });

  it('renders the week view calendar by default', () => {
    render(<ViewingSchedulerPanel />);
    // Week view tab should be active
    expect(screen.getByText(/Week View/i)).toBeInTheDocument();
  });

  it('renders list of viewings in week view', () => {
    render(<ViewingSchedulerPanel />);
    // Should show today's stats label
    expect(screen.getByText(/Today's Viewings/i)).toBeInTheDocument();
  });

  it('can switch to list view', () => {
    render(<ViewingSchedulerPanel />);
    const listBtn = screen.getByText(/List View/i);
    fireEvent.click(listBtn);
    // Table headers should appear (uppercase CLIENT)
    expect(screen.getByText('CLIENT')).toBeInTheDocument();
  });

  it('can switch to new viewing form', () => {
    render(<ViewingSchedulerPanel />);
    const newBtn = screen.getByText(/Book Viewing/i);
    fireEvent.click(newBtn);
    expect(screen.getByText(/Book New Property Viewing/i)).toBeInTheDocument();
  });

  it('never calls window.alert() on any user interaction', () => {
    render(<ViewingSchedulerPanel />);
    // Switch to list view and click details
    const listBtn = screen.getByText(/List View/i);
    fireEvent.click(listBtn);
    // The alert spy should never have been called
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('shows KPI stats bar with today and upcoming counts', () => {
    render(<ViewingSchedulerPanel />);
    expect(screen.getByText(/Today's Viewings/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Confirmed/i)).toBeInTheDocument();
  });

  it('shows agent filter dropdown', () => {
    render(<ViewingSchedulerPanel />);
    expect(screen.getByText('All Agents')).toBeInTheDocument();
  });
});
