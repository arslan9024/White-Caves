import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock ThemeContext
const mockSetIsDark = vi.fn();
vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, setIsDark: mockSetIsDark }),
}));

// Mock safeStorage
vi.mock('../../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn().mockReturnValue(null),
    getJSON: vi.fn().mockReturnValue(null),
    set: vi.fn(),
    setJSON: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock navigation config
vi.mock('../../config/navigation', () => ({
  PUBLIC_NAV: {
    buy: [
      { path: '/properties?type=buy', label: 'Buy Property', icon: '🏠' },
      { path: '/properties?type=luxury', label: 'Luxury Homes', icon: '✨' },
    ],
    rent: [
      { path: '/properties?type=rent', label: 'Rent Property', icon: '🔑' },
    ],
    sell: [
      { path: '/sell', label: 'List Property', icon: '📋' },
    ],
  },
  ROLE_NAV: {
    buyer: {
      label: 'Dashboard',
      icon: '🏠',
      links: [
        { path: '/buyer/dashboard', label: 'My Dashboard', icon: '📊' },
        { path: '/buyer/favorites', label: 'Favorites', icon: '❤️' },
      ],
    },
  },
  getRoleCategory: vi.fn().mockReturnValue('client'),
}));

// Mock styled-components
vi.mock('../MobileNav.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    MobileNavOverlay: c('div', 'mobile-nav-overlay'),
    MobileNavContainer: c('div', 'mobile-nav-container'),
    MobileNavHeader: c('div', 'mobile-nav-header'),
    MobileNavLogo: c('img', 'mobile-nav-logo'),
    CloseButton: c('button', 'close-button'),
    MobileNavContent: c('div', 'mobile-nav-content'),
    MobileHomeButton: c('button', 'home-button'),
    MobileNavSection: c('div', 'mobile-nav-section'),
    SectionToggle: c('button', 'section-toggle'),
    ToggleIcon: c('span', 'toggle-icon'),
    SectionLinks: c('div', 'section-links'),
    SectionLink: c('button', 'section-link'),
    MobileNavFooter: c('div', 'mobile-nav-footer'),
    FooterButton: c('button', 'footer-button'),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock Redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (fn: any) => fn({
      user: { currentUser: null },
    }),
  };
});

import MobileNav from '../MobileNav';

const defaultProps = { isOpen: true, onClose: vi.fn() };

const renderMobileNav = (props = {}) =>
  render(
    <MemoryRouter>
      <MobileNav {...defaultProps} {...props} />
    </MemoryRouter>
  );

