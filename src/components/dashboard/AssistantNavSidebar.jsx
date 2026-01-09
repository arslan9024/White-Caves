import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronLeft, ChevronRight, MessageSquare, Building2, Target,
  Bot, Users, TrendingUp, Home, Wallet, Megaphone, Briefcase,
  Shield, Server, Palette, Database, LayoutDashboard, Settings,
  FileText, BarChart3, Users2, Smartphone, CreditCard, Star,
  Command, ChevronDown, ChevronUp, Layers, Scale, Eye, Search
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  AI_ASSISTANTS as REGISTRY_ASSISTANTS,
  getAssistantsByDepartment,
  getDepartmentOrder,
  getAllAssistants
} from '../../config/assistantRegistry';
import './AssistantNavSidebar.css';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Users2, Settings
};

const DEPARTMENT_CONFIG = Object.entries(DEPARTMENTS).reduce((acc, [key, dept]) => {
  acc[key] = { 
    label: dept.label, 
    color: dept.color, 
    icon: ICON_MAP[dept.icon] || Building2 
  };
  return acc;
}, {});

const ASSISTANT_ICONS = Object.entries(REGISTRY_ASSISTANTS).reduce((acc, [key, assistant]) => {
  acc[key] = ICON_MAP[assistant.icon] || Building2;
  return acc;
}, {});

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

const AssistantNavSidebar = ({ 
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
    finance: true,
    marketing: true,
    executive: true,
    compliance: true,
    legal: true,
    technology: true
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
    return assistantNotifs.filter(n => !n.isRead).length;
  };

  const isAssistantTab = (tabId) => {
    return AI_ASSISTANTS.some(a => a.id === tabId);
  };

  return (
    <aside className={`assistant-nav-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <span className="logo-letter">W</span>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">White Caves</span>
              <span className="logo-subtitle">AI Command Center</span>
            </div>
          )}
        </div>
        <button className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="section-label">Dashboard</div>}
          <ul className="nav-list">
            {DASHBOARD_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section ai-section">
          {!collapsed && (
            <div className="section-label">
              <span>AI Assistants</span>
              <span className="assistant-count">{AI_ASSISTANTS.length}</span>
            </div>
          )}
          
          <div className="departments-list">
            {Object.entries(assistantsByDepartment).map(([dept, assistants]) => {
              const deptConfig = DEPARTMENT_CONFIG[dept];
              const DeptIcon = deptConfig.icon;
              const isExpanded = expandedDepartments[dept];
              const hasActiveAssistant = assistants.some(a => a.id === activeTab);
              
              return (
                <div key={dept} className={`department-group ${hasActiveAssistant ? 'has-active' : ''}`}>
                  <button
                    className="department-header"
                    onClick={() => !collapsed && toggleDepartment(dept)}
                    style={{ '--dept-color': deptConfig.color }}
                    title={collapsed ? deptConfig.label : undefined}
                  >
                    <div className="dept-indicator" style={{ background: deptConfig.color }} />
                    {!collapsed && (
                      <>
                        <span className="dept-label">{deptConfig.label}</span>
                        <span className="dept-count">{assistants.length}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </>
                    )}
                    {collapsed && <DeptIcon size={18} style={{ color: deptConfig.color }} />}
                  </button>
                  
                  {!collapsed && isExpanded && (
                    <ul className="assistant-list">
                      {assistants.map(assistant => {
                        const Icon = ASSISTANT_ICONS[assistant.id];
                        const notifCount = getNotificationCount(assistant.id);
                        
                        return (
                          <li key={assistant.id}>
                            <button
                              className={`nav-item assistant-item ${activeTab === assistant.id ? 'active' : ''}`}
                              onClick={() => onTabChange(assistant.id)}
                              style={{ '--assistant-color': assistant.color }}
                            >
                              <div className="assistant-icon-wrapper">
                                <Icon size={16} />
                              </div>
                              <div className="assistant-info">
                                <span className="assistant-name">{assistant.name}</span>
                                <span className="assistant-desc">{assistant.desc}</span>
                              </div>
                              {notifCount > 0 && (
                                <span className="notification-badge">{notifCount}</span>
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
          <ul className="nav-list">
            {MANAGEMENT_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">Integrations</div>}
          <ul className="nav-list">
            {INTEGRATION_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">System</div>}
          <ul className="nav-list">
            {SYSTEM_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-info">
            <span className="version">v2.0.0</span>
            <span className="status-dot online" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AssistantNavSidebar;
