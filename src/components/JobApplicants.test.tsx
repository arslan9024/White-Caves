/**
 * JobApplicants – comprehensive test suite
 * Covers rendering, loading, error, filtering, status actions, detail modal
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobApplicants from './JobApplicants';

/* ── Mocks ────────────────────────────────────────────────────── */
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}));

const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() };
vi.mock('./Toast', () => ({
  useToast: () => mockToast,
}));

let mockFetchResponse: { ok: boolean; status: number; json: () => Promise<unknown> };
vi.mock('../utils/authFetch', () => ({
  authFetch: vi.fn((...args: unknown[]) => Promise.resolve(mockFetchResponse)),
}));

/* ── Styled components mock ──────────────────────────────────── */
vi.mock('./JobApplicants.styles', () => {
  const stub = (name: string) => {
    const C = ({ children, onClick, className, href, target, rel, ...rest }: any) => {
      if (href) return <a data-testid={name} href={href} target={target} rel={rel} {...rest}>{children}</a>;
      return <div data-testid={name} onClick={onClick} className={className} {...rest}>{children}</div>;
    };
    C.displayName = name;
    return C;
  };
  return {
    StyledJobApplicants: stub('StyledJobApplicants'),
    StyledJobTitle: stub('StyledJobTitle'),
    StyledFilters: stub('StyledFilters'),
    StyledFilterButton: stub('StyledFilterButton'),
    StyledApplicationsGrid: stub('StyledApplicationsGrid'),
    StyledApplicationCard: stub('StyledApplicationCard'),
    StyledApplicationHeader: stub('StyledApplicationHeader'),
    StyledStatusBadge: stub('StyledStatusBadge'),
    StyledApplicationDetails: stub('StyledApplicationDetails'),
    StyledApplicationActions: stub('StyledApplicationActions'),
    StyledDownloadResume: stub('StyledDownloadResume'),
    StyledQuickActions: stub('StyledQuickActions'),
    StyledReviewBtn: stub('StyledReviewBtn'),
    StyledAcceptBtn: stub('StyledAcceptBtn'),
    StyledRejectBtn: stub('StyledRejectBtn'),
    StyledDetailModal: stub('StyledDetailModal'),
    StyledDetailModalContent: stub('StyledDetailModalContent'),
    StyledLoadingContainer: stub('StyledLoadingContainer'),
    StyledSpinner: stub('StyledSpinner'),
    StyledErrorBanner: stub('StyledErrorBanner'),
    StyledEmptyState: stub('StyledEmptyState'),
  };
});

const sampleApplications = [
  {
    _id: '1',
    applicantName: 'Ahmed Khan',
    applicantEmail: 'ahmed@test.com',
    role: 'LEASING_AGENT',
    status: 'PENDING',
    experience: '5',
    languages: 'English, Arabic',
    licenses: 'RERA License',
    workLocation: 'Dubai',
    createdAt: '2025-01-15T10:00:00Z',
    resume: 'https://example.com/resume.pdf',
  },
  {
    _id: '2',
    applicantName: 'Sara Ali',
    applicantEmail: 'sara@test.com',
    role: 'SALES_AGENT_OFF_PLAN',
    status: 'REVIEWING',
    experience: '3',
    languages: 'English, Hindi',
    licenses: 'BRN',
    workLocation: 'Abu Dhabi',
    createdAt: '2025-01-16T10:00:00Z',
  },
  {
    _id: '3',
    applicantName: 'John Smith',
    applicantEmail: 'john@test.com',
    role: 'FREELANCE_AGENT',
    status: 'ACCEPTED',
    experience: '8',
    languages: 'English',
    licenses: 'DLD',
    workLocation: 'Remote',
    createdAt: '2025-01-17T10:00:00Z',
  },
];

