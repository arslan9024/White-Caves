import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSidebarToggle } from './CollapsibleSidebarToggle';

describe('CollapsibleSidebarToggle Component', () => {
  it('renders collapsible sidebar and toggles collapse state', () => {
    render(<CollapsibleSidebarToggle />);
    expect(screen.getByTestId('collapsible-sidebar-toggle')).toBeDefined();
    expect(screen.getByText(/Collapse Sidebar/i)).toBeDefined();
    expect(screen.getByText(/Dashboard/i)).toBeDefined();

    // Click toggle button
    const toggleBtn = screen.getByText(/Collapse Sidebar/i);
    fireEvent.click(toggleBtn);
    expect(screen.getByText('▶')).toBeDefined();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });
});
