import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';

// Mock lucide-react
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');
  const icon = (name: string) => (props: any) => <svg data-testid={`icon-${name}`} {...props} />;
  return {
    ...actual,
    Bot: icon('bot'),
    Users: icon('users'),
    Briefcase: icon('briefcase'),
    Calendar: icon('calendar'),
    Award: icon('award'),
    Clock: icon('clock'),
    Bell: icon('bell'),
    BellOff: icon('bell-off'),
    XCircle: icon('x-circle'),
    AlertTriangle: icon('alert-triangle'),
    Info: icon('info'),
    Loader2: icon('loader-2'),
    BarChart2: icon('bar-chart-2'),
    ChevronDown: icon('chevron-down'),
    ChevronRight: icon('chevron-right'),
    User: icon('user'),
    Plus: icon('plus'),
    PenTool: icon('pen-tool'),
    Zap: icon('zap'),
    Flag: icon('flag'),
    CheckCircle: icon('check-circle'),
    CheckCircle2: icon('check-circle-2'),
    Circle: icon('circle'),
    UserPlus: icon('user-plus'),
  };
});

// Mock useHRData hook
const mockSetNancyActive = vi.fn();
const mockHRState = {
  stats: {
    totalEmployees: 45,
    activeEmployees: 38,
    onLeave: 4,
    openPositions: 7,
    totalApplicants: 23,
  },
  nancyActive: true,
  setNancyActive: mockSetNancyActive,
  employees: [],
  jobs: [],
  applicants: [],
  filteredEmployees: [],
  filteredJobs: [],
  filteredApplicants: [],
  searchQuery: '',
  setSearchQuery: vi.fn(),
  filterDepartment: 'all',
  setFilterDepartment: vi.fn(),
};

vi.mock('../hooks/useHRData', () => ({
  useHRData: () => mockHRState,
}));

// Mock NANCY_FEATURES
vi.mock('../data/features', () => ({
  NANCY_FEATURES: [
    {
      name: 'Employee Directory',
      category: 'Workforce',
      status: 'active',
      description: 'Dir',
      capabilities: [],
    },
    {
      name: 'Job Board',
      category: 'Talent',
      status: 'active',
      description: 'Jobs',
      capabilities: [],
    },
    {
      name: 'AI Screening',
      category: 'AI',
      status: 'beta',
      description: 'Screen',
      capabilities: [],
    },
  ],
}));

