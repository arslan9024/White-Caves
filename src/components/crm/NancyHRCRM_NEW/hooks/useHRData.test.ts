import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../data/employees', () => ({
  DUMMY_EMPLOYEES: [
    {
      id: 'EMP-001',
      name: 'Alice Smith',
      email: 'alice@wc.com',
      phone: '',
      avatar: '',
      position: 'Manager',
      department: 'Sales',
      status: 'active',
      joinDate: '2025-01-01',
      salary: 0,
      manager: '',
      location: 'Dubai',
      performance: 0,
      leaveBalance: 0,
      attendance: 0,
    },
    {
      id: 'EMP-002',
      name: 'Bob Jones',
      email: 'bob@wc.com',
      phone: '',
      avatar: '',
      position: 'Developer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2025-01-01',
      salary: 0,
      manager: '',
      location: 'Dubai',
      performance: 0,
      leaveBalance: 0,
      attendance: 0,
    },
    {
      id: 'EMP-003',
      name: 'Carol White',
      email: 'carol@wc.com',
      phone: '',
      avatar: '',
      position: 'Designer',
      department: 'Sales',
      status: 'on_leave',
      joinDate: '2025-01-01',
      salary: 0,
      manager: '',
      location: 'Dubai',
      performance: 0,
      leaveBalance: 0,
      attendance: 0,
    },
  ],
  Employee: {},
}));

vi.mock('../data/jobs', () => ({
  DUMMY_JOBS: [
    { id: 'JOB-001', title: 'Senior Dev', department: 'Engineering', status: 'open' },
    { id: 'JOB-002', title: 'Marketing Lead', department: 'Marketing', status: 'closed' },
    { id: 'JOB-003', title: 'Analyst', department: 'Finance', status: 'paused' },
  ],
  Job: {},
}));

vi.mock('../data/applicants', () => ({
  DUMMY_APPLICANTS: [
    {
      id: 'APP-001',
      name: 'Dan Lee',
      email: 'dan@mail.com',
      phone: '',
      avatar: '',
      job: 'Dev',
      status: 'new',
      appliedDate: '2025-01-01',
      experience: '',
      resume: '',
      score: 0,
    },
    {
      id: 'APP-002',
      name: 'Eve Ray',
      email: 'eve@mail.com',
      phone: '',
      avatar: '',
      job: 'Design',
      status: 'shortlisted',
      appliedDate: '2025-01-01',
      experience: '',
      resume: '',
      score: 0,
    },
    {
      id: 'APP-003',
      name: 'Frank May',
      email: 'frank@mail.com',
      phone: '',
      avatar: '',
      job: 'HR',
      status: 'hired',
      appliedDate: '2025-01-01',
      experience: '',
      resume: '',
      score: 0,
    },
  ],
  Applicant: {},
}));

import { useHRData } from './useHRData';

