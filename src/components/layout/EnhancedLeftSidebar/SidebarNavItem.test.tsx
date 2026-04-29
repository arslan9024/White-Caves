import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Home } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

describe('SidebarNavItem', () => {
  it('renders icon, label, and badge', () => {
    render(
      <SidebarNavItem
        id="test-item"
        icon={Home}
        label="Home"
        badge={3}
        badgeColor="#EF4444"
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('supports ARIA tree semantics', () => {
    render(
      <SidebarNavItem
        id="sales-item"
        label="Sales"
        expandable
        expanded
        buttonRole="treeitem"
        ariaLevel={1}
        ariaExpanded
        ariaSelected
        ariaControls="dept-group-sales"
      />
    );

    const button = screen.getByRole('treeitem', { name: 'Sales' });
    expect(button).toHaveAttribute('aria-level', '1');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'dept-group-sales');
    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onExpand when expandable item is clicked', () => {
    const onExpand = vi.fn();

    render(
      <SidebarNavItem
        id="dept-sales"
        label="Sales"
        expandable
        expanded={false}
        onExpand={onExpand}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sales' }));
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('applies focus props for keyboard navigation', () => {
    const ref = vi.fn();

    render(
      <SidebarNavItem
        id="kbd-item"
        label="Keyboard Item"
        focusProps={{
          ref,
          tabIndex: 0,
          'aria-label': 'Keyboard Item',
          'data-focus-idx': 2,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Keyboard Item' });
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).toHaveAttribute('data-focus-idx', '2');
  });
});
