import { describe, it, expect, vi } from 'vitest';
import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardTopBar from './DashboardTopBar';

describe('DashboardTopBar Component', () => {
  it('renders brand, greeting, search input and triggers interactions', () => {
    const onOpenCommandPalette = vi.fn();
    const onQuickAction = vi.fn();
    const onSearchChange = vi.fn();
    const onSearchFocus = vi.fn();
    const onSearchEnter = vi.fn();
    const ref = createRef<HTMLDivElement>();

    render(
      <DashboardTopBar
        globalSearchRef={ref}
        globalSearchQuery="villa"
        isGlobalSearchOpen={false}
        globalSearchResults={null}
        hotLeadsCount={5}
        greetingName="Arslan"
        userEmail="arslanmalikgoraha@gmail.com"
        onOpenCommandPalette={onOpenCommandPalette}
        onQuickAction={onQuickAction}
        onSearchChange={onSearchChange}
        onSearchFocus={onSearchFocus}
        onSearchEnter={onSearchEnter}
      />
    );

    expect(screen.getByText('White Caves CRM')).toBeInTheDocument();
    expect(screen.getByText('Arslan')).toBeInTheDocument();
    expect(screen.getByText('arslanmalikgoraha@gmail.com')).toBeInTheDocument();

    const input = screen.getByLabelText('Search dashboard records');
    expect(input).toHaveValue('villa');

    fireEvent.change(input, { target: { value: 'penthouse' } });
    expect(onSearchChange).toHaveBeenCalledWith('penthouse');

    fireEvent.focus(input);
    expect(onSearchFocus).toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSearchEnter).toHaveBeenCalled();

    const cmdButton = screen.getByText(/Command palette/i);
    fireEvent.click(cmdButton);
    expect(onOpenCommandPalette).toHaveBeenCalled();

    const quickBtn = screen.getByText(/\+ Quick action/i);
    fireEvent.click(quickBtn);
    expect(onQuickAction).toHaveBeenCalled();
  });
});
