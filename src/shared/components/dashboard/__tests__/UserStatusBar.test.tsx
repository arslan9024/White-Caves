/**
 * @file UserStatusBar.test.tsx
 * @description Comprehensive tests for UserStatusBar shared dashboard component
 * Tests: greeting logic, time/date display, online/offline, compact mode, props toggles
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock CSS
vi.mock('./UserStatusBar.css', () => ({}));

import UserStatusBar from '../UserStatusBar';

// Create a minimal Redux store for tests
function createStore(overrides: { isOnline?: boolean; user?: any } = {}) {
  return configureStore({
    reducer: {
      navigation: (state = { isOnline: overrides.isOnline ?? true }) => state,
      auth: (state = { user: overrides.user ?? { displayName: 'John Doe', name: 'John' } }) => state,
    },
  });
}

function renderWithStore(ui: React.ReactElement, storeOverrides = {}) {
  const store = createStore(storeOverrides);
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('UserStatusBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Basic Rendering ────────────────────────────────────
  describe('Rendering', () => {
    it('renders the status bar', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      expect(container.querySelector('.wc-status-bar')).toBeTruthy();
    });

    it('renders greeting by default', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      expect(container.querySelector('.wc-status-bar__greeting')).toBeTruthy();
    });

    it('renders time by default', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      expect(container.querySelector('.wc-status-bar__time')).toBeTruthy();
    });

    it('renders date by default', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      expect(container.querySelector('.wc-status-bar__date')).toBeTruthy();
    });

    it('renders online status by default', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      expect(container.querySelector('.wc-status-bar__online')).toBeTruthy();
    });

    it('has displayName "UserStatusBar"', () => {
      expect(UserStatusBar.displayName).toBe('UserStatusBar');
    });
  });

  // ── User Name ──────────────────────────────────────────
  describe('User Name', () => {
    it('displays userName prop when provided', () => {
      renderWithStore(<UserStatusBar userName="Alice" />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('falls back to Redux user displayName', () => {
      renderWithStore(<UserStatusBar />, { user: { displayName: 'Jane Smith' } });
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('falls back to Redux user name field', () => {
      renderWithStore(<UserStatusBar />, { user: { name: 'Bob' } });
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('falls back to "User" when no name available', () => {
      renderWithStore(<UserStatusBar />, { user: {} });
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('prefers userName prop over Redux', () => {
      renderWithStore(<UserStatusBar userName="Override" />, { user: { displayName: 'Redux Name' } });
      expect(screen.getByText('Override')).toBeInTheDocument();
    });
  });

  // ── Greeting Logic ─────────────────────────────────────
  describe('Greeting', () => {
    it('shows a greeting text with comma', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      const greetingText = container.querySelector('.wc-status-bar__greeting-text');
      expect(greetingText?.textContent).toMatch(/Good (Morning|Afternoon|Evening),/);
    });

    it('hides greeting when showGreeting is false', () => {
      const { container } = renderWithStore(<UserStatusBar showGreeting={false} />);
      expect(container.querySelector('.wc-status-bar__greeting')).toBeFalsy();
    });
  });

  // ── Online/Offline Status ──────────────────────────────
  describe('Online Status', () => {
    it('shows Online when isOnline is true', () => {
      renderWithStore(<UserStatusBar />, { isOnline: true });
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('shows Offline when isOnline is false', () => {
      renderWithStore(<UserStatusBar />, { isOnline: false });
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('shows online dot class when online', () => {
      const { container } = renderWithStore(<UserStatusBar />, { isOnline: true });
      expect(container.querySelector('.wc-status-bar__dot--online')).toBeTruthy();
    });

    it('shows offline dot class when offline', () => {
      const { container } = renderWithStore(<UserStatusBar />, { isOnline: false });
      expect(container.querySelector('.wc-status-bar__dot--offline')).toBeTruthy();
    });

    it('hides online status when showOnlineStatus is false', () => {
      const { container } = renderWithStore(<UserStatusBar showOnlineStatus={false} />);
      expect(container.querySelector('.wc-status-bar__online')).toBeFalsy();
    });
  });

  // ── Time and Date ──────────────────────────────────────
  describe('Time and Date', () => {
    it('hides time when showTime is false', () => {
      const { container } = renderWithStore(<UserStatusBar showTime={false} />);
      expect(container.querySelector('.wc-status-bar__time')).toBeFalsy();
    });

    it('hides date when showDate is false', () => {
      const { container } = renderWithStore(<UserStatusBar showDate={false} />);
      expect(container.querySelector('.wc-status-bar__date')).toBeFalsy();
    });

    it('hides datetime section when both are false', () => {
      const { container } = renderWithStore(<UserStatusBar showTime={false} showDate={false} />);
      expect(container.querySelector('.wc-status-bar__datetime')).toBeFalsy();
    });
  });

  // ── Compact Mode ───────────────────────────────────────
  describe('Compact Mode', () => {
    it('applies compact class when compact is true', () => {
      const { container } = renderWithStore(<UserStatusBar compact />);
      expect(container.querySelector('.wc-status-bar--compact')).toBeTruthy();
    });

    it('does not apply compact class by default', () => {
      const { container } = renderWithStore(<UserStatusBar />);
      expect(container.querySelector('.wc-status-bar--compact')).toBeFalsy();
    });
  });

  // ── Custom ClassName ───────────────────────────────────
  describe('Custom ClassName', () => {
    it('appends custom className', () => {
      const { container } = renderWithStore(<UserStatusBar className="custom-bar" />);
      expect(container.querySelector('.custom-bar')).toBeTruthy();
    });
  });

  // ── Timer ──────────────────────────────────────────────
  describe('Timer', () => {
    it('sets up 30-second interval for clock updates', () => {
      const setIntervalSpy = vi.spyOn(global, 'setInterval');
      renderWithStore(<UserStatusBar />);
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
      setIntervalSpy.mockRestore();
    });

    it('clears interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = renderWithStore(<UserStatusBar />);
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
