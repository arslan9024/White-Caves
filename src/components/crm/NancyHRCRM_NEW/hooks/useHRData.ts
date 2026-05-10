import { useState, useCallback, useMemo, useEffect } from 'react';
import { DUMMY_EMPLOYEES, Employee } from '../data/employees';
import { DUMMY_JOBS, Job } from '../data/jobs';
import { DUMMY_APPLICANTS, Applicant } from '../data/applicants';
import { authFetch } from '../../../../utils/authFetch';

interface UserApiItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  status: string;
  photoUrl: string | null;
  createdAt: string;
}

interface JobAppApiItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  experience: string | null;
  resumeUrl: string | null;
  status: string;
  createdAt: string;
}

function mapUserToEmployee(u: UserApiItem): Employee {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone ?? '',
    avatar: u.photoUrl ?? '',
    position: u.role,
    department: u.department ?? 'General',
    status: u.status === 'active' ? 'active' : u.status === 'suspended' ? 'terminated' : 'active',
    joinDate: u.createdAt,
    salary: 0,
    manager: '',
    location: 'Dubai',
    performance: 0,
    leaveBalance: 0,
    attendance: 0,
  };
}

function mapApplicantStatus(s: string): Applicant['status'] {
  switch (s) {
    case 'shortlisted':
      return 'shortlisted';
    case 'interview':
      return 'interviewed';
    case 'offered':
    case 'hired':
      return 'hired';
    case 'rejected':
      return 'rejected';
    default:
      return 'new';
  }
}

function mapJobAppToApplicant(a: JobAppApiItem): Applicant {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone ?? '',
    avatar: '',
    job: a.position,
    status: mapApplicantStatus(a.status),
    appliedDate: a.createdAt,
    experience: a.experience ?? '',
    resume: a.resumeUrl ?? '',
    score: 0,
  };
}

export const useHRData = () => {
  // Only use dummy data in development — production fetches from API
  const [employees, setEmployees] = useState<Employee[]>(import.meta.env.DEV ? DUMMY_EMPLOYEES : []);
  const [jobs, setJobs] = useState<Job[]>(import.meta.env.DEV ? DUMMY_JOBS : []);
  const [applicants, setApplicants] = useState<Applicant[]>(import.meta.env.DEV ? DUMMY_APPLICANTS : []);

  useEffect(() => {
    if (import.meta.env.DEV) return;

    let cancelled = false;

    Promise.all([
      authFetch('/api/users?pageSize=50').then((r: Response) => r.json() as Promise<{ data?: UserApiItem[] }>),
      authFetch('/api/job-applications?pageSize=50').then(
        (r: Response) => r.json() as Promise<{ data?: JobAppApiItem[] }>
      ),
    ])
      .then(([usersRes, appsRes]) => {
        if (cancelled) return;
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const apps = Array.isArray(appsRes.data) ? appsRes.data : [];
        setEmployees(users.map(mapUserToEmployee));
        setApplicants(apps.map(mapJobAppToApplicant));
      })
      .catch(() => {
        // Keep empty production state if API request fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterJobStatus, setFilterJobStatus] = useState<string>('all');
  const [filterApplicantStatus, setFilterApplicantStatus] = useState<string>('all');
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [showApplicantModal, setShowApplicantModal] = useState<boolean>(false);
  const [nancyActive, setNancyActive] = useState<boolean>(true);

  // Filter employees (memoized for stable references)
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, filterDepartment]);

  // Filter jobs (memoized for stable references)
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesStatus = filterJobStatus === 'all' || job.status === filterJobStatus;
      return matchesStatus;
    });
  }, [jobs, filterJobStatus]);

  // Filter applicants (memoized for stable references)
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterApplicantStatus === 'all' || app.status === filterApplicantStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchQuery, filterApplicantStatus]);

  // Get unique departments (memoized)
  const departments = useMemo(
    () => Array.from(new Set(employees.map(e => e.department))),
    [employees]
  );

  // Stats calculation (memoized)
  const stats = useMemo(() => ({
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length,
    openPositions: jobs.filter(j => j.status === 'open').length,
    totalApplicants: applicants.length
  }), [employees, jobs, applicants]);

  // Helper functions for status badges
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'on_leave': return '#f59e0b';
      case 'terminated': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getJobStatusBadge = (status: string): { bg: string; color: string } => {
    switch (status) {
      case 'open': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'closed': return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
      case 'paused': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  const getApplicantStatusBadge = (status: string): { bg: string; color: string } => {
    switch (status) {
      case 'new': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' };
      case 'shortlisted': return { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' };
      case 'interviewed': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'hired': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'rejected': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  // CRUD operations — use functional updaters to avoid stale closures
  const addEmployee = useCallback((newEmployee: Partial<Employee>) => {
    const employee = {
      id: `EMP-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      ...newEmployee,
      status: newEmployee.status || 'active'
    } as Employee;
    setEmployees(prev => [...prev, employee]);
    return employee;
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  const addJob = useCallback((newJob: Partial<Job>) => {
    const job = {
      id: `JOB-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      ...newJob,
      status: newJob.status || 'open'
    } as Job;
    setJobs(prev => [...prev, job]);
    return job;
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  const addApplicant = useCallback((newApplicant: Partial<Applicant>) => {
    const applicant = {
      id: `APP-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      ...newApplicant,
      status: newApplicant.status || 'new'
    } as Applicant;
    setApplicants(prev => [...prev, applicant]);
    return applicant;
  }, []);

  const updateApplicant = useCallback((id: string, updates: Partial<Applicant>) => {
    setApplicants(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  }, []);

  const deleteApplicant = useCallback((id: string) => {
    setApplicants(prev => prev.filter(app => app.id !== id));
  }, []);

  return {
    // Data
    employees,
    jobs,
    applicants,
    departments,
    stats,
    
    // Filters
    filteredEmployees,
    filteredJobs,
    filteredApplicants,
    
    // Search & Filter states
    searchQuery,
    setSearchQuery,
    filterDepartment,
    setFilterDepartment,
    filterJobStatus,
    setFilterJobStatus,
    filterApplicantStatus,
    setFilterApplicantStatus,
    
    // Selection states
    selectedEmployee,
    setSelectedEmployee,
    selectedJob,
    setSelectedJob,
    selectedApplicant,
    setSelectedApplicant,
    
    // Modal states
    showEmployeeModal,
    setShowEmployeeModal,
    showJobModal,
    setShowJobModal,
    showApplicantModal,
    setShowApplicantModal,
    
    // Nancy activation state
    nancyActive,
    setNancyActive,
    
    // Helper functions
    getStatusColor,
    getJobStatusBadge,
    getApplicantStatusBadge,
    
    // CRUD operations
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addJob,
    updateJob,
    deleteJob,
    addApplicant,
    updateApplicant,
    deleteApplicant
  };
};
