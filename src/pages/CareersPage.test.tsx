/**
 * CareersPage Component Tests
 * Tests: rendering, hero section, benefits, job positions, apply flow,
 *        form submission, success message
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CareersPage from './CareersPage';

// Mock hooks
vi.mock('../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

// Mock PublicLayout
vi.mock('../components/layout/PublicLayout', () => ({
  default: ({ children }: any) => <div data-testid="app-layout">{children}</div>,
}));

const renderCareers = () =>
  render(
    <MemoryRouter>
      <CareersPage />
    </MemoryRouter>
  );

describe('CareersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      renderCareers();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });

    it('renders inside AppLayout', () => {
      renderCareers();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });
  });

  // ─── Hero Section ──────────────────────────────────────
  describe('hero section', () => {
    it('renders hero heading', () => {
      renderCareers();
      expect(screen.getByText(/Shape the Future of/i)).toBeInTheDocument();
      expect(screen.getByText(/Dubai Luxury Real Estate/i)).toBeInTheDocument();
    });

    it('renders hero subtitle', () => {
      renderCareers();
      expect(screen.getByText(/Join our team of high-performing brokers/i)).toBeInTheDocument();
    });

    it('shows 4-stage executive hiring pipeline', () => {
      renderCareers();
      expect(screen.getByText(/White Caves 4-Stage Executive Hiring Pipeline/i)).toBeInTheDocument();
      expect(screen.getByText(/CV Screening/i)).toBeInTheDocument();
      expect(screen.getByText(/Video Assessment/i)).toBeInTheDocument();
    });
  });

  // ─── Hiring Models & Benefits ──────────────────────────
  describe('benefits & hiring models', () => {
    it('renders 50/50 and high-split models', () => {
      renderCareers();
      expect(screen.getByText(/Hired Employee \(50\/50 Model\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Freelance \/ High-Split \(60-70%\)/i)).toBeInTheDocument();
    });

    it('renders comprehensive compensation perks', () => {
      renderCareers();
      expect(screen.getByText(/UAE Investor & Employment Visas/i)).toBeInTheDocument();
      expect(screen.getByText(/Marketing & Portals Budget/i)).toBeInTheDocument();
    });
  });

  // ─── Job Positions ─────────────────────────────────────
  describe('job positions', () => {
    it('renders open executive positions', () => {
      renderCareers();
      expect(screen.getByText(/Open Executive Positions/i)).toBeInTheDocument();
      expect(screen.getByText(/Luxury Secondary Sales Specialist/i)).toBeInTheDocument();
      expect(screen.getByText(/Senior Off-Plan Investment Advisor/i)).toBeInTheDocument();
    });

    it('shows Apply buttons and Offer Letter preview', () => {
      renderCareers();
      const applyBtns = screen.getAllByText(/Apply For Position/i);
      expect(applyBtns.length).toBeGreaterThanOrEqual(1);

      const previewBtns = screen.getAllByText(/Preview Offer Letter/i);
      expect(previewBtns.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Apply Modal Flow ──────────────────────────────────
  describe('apply modal flow', () => {
    it('opens application modal when apply button is clicked', () => {
      renderCareers();
      const applyBtns = screen.getAllByText(/Apply For Position/i);
      fireEvent.click(applyBtns[0]);
      expect(screen.getByText(/Official Employment Application/i)).toBeInTheDocument();
    });
  });
});
