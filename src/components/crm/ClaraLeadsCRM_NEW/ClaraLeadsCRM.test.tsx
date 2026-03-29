import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./ClaraLeadsCRM.css', () => ({}));

// Mock SuspenseLoader
vi.mock('../../common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

// Mock UI components
vi.mock('../../../components/ui', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  Badge: ({ children, variant, size }: any) => <span data-testid="badge" data-variant={variant}>{children}</span>,
  ProgressBar: ({ value, variant, animated, striped }: any) => (
    <div data-testid="progress-bar" data-variant={variant} data-value={value} role="progressbar" aria-valuenow={value}>
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
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(screen.getByText('Prospect Progress: 100%')).toBeInTheDocument();
    });

    it('renders deal progress label', () => {
      render(<ClaraLeadsCRM />);
      expect(screen.getByText('Deal Progress: 33%')).toBeInTheDocument();
    });

    it('renders conversion rate label', () => {
      render(<ClaraLeadsCRM />);
      expect(screen.getByText('Conversion Rate: 8%')).toBeInTheDocument();
    });

    it('renders task completion label', () => {
      render(<ClaraLeadsCRM />);
      expect(screen.getByText('Task Completion: 67%')).toBeInTheDocument();
    });

    it('renders 4 progress bars', () => {
      render(<ClaraLeadsCRM />);
      const bars = screen.getAllByTestId('progress-bar');
      expect(bars.length).toBe(4);
    });
  });

  describe('tab navigation', () => {
    it('renders all 6 tab buttons', () => {
      render(<ClaraLeadsCRM />);
      expect(screen.getByText('Prospects')).toBeInTheDocument();
      expect(screen.getByText('Deals')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Insights')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('renders badge counts for each tab', () => {
      render(<ClaraLeadsCRM />);
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBe(6);
      expect(badges[0]).toHaveTextContent('24'); // prospects
      expect(badges[1]).toHaveTextContent('8');  // deals
      expect(badges[2]).toHaveTextContent('12'); // tasks
      expect(badges[3]).toHaveTextContent('45'); // activity
      expect(badges[4]).toHaveTextContent('3');  // insights
      expect(badges[5]).toHaveTextContent('6');  // features
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
