import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingLabelInput } from './FloatingLabelInput';

describe('FloatingLabelInput Component', () => {
  it('renders floating label input and floats label on focus and text entry', () => {
    const onChange = vi.fn();
    render(<FloatingLabelInput label="Investor Passport Number" onChange={onChange} />);
    expect(screen.getByTestId('floating-label-input')).toBeDefined();
    expect(screen.getByText('Investor Passport Number')).toBeDefined();

    const input = screen.getByTestId('floating-label-input').querySelector('input') as HTMLInputElement;
    expect(input).toBeDefined();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'N8492019' } });
    expect(onChange).toHaveBeenCalled();
    expect(input.value).toBe('N8492019');
  });
});
