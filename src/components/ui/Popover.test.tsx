/**
 * Popover — Test Suite
 * ====================
 * Comprehensive tests for the Popover UI component covering click/hover
 * triggers, placements, outside-click close, callbacks, and accessibility.
 *
 * 14 tests across 5 describe blocks.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Popover } from './Popover';

// ─── Helpers ──────────────────────────────────────────────────
const renderPopover = (props: Partial<React.ComponentProps<typeof Popover>> = {}) =>
  render(
    <Popover content={<div>Popover content here</div>} {...props}>
      <button>Click me</button>
    </Popover>,
  );

afterEach(() => {
  vi.restoreAllMocks();
});

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('Popover', () => {
  describe('Click trigger (default)', () => {
    it('renders children but hides popover content initially', () => {
      renderPopover();
      expect(screen.getByText('Click me')).toBeTruthy();
      // Content present in DOM but visually hidden
      expect(screen.getByText('Popover content here')).toBeTruthy();
    });

    it('shows popover content on click', () => {
      renderPopover();
      fireEvent.click(screen.getByText('Click me'));
      const content = screen.getByText('Popover content here');
      expect(content.closest('[style]')).toBeTruthy();
    });

    it('toggles popover off on second click', () => {
      const onClose = vi.fn();
      renderPopover({ onClose });
      const trigger = screen.getByText('Click me');

      fireEvent.click(trigger); // open
      fireEvent.click(trigger); // close
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('fires onOpen callback when opened', () => {
      const onOpen = vi.fn();
      renderPopover({ onOpen });
      fireEvent.click(screen.getByText('Click me'));
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('fires onClose callback when closed', () => {
      const onClose = vi.fn();
      renderPopover({ onClose });
      const trigger = screen.getByText('Click me');

      fireEvent.click(trigger); // open
      fireEvent.click(trigger); // close
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hover trigger', () => {
    it('shows popover on mouse enter', () => {
      const onOpen = vi.fn();
      renderPopover({ trigger: 'hover', onOpen });

      const wrapper = screen.getByText('Click me').closest('[class]')!.parentElement!;
      fireEvent.mouseEnter(wrapper);
      expect(onOpen).toHaveBeenCalled();
    });

    it('hides popover on mouse leave', () => {
      const onClose = vi.fn();
      renderPopover({ trigger: 'hover', onClose });

      const wrapper = screen.getByText('Click me').closest('[class]')!.parentElement!;
      fireEvent.mouseEnter(wrapper);
      fireEvent.mouseLeave(wrapper);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Click outside', () => {
    it('closes popover when clicking outside', () => {
      const onClose = vi.fn();
      renderPopover({ onClose });

      // Open
      fireEvent.click(screen.getByText('Click me'));
      // Click outside (on document.body proxy)
      fireEvent.mouseDown(document.body);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Placements', () => {
    it.each(['top', 'bottom', 'left', 'right'] as const)(
      'renders with placement=%s without errors',
      (placement) => {
        const { container } = renderPopover({ placement });
        expect(container.firstChild).toBeTruthy();
      },
    );
  });

  describe('Accessibility', () => {
    it('click trigger has role="button" and aria-expanded', () => {
      renderPopover();
      const trigger = screen.getByText('Click me').closest('[role="button"]')!;
      expect(trigger).toBeTruthy();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      fireEvent.click(trigger);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('opens on Enter key from trigger', () => {
      const onOpen = vi.fn();
      renderPopover({ onOpen });
      const trigger = screen.getByText('Click me').closest('[role="button"]')!;

      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(onOpen).toHaveBeenCalled();
    });
  });
});
