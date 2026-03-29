/**
 * RoleSwitcher — Unit Tests
 * Tests: render, dropdown toggle, role switching, navigation, localStorage,
 * click-outside close, compact mode, ROLE_OPTIONS
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

vi.mock('../../utils/safeStorage', () => ({
  safeStorage: {
    setJSON: vi.fn(),
    getJSON: vi.fn(() => null),
    set: vi.fn(),
    get: vi.fn(() => null),
    remove: vi.fn(),
  },
}));

vi.mock('../../features/featureRegistry', () => ({
  getDefaultModule: (role: string) => {
    if (role === 'buyer') return { id: 'property-search', defaultSubModule: 'browse' };
    if (role === 'owner') return { id: 'system-management', defaultSubModule: 'dashboard' };
    return null;
  },
}));

import RoleSwitcher from './RoleSwitcher';
import { safeStorage } from '../../utils/safeStorage';

// ── Store factory ────────────────────────────────────────────────
function createMockStore(activeRole = 'buyer') {
  return configureStore({
    reducer: {
      navigation: (state = { activeRole, currentModule: '', currentSubModule: '' }, action: any) => {
        if (action.type === 'navigation/setActiveRole') {
          return { ...state, activeRole: action.payload };
        }
        if (action.type === 'navigation/setCurrentModule') {
          return { ...state, currentModule: action.payload };
        }
        if (action.type === 'navigation/setCurrentSubModule') {
          return { ...state, currentSubModule: action.payload };
        }
        return state;
      },
    },
  });
}

function renderWithProviders(ui: React.ReactElement, activeRole = 'buyer') {
  const store = createMockStore(activeRole);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    ),
  };
}

// ═══════════════════════════════════════════════════════════════════

describe('RoleSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Render ──────────────────────────────────────────────────────
  it('renders current role label', () => {
    renderWithProviders(<RoleSwitcher />);
    expect(screen.getByText('Buyer')).toBeDefined();
  });

  it('renders current role icon', () => {
    renderWithProviders(<RoleSwitcher />);
    expect(screen.getByText('🏠')).toBeDefined();
  });

  it('renders switch role button with aria-label', () => {
    renderWithProviders(<RoleSwitcher />);
    expect(screen.getByLabelText('Switch role')).toBeDefined();
  });

  it('shows dropdown arrow', () => {
    renderWithProviders(<RoleSwitcher />);
    expect(screen.getByText('▼')).toBeDefined();
  });

  // ── Dropdown Toggle ─────────────────────────────────────────────
  it('opens dropdown when toggle is clicked', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));
    expect(screen.getByText('Switch Role')).toBeDefined();
  });

  it('shows all 7 role options in dropdown', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));

    expect(screen.getByText('Seller')).toBeDefined();
    expect(screen.getByText('Landlord')).toBeDefined();
    expect(screen.getByText('Tenant')).toBeDefined();
    expect(screen.getByText('Leasing Agent')).toBeDefined();
    expect(screen.getByText('Sales Agent')).toBeDefined();
    expect(screen.getByText('Owner')).toBeDefined();
  });

  it('shows role descriptions in dropdown', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));

    expect(screen.getByText('Find your dream property')).toBeDefined();
    expect(screen.getByText('List and sell properties')).toBeDefined();
    expect(screen.getByText('System management')).toBeDefined();
  });

  it('closes dropdown when toggle is clicked again', () => {
    renderWithProviders(<RoleSwitcher />);
    const toggle = screen.getByLabelText('Switch role');
    fireEvent.click(toggle);
    expect(screen.getByText('Switch Role')).toBeDefined();
    fireEvent.click(toggle);
    expect(screen.queryByText('Switch Role')).toBeNull();
  });

  // ── Role Selection ──────────────────────────────────────────────
  it('shows checkmark for active role', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));
    expect(screen.getByText('✓')).toBeDefined();
  });

  it('navigates to role dashboard on selection', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));
    fireEvent.click(screen.getByText('Seller'));

    expect(mockNavigate).toHaveBeenCalledWith('/seller/dashboard');
  });

  it('persists selected role to localStorage', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));
    fireEvent.click(screen.getByText('Owner'));

    expect(safeStorage.setJSON).toHaveBeenCalledWith('userRole', expect.objectContaining({
      role: 'owner',
    }));
  });

  it('closes dropdown after role selection', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));
    expect(screen.getByText('Switch Role')).toBeDefined();
    fireEvent.click(screen.getByText('Landlord'));
    expect(screen.queryByText('Switch Role')).toBeNull();
  });

  it('navigates to correct path for each role', () => {
    const roles = [
      { label: 'Seller', path: '/seller/dashboard' },
      { label: 'Landlord', path: '/landlord/dashboard' },
      { label: 'Tenant', path: '/tenant/dashboard' },
      { label: 'Owner', path: '/owner/dashboard' },
    ];

    for (const { label, path } of roles) {
      mockNavigate.mockClear();
      const { unmount } = renderWithProviders(<RoleSwitcher />);
      fireEvent.click(screen.getByLabelText('Switch role'));
      fireEvent.click(screen.getByText(label));
      expect(mockNavigate).toHaveBeenCalledWith(path);
      unmount();
    }
  });

  // ── Click Outside ───────────────────────────────────────────────
  it('closes dropdown when clicking outside', () => {
    renderWithProviders(<RoleSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch role'));
    expect(screen.getByText('Switch Role')).toBeDefined();
    // Simulate click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Switch Role')).toBeNull();
  });

  // ── Compact Mode ────────────────────────────────────────────────
  it('renders in compact mode without breaking', () => {
    renderWithProviders(<RoleSwitcher compact />);
    expect(screen.getByLabelText('Switch role')).toBeDefined();
  });

  // ── Owner Role ──────────────────────────────────────────────────
  it('displays Owner role correctly when active', () => {
    renderWithProviders(<RoleSwitcher />, 'owner');
    expect(screen.getByText('Owner')).toBeDefined();
    expect(screen.getByText('⚙️')).toBeDefined();
  });

  // ── Fallback for Unknown Role ───────────────────────────────────
  it('displays fallback for unknown role', () => {
    renderWithProviders(<RoleSwitcher />, 'unknown-role');
    expect(screen.getByText('Select Role')).toBeDefined();
    expect(screen.getByText('👤')).toBeDefined();
  });
});
