import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ExecutiveAIVSCodeSidebar from './ExecutiveAIVSCodeSidebar';

afterEach(() => {
  cleanup();
});

describe('ExecutiveAIVSCodeSidebar Component (7-Category Co-Location Spec)', () => {
  it('renders AI Command Center drawer with Zoe Sovereign card and AI Linda by default', () => {
    render(<ExecutiveAIVSCodeSidebar />);
    expect(screen.getAllByText(/AI Command Center/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI Zoe/i)).toBeInTheDocument();
    expect(screen.getByText(/COO Executive AI Partner/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Linda/i)).toBeInTheDocument();
    expect(screen.getByText(/BOT-LINDA/i)).toBeInTheDocument();
  });

  it('invokes onSelectAgent with linda when AI Linda is clicked in right sidebar', () => {
    const onSelectAgent = vi.fn();
    render(<ExecutiveAIVSCodeSidebar onSelectAgent={onSelectAgent} />);

    const lindaTile = screen.getByTestId('right-sidebar-agent-linda');
    fireEvent.click(lindaTile);

    expect(onSelectAgent).toHaveBeenCalledWith('linda', expect.stringContaining('AI Linda'));
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
