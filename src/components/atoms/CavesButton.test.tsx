import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CavesButton } from './CavesButton';

describe('CavesButton Component', () => {
  it('renders button with text cleanly', () => {
    render(<CavesButton>Submit Offer</CavesButton>);
    expect(screen.getByRole('button', { name: /Submit Offer/i })).toBeInTheDocument();
  });

  it('handles onClick callback event when enabled', () => {
    const handleClick = vi.fn();
    render(<CavesButton onClick={handleClick}>Click Action</CavesButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when isLoading is true', () => {
    render(<CavesButton isLoading>Submit Offer</CavesButton>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
