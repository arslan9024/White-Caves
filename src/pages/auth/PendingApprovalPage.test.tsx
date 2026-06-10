/**
 * PendingApprovalPage — Unit Tests
 * Tests: render pending state, redirect when unauthenticated,
 * redirect when already approved, logout button, role label display
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

const mockSignOut = vi.fn().mockResolvedValue(undefined);
vi.mock('firebase/auth', () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

vi.mock('../../config/firebase', () => ({
  auth: { currentUser: { uid: 'u1' } },
}));

const { mockSafeStorage } = vi.hoisted(() => ({
  mockSafeStorage: {
    getJSON: vi.fn(() => ({ role: 'leasing-agent', status: 'pending' })),
    setJSON: vi.fn(),
    set: vi.fn(),
    get: vi.fn(() => null),
    remove: vi.fn(),
  },
}));
vi.mock('../../utils/safeStorage', () => ({
  safeStorage: mockSafeStorage,
}));

// ── Redux store factory ──────────────────────────────────────────
import userReducer from '../../store/userSlice';

function makeStore(user: unknown = { id: 'u1', name: 'John Agent', email: 'john@whitecaves.ae' }) {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { currentUser: user as any, loading: false, error: null } },
  });
}

function renderPage(
  user: unknown = { id: 'u1', name: 'John Agent', email: 'john@whitecaves.ae', photo: null }
) {
  const store = makeStore(user);
  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter>
        {/* Lazy import via direct import */}
        <PendingApprovalPageLazy />
      </MemoryRouter>
    </Provider>
  );
  return { store, unmount };
}

import PendingApprovalPageLazy from './PendingApprovalPage';

// ═════════════════════════════════════════════════════════════════════

describe('PendingApprovalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSafeStorage.getJSON.mockReturnValue({ role: 'leasing-agent', status: 'pending' });
  });

  it('renders the pending approval card when user and userData are set', () => {
    renderPage();
    expect(screen.getByText('Pending Approval')).toBeDefined();
  });

  it('shows the user name', () => {
    renderPage();
    expect(screen.getByText('John Agent')).toBeDefined();
  });

  it('shows the user email', () => {
    renderPage();
    expect(screen.getByText('john@whitecaves.ae')).toBeDefined();
  });

  it('displays correct label for leasing-agent role', () => {
    renderPage();
    expect(screen.getByText('Leasing Agent')).toBeDefined();
  });

  it('displays correct label for secondary-sales-agent role', () => {
    mockSafeStorage.getJSON.mockReturnValue({ role: 'secondary-sales-agent', status: 'pending' });
    renderPage();
    expect(screen.getByText('Sales Agent')).toBeDefined();
  });

  it('displays correct label for team-leader role', () => {
    mockSafeStorage.getJSON.mockReturnValue({ role: 'team-leader', status: 'pending' });
    renderPage();
    expect(screen.getByText('Team Leader')).toBeDefined();
  });

  it('shows "Pending Review" status badge', () => {
    renderPage();
    expect(screen.getByText('Pending Review')).toBeDefined();
  });

  it('shows the "Browse Properties" link', () => {
    renderPage();
    expect(screen.getByText('Browse Properties')).toBeDefined();
  });

  it('shows Sign Out button', () => {
    renderPage();
    expect(screen.getByText('Sign Out')).toBeDefined();
  });

  it('navigates to /signin when user is null', () => {
    mockSafeStorage.getJSON.mockReturnValue(null);
    const store = makeStore(null);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingApprovalPageLazy />
        </MemoryRouter>
      </Provider>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('redirects to dashboard when status is not pending', () => {
    mockSafeStorage.getJSON.mockReturnValue({ role: 'agent', status: 'approved' });
    renderPage();
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('calls signOut and navigates home on logout click', async () => {
    renderPage();
    const signOutBtn = screen.getByText('Sign Out');
    fireEvent.click(signOutBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('renders nothing (null) when userData is not loaded', () => {
    mockSafeStorage.getJSON.mockReturnValue(null);
    const store = makeStore({ id: 'u1', name: 'John', email: 'john@test.com' });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <PendingApprovalPageLazy />
        </MemoryRouter>
      </Provider>
    );
    // When stored data is null the component returns null and renders nothing
    expect(container.firstChild).toBeNull();
  });
});