describe('MobileNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders overlay and container', () => {
      renderMobileNav();
      expect(screen.getByTestId('mobile-nav-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-container')).toBeInTheDocument();
    });

    it('renders the company logo', () => {
      renderMobileNav();
      expect(screen.getByAltText('White Caves')).toBeInTheDocument();
    });

    it('renders close button', () => {
      renderMobileNav();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('renders Home button', () => {
      renderMobileNav();
      expect(screen.getByText(/Home/)).toBeInTheDocument();
    });
  });

  // ── Expandable Sections ────────────────────────────────────
  describe('expandable sections', () => {
    it('renders Explore section toggle', () => {
      renderMobileNav();
      expect(screen.getByText(/Explore/)).toBeInTheDocument();
    });

    it('renders Rent section toggle', () => {
      renderMobileNav();
      expect(screen.getByText(/Rent/)).toBeInTheDocument();
    });

    it('renders Sell section toggle', () => {
      renderMobileNav();
      expect(screen.getByText(/Sell/)).toBeInTheDocument();
    });

    it('expands Explore section on click', () => {
      renderMobileNav();
      const exploreToggle = screen.getByText(/Explore/).closest('[data-testid="section-toggle"]');
      fireEvent.click(exploreToggle!);
      expect(screen.getByText('Buy Property')).toBeInTheDocument();
      expect(screen.getByText('Luxury Homes')).toBeInTheDocument();
    });

    it('expands Rent section on click', () => {
      renderMobileNav();
      const rentToggle = screen.getByText(/Rent/).closest('[data-testid="section-toggle"]');
      fireEvent.click(rentToggle!);
      expect(screen.getByText('Rent Property')).toBeInTheDocument();
    });

    it('collapses expanded section on second click', () => {
      renderMobileNav();
      const exploreToggle = screen.getByText(/Explore/).closest('[data-testid="section-toggle"]');
      fireEvent.click(exploreToggle!);
      expect(screen.getByText('Buy Property')).toBeInTheDocument();
      fireEvent.click(exploreToggle!);
      expect(screen.queryByText('Buy Property')).not.toBeInTheDocument();
    });

    it('sets aria-expanded correctly', () => {
      renderMobileNav();
      const exploreToggle = screen.getByText(/Explore/).closest('[data-testid="section-toggle"]');
      expect(exploreToggle).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(exploreToggle!);
      expect(exploreToggle).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // ── Static Links ───────────────────────────────────────────
  describe('static links', () => {
    it('renders Properties link', () => {
      renderMobileNav();
      expect(screen.getByText(/Properties/)).toBeInTheDocument();
    });

    it('renders About Us link', () => {
      renderMobileNav();
      expect(screen.getByText(/About Us/)).toBeInTheDocument();
    });

    it('renders Services link', () => {
      renderMobileNav();
      expect(screen.getByText(/Services/)).toBeInTheDocument();
    });

    it('renders Careers link', () => {
      renderMobileNav();
      expect(screen.getByText(/Careers/)).toBeInTheDocument();
    });

    it('renders Contact Us link', () => {
      renderMobileNav();
      expect(screen.getByText(/Contact Us/)).toBeInTheDocument();
    });
  });

  // ── Navigation ─────────────────────────────────────────────
  describe('navigation', () => {
    it('navigates to home on Home button click', () => {
      renderMobileNav();
      fireEvent.click(screen.getByText(/Home/));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('calls onClose after navigation', () => {
      const onClose = vi.fn();
      renderMobileNav({ onClose });
      fireEvent.click(screen.getByText(/Properties/));
      expect(mockNavigate).toHaveBeenCalledWith('/properties');
      expect(onClose).toHaveBeenCalled();
    });

    it('navigates to About Us', () => {
      renderMobileNav();
      fireEvent.click(screen.getByText(/About Us/));
      expect(mockNavigate).toHaveBeenCalledWith('/about');
    });

    it('calls onClose when overlay is clicked', () => {
      const onClose = vi.fn();
      renderMobileNav({ onClose });
      fireEvent.click(screen.getByTestId('mobile-nav-overlay'));
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      renderMobileNav({ onClose });
      fireEvent.click(screen.getByTestId('close-button'));
      expect(onClose).toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside container', () => {
      const onClose = vi.fn();
      renderMobileNav({ onClose });
      fireEvent.click(screen.getByTestId('mobile-nav-container'));
      // stopPropagation — onClose not triggered from container click
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ── Footer ─────────────────────────────────────────────────
  describe('footer', () => {
    it('renders theme toggle as Dark Mode when light', () => {
      renderMobileNav();
      expect(screen.getByText(/Dark Mode/)).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
      renderMobileNav();
      fireEvent.click(screen.getByText(/Dark Mode/));
      expect(mockSetIsDark).toHaveBeenCalledWith(true);
    });

    it('shows Sign In button when no user', () => {
      renderMobileNav();
      expect(screen.getByText(/Sign In/)).toBeInTheDocument();
    });

    it('navigates to /signin on Sign In click', () => {
      renderMobileNav();
      fireEvent.click(screen.getByText(/Sign In/));
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  // ── Section Link Navigation ────────────────────────────────
  describe('section link navigation', () => {
    it('navigates to expanded section link on click', () => {
      renderMobileNav();
      const sellToggle = screen.getByText(/Sell/).closest('[data-testid="section-toggle"]');
      fireEvent.click(sellToggle!);
      fireEvent.click(screen.getByText('List Property'));
      expect(mockNavigate).toHaveBeenCalledWith('/sell');
    });
  });
});
