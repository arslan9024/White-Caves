import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  MessageSquare, Building2, Target, Bot, Users, TrendingUp,
  Home, Wallet, Megaphone, Briefcase, Shield, Server, Palette,
  Database, LayoutDashboard, Settings, FileText, BarChart3,
  Users2, Smartphone, CreditCard, Star, Command, Layers, Scale,
  Eye, Search, Zap, Activity, Clock
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  getAllAssistants 
} from '../../../config/assistantRegistry';
import './CrimsonSidebar.css';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Users2, Settings, Zap, Activity, Clock,
  LayoutDashboard, Command, Layers
};

const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'ai-command', label: 'AI Command', icon: Command },
  { id: 'ai-hub', label: 'AI Hub', icon: Layers }
];

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
  collapsed = false, 
  onToggleCollapse,
  notifications = {}
}) => {
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

  const renderNavItem = (tab, showLabel = true) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => onTabChange(tab.id)}
        title={collapsed ? tab.label : undefined}
      >
        <Icon size={20} className="nav-icon" />
        {showLabel && !collapsed && <span className="nav-label">{tab.label}</span>}
      </button>
    );
  };

  return (
    <aside className={`crimson-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <span>W</span>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">White Caves</span>
              <span className="logo-tagline">Real Estate</span>
            </div>
          )}
        </div>
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div 
        className={`zoe-command-hub ${activeTab === 'zoe' ? 'active' : ''}`}
        onClick={() => onTabChange('zoe')}
      >
        <div className="hub-icon">
          <Command size={collapsed ? 20 : 24} />
        </div>
        {!collapsed && (
          <div className="hub-content">
            <div className="hub-header">
              <span className="hub-title">AI COMMAND</span>
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
        )}
        {collapsed && getTotalAlerts() > 0 && (
          <span className="collapsed-badge">{getTotalAlerts()}</span>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="section-label">Dashboard</div>}
          <div className="nav-list">
            {DASHBOARD_TABS.map(tab => renderNavItem(tab))}
          </div>
        </div>

        <div className="nav-section">
          {!collapsed && (
            <div className="section-label">
              <span>AI Assistants</span>
              <span className="section-count">{AI_ASSISTANTS.length}</span>
            </div>
          )}
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
                    onClick={() => !collapsed && toggleDepartment(dept)}
                    title={collapsed ? deptConfig.label : undefined}
                    style={{ '--dept-color': deptConfig.color }}
                  >
                    <div className="dept-indicator" style={{ background: deptConfig.color }} />
                    {collapsed ? (
                      <DeptIcon size={18} style={{ color: deptConfig.color }} />
                    ) : (
                      <>
                        <span className="dept-label">{deptConfig.label}</span>
                        <div className="dept-meta">
                          {deptNotifCount > 0 && (
                            <span className="dept-notif">{deptNotifCount}</span>
                          )}
                          <span className="dept-count">{assistants.length}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </>
                    )}
                  </button>
                  
                  {!collapsed && isExpanded && (
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
          {!collapsed && <div className="section-label">Management</div>}
          <div className="nav-list">
            {MANAGEMENT_TABS.map(tab => renderNavItem(tab))}
          </div>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">Integrations</div>}
          <div className="nav-list">
            {INTEGRATION_TABS.map(tab => renderNavItem(tab))}
          </div>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">System</div>}
          <div className="nav-list">
            {SYSTEM_TABS.map(tab => renderNavItem(tab))}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-content">
            <span className="version">v2.0.0</span>
            <span className="footer-status">
              <span className="status-indicator online" />
              All systems operational
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CrimsonSidebar;