describe('JobApplicants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve(sampleApplications),
    };
  });

  /* ── Basic Rendering ────────────────────────────────────────── */
  describe('basic rendering', () => {
    it('renders the title', async () => {
      render(<JobApplicants />);
      expect(screen.getByText('Job Applications')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      // The component calls fetch immediately so it shows loading first
      mockFetchResponse = {
        ok: true,
        status: 200,
        json: () => new Promise(() => {}), // Never resolves
      };
      render(<JobApplicants />);
      expect(screen.getByText(/loading job applications/i)).toBeInTheDocument();
    });

    it('renders applications after loading', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  /* ── Filter Buttons ─────────────────────────────────────────── */
  describe('filter buttons', () => {
    it('renders all filter buttons', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText(/All \(3\)/)).toBeInTheDocument();
      expect(screen.getByText(/Pending \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Reviewing \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Accepted \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Rejected \(0\)/)).toBeInTheDocument();
    });

    it('filters to PENDING applications', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Pending \(1\)/));
      expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      expect(screen.queryByText('Sara Ali')).not.toBeInTheDocument();
    });

    it('filters to REVIEWING applications', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Reviewing \(1\)/));
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
    });

    it('filters to ACCEPTED applications', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Accepted \(1\)/));
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
    });

    it('shows empty state for REJECTED filter', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Rejected \(0\)/));
      expect(screen.getByText(/no rejected applications found/i)).toBeInTheDocument();
    });

    it('returns to all on All filter click', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Pending \(1\)/));
      fireEvent.click(screen.getByText(/All \(3\)/));
      expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
    });
  });

  /* ── Application Cards ──────────────────────────────────────── */
  describe('application cards', () => {
    it('shows role name', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText(/Leasing Agent/)).toBeInTheDocument();
    });

    it('shows experience', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText(/5 years/i)).toBeInTheDocument();
    });

    it('shows languages', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText(/English, Arabic/)).toBeInTheDocument();
    });

    it('shows download resume link when available', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText('Download Resume')).toBeInTheDocument();
    });

    it('shows View Details button', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      const viewBtns = screen.getAllByText('View Details');
      expect(viewBtns.length).toBeGreaterThanOrEqual(1);
    });
  });

  /* ── Quick Actions ──────────────────────────────────────────── */
  describe('quick actions', () => {
    it('shows Start Review, Accept, Reject for PENDING', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText('Start Review')).toBeInTheDocument();
    });

    it('shows Accept, Reject for REVIEWING', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      });
      // Sara is REVIEWING - should have Accept and Reject
      const acceptBtns = screen.getAllByText('Accept');
      expect(acceptBtns.length).toBeGreaterThanOrEqual(1);
    });

    it('dispatches status update on Start Review click', async () => {
      const { authFetch } = await import('../utils/authFetch');
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      
      // Set up response for the update
      mockFetchResponse = { ok: true, status: 200, json: () => Promise.resolve({ success: true }) };
      
      fireEvent.click(screen.getByText('Start Review'));
      
      await waitFor(() => {
        expect(authFetch).toHaveBeenCalledWith('/api/job-applications/1', expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'REVIEWING' }),
        }));
      });
    });
  });

  /* ── Detail Modal ───────────────────────────────────────────── */
  describe('detail modal', () => {
    it('opens detail modal on View Details click', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      const viewBtns = screen.getAllByText('View Details');
      fireEvent.click(viewBtns[0]);
      expect(screen.getByText('Application Details')).toBeInTheDocument();
    });

    it('shows applicant details in modal', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getAllByText('View Details')[0]);
      expect(screen.getByText(/ahmed@test.com/)).toBeInTheDocument();
    });

    it('closes modal on close button click', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getAllByText('View Details')[0]);
      expect(screen.getByText('Application Details')).toBeInTheDocument();
      // Close button (×)
      fireEvent.click(screen.getByText('×'));
      // Modal should disappear - Application Details should only appear in modal
      expect(screen.queryByText('Application Details')).not.toBeInTheDocument();
    });

    it('closes modal on overlay click', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      fireEvent.click(screen.getAllByText('View Details')[0]);
      // Click overlay (StyledDetailModal) 
      const overlay = screen.getByTestId('StyledDetailModal');
      fireEvent.click(overlay);
      expect(screen.queryByText('Application Details')).not.toBeInTheDocument();
    });
  });

  /* ── Error State ────────────────────────────────────────────── */
  describe('error state', () => {
    it('shows error message when fetch fails', async () => {
      mockFetchResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      };
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText(/failed to load applications/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      mockFetchResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      };
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });
  });

  /* ── Empty State ────────────────────────────────────────────── */
  describe('empty state', () => {
    it('shows empty state when no applications', async () => {
      mockFetchResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      };
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText(/no job applications yet/i)).toBeInTheDocument();
      });
    });
  });

  /* ── Status Colors ──────────────────────────────────────────── */
  describe('status display', () => {
    it('renders status badges', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText('PENDING')).toBeInTheDocument();
      expect(screen.getByText('REVIEWING')).toBeInTheDocument();
      expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
    });
  });

  /* ── Role Mapping ───────────────────────────────────────────── */
  describe('role display', () => {
    it('maps role codes to readable names', async () => {
      render(<JobApplicants />);
      await waitFor(() => {
        expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      });
      expect(screen.getByText(/Leasing Agent/)).toBeInTheDocument();
      expect(screen.getByText(/Sales Agent - Off Plan Properties/)).toBeInTheDocument();
      expect(screen.getByText(/Freelance Agent/)).toBeInTheDocument();
    });
  });
});
