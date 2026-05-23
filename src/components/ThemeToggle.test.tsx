/**
 * ThemeToggle.tsx — Comprehensive Unit Tests
 * Batch 37 | Dark/light theme toggle with localStorage + system pref detection
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';

/* ── Mocks ──────────────────────────────────────────────── */

// Mock safeStorage
let mockStorageData: Record<string, string | null> = {};
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn((key: string) => mockStorageData[key] ?? null),
    set: vi.fn((key: string, value: string) => {
      mockStorageData[key] = value;
    }),
    remove: vi.fn((key: string) => {
      delete mockStorageData[key];
    }),
  },
}));

// Mock styles
vi.mock('./ThemeToggle.styles', () => ({
  ThemeToggleButton: ({ children, onClick, className, ...p }: any) => (
    <button
      data-testid="theme-btn"
      onClick={onClick}
      className={className}
      aria-label={p['aria-label']}
    >
      {children}
    </button>
  ),
  ToggleTrack: ({ children, ...p }: any) => <div data-testid="toggle-track">{children}</div>,
  ToggleIcons: ({ children }: any) => <div data-testid="toggle-icons">{children}</div>,
  IconSun: ({ children }: any) => <span data-testid="icon-sun">{children}</span>,
  IconMoon: ({ children }: any) => <span data-testid="icon-moon">{children}</span>,
  ToggleThumb: (p: any) => <div data-testid="toggle-thumb" />,
}));

// Mock matchMedia
const mockMatchMedia = vi.fn().mockReturnValue({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

import ThemeToggle from './ThemeToggle';

const renderThemeToggle = (props: React.ComponentProps<typeof ThemeToggle> = {}) =>
  render(
    <ThemeProvider>
      <ThemeToggle compact {...props} />
    </ThemeProvider>
  );

/* ── Tests ──────────────────────────────────────────────── */
describe('ThemeToggle', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorageData = {};
    originalMatchMedia = window.matchMedia;
    window.matchMedia = mockMatchMedia as any;
    // Clean DOM
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark-mode');
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark-mode');
  });

  // ─────────────── Default Rendering ───────────────
  describe('default rendering (light)', () => {
    it('renders toggle button', () => {
      renderThemeToggle();
      expect(screen.getByTestId('theme-btn')).toBeInTheDocument();
    });

    it('shows compact mode cycle label by default', () => {
      renderThemeToggle();
      expect(screen.getByTestId('theme-btn')).toHaveAttribute(
        'aria-label',
        'Theme: system. Click to switch to dark mode'
      );
    });

    it('renders sun and moon icons', () => {
      renderThemeToggle();
      expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
      expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    });

    it('renders toggle track and thumb', () => {
      renderThemeToggle();
      expect(screen.getByTestId('toggle-track')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-thumb')).toBeInTheDocument();
    });
  });

  // ─────────────── Toggle Behavior ───────────────
  describe('toggle behavior', () => {
    it('switches to dark mode on click', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(screen.getByTestId('theme-btn')).toHaveAttribute(
        'aria-label',
        'Theme: dark. Click to switch to light mode'
      );
    });

    it('sets data-theme=dark on html element', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('adds dark-mode class to body', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    it('toggles back to light mode on second click', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(screen.getByTestId('theme-btn')).toHaveAttribute(
        'aria-label',
        'Theme: light. Click to switch to system mode'
      );
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.body.classList.contains('dark-mode')).toBe(false);
    });
  });

  // ─────────────── localStorage Persistence ───────────────
  describe('localStorage persistence', () => {
    it('saves "themeMode=dark" to storage when toggled to dark', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(mockStorageData['themeMode']).toBe('dark');
    });

    it('saves "themeMode=light" to storage when toggled to light', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(mockStorageData['themeMode']).toBe('light');
    });

    it('restores dark mode from storage', () => {
      mockStorageData['themeMode'] = 'dark';
      renderThemeToggle();
      expect(screen.getByTestId('theme-btn')).toHaveAttribute(
        'aria-label',
        'Theme: dark. Click to switch to light mode'
      );
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('restores light mode from storage', () => {
      mockStorageData['themeMode'] = 'light';
      renderThemeToggle();
      expect(screen.getByTestId('theme-btn')).toHaveAttribute(
        'aria-label',
        'Theme: light. Click to switch to system mode'
      );
    });
  });

  // ─────────────── System Preference ───────────────
  describe('system preference detection', () => {
    it('uses dark mode when system prefers dark', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      renderThemeToggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('uses light mode when system prefers light', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      renderThemeToggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('saved preference overrides system preference', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }); // system says dark
      mockStorageData['themeMode'] = 'light'; // user saved light
      renderThemeToggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  // ─────────────── className ───────────────
  describe('className', () => {
    it('passes custom className', () => {
      renderThemeToggle({ className: 'my-toggle' });
      expect(screen.getByTestId('theme-btn')).toHaveClass('my-toggle');
    });

    it('works with default empty className', () => {
      renderThemeToggle();
      expect(screen.getByTestId('theme-btn')).toBeInTheDocument();
    });
  });
});
