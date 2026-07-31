import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardModuleToolbar from './DashboardModuleToolbar';

describe('DashboardModuleToolbar', () => {
  it('renders the back button with correct text', () => {
    render(<DashboardModuleToolbar label="Lead Management" onBack={vi.fn()} />);
    expect(screen.getByText('← Back to dashboard')).toBeInTheDocument();
  });

  it('displays the module label', () => {
    render(<DashboardModuleToolbar label="Tenancy Contracts" onBack={vi.fn()} />);
    expect(screen.getByText('Tenancy Contracts')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<DashboardModuleToolbar label="Pipeline" onBack={onBack} />);
    fireEvent.click(screen.getByText('← Back to dashboard'));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('renders the toolbar container div', () => {
    const { container } = render(<DashboardModuleToolbar label="Test" onBack={vi.fn()} />);
    expect(container.querySelector('.dashboard-module-toolbar')).toBeInTheDocument();
  });
});
