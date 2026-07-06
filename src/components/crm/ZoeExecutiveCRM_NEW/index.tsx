import React, { Suspense } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Inbox,
  AlertCircle,
  ArrowUp,
  Search,
} from 'lucide-react';
import { ReactReduxContext } from 'react-redux';
import { selectSearchLeadCount } from '../../../store/slices/searchLeadsSlice';
import type { RootState } from '../../../store/store';
import { useExecutiveData } from './hooks/useExecutiveData';
import SuggestionsTab from './tabs/SuggestionsTab';
import CalendarTab from './tabs/CalendarTab';
import TasksTab from './tabs/TasksTab';
import ExecutivesTab from './tabs/ExecutivesTab';
import ReportsTab from './tabs/ReportsTab';
import '../AssistantDashboard.css';
import './ZoeExecutiveCRM.css';

const ZoeExecutiveCRM = () => {
  const {
    activeTab,
    setActiveTab,
    unreviewedCount,
    criticalSuggestions,
    filteredSuggestions,
    meetings,
    meetingSearch,
    setMeetingSearch,
    tasks,
    taskFilter,
    setTaskFilter,
    executives,
    funnelMetrics,
    complianceMetrics,
    vault,
    handleStatusChange,
    getUpcomingMeetings,
  } = useExecutiveData();

  const upcomingCount = getUpcomingMeetings().length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  // TASK-018 / Phase 27: Homepage search leads count from Redux
  const reduxContext = React.useContext(ReactReduxContext);
  const homepageSearchLeads = reduxContext?.store
    ? selectSearchLeadCount(reduxContext.store.getState() as RootState)
    : 0;

  return (
    <div className="assistant-dashboard zoe">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
        >
          <Briefcase size={28} />
        </div>
        <div className="assistant-info">
          <h2>Zoe - Executive Assistant & Strategic Intelligence</h2>
          <p>
            Strategic insights, executive inbox, calendar management, and cross-department
            intelligence
          </p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card glass-kpi-tile">
          <div
            className="stat-icon"
            style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06B6D4' }}
          >
            <Inbox size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{unreviewedCount || 0}</span>
            <span className="stat-label">Unreviewed Suggestions</span>
          </div>
          <span className="stat-change positive">
            <ArrowUp size={14} /> 5
          </span>
        </div>
        <div className="stat-card glass-kpi-tile">
          <div
            className="stat-icon"
            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
          >
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {(criticalSuggestions && criticalSuggestions.length) || 0}
            </span>
            <span className="stat-label">Critical Items</span>
          </div>
          <span className="stat-change warning">Urgent</span>
        </div>
        <div className="stat-card glass-kpi-tile">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}
          >
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{upcomingCount}</span>
            <span className="stat-label">Upcoming Meetings</span>
          </div>
          <span className="stat-change positive">
            <ArrowUp size={14} /> 2
          </span>
        </div>
        <div className="stat-card glass-kpi-tile">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {completedTasks}/{tasks.length}
            </span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <span className="stat-change positive">
            <ArrowUp size={14} /> 3
          </span>
        </div>
        {/* TASK-018 / Phase 27: Gold card for homepage search leads */}
        <div className="stat-card glass-kpi-tile">
          <div
            className="stat-icon"
            style={{ background: 'rgba(201, 168, 76, 0.2)', color: '#C9A84C' }}
          >
            <Search size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{homepageSearchLeads}</span>
            <span className="stat-label">Homepage Searches</span>
          </div>
          <span
            className="stat-change"
            style={{ color: homepageSearchLeads > 0 ? '#C9A84C' : '#6B7280' }}
          >
            {homepageSearchLeads > 0 ? `+${homepageSearchLeads}` : 'None yet'}
          </span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['suggestions', 'calendar', 'tasks', 'executives', 'reports'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {activeTab === 'suggestions' && (
            <SuggestionsTab
              suggestions={filteredSuggestions}
              unreviewedCount={unreviewedCount}
              criticalCount={(criticalSuggestions && criticalSuggestions.length) || 0}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab
              meetings={meetings}
              searchQuery={meetingSearch}
              onSearchChange={setMeetingSearch}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab tasks={tasks} filterStatus={taskFilter} onFilterChange={setTaskFilter} />
          )}

          {activeTab === 'executives' && <ExecutivesTab executives={executives} />}

          {activeTab === 'reports' && (
            <ReportsTab
              funnelMetrics={funnelMetrics}
              complianceMetrics={complianceMetrics}
              vault={vault}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default ZoeExecutiveCRM;
