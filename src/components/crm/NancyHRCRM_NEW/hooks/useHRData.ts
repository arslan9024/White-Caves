import { useState, useCallback } from 'react';
import { DUMMY_EMPLOYEES, Employee } from '../data/employees';
import { DUMMY_JOBS, Job } from '../data/jobs';
import { DUMMY_APPLICANTS, Applicant } from '../data/applicants';

export const useHRData = () => {
  // State management
  const [employees, setEmployees] = useState<Employee[]>(DUMMY_EMPLOYEES);
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);
  const [applicants, setApplicants] = useState<Applicant[]>(DUMMY_APPLICANTS);
  
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

  // Filter employees
  const filteredEmployees = useCallback(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, filterDepartment]);

  // Filter jobs
  const filteredJobs = useCallback(() => {
    return jobs.filter(job => {
      const matchesStatus = filterJobStatus === 'all' || job.status === filterJobStatus;
      return matchesStatus;
    });
  }, [jobs, filterJobStatus]);

  // Filter applicants
  const filteredApplicants = useCallback(() => {
    return applicants.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterApplicantStatus === 'all' || app.status === filterApplicantStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchQuery, filterApplicantStatus]);

  // Get unique departments
  const departments = Array.from(new Set(employees.map(e => e.department)));

  // Stats calculation
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length,
    openPositions: jobs.filter(j => j.status === 'open').length,
    totalApplicants: applicants.length
  };

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

  // CRUD operations
  const addEmployee = useCallback((newEmployee: Partial<Employee>) => {
    const employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      ...newEmployee,
      status: newEmployee.status || 'active'
    };
    setEmployees([...employees, employee]);
    return employee;
  }, [employees]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  }, [employees]);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  }, [employees]);

  const addJob = useCallback((newJob: Partial<Job>) => {
    const job = {
      id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
      ...newJob,
      status: newJob.status || 'open'
    };
    setJobs([...jobs, job]);
    return job;
  }, [jobs]);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...updates } : job));
  }, [jobs]);

  const deleteJob = useCallback((id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  }, [jobs]);

  const addApplicant = useCallback((newApplicant: Partial<Applicant>) => {
    const applicant = {
      id: `APP-${String(applicants.length + 1).padStart(3, '0')}`,
      ...newApplicant,
      status: newApplicant.status || 'new'
    };
    setApplicants([...applicants, applicant]);
    return applicant;
  }, [applicants]);

  const updateApplicant = useCallback((id: string, updates: Partial<Applicant>) => {
    setApplicants(applicants.map(app => app.id === id ? { ...app, ...updates } : app));
  }, [applicants]);

  const deleteApplicant = useCallback((id: string) => {
    setApplicants(applicants.filter(app => app.id !== id));
  }, [applicants]);

  return {
    // Data
    employees,
    jobs,
    applicants,
    departments,
    stats,
    
    // Filters
    filteredEmployees: filteredEmployees(),
    filteredJobs: filteredJobs(),
    filteredApplicants: filteredApplicants(),
    
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