// Mock SuspenseLoader
vi.mock('../../../common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

// Mock all tab components (lazy loaded)
vi.mock('../tabs/EmployeesTab', () => ({
  default: ({ state }: any) => <div data-testid="employees-tab">Employees Tab</div>,
}));
vi.mock('../tabs/JobBoardTab', () => ({
  default: ({ state }: any) => <div data-testid="job-board-tab">Job Board Tab</div>,
}));
vi.mock('../tabs/ApplicantsTab', () => ({
  default: ({ state }: any) => <div data-testid="applicants-tab">Applicants Tab</div>,
}));
vi.mock('../tabs/AttendanceTab', () => ({
  default: ({ state }: any) => <div data-testid="attendance-tab">Attendance Tab</div>,
}));
vi.mock('../tabs/PerformanceTab', () => ({
  default: ({ state }: any) => <div data-testid="performance-tab">Performance Tab</div>,
}));
vi.mock('../tabs/PostJobTab', () => ({
  default: ({ state }: any) => <div data-testid="post-job-tab">Post Job Tab</div>,
}));
vi.mock('../tabs/FeaturesTab', () => ({
  default: () => <div data-testid="features-tab">Features Tab</div>,
}));

// Mock CSS
vi.mock('../NancyHRCRM.css', () => ({}));

import NancyHRCRM from '../index';

describe('NancyHRCRM', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // ── Header ─────────────────────────────────────────────────
  describe('header', () => {
    it('renders Nancy title', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('Nancy - HR Manager')).toBeInTheDocument();
    });

    it('shows AI Active status when nancy is active', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('AI Active')).toBeInTheDocument();
    });

    it('renders Bot icon', () => {
      render(<NancyHRCRM />);
      expect(screen.getByTestId('icon-bot')).toBeInTheDocument();
    });

    it('renders Pause Nancy button when active', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('Pause Nancy')).toBeInTheDocument();
    });

    it('calls setNancyActive(false) when Pause Nancy is clicked', () => {
      render(<NancyHRCRM />);
      fireEvent.click(screen.getByText('Pause Nancy'));
      expect(mockSetNancyActive).toHaveBeenCalledWith(false);
    });
  });

  // ── Stats ──────────────────────────────────────────────────
  describe('stats', () => {
    it('renders Total Employees stat', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('Total Employees')).toBeInTheDocument();
    });

    it('renders Active stat', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('38')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders On Leave stat', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('On Leave')).toBeInTheDocument();
    });

    it('renders Open Positions stat', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('Open Positions')).toBeInTheDocument();
    });

    it('renders Applicants stat', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('23')).toBeInTheDocument();
      const applicantsTexts = screen.getAllByText('Applicants');
      expect(applicantsTexts.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Tabs ───────────────────────────────────────────────────
  describe('tabs', () => {
    it('renders all 7 tab buttons', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText('Employees')).toBeInTheDocument();
      expect(screen.getByText('Job Board')).toBeInTheDocument();
      // "Applicants" appears both as stat label and tab button
      const applicantsEls = screen.getAllByText('Applicants');
      expect(applicantsEls.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Attendance')).toBeInTheDocument();
      expect(screen.getByText('Performance')).toBeInTheDocument();
      expect(screen.getByText('Post Job')).toBeInTheDocument();
      expect(screen.getByText(/Features/)).toBeInTheDocument();
    });

    it('Features tab shows count of features', () => {
      render(<NancyHRCRM />);
      expect(screen.getByText(/Features \(3\)/)).toBeInTheDocument();
    });

    it('shows Employees tab by default', async () => {
      render(<NancyHRCRM />);
      await waitFor(() => {
        expect(screen.getByTestId('employees-tab')).toBeInTheDocument();
      });
    });

    it('switches to Job Board tab', async () => {
      render(<NancyHRCRM />);
      fireEvent.click(screen.getByText('Job Board'));
      await waitFor(() => {
        expect(screen.getByTestId('job-board-tab')).toBeInTheDocument();
      });
    });

    it('switches to Applicants tab', async () => {
      render(<NancyHRCRM />);
      // "Applicants" appears as both stat label and tab — click the tab button
      const applicantsBtns = screen.getAllByText('Applicants');
      fireEvent.click(applicantsBtns[applicantsBtns.length - 1]);
      await waitFor(() => {
        expect(screen.getByTestId('applicants-tab')).toBeInTheDocument();
      });
    });

    it('switches to Attendance tab', async () => {
      render(<NancyHRCRM />);
      fireEvent.click(screen.getByText('Attendance'));
      await waitFor(() => {
        expect(screen.getByTestId('attendance-tab')).toBeInTheDocument();
      });
    });

    it('switches to Performance tab', async () => {
      render(<NancyHRCRM />);
      fireEvent.click(screen.getByText('Performance'));
      await waitFor(() => {
        expect(screen.getByTestId('performance-tab')).toBeInTheDocument();
      });
    });

    it('switches to Post Job tab', async () => {
      render(<NancyHRCRM />);
      fireEvent.click(screen.getByText('Post Job'));
      await waitFor(() => {
        expect(screen.getByTestId('post-job-tab')).toBeInTheDocument();
      });
    });

    it('switches to Features tab', async () => {
      render(<NancyHRCRM />);
      fireEvent.click(screen.getByText(/Features/));
      await waitFor(() => {
        expect(screen.getByTestId('features-tab')).toBeInTheDocument();
      });
    });

    it('hides previous tab content when switching', async () => {
      render(<NancyHRCRM />);
      await waitFor(() => {
        expect(screen.getByTestId('employees-tab')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Attendance'));
      await waitFor(() => {
        expect(screen.queryByTestId('employees-tab')).not.toBeInTheDocument();
        expect(screen.getByTestId('attendance-tab')).toBeInTheDocument();
      });
    });
  });
});
