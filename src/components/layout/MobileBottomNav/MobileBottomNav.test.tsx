/**
 * MobileBottomNav — Unit tests
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
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
        <MemoryRouter initialEntries={['/crm']}>
          <MobileBottomNav />
        </MemoryRouter>
      </Provider>
    );
    const nav = screen.getByLabelText('CRM mobile navigation');
    const tabs = nav.querySelectorAll('button');
    expect(tabs.length).toBe(5);
  });

  it('renders correct labels', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crm']}>
          <MobileBottomNav />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText('Home')).toBeDefined();
    expect(screen.getByLabelText('Leads')).toBeDefined();
    expect(screen.getByLabelText('Properties')).toBeDefined();
    expect(screen.getByLabelText('Viewings')).toBeDefined();
    expect(screen.getByLabelText('More')).toBeDefined();
  });

  it('marks the active tab based on route with aria-current', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crm/leads']}>
          <MobileBottomNav />
        </MemoryRouter>
      </Provider>
    );
    const leadsTab = screen.getByLabelText('Leads');
    expect(leadsTab.getAttribute('aria-current')).toBe('page');

    // Other tabs should NOT have aria-current
    const homeTab = screen.getByLabelText('Home');
    expect(homeTab.getAttribute('aria-current')).toBeNull();
  });

  it('calls onMenuOpen when More tab is clicked', () => {
    const onMenu = vi.fn();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crm']}>
          <MobileBottomNav onMenuOpen={onMenu} />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByLabelText('More'));
    expect(onMenu).toHaveBeenCalledTimes(1);
  });

  it('shows badge when there are unread leads', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crm']}>
          <MobileBottomNav unreadLeadCount={5} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('5')).toBeDefined();
  });

  it('has mobile navigation aria-label', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crm']}>
          <MobileBottomNav />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText('CRM mobile navigation')).toBeDefined();
  });

  it('defaults activeTab to "home" when route is /crm', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crm']}>
          <MobileBottomNav />
        </MemoryRouter>
      </Provider>
    );
    const homeTab = screen.getByLabelText('Home');
    expect(homeTab.getAttribute('aria-current')).toBe('page');
  });
});
