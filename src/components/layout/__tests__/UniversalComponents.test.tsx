/**
 * @file UniversalComponents.test.tsx
 * @description Comprehensive tests for UniversalComponents — root layout component
 * Tests: online/offline events, Redux dispatch, auto-hide visibility, hover pin/unpin
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock child components and styles
vi.mock('../../../components/ClickToChat', () => ({
  default: () => <div data-testid="click-to-chat">ClickToChat</div>,
}));

vi.mock('../UniversalComponents/styles', () => ({
  TimeDisplayContainer: ({ children, $isVisible, ...props }: any) => (
    <div data-testid="time-container" data-visible={String($isVisible)} {...props}>{children}</div>
  ),
  ConnectionStatus: ({ children, $isOnline, ...props }: any) => (
    <span data-testid="connection-status" data-online={String($isOnline)} {...props}>{children}</span>
  ),
}));

// Mock navigationSlice action
vi.mock('../../../store/navigationSlice', () => ({
  setOnlineStatus: (status: boolean) => ({
    type: 'navigation/setOnlineStatus',
    payload: status,
  }),
}));

import UniversalComponents from '../UniversalComponents';

function createStore(isOnline = true) {
  return configureStore({
    reducer: {
      navigation: (state = { isOnline }, action: any) => {
        if (action.type === 'navigation/setOnlineStatus') {
          return { ...state, isOnline: action.payload };
        }
        return state;
      },
    },
  });
}

function renderWithStore(isOnline = true) {
  const store = createStore(isOnline);
  const dispatchSpy = vi.spyOn(store, 'dispatch');
  const utils = render(
    <Provider store={store}>
      <UniversalComponents />
    </Provider>
  );
  return { ...utils, store, dispatchSpy };
}

describe('UniversalComponents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders ClickToChat component', () => {
      renderWithStore();
      expect(screen.getByTestId('click-to-chat')).toBeInTheDocument();
    });

    it('renders connection status container', () => {
      renderWithStore();
      expect(screen.getByTestId('time-container')).toBeInTheDocument();
    });

    it('displays Connected when online', () => {
      renderWithStore(true);
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('displays Offline when offline', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
      renderWithStore(false);
      expect(screen.getByText('Offline')).toBeInTheDocument();
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
    });
  });

  // ── Initial Online Status Dispatch ─────────────────────
  describe('Initial Status', () => {
    it('dispatches setOnlineStatus with navigator.onLine on mount', () => {
      const { dispatchSpy } = renderWithStore();
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'navigation/setOnlineStatus',
        payload: navigator.onLine,
      });
    });
  });

  // ── Online/Offline Events ──────────────────────────────
  describe('Online/Offline Events', () => {
    it('dispatches true on window online event', () => {
      const { dispatchSpy } = renderWithStore();
      dispatchSpy.mockClear();
      fireEvent(window, new Event('online'));
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'navigation/setOnlineStatus',
        payload: true,
      });
    });

    it('dispatches false on window offline event', () => {
      const { dispatchSpy } = renderWithStore();
      dispatchSpy.mockClear();
      fireEvent(window, new Event('offline'));
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'navigation/setOnlineStatus',
        payload: false,
      });
    });

    it('removes event listeners on unmount', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderWithStore();
      unmount();
      expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
      removeSpy.mockRestore();
    });
  });

  // ── Auto-Hide Visibility ───────────────────────────────
  describe('Auto-Hide', () => {
    it('starts visible', () => {
      renderWithStore();
      expect(screen.getByTestId('time-container')).toHaveAttribute('data-visible', 'true');
    });

    it('hides after 3 seconds', () => {
      renderWithStore();
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByTestId('time-container')).toHaveAttribute('data-visible', 'false');
    });

    it('stays visible when hovered before timeout', () => {
      renderWithStore();
      const container = screen.getByTestId('time-container');
      fireEvent.mouseEnter(container);
      act(() => vi.advanceTimersByTime(5000));
      expect(container).toHaveAttribute('data-visible', 'true');
    });

    it('hides after mouse leaves (after delay)', () => {
      renderWithStore();
      const container = screen.getByTestId('time-container');
      // Hover to pin
      fireEvent.mouseEnter(container);
      act(() => vi.advanceTimersByTime(5000));
      // Leave
      fireEvent.mouseLeave(container);
      act(() => vi.advanceTimersByTime(3000));
      expect(container).toHaveAttribute('data-visible', 'false');
    });
  });

  // ── Connection Status Data Attribute ───────────────────
  describe('Connection Status Attribute', () => {
    it('passes isOnline=true to ConnectionStatus', () => {
      renderWithStore(true);
      expect(screen.getByTestId('connection-status')).toHaveAttribute('data-online', 'true');
    });

    it('passes isOnline=false to ConnectionStatus', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
      renderWithStore(false);
      expect(screen.getByTestId('connection-status')).toHaveAttribute('data-online', 'false');
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
    });
  });
});
