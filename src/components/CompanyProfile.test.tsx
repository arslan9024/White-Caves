/**
 * CompanyProfile.tsx — Comprehensive Unit Tests
 * Batch 37 | Company profile section with PDF download
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */
vi.mock('./CompanyProfile.styles', () => ({
  CompanyProfileSection: ({ children, ...p }: any) => (
    <section data-testid="profile-section" {...p}>
      {children}
    </section>
  ),
  CompanyProfileContainer: ({ children }: any) => (
    <div data-testid="profile-container">{children}</div>
  ),
  CompanyProfileHeader: ({ children }: any) => <div data-testid="profile-header">{children}</div>,
  CompanyLogoLarge: (p: any) => <img data-testid="company-logo" {...p} />,
  CompanyProfileTitle: ({ children }: any) => <div data-testid="profile-title">{children}</div>,
  CompanyTagline: ({ children }: any) => <span data-testid="tagline">{children}</span>,
  CompanyProfileGrid: ({ children }: any) => <div data-testid="profile-grid">{children}</div>,
  ProfileCard: ({ children }: any) => <div data-testid="profile-card">{children}</div>,
  ProfileCardIcon: ({ children }: any) => <span data-testid="card-icon">{children}</span>,
  CompanyServicesOverview: ({ children }: any) => (
    <div data-testid="services-overview">{children}</div>
  ),
  ServicesList: ({ children }: any) => <ul data-testid="services-list">{children}</ul>,
  ServiceItem: ({ children }: any) => <li data-testid="service-item">{children}</li>,
  ServiceIcon: ({ children }: any) => <span>{children}</span>,
  CompanyStatsBar: ({ children }: any) => <div data-testid="stats-bar">{children}</div>,
  StatBlock: ({ children }: any) => <div data-testid="stat-block">{children}</div>,
  StatNumber: ({ children }: any) => <span data-testid="stat-number">{children}</span>,
  StatLabel: ({ children }: any) => <span data-testid="stat-label">{children}</span>,
  CompanyContactInfo: ({ children }: any) => <div data-testid="contact-info">{children}</div>,
  ContactGrid: ({ children }: any) => <div data-testid="contact-grid">{children}</div>,
  ContactItem: ({ children }: any) => <div data-testid="contact-item">{children}</div>,
  ContactIcon: ({ children }: any) => <span>{children}</span>,
  CompanyProfileCTA: ({ children }: any) => <div data-testid="cta">{children}</div>,
  DownloadProfileBtn: ({ children, onClick, ...p }: any) => (
    <button data-testid="download-btn" onClick={onClick} {...p}>
      {children}
    </button>
  ),
  DownloadHint: ({ children }: any) => <span data-testid="download-hint">{children}</span>,
}));

import CompanyProfile from './CompanyProfile';

/* ── Tests ──────────────────────────────────────────────── */
describe('CompanyProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  // ─────────────── Rendering ───────────────
  describe('rendering', () => {
    it('renders profile section', () => {
      render(<CompanyProfile />);
      expect(screen.getByTestId('profile-section')).toBeInTheDocument();
    });

    it('renders company name', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('White Caves Real Estate LLC')).toBeInTheDocument();
    });

    it('renders tagline', () => {
      render(<CompanyProfile />);
      expect(screen.getByText("Dubai's Premier Luxury Property Partner")).toBeInTheDocument();
    });

    it('renders company logo', () => {
      render(<CompanyProfile />);
      expect(screen.getByTestId('company-logo')).toBeInTheDocument();
    });

    it('renders all 4 profile cards', () => {
      render(<CompanyProfile />);
      const cards = screen.getAllByTestId('profile-card');
      expect(cards).toHaveLength(4);
    });

    it('shows Who We Are card', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Who We Are')).toBeInTheDocument();
    });

    it('shows Our Mission card', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
    });

    it('shows Our Vision card', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Our Vision')).toBeInTheDocument();
    });

    it('shows RERA Licensed card', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('RERA Licensed')).toBeInTheDocument();
    });
  });

  // ─────────────── Services ───────────────
  describe('services', () => {
    it('renders services section', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Our Services')).toBeInTheDocument();
    });

    it('lists all 8 services', () => {
      render(<CompanyProfile />);
      const items = screen.getAllByTestId('service-item');
      expect(items).toHaveLength(8);
    });

    it('includes Property Sales', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Property Sales & Purchases')).toBeInTheDocument();
    });

    it('includes Investment Advisory', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Investment Advisory')).toBeInTheDocument();
    });
  });

  // ─────────────── Stats ───────────────
  describe('stats', () => {
    it('renders stats bar', () => {
      render(<CompanyProfile />);
      expect(screen.getByTestId('stats-bar')).toBeInTheDocument();
    });

    it('shows 4 stat blocks', () => {
      render(<CompanyProfile />);
      expect(screen.getAllByTestId('stat-block')).toHaveLength(4);
    });

    it('displays 500+ properties', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('Properties Listed')).toBeInTheDocument();
    });

    it('displays 1000+ clients', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('Happy Clients')).toBeInTheDocument();
    });

    it('displays 15+ years', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('15+')).toBeInTheDocument();
      expect(screen.getByText('Years Experience')).toBeInTheDocument();
    });

    it('displays 50+ agents', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('Expert Agents')).toBeInTheDocument();
    });
  });

  // ─────────────── Contact Info ───────────────
  describe('contact info', () => {
    it('renders contact section', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });

    it('shows head office address', () => {
      render(<CompanyProfile />);
      expect(screen.getByText(/Office D-72.*Port Saeed/)).toBeInTheDocument();
    });

    it('shows phone number', () => {
      render(<CompanyProfile />);
      const phones = screen.getAllByText('+971-56-361-6136');
      expect(phones.length).toBeGreaterThanOrEqual(1);
    });

    it('shows email address', () => {
      render(<CompanyProfile />);
      expect(screen.getByText('admin@whitecaves.com')).toBeInTheDocument();
    });
  });

  // ─────────────── PDF Download ───────────────
  describe('PDF download', () => {
    it('renders download button', () => {
      render(<CompanyProfile />);
      expect(screen.getByTestId('download-btn')).toBeInTheDocument();
    });

    it('calls fetch with HEAD method on click', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', mockFetch);

      render(<CompanyProfile />);
      fireEvent.click(screen.getByTestId('download-btn'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('White-Caves-Company-Profile.pdf'),
          { method: 'HEAD' }
        );
      });
    });

    it('shows error banner when PDF not found (response.ok=false)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false });
      vi.stubGlobal('fetch', mockFetch);

      render(<CompanyProfile />);
      fireEvent.click(screen.getByTestId('download-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(screen.getByRole('alert')).toHaveTextContent('not available');
    });

    it('shows error banner on network error', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      render(<CompanyProfile />);
      fireEvent.click(screen.getByTestId('download-btn'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to download');
    });

    it('creates anchor element and triggers download on success', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', mockFetch);

      // Render FIRST so React can create DOM elements normally
      render(<CompanyProfile />);

      // Now mock createElement AFTER render, before click
      const clickSpy = vi.fn();
      const origCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
          return { href: '', download: '', target: '', click: clickSpy, tagName: 'A' } as any;
        }
        return origCreateElement(tag);
      });
      vi.spyOn(document.body, 'appendChild').mockImplementation((el: any) => el);
      vi.spyOn(document.body, 'removeChild').mockImplementation((el: any) => el);

      fireEvent.click(screen.getByTestId('download-btn'));

      await waitFor(() => {
        expect(clickSpy).toHaveBeenCalled();
      });

      vi.restoreAllMocks();
    });
  });
});
