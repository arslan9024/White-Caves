/**
 * FormField — Unit tests
 *
 * Follows White Caves pattern: mock styled exports with plain HTML + data-testid.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ── Mock styled components as plain HTML with data-testid ────────────
vi.mock('./FormField', async () => {
  // Import the real module so we get the actual component logic
  const actual = await vi.importActual<typeof import('./FormField')>('./FormField');
  return actual;
});

// We need to mock styled-components to avoid ThemeProvider requirement
vi.mock('styled-components', async () => {
  const actual = await vi.importActual<typeof import('styled-components')>('styled-components');
  // Override styled to return plain elements with a default theme
  const createMockStyled = (tag: string) => {
    const component = React.forwardRef<HTMLElement, Record<string, unknown>>(
      ({ children, ...props }: Record<string, unknown>, ref) => {
        // Filter out transient props ($prefix) and styled-components internals
        const filteredProps: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(props)) {
          if (!key.startsWith('$') && key !== 'as' && key !== 'forwardedAs') {
            filteredProps[key] = value;
          }
        }
        return React.createElement(tag, { ...filteredProps, ref }, children as React.ReactNode);
      },
    );
    component.displayName = `styled.${tag}`;
    // Support .attrs() chain
    (component as any).attrs = () => component;
    return component;
  };

  const styled = new Proxy(
    ((tag: string) => () => createMockStyled(tag)) as unknown as Record<string, unknown>,
    {
      get(target, prop: string) {
        if (prop === '__esModule') return true;
        if (prop === 'default') return target;
        // styled.div``, styled.input``, etc.
        return () => createMockStyled(prop);
      },
    },
  );

  return {
    ...actual,
    default: styled,
    styled,
    css: (...args: unknown[]) => args,
    keyframes: () => 'mock-animation',
    ThemeProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Eye: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'eye-icon', ...props }),
  EyeOff: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'eyeoff-icon', ...props }),
  AlertCircle: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'alert-icon', ...props }),
  CheckCircle: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'check-icon', ...props }),
}));

import FormField from './FormField';

// ═══════════════════════════════════════════════════════════════════════
describe('FormField', () => {
  const defaultProps = {
    name: 'email',
    label: 'Email',
    value: '',
    onChange: vi.fn(),
    onBlur: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────
  it('renders with label', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders required indicator when required', () => {
    render(<FormField {...defaultProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders input with correct name', () => {
    render(<FormField {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'email');
  });

  it('renders placeholder', () => {
    render(<FormField {...defaultProps} placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders disabled input', () => {
    render(<FormField {...defaultProps} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  // ── Error display ──────────────────────────────────────────────────
  it('shows error when touched and error exists', () => {
    render(<FormField {...defaultProps} touched error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('does not show error when not touched', () => {
    render(<FormField {...defaultProps} error="Email is required" />);
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  it('sets aria-invalid when error shown', () => {
    render(<FormField {...defaultProps} touched error="Invalid" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid');
  });

  // ── Hint text ──────────────────────────────────────────────────────
  it('shows hint text when no error', () => {
    render(<FormField {...defaultProps} hint="We will never share your email" />);
    expect(screen.getByText('We will never share your email')).toBeInTheDocument();
  });

  // ── Handlers ───────────────────────────────────────────────────────
  it('calls onChange when typing', () => {
    render(<FormField {...defaultProps} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test', name: 'email', type: 'text' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('calls onBlur when field loses focus', () => {
    render(<FormField {...defaultProps} />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  // ── Textarea ───────────────────────────────────────────────────────
  it('renders textarea for type=textarea', () => {
    render(<FormField {...defaultProps} type="textarea" />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  // ── Select ─────────────────────────────────────────────────────────
  it('renders select with options', () => {
    const options = [
      { value: 'buy', label: 'Buy' },
      { value: 'rent', label: 'Rent' },
    ];
    render(
      <FormField
        {...defaultProps}
        type="select"
        options={options}
        placeholder="Choose..."
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
  });

  // ── Password toggle ────────────────────────────────────────────────
  it('renders password toggle button for type=password', () => {
    render(<FormField {...defaultProps} type="password" value="secret" />);
    const toggleBtn = screen.getByRole('button', { name: /show password|hide password/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('toggles password visibility on click', () => {
    render(<FormField {...defaultProps} type="password" value="secret" />);
    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(input).toHaveAttribute('type', 'password');
  });

  // ── Password strength meter ────────────────────────────────────────
  it('renders strength meter when password strength provided', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        value="StrongP@ss1"
        passwordStrength={{ strength: 'strong', score: 4, feedback: [] }}
      />,
    );
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('hides strength meter when password is empty', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        value=""
        passwordStrength={{ strength: 'weak', score: 0, feedback: ['Too short'] }}
      />,
    );
    expect(screen.queryByText('Weak')).not.toBeInTheDocument();
  });

  // ── Character counter ──────────────────────────────────────────────
  it('shows character count when maxLength is set', () => {
    render(<FormField {...defaultProps} value="Hello" maxLength={100} />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  // ── aria-required ──────────────────────────────────────────────────
  it('sets aria-required for required fields', () => {
    render(<FormField {...defaultProps} required />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required');
  });
});
