import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TreeNavigationProvider, useTreeNavigation } from './TreeNavigationContext';
import { TreeBreadcrumbs } from '../components/navigation/TreeBreadcrumbs';

const TestTreeConsumer: React.FC = () => {
  const {
    navState,
    navigateTo,
    openLeafTask,
    completeLeafTask,
    toggleLeftDrawer,
    toggleNodeExpansion,
    isNodeExpanded
  } = useTreeNavigation();

  return (
    <div>
      <div data-testid="floor-val">{navState.activeFloor}</div>
      <div data-testid="dept-val">{navState.activeDepartment}</div>
      <div data-testid="task-val">{navState.activeLeafTask || 'none'}</div>
      <div data-testid="drawer-val">{navState.isLeftDrawerOpen ? 'open' : 'closed'}</div>
      <div data-testid="node-expanded">{isNodeExpanded('folder-1') ? 'yes' : 'no'}</div>

      <button
        data-testid="btn-nav"
        onClick={() => navigateTo({ floor: 3, deptCode: 'WC-SALES', groupId: 'offplan', entityId: 'unit-402' })}
      >
        Go To Unit
      </button>

      <button
        data-testid="btn-open-leaf"
        onClick={() => openLeafTask('noc-generator', 'unit-402')}
      >
        Open Leaf
      </button>

      <button
        data-testid="btn-complete-leaf"
        onClick={() => completeLeafTask()}
      >
        Complete Leaf
      </button>

      <button
        data-testid="btn-toggle-drawer"
        onClick={() => toggleLeftDrawer()}
      >
        Toggle Drawer
      </button>

      <button
        data-testid="btn-toggle-node"
        onClick={() => toggleNodeExpansion('folder-1')}
      >
        Toggle Node
      </button>

      <TreeBreadcrumbs />
    </div>
  );
};

describe('Jack Sparrow Navigation Protocol (TreeNavigationContext)', () => {
  it('initializes with default floor and department', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TreeNavigationProvider defaultFloor={1} defaultDept="WC-CX">
          <TestTreeConsumer />
        </TreeNavigationProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('floor-val').textContent).toBe('1');
    expect(screen.getByTestId('dept-val').textContent).toBe('WC-CX');
    expect(screen.getByTestId('task-val').textContent).toBe('none');
    expect(screen.getByTestId('drawer-val').textContent).toBe('open');
  });

  it('navigates through hierarchy levels and renders dynamic breadcrumbs', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TreeNavigationProvider>
          <TestTreeConsumer />
        </TreeNavigationProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('btn-nav'));

    expect(screen.getByTestId('floor-val').textContent).toBe('3');
    expect(screen.getByTestId('dept-val').textContent).toBe('WC-SALES');

    // Breadcrumbs check
    expect(screen.getByText('Floor 3')).toBeDefined();
    expect(screen.getByText('WC-SALES')).toBeDefined();
    expect(screen.getByText('offplan')).toBeDefined();
    expect(screen.getByText('unit-402')).toBeDefined();
  });

  it('handles deepest leaf task opening and returns cleanly to parent upon completion', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TreeNavigationProvider>
          <TestTreeConsumer />
        </TreeNavigationProvider>
      </MemoryRouter>
    );

    // Open leaf task
    fireEvent.click(screen.getByTestId('btn-open-leaf'));
    expect(screen.getByTestId('task-val').textContent).toBe('noc-generator');
    expect(screen.getByText('⚡ noc-generator')).toBeDefined();

    // Complete leaf task and return to parent
    fireEvent.click(screen.getByTestId('btn-complete-leaf'));
    expect(screen.getByTestId('task-val').textContent).toBe('none');
  });

  it('supports node expansion toggling in tree drawer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TreeNavigationProvider>
          <TestTreeConsumer />
        </TreeNavigationProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('node-expanded').textContent).toBe('no');
    fireEvent.click(screen.getByTestId('btn-toggle-node'));
    expect(screen.getByTestId('node-expanded').textContent).toBe('yes');
    fireEvent.click(screen.getByTestId('btn-toggle-node'));
    expect(screen.getByTestId('node-expanded').textContent).toBe('no');
  });
});
