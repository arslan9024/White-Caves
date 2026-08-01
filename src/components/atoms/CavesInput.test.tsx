import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CavesInput } from './CavesInput';

describe('CavesInput Component', () => {
  it('renders input field with label', () => {
    render(<CavesInput label="Investor Email" placeholder="Enter email..." />);
    expect(screen.getByLabelText('Investor Email')).toBeInTheDocument();
  });

  it('handles onChange input typing', () => {
    const handleChange = vi.fn();
    render(<CavesInput label="Investor Email" onChange={handleChange} />);
    const input = screen.getByLabelText('Investor Email');
    fireEvent.change(input, { target: { value: 'investor@dubai.ae' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders error message when error prop is provided', () => {
    render(<CavesInput label="Investor Email" error="Invalid UAE email address" />);
    expect(screen.getByText('Invalid UAE email address')).toBeInTheDocument();
  });
});
