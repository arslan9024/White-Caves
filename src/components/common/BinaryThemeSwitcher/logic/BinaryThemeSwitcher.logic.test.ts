import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useBinaryThemeSwitcherLogic } from './BinaryThemeSwitcher.logic';
import { ThemeProvider } from '../../../../context/ThemeContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  React.createElement(ThemeProvider, null, children)
);

describe('BinaryThemeSwitcher.logic', () => {
  it('initializes with default options and handles theme selection', () => {
    const onToggle = vi.fn();
    const { result } = renderHook(() => useBinaryThemeSwitcherLogic({ onToggle }), { wrapper });

    expect(result.current.options).toHaveLength(3);
    expect(result.current.themeMode).toBeDefined();

    act(() => {
      result.current.handleSelect('dark');
    });

    expect(result.current.themeMode).toBe('dark');
    expect(onToggle).toHaveBeenCalledWith('dark');
  });

  it('updates theme mode to light and invokes onToggle callback', () => {
    const onToggle = vi.fn();
    const { result } = renderHook(() => useBinaryThemeSwitcherLogic({ onToggle }), { wrapper });

    act(() => {
      result.current.handleSelect('light');
    });

    expect(result.current.themeMode).toBe('light');
    expect(onToggle).toHaveBeenCalledWith('light');
  });
});
