import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useKeyboardNavigation, type NavigableItem } from './useKeyboardNavigation';

interface HarnessProps {
  items: NavigableItem[];
  onSelect?: (item: NavigableItem, idx: number) => void;
  onExpand?: (item: NavigableItem, shouldExpand: boolean) => void;
  onEscape?: () => void;
}

function KeyboardHarness({ items, onSelect, onExpand, onEscape }: HarnessProps) {
  const { handleKeyDown, getFocusProps, setFocus } = useKeyboardNavigation({
    items,
    onSelect,
    onExpand,
    onEscape,
  });

  return (
    <div data-testid="keyboard-harness" onKeyDown={handleKeyDown}>
      <button data-testid="focus-first" onClick={() => setFocus(0)}>Focus First</button>
      {items.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          data-testid={`nav-${item.id}`}
          {...getFocusProps(idx)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

describe('useKeyboardNavigation', () => {
  const items: NavigableItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'dept-sales', label: 'Sales', isExpandable: true, isExpanded: false },
    { id: 'assistant-nadia', label: 'Nadia' },
  ];

  it('moves focus with ArrowDown / ArrowUp', () => {
    render(<KeyboardHarness items={items} />);

    fireEvent.click(screen.getByTestId('focus-first'));

    const first = screen.getByTestId('nav-home');
    const second = screen.getByTestId('nav-dept-sales');

    expect(first).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('keyboard-harness'), { key: 'ArrowDown' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('keyboard-harness'), { key: 'ArrowUp' });
    expect(first).toHaveFocus();
  });

  it('calls onSelect on Enter', () => {
    const onSelect = vi.fn();
    render(<KeyboardHarness items={items} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId('focus-first'));
    fireEvent.keyDown(screen.getByTestId('keyboard-harness'), { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].id).toBe('home');
  });

  it('calls onExpand for expandable items with ArrowRight/ArrowLeft', () => {
    const onExpand = vi.fn();
    render(<KeyboardHarness items={items} onExpand={onExpand} />);

    fireEvent.click(screen.getByTestId('focus-first'));
    fireEvent.keyDown(screen.getByTestId('keyboard-harness'), { key: 'ArrowDown' });

    fireEvent.keyDown(screen.getByTestId('keyboard-harness'), { key: 'ArrowRight' });
    expect(onExpand).toHaveBeenCalledWith(expect.objectContaining({ id: 'dept-sales' }), true);
  });

  it('calls onEscape and clears focus on Escape', () => {
    const onEscape = vi.fn();
    render(<KeyboardHarness items={items} onEscape={onEscape} />);

    fireEvent.click(screen.getByTestId('focus-first'));
    expect(screen.getByTestId('nav-home')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('keyboard-harness'), { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('nav-home')).toHaveAttribute('tabindex', '-1');
  });
});
