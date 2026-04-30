import React, { Suspense } from 'react';
import { Briefcase, Calendar, CheckCircle, Users, BarChart3, Bell, Inbox, AlertCircle, ArrowUp, ArrowDown, GitBranch } from 'lucide-react';
import { useExecutiveData } from './hooks/useExecutiveData';
import SuggestionsTab from './tabs/SuggestionsTab';
import CalendarTab from './tabs/CalendarTab';
import TasksTab from './tabs/TasksTab';
import ExecutivesTab from './tabs/ExecutivesTab';
import ReportsTab from './tabs/ReportsTab';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
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
    getUpcomingMeetings
  } = useExecutiveData();

  const upcomingCount = getUpcomingMeetings().length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="assistant-dashboard zoe">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}>
          <Briefcase size={28} />
        </div>
        <div className="assistant-info">
          <h2>Zoe - Executive Assistant & Strategic Intelligence</h2>
          <p>Strategic insights, executive inbox, calendar management, and cross-department intelligence</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06B6D4' }}>
            <Inbox size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{unreviewedCount || 0}</span>
            <span className="stat-label">Unreviewed Suggestions</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 5</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{(criticalSuggestions && criticalSuggestions.length) || 0}</span>
            <span className="stat-label">Critical Items</span>
          </div>
          <span className="stat-change warning">Urgent</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{upcomingCount}</span>
            <span className="stat-label">Upcoming Meetings</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 2</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{completedTasks}/{tasks.length}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 3</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['suggestions', 'calendar', 'tasks', 'executives', 'reports', 'lifecycle'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'lifecycle' ? 'Lifecycle' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
            <TasksTab 
              tasks={tasks}
              filterStatus={taskFilter}
              onFilterChange={setTaskFilter}
            />
          )}

          {activeTab === 'executives' && (
            <ExecutivesTab executives={executives} />
          )}

          {activeTab === 'reports' && (
            <ReportsTab 
              funnelMetrics={funnelMetrics}
              complianceMetrics={complianceMetrics}
              vault={vault}
            />
          )}

          {activeTab === 'lifecycle' && (
            <AssistantLifecycleTab assistantId="zoe" color="#06B6D4" assistantName="Zoe" />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default ZoeExecutiveCRM;
