/**
 * Footer Component Tests
 * Tests: rendering, brand/logo, contact info, quick links, property types,
 *        popular areas, social links, RERA/DLD badges, legal, app buttons
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

// Mock SocialLinks
vi.mock('./SocialLinks', () => ({
  default: () => <div data-testid="social-links">Social</div>,
}));

// Mock config
vi.mock('../config/constants', () => ({
  Config: {
    COMPANY: {
      PHONE: '+971 56 361 6136',
      WHATSAPP: '971563616136',
    },
  },
}));

// Mock all styled-components from Footer.styles
vi.mock('./Footer.styles', () => {
  const makeComp =
    (tag: string, testId?: string) =>
    ({ children, ...props }: any) => {
      const safeProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !key.startsWith('$'))
      );
      return React.createElement(tag, { 'data-testid': testId, ...safeProps }, children);
    };
  return {
    FooterContainer: makeComp('footer', 'footer'),
    FooterContent: makeComp('div'),
    FooterBrand: makeComp('div'),
    FooterLogo: (props: any) => <img {...props} />,
    FooterTagline: makeComp('p'),
    FooterContact: makeComp('div'),
    ContactIcon: makeComp('span'),
    FooterApps: makeComp('div'),
    AppsTitle: makeComp('p'),
    AppButtons: makeComp('div'),
    AppBtn: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    FooterSection: makeComp('div'),
    FooterRating: makeComp('div'),
    StarRatingFooter: makeComp('div'),
    FooterRERA: makeComp('div'),
    Badge: ({ children, type }: any) => <span data-testid={`badge-${type}`}>{children}</span>,
    FooterBottom: makeComp('div'),
    FooterBottomContent: makeComp('div'),
    FooterLegal: makeComp('div'),
  };
});

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      renderFooter();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders company logo', () => {
      renderFooter();
      const logo = screen.getByAltText('White Caves Real Estate LLC');
      expect(logo).toHaveAttribute('src', '/company-logo.jpg');
    });

    it('renders tagline', () => {
      renderFooter();
      expect(screen.getByText(/trusted partner in Dubai luxury real estate/)).toBeInTheDocument();
    });
  });

  // ─── Contact Info ──────────────────────────────────────
  describe('contact info', () => {
    it('shows office address', () => {
      renderFooter();
      expect(screen.getByText(/Office D-72/)).toBeInTheDocument();
    });

    it('shows office phone', () => {
      renderFooter();
      expect(screen.getByText(/\+971 4 335 0592/)).toBeInTheDocument();
    });

    it('shows mobile phone', () => {
      renderFooter();
      expect(screen.getByText(/\+971 56 361 6136/)).toBeInTheDocument();
    });

    it('shows email', () => {
      renderFooter();
      expect(screen.getByText(/admin@whitecaves.com/)).toBeInTheDocument();
    });

    it('shows website', () => {
      renderFooter();
      expect(screen.getByText(/www.whitecaves.com/)).toBeInTheDocument();
    });
  });

  // ─── Quick Links ──────────────────────────────────────
  describe('quick links', () => {
    it('renders Quick Links heading', () => {
      renderFooter();
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
    });

    it('renders Home link', () => {
      renderFooter();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders Properties link', () => {
      renderFooter();
      expect(screen.getByText('Properties')).toBeInTheDocument();
    });

    it('renders About Us link', () => {
      renderFooter();
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });

    it('renders Careers link', () => {
      renderFooter();
      expect(screen.getByText('Careers')).toBeInTheDocument();
    });
  });

  // ─── Property Types ────────────────────────────────────
  describe('property types', () => {
    it('renders Property Types heading', () => {
      renderFooter();
      expect(screen.getByText('Property Types')).toBeInTheDocument();
    });

    it('links to Villas', () => {
      renderFooter();
      expect(screen.getByText('Villas')).toBeInTheDocument();
    });

    it('links to Apartments', () => {
      renderFooter();
      expect(screen.getByText('Apartments')).toBeInTheDocument();
    });

    it('links to Penthouses', () => {
      renderFooter();
      expect(screen.getByText('Penthouses')).toBeInTheDocument();
    });
  });

  // ─── Popular Areas ─────────────────────────────────────
  describe('popular areas', () => {
    it('renders Popular Areas heading', () => {
      renderFooter();
      expect(screen.getByText('Popular Areas')).toBeInTheDocument();
    });

    it('lists Palm Jumeirah', () => {
      renderFooter();
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    });

    it('lists Dubai Marina', () => {
      renderFooter();
      expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
    });
  });

  // ─── Social & Badges ──────────────────────────────────
  describe('social and badges', () => {
    it('renders Connect With Us heading', () => {
      renderFooter();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
    });

    it('renders SocialLinks component', () => {
      renderFooter();
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
    });

    it('renders RERA badge', () => {
      renderFooter();
      expect(screen.getByTestId('badge-rera')).toHaveTextContent('RERA Licensed');
    });

    it('renders DLD badge', () => {
      renderFooter();
      expect(screen.getByTestId('badge-dld')).toHaveTextContent('Dubai Land Department Registered');
    });
  });

  // ─── App Buttons ───────────────────────────────────────
  describe('app buttons', () => {
    it('renders WhatsApp button', () => {
      renderFooter();
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });

    it('renders Botim button', () => {
      renderFooter();
      expect(screen.getByText('Botim')).toBeInTheDocument();
    });

    it('renders GoChat button', () => {
      renderFooter();
      expect(screen.getByText('GoChat')).toBeInTheDocument();
    });
  });

  // ─── Legal Section ─────────────────────────────────────
  describe('legal section', () => {
    it('renders copyright with current year', () => {
      renderFooter();
      const year = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
    });

    it('renders Privacy Policy link', () => {
      renderFooter();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('renders Terms of Service link', () => {
      renderFooter();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });
  });

  // ─── Review ────────────────────────────────────────────
  describe('review section', () => {
    it('renders review CTA', () => {
      renderFooter();
      expect(screen.getByText(/Leave us a review/)).toBeInTheDocument();
    });

    it('renders star rating', () => {
      renderFooter();
      expect(screen.getByText('★★★★★')).toBeInTheDocument();
    });
  });
});
