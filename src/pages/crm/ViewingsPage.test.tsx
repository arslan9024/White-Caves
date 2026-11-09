import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewingsPage from './ViewingsPage';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ViewingsPage — Reschedule Flow Upgrade', () => {
  it('opens reschedule modal with date picker and saves new schedule without browser prompt', () => {
    render(
      <ThemeProvider>
        <ViewingsPage />
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: /Client Viewings/i })).toBeInTheDocument();

    const rescheduleButtons = screen.getAllByRole('button', { name: /Reschedule/i });
    expect(rescheduleButtons.length).toBeGreaterThan(0);

    fireEvent.click(rescheduleButtons[0]);

    // Verify luxury modal appears
    expect(screen.getByRole('dialog', { name: /Reschedule Viewing/i })).toBeInTheDocument();
    expect(screen.getByTestId('reschedule-datetime-input')).toBeInTheDocument();

    // Change datetime
    fireEvent.change(screen.getByTestId('reschedule-datetime-input'), {
      target: { value: '2026-12-15T14:30' },
    });

    // Save reschedule via TaskActionBar
    const saveBtn = screen.getByTestId('confirm-reschedule-btn');
    fireEvent.click(saveBtn);

    // Modal closes
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
