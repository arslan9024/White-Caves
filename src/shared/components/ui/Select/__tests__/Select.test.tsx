/**
 * @file Select.test.tsx
 * @description Comprehensive tests for shared Select form component
 * Tests: rendering, options, label, error/helper, required, disabled, sizes, ref forwarding, a11y
 */

import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import Select from '../Select';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const sampleOptions: SelectOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders a select element', () => {
      render(<Select options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders placeholder as first option', () => {
      render(<Select options={sampleOptions} />);
      const opts = screen.getAllByRole('option');
      expect(opts[0]).toHaveTextContent('Select an option');
      expect(opts[0]).toBeDisabled();
    });

    it('renders custom placeholder', () => {
      render(<Select options={sampleOptions} placeholder="Choose..." />);
      expect(screen.getByText('Choose...')).toBeInTheDocument();
    });

    it('renders all options', () => {
      render(<Select options={sampleOptions} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('renders with empty options array', () => {
      render(<Select options={[]} />);
      const opts = screen.getAllByRole('option');
      // Only placeholder
      expect(opts).toHaveLength(1);
    });

    it('renders without options prop', () => {
      render(<Select />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  // ── Label ──────────────────────────────────────────────
  describe('Label', () => {
    it('renders label when provided', () => {
      render(<Select label="Country" options={sampleOptions} />);
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<Select options={sampleOptions} />);
      expect(screen.queryByText('Country')).not.toBeInTheDocument();
    });

    it('label is associated with select via htmlFor', () => {
      render(<Select label="Country" options={sampleOptions} />);
      const label = screen.getByText('Country');
      const select = screen.getByRole('combobox');
      expect(label).toHaveAttribute('for', select.id);
    });
  });

  // ── Required ───────────────────────────────────────────
  describe('Required', () => {
    it('shows required indicator when required', () => {
      render(<Select label="Name" required options={sampleOptions} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not show required indicator when not required', () => {
      render(<Select label="Name" options={sampleOptions} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('sets required attribute on select', () => {
      render(<Select required options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toBeRequired();
    });
  });

  // ── Disabled ───────────────────────────────────────────
  describe('Disabled', () => {
    it('disables select when disabled prop is true', () => {
      render(<Select disabled options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('disables individual options', () => {
      render(<Select options={sampleOptions} />);
      const opt3 = screen.getByText('Option 3');
      expect(opt3).toBeDisabled();
    });
  });

  // ── Error & Helper Text ────────────────────────────────
  describe('Error & Helper Text', () => {
    it('displays error message', () => {
      render(<Select error="Required field" options={sampleOptions} />);
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('sets aria-invalid to true when error exists', () => {
      render(<Select error="Bad" options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Select options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('displays helper text', () => {
      render(<Select helperText="Pick one" options={sampleOptions} />);
      expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('error takes priority over helper text', () => {
      render(<Select error="Error!" helperText="Help" options={sampleOptions} />);
      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(screen.queryByText('Help')).not.toBeInTheDocument();
    });
  });

  // ── Change Handler ─────────────────────────────────────
  describe('Change Handler', () => {
    it('calls onChange when selection changes', () => {
      const onChange = vi.fn();
      render(<Select options={sampleOptions} onChange={onChange} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'opt2' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when focus leaves', () => {
      const onBlur = vi.fn();
      render(<Select options={sampleOptions} onBlur={onBlur} />);
      fireEvent.blur(screen.getByRole('combobox'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  // ── Controlled Value ───────────────────────────────────
  describe('Controlled Value', () => {
    it('displays the controlled value', () => {
      render(<Select options={sampleOptions} value="opt2" onChange={vi.fn()} />);
      expect(screen.getByRole('combobox')).toHaveValue('opt2');
    });
  });

  // ── Sizes ──────────────────────────────────────────────
  describe('Sizes', () => {
    it('defaults to medium size', () => {
      render(<Select options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toHaveClass('wc-select--medium');
    });

    it('applies small size class', () => {
      render(<Select options={sampleOptions} size="small" />);
      expect(screen.getByRole('combobox')).toHaveClass('wc-select--small');
    });

    it('applies large size class', () => {
      render(<Select options={sampleOptions} size="large" />);
      expect(screen.getByRole('combobox')).toHaveClass('wc-select--large');
    });
  });

  // ── Full Width ─────────────────────────────────────────
  describe('Full Width', () => {
    it('applies full-width class when fullWidth is true', () => {
      const { container } = render(<Select options={sampleOptions} fullWidth />);
      expect(container.querySelector('.wc-select-wrapper--full-width')).toBeTruthy();
    });
  });

  // ── Ref Forwarding ─────────────────────────────────────
  describe('Ref Forwarding', () => {
    it('forwards ref to the select element', () => {
      const ref = createRef<HTMLSelectElement>();
      render(<Select ref={ref} options={sampleOptions} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  // ── Custom ID / Name ──────────────────────────────────
  describe('Custom ID & Name', () => {
    it('uses custom id when provided', () => {
      render(<Select id="my-select" options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-select');
    });

    it('uses name as id fallback', () => {
      render(<Select name="country" options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'country');
    });

    it('sets name attribute', () => {
      render(<Select name="country" options={sampleOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('name', 'country');
    });
  });

  // ── Custom ClassName ───────────────────────────────────
  describe('Custom ClassName', () => {
    it('passes className to wrapper', () => {
      const { container } = render(<Select className="custom" options={sampleOptions} />);
      expect(container.querySelector('.custom')).toBeTruthy();
    });
  });
});
