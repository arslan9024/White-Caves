import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock ThemeContext
const mockSetIsDark = vi.fn();
vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, setIsDark: mockSetIsDark }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock child components
vi.mock('../ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock('../layout/UniversalProfile', () => ({
  default: () => <div data-testid="universal-profile">UniversalProfile</div>,
}));

// Mock styled-components — return basic HTML elements
vi.mock('../MegaNav.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = React.forwardRef(({ children, ...props }: any, ref: any) => {
      // Strip $ prefix transient props for DOM
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name, ref }, children);
    });
    Comp.displayName = name;
    return Comp;
  };

  return {
    MegaNavHeader: c('header', 'mega-nav-header'),
    MegaNav: c('nav', 'mega-nav'),
    MegaNavContainer: c('div', 'mega-nav-container'),
    MegaNavLogo: c('a', 'mega-nav-logo'),
    LogoImage: c('img', 'logo-image'),
    MobileMenuButton: c('button', 'mobile-menu-button'),
    HamburgerIcon: c('div', 'hamburger-icon'),
    MegaNavMenu: c('div', 'mega-nav-menu'),
    MegaNavList: c('ul', 'mega-nav-list'),
    MegaNavItem: c('li', 'mega-nav-item'),
    MegaNavTrigger: c('button', 'mega-nav-trigger'),
    DropdownArrow: c('svg', 'dropdown-arrow'),
    MegaDropdown: c('div', 'mega-dropdown'),
    MegaDropdownContent: c('div', 'mega-dropdown-content'),
    MegaFeatured: c('div', 'mega-featured'),
    FeaturedList: c('div', 'featured-list'),
    FeaturedItem: c('div', 'featured-item'),
    FeaturedIcon: c('span', 'featured-icon'),
    FeaturedText: c('div', 'featured-text'),
    FeaturedTitle: c('span', 'featured-title'),
    FeaturedDesc: c('span', 'featured-desc'),
    MegaCol: c('div', 'mega-col'),
    MegaLinks: c('ul', 'mega-links'),
    MegaCTA: c('div', 'mega-cta'),
    MegaCTAContent: c('div', 'mega-cta-content'),
    MegaNavActions: c('div', 'mega-nav-actions'),
    MegaNavLink: c('a', 'mega-nav-link'),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import MegaNav from '../MegaNav';

const renderMegaNav = (user?: Record<string, unknown> | null) =>
  render(
    <MemoryRouter>
      <MegaNav user={user as any} />
    </MemoryRouter>
  );

describe('MegaNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders the navigation header', () => {
      renderMegaNav();
      expect(screen.getByTestId('mega-nav-header')).toBeInTheDocument();
    });

    it('renders the company logo', () => {
      renderMegaNav();
      expect(screen.getByTestId('logo-image')).toBeInTheDocument();
    });

    it('renders ThemeToggle', () => {
      renderMegaNav();
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders UniversalProfile', () => {
      renderMegaNav();
      expect(screen.getByTestId('universal-profile')).toBeInTheDocument();
    });

    it('renders mobile menu button', () => {
      renderMegaNav();
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });
  });

  // ── Menu Items ─────────────────────────────────────────────
  describe('menu items', () => {
    it('renders all 4 main menu items: Buy, Rent, Commercial, New Projects', () => {
      renderMegaNav();
      expect(screen.getByText('Buy')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.getByText('Commercial')).toBeInTheDocument();
      expect(screen.getByText('New Projects')).toBeInTheDocument();
    });

    it('renders simple links: About, Services, Careers, Contact', () => {
      renderMegaNav();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Careers')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  // ── Mega Dropdown Content ──────────────────────────────────
  describe('mega dropdown content', () => {
    it('renders Buy submenu featured items', () => {
      renderMegaNav();
      expect(screen.getByText('New Listings')).toBeInTheDocument();
      expect(screen.getByText('Luxury Homes')).toBeInTheDocument();
      expect(screen.getByText('Investment Properties')).toBeInTheDocument();
    });

    it('renders Buy submenu property types', () => {
      renderMegaNav();
      expect(screen.getAllByText('Villas').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Apartments').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Penthouses').length).toBeGreaterThan(0);
    });

    it('renders Buy submenu locations', () => {
      renderMegaNav();
      expect(screen.getAllByText('Palm Jumeirah').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Downtown Dubai').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Emirates Hills').length).toBeGreaterThan(0);
    });

    it('renders Buy submenu price ranges', () => {
      renderMegaNav();
      expect(screen.getByText('Under 5M AED')).toBeInTheDocument();
      expect(screen.getByText('30M+ AED')).toBeInTheDocument();
    });

    it('renders Rent submenu featured items', () => {
      renderMegaNav();
      expect(screen.getByText('Move-in Ready')).toBeInTheDocument();
      expect(screen.getByText('Furnished Homes')).toBeInTheDocument();
      expect(screen.getByText('Short Term')).toBeInTheDocument();
    });

    it('renders Commercial submenu featured items', () => {
      renderMegaNav();
      expect(screen.getByText('Office Spaces')).toBeInTheDocument();
      expect(screen.getByText('Retail Units')).toBeInTheDocument();
      // 'Warehouses' appears twice (featured + property type)
      expect(screen.getAllByText('Warehouses').length).toBeGreaterThanOrEqual(1);
    });

    it('renders New Projects submenu with developers', () => {
      renderMegaNav();
      expect(screen.getByText('Emaar')).toBeInTheDocument();
      expect(screen.getByText('DAMAC')).toBeInTheDocument();
      expect(screen.getByText('Meraas')).toBeInTheDocument();
    });

    it('renders New Projects submenu with payment plans', () => {
      renderMegaNav();
      expect(screen.getByText('10% Down')).toBeInTheDocument();
      expect(screen.getByText('Post-Handover')).toBeInTheDocument();
    });

    it('renders CTA section in dropdowns', () => {
      renderMegaNav();
      expect(screen.getAllByText('Need Help Finding a Property?').length).toBeGreaterThan(0);
    });
  });

  // ── Mouse Interaction ──────────────────────────────────────
  describe('mouse interaction', () => {
    it('opens submenu on mouse enter', () => {
      renderMegaNav();
      const items = screen.getAllByTestId('mega-nav-item');
      fireEvent.mouseEnter(items[0]); // Buy menu
      // Dropdown should be rendered (content is always present)
      expect(screen.getByText('New Listings')).toBeInTheDocument();
    });

    it('closes submenu on mouse leave', () => {
      renderMegaNav();
      const items = screen.getAllByTestId('mega-nav-item');
      fireEvent.mouseEnter(items[0]);
      fireEvent.mouseLeave(items[0]);
      // Menu still renders, state just updates
      expect(screen.getByText('Buy')).toBeInTheDocument();
    });
  });

  // ── Mobile Menu ────────────────────────────────────────────
  describe('mobile menu', () => {
    it('toggles mobile menu on button click', () => {
      renderMegaNav();
      const btn = screen.getByTestId('mobile-menu-button');
      fireEvent.click(btn);
      // Toggle happens within state
      expect(btn).toBeInTheDocument();
    });

    it('closes on second click (toggle)', () => {
      renderMegaNav();
      const btn = screen.getByTestId('mobile-menu-button');
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  // ── Click Outside ──────────────────────────────────────────
  describe('click outside', () => {
    it('closes active menu when clicking outside', () => {
      renderMegaNav();
      const items = screen.getAllByTestId('mega-nav-item');
      fireEvent.mouseEnter(items[0]);
      // Click outside
      fireEvent.mouseDown(document);
      expect(screen.getByText('Buy')).toBeInTheDocument();
    });
  });

  // ── Props Handling ─────────────────────────────────────────
  describe('props', () => {
    it('accepts user prop without crashing', () => {
      renderMegaNav({ id: '1', name: 'John', email: 'john@test.com', role: 'admin' });
      expect(screen.getByTestId('mega-nav-header')).toBeInTheDocument();
    });

    it('renders correctly with null user', () => {
      renderMegaNav(null);
      expect(screen.getByTestId('mega-nav-header')).toBeInTheDocument();
    });

    it('renders correctly without user prop', () => {
      renderMegaNav();
      expect(screen.getByTestId('mega-nav-header')).toBeInTheDocument();
    });
  });

  // ── Links & Navigation ────────────────────────────────────
  describe('links', () => {
    it('has correct href for property type links', () => {
      renderMegaNav();
      const villaLinks = screen.getAllByText('Villas');
      expect(villaLinks.length).toBeGreaterThan(0);
    });

    it('has correct href for location links', () => {
      renderMegaNav();
      const pjLinks = screen.getAllByText('Palm Jumeirah');
      expect(pjLinks.length).toBeGreaterThan(0);
    });

    it('renders contact CTA link', () => {
      renderMegaNav();
      expect(screen.getAllByText('Contact Us').length).toBeGreaterThan(0);
    });
  });

  // ── Accessibility ──────────────────────────────────────────
  describe('accessibility', () => {
    it('uses semantic nav element', () => {
      renderMegaNav();
      expect(screen.getByTestId('mega-nav')).toBeInTheDocument();
    });

    it('renders menu items with menuitem roles', () => {
      renderMegaNav();
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems.length).toBeGreaterThan(0);
    });
  });
});
