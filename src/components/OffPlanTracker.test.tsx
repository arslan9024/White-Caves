/**
 * OffPlanTracker – comprehensive test suite
 * Covers rendering, filtering, countdown timers, project cards, stats
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import OffPlanTracker from './OffPlanTracker';

/* ── Mock styled-components ──────────────────────────────────── */
vi.mock('./OffPlanTracker.styles', () => {
  const stub = (name: string) => {
    const C = ({ children, onClick, className, style, src, alt, ...rest }: any) => {
      const clean = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('$')),
      );
      return (
      <div data-testid={name} onClick={onClick} className={className} style={style} {...clean}>
        {src ? <img src={src} alt={alt} /> : null}
        {children}
      </div>
      );
    };
    C.displayName = name;
    return C;
  };
  return {
    OffplanTrackerContainer: stub('OffplanTrackerContainer'),
    TrackerHeader: stub('TrackerHeader'),
    HeaderContent: stub('HeaderContent'),
    HeaderTitle: stub('HeaderTitle'),
    HeaderSubtitle: stub('HeaderSubtitle'),
    TrackerStats: stub('TrackerStats'),
    StatBadge: stub('StatBadge'),
    StatNumber: stub('StatNumber'),
    StatLabel: stub('StatLabel'),
    FilterTabs: stub('FilterTabs'),
    FilterTab: stub('FilterTab'),
    ProjectsGrid: stub('ProjectsGrid'),
    ProjectCard: stub('ProjectCard'),
    ProjectImage: stub('ProjectImage'),
    ProjectBadge: stub('ProjectBadge'),
    ProjectContent: stub('ProjectContent'),
    DeveloperInfo: stub('DeveloperInfo'),
    DeveloperLogo: stub('DeveloperLogo'),
    DeveloperName: stub('DeveloperName'),
    ProjectTitle: stub('ProjectTitle'),
    ProjectLocation: stub('ProjectLocation'),
    ProjectDetails: stub('ProjectDetails'),
    DetailItem: stub('DetailItem'),
    DetailLabel: stub('DetailLabel'),
    DetailValue: stub('DetailValue'),
    ProjectPrice: stub('ProjectPrice'),
    FeaturesChip: stub('FeaturesChip'),
    ActionButtons: stub('ActionButtons'),
    ActionButton: stub('ActionButton'),
    Countdown: stub('Countdown'),
    CountdownLabel: stub('CountdownLabel'),
    CountdownTimer: stub('CountdownTimer'),
    TimeUnit: stub('TimeUnit'),
    TimeValue: stub('TimeValue'),
    TimeLabel: stub('TimeLabel'),
    PaymentPlan: stub('PaymentPlan'),
    LocationIcon: stub('LocationIcon'),
  };
});

