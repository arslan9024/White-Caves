import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => React.createElement('span', { 'data-testid': `icon-${name}`, ...props });
  return {
    Briefcase: icon('briefcase'),
    Calendar: icon('calendar'),
    CheckCircle: icon('check-circle'),
    Users: icon('users'),
    BarChart3: icon('bar-chart'),
    Bell: icon('bell'),
    Inbox: icon('inbox'),
    AlertCircle: icon('alert-circle'),
    ArrowUp: icon('arrow-up'),
    ArrowDown: icon('arrow-down'),
  };
});

// Mock CSS imports
vi.mock('../AssistantDashboard.css', () => ({}));
vi.mock('./ZoeExecutiveCRM.css', () => ({}));

// Mock tab components
vi.mock('./tabs/SuggestionsTab', () => ({
  default: ({ suggestions, unreviewedCount, criticalCount }: any) => (
    <div data-testid="suggestions-tab">
      Suggestions ({suggestions?.length || 0})
    </div>
  ),
}));
vi.mock('./tabs/CalendarTab', () => ({
  default: ({ meetings }: any) => <div data-testid="calendar-tab">Calendar ({meetings?.length || 0})</div>,
}));
vi.mock('./tabs/TasksTab', () => ({
  default: ({ tasks }: any) => <div data-testid="tasks-tab">Tasks ({tasks?.length || 0})</div>,
}));
vi.mock('./tabs/ExecutivesTab', () => ({
  default: ({ executives }: any) => <div data-testid="executives-tab">Executives ({executives?.length || 0})</div>,
}));
vi.mock('./tabs/ReportsTab', () => ({
  default: () => <div data-testid="reports-tab">Reports</div>,
}));

// Mock useExecutiveData hook
const mockSetActiveTab = vi.fn();
const mockSetMeetingSearch = vi.fn();
const mockSetTaskFilter = vi.fn();
const mockHandleStatusChange = vi.fn();
const mockGetUpcomingMeetings = vi.fn().mockReturnValue([{ id: 1 }, { id: 2 }]);

vi.mock('./hooks/useExecutiveData', () => ({
  useExecutiveData: () => ({
    activeTab: 'suggestions',
    setActiveTab: mockSetActiveTab,
    unreviewedCount: 5,
    criticalSuggestions: [{ id: 1 }, { id: 2 }],
    filteredSuggestions: [{ id: 1 }, { id: 2 }, { id: 3 }],
    meetings: [{ id: 1, title: 'Meeting 1', status: 'upcoming' }],
    meetingSearch: '',
    setMeetingSearch: mockSetMeetingSearch,
    tasks: [
      { id: 1, status: 'completed' },
      { id: 2, status: 'in-progress' },
      { id: 3, status: 'completed' },
    ],
    taskFilter: 'all',
    setTaskFilter: mockSetTaskFilter,
    executives: [{ id: 1, name: 'Executive 1' }],
    funnelMetrics: {},
    complianceMetrics: {},
    vault: {},
    handleStatusChange: mockHandleStatusChange,
    getUpcomingMeetings: mockGetUpcomingMeetings,
  }),
}));

import ZoeExecutiveCRM from './index';

describe('ZoeExecutiveCRM', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUpcomingMeetings.mockReturnValue([{ id: 1 }, { id: 2 }]);
  });

  describe('rendering', () => {
    it('renders the dashboard header', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByText('Zoe - Executive Assistant & Strategic Intelligence')).toBeInTheDocument();
    });

    it('renders the assistant description', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByText(/Strategic insights, executive inbox/)).toBeInTheDocument();
    });

    it('renders Active status', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('stat cards', () => {
    it('renders unreviewed suggestions count', () => {
      render(<ZoeExecutiveCRM />);
      const statCards = document.querySelectorAll('.stat-card');
      const unreviewedCard = statCards[0];
      expect(unreviewedCard.querySelector('.stat-value')?.textContent).toBe('5');
      expect(screen.getByText('Unreviewed Suggestions')).toBeInTheDocument();
    });

    it('renders critical items count', () => {
      render(<ZoeExecutiveCRM />);
      const statCards = document.querySelectorAll('.stat-card');
      const criticalCard = statCards[1];
      expect(criticalCard.querySelector('.stat-value')?.textContent).toBe('2');
      expect(screen.getByText('Critical Items')).toBeInTheDocument();
    });

    it('renders upcoming meetings count', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByText('Upcoming Meetings')).toBeInTheDocument();
    });

    it('renders tasks completed ratio', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByText('2/3')).toBeInTheDocument();
      expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
    });
  });

  describe('tab navigation', () => {
    it('renders all 5 tab buttons', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Executives')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('calls setActiveTab when a tab is clicked', () => {
      render(<ZoeExecutiveCRM />);
      fireEvent.click(screen.getByText('Calendar'));
      expect(mockSetActiveTab).toHaveBeenCalledWith('calendar');
    });

    it('calls setActiveTab for tasks tab', () => {
      render(<ZoeExecutiveCRM />);
      fireEvent.click(screen.getByText('Tasks'));
      expect(mockSetActiveTab).toHaveBeenCalledWith('tasks');
    });

    it('calls setActiveTab for executives tab', () => {
      render(<ZoeExecutiveCRM />);
      fireEvent.click(screen.getByText('Executives'));
      expect(mockSetActiveTab).toHaveBeenCalledWith('executives');
    });

    it('calls setActiveTab for reports tab', () => {
      render(<ZoeExecutiveCRM />);
      fireEvent.click(screen.getByText('Reports'));
      expect(mockSetActiveTab).toHaveBeenCalledWith('reports');
    });
  });

  describe('tab content', () => {
    it('shows suggestions tab by default', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByTestId('suggestions-tab')).toBeInTheDocument();
    });

    it('passes correct props to SuggestionsTab', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByTestId('suggestions-tab')).toHaveTextContent('Suggestions (3)');
    });
  });

  describe('icons', () => {
    it('renders briefcase icon in header', () => {
      render(<ZoeExecutiveCRM />);
      expect(screen.getByTestId('icon-briefcase')).toBeInTheDocument();
    });
  });
});
