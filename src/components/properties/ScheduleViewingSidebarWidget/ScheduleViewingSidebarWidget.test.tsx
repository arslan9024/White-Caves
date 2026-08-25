import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleViewingSidebarWidget } from './ScheduleViewingSidebarWidget';

describe('ScheduleViewingSidebarWidget', () => {
  it('renders booking fields and handles schedule submission', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ScheduleViewingSidebarWidget />);

    expect(screen.getByTestId('schedule-viewing-sidebar-widget')).toBeDefined();
    expect(screen.getByText(/Schedule Private Viewing/i)).toBeDefined();

    const submitBtn = screen.getByText(/Confirm VIP Viewing Request/i);
    fireEvent.click(submitBtn);

    alertSpy.mockRestore();
  });
});
