import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickActionFabPanel } from './QuickActionFabPanel';

describe('QuickActionFabPanel Component', () => {
  it('renders floating action button and expands speed dial actions on click', () => {
    render(<QuickActionFabPanel />);
    expect(screen.getByTestId('quick-action-fab-panel')).toBeDefined();
    const fabButton = screen.getByRole('button', { name: /Executive Quick Actions/i });
    expect(fabButton).toBeDefined();

    // Click to open menu
    fireEvent.click(fabButton);
    expect(screen.getByText(/\+ Create VIP Lead/i)).toBeDefined();
    expect(screen.getByText(/\+ New Property Listing/i)).toBeDefined();
    expect(screen.getByText(/\+ Dispatch Tax Invoice/i)).toBeDefined();
  });
});
