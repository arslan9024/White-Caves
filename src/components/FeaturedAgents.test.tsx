/**
 * FeaturedAgents.tsx — Comprehensive Unit Tests
 * Batch 37 | Featured real estate agents grid
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */
vi.mock('./FeaturedAgents.styles', () => ({
  StyledFeaturedAgentsSection: ({ children }: any) => <section data-testid="agents-section">{children}</section>,
  StyledAgentsTitle: ({ children }: any) => <h2 data-testid="agents-title">{children}</h2>,
  StyledAgentsGrid: ({ children }: any) => <div data-testid="agents-grid">{children}</div>,
  StyledAgentCard: ({ children }: any) => <div data-testid="agent-card">{children}</div>,
  StyledAgentPhoto: (props: any) => <img data-testid="agent-photo" {...props} />,
  StyledAgentName: ({ children }: any) => <h3 data-testid="agent-name">{children}</h3>,
  StyledSpecialization: ({ children }: any) => <span data-testid="specialization">{children}</span>,
  StyledExperience: ({ children }: any) => <span data-testid="experience">{children}</span>,
  StyledLanguagesContainer: ({ children }: any) => <div data-testid="languages">{children}</div>,
  StyledLanguageTag: ({ children }: any) => <span data-testid="language-tag">{children}</span>,
  StyledContactAgentButton: ({ children }: any) => <button data-testid="contact-btn">{children}</button>,
}));

import FeaturedAgents from './FeaturedAgents';

/* ── Tests ──────────────────────────────────────────────── */
describe('FeaturedAgents', () => {
  // ─────────────── Rendering ───────────────
  describe('rendering', () => {
    it('renders agents section', () => {
      render(<FeaturedAgents />);
      expect(screen.getByTestId('agents-section')).toBeInTheDocument();
    });

    it('shows title "Meet Our Expert Agents"', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Meet Our Expert Agents')).toBeInTheDocument();
    });

    it('renders exactly 3 agent cards', () => {
      render(<FeaturedAgents />);
      expect(screen.getAllByTestId('agent-card')).toHaveLength(3);
    });
  });

  // ─────────────── Agent 1: Sarah Ahmed ───────────────
  describe('Sarah Ahmed', () => {
    it('shows name', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Sarah Ahmed')).toBeInTheDocument();
    });

    it('shows specialization', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Luxury Villas')).toBeInTheDocument();
    });

    it('shows experience', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('8 years experience')).toBeInTheDocument();
    });

    it('shows languages', () => {
      render(<FeaturedAgents />);
      const englishTags = screen.getAllByText('English');
      expect(englishTags.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('French')).toBeInTheDocument();
    });

    it('renders photo with alt text', () => {
      render(<FeaturedAgents />);
      const photos = screen.getAllByTestId('agent-photo');
      const sarahPhoto = photos.find((p) => p.getAttribute('alt') === 'Sarah Ahmed');
      expect(sarahPhoto).toBeTruthy();
      expect(sarahPhoto?.getAttribute('src')).toContain('unsplash.com');
    });
  });

  // ─────────────── Agent 2: Mohammed Al-Rashid ───────────────
  describe('Mohammed Al-Rashid', () => {
    it('shows name', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Mohammed Al-Rashid')).toBeInTheDocument();
    });

    it('shows specialization', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Off-Plan Properties')).toBeInTheDocument();
    });

    it('shows experience', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('10 years experience')).toBeInTheDocument();
    });

    it('shows Hindi language', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Hindi')).toBeInTheDocument();
    });
  });

  // ─────────────── Agent 3: Elena Petrov ───────────────
  describe('Elena Petrov', () => {
    it('shows name', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Elena Petrov')).toBeInTheDocument();
    });

    it('shows specialization', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Commercial Real Estate')).toBeInTheDocument();
    });

    it('shows experience', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('6 years experience')).toBeInTheDocument();
    });

    it('shows Russian and German languages', () => {
      render(<FeaturedAgents />);
      expect(screen.getByText('Russian')).toBeInTheDocument();
      expect(screen.getByText('German')).toBeInTheDocument();
    });
  });

  // ─────────────── Language Tags ───────────────
  describe('language tags', () => {
    it('renders correct total number of language tags', () => {
      render(<FeaturedAgents />);
      // Sarah: 3, Mohammed: 3, Elena: 3 = 9 total
      expect(screen.getAllByTestId('language-tag')).toHaveLength(9);
    });

    it('shares Arabic language across agents', () => {
      render(<FeaturedAgents />);
      const arabicTags = screen.getAllByText('Arabic');
      expect(arabicTags).toHaveLength(2); // Sarah + Mohammed
    });
  });

  // ─────────────── Contact Buttons ───────────────
  describe('contact buttons', () => {
    it('renders 3 contact buttons', () => {
      render(<FeaturedAgents />);
      expect(screen.getAllByTestId('contact-btn')).toHaveLength(3);
    });

    it('buttons say "Contact Agent"', () => {
      render(<FeaturedAgents />);
      const buttons = screen.getAllByText('Contact Agent');
      expect(buttons).toHaveLength(3);
    });
  });

  // ─────────────── Photos ───────────────
  describe('photos', () => {
    it('renders 3 agent photos', () => {
      render(<FeaturedAgents />);
      expect(screen.getAllByTestId('agent-photo')).toHaveLength(3);
    });

    it('all photos have unsplash URLs', () => {
      render(<FeaturedAgents />);
      const photos = screen.getAllByTestId('agent-photo');
      photos.forEach((photo) => {
        expect(photo.getAttribute('src')).toContain('unsplash.com');
      });
    });
  });
});
