import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./Input.styles', () => {
  const c = (tag: string) => React.forwardRef(({ children, ...props }: any, ref: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, { ...filtered, ref }, children);
  });
  return {
    InputWrapper: c('div'),
    Label: ({ children, ...props }: any) => {
      const { $required, ...rest } = props;
      return React.createElement('label', rest, children, $required ? React.createElement('span', null, ' *') : null);
    },
    InputContainer: c('div'),
    StyledInput: React.forwardRef(({ children, ...props }: any, ref: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('input', { ...filtered, ref });
    }),
    IconWrapper: c('span'),
    HelperText: ({ children, ...props }: any) => {
      const { $error, ...rest } = props;
      return React.createElement('span', { ...rest, 'data-error': $error }, children);
    },
  };
});

import { Input } from './Input';

describe('Input', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders a basic input', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with a label', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('renders with left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders with both icons', () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">🔍</span>}
          rightIcon={<span data-testid="right-icon">✓</span>}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders with required indicator when isRequired is true', () => {
      render(<Input label="Name" isRequired />);
      expect(screen.getByText('*', { exact: false })).toBeInTheDocument();
    });
  });

  // === INPUT TYPES ===
  describe('input types', () => {
    it('defaults to text type', () => {
      render(<Input placeholder="text" />);
      const input = screen.getByPlaceholderText('text');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders as password type', () => {
      render(<Input type="password" placeholder="password" />);
      expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password');
    });

    it('renders as email type', () => {
      render(<Input type="email" placeholder="email" />);
      expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email');
    });

    it('renders as number type', () => {
      render(<Input type="number" placeholder="number" />);
      expect(screen.getByPlaceholderText('number')).toHaveAttribute('type', 'number');
    });

    it('renders as search type', () => {
      render(<Input type="search" placeholder="search" />);
      expect(screen.getByPlaceholderText('search')).toHaveAttribute('type', 'search');
    });
  });

  // === ERROR STATES ===
  describe('error states', () => {
    it('renders with error message string', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('sets aria-invalid when error is provided', () => {
      render(<Input error="Error" placeholder="input" />);
      expect(screen.getByPlaceholderText('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Input placeholder="input" />);
      expect(screen.getByPlaceholderText('input')).toHaveAttribute('aria-invalid', 'false');
    });

    it('shows error message over helper text when both provided', () => {
      render(<Input helperText="Help text" error="Error text" />);
      expect(screen.getByText('Error text')).toBeInTheDocument();
      expect(screen.queryByText('Help text')).not.toBeInTheDocument();
    });

    it('handles boolean error (true)', () => {
      render(<Input error={true} placeholder="input" />);
      expect(screen.getByPlaceholderText('input')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // === DISABLED STATE ===
  describe('disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input disabled placeholder="disabled" />);
      expect(screen.getByPlaceholderText('disabled')).toBeDisabled();
    });

    it('disables input when isFilled is true', () => {
      render(<Input isFilled placeholder="filled" />);
      expect(screen.getByPlaceholderText('filled')).toBeDisabled();
    });
  });

  // === EVENTS ===
  describe('events', () => {
    it('calls onChange handler', () => {
      const onChange = vi.fn();
      render(<Input placeholder="input" onChange={onChange} />);
      fireEvent.change(screen.getByPlaceholderText('input'), { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus handler', () => {
      const onFocus = vi.fn();
      render(<Input placeholder="input" onFocus={onFocus} />);
      fireEvent.focus(screen.getByPlaceholderText('input'));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur handler', () => {
      const onBlur = vi.fn();
      render(<Input placeholder="input" onBlur={onBlur} />);
      fireEvent.blur(screen.getByPlaceholderText('input'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  // === REF FORWARDING ===
  describe('ref forwarding', () => {
    it('forwards ref to the input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} placeholder="ref-input" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  // === ACCESSIBILITY ===
  describe('accessibility', () => {
    it('links label to input via htmlFor/id', () => {
      render(<Input label="Username" id="username" />);
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username');
    });

    it('sets aria-describedby when error message is provided', () => {
      render(<Input id="test-input" error="Error message" placeholder="input" />);
      expect(screen.getByPlaceholderText('input')).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('does not set aria-describedby when no error message', () => {
      render(<Input id="test-input" placeholder="input" />);
      expect(screen.getByPlaceholderText('input')).not.toHaveAttribute('aria-describedby');
    });

    it('generates unique id when none provided', () => {
      render(<Input label="Field" placeholder="field" />);
      const input = screen.getByPlaceholderText('field');
      expect(input).toHaveAttribute('id');
      expect(input.id).not.toBe('');
    });
  });

  // === DISPLAY NAME ===
  describe('displayName', () => {
    it('has correct display name', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  // === CLASSNAME ===
  describe('className', () => {
    it('passes className to wrapper', () => {
      const { container } = render(<Input className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
