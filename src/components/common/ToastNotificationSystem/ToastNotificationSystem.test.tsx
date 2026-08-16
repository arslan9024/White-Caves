import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastNotificationSystem } from './ToastNotificationSystem';

describe('ToastNotificationSystem Component', () => {
  it('renders toast notifications and allows dismiss', () => {
    render(<ToastNotificationSystem />);
    expect(screen.getByTestId('toast-notification-system')).toBeDefined();
    expect(screen.getByText(/Form B MOU Signed/i)).toBeDefined();
    expect(screen.getByText(/New VIP Inbound Inquiry/i)).toBeDefined();

    // Click close on first toast
    const closeButtons = screen.getAllByText('✕');
    fireEvent.click(closeButtons[0]);
    expect(screen.queryByText(/Form B MOU Signed/i)).toBeNull();
  });
});
