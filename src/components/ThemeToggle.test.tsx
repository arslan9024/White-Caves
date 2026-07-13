/// <reference types="@testing-library/jest-dom" />
/**
 * ThemeToggle.tsx — Comprehensive Unit Tests
 * Batch 37 | Dark/light theme toggle with localStorage + system pref detection
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { safeStorage } from '../utils/safeStorage';

/* ── Mocks ──────────────────────────────────────────────── */

// Use vi.hoisted so storageData is accessible inside vi.mock factory
// (vi.mock calls are hoisted above all imports/let declarations)
const { storageData } = vi.hoisted(() => {
  const storageData: Record<string, string | null> = {};
  return { storageData };
});

vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn((key: string) => storageData[key] ?? null),
    set: vi.fn((key: string, value: string) => {
      storageData[key] = value;
      return true;
    }),
    remove: vi.fn((key: string) => {
      delete storageData[key];
      return true;
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
  ToggleTrack: ({ children }: any) => <div data-testid="toggle-track">{children}</div>,
  ToggleIcons: ({ children }: any) => <div data-testid="toggle-icons">{children}</div>,
  IconSun: ({ children }: any) => <span data-testid="icon-sun">{children}</span>,
  IconMoon: ({ children }: any) => <span data-testid="icon-moon">{children}</span>,
  ToggleThumb: (_p: any) => <div data-testid="toggle-thumb" />,
}));

// Create a controllable matchMedia mock — set it BEFORE any imports so
// ThemeProvider's useState initialiser (which calls window.matchMedia) picks it up.
const createMediaMock = (matches: boolean) => ({
  matches,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

let _mediaMatches = false;
const mockMatchMedia = vi.fn(() => createMediaMock(_mediaMatches));
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
});

import ThemeToggle from './ThemeToggle';

/* ── Helpers ─────────────────────────────────────────────── */

const renderThemeToggle = (props: React.ComponentProps<typeof ThemeToggle> = {}) =>
  render(
    <ThemeProvider>
      <ThemeToggle compact {...props} />
    </ThemeProvider>
  );

/* ── Tests ──────────────────────────────────────────────── */
describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear call records but keep implementations
    vi.clearAllMocks();

    // Re-attach implementations (clearAllMocks wipes them)
    vi.mocked(safeStorage.get).mockImplementation((key: string) => storageData[key] ?? null);
    vi.mocked(safeStorage.set).mockImplementation((key: string, value: string) => {
      storageData[key] = value;
      return true;
    });
    vi.mocked(safeStorage.remove).mockImplementation((key: string) => {
      delete storageData[key];
      return true;
    });

    // Reset storage data
    Object.keys(storageData).forEach(k => delete storageData[k]);

    // Reset media mock to light (matches: false)
    _mediaMatches = false;
    mockMatchMedia.mockImplementation(() => createMediaMock(_mediaMatches));
    window.matchMedia = mockMatchMedia as any;

    // Clean DOM
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');
    document.body.className = '';
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-mode');
    document.body.className = '';
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
      expect(storageData['themeMode']).toBe('dark');
    });

    it('saves "themeMode=light" to storage when toggled to light', () => {
      renderThemeToggle();
      fireEvent.click(screen.getByTestId('theme-btn'));
      fireEvent.click(screen.getByTestId('theme-btn'));
      expect(storageData['themeMode']).toBe('light');
    });

    it('restores dark mode from storage', () => {
      storageData['themeMode'] = 'dark';
      renderThemeToggle();
      expect(screen.getByTestId('theme-btn')).toHaveAttribute(
        'aria-label',
        'Theme: dark. Click to switch to light mode'
      );
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('restores light mode from storage', () => {
      storageData['themeMode'] = 'light';
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
      _mediaMatches = true;
      mockMatchMedia.mockImplementation(() => createMediaMock(true));
      renderThemeToggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('uses light mode when system prefers light', () => {
      _mediaMatches = false;
      mockMatchMedia.mockImplementation(() => createMediaMock(false));
      renderThemeToggle();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('saved preference overrides system preference', () => {
      _mediaMatches = true;
      mockMatchMedia.mockImplementation(() => createMediaMock(true)); // system says dark
      storageData['themeMode'] = 'light'; // user saved light
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
