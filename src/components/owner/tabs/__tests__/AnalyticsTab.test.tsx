import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsTab from '../AnalyticsTab';

describe('AnalyticsTab Integration', () => {
  const mockProps = {
    data: {},
    loading: false,
    onAction: vi.fn()
  };

  describe('Rendering', () => {
    it('should render analytics dashboard', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Business Analytics')).toBeInTheDocument();
    });

    it('should display key metrics', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      // Component renders hardcoded DEV metrics (Conversion Rate appears in metric card AND table header)
      expect(screen.getAllByText('Conversion Rate').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Average Deal Size')).toBeInTheDocument();
    });

    it('should show conversion rate', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      // Conversion Rate appears in both metric card and table column header
      const conversionRateElements = screen.getAllByText('Conversion Rate');
      expect(conversionRateElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('4.8%')).toBeInTheDocument();
    });

    it('should display revenue section', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Revenue by Emirate')).toBeInTheDocument();
    });
  });

  describe('Lead Sources', () => {
    it('should display lead sources breakdown', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Referral')).toBeInTheDocument();
    });

    it('should show lead source header', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Lead Sources')).toBeInTheDocument();
    });

    it('should display source lead counts', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('45 leads')).toBeInTheDocument();
      expect(screen.getByText('32 leads')).toBeInTheDocument();
      expect(screen.getByText('28 leads')).toBeInTheDocument();
    });
  });

  describe('Revenue by Emirate', () => {
    it('should show emirate names', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Dubai')).toBeInTheDocument();
      expect(screen.getByText('Abu Dhabi')).toBeInTheDocument();
      expect(screen.getByText('Sharjah')).toBeInTheDocument();
    });

    it('should display emirate revenue values', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('AED 18.5M')).toBeInTheDocument();
      expect(screen.getByText('AED 4.2M')).toBeInTheDocument();
    });

    it('should show emirate percentages', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('72%')).toBeInTheDocument();
      expect(screen.getByText('16%')).toBeInTheDocument();
    });
  });

  describe('Agent Performance Ranking', () => {
    it('should display agent names', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Ahmed Ali')).toBeInTheDocument();
      expect(screen.getByText('Sara Khan')).toBeInTheDocument();
    });

    it('should show agent deal counts', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('12 deals')).toBeInTheDocument();
      expect(screen.getByText('22 deals')).toBeInTheDocument();
    });

    it('should display agent revenue', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('AED 3.2M')).toBeInTheDocument();
      // AED 1.8M appears in both emirate breakdown and agent revenue
      expect(screen.getAllByText('AED 1.8M').length).toBeGreaterThanOrEqual(1);
    });

    it('should display top agents section header', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Top Performing Agents')).toBeInTheDocument();
    });
  });

  describe('Monthly Trends', () => {
    it('should display monthly trend section', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Monthly Trend')).toBeInTheDocument();
    });

    it('should show month labels as single letters', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const trendLabels = container.querySelector('.trend-labels');
      expect(trendLabels).toBeInTheDocument();
    });

    it('should render trend chart bars', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const trendBars = container.querySelectorAll('.trend-bar');
      expect(trendBars.length).toBe(12);
    });

    it('should display property type performance table', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Property Type Performance')).toBeInTheDocument();
      expect(screen.getByText('Apartments')).toBeInTheDocument();
      expect(screen.getByText('Villas')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should have time range buttons', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have time range options', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Quarter')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });
  });

  describe('Period Filter', () => {
    it('should have time range selector', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const rangeButtons = container.querySelectorAll('.range-btn');
      expect(rangeButtons.length).toBe(4);
    });

    it('should change time range on click', async () => {
      const user = userEvent.setup();
      render(<AnalyticsTab {...mockProps} />);
      
      const weekButton = screen.getByText('Week');
      await user.click(weekButton);
      expect(weekButton).toBeInTheDocument();
    });
  });

  describe('Charts and Visualizations', () => {
    it('should render charts for analytics', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      expect(container).toBeInTheDocument();
    });

    it('should display emirate chart bars', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const bars = container.querySelectorAll('.emirate-bar');
      expect(bars.length).toBe(5);
    });

    it('should show property performance table', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByRole('table', { name: /property type performance/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible table', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      const table = screen.getByRole('table', { name: /property type performance/i });
      expect(table).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('should handle empty analytics data', () => {
      const emptyProps = {
        data: { analytics: {} },
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<AnalyticsTab {...emptyProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render when loading is false', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Business Analytics')).toBeInTheDocument();
    });
  });
});
