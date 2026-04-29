import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock SocialLinks
vi.mock('../SocialLinks', () => ({
  default: () => <div data-testid="social-links">SocialLinks</div>,
}));

// Mock Config
vi.mock('../../config/constants', () => ({
  Config: {
    COMPANY: {
      PHONE: '+971 56 361 6136',
      WHATSAPP: '971563616136',
    },
  },
}));

// Mock styled-components
vi.mock('../Footer.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, type, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$') && k !== 'type') clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    FooterContainer: c('footer', 'footer'),
    FooterContent: c('div', 'footer-content'),
    FooterBrand: c('div', 'footer-brand'),
    FooterLogo: c('img', 'footer-logo'),
    FooterTagline: c('p', 'footer-tagline'),
    FooterContact: c('div', 'footer-contact'),
    ContactIcon: c('span', 'contact-icon'),
    FooterApps: c('div', 'footer-apps'),
    AppsTitle: c('p', 'apps-title'),
    AppButtons: c('div', 'app-buttons'),
    AppBtn: c('a', 'app-btn'),
    FooterSection: c('div', 'footer-section'),
    FooterRating: c('div', 'footer-rating'),
    StarRatingFooter: c('div', 'star-rating'),
    FooterRERA: c('div', 'footer-rera'),
    Badge: c('span', 'badge'),
    FooterBottom: c('div', 'footer-bottom'),
    FooterBottomContent: c('div', 'footer-bottom-content'),
    FooterLegal: c('div', 'footer-legal'),
  };
});

import Footer from '../Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders the footer container', () => {
      renderFooter();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders the company logo', () => {
      renderFooter();
      expect(screen.getByAltText('White Caves Real Estate LLC')).toBeInTheDocument();
    });

    it('renders the tagline', () => {
      renderFooter();
      expect(screen.getByText(/Your trusted partner in Dubai luxury real estate since 2010/)).toBeInTheDocument();
    });
  });

  // ── Contact Information ────────────────────────────────────
  describe('contact information', () => {
    it('renders office address', () => {
      renderFooter();
      expect(screen.getByText(/Office D-72.*Port Saeed.*Dubai/)).toBeInTheDocument();
    });

    it('renders office phone', () => {
      renderFooter();
      expect(screen.getByText(/\+971 4 335 0592/)).toBeInTheDocument();
    });

    it('renders mobile phone from Config', () => {
      renderFooter();
      expect(screen.getByText(/\+971 56 361 6136/)).toBeInTheDocument();
    });

    it('renders email address', () => {
      renderFooter();
      expect(screen.getByText(/admin@whitecaves.com/)).toBeInTheDocument();
    });

    it('renders website URL', () => {
      renderFooter();
      expect(screen.getByText(/www.whitecaves.com/)).toBeInTheDocument();
    });
  });

  // ── Communication Apps ─────────────────────────────────────
  describe('communication apps', () => {
    it('renders "Contact us on:" title', () => {
      renderFooter();
      expect(screen.getByText('Contact us on:')).toBeInTheDocument();
    });

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

  // ── Quick Links ────────────────────────────────────────────
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

  // ── Property Types ─────────────────────────────────────────
  describe('property types', () => {
    it('renders Property Types heading', () => {
      renderFooter();
      expect(screen.getByText('Property Types')).toBeInTheDocument();
    });

    it('renders all property type links', () => {
      renderFooter();
      expect(screen.getByText('Villas')).toBeInTheDocument();
      expect(screen.getByText('Apartments')).toBeInTheDocument();
      expect(screen.getByText('Penthouses')).toBeInTheDocument();
      expect(screen.getByText('Townhouses')).toBeInTheDocument();
      expect(screen.getByText('Commercial')).toBeInTheDocument();
      expect(screen.getByText('Off-Plan')).toBeInTheDocument();
    });
  });

  // ── Popular Areas ──────────────────────────────────────────
  describe('popular areas', () => {
    it('renders Popular Areas heading', () => {
      renderFooter();
      expect(screen.getByText('Popular Areas')).toBeInTheDocument();
    });

    it('renders all popular area links', () => {
      renderFooter();
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
      expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
      expect(screen.getByText('Emirates Hills')).toBeInTheDocument();
      expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
      expect(screen.getByText('Jumeirah')).toBeInTheDocument();
      expect(screen.getByText('Business Bay')).toBeInTheDocument();
    });
  });

  // ── Social & Connect ──────────────────────────────────────
  describe('social and connect', () => {
    it('renders Connect With Us heading', () => {
      renderFooter();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
    });

    it('renders SocialLinks component', () => {
      renderFooter();
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
    });

    it('renders review CTA', () => {
      renderFooter();
      expect(screen.getByText(/Leave us a review/)).toBeInTheDocument();
    });

    it('renders star rating link', () => {
      renderFooter();
      expect(screen.getByText('★★★★★')).toBeInTheDocument();
    });
  });

  // ── Badges ─────────────────────────────────────────────────
  describe('badges', () => {
    it('renders RERA Licensed badge', () => {
      renderFooter();
      expect(screen.getByText('RERA Licensed')).toBeInTheDocument();
    });

    it('renders DLD Registered badge', () => {
      renderFooter();
      expect(screen.getByText('Dubai Land Department Registered')).toBeInTheDocument();
    });
  });

  // ── Footer Bottom ──────────────────────────────────────────
  describe('footer bottom', () => {
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
});
