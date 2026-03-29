import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock theme
vi.mock('../../../styles/theme', () => ({
  theme: {
    spacing: { xs: '4px', sm: '8px', md: '16px' },
    colors: {
      border: '#e0e0e0',
      background: { secondary: '#f5f5f5', tertiary: '#eee' },
      text: { primary: '#222', disabled: '#aaa' },
      primary: '#E31E24',
      error: '#C62828',
    },
    typography: {
      sizes: { sm: '13px', xs: '12px' },
      weights: { medium: 500 },
    },
    transitions: { all: 'all 0.2s ease' },
  },
}));

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders a checkbox input', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with a label', () => {
      render(<Checkbox label="Remember me" />);
      expect(screen.getByText('Remember me')).toBeInTheDocument();
    });

    it('renders without a label', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(<Checkbox error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('does not render error message when not provided', () => {
      const { container } = render(<Checkbox />);
      expect(container.querySelector('div[style]')).not.toBeInTheDocument();
    });
  });

  // === CHECKED STATE ===
  describe('checked state', () => {
    it('is unchecked by default', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('respects checked prop', () => {
      render(<Checkbox checked onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('respects defaultChecked prop', () => {
      render(<Checkbox defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  // === EVENTS ===
  describe('events', () => {
    it('calls onChange handler when toggled', () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler when clicked', () => {
      const onClick = vi.fn();
      render(<Checkbox onClick={onClick} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // === DISABLED STATE ===
  describe('disabled state', () => {
    it('disables checkbox when disabled prop is true', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('prevents interaction when disabled', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  // === REF FORWARDING ===
  describe('ref forwarding', () => {
    it('forwards ref to the checkbox input', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });
  });

  // === CLASSNAME ===
  describe('className', () => {
    it('passes className to wrapper div', () => {
      const { container } = render(<Checkbox className="custom-checkbox" />);
      expect(container.firstChild).toHaveClass('custom-checkbox');
    });
  });

  // === DISPLAY NAME ===
  describe('displayName', () => {
    it('has correct display name', () => {
      expect(Checkbox.displayName).toBe('Checkbox');
    });
  });

  // === ADDITIONAL PROPS ===
  describe('additional props', () => {
    it('passes name prop to input', () => {
      render(<Checkbox name="terms" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'terms');
    });

    it('passes value prop to input', () => {
      render(<Checkbox value="yes" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'yes');
    });

    it('passes id prop to input', () => {
      render(<Checkbox id="check-1" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'check-1');
    });
  });
});
