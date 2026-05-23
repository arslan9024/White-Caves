/**
 * NeighborhoodAnalyzer – comprehensive test suite
 * Covers rendering, area selection, metrics, insights, risks
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NeighborhoodAnalyzer from './NeighborhoodAnalyzer';

/* ── Mock styled-components ──────────────────────────────────── */
vi.mock('./NeighborhoodAnalyzer.styles', () => {
  const el = (name: string) => {
    const C = ({ children, onClick, className, style, ...rest }: any) => (
      <div data-testid={name} onClick={onClick} className={className} style={style}>{children}</div>
    );
    C.displayName = name;
    return C;
  };
  const btn = (name: string) => {
    const C = ({ children, onClick, ...rest }: any) => (
      <button data-testid={name} onClick={onClick}>{children}</button>
    );
    C.displayName = name;
    return C;
  };
  return {
    NeighborhoodAnalyzerContainer: el('NeighborhoodAnalyzerContainer'),
    AnalyzerHeader: el('AnalyzerHeader'),
    AnalyzerTitle: el('AnalyzerTitle'),
    AnalyzerSubtitle: el('AnalyzerSubtitle'),
    AreaSelector: el('AreaSelector'),
    AreaButton: btn('AreaButton'),
    AnalyzerContent: el('AnalyzerContent'),
    AreaHero: el('AreaHero'),
    HeroOverlay: el('HeroOverlay'),
    HeroContent: el('HeroContent'),
    HeroTitle: el('HeroTitle'),
    HeroDescription: el('HeroDescription'),
    HeroBadges: el('HeroBadges'),
    Badge: el('Badge'),
    MetricsGrid: el('MetricsGrid'),
    MetricCard: el('MetricCard'),
    MetricLabel: el('MetricLabel'),
    MetricValue: el('MetricValue'),
    InsightsSection: el('InsightsSection'),
    InsightsTitle: el('InsightsTitle'),
    InsightsList: el('InsightsList'),
    InsightItem: el('InsightItem'),
    RisksSection: el('RisksSection'),
    RisksTitle: el('RisksTitle'),
    RisksList: el('RisksList'),
    RiskItem: el('RiskItem'),
    SectionDivider: el('SectionDivider'),
  };
});

describe('NeighborhoodAnalyzer', () => {
  /* ── Default rendering (Dubai Marina) ───────────────────────── */
  describe('default rendering', () => {
    it('renders title', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('Neighborhood Intelligence')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('Make informed investment decisions with comprehensive area analytics')).toBeInTheDocument();
    });

    it('renders all 3 area buttons', () => {
      render(<NeighborhoodAnalyzer />);
      // Names appear in both area buttons and hero—use getAllByText
      expect(screen.getAllByText('Dubai Marina').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Downtown Dubai').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Palm Jumeirah').length).toBeGreaterThanOrEqual(1);
    });

    it('renders Dubai Marina hero content by default', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('Premier waterfront community with stunning marina views and world-class amenities.')).toBeInTheDocument();
    });

    it('renders score badge', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('Score: 92/100')).toBeInTheDocument();
    });

    it('renders investment grade badge', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('A+')).toBeInTheDocument();
    });
  });

  /* ── Metrics ────────────────────────────────────────────────── */
  describe('metrics', () => {
    it('renders average price for Dubai Marina', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('AED 1.9M')).toBeInTheDocument();
    });

    it('renders price per sqft', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('AED 1650')).toBeInTheDocument();
    });

    it('renders rental yield', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('6.8%')).toBeInTheDocument();
    });

    it('renders appreciation', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('8.5%')).toBeInTheDocument();
    });

    it('renders population', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('45K')).toBeInTheDocument();
    });

    it('renders walkability', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('88%')).toBeInTheDocument();
    });
  });

  /* ── Insights ───────────────────────────────────────────────── */
  describe('insights', () => {
    it('renders Investment Insights heading', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('Investment Insights')).toBeInTheDocument();
    });

    it('renders insight items for Dubai Marina', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText(/High demand from young professionals/)).toBeInTheDocument();
      expect(screen.getByText(/Strong rental market/)).toBeInTheDocument();
    });
  });

  /* ── Risks ──────────────────────────────────────────────────── */
  describe('risks', () => {
    it('renders Considerations heading', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText('Considerations')).toBeInTheDocument();
    });

    it('renders risk items for Dubai Marina', () => {
      render(<NeighborhoodAnalyzer />);
      expect(screen.getByText(/High competition/)).toBeInTheDocument();
      expect(screen.getByText(/Market saturation/)).toBeInTheDocument();
    });
  });

  /* ── Area selection ─────────────────────────────────────────── */
  describe('area selection', () => {
    it('switches to Downtown Dubai', () => {
      render(<NeighborhoodAnalyzer />);
      fireEvent.click(screen.getByText('Downtown Dubai'));
      expect(screen.getByText('Iconic district home to Burj Khalifa and Dubai Mall, representing ultimate luxury.')).toBeInTheDocument();
      expect(screen.getByText('Score: 95/100')).toBeInTheDocument();
    });

    it('switches to Palm Jumeirah', () => {
      render(<NeighborhoodAnalyzer />);
      fireEvent.click(screen.getByText('Palm Jumeirah'));
      expect(screen.getByText('World-famous man-made island offering exclusive beachfront living.')).toBeInTheDocument();
      expect(screen.getByText('Score: 90/100')).toBeInTheDocument();
    });

    it('updates metrics when switching area', () => {
      render(<NeighborhoodAnalyzer />);
      fireEvent.click(screen.getByText('Downtown Dubai'));
      expect(screen.getByText('AED 2.9M')).toBeInTheDocument();
      expect(screen.getByText('AED 2100')).toBeInTheDocument();
      expect(screen.getByText('5.5%')).toBeInTheDocument();
    });

    it('updates insights when switching area', () => {
      render(<NeighborhoodAnalyzer />);
      fireEvent.click(screen.getByText('Palm Jumeirah'));
      expect(screen.getByText(/Ultra-luxury positioning/)).toBeInTheDocument();
      expect(screen.getByText(/Highest appreciation potential/)).toBeInTheDocument();
    });

    it('updates risks when switching area', () => {
      render(<NeighborhoodAnalyzer />);
      fireEvent.click(screen.getByText('Palm Jumeirah'));
      expect(screen.getByText(/Limited supply/)).toBeInTheDocument();
      expect(screen.getByText(/Accessibility challenges/)).toBeInTheDocument();
    });

    it('switches back to Dubai Marina', () => {
      render(<NeighborhoodAnalyzer />);
      fireEvent.click(screen.getByText('Downtown Dubai'));
      fireEvent.click(screen.getByText('Dubai Marina'));
      expect(screen.getByText('Score: 92/100')).toBeInTheDocument();
    });
  });
});
