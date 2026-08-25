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
});