describe('OffPlanTracker', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  /* ── Basic Rendering ────────────────────────────────────────── */
  describe('basic rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<OffPlanTracker />);
      expect(container).toBeTruthy();
    });

    it('renders main title', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Off-Plan Investment Tracker')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText(/monitor upcoming developments/i)).toBeInTheDocument();
    });
  });

  /* ── Stats ──────────────────────────────────────────────────── */
  describe('stats', () => {
    it('renders active projects count (5 projects)', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
    });

    it('renders total investment stat', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Total Investment')).toBeInTheDocument();
    });
  });

  /* ── Filter Tabs ────────────────────────────────────────────── */
  describe('filter tabs', () => {
    it('renders All Projects filter', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('All Projects')).toBeInTheDocument();
    });

    it('renders Luxury filter', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Luxury')).toBeInTheDocument();
    });

    it('renders Residential filter', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Residential')).toBeInTheDocument();
    });

    it('renders Commercial filter', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Commercial')).toBeInTheDocument();
    });

    it('filters to luxury projects', () => {
      render(<OffPlanTracker />);
      fireEvent.click(screen.getByText('Luxury'));
      // Luxury: Marina Vista, Creek Harbour Tower (segment=luxury)
      expect(screen.getByText('Marina Vista')).toBeInTheDocument();
      expect(screen.getByText('Creek Harbour Tower')).toBeInTheDocument();
      // Commercial should be hidden
      expect(screen.queryByText('Business Bay Central')).not.toBeInTheDocument();
    });

    it('filters to commercial projects', () => {
      render(<OffPlanTracker />);
      fireEvent.click(screen.getByText('Commercial'));
      expect(screen.getByText('Business Bay Central')).toBeInTheDocument();
      expect(screen.queryByText('Marina Vista')).not.toBeInTheDocument();
    });

    it('filters to residential projects', () => {
      render(<OffPlanTracker />);
      fireEvent.click(screen.getByText('Residential'));
      expect(screen.getByText('Dubai Hills Villas')).toBeInTheDocument();
      expect(screen.queryByText('Marina Vista')).not.toBeInTheDocument();
    });

    it('returns to all projects when All Projects is clicked', () => {
      render(<OffPlanTracker />);
      fireEvent.click(screen.getByText('Luxury'));
      fireEvent.click(screen.getByText('All Projects'));
      expect(screen.getByText('Marina Vista')).toBeInTheDocument();
      expect(screen.getByText('Business Bay Central')).toBeInTheDocument();
    });
  });

  /* ── Project Cards ──────────────────────────────────────────── */
  describe('project cards', () => {
    it('renders all 5 projects by default', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Marina Vista')).toBeInTheDocument();
      expect(screen.getByText('Creek Harbour Tower')).toBeInTheDocument();
      expect(screen.getByText('Palm Residences II')).toBeInTheDocument();
      expect(screen.getByText('Business Bay Central')).toBeInTheDocument();
      expect(screen.getByText('Dubai Hills Villas')).toBeInTheDocument();
    });

    it('renders developer names', () => {
      render(<OffPlanTracker />);
      expect(screen.getAllByText('Emaar Properties').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Nakheel')).toBeInTheDocument();
      expect(screen.getByText('DAMAC')).toBeInTheDocument();
      expect(screen.getByText('Meraas')).toBeInTheDocument();
    });

    it('renders location for each project', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    });

    it('renders project type', () => {
      render(<OffPlanTracker />);
      const apartments = screen.getAllByText('Apartment');
      expect(apartments.length).toBeGreaterThanOrEqual(1);
      const villas = screen.getAllByText('Villa');
      expect(villas.length).toBeGreaterThanOrEqual(1);
    });

    it('renders payment plans', () => {
      render(<OffPlanTracker />);
      expect(screen.getAllByText('Payment Plan: 60/40').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Payment Plan: 80/20')).toBeInTheDocument();
      expect(screen.getByText('Payment Plan: 50/50')).toBeInTheDocument();
    });

    it('renders feature chips', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('Sea View')).toBeInTheDocument();
      expect(screen.getByText('Private Beach')).toBeInTheDocument();
      // Smart Home appears in multiple projects
      expect(screen.getAllByText('Smart Home').length).toBeGreaterThanOrEqual(1);
    });

    it('renders Reserve and More Info buttons', () => {
      render(<OffPlanTracker />);
      expect(screen.getAllByText('Reserve').length).toBe(5);
      expect(screen.getAllByText('More Info').length).toBe(5);
    });
  });

  /* ── Countdown ──────────────────────────────────────────────── */
  describe('countdown timer', () => {
    it('renders Launching In label', () => {
      render(<OffPlanTracker />);
      const launchLabels = screen.getAllByText('Launching In');
      expect(launchLabels.length).toBe(5);
    });

    it('renders time unit labels', () => {
      render(<OffPlanTracker />);
      // After 1 second the interval fires and countdowns appear
      act(() => { vi.advanceTimersByTime(1100); });
      const daysLabels = screen.getAllByText('Days');
      expect(daysLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('updates countdown every second', () => {
      render(<OffPlanTracker />);
      act(() => { vi.advanceTimersByTime(1100); });
      const hrsLabels = screen.getAllByText('Hrs');
      expect(hrsLabels.length).toBeGreaterThanOrEqual(1);
      act(() => { vi.advanceTimersByTime(1000); });
      // Still renders after 2 seconds
      const minLabels = screen.getAllByText('Min');
      expect(minLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('cleans up interval on unmount', () => {
      const clearSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = render(<OffPlanTracker />);
      unmount();
      expect(clearSpy).toHaveBeenCalled();
      clearSpy.mockRestore();
    });
  });

  /* ── Price Display ──────────────────────────────────────────── */
  describe('prices', () => {
    it('renders price from values', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText(/2\.5M/)).toBeInTheDocument(); // Marina Vista 2.5M
      expect(screen.getByText(/1\.8M/)).toBeInTheDocument(); // Creek Harbour Tower
      expect(screen.getByText(/15\.0M/)).toBeInTheDocument(); // Palm Residences II
    });
  });

  /* ── Status Badges ──────────────────────────────────────────── */
  describe('status badges', () => {
    it('renders launching-soon badges', () => {
      render(<OffPlanTracker />);
      const badges = screen.getAllByText('launching-soon');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });

    it('renders pre-registration badge', () => {
      render(<OffPlanTracker />);
      expect(screen.getByText('pre-registration')).toBeInTheDocument();
    });
  });

  describe('live data integration', () => {
    it('renders live-derived projects when market/location data props are provided', () => {
      render(
        <OffPlanTracker
          marketStats={{
            totalProperties: 500,
            availableProperties: 320,
            averagePrice: 4500000,
            portfolioValue: 2250000000,
            activeAgents: 50,
          }}
          locationTrends={[
            {
              name: 'Palm Jumeirah',
              propertyCount: 120,
              avgPrice: 15000000,
              trendPercent: 12,
              trendDirection: 'up',
            },
          ]}
          featuredProperties={[
            {
              id: 'prop-12',
              title: 'Azure Palm Residence',
              type: 'Villa',
              status: 'available',
              price: 21000000,
              currency: 'AED',
              bedrooms: 5,
              bathrooms: 6,
              sqft: 9000,
              location: 'Palm Jumeirah',
              amenities: ['Pool'],
              images: ['https://example.com/azure.jpg'],
              featured: true,
            },
          ]}
        />
      );

      expect(screen.getByText('Palm Jumeirah Signature Residences')).toBeInTheDocument();
      expect(screen.getByText(/12% Demand Momentum/)).toBeInTheDocument();
      expect(screen.getByText(/Avg AED 15.0M/)).toBeInTheDocument();
    });
  });
});
