import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExecutiveAIVSCodeSidebar from './ExecutiveAIVSCodeSidebar';

describe('ExecutiveAIVSCodeSidebar Component (7-Category Co-Location Spec)', () => {
  it('renders AI Command Center drawer with Zoe Sovereign card by default', () => {
    render(<ExecutiveAIVSCodeSidebar />);
    expect(screen.getByText(/AI Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Zoe/i)).toBeInTheDocument();
    expect(screen.getByText(/COO Executive AI Partner/i)).toBeInTheDocument();
  });

  it('switches to White Caves Explorer in right sidebar when explorer tab icon is clicked', () => {
    const onSelectItem = vi.fn();
    render(<ExecutiveAIVSCodeSidebar onSelectItem={onSelectItem} />);

    const explorerBtn = screen.getByTestId('activity-btn-explorer-right');
    expect(explorerBtn).toBeInTheDocument();

    fireEvent.click(explorerBtn);
    expect(screen.getByText(/White Caves Explorer/i)).toBeInTheDocument();
    expect(screen.getByTestId('right-sidebar-explorer-tree')).toBeInTheDocument();
  });
});
