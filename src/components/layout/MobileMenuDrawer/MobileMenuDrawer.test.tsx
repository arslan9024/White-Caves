/**
 * MobileMenuDrawer — Unit tests
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import MobileMenuDrawer from './MobileMenuDrawer';

// ─── Mock assistantRegistry ───────────────────────────────────────────────

vi.mock('../../../config/assistantRegistry', () => ({
  getAllAssistants: () => [
    { id: 'nadia', name: 'Nadia', title: 'AI Concierge', department: 'executive', color: '#D4AF37', avatar: 'N' },
  ],
  DEPARTMENTS: {
    executive: { label: 'Executive', color: '#D4AF37' },
  },
}));

// ─── Mock store ───────────────────────────────────────────────────────────

function createStore(overrides: Record<string, unknown> = {}) {
  return configureStore({
    reducer: {
      sidebar: () => ({
        selectedDepartment: null,
        selectedService: null,
        flyoutOpen: false,
        flyoutDepartment: null,
        aiCommandOpen: false,
        selectedAssistant: null,
        commandPaletteOpen: false,
        ...(overrides.sidebar || {}),
      }),
      auth: () => ({
        user: { role: 'user', name: 'Test User', email: 'test@test.com' },
        ...(overrides.auth || {}),
      }),
      crmData: () => ({
        leads: { items: [{ id: 1, status: 'hot' }], loading: false },
        properties: { items: [{ id: 1 }, { id: 2 }], loading: false },
        ...(overrides.crmData || {}),
      }),
      nadia: () => ({
        queue: [],
        ...(overrides.nadia || {}),
      }),
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function renderDrawer(props: Partial<React.ComponentProps<typeof MobileMenuDrawer>> = {}, storeOverrides: Record<string, unknown> = {}) {
  const store = createStore(storeOverrides);
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onTabChange: vi.fn(),
    ...props,
  };

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <MobileMenuDrawer {...defaultProps} />
        </MemoryRouter>
      </Provider>,
    ),
    store,
    props: defaultProps,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe('MobileMenuDrawer', () => {
  it('renders when open', () => {
    renderDrawer({ open: true });
    expect(screen.getByTestId('drawer-panel')).toBeDefined();
  });

  it('shows White Caves branding', () => {
    renderDrawer();
    expect(screen.getByText('White Caves')).toBeDefined();
    expect(screen.getByText('WC')).toBeDefined();
  });

  it('shows department labels', () => {
    renderDrawer();
    expect(screen.getByLabelText('Operations')).toBeDefined();
    expect(screen.getByLabelText('Finance')).toBeDefined();
    expect(screen.getByLabelText('Sales')).toBeDefined();
    expect(screen.getByLabelText('Marketing')).toBeDefined();
    expect(screen.getByLabelText('Communications')).toBeDefined();
    expect(screen.getByLabelText('Executive')).toBeDefined();
    expect(screen.getByLabelText('Compliance')).toBeDefined();
    expect(screen.getByLabelText('Technology')).toBeDefined();
    expect(screen.getByLabelText('Legal')).toBeDefined();
  });

  it('shows navigation section items', () => {
    renderDrawer();
    expect(screen.getByLabelText('Dashboard')).toBeDefined();
    expect(screen.getByLabelText('Analytics')).toBeDefined();
    expect(screen.getByLabelText('Clients')).toBeDefined();
  });

  it('shows AI Command Center', () => {
    renderDrawer();
    expect(screen.getByLabelText('AI Command Center')).toBeDefined();
  });

  it('shows Settings', () => {
    renderDrawer();
    expect(screen.getByLabelText('Settings')).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    const { props } = renderDrawer();
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const { props } = renderDrawer();
    fireEvent.click(screen.getByTestId('drawer-overlay'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const { props } = renderDrawer();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onTabChange + onClose when Dashboard is clicked', () => {
    const { props } = renderDrawer();
    fireEvent.click(screen.getByLabelText('Dashboard'));
    expect(props.onTabChange).toHaveBeenCalledWith('home');
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('expands department to show services when clicked', () => {
    renderDrawer();
    // Initially services are not visible (collapsed)
    const salesBtn = screen.getByLabelText('Sales');
    fireEvent.click(salesBtn);

    // After click, services should be visible
    expect(screen.getByText('Lead Management')).toBeDefined();
    expect(screen.getByText('Negotiations')).toBeDefined();
    expect(screen.getByText('Deal Tracking')).toBeDefined();
    expect(screen.getByText('Pipeline')).toBeDefined();
  });

  it('has dialog role with aria-modal', () => {
    renderDrawer();
    const panel = screen.getByTestId('drawer-panel');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
  });

  it('does NOT show Admin for regular users', () => {
    renderDrawer();
    expect(screen.queryByLabelText('Admin Dashboard')).toBeNull();
  });

  it('shows Admin for super users (lion role)', () => {
    renderDrawer({}, {
      auth: { user: { role: 'lion', name: 'Admin', email: 'admin@wc.ae' } },
    });
    expect(screen.getByLabelText('Admin Dashboard')).toBeDefined();
  });

  it('locks body scroll when open', () => {
    renderDrawer({ open: true });
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <MobileMenuDrawer open={true} onClose={vi.fn()} />
        </MemoryRouter>
      </Provider>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Provider store={createStore()}>
        <MemoryRouter>
          <MobileMenuDrawer open={false} onClose={vi.fn()} />
        </MemoryRouter>
      </Provider>,
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('shows footer text', () => {
    renderDrawer();
    expect(screen.getByText('White Caves CRM v2.0')).toBeDefined();
  });
});
