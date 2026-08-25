import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BinaryThemeToggle } from './BinaryThemeToggle';

describe('BinaryThemeToggle', () => {
  it('renders theme toggle and flips state on click', () => {
    render(<BinaryThemeToggle />);

    const toggle = screen.getByTestId('binary-theme-toggle');
    expect(toggle).toBeDefined();
    expect(screen.getByText(/Slate Dark/i)).toBeDefined();

    fireEvent.click(toggle);
    expect(screen.getByText(/Crisp Light/i)).toBeDefined();
  });
});
