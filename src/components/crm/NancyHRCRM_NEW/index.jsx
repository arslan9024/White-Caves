import React, { useState, Suspense, lazy } from 'react';
import {
  Bot,
  Users,
  Briefcase,
  Calendar,
  Award,
  Clock,
  Plus,
  PenTool,
  Zap,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { useHRData } from './hooks/useHRData';
import { NANCY_FEATURES } from './data/features';
import SuspenseLoader from '../../common/SuspenseLoader';
import './NancyHRCRM.css';

// Lazy-loaded tabs
const EmployeesTab = lazy(() => import('./tabs/EmployeesTab'));
const JobBoardTab = lazy(() => import('./tabs/JobBoardTab'));
const ApplicantsTab = lazy(() => import('./tabs/ApplicantsTab'));
const AttendanceTab = lazy(() => import('./tabs/AttendanceTab'));
const PerformanceTab = lazy(() => import('./tabs/PerformanceTab'));
const PostJobTab = lazy(() => import('./tabs/PostJobTab'));
const FeaturesTab = lazy(() => import('./tabs/FeaturesTab'));

export default function NancyHRCRM() {
  const [activeTab, setActiveTab] = useState('employees');
  const state = useHRData();

  const { stats, nancyActive, setNancyActive } = state;

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
          className={`nancy-tab ${activeTab === 'post-job' ? 'active' : ''}`}
          onClick={() => setActiveTab('post-job')}
        >
          <PenTool size={16} />
          Post Job
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
        <Suspense fallback={<SuspenseLoader />}>
          {activeTab === 'employees' && <EmployeesTab state={state} />}
          {activeTab === 'careers' && <JobBoardTab state={state} />}
          {activeTab === 'applicants' && <ApplicantsTab state={state} />}
          {activeTab === 'attendance' && <AttendanceTab state={state} />}
          {activeTab === 'performance' && <PerformanceTab state={state} />}
          {activeTab === 'post-job' && <PostJobTab state={state} />}
          {activeTab === 'features' && <FeaturesTab />}
        </Suspense>
      </div>
    </div>
  );
}
