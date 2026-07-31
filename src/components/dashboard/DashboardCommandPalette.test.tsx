import React from 'react';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardCommandPalette from './DashboardCommandPalette';
import type { CommandPaletteItemData } from './DashboardCommandPalette';

/* Stub scrollIntoView — jsdom does not implement it */
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

/* framer-motion stub — AnimatePresence renders children, motion.div renders a plain div */
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: React.forwardRef(function MotionDiv(
      { children, initial, animate, exit, transition, ...rest }: any,
      ref: any,
    ) {
      return <div ref={ref} {...rest}>{children}</div>;
    }),
  },
}));

const items: CommandPaletteItemData[] = [
  { id: '1', icon: '📊', label: 'Dashboard', meta: 'Main view' },
  { id: '2', icon: '🤖', label: 'AI Command', meta: 'Assistant panel' },
];

describe('DashboardCommandPalette', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DashboardCommandPalette
        isOpen={false}
        query=""
        items={items}
        prefersReducedMotion={true}
        onClose={vi.fn()}
        onQueryChange={vi.fn()}
        onEnter={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(container.querySelector('.dashboard-command-palette')).toBeNull();
  });

  it('renders the dialog when isOpen is true', () => {
    render(
      <DashboardCommandPalette
        isOpen={true}
        query=""
        items={items}
        prefersReducedMotion={true}
        onClose={vi.fn()}
        onQueryChange={vi.fn()}
        onEnter={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Command palette')).toBeInTheDocument();
  });

  it('calls onSelect when an item is clicked', () => {
    const onSelect = vi.fn();
    render(
      <DashboardCommandPalette
        isOpen={true}
        query=""
        items={items}
        prefersReducedMotion={true}
        onClose={vi.fn()}
        onQueryChange={vi.fn()}
        onEnter={vi.fn()}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText('Dashboard'));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it('shows empty state when items list is empty', () => {
    render(
      <DashboardCommandPalette
        isOpen={true}
        query="xyz"
        items={[]}
        prefersReducedMotion={true}
        onClose={vi.fn()}
        onQueryChange={vi.fn()}
        onEnter={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('No matching tabs or modules.')).toBeInTheDocument();
  });

  it('calls onClose when Esc button is clicked', () => {
    const onClose = vi.fn();
    render(
      <DashboardCommandPalette
        isOpen={true}
        query=""
        items={items}
        prefersReducedMotion={true}
        onClose={onClose}
        onQueryChange={vi.fn()}
        onEnter={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Esc'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