describe('useHRData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes with employees from dummy data', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.employees.length).toBe(3);
    });

    it('initializes with dummy jobs', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.jobs.length).toBe(3);
    });

    it('initializes with applicants from dummy data', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.applicants.length).toBe(3);
    });
  });

  describe('stats', () => {
    it('computes totalEmployees', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.stats.totalEmployees).toBe(3);
    });

    it('computes activeEmployees', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.stats.activeEmployees).toBe(2);
    });

    it('computes onLeave count', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.stats.onLeave).toBe(1);
    });

    it('computes openPositions', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.stats.openPositions).toBe(1);
    });

    it('computes totalApplicants', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.stats.totalApplicants).toBe(3);
    });
  });

  describe('departments', () => {
    it('extracts unique departments', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.departments).toContain('Sales');
      expect(result.current.departments).toContain('Engineering');
    });
  });

  describe('employee filtering', () => {
    it('filters by search query (name)', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setSearchQuery('alice');
      });
      expect(result.current.filteredEmployees.length).toBe(1);
      expect(result.current.filteredEmployees[0].name).toBe('Alice Smith');
    });

    it('filters by department', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setFilterDepartment('Sales');
      });
      expect(result.current.filteredEmployees.length).toBe(2);
    });

    it('combines search + department filter', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setSearchQuery('carol');
        result.current.setFilterDepartment('Sales');
      });
      expect(result.current.filteredEmployees.length).toBe(1);
    });

    it('returns all employees with "all" department', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.filteredEmployees.length).toBe(3);
    });
  });

  describe('job filtering', () => {
    it('filters jobs by status', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setFilterJobStatus('open');
      });
      expect(result.current.filteredJobs.length).toBe(1);
    });

    it('returns all jobs with "all" status', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.filteredJobs.length).toBe(3);
    });
  });

  describe('applicant filtering', () => {
    it('filters applicants by status', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setFilterApplicantStatus('new');
      });
      expect(result.current.filteredApplicants.length).toBe(1);
    });

    it('filters applicants by search query', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setSearchQuery('eve');
      });
      expect(result.current.filteredApplicants.length).toBe(1);
    });
  });

  describe('status helpers', () => {
    it('returns green for active status', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.getStatusColor('active')).toBe('#10b981');
    });

    it('returns amber for on_leave status', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.getStatusColor('on_leave')).toBe('#f59e0b');
    });

    it('returns red for terminated status', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.getStatusColor('terminated')).toBe('#ef4444');
    });

    it('returns grey for unknown status', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.getStatusColor('unknown')).toBe('#6b7280');
    });

    it('returns correct job status badge for open', () => {
      const { result } = renderHook(() => useHRData());
      const badge = result.current.getJobStatusBadge('open');
      expect(badge.color).toBe('#10b981');
    });

    it('returns correct applicant status badge for hired', () => {
      const { result } = renderHook(() => useHRData());
      const badge = result.current.getApplicantStatusBadge('hired');
      expect(badge.color).toBe('#10b981');
    });

    it('returns correct applicant status badge for rejected', () => {
      const { result } = renderHook(() => useHRData());
      const badge = result.current.getApplicantStatusBadge('rejected');
      expect(badge.color).toBe('#ef4444');
    });
  });

  describe('CRUD - employees', () => {
    it('adds an employee', () => {
      const { result } = renderHook(() => useHRData());
      let emp: ReturnType<typeof result.current.addEmployee>;
      act(() => {
        emp = result.current.addEmployee({ name: 'New Emp', department: 'Sales' });
      });
      expect(result.current.employees.length).toBe(4);
      expect(emp.status).toBe('active');
      expect(emp.id).toMatch(/^EMP-/);
    });

    it('updates an employee', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.updateEmployee('EMP-001', { position: 'Director' });
      });
      expect(result.current.employees.find(e => e.id === 'EMP-001')?.position).toBe('Director');
    });

    it('deletes an employee', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.deleteEmployee('EMP-002');
      });
      expect(result.current.employees.length).toBe(2);
      expect(result.current.employees.find(e => e.id === 'EMP-002')).toBeUndefined();
    });
  });

  describe('CRUD - jobs', () => {
    it('adds a job', () => {
      const { result } = renderHook(() => useHRData());
      let job: ReturnType<typeof result.current.addJob>;
      act(() => {
        job = result.current.addJob({ title: 'New Job', department: 'HR' });
      });
      expect(result.current.jobs.length).toBe(4);
      expect(job.status).toBe('open');
      expect(job.id).toMatch(/^JOB-/);
    });

    it('updates a job', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.updateJob('JOB-001', { status: 'closed' });
      });
      expect(result.current.jobs.find(j => j.id === 'JOB-001')?.status).toBe('closed');
    });

    it('deletes a job', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.deleteJob('JOB-002');
      });
      expect(result.current.jobs.length).toBe(2);
    });
  });

  describe('CRUD - applicants', () => {
    it('adds an applicant', () => {
      const { result } = renderHook(() => useHRData());
      let app: ReturnType<typeof result.current.addApplicant>;
      act(() => {
        app = result.current.addApplicant({ name: 'Gina', email: 'g@m.com' });
      });
      expect(result.current.applicants.length).toBe(4);
      expect(app.status).toBe('new');
      expect(app.id).toMatch(/^APP-/);
    });

    it('updates an applicant', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.updateApplicant('APP-001', { status: 'interviewed' });
      });
      expect(result.current.applicants.find(a => a.id === 'APP-001')?.status).toBe('interviewed');
    });

    it('deletes an applicant', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.deleteApplicant('APP-003');
      });
      expect(result.current.applicants.length).toBe(2);
    });
  });

  describe('modal states', () => {
    it('toggles employee modal', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.showEmployeeModal).toBe(false);
      act(() => {
        result.current.setShowEmployeeModal(true);
      });
      expect(result.current.showEmployeeModal).toBe(true);
    });

    it('toggles job modal', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setShowJobModal(true);
      });
      expect(result.current.showJobModal).toBe(true);
    });

    it('toggles applicant modal', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setShowApplicantModal(true);
      });
      expect(result.current.showApplicantModal).toBe(true);
    });

    it('sets selected employee', () => {
      const { result } = renderHook(() => useHRData());
      act(() => {
        result.current.setSelectedEmployee(result.current.employees[0]);
      });
      expect(result.current.selectedEmployee?.id).toBe('EMP-001');
    });

    it('nancy active state', () => {
      const { result } = renderHook(() => useHRData());
      expect(result.current.nancyActive).toBe(true);
      act(() => {
        result.current.setNancyActive(false);
      });
      expect(result.current.nancyActive).toBe(false);
    });
  });
});
