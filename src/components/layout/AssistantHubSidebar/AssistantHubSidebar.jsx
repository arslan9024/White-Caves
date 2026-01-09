import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search, X, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, GripVertical,
  MessageSquare, Building2, Target, Bot, Users, TrendingUp,
  Home, Wallet, Megaphone, Briefcase, Shield, Server, Palette,
  Database, Scale, Eye, Zap, Activity, Clock, Command,
  Crown, PieChart, Map, Wrench, Building, LineChart
} from 'lucide-react';
import { DEPARTMENTS, getAllAssistants } from '../../../config/assistantRegistry';
import { getAssistantWithFeatures } from '../../../config/assistants';
import { setSidebarSearchQuery, toggleFavoriteAssistant } from '../../../store/appSlice';
import { getAssistantsForRole, canAccessAssistant } from '../../../config/rolePermissions';
import './AssistantHubSidebar.css';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Zap, Activity, Clock, Command, Crown,
  PieChart, Map, Wrench, Building, LineChart
};

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const COLLAPSED_WIDTH = 70;
const DEFAULT_WIDTH = 280;

const AssistantHubSidebar = ({
  onAssistantSelect,
  activeAssistant,
  isMobileOpen = false,
  className = ''
}) => {
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);
  
  const searchQuery = useSelector(state => state.app?.sidebarSearchQuery || '');
  const favoriteAssistants = useSelector(state => state.app?.favoriteAssistants || []);
  const assistantStatuses = useSelector(state => state.app?.assistantStatuses || {});
  const notifications = useSelector(state => state.app?.notifications || {});
  const userRole = useSelector(state => state.user?.role || localStorage.getItem('userRole') || 'owner');

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });

  const [isResizing, setIsResizing] = useState(false);

  const [expandedDepartments, setExpandedDepartments] = useState({
    executive: true,
    communications: true,
    operations: true,
    sales: true,
    finance: false,
    marketing: false,
    compliance: false,
    legal: false,
    technology: false,
    intelligence: false
  });

  const allowedAssistants = useMemo(() => getAssistantsForRole(userRole), [userRole]);

  const allAssistants = useMemo(() => {
    const all = getAllAssistants();
    if (allowedAssistants.length === 0 && userRole === 'owner') {
      return all;
    }
    if (allowedAssistants.length === 0) {
      return [];
    }
    return all.filter(a => allowedAssistants.includes(a.id));
  }, [allowedAssistants, userRole]);

  const filteredAssistants = useMemo(() => {
    if (!searchQuery) return allAssistants;
    const query = searchQuery.toLowerCase();
    return allAssistants.filter(a => 
      a.name.toLowerCase().includes(query) ||
      a.title.toLowerCase().includes(query) ||
      a.department.toLowerCase().includes(query)
    );
  }, [allAssistants, searchQuery]);

  const assistantsByDepartment = useMemo(() => {
    const grouped = {};
    filteredAssistants.forEach(assistant => {
      if (!grouped[assistant.department]) {
        grouped[assistant.department] = [];
      }
      grouped[assistant.department].push(assistant);
    });
    return grouped;
  }, [filteredAssistants]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebarWidth', width);
  }, [width]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleSearchChange = (e) => {
    dispatch(setSidebarSearchQuery(e.target.value));
  };

  const toggleDepartment = (dept) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };

  const handleAssistantClick = (assistant) => {
    const fullAssistant = getAssistantWithFeatures(assistant.id);
    onAssistantSelect(fullAssistant);
  };

  const handleFavoriteToggle = (e, assistantId) => {
    e.stopPropagation();
    dispatch(toggleFavoriteAssistant(assistantId));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getAssistantIcon = (iconName) => {
    return ICON_MAP[iconName] || Building2;
  };

  const getNotificationCount = (assistantId) => {
    const notifs = notifications[assistantId];
    return Array.isArray(notifs) ? notifs.filter(n => !n.isRead).length : 0;
  };

  const departmentOrder = [
    'executive', 'communications', 'operations', 'sales',
    'finance', 'marketing', 'compliance', 'legal', 'technology', 'intelligence'
  ];

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width;

  return (
    <aside 
      ref={sidebarRef}
      className={`assistant-hub-sidebar ${isCollapsed ? 'collapsed' : ''} ${isResizing ? 'resizing' : ''} ${isMobileOpen ? 'open' : ''} ${className}`}
      style={{ width: `${currentWidth}px` }}
    >
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-title">
            <Command size={20} className="title-icon" />
            <span>AI Assistants</span>
          </div>
        )}
        {isCollapsed && (
          <div className="collapsed-icon">
            <Command size={24} />
          </div>
        )}
        <button className="collapse-btn" onClick={toggleCollapse} title={isCollapsed ? 'Expand' : 'Collapse'}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => dispatch(setSidebarSearchQuery(''))}>
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <div className="assistant-list">
        {departmentOrder.map(deptId => {
          const dept = DEPARTMENTS[deptId];
          const assistants = assistantsByDepartment[deptId];
          
          if (!dept || !assistants || assistants.length === 0) return null;

          const isExpanded = expandedDepartments[deptId];
          const DeptIcon = getAssistantIcon(dept.icon);
          const hasActiveAssistant = assistants.some(a => activeAssistant?.id === a.id);

          return (
            <div key={deptId} className={`department-section ${hasActiveAssistant ? 'has-active' : ''}`}>
              <button
                className="department-header"
                onClick={() => !isCollapsed && toggleDepartment(deptId)}
                style={{ '--dept-color': dept.color }}
                title={isCollapsed ? dept.label : ''}
              >
                {isCollapsed ? (
                  <DeptIcon size={20} style={{ color: dept.color }} />
                ) : (
                  <>
                    <div className="dept-indicator" style={{ background: dept.color }} />
                    <span className="dept-name">{dept.label}</span>
                    <span className="dept-count">{assistants.length}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </>
                )}
              </button>

              {isExpanded && !isCollapsed && (
                <div className="assistants-grid">
                  {assistants.map(assistant => {
                    const Icon = getAssistantIcon(assistant.icon);
                    const isActive = activeAssistant?.id === assistant.id;
                    const isFavorite = favoriteAssistants.includes(assistant.id);
                    const status = assistantStatuses[assistant.id] || 'online';
                    const notifCount = getNotificationCount(assistant.id);

                    return (
                      <div
                        key={assistant.id}
                        className={`assistant-card ${isActive ? 'active' : ''}`}
                        onClick={() => handleAssistantClick(assistant)}
                        style={{ '--assistant-color': assistant.color }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleAssistantClick(assistant)}
                      >
                        <div className="card-header">
                          <div className="assistant-icon" style={{ background: `${assistant.color}20` }}>
                            <Icon size={18} style={{ color: assistant.color }} />
                          </div>
                          <button 
                            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                            onClick={(e) => handleFavoriteToggle(e, assistant.id)}
                          >
                            <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        
                        <div className="card-content">
                          <div className="assistant-name-row">
                            <span className="assistant-name">{assistant.name}</span>
                            <span className={`status-dot ${status}`} />
                          </div>
                          <span className="assistant-title">{assistant.title}</span>
                        </div>

                        {notifCount > 0 && (
                          <span className="notification-badge">{notifCount}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {isCollapsed && (
                <div className="collapsed-assistants">
                  {assistants.slice(0, 3).map(assistant => {
                    const Icon = getAssistantIcon(assistant.icon);
                    const isActive = activeAssistant?.id === assistant.id;
                    
                    return (
                      <button
                        key={assistant.id}
                        className={`collapsed-assistant-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleAssistantClick(assistant)}
                        title={assistant.name}
                        style={{ '--assistant-color': assistant.color }}
                      >
                        <Icon size={18} style={{ color: assistant.color }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="footer-stats">
            <span className="stat">
              <span className="stat-value">{allAssistants.length}</span>
              <span className="stat-label">Assistants</span>
            </span>
            <span className="stat">
              <span className="stat-value online">{allAssistants.length}</span>
              <span className="stat-label">Online</span>
            </span>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div 
          ref={resizeHandleRef}
          className="resize-handle"
          onMouseDown={handleMouseDown}
        >
          <GripVertical size={12} />
        </div>
      )}
    </aside>
  );
};

export default AssistantHubSidebar;
