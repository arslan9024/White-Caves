import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./ClaraLeadsCRM.css', () => ({}));

// Mock useLeadsData hook (now Redux-based)
const mockLeadsData = {
  leads: [
    {
      id: '1',
      name: 'Test Lead',
      stage: 'proposal',
      tasks: 2,
      value: 50000,
      status: 'qualified',
      probability: 60,
    },
    {
      id: '2',
      name: 'Hot Lead',
      stage: 'negotiation',
      tasks: 1,
      value: 100000,
      status: 'qualified',
      probability: 80,
    },
    {
      id: '3',
      name: 'Cold Lead',
      stage: 'initial_contact',
      tasks: 3,
      value: 25000,
      status: 'new',
      probability: 10,
    },
  ],
  stats: {
    totalLeads: 3,
    qualifiedLeads: 2,
    totalValue: 175000,
    avgProbability: 50,
    stageCounts: {
      initial_contact: 1,
      discovery: 0,
      proposal: 1,
      negotiation: 1,
      contract_review: 0,
      closed_won: 0,
      closed_lost: 0,
    },
  },
  loading: false,
  error: null,
  filteredLeads: [],
  filterStatus: 'all',
  setFilterStatus: vi.fn(),
  filterStage: 'all',
  setFilterStage: vi.fn(),
  searchQuery: '',
  setSearchQuery: vi.fn(),
  sortBy: 'lastContact',
  setSortBy: vi.fn(),
  sortOrder: 'desc',
  setSortOrder: vi.fn(),
  addLead: vi.fn(),
  updateLead: vi.fn(),
  deleteLead: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('./hooks/useLeadsData', () => ({
  useLeadsData: () => mockLeadsData,
}));

// Mock SuspenseLoader
vi.mock('../../common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

// Mock UI components
vi.mock('../../../components/ui', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
  ProgressBar: ({ value, variant, animated, striped }: any) => (
    <div
      data-testid="progress-bar"
      data-variant={variant}
      data-value={value}
      role="progressbar"
      aria-valuenow={value}
    >
      {value}%
    </div>
  ),
}));

// Mock lazy-loaded tabs
vi.mock('./tabs/ProspectsTab', () => ({
  default: () => <div data-testid="prospects-tab">Prospects Tab</div>,
}));
vi.mock('./tabs/DealsTab', () => ({
  default: () => <div data-testid="deals-tab">Deals Tab</div>,
}));
vi.mock('./tabs/TasksTab', () => ({
  default: () => <div data-testid="tasks-tab">Tasks Tab</div>,
}));
vi.mock('./tabs/ActivityTab', () => ({
  default: () => <div data-testid="activity-tab">Activity Tab</div>,
}));
vi.mock('./tabs/InsightsTab', () => ({
  default: () => <div data-testid="insights-tab">Insights Tab</div>,
}));
vi.mock('./tabs/FeaturesTab', () => ({
  default: () => <div data-testid="features-tab">Features Tab</div>,
}));

import ClaraLeadsCRM from './index';

describe('ClaraLeadsCRM', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the CRM container', () => {
      const { container } = render(<ClaraLeadsCRM />);
      expect(container.querySelector('.clara-leads-crm')).toBeInTheDocument();
    });

    it('renders pipeline progression heading', () => {
      render(<ClaraLeadsCRM />);
      expect(screen.getByText('Pipeline Progression')).toBeInTheDocument();
    });
  });

  describe('pipeline metrics', () => {
    it('renders prospect progress label', () => {
      render(<ClaraLeadsCRM />);
      // Dynamic: prospectRate = 100% (total/total)
      expect(screen.getByText('Prospect Progress: 100%')).toBeInTheDocument();
    });

    it('renders deal progress label', () => {
      render(<ClaraLeadsCRM />);
      // Dynamic: dealRate = round(2/3 * 100) = 67%
      expect(screen.getByText('Deal Progress: 67%')).toBeInTheDocument();
    });

    it('renders conversion rate label', () => {
      render(<ClaraLeadsCRM />);
      // Dynamic: closed_won = 0, so conversionRate = 0%
      expect(screen.getByText('Conversion Rate: 0%')).toBeInTheDocument();
    });

    it('renders task completion label', () => {
      render(<ClaraLeadsCRM />);
      // Dynamic: avgProbability = 50
      expect(screen.getByText('Task Completion: 50%')).toBeInTheDocument();
    });

    it('renders 4 progress bars', () => {
      render(<ClaraLeadsCRM />);
      const bars = screen.getAllByTestId('progress-bar');
      expect(bars.length).toBe(4);
    });
  });

  describe('tab navigation', () => {
    it('renders all tab buttons including lifecycle', () => {
      render(<ClaraLeadsCRM />);
      expect(screen.getByText('Prospects')).toBeInTheDocument();
      expect(screen.getByText('Deals')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Insights')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Lifecycle')).toBeInTheDocument();
    });

    it('renders badge counts for each tab', () => {
      render(<ClaraLeadsCRM />);
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBe(7);
      // Dynamic counts from mock data:
      // prospects = totalLeads = 3
      expect(badges[0]).toHaveTextContent('3');
      // deals = proposal + negotiation + contract_review = 2
      expect(badges[1]).toHaveTextContent('2');
      // tasks = sum of lead.tasks = 2+1+3 = 6
      expect(badges[2]).toHaveTextContent('6');
      // activity = leads.length = 3
      expect(badges[3]).toHaveTextContent('3');
      // insights = closed_won = 0
      expect(badges[4]).toHaveTextContent('0');
      // features = static 6
      expect(badges[5]).toHaveTextContent('6');
      // lifecycle = default 0 in tabCounts fallback
      expect(badges[6]).toHaveTextContent('0');
    });

    it('switches to deals tab on click', async () => {
      render(<ClaraLeadsCRM />);
      fireEvent.click(screen.getByText('Deals'));
      await waitFor(() => {
        expect(screen.getByTestId('deals-tab')).toBeInTheDocument();
      });
    });

    it('switches to tasks tab on click', async () => {
      render(<ClaraLeadsCRM />);
      fireEvent.click(screen.getByText('Tasks'));
      await waitFor(() => {
        expect(screen.getByTestId('tasks-tab')).toBeInTheDocument();
      });
    });

    it('switches to activity tab on click', async () => {
      render(<ClaraLeadsCRM />);
      fireEvent.click(screen.getByText('Activity'));
      await waitFor(() => {
        expect(screen.getByTestId('activity-tab')).toBeInTheDocument();
      });
    });

    it('switches to insights tab on click', async () => {
      render(<ClaraLeadsCRM />);
      fireEvent.click(screen.getByText('Insights'));
      await waitFor(() => {
        expect(screen.getByTestId('insights-tab')).toBeInTheDocument();
      });
    });

    it('switches to features tab on click', async () => {
      render(<ClaraLeadsCRM />);
      fireEvent.click(screen.getByText('Features'));
      await waitFor(() => {
        expect(screen.getByTestId('features-tab')).toBeInTheDocument();
      });
    });
  });

  describe('tab content', () => {
    it('shows prospects tab by default', async () => {
      render(<ClaraLeadsCRM />);
      await waitFor(() => {
        expect(screen.getByTestId('prospects-tab')).toBeInTheDocument();
      });
    });

    it('tab buttons have description tooltips', () => {
      render(<ClaraLeadsCRM />);
      const prospectsBtn = screen.getByText('Prospects').closest('button');
      expect(prospectsBtn).toHaveAttribute('title', 'Manage leads and prospects');
    });
  });
});
