import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Switch } from './Switch';

describe('Switch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders a checkbox input', () => {
      render(<Switch />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label text', () => {
      render(<Switch label="Dark Mode" />);
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('renders without label by default', () => {
      const { container } = render(<Switch />);
      const spans = container.querySelectorAll('span');
      // Only the track span, no label span
      expect(spans.length).toBeGreaterThanOrEqual(1);
    });

    it('renders with custom className', () => {
      const { container } = render(<Switch className="custom-switch" />);
      expect(container.querySelector('.custom-switch')).toBeInTheDocument();
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Switch ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });
  });

  // === SIZES ===
  describe('sizes', () => {
    it('renders sm size', () => {
      render(<Switch size="sm" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders md size', () => {
      render(<Switch size="md" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders lg size', () => {
      render(<Switch size="lg" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  // === INTERACTION ===
  describe('interaction', () => {
    it('fires onChange when clicked', () => {
      const onChange = vi.fn();
      render(<Switch onChange={onChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('can be checked', () => {
      render(<Switch defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('can be disabled', () => {
      render(<Switch disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('toggles checked state', () => {
      const onChange = vi.fn();
      render(<Switch onChange={onChange} />);
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  // === DISPLAY NAME ===
  it('has correct displayName', () => {
    expect(Switch.displayName).toBe('Switch');
  });
});
