import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Search, Bot, Bell, Activity, Zap,
  MessageSquare, TrendingUp, DollarSign, Briefcase, Shield,
  Database, BarChart3, FileText, Workflow, Settings,
  CheckCircle, AlertTriangle, Clock, Users
} from 'lucide-react';
import {
  selectSidebar,
  selectLayout,
  setSidebarSearch
} from '../../store/slices/navigationUISlice';
import { setActiveWorkspace, setActiveAssistant } from '../../store/slices/dashboardViewSlice';
import {
  selectAllAssistantsArray,
  selectAssistantsByDepartment,
  selectPerformance,
  selectRecentActivity,
  selectGlobalUnreadCount,
  selectAllUnreadCounts,
  selectUI
} from '../../store/slices/aiAssistantDashboardSlice';
import { DEPARTMENTS } from '../../config/navigationMap';
import './CommandSidebar.css';

const DEPARTMENT_ICONS = {
  operations: Workflow,
  sales: TrendingUp,
  communications: MessageSquare,
  finance: DollarSign,
  marketing: Zap,
  executive: Briefcase,
  compliance: Shield,
  technology: Database,
  intelligence: BarChart3,
  legal: FileText
};

const QuickStats = ({ assistants, performance }) => {
  const activeCount = assistants.filter(a => a.metrics?.systemHealth === 'optimal').length;
  const alertCount = performance?.criticalAlerts?.length || 0;
  
  return (
    <div className="command-quick-stats">
      <div className="stat-item">
        <div className="stat-icon active">
          <Bot size={14} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{activeCount}/{assistants.length}</span>
          <span className="stat-label">Active</span>
        </div>
      </div>
      <div className="stat-item">
        <div className="stat-icon health">
          <Activity size={14} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{performance?.overallHealth || 98}%</span>
          <span className="stat-label">Health</span>
        </div>
      </div>
      <div className="stat-item">
        <div className={`stat-icon ${alertCount > 0 ? 'alert' : 'ok'}`}>
          <Bell size={14} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{alertCount}</span>
          <span className="stat-label">Alerts</span>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => {
  const recentActivities = activities?.slice(0, 5) || [];
  
  if (recentActivities.length === 0) {
    return (
      <div className="activity-feed empty">
        <Clock size={16} />
        <span>No recent activity</span>
      </div>
    );
  }
  
  return (
    <div className="activity-feed">
      {recentActivities.map((activity, idx) => (
        <div key={idx} className="activity-item">
          <div className={`activity-dot ${activity.type || 'info'}`} />
          <div className="activity-content">
            <span className="activity-text">{activity.message}</span>
            <span className="activity-time">{activity.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommandSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebar = useSelector(selectSidebar);
  const layout = useSelector(selectLayout);
  const allAssistants = useSelector(selectAllAssistantsArray);
  const assistantsByDepartment = useSelector(selectAssistantsByDepartment);
  const performance = useSelector(selectPerformance);
  const recentActivity = useSelector(selectRecentActivity);
  const globalUnread = useSelector(selectGlobalUnreadCount);
  const unreadCounts = useSelector(selectAllUnreadCounts);
  const ui = useSelector(selectUI);

  const [expandedDepartments, setExpandedDepartments] = useState(['executive', 'operations', 'sales']);
  const [showActivity, setShowActivity] = useState(false);

  const isCollapsed = sidebar.isCollapsed;
  const isMobile = layout.breakpoint === 'mobile';
  const isOpen = isMobile ? layout.isMobileMenuOpen : true;

  const filteredAssistants = useMemo(() => {
    if (!sidebar.searchQuery) return allAssistants;
    const query = sidebar.searchQuery.toLowerCase();
    return allAssistants.filter(a =>
      a.name?.toLowerCase().includes(query) ||
      a.title?.toLowerCase().includes(query) ||
      a.department?.toLowerCase().includes(query)
    );
  }, [sidebar.searchQuery, allAssistants]);

  const filteredByDepartment = useMemo(() => {
    const result = {};
    filteredAssistants.forEach(assistant => {
      const dept = assistant.department || 'other';
      if (!result[dept]) result[dept] = [];
      result[dept].push(assistant);
    });
    return result;
  }, [filteredAssistants]);

  const toggleDepartment = useCallback((deptId) => {
    setExpandedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(d => d !== deptId)
        : [...prev, deptId]
    );
  }, []);

  const handleAssistantClick = useCallback((assistant) => {
    dispatch(setActiveAssistant(assistant.id));
    dispatch(setActiveWorkspace('ai-command'));
    navigate('/md/dashboard');
  }, [dispatch, navigate]);

  const getAssistantStatus = useCallback((assistant) => {
    if (!assistant) return 'offline';
    if (assistant.metrics?.systemHealth === 'optimal') return 'active';
    if (assistant.metrics?.systemHealth === 'warning') return 'warning';
    return 'idle';
  }, []);

  if (!isOpen && isMobile) return null;

  return (
    <aside className={`command-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="command-header">
        <div className="command-title">
          <Bot size={20} />
          {!isCollapsed && <span>AI Command Center</span>}
        </div>
        {!isCollapsed && globalUnread > 0 && (
          <div className="global-notifications">
            <Bell size={14} />
            <span>{globalUnread}</span>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          <QuickStats assistants={allAssistants} performance={performance} />
          
          <div className="command-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search assistants..."
              value={sidebar.searchQuery}
              onChange={(e) => dispatch(setSidebarSearch(e.target.value))}
            />
          </div>

          <div className="section-tabs">
            <button 
              className={`section-tab ${!showActivity ? 'active' : ''}`}
              onClick={() => setShowActivity(false)}
            >
              <Users size={14} />
              <span>Assistants</span>
            </button>
            <button 
              className={`section-tab ${showActivity ? 'active' : ''}`}
              onClick={() => setShowActivity(true)}
            >
              <Activity size={14} />
              <span>Activity</span>
            </button>
          </div>
        </>
      )}

      <nav className="command-nav">
        {!isCollapsed && showActivity ? (
          <ActivityFeed activities={recentActivity} />
        ) : (
          <div className="departments-list">
            {Object.values(DEPARTMENTS).map(dept => {
              const DeptIcon = DEPARTMENT_ICONS[dept.id] || Bot;
              const deptAssistants = filteredByDepartment[dept.id] || [];
              const isExpanded = expandedDepartments.includes(dept.id);
              const deptUnread = deptAssistants.reduce((sum, a) => sum + (unreadCounts[a.id] || 0), 0);
              const isSelectedDept = ui?.selectedAssistant && deptAssistants.some(a => a.id === ui.selectedAssistant);

              if (deptAssistants.length === 0) return null;

              return (
                <div key={dept.id} className="department-group">
                  <button
                    className={`department-header ${isExpanded ? 'expanded' : ''} ${isSelectedDept ? 'has-selected' : ''}`}
                    onClick={() => !isCollapsed && toggleDepartment(dept.id)}
                    style={{ '--dept-color': dept.color }}
                    title={isCollapsed ? dept.name : undefined}
                  >
                    <div className="dept-icon">
                      <DeptIcon size={14} />
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="dept-name">{dept.name}</span>
                        {deptUnread > 0 && (
                          <span className="dept-badge">{deptUnread}</span>
                        )}
                        <ChevronRight size={12} className={`dept-chevron ${isExpanded ? 'rotated' : ''}`} />
                      </>
                    )}
                  </button>

                  {!isCollapsed && isExpanded && (
                    <ul className="assistants-list">
                      {deptAssistants.map(assistant => {
                        const status = getAssistantStatus(assistant);
                        const unread = unreadCounts[assistant.id] || 0;
                        const isSelected = ui?.selectedAssistant === assistant.id;
                        
                        return (
                          <li key={assistant.id}>
                            <button
                              className={`assistant-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleAssistantClick(assistant)}
                              style={{ '--assistant-color': assistant.colorScheme || assistant.color }}
                            >
                              <div className={`status-dot ${status}`} />
                              <div className="assistant-info">
                                <span className="assistant-name">{assistant.name}</span>
                                <span className="assistant-role">{assistant.title || assistant.role}</span>
                              </div>
                              {unread > 0 && (
                                <span className="assistant-badge">{unread}</span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {!isCollapsed && (
        <div className="command-footer">
          <button className="footer-action" title="Settings">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default CommandSidebar;
