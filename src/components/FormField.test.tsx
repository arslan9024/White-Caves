/**
 * FormField.tsx — Comprehensive Unit Tests
 * Batch 37 | Reusable form field: text, email, password, number, tel, url, textarea, select
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */
vi.mock('./FormField.styles', () => ({
  StyledFormField: ({ children, className }: any) => <div data-testid="form-field" className={className}>{children}</div>,
  StyledLabel: ({ children, htmlFor }: any) => <label data-testid="label" htmlFor={htmlFor}>{children}</label>,
  StyledRequired: ({ children }: any) => <span data-testid="required-star">{children}</span>,
  StyledInput: (props: any) => <input data-testid="input" {...props} />,
  StyledTextArea: (props: any) => <textarea data-testid="textarea" {...props} />,
  StyledSelect: ({ children, ...props }: any) => <select data-testid="select" {...props}>{children}</select>,
  StyledErrorField: ({ children, className }: any) => <div data-testid="error-field" className={className}>{children}</div>,
  StyledErrorMessage: ({ children }: any) => <span data-testid="error-message">{children}</span>,
}));

import FormField from './FormField';

/* ── Tests ──────────────────────────────────────────────── */
describe('FormField', () => {
  beforeEach(() => vi.clearAllMocks());

  // ─────────────── Default Text Input ───────────────
  describe('default text input', () => {
    it('renders input element', () => {
      render(<FormField name="username" />);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('sets type to text by default', () => {
      render(<FormField name="username" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('sets name and id attributes', () => {
      render(<FormField name="username" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('sets value', () => {
      render(<FormField name="name" value="John" onChange={vi.fn()} />);
      expect(screen.getByTestId('input')).toHaveValue('John');
    });

    it('sets placeholder', () => {
      render(<FormField name="email" placeholder="Enter email" />);
      expect(screen.getByTestId('input')).toHaveAttribute('placeholder', 'Enter email');
    });
  });

  // ─────────────── Input Types ───────────────
  describe('input types', () => {
    it('renders email type', () => {
      render(<FormField name="email" type="email" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });

    it('renders password type', () => {
      render(<FormField name="password" type="password" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    it('renders number type', () => {
      render(<FormField name="age" type="number" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
    });

    it('renders tel type', () => {
      render(<FormField name="phone" type="tel" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'tel');
    });

    it('renders url type', () => {
      render(<FormField name="website" type="url" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'url');
    });
  });

  // ─────────────── Textarea ───────────────
  describe('textarea', () => {
    it('renders textarea for type="textarea"', () => {
      render(<FormField name="bio" type="textarea" />);
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });

    it('sets value on textarea', () => {
      render(<FormField name="bio" type="textarea" value="Hello" onChange={vi.fn()} />);
      expect(screen.getByTestId('textarea')).toHaveValue('Hello');
    });

    it('sets placeholder on textarea', () => {
      render(<FormField name="bio" type="textarea" placeholder="Write here" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('placeholder', 'Write here');
    });
  });

  // ─────────────── Select ───────────────
  describe('select', () => {
    it('renders select for type="select"', () => {
      render(
        <FormField name="country" type="select">
          <option value="ae">UAE</option>
          <option value="us">US</option>
        </FormField>,
      );
      expect(screen.getByTestId('select')).toBeInTheDocument();
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });

    it('renders children options', () => {
      render(
        <FormField name="country" type="select">
          <option value="ae">UAE</option>
          <option value="us">US</option>
        </FormField>,
      );
      expect(screen.getByText('UAE')).toBeInTheDocument();
      expect(screen.getByText('US')).toBeInTheDocument();
    });

    it('sets value on select', () => {
      render(
        <FormField name="country" type="select" value="us" onChange={vi.fn()}>
          <option value="ae">UAE</option>
          <option value="us">US</option>
        </FormField>,
      );
      expect(screen.getByTestId('select')).toHaveValue('us');
    });
  });

  // ─────────────── Label ───────────────
  describe('label', () => {
    it('renders label when provided', () => {
      render(<FormField name="name" label="Full Name" />);
      expect(screen.getByTestId('label')).toHaveTextContent('Full Name');
    });

    it('links label to input via htmlFor', () => {
      render(<FormField name="email" label="Email" />);
      expect(screen.getByTestId('label')).toHaveAttribute('for', 'email');
    });

    it('shows required asterisk when required', () => {
      render(<FormField name="name" label="Name" required />);
      expect(screen.getByTestId('required-star')).toHaveTextContent('*');
    });

    it('hides asterisk when not required', () => {
      render(<FormField name="name" label="Name" />);
      expect(screen.queryByTestId('required-star')).not.toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<FormField name="name" />);
      expect(screen.queryByTestId('label')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Error State ───────────────
  describe('error state', () => {
    it('shows error message when touched + error', () => {
      render(<FormField name="email" error="Required" touched />);
      expect(screen.getByTestId('error-message')).toHaveTextContent('Required');
    });

    it('wraps in StyledErrorField when error', () => {
      render(<FormField name="email" error="Required" touched />);
      expect(screen.getByTestId('error-field')).toBeInTheDocument();
      expect(screen.queryByTestId('form-field')).not.toBeInTheDocument();
    });

    it('wraps in StyledFormField when no error', () => {
      render(<FormField name="email" />);
      expect(screen.getByTestId('form-field')).toBeInTheDocument();
      expect(screen.queryByTestId('error-field')).not.toBeInTheDocument();
    });

    it('does NOT show error when not touched', () => {
      render(<FormField name="email" error="Required" touched={false} />);
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('does NOT show error when error is empty', () => {
      render(<FormField name="email" error="" touched />);
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Event Handlers ───────────────
  describe('event handlers', () => {
    it('calls onChange on input', () => {
      const onChange = vi.fn();
      render(<FormField name="name" onChange={onChange} />);
      fireEvent.change(screen.getByTestId('input'), { target: { value: 'Hello' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onBlur on input', () => {
      const onBlur = vi.fn();
      render(<FormField name="name" onBlur={onBlur} />);
      fireEvent.blur(screen.getByTestId('input'));
      expect(onBlur).toHaveBeenCalled();
    });

    it('calls onChange on textarea', () => {
      const onChange = vi.fn();
      render(<FormField name="bio" type="textarea" onChange={onChange} />);
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Hi' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange on select', () => {
      const onChange = vi.fn();
      render(
        <FormField name="type" type="select" onChange={onChange}>
          <option value="a">A</option>
          <option value="b">B</option>
        </FormField>,
      );
      fireEvent.change(screen.getByTestId('select'), { target: { value: 'b' } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  // ─────────────── Disabled State ───────────────
  describe('disabled', () => {
    it('disables input', () => {
      render(<FormField name="name" disabled />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('disables textarea', () => {
      render(<FormField name="bio" type="textarea" disabled />);
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('disables select', () => {
      render(
        <FormField name="x" type="select" disabled>
          <option>A</option>
        </FormField>,
      );
      expect(screen.getByTestId('select')).toBeDisabled();
    });

    it('not disabled by default', () => {
      render(<FormField name="name" />);
      expect(screen.getByTestId('input')).not.toBeDisabled();
    });
  });

  // ─────────────── className ───────────────
  describe('className', () => {
    it('applies custom className', () => {
      render(<FormField name="name" className="custom-cls" />);
      expect(screen.getByTestId('form-field')).toHaveClass('custom-cls');
    });
  });
});
