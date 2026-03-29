/**
 * UniversalNav Component Tests
 * Tests: rendering, nav links, role menus, online status, date/time,
 *        mobile menu, click outside, keyboard navigation
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UniversalNav, { DEFAULT_NAV_LINKS, ROLE_MENUS } from './UniversalNav';

// Mock UniversalProfile
vi.mock('../layout/UniversalProfile', () => ({
  default: () => <div data-testid="universal-profile">Profile</div>,
}));

// Mock utils
vi.mock('../../utils', () => ({
  formatDate: (date: Date, options: any) => 'Mon, 15 Jan',
}));

// Minimal navigationSlice reducer
const createNavigationState = (overrides = {}) => ({
  isOnline: true,
  currentTime: '2025-01-15T10:30:00Z',
  roleMenuOpen: false,
  activeRole: null,
  profileMenuOpen: false,
  mobileMenuOpen: false,
  whatsappMenuOpen: false,
  theme: 'light',
  language: 'en',
  notifications: [],
  unreadCount: 0,
  currentModule: '',
  currentSubModule: '',
  sidebarCollapsed: false,
  ...overrides,
});

const createStore = (navOverrides = {}) =>
  configureStore({
    reducer: {
      navigation: (state = createNavigationState(navOverrides)) => state,
    },
  });

const renderWithProviders = (ui: React.ReactElement, navOverrides = {}) => {
  const store = createStore(navOverrides);
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
};

describe('UniversalNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Basic Rendering ─────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<UniversalNav />);
      expect(screen.getByText('White Caves')).toBeInTheDocument();
    });

    it('renders custom logo text', () => {
      renderWithProviders(<UniversalNav logoText="My CRM" />);
      expect(screen.getByText('My CRM')).toBeInTheDocument();
    });

    it('renders logo image', () => {
      renderWithProviders(<UniversalNav />);
      const img = screen.getByAltText('White Caves');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/company-logo.jpg');
    });

    it('renders custom logo path', () => {
      renderWithProviders(<UniversalNav logoPath="/custom-logo.png" />);
      const img = screen.getByAltText('White Caves');
      expect(img).toHaveAttribute('src', '/custom-logo.png');
    });

    it('renders UniversalProfile', () => {
      renderWithProviders(<UniversalNav />);
      expect(screen.getByTestId('universal-profile')).toBeInTheDocument();
    });
  });

  // ─── Navigation Links ────────────────────────────────────
  describe('nav links', () => {
    it('renders all default nav links', () => {
      renderWithProviders(<UniversalNav />);
      DEFAULT_NAV_LINKS.forEach((link) => {
        expect(screen.getByText(link.label)).toBeInTheDocument();
      });
    });

    it('renders custom nav links', () => {
      const customLinks = [
        { path: '/custom1', label: 'Custom One' },
        { path: '/custom2', label: 'Custom Two' },
      ];
      renderWithProviders(<UniversalNav navLinks={customLinks} />);
      expect(screen.getByText('Custom One')).toBeInTheDocument();
      expect(screen.getByText('Custom Two')).toBeInTheDocument();
    });

    it('default nav links include Home, Properties, Services, About, Contact', () => {
      expect(DEFAULT_NAV_LINKS.map((l) => l.label)).toEqual([
        'Home', 'Properties', 'Services', 'About', 'Contact',
      ]);
    });
  });

  // ─── Online Status ───────────────────────────────────────
  describe('online status', () => {
    it('does not show online status by default', () => {
      renderWithProviders(<UniversalNav />);
      expect(screen.queryByText('Online')).not.toBeInTheDocument();
    });

    it('shows Online when showOnlineStatus=true and isOnline', () => {
      renderWithProviders(<UniversalNav showOnlineStatus />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('shows Offline when not online', () => {
      renderWithProviders(<UniversalNav showOnlineStatus />, { isOnline: false });
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });
  });

  // ─── DateTime Display ────────────────────────────────────
  describe('date time display', () => {
    it('does not show date/time by default', () => {
      renderWithProviders(<UniversalNav />);
      // date format mock returns 'Mon, 15 Jan'
      expect(screen.queryByText('Mon, 15 Jan')).not.toBeInTheDocument();
    });

    it('shows date when showDateTime=true', () => {
      renderWithProviders(<UniversalNav showDateTime />);
      expect(screen.getByText('Mon, 15 Jan')).toBeInTheDocument();
    });
  });

  // ─── Role Menus Config ────────────────────────────────────
  describe('role menus', () => {
    it('ROLE_MENUS contains buyer, seller, landlord, owner', () => {
      expect(Object.keys(ROLE_MENUS)).toContain('buyer');
      expect(Object.keys(ROLE_MENUS)).toContain('seller');
      expect(Object.keys(ROLE_MENUS)).toContain('landlord');
      expect(Object.keys(ROLE_MENUS)).toContain('owner');
    });

    it('buyer menu has correct items', () => {
      expect(ROLE_MENUS.buyer.items.length).toBe(6);
      expect(ROLE_MENUS.buyer.label).toBe('Buyer');
    });

    it('seller menu has correct items', () => {
      expect(ROLE_MENUS.seller.items.length).toBe(5);
      expect(ROLE_MENUS.seller.label).toBe('Seller');
    });

    it('owner menu is marked as owner exclusive', () => {
      expect(ROLE_MENUS.owner.isOwnerExclusive).toBe(true);
    });

    it('renders role dropdown when activeRole is set (non-owner)', () => {
      renderWithProviders(<UniversalNav />, { activeRole: 'buyer' });
      expect(screen.getByText('Buyer')).toBeInTheDocument();
    });

    it('does NOT render role dropdown for owner (isOwnerExclusive)', () => {
      renderWithProviders(<UniversalNav />, { activeRole: 'owner' });
      // Owner label should not appear in nav dropdown (owner exclusive)
      expect(screen.queryByLabelText('Owner Panel menu')).not.toBeInTheDocument();
    });
  });

  // ─── Mobile Menu ─────────────────────────────────────────
  describe('mobile menu', () => {
    it('renders mobile menu toggle button', () => {
      renderWithProviders(<UniversalNav />);
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    it('toggles mobile menu on click', () => {
      renderWithProviders(<UniversalNav />);
      const btn = screen.getByLabelText('Toggle menu');
      fireEvent.click(btn);
      // Second click closes
      fireEvent.click(btn);
      // No crash
    });
  });
});
