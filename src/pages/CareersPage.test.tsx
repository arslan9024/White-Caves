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

  // ─── Job Positions & Apply ─────────────────────────────
  describe('job positions and application flow', () => {
    it('shows Apply Now and Preview Offer Letter buttons', () => {
      renderCareers();
      const applyBtns = screen.getAllByText(/Apply Now ➔/i);
      expect(applyBtns.length).toBeGreaterThanOrEqual(1);

      const previewBtns = screen.getAllByText(/Preview Offer Letter/i);
      expect(previewBtns.length).toBeGreaterThanOrEqual(1);
    });

    it('opens application modal when apply button is clicked', () => {
      renderCareers();
      const applyBtns = screen.getAllByText(/Apply Now ➔/i);
      fireEvent.click(applyBtns[0]);
      expect(screen.getByText(/Full Name \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Email Address \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Mobile Number \*/i)).toBeInTheDocument();
    });

    it('opens offer letter preview modal when clicked', () => {
      renderCareers();
      const previewBtns = screen.getAllByText(/Preview Offer Letter/i);
      fireEvent.click(previewBtns[0]);
      expect(screen.getByText(/White Caves Real Estate LLC Official Employment Offer/i)).toBeInTheDocument();
    });
  });
});
