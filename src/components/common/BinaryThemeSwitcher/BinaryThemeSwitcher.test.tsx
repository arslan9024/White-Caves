import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BinaryThemeSwitcher } from './BinaryThemeSwitcher';

describe('BinaryThemeSwitcher Component', () => {
  it('renders theme switcher and toggles between Dark Luxury and Light Mode', () => {
    const onToggle = vi.fn();
    render(<BinaryThemeSwitcher onToggle={onToggle} />);
    expect(screen.getByTestId('binary-theme-switcher')).toBeDefined();
    expect(screen.getByText(/Dark Luxury/i)).toBeDefined();

    const btn = screen.getByRole('button', { name: /Toggle Theme/i });
    fireEvent.click(btn);
    expect(screen.getByText(/Light Mode/i)).toBeDefined();
    expect(onToggle).toHaveBeenCalledWith('light');
  });
});
