import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronDown, ChevronUp, GripVertical,
  MessageSquare, Building2, Target, Bot, Users, TrendingUp,
  Home, Wallet, Megaphone, Briefcase, Shield, Server, Palette,
  Database, Settings, FileText, BarChart3, Users2, Smartphone,
  CreditCard, Star, Command, Scale, Eye, Search, Zap, Activity, Clock
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  getAllAssistants 
} from '../../../config/assistantRegistry';
import { setSidebarWidth } from '../../../store/navigationSlice';
import './CrimsonSidebar.css';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Users2, Settings, Zap, Activity, Clock, Command
};

const MANAGEMENT_TABS = [
  { id: 'users', label: 'Users', icon: Users2 },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

const INTEGRATION_TABS = [
  { id: 'chatbot', label: 'AI Settings', icon: Bot },
  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
  { id: 'uaepass', label: 'UAE Pass', icon: CreditCard }
];

const SYSTEM_TABS = [
  { id: 'features', label: 'Features', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const AI_ASSISTANTS = getAllAssistants().map(a => ({
  id: a.id,
  name: a.name,
  desc: a.title.replace(' Manager', '').replace(' Engineer', '').replace(' & ', '/'),
  color: a.color,
  department: a.department
}));

const DEPARTMENT_CONFIG = Object.entries(DEPARTMENTS).reduce((acc, [key, dept]) => {
  acc[key] = { 
    label: dept.label, 
    color: dept.color, 
    icon: ICON_MAP[dept.icon] || Building2 
  };
  return acc;
}, {});

const CrimsonSidebar = ({ 
  activeTab, 
  onTabChange, 
  notifications = {},
  user = null
}) => {
  const dispatch = useDispatch();
  const sidebarWidth = useSelector(state => state.navigation?.sidebarWidth || 40);
  
  const [expandedDepartments, setExpandedDepartments] = useState({
    communications: true,
    operations: true,
    sales: true,
    finance: false,
    marketing: false,
    executive: true,
    compliance: false,
    legal: false,
    technology: false,
    intelligence: false
  });

  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const assistantsByDepartment = useMemo(() => {
    const grouped = {};
    AI_ASSISTANTS.forEach(assistant => {
      if (!grouped[assistant.department]) {
        grouped[assistant.department] = [];
      }
      grouped[assistant.department].push(assistant);
    });
    return grouped;
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    const clampedWidth = Math.min(Math.max(newWidth, 25), 50);
    dispatch(setSidebarWidth(clampedWidth));
  }, [isResizing, dispatch]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleDepartment = (dept) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };

  const getNotificationCount = (assistantId) => {
    const assistantNotifs = notifications[assistantId] || [];
    return Array.isArray(assistantNotifs) ? assistantNotifs.filter(n => !n.isRead).length : 0;
  };

  const getTotalAlerts = () => {
    let total = 0;
    Object.values(notifications).forEach(notifs => {
      if (Array.isArray(notifs)) {
        total += notifs.filter(n => !n.isRead).length;
      }
    });
    return total;
  };

  const getAssistantIcon = (assistantId) => {
    const iconMap = {
      linda: MessageSquare,
      nina: Bot,
      mary: Building2,
      nancy: Users,
      daisy: Home,
      sentinel: Eye,
      vesta: Activity,
      juno: Zap,
      clara: Target,
      sophia: TrendingUp,
      hunter: Search,
      kairos: Star,
      theodora: Wallet,
      maven: BarChart3,
      olivia: Megaphone,
      zoe: Command,
      laila: Shield,
      evangeline: Scale,
      aurora: Server,
      hazel: Palette,
      willow: Database,
      henry: Clock,
      cipher: Eye,
      atlas: Building2
    };
    return iconMap[assistantId] || Building2;
  };

  const getUserInitials = () => {
    if (!user) return 'WC';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'WC';
  };

  const renderNavItem = (tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        <Icon size={20} className="nav-icon" />
        <span className="nav-label">{tab.label}</span>
      </button>
    );
  };

  return (
    <aside 
      className={`crimson-sidebar ${isResizing ? 'resizing' : ''}`}
      ref={sidebarRef}
      style={{ width: `${sidebarWidth}%` }}
    >
      <div className="sidebar-content">
        <div className="sidebar-user-section">
          <div className="user-card">
            <div className="user-avatar-large">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <span>{getUserInitials()}</span>
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.displayName || 'Company Owner'}</span>
              <span className="user-email">{user?.email || 'owner@whitecaves.ae'}</span>
            </div>
          </div>
        </div>

        <div 
          className={`zoe-command-hub ${activeTab === 'zoe' ? 'active' : ''}`}
          onClick={() => onTabChange('zoe')}
        >
          <div className="hub-icon">
            <Command size={24} />
          </div>
          <div className="hub-content">
            <div className="hub-header">
              <span className="hub-title">ZOE - EXECUTIVE AI</span>
              <span className="hub-status online">ONLINE</span>
            </div>
            <div className="hub-stats">
              <span className="hub-stat">
                <Activity size={12} />
                {getTotalAlerts()} alerts
              </span>
              <span className="hub-stat">
                <Users size={12} />
                24 assistants
              </span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="section-label">
              <span>AI Assistants</span>
              <span className="section-count">{AI_ASSISTANTS.length}</span>
            </div>
            <div className="departments-list">
              {Object.entries(assistantsByDepartment).map(([dept, assistants]) => {
                const deptConfig = DEPARTMENT_CONFIG[dept];
                if (!deptConfig) return null;
                
                const DeptIcon = deptConfig.icon;
                const isExpanded = expandedDepartments[dept];
                const hasActiveAssistant = assistants.some(a => activeTab === a.id);
                const deptNotifCount = assistants.reduce((sum, a) => sum + getNotificationCount(a.id), 0);

                return (
                  <div key={dept} className={`department-group ${hasActiveAssistant ? 'has-active' : ''}`}>
                    <button
                      className="department-header"
                      onClick={() => toggleDepartment(dept)}
                      style={{ '--dept-color': deptConfig.color }}
                    >
                      <div className="dept-indicator" style={{ background: deptConfig.color }} />
                      <span className="dept-label">{deptConfig.label}</span>
                      <div className="dept-meta">
                        {deptNotifCount > 0 && (
                          <span className="dept-notif">{deptNotifCount}</span>
                        )}
                        <span className="dept-count">{assistants.length}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <ul className="assistant-list">
                        {assistants.map(assistant => {
                          const Icon = getAssistantIcon(assistant.id);
                          const notifCount = getNotificationCount(assistant.id);
                          const isActive = activeTab === assistant.id;
                          
                          return (
                            <li key={assistant.id}>
                              <button
                                className={`assistant-item ${isActive ? 'active' : ''}`}
                                onClick={() => onTabChange(assistant.id)}
                                style={{ '--assistant-color': assistant.color }}
                              >
                                <div className="assistant-status">
                                  <span className="status-dot online" />
                                </div>
                                <div className="assistant-icon">
                                  <Icon size={16} />
                                </div>
                                <div className="assistant-info">
                                  <span className="assistant-name">{assistant.name}</span>
                                  <span className="assistant-desc">{assistant.desc}</span>
                                </div>
                                {notifCount > 0 && (
                                  <span className="assistant-badge">{notifCount}</span>
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
          </div>

          <div className="nav-section">
            <div className="section-label">Management</div>
            <div className="nav-list">
              {MANAGEMENT_TABS.map(tab => renderNavItem(tab))}
            </div>
          </div>

          <div className="nav-section">
            <div className="section-label">Integrations</div>
            <div className="nav-list">
              {INTEGRATION_TABS.map(tab => renderNavItem(tab))}
            </div>
          </div>

          <div className="nav-section">
            <div className="section-label">System</div>
            <div className="nav-list">
              {SYSTEM_TABS.map(tab => renderNavItem(tab))}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-content">
            <span className="version">v2.0.0</span>
            <span className="footer-status">
              <span className="status-indicator online" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <div 
        className="resize-handle"
        onMouseDown={handleMouseDown}
      >
        <GripVertical size={12} />
      </div>
    </aside>
  );
};

export default CrimsonSidebar;
