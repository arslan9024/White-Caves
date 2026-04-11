/**
 * MobileBottomNav — Unit tests
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MobileBottomNav from './MobileBottomNav';

// ─── Mock store ───────────────────────────────────────────────────────────

function createStore(overrides: Record<string, unknown> = {}) {
  return configureStore({
    reducer: {
      nadia: () => ({
        queue: [],
        ...(overrides.nadia || {}),
      }),
    },
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe('MobileBottomNav', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('renders 5 tab buttons', () => {
    render(
      <Provider store={store}>
        <MobileBottomNav />
      </Provider>,
    );
    const nav = screen.getByLabelText('Mobile navigation');
    const tabs = nav.querySelectorAll('button');
    expect(tabs.length).toBe(5);
  });

  it('renders correct labels', () => {
    render(
      <Provider store={store}>
        <MobileBottomNav />
      </Provider>,
    );
    expect(screen.getByLabelText('Home')).toBeDefined();
    expect(screen.getByLabelText('Analytics')).toBeDefined();
    expect(screen.getByLabelText('Messages')).toBeDefined();
    expect(screen.getByLabelText('AI')).toBeDefined();
    expect(screen.getByLabelText('Menu')).toBeDefined();
  });

  it('marks the active tab with aria-current', () => {
    render(
      <Provider store={store}>
        <MobileBottomNav activeTab="analytics" />
      </Provider>,
    );
    const analyticsTab = screen.getByLabelText('Analytics');
    expect(analyticsTab.getAttribute('aria-current')).toBe('page');

    // Other tabs should NOT have aria-current
    const homeTab = screen.getByLabelText('Home');
    expect(homeTab.getAttribute('aria-current')).toBeNull();
  });

  it('calls onTabChange when non-menu tab is clicked', () => {
    const onChange = vi.fn();
    render(
      <Provider store={store}>
        <MobileBottomNav onTabChange={onChange} />
      </Provider>,
    );
    fireEvent.click(screen.getByLabelText('Analytics'));
    expect(onChange).toHaveBeenCalledWith('analytics');
  });

  it('calls onMenuOpen when Menu tab is clicked', () => {
    const onMenu = vi.fn();
    render(
      <Provider store={store}>
        <MobileBottomNav onMenuOpen={onMenu} />
      </Provider>,
    );
    fireEvent.click(screen.getByLabelText('Menu'));
    expect(onMenu).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onTabChange when Menu tab is clicked', () => {
    const onChange = vi.fn();
    const onMenu = vi.fn();
    render(
      <Provider store={store}>
        <MobileBottomNav onTabChange={onChange} onMenuOpen={onMenu} />
      </Provider>,
    );
    fireEvent.click(screen.getByLabelText('Menu'));
    expect(onChange).not.toHaveBeenCalled();
    expect(onMenu).toHaveBeenCalledTimes(1);
  });

  it('shows badge when there are queued messages', () => {
    const storeWithBadge = configureStore({
      reducer: {
        nadia: () => ({
          queue: [{ id: '1' }, { id: '2' }, { id: '3' }],
        }),
      },
    });
    render(
      <Provider store={storeWithBadge}>
        <MobileBottomNav />
      </Provider>,
    );
    expect(screen.getByText('3')).toBeDefined();
  });

  it('has mobile navigation aria-label', () => {
    render(
      <Provider store={store}>
        <MobileBottomNav />
      </Provider>,
    );
    expect(screen.getByLabelText('Mobile navigation')).toBeDefined();
  });

  it('defaults activeTab to "home"', () => {
    render(
      <Provider store={store}>
        <MobileBottomNav />
      </Provider>,
    );
    const homeTab = screen.getByLabelText('Home');
    expect(homeTab.getAttribute('aria-current')).toBe('page');
  });
});
