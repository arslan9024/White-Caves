import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DashboardAiTile } from './DashboardAiTile';

describe('DashboardAiTile', () => {
  const defaultProps = {
    isOpen: true,
    isCollapsed: false,
    selectedAi: { id: 'theodora', num: '3.14', name: 'Theodora', role: 'Finance & Invoicing Engine', icon: '💰' },
    selectedAiId: 'theodora',
    onTileClick: vi.fn(),
    onSelectAiAssistant: vi.fn(),
  };

  it('renders AI Command Center tile with assistant count and dropdown', () => {
    render(<DashboardAiTile {...defaultProps} />);

    expect(screen.getByText(/3\. AI Command Center \(40 AI\)/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Teams/i)).toBeInTheDocument();
  });

  it('selects an assistant belonging to the selected team', () => {
    const onSelectAiAssistant = vi.fn();
    render(
      <DashboardAiTile
        {...defaultProps}
        onSelectAiAssistant={onSelectAiAssistant}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /View Teams/i }));
    fireEvent.click(screen.getByRole('button', { name: /Sales, Leads & Acquisition Squad/i }));

    expect(onSelectAiAssistant).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'sophia' }),
    );
  });

  it('keeps the selected assistant when it belongs to the selected team', () => {
    const onSelectAiAssistant = vi.fn();
    render(
      <DashboardAiTile
        {...defaultProps}
        onSelectAiAssistant={onSelectAiAssistant}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /View Teams/i }));
    fireEvent.click(screen.getByRole('button', { name: /Finance, Treasury & Accounts Squad/i }));

    expect(onSelectAiAssistant).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'theodora' }),
    );
  });
});
