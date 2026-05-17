/**
 * AboutPage.test.tsx — Batch 27
 * Tests for AboutPage component
 * Covers: rendering, hero section, team, milestones, stats, awards, layout
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock dependencies
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Link: ({ children, to, ...rest }: any) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../components/layout/PublicLayout', () => ({
  default: ({ children, ...rest }: any) => (
    <div data-testid="public-layout" {...rest}>
      {children}
    </div>
  ),
}));

vi.mock('../../components/WhatsAppButton', () => ({
  default: () => <div data-testid="whatsapp-button">WhatsApp</div>,
}));

vi.mock('../../pages/AboutPage.css', () => ({}));

import AboutPage from '../../pages/AboutPage';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

describe('AboutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── RENDERING ─────────────────────────────────────────────
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<AboutPage />);
      expect(screen.getByText('About White Caves')).toBeInTheDocument();
    });

    it('wraps in PublicLayout', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('public-layout')).toBeInTheDocument();
    });

    it('sets document title', () => {
      render(<AboutPage />);
      expect(useDocumentTitle).toHaveBeenCalledWith('About Us');
    });

    it('renders WhatsAppButton', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('whatsapp-button')).toBeInTheDocument();
    });
  });

  // ─── HERO SECTION ──────────────────────────────────────────
  describe('Hero Section', () => {
    it('renders hero heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('About White Caves')).toBeInTheDocument();
    });

    it('renders hero subtitle', () => {
      render(<AboutPage />);
      expect(
        screen.getByText(
          "Dubai's Premier Luxury Real Estate Agency — trusted by clients since 2009"
        )
      ).toBeInTheDocument();
    });
  });

  // ─── INTRO SECTION ─────────────────────────────────────────
  describe('Intro Section', () => {
    it('renders intro heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('Your Gateway to Luxury Living in Dubai')).toBeInTheDocument();
    });

    it('renders company description', () => {
      render(<AboutPage />);
      expect(screen.getByText(/White Caves Real Estate LLC is a leading/)).toBeInTheDocument();
    });

    it('renders office image', () => {
      render(<AboutPage />);
      const img = screen.getByAltText('White Caves Office');
      expect(img).toBeInTheDocument();
    });
  });

  // ─── STATS ─────────────────────────────────────────────────
  describe('Stats', () => {
    it('renders 500+ Properties Sold', () => {
      render(<AboutPage />);
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('Properties Sold')).toBeInTheDocument();
    });

    it('renders 1000+ Happy Clients', () => {
      render(<AboutPage />);
      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('Happy Clients')).toBeInTheDocument();
    });

    it('renders 15+ Years Experience', () => {
      render(<AboutPage />);
      expect(screen.getAllByText('15+').length).toBeGreaterThan(0);
      expect(screen.getByText('Years Experience')).toBeInTheDocument();
    });

    it('renders 50+ Expert Agents', () => {
      render(<AboutPage />);
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('Expert Agents')).toBeInTheDocument();
    });
  });

  // ─── TEAM SECTION ──────────────────────────────────────────
  describe('Team Section', () => {
    it('renders team section title', () => {
      render(<AboutPage />);
      expect(screen.getByText('Meet Our Team')).toBeInTheDocument();
    });

    it('renders team subtitle', () => {
      render(<AboutPage />);
      expect(
        screen.getByText('Expert professionals dedicated to your success')
      ).toBeInTheDocument();
    });

    it('renders all 4 team members', () => {
      render(<AboutPage />);
      expect(screen.getByText('Ahmed Al Rashid')).toBeInTheDocument();
      expect(screen.getByText('Sarah Thompson')).toBeInTheDocument();
      expect(screen.getByText('Mohammed Hassan')).toBeInTheDocument();
      expect(screen.getByText('Elena Rodriguez')).toBeInTheDocument();
    });

    it('renders team member roles', () => {
      render(<AboutPage />);
      expect(screen.getAllByText('CEO & Founder').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Head of Sales').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Senior Property Consultant').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Marketing Director').length).toBeGreaterThan(0);
    });

    it('renders team member bios', () => {
      render(<AboutPage />);
      expect(
        screen.getByText('20+ years experience in Dubai real estate market')
      ).toBeInTheDocument();
      expect(screen.getByText('Specializing in luxury villa transactions')).toBeInTheDocument();
    });

    it('renders team member images with alt text', () => {
      render(<AboutPage />);
      expect(screen.getByAltText('Ahmed Al Rashid')).toBeInTheDocument();
      expect(screen.getByAltText('Sarah Thompson')).toBeInTheDocument();
      expect(screen.getByAltText('Mohammed Hassan')).toBeInTheDocument();
      expect(screen.getByAltText('Elena Rodriguez')).toBeInTheDocument();
    });
  });

  // ─── MILESTONES SECTION ────────────────────────────────────
  describe('Milestones Section', () => {
    it('renders journey section title', () => {
      render(<AboutPage />);
      expect(screen.getByText('Our Journey')).toBeInTheDocument();
    });

    it('renders all 6 milestones', () => {
      render(<AboutPage />);
      expect(screen.getByText('2009')).toBeInTheDocument();
      expect(screen.getByText('2012')).toBeInTheDocument();
      expect(screen.getByText('2015')).toBeInTheDocument();
      expect(screen.getByText('2018')).toBeInTheDocument();
      expect(screen.getByText('2021')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('renders milestone titles', () => {
      render(<AboutPage />);
      expect(screen.getByText('Company Founded')).toBeInTheDocument();
      expect(screen.getByText('100th Property Sold')).toBeInTheDocument();
      expect(screen.getByText('Expanded to Abu Dhabi')).toBeInTheDocument();
      expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
      expect(screen.getByText('Market Leader')).toBeInTheDocument();
    });

    it('renders milestone descriptions', () => {
      render(<AboutPage />);
      expect(screen.getByText('Started as a boutique agency in Dubai Marina')).toBeInTheDocument();
      expect(screen.getByText('Reached our first major milestone')).toBeInTheDocument();
      expect(screen.getByText('Opened our second office in the capital')).toBeInTheDocument();
    });
  });
});
