import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SmartLockPinGenerator } from './SmartLockPinGenerator';

describe('SmartLockPinGenerator Component', () => {
  it('renders smart lock PIN generator and generates new PIN', () => {
    render(<SmartLockPinGenerator />);
    expect(screen.getByTestId('smart-lock-pin-generator')).toBeDefined();
    expect(screen.getByText(/IoT Smart Lock PIN Generator/i)).toBeDefined();
    expect(screen.getByText(/IoT Lock Online/i)).toBeDefined();
    expect(screen.getByText(/Temporary 1-Hour Access PIN/i)).toBeDefined();

    const genBtn = screen.getByRole('button', { name: /Generate New Temporary PIN/i });
    fireEvent.click(genBtn);
    expect(screen.getByText(/Temporary 1-Hour Access PIN/i)).toBeDefined();
  });
});
