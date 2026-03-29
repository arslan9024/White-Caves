/**
 * ThemeContext — Tests
 * Tests ThemeProvider initialization, toggle, persistence, and useTheme hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// ── Mock safeStorage ─────────────────────────────────────────────────
const mockStorage: Record<string, string> = {};
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn((key: string) => mockStorage[key] ?? null),
    set: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
    remove: vi.fn((key: string) => { delete mockStorage[key]; }),
  },
}));

// ── Helper component that exposes context ────────────────────────────
function ThemeConsumer() {
  const { isDark, setIsDark } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDark ? 'dark' : 'light'}</span>
      <button onClick={() => setIsDark(true)}>Dark</button>
      <button onClick={() => setIsDark(false)}>Light</button>
      <button onClick={() => setIsDark((prev) => !prev)}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear storage mock
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    // Reset body class
    document.body.className = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ─── Initial State ──────────────────────────────────────────────
  describe('Initial State', () => {
    it('defaults to light mode when no stored theme', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId('mode').textContent).toBe('light');
    });

    it('initializes to dark mode when stored theme is "dark"', () => {
      mockStorage['theme'] = 'dark';
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId('mode').textContent).toBe('dark');
    });

    it('initializes to light mode when stored theme is "light"', () => {
      mockStorage['theme'] = 'light';
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId('mode').textContent).toBe('light');
    });
  });

  // ─── Toggling ──────────────────────────────────────────────────
  describe('Theme Toggling', () => {
    it('switches to dark mode', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Dark')); });
      expect(screen.getByTestId('mode').textContent).toBe('dark');
    });

    it('switches to light mode from dark', () => {
      mockStorage['theme'] = 'dark';
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Light')); });
      expect(screen.getByTestId('mode').textContent).toBe('light');
    });

    it('toggle flips the state', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId('mode').textContent).toBe('light');
      act(() => { fireEvent.click(screen.getByText('Toggle')); });
      expect(screen.getByTestId('mode').textContent).toBe('dark');
      act(() => { fireEvent.click(screen.getByText('Toggle')); });
      expect(screen.getByTestId('mode').textContent).toBe('light');
    });
  });

  // ─── Body Class ────────────────────────────────────────────────
  describe('Body Class Management', () => {
    it('adds dark-mode class when dark', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Dark')); });
      expect(document.body.className).toContain('dark-mode');
    });

    it('adds theme-transition class during transition', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Dark')); });
      expect(document.body.className).toContain('theme-transition');
    });

    it('removes theme-transition after 400ms', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Dark')); });
      act(() => { vi.advanceTimersByTime(400); });
      expect(document.body.classList.contains('theme-transition')).toBe(false);
    });

    it('light mode has no dark-mode class', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      expect(document.body.className).not.toContain('dark-mode');
    });
  });

  // ─── Persistence ───────────────────────────────────────────────
  describe('Persistence', () => {
    it('stores "dark" when switched to dark mode', async () => {
      const { safeStorage } = await import('../utils/safeStorage');
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Dark')); });
      expect(safeStorage.set).toHaveBeenCalledWith('theme', 'dark');
    });

    it('stores "light" when switched to light mode', async () => {
      mockStorage['theme'] = 'dark';
      const { safeStorage } = await import('../utils/safeStorage');
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
      act(() => { fireEvent.click(screen.getByText('Light')); });
      expect(safeStorage.set).toHaveBeenCalledWith('theme', 'light');
    });
  });

  // ─── useTheme outside provider ─────────────────────────────────
  describe('useTheme outside provider', () => {
    it('throws Error when used outside ThemeProvider', () => {
      // Suppress React error boundary console output
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
      spy.mockRestore();
    });
  });
});
