import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Briefcase, Calendar, Clock, CheckCircle, Users,
  Video, Phone, Mail, FileText, AlertCircle, Bell,
  ArrowUp, ArrowDown, Plus, Search, MapPin, Star,
  Filter, Inbox, TrendingUp, AlertTriangle, Lightbulb,
  DollarSign, Shield, Archive, Eye, ChevronRight, Zap,
  Building2, Network, Workflow, Bot, ChevronDown, Play
} from 'lucide-react';
import { AssistantDocsTab } from './shared';
import { FlowchartViewer } from './index';
import { EXECUTIVES, DIRECTORS, DEPARTMENTS_CONFIG } from '../../data/organization/orgStructure';
import { EMPLOYEES, WHATSAPP_AGENTS } from '../../data/organization/employees';
import { COMPANY_SERVICES, getAllServices, getServiceStats } from '../../data/services/companyServices';
import {
  selectFilteredSuggestions,
  selectUnreviewedSuggestionsCount,
  selectCriticalSuggestions,
  selectExecutiveSuggestions,
  updateSuggestionStatus,
  setSuggestionFilters,
  clearSuggestionFilters,
  selectLeadFunnelMetrics,
  selectComplianceMetrics,
  selectConfidentialVault
} from '../../store/slices/aiAssistantDashboardSlice';
import './AssistantDashboard.css';
import './ZoeExecutiveCRM.css';

const MEETINGS = [
  { id: 1, title: 'Board Meeting Q1 Review', time: '10:00 AM', duration: '2h', type: 'board', attendees: 8, location: 'Conference Room A', status: 'upcoming' },
  { id: 2, title: 'Client Meeting - Al Rashid Family', time: '2:00 PM', duration: '1h', type: 'client', attendees: 4, location: 'VIP Room', status: 'upcoming' },
  { id: 3, title: 'Marketing Strategy Review', time: '4:00 PM', duration: '45m', type: 'internal', attendees: 5, location: 'Zoom', status: 'upcoming' },
  { id: 4, title: 'Property Tour - Palm Jumeirah', time: '9:00 AM', duration: '3h', type: 'site_visit', attendees: 3, location: 'Palm Jumeirah', status: 'completed' }
];

const TASKS = [
  { id: 1, title: 'Review Q1 Financial Report', priority: 'high', dueDate: '2024-01-10', status: 'in_progress', assignee: 'CEO' },
  { id: 2, title: 'Approve Marketing Budget', priority: 'medium', dueDate: '2024-01-12', status: 'pending', assignee: 'CEO' },
  { id: 3, title: 'Sign Partnership Agreement', priority: 'high', dueDate: '2024-01-09', status: 'completed', assignee: 'CEO' },
  { id: 4, title: 'Review New Agent Applications', priority: 'low', dueDate: '2024-01-15', status: 'pending', assignee: 'CEO' }
];

const EXECUTIVES = [
  { id: 1, name: 'Arslan Malik', role: 'CEO & Founder', avatar: '👨‍💼', status: 'available' },
  { id: 2, name: 'Fatima Hassan', role: 'COO', avatar: '👩‍💼', status: 'in_meeting' },
  { id: 3, name: 'Ahmed Al Rashid', role: 'CFO', avatar: '👨‍💻', status: 'available' },
  { id: 4, name: 'Sarah Al Maktoum', role: 'CMO', avatar: '👩‍💻', status: 'busy' }
];

const ASSISTANT_COLORS = {
  clara: '#F59E0B',
  olivia: '#4FACFE',
  nancy: '#10B981',
  theodora: '#8B5CF6',
  mary: '#EC4899',
  linda: '#06B6D4',
  nina: '#EF4444',
  laila: '#6366F1',
  aurora: '#14B8A6',
  sophia: '#F97316',
  apex: '#FFD700'
};

const TYPE_ICONS = {
  process_improvement: TrendingUp,
  new_opportunity: Lightbulb,
  risk_alert: AlertTriangle,
  cost_saving: DollarSign
};

