import React, { useState } from 'react';
import { 
  Bot, Users, Briefcase, Calendar, Award, Clock, FileText,
  Search, Plus, Edit, Trash2, Eye, Mail, Phone, MapPin,
  ChevronDown, Filter, Download, Upload, CheckCircle, XCircle,
  Building, GraduationCap, DollarSign, Star, UserPlus, Send, Zap
} from 'lucide-react';
import AssistantFeatureMatrix from './shared/AssistantFeatureMatrix';
import { NANCY_FEATURES } from './data/assistantFeatures';
import './NancyHRCRM.css';

const DUMMY_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@whitecaves.ae',
    phone: '+971501234567',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    position: 'Senior Property Consultant',
    department: 'Sales',
    status: 'active',
    joinDate: '2022-03-15',
    salary: 25000,
    manager: 'Ahmed Al Rashid',
    location: 'Dubai Marina Office',
    performance: 92,
    leaveBalance: 18,
    attendance: 98
  },
  {
    id: 'EMP-002',
    name: 'Mohammed Al Zahrani',
    email: 'mohammed.z@whitecaves.ae',
    phone: '+971507654321',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    position: 'Leasing Manager',
    department: 'Leasing',
    status: 'active',
    joinDate: '2021-06-01',
    salary: 35000,
    manager: 'Fatima Hassan',
    location: 'Downtown Office',
    performance: 88,
    leaveBalance: 12,
    attendance: 95
  },
  {
    id: 'EMP-003',
    name: 'Aisha Khan',
    email: 'aisha.khan@whitecaves.ae',
    phone: '+971509876543',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    position: 'Marketing Specialist',
    department: 'Marketing',
    status: 'active',
    joinDate: '2023-01-10',
    salary: 18000,
    manager: 'Omar Malik',
    location: 'Dubai Marina Office',
    performance: 95,
    leaveBalance: 22,
    attendance: 100
  },
  {
    id: 'EMP-004',
    name: 'James Wilson',
    email: 'james.w@whitecaves.ae',
    phone: '+971505551234',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    position: 'Finance Officer',
    department: 'Finance',
    status: 'on_leave',
    joinDate: '2020-09-20',
    salary: 30000,
    manager: 'Sarah Al Maktoum',
    location: 'Head Office',
    performance: 85,
    leaveBalance: 5,
    attendance: 92
  },
  {
    id: 'EMP-005',
    name: 'Layla Ahmed',
    email: 'layla.a@whitecaves.ae',
    phone: '+971508889999',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    position: 'Legal Counsel',
    department: 'Legal',
    status: 'active',
    joinDate: '2022-07-15',
    salary: 40000,
    manager: 'CEO',
    location: 'Head Office',
    performance: 90,
    leaveBalance: 15,
    attendance: 97
  }
];

const DUMMY_JOBS = [
  {
    id: 'JOB-001',
    title: 'Senior Sales Agent',
    department: 'Sales',
    location: 'Dubai Marina',
    type: 'Full-time',
    salary: '20,000 - 30,000 AED',
    status: 'open',
    applicants: 45,
    shortlisted: 8,
    interviewed: 3,
    posted: '2024-01-05',
    deadline: '2024-02-15',
    requirements: ['5+ years experience', 'RERA certified', 'Strong negotiation skills']
  },
  {
    id: 'JOB-002',
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'Downtown Dubai',
    type: 'Full-time',
    salary: '25,000 - 35,000 AED',
    status: 'open',
    applicants: 67,
    shortlisted: 12,
    interviewed: 5,
    posted: '2024-01-10',
    deadline: '2024-02-20',
    requirements: ['3+ years in real estate marketing', 'SEO/SEM expertise', 'Creative portfolio']
  },
  {
    id: 'JOB-003',
    title: 'Property Manager',
    department: 'Operations',
    location: 'Palm Jumeirah',
    type: 'Full-time',
    salary: '18,000 - 25,000 AED',
    status: 'closed',
    applicants: 32,
    shortlisted: 6,
    interviewed: 4,
    posted: '2023-12-01',
    deadline: '2024-01-15',
    requirements: ['Property management experience', 'Customer service skills', 'UAE driving license']
  }
];

