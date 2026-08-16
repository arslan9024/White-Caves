import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardViewModeSelector } from './DashboardViewModeSelector';

describe('DashboardViewModeSelector Component', () => {
  it('renders density view mode selector and handles mode switching', () => {
    const onModeChange = vi.fn();
    render(<DashboardViewModeSelector onModeChange={onModeChange} />);
    expect(screen.getByTestId('dashboard-view-mode-selector')).toBeDefined();
    expect(screen.getByText(/Expanded Sovereign Deck/i)).toBeDefined();

    const compactBtn = screen.getByText(/Compact Density/i);
    fireEvent.click(compactBtn);
    expect(onModeChange).toHaveBeenCalledWith('compact');
  });
});
