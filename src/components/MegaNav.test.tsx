/**
 * MegaNav Component Tests
 * Tests: rendering, menu items, dropdowns, simple links, mobile toggle,
 *        click-outside, hover, keyboard, ThemeToggle & Profile
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MegaNav from './MegaNav';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, setIsDark: vi.fn() }),
}));

vi.mock('./ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme</div>,
}));

vi.mock('./layout/UniversalProfile', () => ({
  default: () => <div data-testid="universal-profile">Profile</div>,
}));

// Mock all styled components from MegaNav.styles
vi.mock('./MegaNav.styles', () => {
  const styled = (tag: string) => {
    const Comp = React.forwardRef(({ children, $active, $open, $mobileOpen, $isSimple, to, as: As, ...rest }: any, ref: any) => {
      const Tag = to ? 'a' : As || tag;
      return React.createElement(Tag, { ref, href: to, ...rest }, children);
    });
    Comp.displayName = `Styled_${tag}`;
    return Comp;
  };
  return {
    MegaNavHeader: styled('header'),
    MegaNav: styled('nav'),
    MegaNavContainer: styled('div'),
    MegaNavLogo: React.forwardRef(({ children, to, ...rest }: any, ref: any) => <a ref={ref} href={to} {...rest}>{children}</a>),
    LogoImage: (props: any) => <img {...props} />,
    MobileMenuButton: styled('button'),
    HamburgerIcon: styled('div'),
    MegaNavMenu: styled('div'),
    MegaNavList: styled('ul'),
    MegaNavItem: styled('li'),
    MegaNavTrigger: styled('button'),
    DropdownArrow: (props: any) => <svg data-testid="dropdown-arrow" {...props} />,
    MegaDropdown: ({ children, $active, ...rest }: any) => $active ? <div data-testid="mega-dropdown" {...rest}>{children}</div> : null,
    MegaDropdownContent: styled('div'),
    MegaFeatured: styled('div'),
    FeaturedList: styled('div'),
    FeaturedItem: styled('div'),
    FeaturedIcon: styled('span'),
    FeaturedText: styled('div'),
    FeaturedTitle: styled('strong'),
    FeaturedDesc: styled('small'),
    MegaCol: styled('div'),
    MegaLinks: styled('ul'),
    MegaCTA: styled('div'),
    MegaCTAContent: styled('div'),
    MegaNavActions: styled('div'),
    MegaNavLink: React.forwardRef(({ children, to, ...rest }: any, ref: any) => <a ref={ref} href={to} {...rest}>{children}</a>),
  };
});

const renderMegaNav = (props = {}) =>
  render(
    <MemoryRouter>
      <MegaNav {...props} />
    </MemoryRouter>,
  );

describe('MegaNav', () => {
  beforeEach(() => vi.clearAllMocks());

  // ─── Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      renderMegaNav();
      expect(screen.getByAltText('White Caves')).toBeInTheDocument();
    });

    it('renders company logo', () => {
      renderMegaNav();
      const logo = screen.getByAltText('White Caves');
      expect(logo).toHaveAttribute('src', '/company-logo.jpg');
    });

    it('renders ThemeToggle', () => {
      renderMegaNav();
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders UniversalProfile', () => {
      renderMegaNav();
      expect(screen.getByTestId('universal-profile')).toBeInTheDocument();
    });
  });

  // ─── Menu Items ────────────────────────────────────────
  describe('menu items', () => {
    it('renders Buy menu', () => {
      renderMegaNav();
      expect(screen.getByText('Buy')).toBeInTheDocument();
    });

    it('renders Rent menu', () => {
      renderMegaNav();
      expect(screen.getByText('Rent')).toBeInTheDocument();
    });

    it('renders Commercial menu', () => {
      renderMegaNav();
      expect(screen.getByText('Commercial')).toBeInTheDocument();
    });

    it('renders New Projects menu', () => {
      renderMegaNav();
      expect(screen.getByText('New Projects')).toBeInTheDocument();
    });
  });

  // ─── Simple Links ──────────────────────────────────────
  describe('simple links', () => {
    it('renders About link', () => {
      renderMegaNav();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders Services link', () => {
      renderMegaNav();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('renders Careers link', () => {
      renderMegaNav();
      expect(screen.getByText('Careers')).toBeInTheDocument();
    });

    it('renders Contact link', () => {
      renderMegaNav();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  // ─── Dropdown ─────────────────────────────────────────
  describe('dropdown interaction', () => {
    it('dropdown not visible by default', () => {
      renderMegaNav();
      expect(screen.queryByTestId('mega-dropdown')).not.toBeInTheDocument();
    });

    it('shows dropdown on hover', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByTestId('mega-dropdown')).toBeInTheDocument();
    });

    it('shows featured items in dropdown', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByText('New Listings')).toBeInTheDocument();
      expect(screen.getByText('Luxury Homes')).toBeInTheDocument();
    });

    it('shows locations in dropdown', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
      expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
    });

    it('shows property types in dropdown', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByText('Villas')).toBeInTheDocument();
      expect(screen.getByText('Apartments')).toBeInTheDocument();
    });

    it('closes dropdown on mouse leave', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByTestId('mega-dropdown')).toBeInTheDocument();
      fireEvent.mouseLeave(buyItem!);
      expect(screen.queryByTestId('mega-dropdown')).not.toBeInTheDocument();
    });

    it('shows CTA section in dropdown', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByText('Need Help Finding a Property?')).toBeInTheDocument();
    });
  });

  // ─── Different Menus ──────────────────────────────────
  describe('different menus content', () => {
    it('New Projects shows developers instead of property types', () => {
      renderMegaNav();
      const newProjects = screen.getByText('New Projects').closest('li');
      fireEvent.mouseEnter(newProjects!);
      expect(screen.getByText('Emaar')).toBeInTheDocument();
      expect(screen.getByText('DAMAC')).toBeInTheDocument();
    });

    it('New Projects shows payment plans', () => {
      renderMegaNav();
      const newProjects = screen.getByText('New Projects').closest('li');
      fireEvent.mouseEnter(newProjects!);
      expect(screen.getByText('10% Down')).toBeInTheDocument();
    });
  });

  // ─── Click Outside ────────────────────────────────────
  describe('click outside', () => {
    it('closes menu on document click outside', () => {
      renderMegaNav();
      const buyItem = screen.getByText('Buy').closest('li');
      fireEvent.mouseEnter(buyItem!);
      expect(screen.getByTestId('mega-dropdown')).toBeInTheDocument();
      fireEvent.mouseDown(document.body);
      expect(screen.queryByTestId('mega-dropdown')).not.toBeInTheDocument();
    });
  });
});