const DUMMY_APPLICANTS = [
  {
    id: 'APP-001',
    name: 'Khalid Rahman',
    email: 'khalid.r@email.com',
    phone: '+971501112233',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    job: 'Senior Sales Agent',
    status: 'interviewed',
    appliedDate: '2024-01-08',
    experience: '6 years',
    resume: 'resume_khalid.pdf',
    score: 85
  },
  {
    id: 'APP-002',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    phone: '+971504445566',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    job: 'Digital Marketing Manager',
    status: 'shortlisted',
    appliedDate: '2024-01-12',
    experience: '4 years',
    resume: 'resume_priya.pdf',
    score: 78
  },
  {
    id: 'APP-003',
    name: 'David Chen',
    email: 'david.c@email.com',
    phone: '+971507778899',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    job: 'Senior Sales Agent',
    status: 'new',
    appliedDate: '2024-01-15',
    experience: '8 years',
    resume: 'resume_david.pdf',
    score: 92
  }
];

export default function NancyHRCRM() {
  const [activeTab, setActiveTab] = useState('employees');
  const [nancyActive, setNancyActive] = useState(true);
  const [employees] = useState(DUMMY_EMPLOYEES);
  const [jobs] = useState(DUMMY_JOBS);
  const [applicants] = useState(DUMMY_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'on_leave': return '#f59e0b';
      case 'terminated': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getJobStatusBadge = (status) => {
    switch (status) {
      case 'open': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'closed': return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
      case 'paused': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  const getApplicantStatusBadge = (status) => {
    switch (status) {
      case 'new': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' };
      case 'shortlisted': return { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' };
      case 'interviewed': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'hired': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'rejected': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(employees.map(e => e.department))];

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length,
    openPositions: jobs.filter(j => j.status === 'open').length,
    totalApplicants: applicants.length
  };

  return (
    <div className="nancy-crm-container">
      <div className="nancy-header">
        <div className="nancy-title">
          <div className="nancy-avatar">
            <Bot size={24} />
          </div>
          <div className="nancy-details">
            <h2>Nancy - HR Manager</h2>
            <span className={`nancy-status ${nancyActive ? 'active' : 'inactive'}`}>
              {nancyActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>
        </div>
        <div className="nancy-actions">
          <button 
            className={`nancy-toggle ${nancyActive ? 'active' : ''}`}
            onClick={() => setNancyActive(!nancyActive)}
          >
            {nancyActive ? 'Pause Nancy' : 'Activate Nancy'}
          </button>
        </div>
      </div>

      <div className="nancy-stats">
        <div className="stat-card">
          <Users size={20} />
          <div className="stat-info">
            <span className="stat-value">{stats.totalEmployees}</span>
            <span className="stat-label">Total Employees</span>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={20} />
          <div className="stat-info">
            <span className="stat-value">{stats.activeEmployees}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={20} />
          <div className="stat-info">
            <span className="stat-value">{stats.onLeave}</span>
            <span className="stat-label">On Leave</span>
          </div>
        </div>
        <div className="stat-card">
          <Briefcase size={20} />
          <div className="stat-info">
            <span className="stat-value">{stats.openPositions}</span>
            <span className="stat-label">Open Positions</span>
          </div>
        </div>
        <div className="stat-card">
          <UserPlus size={20} />
          <div className="stat-info">
            <span className="stat-value">{stats.totalApplicants}</span>
            <span className="stat-label">Applicants</span>
          </div>
        </div>
      </div>

      <div className="nancy-tabs">
        <button 
          className={`nancy-tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <Users size={16} />
          Employees
        </button>
        <button 
          className={`nancy-tab ${activeTab === 'careers' ? 'active' : ''}`}
          onClick={() => setActiveTab('careers')}
        >
          <Briefcase size={16} />
          Job Board
        </button>
        <button 
          className={`nancy-tab ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          <UserPlus size={16} />
          Applicants
        </button>
        <button 
          className={`nancy-tab ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Calendar size={16} />
          Attendance
        </button>
        <button 
          className={`nancy-tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <Award size={16} />
          Performance
        </button>
        <button 
          className={`nancy-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          <Zap size={16} />
          Features ({NANCY_FEATURES.length})
        </button>
      </div>

      <div className="nancy-content">
        {activeTab === 'employees' && (
          <div className="employees-view">
            <div className="view-header">
              <div className="search-filter">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="view-actions">
                <button className="action-btn secondary">
                  <Download size={16} /> Export
                </button>
                <button className="action-btn primary">
                  <Plus size={16} /> Add Employee
                </button>
              </div>
            </div>

            <div className="employees-table-wrapper">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-cell">
                          <img src={emp.avatar} alt={emp.name} className="employee-avatar" />
                          <div className="employee-info">
                            <span className="employee-name">{emp.name}</span>
                            <span className="employee-email">{emp.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{emp.position}</td>
                      <td>
                        <span className="dept-badge">{emp.department}</span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: `${getStatusColor(emp.status)}20`,
                            color: getStatusColor(emp.status)
                          }}
                        >
                          {emp.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="performance-cell">
                          <div className="perf-bar">
                            <div 
                              className="perf-fill" 
                              style={{ 
                                width: `${emp.performance}%`,
                                backgroundColor: emp.performance >= 90 ? '#10b981' : 
                                                emp.performance >= 70 ? '#f59e0b' : '#ef4444'
                              }}
                            />
                          </div>
                          <span>{emp.performance}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" onClick={() => { setSelectedEmployee(emp); setShowEmployeeModal(true); }}>
                            <Eye size={16} />
                          </button>
                          <button className="icon-btn">
                            <Edit size={16} />
                          </button>
                          <button className="icon-btn danger">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="careers-view">
            <div className="view-header">
              <h3>Open Positions</h3>
              <button className="action-btn primary">
                <Plus size={16} /> Post New Job
              </button>
            </div>

            <div className="jobs-grid">
              {jobs.map(job => {
                const statusStyle = getJobStatusBadge(job.status);
                return (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div className="job-title-section">
                        <h4>{job.title}</h4>
                        <span 
                          className="job-status"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                        >
                          {job.status}
                        </span>
                      </div>
                      <span className="job-id">{job.id}</span>
                    </div>

                    <div className="job-details">
                      <div className="job-detail">
                        <Building size={14} />
                        <span>{job.department}</span>
                      </div>
                      <div className="job-detail">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <div className="job-detail">
                        <DollarSign size={14} />
                        <span>{job.salary}</span>
                      </div>
                      <div className="job-detail">
                        <Clock size={14} />
                        <span>{job.type}</span>
                      </div>
                    </div>

                    <div className="job-requirements">
                      {job.requirements.slice(0, 2).map((req, i) => (
                        <span key={i} className="requirement-tag">{req}</span>
                      ))}
                      {job.requirements.length > 2 && (
                        <span className="requirement-tag more">+{job.requirements.length - 2}</span>
                      )}
                    </div>

                    <div className="job-stats">
                      <div className="job-stat">
                        <span className="stat-num">{job.applicants}</span>
                        <span className="stat-text">Applied</span>
                      </div>
                      <div className="job-stat">
                        <span className="stat-num">{job.shortlisted}</span>
                        <span className="stat-text">Shortlisted</span>
                      </div>
                      <div className="job-stat">
                        <span className="stat-num">{job.interviewed}</span>
                        <span className="stat-text">Interviewed</span>
                      </div>
                    </div>

                    <div className="job-footer">
                      <span className="job-date">Posted: {job.posted}</span>
                      <div className="job-actions">
                        <button className="job-btn"><Eye size={14} /> View</button>
                        <button className="job-btn"><Edit size={14} /> Edit</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="applicants-view">
            <div className="view-header">
              <h3>Recent Applicants</h3>
              <div className="view-actions">
                <button className="action-btn secondary">
                  <Filter size={16} /> Filter
                </button>
                <button className="action-btn secondary">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            <div className="applicants-list">
              {applicants.map(app => {
                const statusStyle = getApplicantStatusBadge(app.status);
                return (
                  <div key={app.id} className="applicant-card">
                    <div className="applicant-main">
                      <img src={app.avatar} alt={app.name} className="applicant-avatar" />
                      <div className="applicant-info">
                        <h4>{app.name}</h4>
                        <p className="applicant-job">Applied for: {app.job}</p>
                        <div className="applicant-contact">
                          <span><Mail size={12} /> {app.email}</span>
                          <span><Phone size={12} /> {app.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="applicant-details">
                      <div className="detail-item">
                        <label>Experience</label>
                        <span>{app.experience}</span>
                      </div>
                      <div className="detail-item">
                        <label>Applied</label>
                        <span>{app.appliedDate}</span>
                      </div>
                      <div className="detail-item">
                        <label>AI Score</label>
                        <span className="score">{app.score}/100</span>
                      </div>
                      <div className="detail-item">
                        <label>Status</label>
                        <span 
                          className="status-tag"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>

                    <div className="applicant-actions">
                      <button className="app-btn view"><Eye size={14} /> Profile</button>
                      <button className="app-btn resume"><FileText size={14} /> Resume</button>
                      <button className="app-btn email"><Send size={14} /> Email</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-view">
            <div className="view-header">
              <h3>Attendance Overview</h3>
              <div className="date-selector">
                <input type="month" defaultValue="2024-01" />
              </div>
            </div>

            <div className="attendance-summary">
              <div className="attendance-card">
                <div className="att-icon green"><CheckCircle size={24} /></div>
                <div className="att-info">
                  <span className="att-value">96.5%</span>
                  <span className="att-label">Average Attendance</span>
                </div>
              </div>
              <div className="attendance-card">
                <div className="att-icon blue"><Calendar size={24} /></div>
                <div className="att-info">
                  <span className="att-value">22</span>
                  <span className="att-label">Working Days</span>
                </div>
              </div>
              <div className="attendance-card">
                <div className="att-icon orange"><Clock size={24} /></div>
                <div className="att-info">
                  <span className="att-value">15</span>
                  <span className="att-label">Late Arrivals</span>
                </div>
              </div>
              <div className="attendance-card">
                <div className="att-icon red"><XCircle size={24} /></div>
                <div className="att-info">
                  <span className="att-value">8</span>
                  <span className="att-label">Absences</span>
                </div>
              </div>
            </div>

            <div className="attendance-table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Leave</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="employee-cell">
                          <img src={emp.avatar} alt={emp.name} className="employee-avatar small" />
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td>20</td>
                      <td>1</td>
                      <td>2</td>
                      <td>1</td>
                      <td>
                        <div className="attendance-bar">
                          <div 
                            className="att-fill" 
                            style={{ width: `${emp.attendance}%` }}
                          />
                          <span>{emp.attendance}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-view">
            <div className="view-header">
              <h3>Performance Reviews</h3>
              <button className="action-btn primary">
                <Plus size={16} /> New Review
              </button>
            </div>

            <div className="performance-grid">
              {employees.map(emp => (
                <div key={emp.id} className="performance-card">
                  <div className="perf-header">
                    <img src={emp.avatar} alt={emp.name} className="perf-avatar" />
                    <div className="perf-info">
                      <h4>{emp.name}</h4>
                      <p>{emp.position}</p>
                    </div>
                  </div>

                  <div className="perf-score">
                    <div className="score-circle" style={{
                      background: `conic-gradient(${emp.performance >= 90 ? '#10b981' : emp.performance >= 70 ? '#f59e0b' : '#ef4444'} ${emp.performance * 3.6}deg, var(--bg-tertiary) 0deg)`
                    }}>
                      <div className="score-inner">
                        <span>{emp.performance}</span>
                      </div>
                    </div>
                    <div className="score-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill={star <= Math.round(emp.performance / 20) ? '#f59e0b' : 'none'}
                          stroke={star <= Math.round(emp.performance / 20) ? '#f59e0b' : 'currentColor'}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="perf-metrics">
                    <div className="metric">
                      <span className="metric-label">Productivity</span>
                      <span className="metric-value">{Math.round(emp.performance * 0.95)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Quality</span>
                      <span className="metric-value">{Math.round(emp.performance * 1.02)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Teamwork</span>
                      <span className="metric-value">{Math.round(emp.performance * 0.98)}%</span>
                    </div>
                  </div>

                  <button className="view-review-btn">View Full Review</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <AssistantFeatureMatrix 
            features={NANCY_FEATURES}
            title="Nancy's HR Management Capabilities"
            accentColor="#ec4899"
            categories={['Workforce Management', 'Talent Acquisition', 'Performance', 'Analytics', 'Integrations']}
          />
        )}
      </div>

      {showEmployeeModal && selectedEmployee && (
        <div className="employee-modal-overlay" onClick={() => setShowEmployeeModal(false)}>
          <div className="employee-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEmployeeModal(false)}>
              <XCircle size={24} />
            </button>
            
            <div className="modal-header">
              <img src={selectedEmployee.avatar} alt={selectedEmployee.name} />
              <div className="modal-title">
                <h3>{selectedEmployee.name}</h3>
                <p>{selectedEmployee.position}</p>
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(selectedEmployee.status)}20`,
                    color: getStatusColor(selectedEmployee.status)
                  }}
                >
                  {selectedEmployee.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="modal-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Employee ID</label>
                  <span>{selectedEmployee.id}</span>
                </div>
                <div className="info-item">
                  <label>Department</label>
                  <span>{selectedEmployee.department}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="info-item">
                  <label>Join Date</label>
                  <span>{selectedEmployee.joinDate}</span>
                </div>
                <div className="info-item">
                  <label>Manager</label>
                  <span>{selectedEmployee.manager}</span>
                </div>
                <div className="info-item">
                  <label>Location</label>
                  <span>{selectedEmployee.location}</span>
                </div>
                <div className="info-item">
                  <label>Leave Balance</label>
                  <span>{selectedEmployee.leaveBalance} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
