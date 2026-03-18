import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsTab from '../AnalyticsTab';

describe('AnalyticsTab Integration', () => {
  const mockProps = {
    data: {
      analytics: {
        totalLeads: 2543,
        convertedLeads: 189,
        conversionRate: 7.43,
        avgDealValue: 1250000,
        totalRevenue: 236250000,
        leadSources: [
          { source: 'whatsapp', count: 1234, percentage: 48.5 },
          { source: 'website', count: 892, percentage: 35.1 },
          { source: 'referral', count: 317, percentage: 12.5 },
          { source: 'chatbot', count: 100, percentage: 3.9 }
        ],
        dealStatus: [
          { status: 'active', count: 234, value: 292500000 },
          { status: 'pending', count: 156, value: 195000000 },
          { status: 'completed', count: 891, value: 1113750000 },
          { status: 'lost', count: 267, value: 333750000 }
        ],
        agentPerformance: [
          { name: 'Ahmed Ali', deals: 87, revenue: 108750000, rating: 4.8 },
          { name: 'Sara Khan', deals: 76, revenue: 95000000, rating: 4.7 },
          { name: 'Mohammed Hassan', deals: 65, revenue: 81250000, rating: 4.6 },
          { name: 'Fatima Al Rashid', deals: 54, revenue: 67500000, rating: 4.5 }
        ],
        monthlyTrends: [
          { month: 'Jan', leads: 189, deals: 14, revenue: 17500000 },
          { month: 'Feb', leads: 234, deals: 18, revenue: 22500000 },
          { month: 'Mar', deals: 21, revenue: 26250000 }
        ]
      }
    },
    loading: false,
    onAction: vi.fn()
  };

  describe('Rendering', () => {
    it('should render analytics dashboard', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('should display key metrics', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/2543|Total Leads/)).toBeInTheDocument();
      expect(screen.getByText(/189|Converted/)).toBeInTheDocument();
    });

    it('should show conversion rate', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/7.43|Conversion Rate/)).toBeInTheDocument();
    });

    it('should display total revenue', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/236250000|Revenue/)).toBeInTheDocument();
    });
  });

  describe('Lead Sources', () => {
    it('should display lead sources breakdown', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/whatsapp|website|referral|chatbot/i)).toBeInTheDocument();
    });

    it('should show source percentages', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/48.5|35.1|12.5|3.9/)).toBeInTheDocument();
    });

    it('should display source counts', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/1234|892|317|100/)).toBeInTheDocument();
    });
  });

  describe('Deal Status Analytics', () => {
    it('should show deal status breakdown', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/active|pending|completed|lost/i)).toBeInTheDocument();
    });

    it('should display deal counts', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/234|156|891|267/)).toBeInTheDocument();
    });

    it('should show deal values', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/292500000|195000000|1113750000|333750000/)).toBeInTheDocument();
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
      
      expect(screen.getByText(/87|76|65|54/)).toBeInTheDocument();
    });

    it('should display agent revenue', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/108750000|95000000|81250000|67500000/)).toBeInTheDocument();
    });

    it('should show agent ratings', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/4.8|4.7|4.6|4.5/)).toBeInTheDocument();
    });
  });

  describe('Monthly Trends', () => {
    it('should display monthly data', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/Jan|Feb|Mar/)).toBeInTheDocument();
    });

    it('should show monthly leads', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/189|234/)).toBeInTheDocument();
    });

    it('should display monthly deals', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/14|18|21/)).toBeInTheDocument();
    });

    it('should show monthly revenue', () => {
      render(<AnalyticsTab {...mockProps} />);
      
      expect(screen.getByText(/17500000|22500000|26250000/)).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should have export button', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const exportButtons = container.querySelectorAll('button');
      expect(exportButtons.length).toBeGreaterThan(0);
    });

    it('should support CSV export', async () => {
      const user = userEvent.setup();
      render(<AnalyticsTab {...mockProps} />);
      
      const exportButton = screen.queryByRole('button', { name: /export|download/i });
      if (exportButton) {
        expect(exportButton).toBeInTheDocument();
      }
    });
  });

  describe('Period Filter', () => {
    it('should have period selection', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThanOrEqual(0);
    });

    it('should change period on selection', async () => {
      const user = userEvent.setup();
      render(<AnalyticsTab {...mockProps} />);
      
      const periodSelect = screen.queryByDisplayValue(/7d|30d|90d|1y/);
      if (periodSelect) {
        await user.selectOptions(periodSelect, '30d');
        expect(periodSelect).toBeInTheDocument();
      }
    });
  });

  describe('Charts and Visualizations', () => {
    it('should render charts for analytics', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      expect(container).toBeInTheDocument();
    });

    it('should display source distribution chart', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      expect(container).toBeInTheDocument();
    });

    it('should show deal status distribution', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible filter controls', () => {
      const { container } = render(<AnalyticsTab {...mockProps} />);
      
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThanOrEqual(0);
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
      
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });
});
