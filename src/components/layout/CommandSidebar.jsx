import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Search, Bot, Bell, Activity, Zap,
  MessageSquare, TrendingUp, DollarSign, Briefcase, Shield,
  Database, BarChart3, FileText, Workflow, Settings, Star,
  CheckCircle, AlertTriangle, Clock, Users, LayoutGrid, List,
  Eye, Target, Home, Server, Palette, Scale, Building, Landmark,
  Wallet, Users2, Map
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
  selectUI,
  selectCurrentAssistant,
  selectFavorites,
  toggleFavorite,
  selectAssistant
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

const ASSISTANT_ICONS = {
  mary: FileText,
  theodora: DollarSign,
  olivia: Zap,
  zoe: Briefcase,
  laila: Shield,
  linda: MessageSquare,
  sophia: Users,
  daisy: Home,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  aurora: Server,
  hazel: Palette,
  willow: Database,
  evangeline: Scale,
  sentinel: Eye,
  hunter: Target,
  henry: Shield,
  cipher: BarChart3,
  atlas: Map,
  vesta: Building,
  juno: Building,
  kairos: Landmark,
  maven: Wallet,
  penny: DollarSign,
  quinn: Wallet,
  marcus: Zap,
  stella: Star,
  vera: Shield,
  sage: BarChart3,
  ivy: FileText,
  max: FileText
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
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

const ActivityFeed = ({ activities, allAssistants }) => {
  const recentActivities = activities?.slice(0, 8) || [];
  
  if (recentActivities.length === 0) {
    return (
      <div className="activity-feed empty">
        <Clock size={16} />
        <span>No recent activity</span>
      </div>
    );
  }
  
  const getAssistantName = (assistantId) => {
    const assistant = allAssistants.find(a => a.id === assistantId);
    return assistant?.name || assistantId;
  };

  const getAssistantColor = (assistantId) => {
    const assistant = allAssistants.find(a => a.id === assistantId);
    return assistant?.colorScheme || '#8B5CF6';
  };
  
  return (
    <div className="activity-feed">
      {recentActivities.map((activity, idx) => (
        <div key={activity.id || idx} className="activity-item">
          <div 
            className={`activity-dot ${activity.type || 'info'}`} 
            style={{ backgroundColor: getAssistantColor(activity.assistantId) }}
          />
          <div className="activity-content">
            <span className="activity-assistant">{getAssistantName(activity.assistantId)}</span>
            <span className="activity-text">
              {activity.action || activity.message}
              {activity.target && <span className="activity-target"> - {activity.target}</span>}
            </span>
            <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const CurrentAssistantDisplay = ({ assistant, onClick }) => {
  if (!assistant) return null;
  
  const IconComponent = ASSISTANT_ICONS[assistant.id] || Bot;
  
  return (
    <div className="current-assistant-display" onClick={onClick}>
      <div 
        className="assistant-avatar-display"
        style={{ backgroundColor: assistant.colorScheme }}
      >
        <IconComponent size={16} />
      </div>
      <div className="assistant-display-info">
        <span className="assistant-display-name">{assistant.name}</span>
        <span className="assistant-display-title">{assistant.title}</span>
      </div>
      <ChevronDown size={16} className="dropdown-chevron" />
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
  const currentAssistant = useSelector(selectCurrentAssistant);
  const favorites = useSelector(selectFavorites);

  const [expandedDepartments, setExpandedDepartments] = useState(['executive', 'operations', 'sales']);
  const [activeTab, setActiveTab] = useState('assistants');
  const [showSelector, setShowSelector] = useState(false);

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

  const favoriteAssistants = useMemo(() => {
    return allAssistants.filter(a => favorites.includes(a.id));
  }, [allAssistants, favorites]);

  const toggleDepartment = useCallback((deptId) => {
    setExpandedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(d => d !== deptId)
        : [...prev, deptId]
    );
  }, []);

  const handleAssistantClick = useCallback((assistant) => {
    dispatch(selectAssistant(assistant.id));
    dispatch(setActiveAssistant(assistant.id));
    dispatch(setActiveWorkspace('ai-command'));
    setShowSelector(false);
    navigate('/md/dashboard');
  }, [dispatch, navigate]);

  const handleToggleFavorite = useCallback((e, assistantId) => {
    e.stopPropagation();
    dispatch(toggleFavorite(assistantId));
  }, [dispatch]);

  const getAssistantStatus = useCallback((assistant) => {
    if (!assistant) return 'offline';
    if (assistant.metrics?.systemHealth === 'optimal') return 'active';
    if (assistant.metrics?.systemHealth === 'warning') return 'warning';
    return 'idle';
  }, []);

  const getAssistantIcon = useCallback((assistantId) => {
    return ASSISTANT_ICONS[assistantId] || Bot;
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
          <CurrentAssistantDisplay 
            assistant={currentAssistant} 
            onClick={() => setShowSelector(!showSelector)}
          />
          
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
              className={`section-tab ${activeTab === 'assistants' ? 'active' : ''}`}
              onClick={() => setActiveTab('assistants')}
            >
              <Users size={14} />
              <span>Assistants</span>
            </button>
            <button 
              className={`section-tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <Activity size={14} />
              <span>Activity</span>
            </button>
            <button 
              className={`section-tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <Star size={14} />
              <span>Favorites</span>
            </button>
          </div>
        </>
      )}

      <nav className="command-nav">
        {!isCollapsed && activeTab === 'activity' ? (
          <ActivityFeed activities={recentActivity} allAssistants={allAssistants} />
        ) : !isCollapsed && activeTab === 'favorites' ? (
          <div className="favorites-list">
            {favoriteAssistants.length === 0 ? (
              <div className="empty-favorites">
                <Star size={20} />
                <span>No favorites yet</span>
                <p>Click the star icon on any assistant to add them here</p>
              </div>
            ) : (
              <ul className="assistants-list favorites">
                {favoriteAssistants.map(assistant => {
                  const status = getAssistantStatus(assistant);
                  const unread = unreadCounts[assistant.id] || 0;
                  const isSelected = ui?.selectedAssistant === assistant.id;
                  const IconComponent = getAssistantIcon(assistant.id);
                  
                  return (
                    <li key={assistant.id}>
                      <div
                        className={`assistant-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleAssistantClick(assistant)}
                        style={{ '--assistant-color': assistant.colorScheme }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="assistant-icon-wrapper" style={{ backgroundColor: assistant.colorScheme }}>
                          <IconComponent size={14} />
                        </div>
                        <div className="assistant-info">
                          <span className="assistant-name">{assistant.name}</span>
                          <span className="assistant-role">{assistant.title}</span>
                        </div>
                        <div className="assistant-actions">
                          <button 
                            className="favorite-btn active"
                            onClick={(e) => handleToggleFavorite(e, assistant.id)}
                          >
                            <Star size={12} fill="currentColor" />
                          </button>
                          {unread > 0 && <span className="assistant-badge">{unread}</span>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
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
                        <span className="dept-count">{deptAssistants.length}</span>
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
                        const isFavorite = favorites.includes(assistant.id);
                        const IconComponent = getAssistantIcon(assistant.id);
                        
                        return (
                          <li key={assistant.id}>
                            <div
                              className={`assistant-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleAssistantClick(assistant)}
                              style={{ '--assistant-color': assistant.colorScheme }}
                              role="button"
                              tabIndex={0}
                            >
                              <div className={`status-dot ${status}`} />
                              <div className="assistant-icon-wrapper" style={{ backgroundColor: assistant.colorScheme }}>
                                <IconComponent size={14} />
                              </div>
                              <div className="assistant-info">
                                <span className="assistant-name">{assistant.name}</span>
                                <span className="assistant-role">{assistant.title}</span>
                                {assistant.quickStats?.today && (
                                  <span className="assistant-stat">
                                    {assistant.quickStats.today.value} {assistant.quickStats.today.label}
                                  </span>
                                )}
                              </div>
                              <div className="assistant-actions">
                                <button 
                                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                  onClick={(e) => handleToggleFavorite(e, assistant.id)}
                                >
                                  <Star size={12} fill={isFavorite ? 'currentColor' : 'none'} />
                                </button>
                                {unread > 0 && <span className="assistant-badge">{unread}</span>}
                              </div>
                            </div>
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
          <div className="footer-stats">
            <span className="footer-stat">
              <CheckCircle size={12} />
              {performance?.activeTasks || 47} Tasks
            </span>
            <span className="footer-stat">
              <LayoutGrid size={12} />
              {allAssistants.length} Assistants
            </span>
          </div>
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
