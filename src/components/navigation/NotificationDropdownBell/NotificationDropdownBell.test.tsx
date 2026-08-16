import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationDropdownBell } from './NotificationDropdownBell';

describe('NotificationDropdownBell Component', () => {
  it('renders notification bell with unread count and reveals alert feed on click', () => {
    render(<NotificationDropdownBell />);
    expect(screen.getByTestId('notification-dropdown-bell')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();

    // Click to open dropdown
    const bellBtn = screen.getByRole('button', { name: /Notifications/i });
    fireEvent.click(bellBtn);
    expect(screen.getByText(/Executive Alerts/i)).toBeDefined();
    expect(screen.getByText(/New VIP Lead Ingest/i)).toBeDefined();
    expect(screen.getByText(/Form B Digital Signature/i)).toBeDefined();
  });
});
