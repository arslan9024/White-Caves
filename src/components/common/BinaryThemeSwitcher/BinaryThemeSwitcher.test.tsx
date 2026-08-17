import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../../context/ThemeContext';
import { BinaryThemeSwitcher } from './BinaryThemeSwitcher';

describe('BinaryThemeSwitcher Component', () => {
  it('renders theme switcher and toggles between Light, Dark Luxury, and System Mode', () => {
    const onToggle = vi.fn();
    render(
      <ThemeProvider>
        <BinaryThemeSwitcher onToggle={onToggle} />
      </ThemeProvider>
    );

    const lightBtn = screen.getByTestId('theme-btn-light');
    const darkBtn = screen.getByTestId('theme-btn-dark');
    const systemBtn = screen.getByTestId('theme-btn-system');

    expect(lightBtn).toBeTruthy();
    expect(darkBtn).toBeTruthy();
    expect(systemBtn).toBeTruthy();

    fireEvent.click(lightBtn);
    expect(onToggle).toHaveBeenCalledWith('light');

    fireEvent.click(darkBtn);
    expect(onToggle).toHaveBeenCalledWith('dark');

    fireEvent.click(systemBtn);
    expect(onToggle).toHaveBeenCalledWith('system');
  });
});
