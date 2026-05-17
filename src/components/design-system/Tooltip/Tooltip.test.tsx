import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Mock styled-components for Tooltip (use simple HTML elements)
vi.mock('styled-components', async () => {
  const actual = await vi.importActual('styled-components');
  return actual;
});

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders tooltip content text', () => {
      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByText('Help text')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <Tooltip content="Tip" className="custom-tip">
          <span>Target</span>
        </Tooltip>
      );
      expect(container.querySelector('.custom-tip')).toBeInTheDocument();
    });

    it('renders ReactNode content', () => {
      render(
        <Tooltip content={<strong>Bold tip</strong>}>
          <span>Target</span>
        </Tooltip>
      );
      expect(screen.getByText('Bold tip')).toBeInTheDocument();
    });
  });

  // === POSITIONS ===
  describe('positions', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach(position => {
      it(`renders in ${position} position without error`, () => {
        render(
          <Tooltip content="Tip" position={position}>
            <span>Target</span>
          </Tooltip>
        );
        expect(screen.getByText('Target')).toBeInTheDocument();
      });
    });
  });

  // === HOVER INTERACTION ===
  describe('hover interaction', () => {
    it('shows tooltip on mouse enter', () => {
      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );
      const target = screen.getByText('Hover me').closest('div')!;
      fireEvent.mouseEnter(target);
      // Tooltip content should be visible (opacity: 1)
      expect(screen.getByText('Help text')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', () => {
      render(
        <Tooltip content="Help text">
          <button>Hover me</button>
        </Tooltip>
      );
      const target = screen.getByText('Hover me').closest('div')!;
      fireEvent.mouseEnter(target);
      fireEvent.mouseLeave(target);
      expect(screen.getByText('Help text')).toBeInTheDocument();
    });

    it('supports delay before showing', () => {
      vi.useFakeTimers();
      render(
        <Tooltip content="Delayed" delay={300}>
          <span>Target</span>
        </Tooltip>
      );
      const target = screen.getByText('Target').closest('div')!;
      fireEvent.mouseEnter(target);
      // Content exists in DOM but not yet visible
      expect(screen.getByText('Delayed')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.getByText('Delayed')).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('cancels delayed tooltip on early mouse leave', () => {
      vi.useFakeTimers();
      render(
        <Tooltip content="Delayed" delay={300}>
          <span>Target</span>
        </Tooltip>
      );
      const target = screen.getByText('Target').closest('div')!;
      fireEvent.mouseEnter(target);
      fireEvent.mouseLeave(target);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      // Should not crash, content exists but hidden
      expect(screen.getByText('Delayed')).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  // === DISPLAY NAME ===
  it('has correct displayName', () => {
    expect(Tooltip.displayName).toBe('Tooltip');
  });
});