const ZoeExecutiveCRM = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('suggestions');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  
  const filteredSuggestions = useSelector(selectFilteredSuggestions);
  const unreviewedCount = useSelector(selectUnreviewedSuggestionsCount);
  const criticalSuggestions = useSelector(selectCriticalSuggestions);
  const { filters } = useSelector(selectExecutiveSuggestions);
  const funnelMetrics = useSelector(selectLeadFunnelMetrics);
  const complianceMetrics = useSelector(selectComplianceMetrics);
  const vault = useSelector(selectConfidentialVault);

  const handleStatusChange = useCallback((suggestionId, status) => {
    dispatch(updateSuggestionStatus({ suggestionId, status }));
    if (selectedSuggestion?.id === suggestionId) {
      setSelectedSuggestion(prev => ({ ...prev, status }));
    }
  }, [dispatch, selectedSuggestion]);

  const handleFilterChange = useCallback((filterType, value) => {
    dispatch(setSuggestionFilters({ [filterType]: value }));
  }, [dispatch]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getTypeIcon = (type) => {
    const IconComponent = TYPE_ICONS[type] || Lightbulb;
    return <IconComponent size={16} />;
  };

  return (
    <div className="assistant-dashboard zoe">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)' }}>
          <Briefcase size={28} />
        </div>
        <div className="assistant-info">
          <h2>Zoe - Executive Assistant</h2>
          <p>Strategic intelligence hub with AI-powered suggestions from all departments</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <Inbox size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{unreviewedCount}</span>
            <span className="stat-label">Pending Suggestions</span>
          </div>
          {criticalSuggestions.length > 0 && (
            <span className="stat-change warning">{criticalSuggestions.length} critical</span>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67, 233, 123, 0.2)', color: '#43E97B' }}>
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">8</span>
            <span className="stat-label">Meetings Today</span>
          </div>
          <span className="stat-change">3 remaining</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Tasks Pending</span>
          </div>
          <span className="stat-change warning">4 urgent</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">AI Assistants</span>
          </div>
          <span className="stat-change positive">All online</span>
        </div>
      </div>

      <div className="quick-stats secondary">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366F1' }}>
            <Shield size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{complianceMetrics.totalProfiles || 89}</span>
            <span className="stat-label">KYC Profiles</span>
          </div>
          <span className={`stat-change ${complianceMetrics.pendingReview > 5 ? 'warning' : 'positive'}`}>
            {complianceMetrics.pendingReview || 12} pending
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#EC4899' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{funnelMetrics.totalIncoming || 156}</span>
            <span className="stat-label">Lead Funnel</span>
          </div>
          <span className="stat-change positive">
            {Math.round((funnelMetrics.conversionRate || 0.23) * 100)}% conversion
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#14B8A6' }}>
            <Archive size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{vault.vaultStats?.totalDocuments || 3}</span>
            <span className="stat-label">Vault Documents</span>
          </div>
          <span className={`stat-change ${vault.vaultStats?.pendingRequests > 0 ? 'warning' : ''}`}>
            {vault.vaultStats?.pendingRequests || 0} requests
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#FB923C' }}>
            <Zap size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{funnelMetrics.rentVsSaleRatio || '58:42'}</span>
            <span className="stat-label">Rent vs Sale</span>
          </div>
          <span className="stat-change">Pipeline split</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['suggestions', 'organization', 'departments', 'services', 'calendar', 'tasks', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'suggestions' && <Inbox size={14} />}
            {tab === 'suggestions' && unreviewedCount > 0 && (
              <span className="tab-badge">{unreviewedCount}</span>
            )}
            {tab === 'organization' && <Network size={14} />}
            {tab === 'departments' && <Building2 size={14} />}
            {tab === 'services' && <Workflow size={14} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'suggestions' && (
          <div className="suggestions-view">
            {criticalSuggestions.length > 0 && (
              <div className="critical-alerts">
                <div className="alert-header">
                  <AlertTriangle size={18} />
                  <span>Priority Alerts ({criticalSuggestions.length})</span>
                </div>
                <div className="alert-list">
                  {criticalSuggestions.map(suggestion => (
                    <div 
                      key={suggestion.id} 
                      className="alert-card critical"
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      <div className="alert-content">
                        <span 
                          className="assistant-badge"
                          style={{ background: ASSISTANT_COLORS[suggestion.fromAssistant] }}
                        >
                          {suggestion.fromAssistant}
                        </span>
                        <span className="alert-title">{suggestion.title}</span>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="inbox-section">
              <div className="inbox-header">
                <h3><Inbox size={18} /> Suggestion Inbox</h3>
                <div className="filter-controls">
                  <div className="filter-group">
                    <Filter size={14} />
                    <select 
                      value={filters.priority || 'all'} 
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <select 
                      value={filters.department || 'all'} 
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="sales">Sales</option>
                      <option value="marketing">Marketing</option>
                      <option value="operations">Operations</option>
                      <option value="finance">Finance</option>
                      <option value="compliance">Compliance</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <select 
                      value={filters.status || 'unreviewed'} 
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="unreviewed">Unreviewed</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="escalated">Escalated</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="suggestions-layout">
                <div className="suggestions-list">
                  {filteredSuggestions.length === 0 ? (
                    <div className="empty-state">
                      <CheckCircle size={48} />
                      <p>No suggestions matching your filters</p>
                    </div>
                  ) : (
                    filteredSuggestions.map(suggestion => (
                      <div 
                        key={suggestion.id}
                        className={`suggestion-card ${selectedSuggestion?.id === suggestion.id ? 'selected' : ''} ${getPriorityClass(suggestion.priority)}`}
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        <div className="suggestion-header">
                          <span 
                            className="assistant-badge"
                            style={{ background: ASSISTANT_COLORS[suggestion.fromAssistant] }}
                          >
                            {suggestion.fromAssistant}
                          </span>
                          <span className={`priority-badge ${suggestion.priority}`}>
                            {suggestion.priority}
                          </span>
                          <span className="timestamp">{formatTimeAgo(suggestion.timestamp)}</span>
                        </div>
                        <div className="suggestion-body">
                          <div className="type-icon">{getTypeIcon(suggestion.type)}</div>
                          <div className="suggestion-content">
                            <h4>{suggestion.title}</h4>
                            <p className="analysis-preview">{suggestion.analysis.substring(0, 100)}...</p>
                          </div>
                        </div>
                        <div className="suggestion-footer">
                          <span className={`status-badge ${suggestion.status}`}>{suggestion.status}</span>
                          <span className="confidence">
                            <Zap size={12} /> {Math.round(suggestion.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedSuggestion && (
                  <div className="suggestion-detail">
                    <div className="detail-header">
                      <div className="header-top">
                        <span 
                          className="assistant-badge large"
                          style={{ background: ASSISTANT_COLORS[selectedSuggestion.fromAssistant] }}
                        >
                          From: {selectedSuggestion.fromAssistant.charAt(0).toUpperCase() + selectedSuggestion.fromAssistant.slice(1)}
                        </span>
                        <span className={`priority-badge large ${selectedSuggestion.priority}`}>
                          {selectedSuggestion.priority.toUpperCase()}
                        </span>
                      </div>
                      <h3>{selectedSuggestion.title}</h3>
                      <div className="detail-meta">
                        <span className="type-badge">
                          {getTypeIcon(selectedSuggestion.type)}
                          {selectedSuggestion.type.replace('_', ' ')}
                        </span>
                        <span className="department-badge">{selectedSuggestion.assistantDepartment}</span>
                        <span className="timestamp">{formatTimeAgo(selectedSuggestion.timestamp)}</span>
                      </div>
                    </div>

                    <div className="detail-body">
                      <div className="section">
                        <h4>Analysis</h4>
                        <p>{selectedSuggestion.analysis}</p>
                      </div>

                      <div className="section">
                        <h4>Data Sources</h4>
                        <ul className="data-points">
                          {selectedSuggestion.dataPoints?.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="section">
                        <h4>Projected Impact</h4>
                        <p className="impact">{selectedSuggestion.projectedImpact}</p>
                      </div>

                      <div className="confidence-meter">
                        <span>Confidence Score</span>
                        <div className="meter">
                          <div 
                            className="meter-fill"
                            style={{ width: `${selectedSuggestion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="score">{Math.round(selectedSuggestion.confidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="detail-actions">
                      <button 
                        className="action-btn primary"
                        onClick={() => handleStatusChange(selectedSuggestion.id, 'acknowledged')}
                      >
                        <Eye size={14} /> Acknowledge
                      </button>
                      <button 
                        className="action-btn warning"
                        onClick={() => handleStatusChange(selectedSuggestion.id, 'escalated')}
                      >
                        <AlertTriangle size={14} /> Escalate
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => handleStatusChange(selectedSuggestion.id, 'archived')}
                      >
                        <Archive size={14} /> Archive
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <div className="view-header">
              <h3>Today's Schedule - January 8, 2024</h3>
              <button className="add-btn"><Plus size={16} /> New Meeting</button>
            </div>
            <div className="meetings-list">
              {MEETINGS.map(meeting => (
                <div key={meeting.id} className={`meeting-card ${meeting.status}`}>
                  <div className="meeting-time">
                    <span className="time">{meeting.time}</span>
                    <span className="duration">{meeting.duration}</span>
                  </div>
                  <div className="meeting-details">
                    <h4>{meeting.title}</h4>
                    <div className="meeting-meta">
                      <span><Users size={12} /> {meeting.attendees} attendees</span>
                      <span><MapPin size={12} /> {meeting.location}</span>
                    </div>
                  </div>
                  <div className={`meeting-type ${meeting.type}`}>{meeting.type.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search tasks..." />
              </div>
              <button className="add-btn"><Plus size={16} /> Add Task</button>
            </div>
            <div className="tasks-list">
              {TASKS.map(task => (
                <div key={task.id} className={`task-card ${task.priority}`}>
                  <div className="task-checkbox">
                    {task.status === 'completed' ? <CheckCircle size={20} /> : <div className="checkbox"></div>}
                  </div>
                  <div className="task-details">
                    <h4 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h4>
                    <div className="task-meta">
                      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                      <span><Clock size={12} /> Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <div className={`task-status ${task.status}`}>{task.status.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'executives' && (
          <div className="executives-view">
            <h3>Executive Team</h3>
            <div className="executive-cards">
              {EXECUTIVES.map(exec => (
                <div key={exec.id} className="executive-card">
                  <div className="exec-avatar">{exec.avatar}</div>
                  <div className="exec-info">
                    <h4>{exec.name}</h4>
                    <p>{exec.role}</p>
                  </div>
                  <div className={`exec-status ${exec.status}`}>{exec.status.replace('_', ' ')}</div>
                  <div className="exec-actions">
                    <button><Calendar size={14} /></button>
                    <button><Mail size={14} /></button>
                    <button><Phone size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-view">
            <h3>Executive Reports</h3>
            <div className="reports-grid">
              <div className="report-card">
                <FileText size={24} />
                <h4>Weekly AI Intelligence Digest</h4>
                <p>Consolidated suggestions from all 12 AI assistants</p>
                <button className="action-btn secondary">Generate Report</button>
              </div>
              <div className="report-card">
                <TrendingUp size={24} />
                <h4>Performance Dashboard</h4>
                <p>KPIs and metrics across all departments</p>
                <button className="action-btn secondary">View Dashboard</button>
              </div>
              <div className="report-card">
                <Shield size={24} />
                <h4>Compliance Status</h4>
                <p>KYC/AML and regulatory compliance overview</p>
                <button className="action-btn secondary">Review Status</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="organization-view">
            <div className="org-header">
              <h3><Network size={18} /> Organization Chart</h3>
              <div className="org-stats">
                <span className="org-stat"><Users size={14} /> {EXECUTIVES.length} Executives</span>
                <span className="org-stat"><Building2 size={14} /> {DIRECTORS.length} Directors</span>
                <span className="org-stat"><Users size={14} /> {EMPLOYEES.length} Staff</span>
                <span className="org-stat"><Bot size={14} /> 24 AI Assistants</span>
              </div>
            </div>
            
            <div className="org-section">
              <h4>Executive Team</h4>
              <div className="org-cards">
                {EXECUTIVES.map(exec => (
                  <div key={exec.id} className="org-card executive">
                    <img src={exec.photo} alt={exec.name} className="org-avatar" />
                    <div className="org-info">
                      <h5>{exec.name}</h5>
                      <p className="org-role">{exec.role}</p>
                      <p className="org-bio">{exec.bio?.slice(0, 80)}...</p>
                    </div>
                    <div className={`org-status ${exec.status}`}>
                      <span className="status-dot"></span>
                      {exec.status?.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="org-section">
              <h4>Department Directors</h4>
              <div className="org-cards directors">
                {DIRECTORS.map(dir => (
                  <div key={dir.id} className="org-card director">
                    <img src={dir.photo} alt={dir.name} className="org-avatar small" />
                    <div className="org-info">
                      <h5>{dir.name}</h5>
                      <p className="org-role">{dir.role}</p>
                      <span className="team-size"><Users size={12} /> {dir.teamSize} team members</span>
                    </div>
                    <div className="org-assistants">
                      {dir.assignedAssistants?.slice(0, 3).map(a => (
                        <span key={a} className="assistant-chip">{a}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="departments-view">
            <div className="view-header">
              <h3><Building2 size={18} /> Department Overview</h3>
              <span className="dept-count">{Object.keys(DEPARTMENTS_CONFIG).length} Departments</span>
            </div>
            <div className="departments-grid">
              {Object.values(DEPARTMENTS_CONFIG).map(dept => (
                <div key={dept.id} className="department-card" style={{ borderLeftColor: dept.color }}>
                  <div className="dept-header">
                    <div className="dept-icon" style={{ backgroundColor: `${dept.color}20`, color: dept.color }}>
                      <Building2 size={20} />
                    </div>
                    <div className="dept-title">
                      <h4>{dept.name}</h4>
                      <p>{dept.description}</p>
                    </div>
                  </div>
                  <div className="dept-kpis">
                    {Object.entries(dept.kpis || {}).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="kpi-item">
                        <span className="kpi-value">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                        <span className="kpi-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="dept-assistants">
                    <span className="assistants-label"><Bot size={12} /> AI Assistants:</span>
                    <div className="assistants-list">
                      {dept.assistants?.map(a => (
                        <span key={a} className="assistant-tag" style={{ backgroundColor: `${dept.color}20`, color: dept.color }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="services-view">
            <div className="view-header">
              <h3><Workflow size={18} /> Company Services</h3>
              <div className="services-stats">
                <span>{getServiceStats().total} Services</span>
                <span>|</span>
                <span>{getServiceStats().totalMonthlyVolume.toLocaleString()} Monthly Volume</span>
              </div>
            </div>
            <div className="services-categories">
              {Object.entries(COMPANY_SERVICES).map(([category, services]) => (
                <div key={category} className="service-category">
                  <div className="category-header">
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <span className="service-count">{services.length} services</span>
                  </div>
                  <div className="services-grid">
                    {services.slice(0, 4).map(service => (
                      <div key={service.id} className="service-card">
                        <div className="service-header">
                          <span className="service-icon">{service.icon}</span>
                          <div className="service-info">
                            <h5>{service.name}</h5>
                            <p>{service.description?.slice(0, 60)}...</p>
                          </div>
                        </div>
                        <div className="service-meta">
                          <span className="service-stat"><Clock size={12} /> {service.avgDuration}</span>
                          <span className="service-stat"><TrendingUp size={12} /> {service.monthlyVolume}/mo</span>
                        </div>
                        <div className="service-workflow">
                          <span className="workflow-label">Workflow:</span>
                          <div className="workflow-stages">
                            {service.stages?.slice(0, 4).map((stage, idx) => (
                              <span key={stage.id} className="stage-chip">
                                {stage.icon} {stage.name}
                                {idx < Math.min(service.stages.length - 1, 3) && <ChevronRight size={10} />}
                              </span>
                            ))}
                            {service.stages?.length > 4 && <span className="more">+{service.stages.length - 4}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && <AssistantDocsTab assistantId="zoe" />}
      </div>
    </div>
  );
};

export default ZoeExecutiveCRM;
