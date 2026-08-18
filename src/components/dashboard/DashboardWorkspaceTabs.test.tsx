import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardWorkspaceTabs from './DashboardWorkspaceTabs';

describe('DashboardWorkspaceTabs Component', () => {
  it('renders subnav and workspace content properly', () => {
    const onBack = vi.fn();

    render(
      <DashboardWorkspaceTabs
        roleSubNavItemsCount={2}
        subNav={<nav data-testid="test-subnav">Subnav Links</nav>}
        selectedCRMModuleLabel="Leasing Hub"
        showModuleToolbar={true}
        contentKey="leasing-key"
        isLoading={false}
        content={<div data-testid="workspace-content">Active Workspace View</div>}
        loadingFallback={<div>Loading...</div>}
        prefersReducedMotion={true}
        onBackFromCRM={onBack}
      />
    );

    expect(screen.getByTestId('test-subnav')).toBeInTheDocument();
    expect(screen.getByText('Leasing Hub')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-content')).toBeInTheDocument();

    const backButton = screen.getByText('← Back to dashboard');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });

  it('renders loading fallback when isLoading is true', () => {
    render(
      <DashboardWorkspaceTabs
        roleSubNavItemsCount={0}
        subNav={null}
        showModuleToolbar={false}
        contentKey="loading-key"
        isLoading={true}
        content={<div>Loaded Content</div>}
        loadingFallback={<div data-testid="fallback-loader">Loading State...</div>}
        prefersReducedMotion={true}
        onBackFromCRM={vi.fn()}
      />
    );

    expect(screen.getByTestId('fallback-loader')).toBeInTheDocument();
  });
});
